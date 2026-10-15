import type { Agente, CategoriaSaude, FonteSaude, Regiao, Sazonalidade } from "../../types";
import type { TipoProduto } from "@/types/briefing";

/* Construtor da base de sazonalidade de saúde.
   Cada condição escreve a intensidade como 12 dígitos (jan a dez): 0 fora de época, 1 baixa, 2 moderada, 3 pico.
   As faixas são um padrão geral aproximado, montado a partir de boletins e páginas públicas. Confira o boletim vigente antes de uma campanha. */

export const PUBLICO = {
  jovem: "Jovens de 18 a 24",
  adulto: "Adultos de 25 a 34",
  familia: "Mães e pais de crianças pequenas",
  cronico: "Adultos de 35 a 59 com uso contínuo",
  idoso: "Pessoas com 60 anos ou mais",
  esporte: "Quem pratica esporte",
} as const;

export const GOV = "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z";

export const fonteGov = (caminho: string, nome: string): FonteSaude => ({ nome: `Ministério da Saúde · ${nome}`, url: `${GOV}/${caminho}` });
export const MS: FonteSaude = { nome: "Ministério da Saúde", url: "https://www.gov.br/saude/pt-br" };
export const SBP: FonteSaude = { nome: "Sociedade Brasileira de Pediatria", url: "https://www.sbp.com.br" };
export const SBD: FonteSaude = { nome: "Sociedade Brasileira de Dermatologia", url: "https://www.sbd.org.br" };
export const ASBAI: FonteSaude = { nome: "Associação Brasileira de Alergia e Imunologia", url: "https://asbai.org.br" };
export const CBO: FonteSaude = { nome: "Conselho Brasileiro de Oftalmologia", url: "https://www.cbo.net.br" };
export const INFODENGUE: FonteSaude = { nome: "InfoDengue (Fiocruz e FGV)", url: "https://info.dengue.mat.br" };
export const INFOGRIPE: FonteSaude = { nome: "InfoGripe (Fiocruz)" };
export const VACINACAO: FonteSaude = { nome: "Ministério da Saúde · Vacinação", url: "https://www.gov.br/saude/pt-br/vacinacao" };

interface Entrada {
  id: string;
  condicao: string;
  categoriaSaude: CategoriaSaude;
  agente: Agente;
  resumo: string;
  /** 12 dígitos, jan a dez. */
  meses: string;
  porRegiao?: Partial<Record<Regiao, string>>;
  regiao: string;
  gruposRisco: string[];
  sintomas: string[];
  prevencao: string[];
  vacina?: string;
  categorias: string[];
  produtosExemplo: string[];
  tiposProduto: TipoProduto[];
  publicos: string[];
  angulo: string;
  cuidado: string;
  fontes: FonteSaude[];
}

function ler(meses: string, id: string) {
  if (!/^[0-3]{12}$/.test(meses)) throw new Error(`Intensidade inválida em ${id}: "${meses}" (use 12 dígitos de 0 a 3).`);
  return [...meses].map(Number);
}

function picos(intensidade: number[]) {
  const alvo = intensidade.includes(3) ? 3 : 2;
  return intensidade.flatMap((v, i) => (v >= alvo ? [i + 1] : []));
}

export function condicao(e: Entrada): Sazonalidade {
  const intensidade = ler(e.meses, e.id);
  const porRegiao = e.porRegiao ? Object.fromEntries(Object.entries(e.porRegiao).map(([r, m]) => [r, ler(m!, `${e.id}/${r}`)])) : undefined;
  return {
    id: e.id,
    condicao: e.condicao,
    categoriaSaude: e.categoriaSaude,
    agente: e.agente,
    resumo: e.resumo,
    intensidade,
    porRegiao,
    mesesPico: picos(intensidade),
    regiao: e.regiao,
    gruposRisco: e.gruposRisco,
    sintomas: e.sintomas,
    prevencao: e.prevencao,
    vacina: e.vacina,
    categorias: e.categorias,
    produtosExemplo: e.produtosExemplo,
    tiposProduto: e.tiposProduto,
    publicos: e.publicos,
    angulo: e.angulo,
    cuidado: e.cuidado,
    fontes: e.fontes,
    fonte: e.fontes[0].nome,
    fonteUrl: e.fontes[0].url ?? MS.url!,
    origem: "publico",
  };
}

/** Aviso que vale para todas: o texto da peça nunca diagnostica nem indica tratamento. */
export const CUIDADO_PADRAO = "Não faça diagnóstico nem indique tratamento. Convide a procurar o farmacêutico ou o médico.";
