import { z } from "zod";
import { CANAIS, FORMATOS, type Briefing } from "./briefing";

/* Contrato de saída do motor: o que /api/gerar devolve. Alimenta PieceCard, Bula, DoseBar e Roteiro.
   O motor valida a resposta do modelo com estes schemas antes de devolver. */

export const ORIGENS = ["memoria", "tendencia", "sazonalidade"] as const;
export type OrigemEvidencia = (typeof ORIGENS)[number];

export const STATUS = ["rascunho", "revisao", "bloqueado", "aprovado", "publicado"] as const;
export type StatusPeca = (typeof STATUS)[number];

export const evidenciaSchema = z.object({
  origem: z.enum(ORIGENS),
  texto: z.string().min(3),
  /** Fonte legível: "12 campanhas · nos dados de teste" ou "TikTok · Creative Center · 12/10". */
  fonte: z.string().min(3),
  /** Id do item do ranking, do radar ou da sazonalidade usado. */
  refId: z.string().optional(),
  /** Peso desta evidência no cálculo da dose (0 a 1). */
  peso: z.number().min(0).max(1).default(1),
});

export const checagemSchema = z.object({
  regra: z.string(),
  ok: z.boolean(),
  texto: z.string(),
});

export const bulaSchema = z.object({
  indicacao: z.string().min(3),
  composicao: z.array(z.object({ k: z.string(), v: z.string() })).min(1),
  evidencias: z.array(evidenciaSchema).min(1),
  /** Preenchidas pela governança (#7), não pelo modelo. */
  contraindicacoes: z.array(checagemSchema).default([]),
  posologia: z.string().min(3),
});

export const variacaoSchema = z.object({
  id: z.string(),
  publico: z.string(),
  canal: z.enum(CANAIS),
  formato: z.enum(FORMATOS),
  titulo: z.string().min(3).max(90),
  texto: z.string().min(3).max(400),
  cta: z.string().min(2).max(40),
  selo: z.string().max(24).optional(),
  hashtags: z.array(z.string()).max(6).default([]),
  /** Advertência obrigatória quando o produto pede (ex.: medicamento isento de prescrição). */
  advertencia: z.string().optional(),
  /** Percentual que veio da memória (0 a 100). O resto é tendência ou sazonalidade. */
  dose: z.number().min(0).max(100),
  bula: bulaSchema,
  status: z.enum(STATUS).default("rascunho"),
});

export const musicaSchema = z.object({
  titulo: z.string(),
  artista: z.string(),
  radarId: z.string(),
  /** Só músicas liberadas para uso comercial são sugeridas por padrão (#37). */
  usoComercial: z.boolean(),
});

export const cenaSchema = z.object({
  inicio: z.number().min(0),
  fim: z.number().positive(),
  visual: z.string(),
  fala: z.string().optional(),
  tela: z.string().optional(),
});

export const roteiroSchema = z.object({
  id: z.string(),
  publico: z.string(),
  plataforma: z.enum(["reels", "tiktok", "comercial"]),
  duracaoSeg: z.union([z.literal(15), z.literal(30)]),
  titulo: z.string(),
  /** A primeira cena é o gancho e termina até 3s. */
  cenas: z.array(cenaSchema).min(2),
  musica: musicaSchema.optional(),
  evidencias: z.array(evidenciaSchema).default([]),
});

export type Evidencia = z.output<typeof evidenciaSchema>;
export type Checagem = z.output<typeof checagemSchema>;
export type BulaPeca = z.output<typeof bulaSchema>;
export type Variacao = z.output<typeof variacaoSchema>;
export type Musica = z.output<typeof musicaSchema>;
export type Cena = z.output<typeof cenaSchema>;
export type Roteiro = z.output<typeof roteiroSchema>;

/** Resposta de POST /api/gerar. */
export interface RespostaGeracao {
  briefing: Briefing;
  variacoes: Variacao[];
  roteiros: Roteiro[];
  geradoEm: string;
  /** "groq:<modelo>", "openrouter:<modelo>" ou "exemplo" quando vem do JSON de exemplo. */
  modelo: string;
  doCache: boolean;
  /** Avisos para a tela, como "cota do modelo acabou, usamos a reserva". */
  avisos: string[];
}

/** Erro padronizado das rotas de API. */
export interface ErroApi {
  erro: string;
  codigo: "validacao" | "cota" | "modelo" | "interno";
  campos?: Record<string, string>;
}

/** Formata "0–3s" a partir de uma cena. */
export function tempoDaCena(c: Pick<Cena, "inicio" | "fim">) {
  return `${c.inicio}–${c.fim}s`;
}
