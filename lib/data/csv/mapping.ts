/* mapping.yaml: liga as colunas reais do CSV da empresa aos campos do contrato (lib/data/types.ts).
   Trocar de CSV é trocar este arquivo, nunca o código. Origem: pacote do Hector, adaptado ao projeto. */

export const CAMPOS_OBRIGATORIOS = ["data", "canal", "formato", "publico", "gancho", "impressoes", "cliques"] as const;
export const CAMPOS_OPCIONAIS = ["id", "tom", "categoria", "tipo_produto", "conversoes"] as const;
/** Campos de lista fechada: o valor passa por `slug` e pode ser traduzido em `valores:`. */
export const CAMPOS_CATEGORICOS = ["canal", "formato", "gancho", "tom", "tipo_produto"] as const;
/** Campos de texto livre (o nome do público e da categoria aparecem na tela): só a tradução em `valores:` mexe neles. */
export const CAMPOS_LIVRES = ["publico", "categoria"] as const;

export interface OpcoesCsv {
  separador: string;
  formatoData: "iso" | "br";
  decimal: "." | ",";
}

export interface Mapeamento {
  /** campo do contrato → nome da coluna real */
  colunas: Record<string, string>;
  /** campo → (valor real em slug → valor do contrato em slug) */
  valores: Record<string, Record<string, string>>;
  opcoes: OpcoesCsv;
}

/** "Prova Social" → "prova_social"; "25 a 34 anos" → "25_a_34_anos". */
export function slug(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/* ---------- Mini leitor de YAML (só mapas aninhados "chave: valor") ---------- */

interface YamlMapa {
  [chave: string]: string | YamlMapa;
}

function removerComentario(linha: string): string {
  let aspas: string | null = null;
  for (let i = 0; i < linha.length; i++) {
    const c = linha[i];
    if (aspas) {
      if (c === aspas) aspas = null;
    } else if (c === '"' || c === "'") aspas = c;
    else if (c === "#" && (i === 0 || /\s/.test(linha[i - 1]))) return linha.slice(0, i);
  }
  return linha;
}

function desaspar(v: string): string {
  const t = v.trim();
  return t.length >= 2 && (t[0] === '"' || t[0] === "'") && t[t.length - 1] === t[0] ? t.slice(1, -1) : t;
}

function separarChaveValor(linha: string, numero: number): [string, string] {
  if (linha[0] === '"' || linha[0] === "'") {
    const fim = linha.indexOf(linha[0], 1);
    if (fim < 0 || linha[fim + 1] !== ":") throw new Error(`mapping.yaml, linha ${numero}: chave entre aspas mal formada: ${linha}`);
    return [linha.slice(1, fim), linha.slice(fim + 2).trim()];
  }
  const i = linha.indexOf(":");
  if (i < 0) throw new Error(`mapping.yaml, linha ${numero}: esperado "chave: valor", encontrado: ${linha}`);
  return [linha.slice(0, i).trim(), linha.slice(i + 1).trim()];
}

/** Suporta comentários (#), aspas e aninhamento por indentação. Não suporta listas nem âncoras. */
export function parseYamlSimples(texto: string): YamlMapa {
  const raiz: YamlMapa = {};
  const pilha: { indent: number; obj: YamlMapa }[] = [{ indent: -1, obj: raiz }];
  texto.split(/\r?\n/).forEach((bruta, idx) => {
    const linha = removerComentario(bruta);
    if (linha.trim() === "") return;
    if (/^\s*\t/.test(linha)) throw new Error(`mapping.yaml, linha ${idx + 1}: use espaços, não tabs, para indentar`);
    const indent = linha.length - linha.trimStart().length;
    const [chave, valorBruto] = separarChaveValor(linha.trim(), idx + 1);
    while (pilha.length > 1 && indent <= pilha[pilha.length - 1].indent) pilha.pop();
    const pai = pilha[pilha.length - 1].obj;
    if (valorBruto === "") {
      const filho: YamlMapa = {};
      pai[chave] = filho;
      pilha.push({ indent, obj: filho });
    } else pai[chave] = desaspar(valorBruto);
  });
  return raiz;
}

export function carregarMapeamento(textoYaml: string): Mapeamento {
  const sec = parseYamlSimples(textoYaml).campanhas;
  if (!sec || typeof sec !== "object") throw new Error('mapping.yaml: falta a seção "campanhas:".');

  const colunasNo = sec.colunas;
  if (!colunasNo || typeof colunasNo !== "object") throw new Error('mapping.yaml: falta "campanhas.colunas".');
  const validos: readonly string[] = [...CAMPOS_OBRIGATORIOS, ...CAMPOS_OPCIONAIS];
  const colunas: Record<string, string> = {};
  for (const [campo, real] of Object.entries(colunasNo)) {
    if (!validos.includes(campo)) throw new Error(`mapping.yaml: "campanhas.colunas.${campo}" não existe no contrato. Campos válidos: ${validos.join(", ")}.`);
    if (typeof real !== "string" || real === "") throw new Error(`mapping.yaml: "campanhas.colunas.${campo}" precisa do nome de uma coluna.`);
    colunas[campo] = real;
  }
  for (const campo of CAMPOS_OBRIGATORIOS) {
    if (!colunas[campo]) throw new Error(`mapping.yaml: falta mapear o campo obrigatório "${campo}" em "campanhas.colunas".`);
  }

  const valores: Record<string, Record<string, string>> = {};
  if (sec.valores && typeof sec.valores === "object") {
    for (const [campo, tabela] of Object.entries(sec.valores)) {
      if (typeof tabela !== "object") throw new Error(`mapping.yaml: "campanhas.valores.${campo}" deve ser uma tabela "valor real: valor do contrato".`);
      valores[campo] = {};
      const livre = (CAMPOS_LIVRES as readonly string[]).includes(campo);
      for (const [de, para] of Object.entries(tabela)) valores[campo][slug(de)] = livre ? String(para) : slug(String(para));
    }
  }

  if (sec.formato_data !== undefined && sec.formato_data !== "br" && sec.formato_data !== "iso") {
    throw new Error('mapping.yaml: "campanhas.formato_data" deve ser "iso" ou "br".');
  }
  return {
    colunas,
    valores,
    opcoes: {
      separador: typeof sec.separador === "string" && sec.separador !== "" ? sec.separador : ",",
      formatoData: sec.formato_data === "br" ? "br" : "iso",
      decimal: sec.decimal === "," ? "," : ".",
    },
  };
}
