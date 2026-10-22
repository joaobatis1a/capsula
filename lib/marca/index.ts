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

export type Tema = "claro" | "escuro" | "sistema";

export interface PaletaCores {
  primaria: Cor;
  primariaEscura: Cor;
  clara: Cor;
  destaque: Cor;
  texto: Cor;
  branco: Cor;
}

export interface Marca {
  nome: string;
  aviso: string;
  versao: string;
  atualizadoEm: string;
  cores: {
    claro: PaletaCores;
    escuro: PaletaCores;
  };
  tipografia: Record<"titulo" | "texto", Atributo & { familia: string; peso: number; uso: string }>;
  logo: Atributo & { posicao: string; versoes: string; proibido: string };
  tomDeVoz: Atributo & { descricao: string; faca: string[]; evite: string[] };
  pecas: Atributo & { faixaLegal: string; advertencia: string; imagens: string };
}

export const MARCA: Marca = marcaJson as Marca;

/** Retorna a paleta de cores para o tema indicado. */
export function getPaleta(tema: Tema): PaletaCores {
  if (tema === "sistema") {
    return MARCA.cores[detectarTemaSistema()];
  }
  return MARCA.cores[tema as "claro" | "escuro"];
}

/** Gera o objeto de variáveis CSS para injeção no template. */
export function getVariaveisCSS(tema: Tema): Record<string, string> {
  const p = getPaleta(tema);
  return {
    "--m-primaria": p.primaria.valor,
    "--m-primaria-escura": p.primariaEscura.valor,
    "--m-clara": p.clara.valor,
    "--m-destaque": p.destaque.valor,
    "--m-texto": p.texto.valor,
    "--m-branco": p.branco.valor,
  };
}

/** Detecta tema do sistema (para uso client-side). */
export function detectarTemaSistema(): "claro" | "escuro" {
  if (typeof window === "undefined") return "claro";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "escuro" : "claro";
}