import type { Canal, TipoProduto } from "@/types/briefing";
import { GANCHOS, TONS, type Campanha, type FormatoCampanha, type Gancho, type Tom } from "../types";
import { PUBLICOS } from "./publicos";

/* Histórico sintético de campanhas (#30). Determinístico: a mesma semente gera sempre os mesmos dados.
   Os padrões plantados abaixo existem para o ranking encontrar. Ninguém pode apresentá-los como descoberta real.

   Padrões plantados (multiplicam o CTR base):
   1. Gancho "pergunta" em vídeo (Reels e TikTok): 1,8×
   2. Gancho "urgencia" para o público 60+: 0,6×
   3. Tom "divertido" no TikTok para jovens de 18 a 24: 1,6×
   4. Gancho "oferta_direta" em banner no site: conversão 1,5×
   5. Gancho "prova_social" para mães e pais de crianças pequenas: 1,4×
   6. Antigripais de abril a julho: 1,5× (sazonalidade) */

export const TOTAL_CAMPANHAS = 300;

const CATEGORIAS: { nome: string; tipo: TipoProduto }[] = [
  { nome: "Protetor solar", tipo: "dermocosmetico" },
  { nome: "Antigripais", tipo: "medicamento_isento" },
  { nome: "Vitaminas", tipo: "suplemento" },
  { nome: "Higiene bucal", tipo: "higiene_beleza" },
  { nome: "Fraldas e bebê", tipo: "infantil" },
  { nome: "Dermocosméticos", tipo: "dermocosmetico" },
  { nome: "Vacinação na farmácia", tipo: "servico" },
  { nome: "Repelentes", tipo: "higiene_beleza" },
];

const COMBOS: { canal: Canal; formato: FormatoCampanha }[] = [
  { canal: "instagram", formato: "feed" },
  { canal: "instagram", formato: "story" },
  { canal: "instagram", formato: "video" },
  { canal: "tiktok", formato: "video" },
  { canal: "facebook", formato: "feed" },
  { canal: "site", formato: "banner" },
];

const CTR_BASE: Record<FormatoCampanha, number> = { feed: 0.012, story: 0.009, video: 0.015, banner: 0.006 };

/** Gerador pseudoaleatório simples e determinístico (mulberry32). */
function rng(semente: number) {
  let a = semente;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function gerarCampanhas(total = TOTAL_CAMPANHAS, semente = 26102026): Campanha[] {
  const r = rng(semente);
  const pick = <T,>(lista: readonly T[]) => lista[Math.floor(r() * lista.length)];
  const inicio = Date.UTC(2025, 9, 1);
  const fim = Date.UTC(2026, 8, 30);
  const campanhas: Campanha[] = [];

  for (let i = 0; i < total; i++) {
    const { canal, formato } = pick(COMBOS);
    const publico = pick(PUBLICOS).nome;
    const gancho: Gancho = pick(GANCHOS);
    const tom: Tom = pick(TONS);
    const cat = pick(CATEGORIAS);
    const data = new Date(inicio + r() * (fim - inicio));
    const mes = data.getUTCMonth() + 1;

    let ctr = CTR_BASE[formato] * (0.75 + r() * 0.5);
    let conv = 0.03 * (0.75 + r() * 0.5);
    if (gancho === "pergunta" && formato === "video") ctr *= 1.8;
    if (gancho === "urgencia" && publico.includes("60")) ctr *= 0.6;
    if (tom === "divertido" && canal === "tiktok" && publico.includes("18 a 24")) ctr *= 1.6;
    if (gancho === "oferta_direta" && formato === "banner") conv *= 1.5;
    if (gancho === "prova_social" && publico.startsWith("Mães")) ctr *= 1.4;
    if (cat.nome === "Antigripais" && mes >= 4 && mes <= 7) ctr *= 1.5;

    const impressoes = Math.round(8000 + r() * 42000);
    const cliques = Math.round(impressoes * ctr);
    campanhas.push({
      id: `cmp-${String(i + 1).padStart(3, "0")}`,
      data: data.toISOString().slice(0, 10),
      canal,
      formato,
      publico,
      gancho,
      tom,
      categoria: cat.nome,
      tipoProduto: cat.tipo,
      impressoes,
      cliques,
      conversoes: Math.round(cliques * conv),
      origem: "sintetico",
    });
  }

  return campanhas.sort((a, b) => a.data.localeCompare(b.data));
}
