import { getDataSource } from "@/lib/data";
import { chaveDoBriefing, gravarCache, lerCache } from "@/lib/motor/cache";
import { gerar } from "@/lib/motor/gerar";
import { validarBriefing } from "@/types/briefing";
import type { ErroApi, RespostaGeracao } from "@/types/variacao";

/* POST /api/gerar: recebe o briefing e devolve as variações com Bula (contrato em types/variacao.ts). */

export const maxDuration = 60;

export async function POST(request: Request) {
  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return erro({ erro: "O corpo da requisição não é um JSON válido.", codigo: "validacao" }, 400);
  }

  const v = validarBriefing(corpo);
  if (!v.ok) return erro({ erro: "Confira os campos do briefing.", codigo: "validacao", campos: v.erros as Record<string, string> }, 400);

  const chave = chaveDoBriefing(v.briefing);
  const emCache = lerCache(chave);
  if (emCache) return Response.json({ ...emCache, doCache: true } satisfies RespostaGeracao);

  try {
    const resposta: RespostaGeracao = { ...(await gerar(v.briefing, getDataSource())), doCache: false };
    gravarCache(chave, resposta);
    return Response.json(resposta);
  } catch (e) {
    console.error("[gerar]", e);
    return erro({ erro: "Não conseguimos gerar agora. Tente de novo em instantes.", codigo: "interno" }, 500);
  }
}

function erro(corpo: ErroApi, status: number) {
  return Response.json(corpo, { status });
}
