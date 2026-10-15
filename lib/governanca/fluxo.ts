import type { Briefing } from "@/types/briefing";
import type { StatusPeca, Variacao } from "@/types/variacao";
import { aplicarGovernanca } from "./checklist";

/* Fluxo de aprovação (#8): Rascunho → Em revisão → Aprovado → Publicado.
   Só uma pessoa aprova. Peça bloqueada pelo checklist não avança.
   O servidor refaz o checklist antes de cada mudança: o status que vem da tela não é confiável. */

export const ACOES = ["enviar", "aprovar", "devolver", "publicar"] as const;
export type Acao = (typeof ACOES)[number];

export interface Registro {
  de: StatusPeca;
  para: StatusPeca;
  acao: Acao;
  por: string;
  em: string;
  motivo?: string;
}

const TRANSICOES: Record<Acao, { de: StatusPeca[]; para: StatusPeca }> = {
  enviar: { de: ["rascunho"], para: "revisao" },
  aprovar: { de: ["revisao"], para: "aprovado" },
  devolver: { de: ["revisao", "aprovado"], para: "rascunho" },
  publicar: { de: ["aprovado"], para: "publicado" },
};

export const ROTULO_ACAO: Record<Acao, string> = {
  enviar: "Enviar para revisão",
  aprovar: "Aprovar",
  devolver: "Devolver",
  publicar: "Publicar",
};

/** Ações possíveis para um status. Peça bloqueada não tem nenhuma. */
export function acoesPara(status: StatusPeca): Acao[] {
  return ACOES.filter((a) => TRANSICOES[a].de.includes(status));
}

export type ResultadoTransicao = { ok: true; peca: Variacao; registro: Registro } | { ok: false; erro: string };

export function transicionar(
  peca: Variacao,
  briefing: Briefing,
  pedido: { acao: Acao; por: string; motivo?: string },
  agora = new Date(),
): ResultadoTransicao {
  // Refaz o checklist sobre o conteúdo atual, mantendo o status do fluxo.
  const checada = aplicarGovernanca(peca, briefing);
  if (checada.status === "bloqueado") {
    return { ok: false, erro: "A peça está bloqueada pelo checklist e não pode avançar. Veja as contraindicações na Bula." };
  }
  const atual = peca.status === "bloqueado" ? "rascunho" : peca.status;
  const regra = TRANSICOES[pedido.acao];
  if (!regra.de.includes(atual)) {
    return { ok: false, erro: `Não é possível "${ROTULO_ACAO[pedido.acao].toLowerCase()}" uma peça em "${atual}".` };
  }
  const por = pedido.por.trim();
  if (por.length < 2) return { ok: false, erro: "Informe o nome de quem está fazendo a mudança." };
  if (pedido.acao === "devolver" && !pedido.motivo?.trim()) return { ok: false, erro: "Diga o motivo da devolução." };

  const registro: Registro = { de: atual, para: regra.para, acao: pedido.acao, por, em: agora.toISOString(), motivo: pedido.motivo?.trim() || undefined };
  return { ok: true, peca: { ...checada, status: regra.para }, registro };
}
