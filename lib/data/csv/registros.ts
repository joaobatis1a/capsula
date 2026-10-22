import { CANAIS, FORMATOS, TIPOS_PRODUTO } from "@/types/briefing";
import { GANCHOS, TONS, type Campanha, type FormatoCampanha } from "../types";
import { CAMPOS_OBRIGATORIOS, slug, type Mapeamento } from "./mapping";

/* Converte uma linha do CSV (nomes de coluna reais) numa Campanha do contrato.
   Linha inválida não derruba a leitura: vira aviso com o número da linha. Origem: pacote do Hector, adaptado. */

export type ResultadoLinha = { ok: true; valor: Campanha } | { ok: false; erro: string };

const FORMATOS_CAMPANHA: readonly string[] = [...FORMATOS, "video"];
/** Quando o CSV não traz a coluna, a campanha entra como "outros", sem inventar um produto. */
const CATEGORIA_PADRAO = "Sem categoria";
const TIPO_PADRAO = "higiene_beleza";

const pad = (n: number) => String(n).padStart(2, "0");

export function parseNumero(valor: string, decimal: "." | ","): number {
  let s = valor.trim().replace(/[R$\s]/g, "");
  if (s === "") return NaN;
  s = decimal === "," ? s.replace(/\./g, "").replace(",", ".") : s.replace(/,/g, "");
  return Number(s);
}

/** Converte para aaaa-mm-dd ou devolve null se a data não existir. */
export function parseData(valor: string, formato: "iso" | "br"): string | null {
  const m = (formato === "iso" ? /^(\d{4})-(\d{2})-(\d{2})/ : /^(\d{1,2})\/(\d{1,2})\/(\d{4})/).exec(valor.trim());
  if (!m) return null;
  const [a, mes, d] = formato === "iso" ? [+m[1], +m[2], +m[3]] : [+m[3], +m[2], +m[1]];
  const dt = new Date(Date.UTC(a, mes - 1, d));
  return dt.getUTCFullYear() === a && dt.getUTCMonth() === mes - 1 && dt.getUTCDate() === d ? `${a}-${pad(mes)}-${pad(d)}` : null;
}

/** Confere se o cabeçalho tem todas as colunas obrigatórias que o mapping.yaml promete. */
export function validarCabecalho(cabecalho: string[], mapa: Mapeamento): string[] {
  return (CAMPOS_OBRIGATORIOS as readonly string[])
    .filter((campo) => !cabecalho.includes(mapa.colunas[campo]))
    .map((campo) => `A coluna "${mapa.colunas[campo]}" (campo "${campo}") não existe no arquivo. Colunas encontradas: ${cabecalho.join(", ") || "(nenhuma)"}.`);
}

function pegar(reg: Record<string, string>, mapa: Mapeamento, campo: string): string | undefined {
  const coluna = mapa.colunas[campo];
  const v = coluna ? reg[coluna] : undefined;
  return v === undefined || v.trim() === "" ? undefined : v.trim();
}

/** Valor de lista fechada: slug, depois a tradução do mapping.yaml. */
function categorico(reg: Record<string, string>, mapa: Mapeamento, campo: string): string | undefined {
  const bruto = pegar(reg, mapa, campo);
  if (bruto === undefined) return undefined;
  const s = slug(bruto);
  return mapa.valores[campo]?.[s] ?? s;
}

function livre(reg: Record<string, string>, mapa: Mapeamento, campo: string): string | undefined {
  const bruto = pegar(reg, mapa, campo);
  return bruto === undefined ? undefined : (mapa.valores[campo]?.[slug(bruto)] ?? bruto);
}

function inteiro(reg: Record<string, string>, mapa: Mapeamento, campo: string): number | string {
  const v = pegar(reg, mapa, campo);
  if (v === undefined) return `campo "${campo}" vazio`;
  const n = parseNumero(v, mapa.opcoes.decimal);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : `campo "${campo}" inválido ("${v}")`;
}

export function registroParaCampanha(reg: Record<string, string>, mapa: Mapeamento, linha: number): ResultadoLinha {
  const falha = (msg: string): ResultadoLinha => ({ ok: false, erro: `linha ${linha}: ${msg}` });
  for (const campo of CAMPOS_OBRIGATORIOS) if (pegar(reg, mapa, campo) === undefined) return falha(`campo "${campo}" vazio`);

  const data = parseData(pegar(reg, mapa, "data")!, mapa.opcoes.formatoData);
  if (!data) return falha(`data inválida ("${pegar(reg, mapa, "data")}"); esperado ${mapa.opcoes.formatoData === "br" ? "DD/MM/AAAA" : "AAAA-MM-DD"}`);

  const canal = categorico(reg, mapa, "canal")!;
  if (!(CANAIS as readonly string[]).includes(canal)) return falha(`canal "${canal}" fora de ${CANAIS.join(", ")}; traduza em "valores.canal" do mapping.yaml`);
  const formato = categorico(reg, mapa, "formato")!;
  if (!FORMATOS_CAMPANHA.includes(formato)) return falha(`formato "${formato}" fora de ${FORMATOS_CAMPANHA.join(", ")}; traduza em "valores.formato"`);
  const gancho = categorico(reg, mapa, "gancho")!;
  if (!(GANCHOS as readonly string[]).includes(gancho)) return falha(`gancho "${gancho}" fora de ${GANCHOS.join(", ")}; traduza em "valores.gancho"`);
  const tom = categorico(reg, mapa, "tom") ?? "informativo";
  if (!(TONS as readonly string[]).includes(tom)) return falha(`tom "${tom}" fora de ${TONS.join(", ")}; traduza em "valores.tom"`);
  const tipoProduto = categorico(reg, mapa, "tipo_produto") ?? TIPO_PADRAO;
  if (!(TIPOS_PRODUTO as readonly string[]).includes(tipoProduto)) return falha(`tipo de produto "${tipoProduto}" fora de ${TIPOS_PRODUTO.join(", ")}; traduza em "valores.tipo_produto"`);

  const impressoes = inteiro(reg, mapa, "impressoes");
  if (typeof impressoes === "string") return falha(impressoes);
  const cliques = inteiro(reg, mapa, "cliques");
  if (typeof cliques === "string") return falha(cliques);
  if (cliques > impressoes) return falha("cliques maiores que impressões");
  let conversoes = 0;
  if (pegar(reg, mapa, "conversoes") !== undefined) {
    const c = inteiro(reg, mapa, "conversoes");
    if (typeof c === "string") return falha(c);
    conversoes = c;
  }

  return {
    ok: true,
    valor: {
      id: pegar(reg, mapa, "id") ?? `CSV-${String(linha).padStart(5, "0")}`,
      data,
      canal: canal as Campanha["canal"],
      formato: formato as FormatoCampanha,
      publico: livre(reg, mapa, "publico")!,
      gancho: gancho as Campanha["gancho"],
      tom: tom as Campanha["tom"],
      categoria: livre(reg, mapa, "categoria") ?? CATEGORIA_PADRAO,
      tipoProduto: tipoProduto as Campanha["tipoProduto"],
      impressoes,
      cliques,
      conversoes,
      origem: "real",
    },
  };
}
