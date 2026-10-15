import type { Canal, Formato, TipoProduto } from "@/types/briefing";

/* Contrato dos dados de entrada. Todo o sistema lê dados por CampaignDataSource,
   nunca direto do mock, do CSV ou do banco. Trocar a fonte não muda mais nada. */

/** "sintetico" = gerado por nós para teste; "publico" = coletado de fonte pública; "real" = dado da empresa. */
export type OrigemDado = "sintetico" | "publico" | "real";

export const GANCHOS = ["pergunta", "beneficio", "oferta_direta", "prova_social", "urgencia", "humor"] as const;
export const TONS = ["proximo", "informativo", "divertido", "institucional"] as const;
export type Gancho = (typeof GANCHOS)[number];
export type Tom = (typeof TONS)[number];

/** No histórico também existe vídeo curto (Reels e TikTok). */
export type FormatoCampanha = Formato | "video";

/** Uma campanha do histórico, já com as métricas. */
export interface Campanha {
  id: string;
  /** aaaa-mm-dd do início da veiculação. */
  data: string;
  canal: Canal;
  formato: FormatoCampanha;
  publico: string;
  gancho: Gancho;
  tom: Tom;
  categoria: string;
  tipoProduto: TipoProduto;
  impressoes: number;
  cliques: number;
  conversoes: number;
  origem: OrigemDado;
}

export const TIPOS_RADAR = ["hashtag", "formato", "musica", "data_sazonal"] as const;
export type TipoRadar = (typeof TIPOS_RADAR)[number];

/** Um item do radar de tendências. Sempre com fonte, data e validade. */
export interface ItemRadar {
  id: string;
  plataforma: "TikTok" | "Instagram" | "Meta Ads" | "Calendário";
  tipo: TipoRadar;
  termo: string;
  ideia: string;
  fonte: string;
  /** aaaa-mm-dd em que foi visto. */
  vistoEm: string;
  /** aaaa-mm-dd até quando vale. Item vencido sai das sugestões. */
  validade: string;
  /** Só para música: artista e se está liberada para uso comercial por marcas. */
  artista?: string;
  usoComercial?: boolean;
  origem: OrigemDado;
}

/** Uma condição de saúde que aumenta em certa época do ano (#36). */
export interface Sazonalidade {
  id: string;
  condicao: string;
  /** Meses de pico, de 1 a 12. */
  mesesPico: number[];
  regiao: string;
  /** Categorias de produto ligadas, para sugerir briefings. */
  categorias: string[];
  tiposProduto: TipoProduto[];
  /** Ângulo de comunicação: prevenção e cuidado, nunca diagnóstico ou cura. */
  angulo: string;
  fonte: string;
  fonteUrl: string;
  origem: OrigemDado;
}

/** Um público sugerido no Estúdio. */
export interface PublicoSugerido {
  id: string;
  nome: string;
  faixaEtaria: string;
  momento: string;
  necessidades: string[];
}

export interface FiltroCampanhas {
  canal?: Canal;
  formato?: FormatoCampanha;
  publico?: string;
  categoria?: string;
  desde?: string;
}

export interface CampaignDataSource {
  /** Nome da fonte, mostrado na tela e na Bula ("nos dados de teste"). */
  readonly nome: string;
  readonly origem: OrigemDado;
  getCampanhas(filtro?: FiltroCampanhas): Promise<Campanha[]>;
  /** Itens válidos na data informada (padrão: hoje). */
  getRadar(data?: string): Promise<ItemRadar[]>;
  /** Condições em pico no mês informado e nos dois seguintes (1 a 12), para planejar antes do pico. */
  getSazonalidade(mes: number): Promise<Sazonalidade[]>;
  getPublicos(): Promise<PublicoSugerido[]>;
}
