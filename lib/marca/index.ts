import marcaJson from "./marca.json";

/* Manual de marca sintético (#27): a única fonte de cores, fontes e tom das peças geradas.
   Os templates, o prompt e o checklist leem daqui. Documentado em docs/manual-de-marca.md. */

interface Atributo {
  fonte: string;
  data: string;
}

export interface Cor extends Atributo {
  valor: string;
  uso: string;
}

export interface Marca {
  nome: string;
  aviso: string;
  versao: string;
  atualizadoEm: string;
  cores: Record<"primaria" | "primariaEscura" | "clara" | "destaque" | "texto" | "branco", Cor>;
  tipografia: Record<"titulo" | "texto", Atributo & { familia: string; peso: number; uso: string }>;
  logo: Atributo & { posicao: string; versoes: string; proibido: string };
  tomDeVoz: Atributo & { descricao: string; faca: string[]; evite: string[] };
  pecas: Atributo & { faixaLegal: string; advertencia: string; imagens: string };
}

export const MARCA: Marca = marcaJson;
