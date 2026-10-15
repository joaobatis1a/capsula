import type { Campanha, FormatoCampanha } from "@/lib/data/types";

/* Ranking de combinações da Memória (#31).
   Compara cada combinação de duas dimensões com a média, com o CTR normalizado pelo formato
   (vídeo e banner têm CTR naturalmente diferentes). Combinações com poucas campanhas são ignoradas. */

export type Dimensao = "gancho" | "tom" | "formato" | "canal" | "publico" | "categoria";
export type Metrica = "ctr" | "conversao";

export interface ItemRanking {
  id: string;
  /** Ex.: { gancho: "pergunta", formato: "video" } */
  combinacao: Partial<Record<Dimensao, string>>;
  metrica: Metrica;
  /** Quanto a combinação rende em relação à média (1,8 = 80% acima). */
  lift: number;
  campanhas: number;
  /** Texto pronto para a Bula: "CTR 1,8× a média · 12 campanhas". */
  texto: string;
  fonte: string;
}

export interface Ranking {
  melhores: ItemRanking[];
  piores: ItemRanking[];
  total: number;
}

const PARES: [Dimensao, Dimensao][] = [
  ["gancho", "formato"],
  ["gancho", "canal"],
  ["gancho", "publico"],
  ["tom", "canal"],
  ["tom", "publico"],
  ["formato", "publico"],
  ["categoria", "publico"],
];

export const ROTULO_DIMENSAO: Record<string, string> = {
  pergunta: "gancho com pergunta",
  beneficio: "gancho de benefício",
  oferta_direta: "oferta direta",
  prova_social: "prova social",
  urgencia: "gancho de urgência",
  humor: "gancho com humor",
  proximo: "tom próximo",
  informativo: "tom informativo",
  divertido: "tom divertido",
  institucional: "tom institucional",
  feed: "feed",
  story: "story",
  video: "vídeo curto",
  banner: "banner",
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  site: "site e app",
};

export function rotular(c: ItemRanking["combinacao"]) {
  return Object.values(c)
    .map((v) => ROTULO_DIMENSAO[v!] ?? v)
    .join(" + ");
}

export function formatarLift(lift: number) {
  return lift.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "×";
}

export function rankear(campanhas: Campanha[], opcoes: { minimo?: number; limite?: number; fonte?: string } = {}): Ranking {
  const { minimo = 8, limite = 5, fonte = "nos dados de teste" } = opcoes;
  if (campanhas.length === 0) return { melhores: [], piores: [], total: 0 };

  // CTR médio por formato, para normalizar.
  const base = new Map<FormatoCampanha, number>();
  for (const f of new Set(campanhas.map((c) => c.formato))) {
    const doFormato = campanhas.filter((c) => c.formato === f);
    base.set(f, soma(doFormato, (c) => c.cliques) / soma(doFormato, (c) => c.impressoes));
  }
  const convMedia = soma(campanhas, (c) => c.conversoes) / Math.max(1, soma(campanhas, (c) => c.cliques));

  const itens: ItemRanking[] = [];
  for (const [a, b] of PARES) {
    const grupos = new Map<string, Campanha[]>();
    for (const c of campanhas) {
      const chave = `${c[a]}|${c[b]}`;
      grupos.set(chave, [...(grupos.get(chave) ?? []), c]);
    }
    for (const [chave, grupo] of grupos) {
      if (grupo.length < minimo) continue;
      const [va, vb] = chave.split("|");
      const combinacao = { [a]: va, [b]: vb };
      const liftCtr = media(grupo, (c) => c.cliques / c.impressoes / base.get(c.formato)!);
      const liftConv = soma(grupo, (c) => c.conversoes) / Math.max(1, soma(grupo, (c) => c.cliques)) / convMedia;
      itens.push(item(combinacao, "ctr", liftCtr, grupo.length, fonte));
      itens.push(item(combinacao, "conversao", liftConv, grupo.length, fonte));
    }
  }

  const ordenados = [...itens].sort((x, y) => y.lift - x.lift);
  return {
    melhores: semRepetir(ordenados).slice(0, limite),
    piores: semRepetir(ordenados.filter((i) => i.metrica === "ctr").reverse()).slice(0, limite),
    total: campanhas.length,
  };
}

/** Itens do ranking que valem para o briefing: combinações que não contradizem os públicos e canais escolhidos. */
export function relevantesPara(itens: ItemRanking[], filtro: { publicos: string[]; canais: string[] }) {
  return itens.filter(
    (i) =>
      (!i.combinacao.publico || filtro.publicos.includes(i.combinacao.publico)) &&
      (!i.combinacao.canal || filtro.canais.includes(i.combinacao.canal)),
  );
}

function item(combinacao: ItemRanking["combinacao"], metrica: Metrica, lift: number, n: number, fonte: string): ItemRanking {
  const id = `rk-${metrica}-${Object.values(combinacao).join("-")}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  const nome = metrica === "ctr" ? "CTR" : "Conversão";
  return {
    id,
    combinacao,
    metrica,
    lift,
    campanhas: n,
    texto: `${nome} ${formatarLift(lift)} a média · ${n} campanhas`,
    fonte: `${n} campanhas · ${fonte}`,
  };
}

/** Evita mostrar a mesma combinação duas vezes (CTR e conversão). */
function semRepetir(itens: ItemRanking[]) {
  const vistos = new Set<string>();
  return itens.filter((i) => {
    const k = JSON.stringify(i.combinacao);
    if (vistos.has(k)) return false;
    vistos.add(k);
    return true;
  });
}

function soma<T>(lista: T[], f: (x: T) => number) {
  return lista.reduce((s, x) => s + f(x), 0);
}

function media<T>(lista: T[], f: (x: T) => number) {
  return soma(lista, f) / lista.length;
}
