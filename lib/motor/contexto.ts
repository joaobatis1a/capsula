import type { CampaignDataSource, ItemRadar, Sazonalidade } from "@/lib/data/types";
import { rankear, relevantesPara, rotular, type ItemRanking } from "@/lib/memoria/ranking";
import type { Briefing, Canal, Formato } from "@/types/briefing";
import type { Evidencia } from "@/types/variacao";

/* Junta o que a Memória, o Radar e a sazonalidade sabem sobre o briefing (#32).
   Cada item tem um id, e só esses ids podem virar evidência na Bula. */

export interface Contexto {
  melhores: ItemRanking[];
  piores: ItemRanking[];
  radar: ItemRadar[];
  musicas: ItemRadar[];
  sazonalidade: Sazonalidade[];
  fonteMemoria: string;
}

export async function montarContexto(briefing: Briefing, fonte: CampaignDataSource, hoje = new Date()): Promise<Contexto> {
  const [campanhas, radarTodo, sazonais] = await Promise.all([
    fonte.getCampanhas(),
    fonte.getRadar(hoje.toISOString().slice(0, 10)),
    fonte.getSazonalidade(hoje.getMonth() + 1),
  ]);
  const ranking = rankear(campanhas, { limite: 12, fonte: fonte.nome });
  const filtro = { publicos: briefing.publicos, canais: briefing.canais };
  const escolhidos = new Set(briefing.radarIds);
  const mesAtual = hoje.getMonth() + 1;

  return {
    melhores: relevantesPara(ranking.melhores, filtro).slice(0, 6),
    piores: relevantesPara(ranking.piores, filtro).slice(0, 4),
    radar: radarTodo.filter((i) => i.tipo !== "musica").sort((a, b) => Number(escolhidos.has(b.id)) - Number(escolhidos.has(a.id))),
    musicas: radarTodo.filter((i) => i.tipo === "musica"),
    sazonalidade: sazonais.sort((a, b) => Number(escolhidos.has(b.id)) - Number(escolhidos.has(a.id)) || b.intensidade[mesAtual - 1] - a.intensidade[mesAtual - 1]),
    fonteMemoria: fonte.nome,
  };
}

/** Transforma um id do contexto em evidência com a fonte escrita por nós, nunca pelo modelo. */
export function evidenciaPorId(ctx: Contexto, refId: string, texto?: string, peso = 1): Evidencia | null {
  const rk = [...ctx.melhores, ...ctx.piores].find((i) => i.id === refId);
  if (rk) return { origem: "memoria", refId, peso, texto: texto || `${capitalizar(rotular(rk.combinacao))}: ${rk.texto}`, fonte: rk.fonte };

  const rd = [...ctx.radar, ...ctx.musicas].find((i) => i.id === refId);
  if (rd) return { origem: "tendencia", refId, peso, texto: texto || `${rd.termo} em alta`, fonte: `${rd.fonte.startsWith(rd.plataforma) ? rd.fonte : `${rd.plataforma} · ${rd.fonte}`} · ${dataCurta(rd.vistoEm)}` };

  const sz = ctx.sazonalidade.find((i) => i.id === refId);
  if (sz) return { origem: "sazonalidade", refId, peso, texto: texto || `${sz.condicao}: pico em ${mesesPorExtenso(sz.mesesPico)}`, fonte: sz.fonte };

  return null;
}

/** Dose: percentual do peso das evidências que veio da memória. Heurística declarada no README. */
export function calcularDose(evidencias: Evidencia[]) {
  const total = evidencias.reduce((s, e) => s + e.peso, 0);
  if (total === 0) return 50;
  const memoria = evidencias.filter((e) => e.origem === "memoria").reduce((s, e) => s + e.peso, 0);
  return Math.round((memoria / total) * 100);
}

/** Formatos possíveis em cada canal, cruzados com os formatos pedidos no briefing. */
const FORMATOS_DO_CANAL: Record<Canal, Formato[]> = {
  instagram: ["feed", "story"],
  facebook: ["feed", "story"],
  tiktok: ["story"],
  site: ["banner"],
};

export function formatosPara(canal: Canal, pedidos: Formato[]): Formato[] {
  const possiveis = FORMATOS_DO_CANAL[canal];
  const cruzados = possiveis.filter((f) => pedidos.includes(f));
  return cruzados.length ? cruzados : [possiveis[0]];
}

export function dataCurta(iso: string) {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
export function mesesPorExtenso(meses: number[]) {
  if (meses.length === 0) return "";
  return meses.length > 2 ? `${MESES[meses[0] - 1]}–${MESES[meses.at(-1)! - 1]}` : meses.map((m) => MESES[m - 1]).join(" e ");
}

function capitalizar(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
