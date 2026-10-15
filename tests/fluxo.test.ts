import { describe, expect, it } from "vitest";
import exemplo from "@/mocks/variacoes.json";
import { acoesPara, transicionar } from "@/lib/governanca/fluxo";
import { briefingSchema } from "@/types/briefing";
import { variacaoSchema } from "@/types/variacao";

const briefing = briefingSchema.parse(exemplo.briefing);
const peca = variacaoSchema.parse(exemplo.variacoes[0]);

describe("fluxo de aprovação", () => {
  it("segue Rascunho → Em revisão → Aprovado → Publicado, com responsável e data", () => {
    const r1 = transicionar(peca, briefing, { acao: "enviar", por: "João" });
    expect(r1.ok && r1.peca.status).toBe("revisao");
    if (!r1.ok) return;
    const r2 = transicionar(r1.peca, briefing, { acao: "aprovar", por: "João" }, new Date("2026-10-16T12:00:00Z"));
    expect(r2.ok && r2.peca.status).toBe("aprovado");
    if (!r2.ok) return;
    expect(r2.registro).toMatchObject({ de: "revisao", para: "aprovado", por: "João", em: "2026-10-16T12:00:00.000Z" });
    const r3 = transicionar(r2.peca, briefing, { acao: "publicar", por: "João" });
    expect(r3.ok && r3.peca.status).toBe("publicado");
  });

  it("não aprova direto do rascunho", () => {
    const r = transicionar(peca, briefing, { acao: "aprovar", por: "João" });
    expect(r.ok).toBe(false);
  });

  it("exige nome de quem muda e motivo para devolver", () => {
    expect(transicionar(peca, briefing, { acao: "enviar", por: " " }).ok).toBe(false);
    const emRevisao = { ...peca, status: "revisao" as const };
    expect(transicionar(emRevisao, briefing, { acao: "devolver", por: "João" }).ok).toBe(false);
    expect(transicionar(emRevisao, briefing, { acao: "devolver", por: "João", motivo: "Ajustar o CTA" }).ok).toBe(true);
  });

  it("peça bloqueada não avança, mesmo que a tela diga que está em revisão", () => {
    const fraudada = { ...peca, texto: "Cura garantida em 7 dias.", status: "revisao" as const };
    const r = transicionar(fraudada, briefing, { acao: "aprovar", por: "João" });
    expect(r.ok).toBe(false);
    expect(acoesPara("bloqueado")).toEqual([]);
  });
});
