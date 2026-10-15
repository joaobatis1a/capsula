import type { Canal, Formato, Objetivo, TipoProduto } from "@/types/briefing";

/* Doses prontas da cartela da abertura: briefings de exemplo, um por época de saúde.
   Ao destacar uma dose, o Estúdio preenche o briefing com ela. Ofertas e preços são fictícios. */

export interface Dose {
  id: string;
  /** Rótulo impresso na cartela, em caixa alta. */
  epoca: string;
  titulo: string;
  /** Sazonalidade de saúde ligada, quando houver. */
  sazonalidadeId?: string;
  produto: string;
  categoria: string;
  tipoProduto: TipoProduto;
  descricao: string;
  precoDe?: string;
  precoPor?: string;
  condicao: string;
  publicos: string[];
  canais: Canal[];
  formatos: Formato[];
  objetivo: Objetivo;
}

export const DOSES: Dose[] = [
  {
    id: "dose-verao",
    epoca: "Verão",
    titulo: "Protetor solar",
    sazonalidadeId: "saz-verao-sol",
    produto: "Protetor solar FPS 50",
    categoria: "Protetor solar",
    tipoProduto: "dermocosmetico",
    descricao: "30% off no protetor solar FPS 50",
    precoDe: "79.90",
    precoPor: "55.90",
    condicao: "No app e nas lojas, enquanto durar o estoque.",
    publicos: ["Jovens de 18 a 24", "Mães e pais de crianças pequenas"],
    canais: ["instagram", "site"],
    formatos: ["feed", "story", "banner"],
    objetivo: "conversao",
  },
  {
    id: "dose-calor",
    epoca: "Calor",
    titulo: "Reidratação",
    sazonalidadeId: "saz-verao-hidratacao",
    produto: "Soro de reidratação oral",
    categoria: "Hidratação oral",
    tipoProduto: "medicamento_isento",
    descricao: "15% off no soro de reidratação",
    precoDe: "9.90",
    precoPor: "8.40",
    condicao: "Nas lojas e no app, enquanto durar o estoque.",
    publicos: ["Quem pratica esporte", "Pessoas com 60 anos ou mais"],
    canais: ["instagram", "facebook"],
    formatos: ["feed", "story"],
    objetivo: "consideracao",
  },
  {
    id: "dose-dengue",
    epoca: "Chuvas",
    titulo: "Repelente",
    sazonalidadeId: "saz-dengue",
    produto: "Repelente infantil em spray",
    categoria: "Repelentes",
    tipoProduto: "higiene_beleza",
    descricao: "25% off no repelente infantil",
    precoDe: "39.90",
    precoPor: "29.90",
    condicao: "No app e nas lojas.",
    publicos: ["Mães e pais de crianças pequenas", "Adultos de 35 a 59 com uso contínuo"],
    canais: ["instagram", "tiktok"],
    formatos: ["feed", "story"],
    objetivo: "conversao",
  },
  {
    id: "dose-gripe",
    epoca: "Inverno",
    titulo: "Antigripal",
    sazonalidadeId: "saz-gripe-centro-sul",
    produto: "Antigripal em cápsulas",
    categoria: "Antigripais",
    tipoProduto: "medicamento_isento",
    descricao: "20% off no antigripal",
    precoDe: "29.90",
    precoPor: "23.90",
    condicao: "Nas lojas, enquanto durar o estoque.",
    publicos: ["Adultos de 25 a 34", "Pessoas com 60 anos ou mais"],
    canais: ["instagram", "site"],
    formatos: ["feed", "banner"],
    objetivo: "conversao",
  },
  {
    id: "dose-ar-seco",
    epoca: "Ar seco",
    titulo: "Hidratante",
    sazonalidadeId: "saz-ar-seco",
    produto: "Hidratante corporal intensivo",
    categoria: "Hidratantes",
    tipoProduto: "dermocosmetico",
    descricao: "Leve 2 com 30% off no segundo hidratante",
    condicao: "Válido para a unidade de menor valor.",
    publicos: ["Adultos de 25 a 34", "Pessoas com 60 anos ou mais"],
    canais: ["instagram", "tiktok"],
    formatos: ["feed", "story"],
    objetivo: "consideracao",
  },
  {
    id: "dose-rotina",
    epoca: "Ano todo",
    titulo: "Vitamina C",
    produto: "Vitamina C 1g efervescente",
    categoria: "Vitaminas",
    tipoProduto: "suplemento",
    descricao: "30% off na vitamina C",
    precoDe: "49.90",
    precoPor: "34.90",
    condicao: "No app e nas lojas.",
    publicos: ["Adultos de 25 a 34", "Quem pratica esporte"],
    canais: ["instagram", "site"],
    formatos: ["feed", "story", "banner"],
    objetivo: "awareness",
  },
];

/** As doses da época atual vêm primeiro. */
export function ordenarDoses(emAlta: string[]) {
  return [...DOSES].sort((a, b) => Number(emAlta.includes(b.sazonalidadeId ?? "")) - Number(emAlta.includes(a.sazonalidadeId ?? "")));
}
