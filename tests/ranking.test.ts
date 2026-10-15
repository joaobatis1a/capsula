import { describe, expect, it } from "vitest";
import { gerarCampanhas } from "@/lib/data/mock/campanhas";
import { rankear, relevantesPara } from "@/lib/memoria/ranking";

describe("ranking da memória", () => {
  const ranking = rankear(gerarCampanhas());

  it("devolve as 5 melhores e as 5 piores combinações", () => {
    expect(ranking.melhores).toHaveLength(5);
    expect(ranking.piores).toHaveLength(5);
    expect(ranking.melhores[0].lift).toBeGreaterThan(1);
    expect(ranking.piores[0].lift).toBeLessThan(1);
  });

  it("encontra os padrões plantados no histórico sintético", () => {
    const melhores = ranking.melhores.map((i) => i.combinacao);
    expect(melhores).toContainEqual({ gancho: "pergunta", formato: "video" });
    const piores = ranking.piores.map((i) => i.combinacao);
    expect(piores).toContainEqual({ gancho: "urgencia", publico: "Pessoas com 60 anos ou mais" });
  });

  it("escreve o texto da Bula com número, contagem e fonte", () => {
    const i = ranking.melhores[0];
    expect(i.texto).toMatch(/^(CTR|Conversão) \d+,\d× a média · \d+ campanhas$/);
    expect(i.fonte).toContain("nos dados de teste");
  });

  it("ignora combinações com poucas campanhas", () => {
    expect(rankear(gerarCampanhas(20)).melhores).toHaveLength(0);
  });

  it("filtra o que não vale para os públicos e canais do briefing", () => {
    const r = relevantesPara(ranking.piores, { publicos: ["Jovens de 18 a 24"], canais: ["instagram"] });
    expect(r.every((i) => !i.combinacao.publico || i.combinacao.publico === "Jovens de 18 a 24")).toBe(true);
  });
});
