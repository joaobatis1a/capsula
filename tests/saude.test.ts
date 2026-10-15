import { describe, expect, it } from "vitest";
import { MockDataSource } from "@/lib/data/mock";
import { normalizar } from "@/lib/governanca/checklist";
import { AGENTES, CATEGORIAS_SAUDE, REGIOES } from "@/lib/data/types";
import { PUBLICOS } from "@/lib/data/mock/publicos";

const fonte = new MockDataSource();

describe("base de sazonalidade de saúde", () => {
  it("tem uma base ampla, com ids únicos", async () => {
    const base = await fonte.getSaudeDoAno();
    expect(base.length).toBeGreaterThanOrEqual(30);
    expect(new Set(base.map((s) => s.id)).size).toBe(base.length);
    expect(new Set(base.map((s) => s.categoriaSaude)).size).toBeGreaterThanOrEqual(7);
  });

  it("cada condição tem 12 meses de 0 a 3 e meses de pico coerentes", async () => {
    for (const s of await fonte.getSaudeDoAno()) {
      expect(s.intensidade).toHaveLength(12);
      expect(s.intensidade.every((v) => v >= 0 && v <= 3)).toBe(true);
      expect(s.intensidade.some((v) => v >= 2), `${s.id} sem mês de pico`).toBe(true);
      expect(s.mesesPico.length).toBeGreaterThan(0);
      for (const m of s.mesesPico) expect(s.intensidade[m - 1]).toBe(Math.max(...s.intensidade));
      for (const [r, meses] of Object.entries(s.porRegiao ?? {})) {
        expect(REGIOES).toContain(r);
        expect(meses).toHaveLength(12);
      }
    }
  });

  it("toda condição traz conteúdo completo e fonte", async () => {
    const publicos = new Set(PUBLICOS.map((p) => p.nome));
    for (const s of await fonte.getSaudeDoAno()) {
      expect(CATEGORIAS_SAUDE).toContain(s.categoriaSaude);
      expect(AGENTES).toContain(s.agente);
      for (const campo of [s.gruposRisco, s.sintomas, s.prevencao, s.categorias, s.produtosExemplo, s.tiposProduto, s.publicos, s.fontes]) {
        expect(campo.length, s.id).toBeGreaterThan(0);
      }
      for (const p of s.publicos) expect(publicos.has(p), `${s.id}: público desconhecido "${p}"`).toBe(true);
      expect(s.fonteUrl).toMatch(/^https:\/\//);
      expect(s.cuidado.length).toBeGreaterThan(20);
    }
  });

  it("o texto não promete cura nem diagnostica", async () => {
    const proibidos = ["cura", "curar", "milagre", "garantido", "100% eficaz", "infalivel"];
    for (const s of await fonte.getSaudeDoAno()) {
      const texto = normalizar([s.resumo, s.angulo, ...s.prevencao].join(" "));
      for (const termo of proibidos) expect(new RegExp(`(^|[^a-z])${termo}([^a-z]|$)`).test(texto), `${s.id} usa "${termo}"`).toBe(false);
    }
  });

  it("a janela de três meses devolve o que pede atenção agora", async () => {
    const dezembro = await fonte.getSazonalidade(12);
    expect(dezembro.some((s) => s.id === "saz-verao-sol")).toBe(true);
    expect(dezembro.some((s) => s.id === "saz-dengue")).toBe(true);
    const junho = await fonte.getSazonalidade(6);
    expect(junho.some((s) => s.id === "saz-gripe-centro-sul")).toBe(true);
  });

  it("o calendário de campanhas cobre os meses com fonte", async () => {
    const datas = await fonte.getDatasSaude();
    expect(new Set(datas.map((d) => d.mes)).size).toBe(12);
    for (const d of datas) expect(d.fonte.url).toMatch(/^https:\/\//);
  });
});
