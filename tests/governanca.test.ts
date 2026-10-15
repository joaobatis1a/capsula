import { describe, expect, it } from "vitest";
import exemplo from "@/mocks/variacoes.json";
import { ADVERTENCIA_MIP, aplicarGovernanca, checarPeca } from "@/lib/governanca/checklist";
import { briefingSchema } from "@/types/briefing";
import { variacaoSchema } from "@/types/variacao";

const briefing = briefingSchema.parse(exemplo.briefing);
const base = variacaoSchema.parse(exemplo.variacoes[0]);

function falhas(texto: string, extra: Partial<typeof base> = {}, b = briefing) {
  return checarPeca({ ...base, texto, ...extra }, b)
    .filter((c) => !c.ok)
    .map((c) => c.regra);
}

describe("governança", () => {
  it("as peças de exemplo passam", () => {
    for (const v of exemplo.variacoes) {
      const peca = aplicarGovernanca(variacaoSchema.parse(v), briefing);
      expect(peca.bula.contraindicacoes.filter((c) => !c.ok)).toEqual([]);
      expect(peca.status).toBe("rascunho");
    }
  });

  it("bloqueia promessa de cura com o motivo", () => {
    const peca = aplicarGovernanca({ ...base, texto: "O protetor que cura manchas em 7 dias." }, briefing);
    expect(peca.status).toBe("bloqueado");
    const motivos = peca.bula.contraindicacoes.filter((c) => !c.ok).map((c) => c.texto);
    expect(motivos).toContain('Usa o termo proibido "cura"');
    expect(motivos).toContain("Promete resultado ou prazo de efeito");
  });

  it("não confunde palavras parecidas", () => {
    expect(falhas("Cuidado diário com curadoria do farmacêutico. Válido até 15/11.")).toEqual([]);
  });

  it("exige validade quando fala de desconto", () => {
    expect(falhas("FPS 50 com 30% off.", { bula: { ...base.bula, posologia: "Publicar terça." } })).toContain("oferta-validade");
    expect(falhas("FPS 50 com 30% off até 15/11.")).toEqual([]);
  });

  it("bloqueia medicamento com prescrição", () => {
    const b = { ...briefing, tipoProduto: "medicamento_prescricao" as const };
    expect(falhas("Texto neutro.", {}, b)).toContain("prescricao");
  });

  it("exige a advertência em medicamento isento de prescrição", () => {
    const b = { ...briefing, tipoProduto: "medicamento_isento" as const };
    expect(falhas("Alívio para a congestão nasal.", {}, b)).toContain("advertencia-mip");
    expect(falhas("Alívio para a congestão nasal.", { advertencia: ADVERTENCIA_MIP }, b)).toEqual([]);
  });

  it("bloqueia diagnóstico e superlativo absoluto", () => {
    expect(falhas("Você está com gripe? Leve o melhor antigripal.")).toEqual(expect.arrayContaining(["diagnostico", "superlativo"]));
  });
});
