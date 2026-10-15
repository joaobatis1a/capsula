import { REGIOES, type Agente, type CategoriaSaude, type Regiao, type Sazonalidade } from "@/lib/data/types";

export const MESES_CURTOS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
export const MESES_LETRA = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
export const MESES_NOME = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

export const ROTULO_CATEGORIA: Record<CategoriaSaude, string> = {
  respiratoria: "Respiratórias",
  arbovirose: "Arboviroses",
  gastrointestinal: "Gastrointestinais",
  infecciosa: "Infecciosas",
  pele: "Pele",
  olhos: "Olhos",
  alergia: "Alergias",
  infantil: "Infantis",
  cronica: "Crônicas",
  "bem-estar": "Bem-estar e clima",
};

export const ROTULO_AGENTE: Record<Agente, string> = {
  virus: "Vírus",
  bacteria: "Bactéria",
  fungo: "Fungo",
  parasita: "Parasita",
  alergeno: "Alérgeno",
  ambiental: "Clima e ambiente",
  misto: "Causas mistas",
};

export const ROTULO_REGIAO: Record<Regiao, string> = {
  norte: "Norte",
  nordeste: "Nordeste",
  "centro-oeste": "Centro-Oeste",
  sudeste: "Sudeste",
  sul: "Sul",
};

export const NIVEL = ["Fora de época", "Baixa", "Moderada", "Pico"] as const;

/** A intensidade de cada mês para uma região. Sem região, o padrão geral. */
export function intensidadeDe(s: Sazonalidade, regiao: Regiao | "todas") {
  if (regiao === "todas") return s.intensidade;
  return s.porRegiao?.[regiao] ?? s.intensidade;
}

/** Quanto a condição pede atenção em um mês, olhando o mês e o seguinte. */
export function atencao(s: Sazonalidade, mes: number, regiao: Regiao | "todas" = "todas") {
  const v = intensidadeDe(s, regiao);
  return Math.max(v[mes - 1], v[mes % 12] - 1);
}

export { REGIOES };
