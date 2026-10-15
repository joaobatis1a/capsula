import { MARCA } from "@/lib/marca";
import type { Briefing } from "@/types/briefing";
import type { Checagem, Variacao } from "@/types/variacao";

/* Checklist de governança (#7): as contraindicações da Bula.
   É um conjunto mínimo inspirado na RDC 96/2008 da Anvisa e no código do CONAR, não um parecer jurídico.
   Se qualquer regra falha, a peça fica Bloqueada e a Bula mostra o motivo. */

export const ADVERTENCIA_MIP = "SE PERSISTIREM OS SINTOMAS, O MÉDICO DEVERÁ SER CONSULTADO.";

type PecaParaChecar = Pick<Variacao, "titulo" | "texto" | "cta" | "selo" | "advertencia" | "bula">;

interface Regra {
  id: string;
  ok: string;
  /** Quando a regra não vale para o produto, ela nem aparece na Bula. */
  aplica?: (briefing: Briefing) => boolean;
  checar: (texto: string, peca: PecaParaChecar, briefing: Briefing) => string | null;
}

const TERMOS_PROIBIDOS = [
  "cura",
  "curar",
  "milagre",
  "milagroso",
  "milagrosa",
  "garantido",
  "garantida",
  "100% eficaz",
  "100% eficiente",
  "sem efeitos colaterais",
  "sem contraindicação",
  "sem contraindicações",
  "infalível",
];

const PROMESSAS = [
  /\bem \d+ (dias?|horas?|minutos?)\b/,
  /resultado(s)? (imediato|garantido|definitivo)/,
  /\bacaba com\b/,
  /\belimina de vez\b/,
  /\bpara sempre\b/,
  /\bgarantid[oa]s?\b/,
  /\bo dia (todo|inteiro)\b/,
];

/* Alegações de efeito terapêutico ou de saúde. Dermocosmético, suplemento, higiene e infantil não podem prometer
   prevenir, tratar ou combater doenças, nem emagrecer ou eliminar rugas e manchas (quem pode é medicamento, dentro da bula). */
const ALEGACOES_SAUDE: [RegExp, string][] = [
  [/\bprevin(e|em)\b|\bprevenir\b|\bprevencao de\b/, "previne"],
  [/\btrata(m)?\b|\btratar\b/, "trata"],
  [/\bcombate(m)?\b|\bcombater\b/, "combate"],
  [/\b(fortalece|aumenta|turbina|reforca) (a |as |o |os )?(imunidade|defesas|sistema imunologico|imunologico)\b/, "fortalece a imunidade"],
  [/\bemagrece(r|m)?\b|\bemagrecimento\b|\bqueima (a )?gordura\b|\bdetox\b/, "emagrece"],
  [/\brejuvenesc(e|em|er|imento)\b/, "rejuvenesce"],
  [/\belimina (as |a |os |o )?(rugas|manchas|celulite|estrias|acne|espinhas)\b/, "elimina"],
];

const SUPERLATIVOS = [/\bo melhor\b/, /\ba melhor\b/, /\bnumero 1\b/, /\bn[oº°] ?1\b/, /\bunico do mercado\b/];

const REGRAS: Regra[] = [
  {
    id: "prescricao",
    ok: "Produto pode ser anunciado ao público",
    aplica: (b) => b.tipoProduto.startsWith("medicamento"),
    checar: (_t, _p, b) =>
      b.tipoProduto === "medicamento_prescricao"
        ? "Medicamento com prescrição não pode ter propaganda para o público em geral (RDC 96/2008)"
        : null,
  },
  {
    id: "advertencia-mip",
    ok: "Advertência obrigatória da Anvisa presente",
    aplica: (b) => b.tipoProduto === "medicamento_isento",
    checar: (_t, p, b) => {
      if (b.tipoProduto !== "medicamento_isento") return null;
      return normalizar(p.advertencia ?? "").includes(normalizar(ADVERTENCIA_MIP).replace(/\.$/, ""))
        ? null
        : `Medicamento isento de prescrição precisa da advertência "${ADVERTENCIA_MIP}"`;
    },
  },
  {
    id: "termos-proibidos",
    ok: "Sem termos proibidos (cura, milagre, garantido)",
    checar: (t) => {
      const achado = TERMOS_PROIBIDOS.find((termo) => new RegExp(`(^|[^a-z])${normalizar(termo)}([^a-z]|$)`).test(t));
      return achado ? `Usa o termo proibido "${achado}"` : null;
    },
  },
  {
    id: "promessa",
    ok: "Sem promessa de resultado",
    checar: (t) => (PROMESSAS.some((r) => r.test(t)) ? "Promete resultado ou prazo de efeito" : null),
  },
  {
    id: "diagnostico",
    ok: "Sem diagnóstico ou indicação de tratamento",
    checar: (t) =>
      /voce (tem|esta com) (gripe|dengue|alergia|rinite|infeccao|virose)/.test(t) || /\bdiagnostic/.test(t) || /remedio (para|contra) (a )?dengue/.test(t)
        ? "Faz diagnóstico ou indica tratamento, o que cabe a um profissional de saúde"
        : null,
  },
  {
    id: "alegacao-saude",
    ok: "Sem alegação terapêutica ou de saúde indevida",
    aplica: (b) => !b.tipoProduto.startsWith("medicamento") && b.tipoProduto !== "servico",
    checar: (t) => {
      const achado = ALEGACOES_SAUDE.find(([r]) => r.test(t));
      return achado ? `Faz alegação terapêutica ou de saúde ("${achado[1]}"), que não cabe a este tipo de produto sem comprovação` : null;
    },
  },
  {
    id: "superlativo",
    ok: "Sem superlativo absoluto sem prova",
    checar: (t) => (SUPERLATIVOS.some((r) => r.test(t)) ? "Usa superlativo absoluto (\"o melhor\", \"nº 1\") sem comprovação" : null),
  },
  {
    id: "tom-marca",
    ok: "Dentro do tom de voz do manual de marca",
    checar: (t) => {
      const achado = MARCA.tomDeVoz.evite.find((termo) => new RegExp(`(^|[^a-z])${normalizar(termo)}([^a-z]|$)`).test(t));
      return achado ? `Foge do tom da marca: o manual pede para evitar "${achado}"` : null;
    },
  },
  {
    id: "oferta-validade",
    ok: "Oferta com validade informada",
    checar: (t, _p, b) => {
      const falaDeOferta = /(% ?off|r\$|desconto|promoc|leve \d|pague \d)/.test(t);
      if (!falaDeOferta) return null;
      const [, mes, dia] = b.oferta.validade.split("-");
      const temData = t.includes(`${dia}/${mes}`) || t.includes(`${Number(dia)}/${mes}`) || /valid[oa]s? (ate|por)/.test(t);
      return temData ? null : "Fala de preço ou desconto sem informar a validade da oferta";
    },
  },
];

export function checarPeca(peca: PecaParaChecar, briefing: Briefing): Checagem[] {
  const texto = normalizar([peca.titulo, peca.texto, peca.cta, peca.selo, peca.bula.posologia].filter(Boolean).join(" \n "));
  return REGRAS.filter((r) => !r.aplica || r.aplica(briefing)).map((r) => {
    const falha = r.checar(texto, peca, briefing);
    return { regra: r.id, ok: !falha, texto: falha ?? r.ok };
  });
}

/** Aplica o checklist e define o status: Bloqueado se algo falhou, Rascunho se passou. */
export function aplicarGovernanca<T extends Variacao>(peca: T, briefing: Briefing): T {
  const contraindicacoes = checarPeca(peca, briefing);
  const bloqueada = contraindicacoes.some((c) => !c.ok);
  return { ...peca, bula: { ...peca.bula, contraindicacoes }, status: bloqueada ? "bloqueado" : "rascunho" };
}

/** Minúsculas e sem acentos, para comparar termos. */
export function normalizar(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}
