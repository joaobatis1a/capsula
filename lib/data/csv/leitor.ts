/* Leitor de CSV (RFC 4180) sem dependências: aspas, aspas escapadas ("") e quebras de linha dentro de campos.
   O separador é configurável porque CSV brasileiro costuma usar ";". Origem: pacote do Hector, adaptado ao projeto. */

export function parseCsv(texto: string, separador = ","): string[][] {
  const t = texto.charCodeAt(0) === 0xfeff ? texto.slice(1) : texto;
  const linhas: string[][] = [];
  let campo = "";
  let linha: string[] = [];
  let entreAspas = false;

  const fecharCampo = () => {
    linha.push(campo);
    campo = "";
  };
  const fecharLinha = () => {
    fecharCampo();
    if (!(linha.length === 1 && linha[0].trim() === "")) linhas.push(linha);
    linha = [];
  };

  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (entreAspas) {
      if (c === '"') {
        if (t[i + 1] === '"') {
          campo += '"';
          i++;
        } else entreAspas = false;
      } else campo += c;
    } else if (c === '"') entreAspas = true;
    else if (c === separador) fecharCampo();
    else if (c === "\n") fecharLinha();
    else if (c === "\r") {
      if (t[i + 1] === "\n") i++;
      fecharLinha();
    } else campo += c;
  }
  if (campo !== "" || linha.length > 0) fecharLinha();
  return linhas;
}

/** A primeira linha vira cabeçalho; devolve cada linha como objeto coluna → valor. */
export function csvParaRegistros(texto: string, separador: string): { cabecalho: string[]; registros: Record<string, string>[] } {
  const linhas = parseCsv(texto, separador);
  if (linhas.length === 0) return { cabecalho: [], registros: [] };
  const cabecalho = linhas[0].map((c) => c.trim());
  const registros = linhas.slice(1).map((l) => {
    const r: Record<string, string> = {};
    cabecalho.forEach((nome, i) => {
      r[nome] = (l[i] ?? "").trim();
    });
    return r;
  });
  return { cabecalho, registros };
}
