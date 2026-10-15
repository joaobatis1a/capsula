import { describe, expect, it } from "vitest";
import { briefingsDeExemplo, comparar, interpretarEventos, interpretarPremissas, PREMISSAS_PADRAO, resumir, type Evento } from "@/lib/ganho/metricas";
import { validarBriefing } from "@/types/briefing";

const g = (extra: Partial<Extract<Evento, { tipo: "geracao" }>> = {}): Evento => ({
  tipo: "geracao",
  em: "2026-10-15T12:00:00Z",
  briefingMs: 60_000,
  geracaoMs: 2_000,
  variacoes: 12,
  bloqueadas: 1,
  roteiros: 2,
  publicos: 2,
  canais: 2,
  modelo: "sem-ia",
  doCache: false,
  ...extra,
});

describe("painel de ganho", () => {
  it("sem medição, não há resumo nem comparação", () => {
    const r = resumir([]);
    expect(r.geracoes).toBe(0);
    expect(r.variacoesPorBriefing).toBeNull();
    expect(comparar(r, PREMISSAS_PADRAO)).toBeNull();
  });

  it("resume tempo, variações e peças barradas", () => {
    const r = resumir([g(), g({ variacoes: 6, bloqueadas: 2, geracaoMs: 4_000 }), { tipo: "aprovacao", em: "x", aposMs: 30_000 }, { tipo: "aprovacao", em: "x", aposMs: 90_000 }]);
    expect(r.geracoes).toBe(2);
    expect(r.variacoes).toBe(18);
    expect(r.bloqueadas).toBe(3);
    expect(r.taxaBloqueio).toBeCloseTo(3 / 18);
    expect(r.geracaoMs).toBe(3_000);
    expect(r.variacoesPorBriefing).toBe(9);
    expect(r.primeiraAprovacaoMs).toBe(60_000);
  });

  it("resposta do cache não entra na média de tempo do motor", () => {
    const r = resumir([g({ geracaoMs: 3_000 }), g({ geracaoMs: 5, doCache: true })]);
    expect(r.geracaoMs).toBe(3_000);
    expect(r.doCache).toBe(1);
  });

  it("conta as gerações que usaram os moldes fixos", () => {
    expect(resumir([g(), g({ modelo: "groq:llama-3.3-70b-versatile" })]).semIA).toBe(1);
  });

  it("o tempo de preenchimento só conta quando alguém digitou", () => {
    expect(resumir([g({ briefingMs: null }), g({ briefingMs: 120_000 })]).briefingMs).toBe(120_000);
    expect(resumir([g({ briefingMs: null })]).briefingMs).toBeNull();
  });

  it("compara com a premissa declarada", () => {
    const c = comparar(resumir([g({ geracaoMs: 6_000, variacoes: 12 })]), PREMISSAS_PADRAO)!;
    expect(c.pecasPorBriefingHoje).toBe(3);
    expect(c.variacoesPorBriefing).toBe(12);
    expect(c.multiplicadorDePecas).toBe(4);
    expect(c.minutosPorPecaHoje).toBe(40);
    expect(c.minutosPorPecaCapsula).toBeCloseTo(3 + 6 / 12 / 60, 3);
    expect(c.reducaoPorPeca).toBeGreaterThan(0.9);
    expect(c.minutosPorBriefingHoje).toBe(120);
  });

  it("premissas inválidas voltam ao padrão", () => {
    expect(interpretarPremissas("lixo")).toEqual(PREMISSAS_PADRAO);
    expect(interpretarPremissas(JSON.stringify({ minutosPorPecaHoje: -5, pecasPorBriefingHoje: 4 }))).toMatchObject({ minutosPorPecaHoje: 40, pecasPorBriefingHoje: 4 });
    expect(interpretarEventos("não é json")).toEqual([]);
  });

  it("os briefings de exemplo seguem o contrato do briefing", () => {
    for (const b of briefingsDeExemplo("2026-11-30")) expect(validarBriefing(b).ok, JSON.stringify(b.produto)).toBe(true);
  });
});
