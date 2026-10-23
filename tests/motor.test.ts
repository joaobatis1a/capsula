import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { MockDataSource } = await import("@/lib/data/mock");
const { gerar } = await import("@/lib/motor/gerar");
const { chaveDoBriefing, gravarCache, lerCache } = await import("@/lib/motor/cache");
const { briefingSchema } = await import("@/types/briefing");
const { roteiroSchema, variacaoSchema } = await import("@/types/variacao");

const briefing = briefingSchema.parse({
  produto: "Antigripal em cápsulas",
  categoria: "Antigripais",
  tipoProduto: "medicamento_isento",
  oferta: { descricao: "20% off no antigripal", precoDe: 30, precoPor: 24, validade: "2026-11-30" },
  publicos: ["Adultos de 25 a 34", "Pessoas com 60 anos ou mais"],
  canais: ["instagram", "site"],
  formatos: ["feed", "story", "banner"],
  objetivo: "conversao",
  incluirRoteiros: true,
});

describe("motor sem chave de modelo", () => {
  it("gera variações válidas para cada público e canal, com aviso", async () => {
    delete process.env.GROQ_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.GEMINI_API_KEY;
    const r = await gerar(briefing, new MockDataSource());

    expect(r.modelo).toBe("sem-ia");
    expect(r.avisos.join(" ")).toContain("sem IA");
    expect(r.variacoes).toHaveLength(2 * 2 * 3);
    for (const v of r.variacoes) {
      expect(variacaoSchema.safeParse(v).success).toBe(true);
      expect(v.advertencia).toContain("SE PERSISTIREM OS SINTOMAS");
      expect(v.bula.contraindicacoes.length).toBeGreaterThan(0);
      expect(v.status).toBe("rascunho");
      if (v.canal === "site") expect(v.formato).toBe("banner");
    }
    expect(new Set(r.variacoes.map((v) => v.publico)).size).toBe(2);
    expect(r.roteiros).toHaveLength(6);
    for (const rot of r.roteiros) {
      expect(roteiroSchema.safeParse(rot).success).toBe(true);
      expect(rot.musica?.usoComercial).toBe(true);
    }
  });
});

describe("cache", () => {
  it("o mesmo briefing com públicos em outra ordem tem a mesma chave", () => {
    const outro = { ...briefing, publicos: [...briefing.publicos].reverse() };
    expect(chaveDoBriefing(outro)).toBe(chaveDoBriefing(briefing));
    expect(chaveDoBriefing({ ...briefing, oferta: { ...briefing.oferta, validade: "2026-12-01" } })).not.toBe(chaveDoBriefing(briefing));
  });
});

describe("cache da geração", () => {
  it("não guarda resposta em que algum público caiu nos moldes fixos", async () => {
    const b = briefingSchema.parse({ ...briefing, produto: "Produto do teste de cache" });
    const base = { briefing: b, variacoes: [], roteiros: [], geradoEm: "2026-10-22T00:00:00Z", modelo: "gemini:gemini-3.5-flash-lite", doCache: false };
    const k1 = chaveDoBriefing(b);
    gravarCache(k1, { ...base, avisos: ['O modelo falhou para "Jovens". Usamos os moldes fixos.'] });
    expect(lerCache(k1)).toBeUndefined();
    const k2 = chaveDoBriefing({ ...b, produto: "Outro produto do teste de cache" });
    gravarCache(k2, { ...base, avisos: [] });
    expect(lerCache(k2)).toBeDefined();
  });
});

describe("modelo que devolve JSON malformado", () => {
  it("tenta de novo antes de cair nos moldes fixos", async () => {
    vi.resetModules();
    const respostas = ['{"variacoes": [ {titulo: sem aspas} ', JSON.stringify({ variacoes: [] })];
    vi.doMock("@/lib/llm/client", async () => {
      const real = await vi.importActual<typeof import("@/lib/llm/client")>("@/lib/llm/client");
      return { ...real, temProvedor: () => true, completarJSON: vi.fn(async () => ({ texto: respostas.shift()!, provedor: "gemini", modelo: "teste", avisos: [] })) };
    });
    const { gerar: gerarComModelo } = await import("@/lib/motor/gerar");
    const { MockDataSource: Fonte } = await import("@/lib/data/mock");
    const um = briefingSchema.parse({ ...briefing, publicos: [briefing.publicos[0]], incluirRoteiros: false });
    const r = await gerarComModelo(um, new Fonte());
    expect(r.avisos.join(" ")).not.toMatch(/moldes fixos/);
    expect(r.modelo).toBe("gemini:teste");
    vi.doUnmock("@/lib/llm/client");
  });
});
