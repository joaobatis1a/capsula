import { describe, expect, it } from "vitest";
import type { CampaignDataSource } from "@/lib/data/types";

/* Suíte do adaptador. Toda nova fonte (csv, api) deve passar por ela também. */

export function suiteDoAdaptador(nome: string, criar: () => CampaignDataSource) {
  describe(`CampaignDataSource: ${nome}`, () => {
    const fonte = criar();

    it("devolve o histórico com métricas coerentes", async () => {
      const campanhas = await fonte.getCampanhas();
      expect(campanhas.length).toBeGreaterThan(0);
      for (const c of campanhas) {
        expect(c.cliques).toBeLessThanOrEqual(c.impressoes);
        expect(c.conversoes).toBeLessThanOrEqual(c.cliques);
        expect(c.data).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });

    it("filtra por canal", async () => {
      const tiktok = await fonte.getCampanhas({ canal: "tiktok" });
      expect(tiktok.every((c) => c.canal === "tiktok")).toBe(true);
    });

    it("só devolve itens do radar válidos na data", async () => {
      const data = "2026-10-15";
      const radar = await fonte.getRadar(data);
      expect(radar.length).toBeGreaterThan(0);
      for (const i of radar) {
        expect(i.validade >= data).toBe(true);
        expect(i.fonte.length).toBeGreaterThan(2);
      }
      expect((await fonte.getRadar("2030-01-01")).length).toBe(0);
    });

    it("devolve a sazonalidade do mês e do seguinte", async () => {
      const junho = await fonte.getSazonalidade(6);
      expect(junho.some((s) => s.condicao.startsWith("Gripe"))).toBe(true);
      const dezembro = await fonte.getSazonalidade(12);
      expect(dezembro.some((s) => s.id === "saz-verao-sol")).toBe(true);
      for (const s of [...junho, ...dezembro]) expect(s.fonteUrl).toMatch(/^https:\/\//);
    });

    it("tem públicos sugeridos", async () => {
      expect((await fonte.getPublicos()).length).toBeGreaterThanOrEqual(4);
    });
  });
}
