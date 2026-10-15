import "server-only";
import { createHash } from "node:crypto";
import type { Briefing } from "@/types/briefing";
import type { RespostaGeracao } from "@/types/variacao";

/* Cache das gerações (#24): o mesmo briefing não gasta cota duas vezes.
   Por enquanto fica na memória do servidor (some a cada deploy). A tabela cache_geracao no Supabase vem com a #18. */

const LIMITE = 200;
const memoria = new Map<string, RespostaGeracao>();

export function chaveDoBriefing(b: Briefing) {
  const normalizado = {
    ...b,
    produto: b.produto.toLowerCase(),
    categoria: b.categoria.toLowerCase(),
    publicos: [...b.publicos].map((p) => p.toLowerCase()).sort(),
    canais: [...b.canais].sort(),
    formatos: [...b.formatos].sort(),
    radarIds: [...b.radarIds].sort(),
  };
  return createHash("sha256").update(estavel(normalizado)).digest("hex").slice(0, 32);
}

/** JSON com as chaves sempre na mesma ordem, em todos os níveis. */
function estavel(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(estavel).join(",")}]`;
  if (v && typeof v === "object") {
    return `{${Object.keys(v)
      .sort()
      .filter((k) => (v as Record<string, unknown>)[k] !== undefined)
      .map((k) => `${JSON.stringify(k)}:${estavel((v as Record<string, unknown>)[k])}`)
      .join(",")}}`;
  }
  return JSON.stringify(v);
}

export function lerCache(chave: string) {
  return memoria.get(chave);
}

export function gravarCache(chave: string, resposta: RespostaGeracao) {
  // Não guarda respostas do modo sem IA: quando a chave chegar, a próxima geração usa o modelo.
  if (resposta.modelo === "sem-ia") return;
  if (memoria.size >= LIMITE) memoria.delete(memoria.keys().next().value!);
  memoria.set(chave, resposta);
}
