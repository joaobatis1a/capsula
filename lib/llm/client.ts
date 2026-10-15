import "server-only";

/* Cliente do modelo de linguagem. Groq, OpenRouter e Gemini usam o mesmo formato de API (OpenAI).
   Usa a primeira chave configurada; se o provedor recusar (cota, erro), passa para o próximo. */

interface Provedor {
  id: "groq" | "openrouter" | "gemini";
  url: string;
  chave: string | undefined;
  modelo: string;
}

export interface Mensagem {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface RespostaLLM {
  texto: string;
  provedor: string;
  modelo: string;
  /** Avisos de reserva, como "o Groq recusou por cota". */
  avisos: string[];
}

export class SemProvedorError extends Error {}
export class ProvedoresFalharamError extends Error {}

function provedores(): Provedor[] {
  const lista: Provedor[] = [
    {
      id: "groq",
      url: "https://api.groq.com/openai/v1/chat/completions",
      chave: process.env.GROQ_API_KEY,
      modelo: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    },
    {
      id: "openrouter",
      url: "https://openrouter.ai/api/v1/chat/completions",
      chave: process.env.OPENROUTER_API_KEY,
      modelo: process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free",
    },
    {
      id: "gemini",
      url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      chave: process.env.GEMINI_API_KEY,
      modelo: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    },
  ];
  return lista.filter((p) => p.chave);
}

export function temProvedor() {
  return provedores().length > 0;
}

/** Pede uma resposta em JSON. Tenta cada provedor uma vez, com uma nova tentativa em caso de 429. */
export async function completarJSON(mensagens: Mensagem[], opcoes: { temperatura?: number; timeoutMs?: number } = {}): Promise<RespostaLLM> {
  const lista = provedores();
  if (lista.length === 0) throw new SemProvedorError("Nenhuma chave de modelo configurada.");

  const avisos: string[] = [];
  for (const p of lista) {
    for (let tentativa = 0; tentativa < 2; tentativa++) {
      try {
        const res = await fetch(p.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${p.chave}`,
            ...(p.id === "openrouter" ? { "X-Title": "Capsula" } : {}),
          },
          body: JSON.stringify({
            model: p.modelo,
            messages: mensagens,
            temperature: opcoes.temperatura ?? 0.8,
            response_format: { type: "json_object" },
          }),
          signal: AbortSignal.timeout(opcoes.timeoutMs ?? 45_000),
        });

        if (res.status === 429 && tentativa === 0) {
          await new Promise((r) => setTimeout(r, 1500));
          continue;
        }
        if (!res.ok) {
          avisos.push(`${nome(p.id)} respondeu ${res.status}${res.status === 429 ? " (cota)" : ""}.`);
          break;
        }
        const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
        const texto = json.choices?.[0]?.message?.content;
        if (!texto) {
          avisos.push(`${nome(p.id)} devolveu uma resposta vazia.`);
          break;
        }
        if (avisos.length) avisos.push(`Usamos ${nome(p.id)} como reserva.`);
        return { texto, provedor: p.id, modelo: p.modelo, avisos };
      } catch (e) {
        avisos.push(`${nome(p.id)} não respondeu (${e instanceof Error && e.name === "TimeoutError" ? "tempo esgotado" : "erro de rede"}).`);
        break;
      }
    }
  }
  throw new ProvedoresFalharamError(avisos.join(" "));
}

function nome(id: Provedor["id"]) {
  return { groq: "O Groq", openrouter: "O OpenRouter", gemini: "O Gemini" }[id];
}

/** Extrai o primeiro objeto JSON de um texto (alguns modelos cercam o JSON com crases). */
export function lerJSON(texto: string): unknown {
  const inicio = texto.indexOf("{");
  const fim = texto.lastIndexOf("}");
  if (inicio < 0 || fim <= inicio) throw new Error("Resposta sem JSON.");
  return JSON.parse(texto.slice(inicio, fim + 1));
}
