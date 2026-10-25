/* O modelo cita evidências pelo id (rad-musica-1, saz-dengue...). O id vai no campo de evidências,
   nunca no texto que o público lê: se escapar para o texto, sai aqui. */

// Só os prefixos de id do sistema: radar (rad-), saúde (saz-) e ranking da memória (rk-). "(18-24)" fica.
const ID_ENTRE_COLCHETES = /\s*[[(](?:rad|saz|rk)-[a-z0-9-]+[\])]/gi;

export function semIds(texto: string): string;
export function semIds(texto: string | undefined): string | undefined;
export function semIds(texto: string | undefined) {
  return texto?.replace(ID_ENTRE_COLCHETES, "").trim();
}
