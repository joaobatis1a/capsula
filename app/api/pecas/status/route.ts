import { z } from "zod";
import { ACOES, transicionar } from "@/lib/governanca/fluxo";
import { briefingSchema } from "@/types/briefing";
import { variacaoSchema, type ErroApi } from "@/types/variacao";

/* POST /api/pecas/status: muda o status de uma peça no fluxo de aprovação.
   Valida a transição e refaz o checklist no servidor. A gravação no banco vem com o Supabase (#18). */

const pedidoSchema = z.object({
  peca: variacaoSchema,
  briefing: briefingSchema,
  acao: z.enum(ACOES),
  por: z.string().max(80),
  motivo: z.string().max(300).optional(),
});

export async function POST(request: Request) {
  const corpo = pedidoSchema.safeParse(await request.json().catch(() => null));
  if (!corpo.success) return Response.json({ erro: "Pedido inválido.", codigo: "validacao" } satisfies ErroApi, { status: 400 });

  const { peca, briefing, acao, por, motivo } = corpo.data;
  const r = transicionar(peca, briefing, { acao, por, motivo });
  if (!r.ok) return Response.json({ erro: r.erro, codigo: "validacao" } satisfies ErroApi, { status: 409 });
  return Response.json({ peca: r.peca, registro: r.registro });
}
