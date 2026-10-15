import type { Sazonalidade } from "../types";
import { AMBIENTE } from "./saude/ambiente";
import { INFECCIOSAS } from "./saude/infecciosas";
import { RESPIRATORIAS } from "./saude/respiratorias";

/* Base de sazonalidade de saúde (#36): 33 condições com intensidade por mês, variação por região,
   grupos de risco, prevenção, produtos ligados, ângulo de comunicação e fontes públicas.
   É conteúdo informativo para planejar campanhas, não diagnóstico. Confira o boletim vigente antes de publicar. */

export const SAZONALIDADE: Sazonalidade[] = [...RESPIRATORIAS, ...INFECCIOSAS, ...AMBIENTE].sort((a, b) => a.condicao.localeCompare(b.condicao, "pt-BR"));

const ids = new Set<string>();
for (const s of SAZONALIDADE) {
  if (ids.has(s.id)) throw new Error(`Id repetido na base de sazonalidade: ${s.id}`);
  ids.add(s.id);
}
