import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { completarJSON, lerJSON } from "@/lib/llm/client";

vi.mock("server-only", () => ({}));

/* O Gemini devolve 503 por modelo. O cliente tem de passar para o modelo de reserva em vez de desistir. */

const resposta = (status: number, texto = "{}") => new Response(JSON.stringify({ choices: [{ message: { content: texto } }] }), { status });

beforeEach(() => {
  vi.stubEnv("GEMINI_API_KEY", "chave-de-teste");
  vi.stubEnv("GROQ_API_KEY", "");
  vi.stubEnv("OPENROUTER_API_KEY", "");
  vi.stubEnv("GEMINI_MODEL", "");
  vi.stubEnv("GEMINI_FALLBACK_MODELS", "");
  vi.useFakeTimers();
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

function pedir() {
  const p = completarJSON([{ role: "user", content: "oi" }]);
  void vi.runAllTimersAsync();
  return p;
}

describe("cliente do modelo", () => {
  it("troca de modelo quando o principal responde 503 duas vezes", async () => {
    const usados: string[] = [];
    vi.stubGlobal("fetch", async (_url: string, init: { body: string }) => {
      const modelo = JSON.parse(init.body).model as string;
      usados.push(modelo);
      return modelo === "gemini-3.5-flash-lite" ? resposta(503) : resposta(200, '{"ok":true}');
    });
    const r = await pedir();
    expect(usados).toEqual(["gemini-3.5-flash-lite", "gemini-3.5-flash-lite", "gemini-3.5-flash"]);
    expect(r.modelo).toBe("gemini-3.5-flash");
    expect(r.avisos.join(" ")).toMatch(/gemini-3\.5-flash-lite\) respondeu 503/);
    expect(r.avisos.join(" ")).toMatch(/Usamos o Gemini \(gemini-3\.5-flash\) como reserva/);
  });

  it("não troca de modelo quando o principal responde", async () => {
    const usados: string[] = [];
    vi.stubGlobal("fetch", async (_url: string, init: { body: string }) => {
      usados.push(JSON.parse(init.body).model);
      return resposta(200, '{"ok":true}');
    });
    const r = await pedir();
    expect(usados).toEqual(["gemini-3.5-flash-lite"]);
    expect(r.avisos).toEqual([]);
  });

  it("falha com a lista dos avisos quando todos os modelos recusam", async () => {
    vi.stubGlobal("fetch", async () => resposta(503));
    await expect(pedir()).rejects.toThrow(/gemini-3\.1-flash-lite/);
  });

  it("respeita GEMINI_FALLBACK_MODELS", async () => {
    vi.stubEnv("GEMINI_FALLBACK_MODELS", "modelo-x");
    const usados: string[] = [];
    vi.stubGlobal("fetch", async (_url: string, init: { body: string }) => {
      usados.push(JSON.parse(init.body).model);
      return resposta(503);
    });
    await expect(pedir()).rejects.toThrow();
    expect([...new Set(usados)]).toEqual(["gemini-3.5-flash-lite", "modelo-x"]);
  });

  it("para de tentar quando o tempo total passa de 45s, para a função da Vercel não morrer", async () => {
    let chamadas = 0;
    vi.stubGlobal("fetch", async () => {
      chamadas++;
      vi.setSystemTime(Date.now() + 50_000);
      return resposta(503);
    });
    await expect(pedir()).rejects.toThrow(/O tempo para gerar com o modelo acabou/);
    expect(chamadas).toBe(1);
  });
});

describe("prazo único da geração", () => {
  it("uma segunda chamada com o mesmo prazo não começa quando o tempo já passou", async () => {
    let chamadas = 0;
    vi.stubGlobal("fetch", async () => {
      chamadas++;
      vi.setSystemTime(Date.now() + 47_000);
      return resposta(200, '{"ok":true}');
    });
    const prazo = Date.now() + 54_000;
    await completarJSON([{ role: "user", content: "oi" }], { prazo });
    await expect(completarJSON([{ role: "user", content: "oi" }], { prazo })).rejects.toThrow(/O tempo para gerar com o modelo acabou/);
    expect(chamadas).toBe(1);
  });
});

describe("lerJSON", () => {
  it("ignora texto depois do objeto, mesmo com outra chave", () => {
    expect(lerJSON('{"a":1}'+"\n"+'Observação {extra}')).toEqual({ a: 1 });
  });
  it("não se confunde com chaves dentro de textos", () => {
    expect(lerJSON("```json"+"\n"+'{"t":"abre { e fecha }"}'+"\n"+"```")).toEqual({ t: "abre { e fecha }" });
  });
  it("falha quando não há objeto", () => {
    expect(() => lerJSON("sem json")).toThrow();
  });
});
