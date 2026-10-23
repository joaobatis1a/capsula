import { z } from "zod";

/* Contrato do briefing: fonte de verdade para a tela do Estúdio, a rota /api/gerar e o banco.
   A mesma validação roda no navegador e no servidor. */

export const CANAIS = ["instagram", "tiktok", "facebook", "site"] as const;
export const FORMATOS = ["feed", "story", "banner"] as const;
export const OBJETIVOS = ["awareness", "consideracao", "conversao"] as const;

/** O tipo de produto decide as regras de governança (RDC 96/2008 da Anvisa para medicamentos). */
export const TIPOS_PRODUTO = [
  "medicamento_isento",
  "medicamento_prescricao",
  "dermocosmetico",
  "higiene_beleza",
  "suplemento",
  "infantil",
  "servico",
] as const;

export type Canal = (typeof CANAIS)[number];
export type Formato = (typeof FORMATOS)[number];

/** Cada canal tem os seus formatos: a pessoa escolhe o canal e os formatos vêm dele, sem uma segunda pergunta. */
export const FORMATOS_DO_CANAL: Record<Canal, Formato[]> = {
  instagram: ["feed", "story"],
  facebook: ["feed", "story"],
  tiktok: ["story"],
  site: ["banner"],
};

/** Os formatos de um conjunto de canais, sem repetir. */
export function formatosDosCanais(canais: Canal[]): Formato[] {
  return FORMATOS.filter((f) => canais.some((c) => FORMATOS_DO_CANAL[c].includes(f)));
}
export type Objetivo = (typeof OBJETIVOS)[number];
export type TipoProduto = (typeof TIPOS_PRODUTO)[number];

export const ROTULOS = {
  canal: { instagram: "Instagram", tiktok: "TikTok", facebook: "Facebook", site: "Site e app" } satisfies Record<Canal, string>,
  formato: { feed: "Feed 1:1", story: "Story 9:16", banner: "Banner 16:9" } satisfies Record<Formato, string>,
  objetivo: { awareness: "Ser lembrado", consideracao: "Gerar interesse", conversao: "Vender" } satisfies Record<Objetivo, string>,
  tipoProduto: {
    medicamento_isento: "Medicamento isento de prescrição",
    medicamento_prescricao: "Medicamento com prescrição",
    dermocosmetico: "Dermocosmético",
    higiene_beleza: "Higiene e beleza",
    suplemento: "Suplemento e vitamina",
    infantil: "Infantil e maternidade",
    servico: "Serviço da farmácia",
  } satisfies Record<TipoProduto, string>,
};

const dataISO = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use o formato aaaa-mm-dd.");

export const ofertaSchema = z
  .object({
    descricao: z.string().trim().min(3, "Descreva a oferta.").max(120),
    precoDe: z.number().positive().optional(),
    precoPor: z.number().positive().optional(),
    condicao: z.string().trim().max(160).optional(),
    validade: dataISO,
  })
  .refine((o) => o.precoPor == null || o.precoDe == null || o.precoPor < o.precoDe, {
    message: "O preço promocional precisa ser menor que o preço normal.",
    path: ["precoPor"],
  });

export const briefingSchema = z.object({
  produto: z.string().trim().min(2, "Informe o produto.").max(80),
  categoria: z.string().trim().min(2, "Informe a categoria.").max(60),
  tipoProduto: z.enum(TIPOS_PRODUTO),
  oferta: ofertaSchema,
  /** Um briefing pode falar com vários públicos (#35). As variações saem por público e canal. */
  publicos: z.array(z.string().trim().min(2).max(80)).min(1, "Escolha pelo menos um público.").max(4, "Escolha até 4 públicos."),
  canais: z.array(z.enum(CANAIS)).min(1, "Escolha pelo menos um canal."),
  formatos: z.array(z.enum(FORMATOS)).min(1, "Escolha pelo menos um formato."),
  objetivo: z.enum(OBJETIVOS),
  variacoesPorCanal: z.number().int().min(3).max(5).default(3),
  incluirRoteiros: z.boolean().default(false),
  /** Item do radar ou da sazonalidade de saúde que inspirou o briefing, quando houver. */
  radarIds: z.array(z.string()).default([]),
  observacoes: z.string().trim().max(500).optional(),
});

/** O que a tela envia (com campos opcionais). */
export type BriefingEntrada = z.input<typeof briefingSchema>;
/** O briefing já validado, com os padrões aplicados. */
export type Briefing = z.output<typeof briefingSchema>;

export type ErrosBriefing = Partial<Record<string, string>>;

/** Valida o briefing e devolve os erros por campo ("oferta.validade", "publicos"...), prontos para a tela. */
export function validarBriefing(entrada: unknown): { ok: true; briefing: Briefing } | { ok: false; erros: ErrosBriefing } {
  const r = briefingSchema.safeParse(entrada);
  if (r.success) return { ok: true, briefing: r.data };
  const erros: ErrosBriefing = {};
  for (const issue of r.error.issues) {
    const campo = issue.path.join(".") || "_";
    erros[campo] ??= issue.message;
  }
  return { ok: false, erros };
}
