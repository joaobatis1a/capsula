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

export const REGIOES = ["norte", "nordeste", "centro-oeste", "sudeste", "sul"] as const;
export type Regiao = (typeof REGIOES)[number];

export const CATEGORIAS_SAUDE = ["respiratoria", "arbovirose", "gastrointestinal", "infecciosa", "pele", "olhos", "alergia", "infantil", "cronica", "bem-estar"] as const;
export type CategoriaSaude = (typeof CATEGORIAS_SAUDE)[number];

export const AGENTES = ["virus", "bacteria", "fungo", "parasita", "alergeno", "ambiental", "misto"] as const;
export type Agente = (typeof AGENTES)[number];

export interface FonteSaude {
  nome: string;
  /** Vazio quando a fonte não tem link estável (a tela mostra só o nome). */
  url?: string;
}

/** Uma condição de saúde com sazonalidade (#36). Conteúdo informativo para planejar comunicação: não é diagnóstico. */
export interface Sazonalidade {
  id: string;
  condicao: string;
  categoriaSaude: CategoriaSaude;
  agente: Agente;
  resumo: string;
  /** Intensidade por mês, de janeiro a dezembro: 0 fora de época, 1 baixa, 2 moderada, 3 pico. Padrão geral aproximado. */
  intensidade: number[];
  /** Quando a sazonalidade muda por região, o padrão de cada uma. As que faltam seguem `intensidade`. */
  porRegiao?: Partial<Record<Regiao, number[]>>;
  /** Meses de pico (intensidade 3, ou 2 se nenhum chegar a 3). Calculado a partir de `intensidade`. */
  mesesPico: number[];
  /** Texto curto sobre onde e como varia. */
  regiao: string;
  gruposRisco: string[];
  /** Sintomas mais comuns, para o redator reconhecer o assunto. A peça nunca faz diagnóstico. */
  sintomas: string[];
  prevencao: string[];
  vacina?: string;
  /** Categorias de produto e serviço da farmácia ligadas à condição. */
  categorias: string[];
  produtosExemplo: string[];
  tiposProduto: TipoProduto[];
  /** Nomes dos públicos sugeridos que mais combinam. */
  publicos: string[];
  /** Ângulo de comunicação: prevenção e cuidado, nunca diagnóstico ou cura. */
  angulo: string;
  /** O que a peça não pode fazer neste assunto. */
  cuidado: string;
  fontes: FonteSaude[];
  /** Primeira fonte, mantida para a Bula. */
  fonte: string;
  fonteUrl: string;
  origem: OrigemDado;
}

/** Campanha de saúde do calendário (Outubro Rosa, Novembro Azul...). */
export interface DataSaude {
  id: string;
  mes: number;
  nome: string;
  tema: string;
  /** Categorias de produto e serviço que combinam com o tema. */
  foco: string[];
  fonte: FonteSaude;
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
  /** Toda a base de sazonalidade de saúde, em ordem alfabética. */
  getSaudeDoAno(): Promise<Sazonalidade[]>;
  /** Campanhas de saúde do calendário. */
  getDatasSaude(): Promise<DataSaude[]>;
  getPublicos(): Promise<PublicoSugerido[]>;
}
