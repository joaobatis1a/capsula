import { describe, expect, it } from "vitest";
import exemplo from "@/mocks/variacoes.json";
import { validarBriefing, type BriefingEntrada } from "@/types/briefing";
import { roteiroSchema, variacaoSchema } from "@/types/variacao";

const valido: BriefingEntrada = {
  produto: "Protetor solar FPS 50",
  categoria: "Protetor solar",
  tipoProduto: "dermocosmetico",
  oferta: { descricao: "30% off", precoDe: 79.9, precoPor: 55.9, validade: "2026-11-15" },
  publicos: ["Jovens de 18 a 24", "Pessoas com 60 anos ou mais"],
  canais: ["instagram"],
  formatos: ["feed", "story"],
  objetivo: "conversao",
};

describe("contrato do briefing", () => {
  it("aceita um briefing completo e aplica os padrões", () => {
    const r = validarBriefing(valido);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.briefing.variacoesPorCanal).toBe(3);
      expect(r.briefing.publicos).toHaveLength(2);
    }
  });

  it("devolve o erro no campo certo", () => {
    const r = validarBriefing({ ...valido, publicos: [], oferta: { ...valido.oferta, validade: "15/11" } });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.erros.publicos).toBe("Escolha pelo menos um público.");
      expect(r.erros["oferta.validade"]).toBeDefined();
    }
  });

  it("recusa preço promocional maior que o normal", () => {
    const r = validarBriefing({ ...valido, oferta: { ...valido.oferta, precoPor: 99 } });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.erros["oferta.precoPor"]).toBeDefined();
  });

  it("limita a 4 públicos", () => {
    const r = validarBriefing({ ...valido, publicos: ["a1", "b2", "c3", "d4", "e5"] });
    expect(r.ok).toBe(false);
  });
});

describe("contrato de saída do motor", () => {
  it("o JSON de exemplo segue o contrato", () => {
    expect(validarBriefing(exemplo.briefing).ok).toBe(true);
    for (const v of exemplo.variacoes) expect(variacaoSchema.safeParse(v).success).toBe(true);
    for (const r of exemplo.roteiros) expect(roteiroSchema.safeParse(r).success).toBe(true);
  });

  it("toda evidência tem origem e fonte", () => {
    for (const v of exemplo.variacoes) {
      for (const e of v.bula.evidencias) expect(e.fonte.length).toBeGreaterThan(2);
    }
  });

  it("o roteiro começa com um gancho de até 3s e a música sugerida é liberada para uso comercial", () => {
    for (const r of exemplo.roteiros) {
      expect(r.cenas[0].inicio).toBe(0);
      expect(r.cenas[0].fim).toBeLessThanOrEqual(3);
      expect(r.cenas.at(-1)!.fim).toBe(r.duracaoSeg);
      if (r.musica) expect(r.musica.usoComercial).toBe(true);
    }
  });
});
