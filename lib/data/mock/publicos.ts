import type { PublicoSugerido } from "../types";

/* Públicos sugeridos no Estúdio (#35). São perfis de trabalho do time, não dados da empresa. */

export const PUBLICOS: PublicoSugerido[] = [
  {
    id: "jovens-18-24",
    nome: "Jovens de 18 a 24",
    faixaEtaria: "18–24",
    momento: "Faculdade e primeiro emprego",
    necessidades: ["pele e acne", "proteção solar", "preço baixo"],
  },
  {
    id: "adultos-25-34",
    nome: "Adultos de 25 a 34",
    faixaEtaria: "25–34",
    momento: "Rotina corrida",
    necessidades: ["praticidade", "cuidados com a pele", "vitaminas"],
  },
  {
    id: "maes-filhos-pequenos",
    nome: "Mães e pais de crianças pequenas",
    faixaEtaria: "25–40",
    momento: "Filhos de 0 a 6 anos",
    necessidades: ["infantil e maternidade", "febre e resfriado", "higiene"],
  },
  {
    id: "adultos-35-59-cronicos",
    nome: "Adultos de 35 a 59 com uso contínuo",
    faixaEtaria: "35–59",
    momento: "Cuidam de condição crônica",
    necessidades: ["recorrência", "programa de fidelidade", "serviços da farmácia"],
  },
  {
    id: "60-mais",
    nome: "Pessoas com 60 anos ou mais",
    faixaEtaria: "60+",
    momento: "Saúde em primeiro lugar",
    necessidades: ["clareza", "atendimento", "entrega em casa"],
  },
  {
    id: "esportistas",
    nome: "Quem pratica esporte",
    faixaEtaria: "18–45",
    momento: "Treino e corrida",
    necessidades: ["hidratação", "suplementos", "proteção solar"],
  },
];
