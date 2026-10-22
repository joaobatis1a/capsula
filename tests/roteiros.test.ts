import { describe, expect, it, vi, beforeEach } from "vitest";
import { MockDataSource } from "@/lib/data/mock";
import { gerar } from "@/lib/motor/gerar";
import { briefingSchema } from "@/types/briefing";
import { roteiroSchema, variacaoSchema } from "@/types/variacao";
import { checarPeca, checarRoteiro } from "@/lib/governanca/checklist";

vi.mock("server-only", () => ({}));

// Briefing com apenas instagram para gerar Reels (não TikTok)
const briefingReels = briefingSchema.parse({
  produto: "Protetor Solar FPS 50",
  categoria: "Protetores Solares",
  tipoProduto: "dermocosmetico",
  oferta: { descricao: "20% off no protetor solar", precoDe: 50, precoPor: 40, validade: "2026-12-31" },
  publicos: ["Mulheres 25-35", "Homens 30-40"],
  canais: ["instagram"],
  formatos: ["feed", "story"],
  objetivo: "conversao",
  incluirRoteiros: true,
});

// Briefing com tiktok para testar TikTok
const briefingTiktok = briefingSchema.parse({
  produto: "Protetor Solar FPS 50",
  categoria: "Protetores Solares",
  tipoProduto: "dermocosmetico",
  oferta: { descricao: "20% off no protetor solar", precoDe: 50, precoPor: 40, validade: "2026-12-31" },
  publicos: ["Mulheres 25-35", "Homens 30-40"],
  canais: ["tiktok"],
  formatos: ["feed", "story"],
  objetivo: "conversao",
  incluirRoteiros: true,
});

describe("roteiros - motor sem chave de modelo", () => {
  beforeEach(() => {
    delete process.env.GROQ_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.GEMINI_API_KEY;
  });

  it("gera roteiros para Reels, TikTok e Comercial (15s e 30s) para cada público", async () => {
    // Testa com Reels (instagram only)
    const r1 = await gerar(briefingReels, new MockDataSource());
    expect(r1.modelo).toBe("sem-ia");
    expect(r1.roteiros).toHaveLength(6); // 2 públicos × 3 roteiros
    for (const rot of r1.roteiros) {
      expect(roteiroSchema.safeParse(rot).success).toBe(true);
    }
    // Deve ter Reels (não TikTok)
    const reels = r1.roteiros.filter((rot) => rot.plataforma === "reels");
    expect(reels.length).toBe(2);

    // Testa com TikTok
    const r2 = await gerar(briefingTiktok, new MockDataSource());
    const tiktoks = r2.roteiros.filter((rot) => rot.plataforma === "tiktok");
    expect(tiktoks.length).toBe(2);
  });

  it("gera roteiros Reels 15s com estrutura correta", async () => {
    const r = await gerar(briefingReels, new MockDataSource());
    const reels = r.roteiros.filter((rot) => rot.plataforma === "reels");

    expect(reels.length).toBe(2);
    for (const rot of reels) {
      expect(rot.plataforma).toBe("reels");
      expect(rot.duracaoSeg).toBe(15);
      expect(rot.cenas.length).toBeGreaterThanOrEqual(2);
      expect(rot.cenas[0].inicio).toBe(0);
      expect(rot.cenas[0].fim).toBeLessThanOrEqual(3);
      expect(rot.cenas[rot.cenas.length - 1].fim).toBe(15);
      expect(rot.musica?.usoComercial).toBe(true);
    }
  });

  it("gera roteiros TikTok 15s com estrutura correta", async () => {
    const r = await gerar(briefingTiktok, new MockDataSource());
    const tiktoks = r.roteiros.filter((rot) => rot.plataforma === "tiktok");

    expect(tiktoks.length).toBe(2);
    for (const rot of tiktoks) {
      expect(rot.plataforma).toBe("tiktok");
      expect(rot.duracaoSeg).toBe(15);
      expect(rot.cenas[0].inicio).toBe(0);
      expect(rot.cenas[0].fim).toBeLessThanOrEqual(3);
      expect(rot.cenas[rot.cenas.length - 1].fim).toBe(15);
    }
  });

  it("gera roteiros Comercial 15s com estrutura correta", async () => {
    const r = await gerar(briefingReels, new MockDataSource());
    const comerciais15 = r.roteiros.filter((rot) => rot.plataforma === "comercial" && rot.duracaoSeg === 15);

    expect(comerciais15.length).toBe(2);
    for (const rot of comerciais15) {
      expect(rot.plataforma).toBe("comercial");
      expect(rot.duracaoSeg).toBe(15);
      expect(rot.cenas.length).toBeGreaterThanOrEqual(3);
      expect(rot.cenas[0].inicio).toBe(0);
      expect(rot.cenas[0].fim).toBeLessThanOrEqual(3);
      expect(rot.cenas[rot.cenas.length - 1].fim).toBe(15);
      for (const cena of rot.cenas) {
        expect(cena.visual).toBeTruthy();
        expect(cena.fala).toBeTruthy();
        expect(cena.tela).toBeTruthy();
      }
    }
  });

  it("gera roteiros Comercial 30s com estrutura correta", async () => {
    const r = await gerar(briefingReels, new MockDataSource());
    const comerciais30 = r.roteiros.filter((rot) => rot.plataforma === "comercial" && rot.duracaoSeg === 30);

    expect(comerciais30.length).toBe(2);
    for (const rot of comerciais30) {
      expect(rot.plataforma).toBe("comercial");
      expect(rot.duracaoSeg).toBe(30);
      expect(rot.cenas.length).toBeGreaterThanOrEqual(3);
      expect(rot.cenas[0].inicio).toBe(0);
      expect(rot.cenas[0].fim).toBeLessThanOrEqual(3);
      expect(rot.cenas[rot.cenas.length - 1].fim).toBe(30);
    }
  });

  it("roteiros têm evidências incluindo radar e música", async () => {
    const r = await gerar(briefingReels, new MockDataSource());

    for (const rot of r.roteiros) {
      expect(rot.evidencias.length).toBeGreaterThan(0);
      // Deve ter pelo menos a música como evidência
      const temMusica = rot.evidencias.some((e) => e.texto?.includes("Música liberada"));
      expect(temMusica).toBe(true);
    }
  });

  it("música com usoComercial: false NUNCA aparece no roteiro", async () => {
    const r = await gerar(briefingReels, new MockDataSource());

    for (const rot of r.roteiros) {
      // Verifica se a música sugerida tem usoComercial: true
      expect(rot.musica?.usoComercial).toBe(true);
      // Verifica se o radarId corresponde a uma música com usoComercial: true
      if (rot.musica?.radarId) {
        const { RADAR } = await import("@/lib/data/mock/radar");
        const musicaRadar = RADAR.find((m) => m.id === rot.musica!.radarId);
        expect(musicaRadar).toBeDefined();
        expect(musicaRadar?.usoComercial).toBe(true);
        // Garante que não é a música com usoComercial: false
        expect(musicaRadar?.id).not.toBe("rad-musica-2");
      }
    }
  });
});

describe("roteiros - governança", () => {
  const briefing = briefingSchema.parse({
    produto: "Protetor Solar FPS 50",
    categoria: "Protetores Solares",
    tipoProduto: "dermocosmetico",
    oferta: { descricao: "20% off no protetor solar", precoDe: 50, precoPor: 40, validade: "2026-12-31" },
    publicos: ["Mulheres 25-35"],
    canais: ["instagram"],
    formatos: ["feed"],
    objetivo: "conversao",
    incluirRoteiros: true,
  });

  const baseRoteiro = {
    id: "rot-1",
    publico: "Mulheres 25-35",
    plataforma: "comercial" as const,
    duracaoSeg: 15 as const,
    titulo: "Protetor Solar FPS 50",
    cenas: [
      { inicio: 0, fim: 3, visual: "Abertura com produto", fala: "Conheça o protetor que cuida da sua pele.", tela: "Protetor Solar FPS 50" },
      { inicio: 3, fim: 10, visual: "Demonstração", fala: "Proteção solar para o dia a dia.", tela: "FPS 50" },
      { inicio: 10, fim: 15, visual: "Logo final", tela: "Válido até 31/12 · no app e nas lojas" },
    ],
    evidencias: [],
  };

  function textoDoRoteiro(roteiro: typeof baseRoteiro) {
    return roteiro.cenas.map((c) => c.fala).filter(Boolean).join(" ");
  }

  function checarRoteiro(roteiro: typeof baseRoteiro) {
    return checarPeca(
      {
        titulo: roteiro.titulo,
        texto: textoDoRoteiro(roteiro),
        cta: "",
        selo: "",
        advertencia: undefined,
        bula: { indicacao: "", composicao: [], evidencias: [], contraindicacoes: [], posologia: "" }
      },
      briefing
    );
  }

  it("bloqueia roteiro com termo proibido", () => {
    const rot = { ...baseRoteiro, cenas: [{ ...baseRoteiro.cenas[0], fala: "O protetor que cura a pele em 7 dias." }] };
    const checagens = checarRoteiro(rot);
    expect(checagens.some((c) => !c.ok && c.regra === "termos-proibidos")).toBe(true);
  });

  it("bloqueia roteiro com promessa de resultado", () => {
    const rot = { ...baseRoteiro, cenas: [{ ...baseRoteiro.cenas[0], fala: "Proteção garantida o dia todo." }] };
    const checagens = checarRoteiro(rot);
    expect(checagens.some((c) => !c.ok && c.regra === "promessa")).toBe(true);
  });

  it("bloqueia roteiro com alegação terapêutica em dermocosmético", () => {
    const rot = { ...baseRoteiro, cenas: [{ ...baseRoteiro.cenas[0], fala: "O protetor que previne o envelhecimento." }] };
    const checagens = checarRoteiro(rot);
    expect(checagens.some((c) => !c.ok && c.regra === "alegacao-saude")).toBe(true);
  });

  it("aprova roteiro limpo", () => {
    const checagens = checarRoteiro(baseRoteiro);
    expect(checagens.every((c) => c.ok)).toBe(true);
  });

  it("bloqueia roteiro com diagnóstico", () => {
    const rot = { ...baseRoteiro, cenas: [{ ...baseRoteiro.cenas[0], fala: "Você está com gripe? Use nosso protetor." }] };
    const checagens = checarRoteiro(rot);
    expect(checagens.some((c) => !c.ok && c.regra === "diagnostico")).toBe(true);
  });
});

describe("roteiros - duração e estrutura (schema)", () => {
  it("valida duração exata de 15s", () => {
    const roteiro15 = {
      id: "rot-1",
      publico: "Teste",
      plataforma: "reels" as const,
      duracaoSeg: 15 as const,
      titulo: "Teste",
      cenas: [
        { inicio: 0, fim: 3, visual: "Gancho", fala: "Fala", tela: "Tela" },
        { inicio: 3, fim: 15, visual: "Corpo", fala: "Fala", tela: "Tela" },
      ],
      evidencias: [],
    };
    expect(roteiroSchema.safeParse(roteiro15).success).toBe(true);
  });

  it("valida duração exata de 30s", () => {
    const roteiro30 = {
      id: "rot-1",
      publico: "Teste",
      plataforma: "comercial" as const,
      duracaoSeg: 30 as const,
      titulo: "Teste",
      cenas: [
        { inicio: 0, fim: 3, visual: "Gancho", fala: "Fala", tela: "Tela" },
        { inicio: 3, fim: 25, visual: "Corpo", fala: "Fala", tela: "Tela" },
        { inicio: 25, fim: 30, visual: "CTA", fala: "Fala", tela: "Tela" },
      ],
      evidencias: [],
    };
    expect(roteiroSchema.safeParse(roteiro30).success).toBe(true);
  });

  it("rejeita roteiro com duração inválida (não 15 nem 30)", () => {
    const roteiroInvalido = {
      id: "rot-1",
      publico: "Teste",
      plataforma: "comercial" as const,
      duracaoSeg: 20 as const,
      titulo: "Teste",
      cenas: [
        { inicio: 0, fim: 3, visual: "Gancho", fala: "Fala", tela: "Tela" },
        { inicio: 3, fim: 20, visual: "Corpo", fala: "Fala", tela: "Tela" },
      ],
      evidencias: [],
    };
    expect(roteiroSchema.safeParse(roteiroInvalido).success).toBe(false);
  });

  it("rejeita roteiro com plataforma inválida", () => {
    const roteiroInvalido = {
      id: "rot-1",
      publico: "Teste",
      plataforma: "youtube" as const,
      duracaoSeg: 15 as const,
      titulo: "Teste",
      cenas: [
        { inicio: 0, fim: 3, visual: "Gancho", fala: "Fala", tela: "Tela" },
        { inicio: 3, fim: 15, visual: "Corpo", fala: "Fala", tela: "Tela" },
      ],
      evidencias: [],
    };
    expect(roteiroSchema.safeParse(roteiroInvalido).success).toBe(false);
  });
});
describe("governança dos roteiros (#10)", () => {
  it("todo roteiro gerado sai com o checklist rodado", async () => {
    const r = await gerar(briefingReels, new MockDataSource());
    expect(r.roteiros.length).toBeGreaterThan(0);
    for (const rot of r.roteiros) expect(rot.contraindicacoes.length).toBeGreaterThan(0);
  });
  it("roteiro de medicamento isento fecha com a advertência e passa", async () => {
    const mip = briefingSchema.parse({ ...briefingReels, produto: "Antigripal", categoria: "Antigripais", tipoProduto: "medicamento_isento" });
    const r = await gerar(mip, new MockDataSource());
    for (const rot of r.roteiros) {
      expect(rot.cenas.at(-1)!.tela).toContain("SE PERSISTIREM OS SINTOMAS");
      expect(rot.contraindicacoes.find((c) => c.regra === "advertencia-mip")?.ok).toBe(true);
    }
  });

  const briefing = {
    produto: "Protetor solar FPS 50", categoria: "Protetor solar", tipoProduto: "dermocosmetico", publicos: ["Jovens de 18 a 24"], canais: ["instagram"], formatos: ["feed"],
    oferta: { descricao: "30% off", precoDe: 79.9, precoPor: 55.9, condicao: "", validade: "2026-11-15" }, objetivo: "conversao", variacoesPorCanal: 3, incluirRoteiros: true, radarIds: [],
  } as Parameters<typeof checarRoteiro>[1];
  const cenas = (fala: string) => [{ inicio: 0, fim: 3, visual: "Close no produto", fala }, { inicio: 3, fim: 15, visual: "Logo", tela: "Válido até 15/11" }];

  it("passa um roteiro limpo", () => {
    expect(checarRoteiro({ titulo: "Reels 15s: protetor", cenas: cenas("Já usou protetor hoje?") }, briefing).every((c) => c.ok)).toBe(true);
  });
  it("bloqueia promessa de cura e termo proibido na fala", () => {
    const r = checarRoteiro({ titulo: "Reels 15s: protetor", cenas: cenas("Cura garantida da sua pele") }, briefing);
    expect(r.filter((c) => !c.ok).map((c) => c.regra)).toEqual(expect.arrayContaining(["termos-proibidos", "promessa"]));
  });
  it("exige a advertência da Anvisa no vídeo de medicamento isento", () => {
    const mip = { ...briefing, tipoProduto: "medicamento_isento" } as typeof briefing;
    const sem = checarRoteiro({ titulo: "Comercial", cenas: cenas("Alivia o resfriado") }, mip);
    expect(sem.find((c) => c.regra === "advertencia-mip")?.ok).toBe(false);
    const com = checarRoteiro({ titulo: "Comercial", cenas: [...cenas("Alivia o resfriado").slice(0, 1), { inicio: 3, fim: 15, visual: "Logo", tela: "SE PERSISTIREM OS SINTOMAS, O MÉDICO DEVERÁ SER CONSULTADO." }] }, mip);
    expect(com.find((c) => c.regra === "advertencia-mip")?.ok).toBe(true);
  });
});
