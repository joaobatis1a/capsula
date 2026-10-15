import type { Gancho } from "@/lib/data/types";
import { GANCHOS } from "@/lib/data/types";
import { ROTULO_DIMENSAO } from "@/lib/memoria/ranking";
import type { Briefing } from "@/types/briefing";
import type { Cena, Evidencia } from "@/types/variacao";
import { dataCurta, evidenciaPorId, type Contexto } from "./contexto";
import type { Pedido } from "./prompt";

/* Modo sem IA: quando não há chave ou todos os provedores falham, o motor monta as peças
   com moldes fixos guiados pelo ranking. A tela avisa que a peça veio deste modo. */

export interface PecaBruta {
  canal: Pedido["pecas"][number]["canal"];
  formato: Pedido["pecas"][number]["formato"];
  titulo: string;
  texto: string;
  cta: string;
  selo?: string;
  hashtags: string[];
  indicacao: string;
  composicao: { k: string; v: string }[];
  evidencias: Evidencia[];
  posologia: string;
}

export interface RoteiroBruto {
  titulo: string;
  cenas: Cena[];
  evidencias: Evidencia[];
}

const MOLDES: Record<Gancho, (b: Briefing, validade: string) => { titulo: string; texto: string; cta: string; selo: string }> = {
  pergunta: (b, v) => ({
    titulo: `Já garantiu o seu ${b.produto}?`,
    texto: `${b.oferta.descricao}. Aproveite até ${v}.`,
    cta: "Ver oferta",
    selo: "Oferta",
  }),
  beneficio: (b, v) => ({
    titulo: `${b.produto}: cuidado no seu dia a dia`,
    texto: `Praticidade para a sua rotina, com ${b.oferta.descricao} até ${v}.`,
    cta: "Conhecer",
    selo: "Cuidado diário",
  }),
  oferta_direta: (b, v) => ({
    titulo: b.oferta.descricao,
    texto:
      b.oferta.precoDe && b.oferta.precoPor
        ? `De ${real(b.oferta.precoDe)} por ${real(b.oferta.precoPor)}. Válido até ${v}.`
        : `${b.produto} com condição especial. Válido até ${v}.`,
    cta: "Aproveitar",
    selo: "Oferta",
  }),
  prova_social: (b, v) => ({
    titulo: `${b.produto} para a família toda`,
    texto: `Um cuidado que cabe na rotina de casa. ${b.oferta.descricao} até ${v}.`,
    cta: "Comprar agora",
    selo: "Para a família",
  }),
  urgencia: (b, v) => ({
    titulo: `Até ${v}: ${b.oferta.descricao}`,
    texto: `${b.produto} com condição especial por tempo limitado. Válido até ${v}.`,
    cta: "Garantir o meu",
    selo: `Até ${v}`,
  }),
  humor: (b, v) => ({
    titulo: `Seu ${b.categoria.toLowerCase()} acabou bem na hora?`,
    texto: `Acontece. ${b.oferta.descricao} até ${v}, no app e nas lojas.`,
    cta: "Repor agora",
    selo: "Oferta",
  }),
};

export function gerarSemIA(briefing: Briefing, ctx: Contexto, pedido: Pedido): { pecas: PecaBruta[]; roteiro?: RoteiroBruto } {
  const validade = dataCurta(briefing.oferta.validade);
  const ganchos = ganchosParaPublico(ctx, pedido.publico);
  const tendencia = ctx.radar[0];
  const sazonal = ctx.sazonalidade[0];

  const pecas = pedido.pecas.map((p, i) => {
    const gancho = ganchos[i % ganchos.length];
    const molde = MOLDES[gancho.gancho](briefing, validade);
    const evidencias = [
      gancho.refId ? evidenciaPorId(ctx, gancho.refId, undefined, 0.6) : null,
      tendencia ? evidenciaPorId(ctx, tendencia.id, undefined, 0.2) : null,
      sazonal ? evidenciaPorId(ctx, sazonal.id, undefined, 0.2) : null,
    ].filter((e): e is Evidencia => e !== null);

    return {
      canal: p.canal,
      formato: p.formato,
      ...molde,
      titulo: p.formato === "banner" && molde.titulo.length > 40 ? corte(briefing.oferta.descricao, 40) : molde.titulo,
      hashtags: tendencia?.tipo === "hashtag" ? [tendencia.termo] : [],
      indicacao: `${pedido.publico}, objetivo de ${briefing.objetivo === "conversao" ? "venda" : briefing.objetivo === "awareness" ? "lembrança de marca" : "interesse"}.`,
      composicao: [
        { k: "Gancho", v: capitalizar(ROTULO_DIMENSAO[gancho.gancho]) },
        { k: "Modo", v: "Molde fixo, sem IA" },
      ],
      evidencias,
      posologia: `Publicar de terça a quinta, às 19h. Oferta válida até ${validade}.`,
    };
  });

  const roteiro = pedido.roteiro
    ? {
        titulo: `${pedido.roteiro.plataforma === "reels" ? "Reels" : "TikTok"}: ${briefing.produto}`,
        cenas: cenasPadrao(briefing, pedido.roteiro.duracaoSeg, validade),
        evidencias: ganchos[0].refId ? [evidenciaPorId(ctx, ganchos[0].refId)!].filter(Boolean) : [],
      }
    : undefined;

  return { pecas, roteiro };
}

/** Ganchos em ordem de desempenho para o público, a partir do ranking. Os que falharam vão para o fim. */
function ganchosParaPublico(ctx: Contexto, publico: string): { gancho: Gancho; refId?: string }[] {
  const bons = ctx.melhores
    .filter((i) => i.combinacao.gancho && (!i.combinacao.publico || i.combinacao.publico === publico))
    .map((i) => ({ gancho: i.combinacao.gancho as Gancho, refId: i.id }));
  const ruins = new Set(ctx.piores.filter((i) => i.combinacao.publico === publico && i.combinacao.gancho).map((i) => i.combinacao.gancho));
  const resto = GANCHOS.filter((g) => !ruins.has(g) && !bons.some((b) => b.gancho === g)).map((g) => ({ gancho: g }));
  const lista = [...bons, ...resto].filter((g, i, arr) => arr.findIndex((x) => x.gancho === g.gancho) === i);
  return lista.length ? lista : [{ gancho: "beneficio" }];
}

function cenasPadrao(b: Briefing, duracao: 15 | 30, validade: string): Cena[] {
  const meio = duracao === 15 ? 10 : 22;
  return [
    { inicio: 0, fim: 3, visual: `Close no produto em uso: ${b.produto}`, fala: `Já garantiu o seu ${b.produto}?` },
    { inicio: 3, fim: meio, visual: "Produto na mão, aplicação rápida", tela: b.oferta.descricao },
    { inicio: meio, fim: duracao, visual: "Produto e logo", tela: `Válido até ${validade} · no app e nas lojas` },
  ];
}

function real(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function corte(s: string, max: number) {
  return s.length <= max ? s : s.slice(0, max - 1).trimEnd() + "…";
}

function capitalizar(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
