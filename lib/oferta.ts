/* Desconto da oferta: sai dos dois preços, ninguém precisa digitar "20% off". */

export type Desconto = { tipo: "vazio" } | { tipo: "invalido" } | { tipo: "ok"; percentual: number; economia: number };

/** "79,90" ou "79.90" → 79.9; vazio ou inválido → undefined. */
export function lerPreco(texto: string): number | undefined {
  const s = texto.trim().replace(/[R$\s]/g, "");
  if (!s) return undefined;
  const n = Number(s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export function calcularDesconto(precoDe: number | undefined, precoPor: number | undefined): Desconto {
  if (precoDe == null || precoPor == null) return { tipo: "vazio" };
  if (precoPor >= precoDe) return { tipo: "invalido" };
  return { tipo: "ok", percentual: Math.max(1, Math.round(((precoDe - precoPor) / precoDe) * 100)), economia: Math.round((precoDe - precoPor) * 100) / 100 };
}

/** O texto da oferta que o motor recebe, montado a partir dos preços ("20% off em Protetor solar"). */
export function descricaoDaOferta(produto: string, precoDe: number | undefined, precoPor: number | undefined): string {
  const nome = produto.trim() || "o produto";
  const d = calcularDesconto(precoDe, precoPor);
  if (d.tipo === "ok") return `${d.percentual}% off em ${nome}`;
  if (precoPor != null) return `${nome} por ${reais(precoPor)}`;
  return `Oferta em ${nome}`;
}

export function reais(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
