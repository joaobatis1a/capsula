import "server-only";
import { z } from "zod";
import type { CampaignDataSource } from "@/lib/data/types";
import { ADVERTENCIA_MIP, aplicarGovernanca, checarRoteiro } from "@/lib/governanca/checklist";
import { completarJSON, lerJSON, ProvedoresFalharamError, temProvedor, TETO_MS } from "@/lib/llm/client";
import type { Briefing } from "@/types/briefing";
import { roteiroSchema, variacaoSchema, type Evidencia, type RespostaGeracao, type Roteiro, type Variacao } from "@/types/variacao";
import { calcularDose, evidenciaPorId, formatosPara, montarContexto, type Contexto } from "./contexto";
import { montarPrompt, SISTEMA, type Pedido } from "./prompt";
import { gerarSemIA, type PecaBruta, type RoteiroBruto } from "./sem-ia";
import { semIds } from "./texto";

/* Motor de geração (#23): briefing + contexto → variações com Bula, dose e governança.
   Nunca quebra: se o modelo falha, aquele público sai pelo modo sem IA, com aviso. */

const MAX_PECAS = 24;

const pecaLLM = z.object({
  titulo: z.string(),
  texto: z.string(),
  cta: z.string(),
  selo: z.string().optional().nullable(),
  hashtags: z.array(z.string()).optional().nullable(),
  indicacao: z.string().optional().nullable(),
  composicao: z.array(z.object({ k: z.string(), v: z.string() })).optional().nullable(),
  evidencias: z.array(z.object({ refId: z.string(), texto: z.string().optional(), peso: z.number().optional() })).optional().nullable(),
  posologia: z.string().optional().nullable(),
});

const respostaLLM = z.object({
  variacoes: z.array(pecaLLM),
  roteiros: z
    .array(
      z.object({
        titulo: z.string(),
        cenas: z.array(z.object({ inicio: z.number(), fim: z.number(), visual: z.string(), fala: z.string().optional().nullable(), tela: z.string().optional().nullable() })),
        evidencias: z.array(z.object({ refId: z.string(), texto: z.string().optional(), peso: z.number().optional() })).optional().nullable(),
      }),
    )
    .optional()
    .nullable(),
});

export async function gerar(briefing: Briefing, fonte: CampaignDataSource): Promise<Omit<RespostaGeracao, "doCache">> {
  const ctx = await montarContexto(briefing, fonte);
  const { pedidos, avisos } = planejar(briefing);
  const usarIA = temProvedor();
  if (!usarIA) avisos.push("Nenhuma chave de modelo configurada: as peças vieram de moldes fixos, sem IA.");

  let modelo = usarIA ? "" : "sem-ia";
  // Um só prazo para todas as chamadas ao modelo (inclusive as repetidas), para a função da Vercel não passar de 60s.
  const prazo = Date.now() + TETO_MS;
  const resultados = await Promise.all(
    pedidos.map(async (pedido) => {
      // Pedido só de roteiro comercial: sai do molde, para gastar uma chamada ao modelo por público e não três.
      if (!usarIA || pedido.pecas.length === 0) return { pedido, ...gerarSemIA(briefing, ctx, pedido), ia: false };
      // O modelo às vezes devolve um JSON malformado ou fora do formato: uma segunda tentativa costuma resolver,
      // e só depois disso o público cai nos moldes fixos.
      let ultimoErro: unknown;
      for (let tentativa = 0; tentativa < 2; tentativa++) {
        try {
          const r = await completarJSON([
            { role: "system", content: SISTEMA },
            { role: "user", content: montarPrompt(briefing, ctx, pedido) },
          ], { prazo });
          const bruto = respostaLLM.parse(lerJSON(r.texto));
          avisos.push(...r.avisos);
          modelo = `${r.provedor}:${r.modelo}`;
          return { pedido, ...converterLLM(bruto, pedido, ctx, briefing), ia: true };
        } catch (e) {
          ultimoErro = e;
          // Sem resposta de nenhum modelo (cota, rede): tentar de novo não ajuda.
          if (e instanceof ProvedoresFalharamError) break;
        }
      }
      avisos.push(`O modelo falhou para "${pedido.publico}" (${ultimoErro instanceof Error ? ultimoErro.message.slice(0, 120) : "erro"}). Usamos os moldes fixos.`);
      return { pedido, ...gerarSemIA(briefing, ctx, pedido), ia: false };
    }),
  );
  if (usarIA && resultados.some((r) => !r.ia && r.pedido.pecas.length > 0) && !modelo) modelo = "sem-ia";

  const variacoes: Variacao[] = [];
  const roteiros: Roteiro[] = [];
  let n = 0;
  for (const { pedido, pecas, roteiro } of resultados) {
    pecas.forEach((p) => {
      variacoes.push(montarVariacao(p, `var-${String(++n).padStart(3, "0")}`, pedido.publico, briefing, ctx));
    });
    if (roteiro && pedido.roteiro) {
      const r = montarRoteiro(roteiro, `rot-${roteiros.length + 1}`, pedido, ctx, briefing);
      if (r) roteiros.push(r);
    }
  }

  return { briefing, variacoes, roteiros, geradoEm: new Date().toISOString(), modelo, avisos: [...new Set(avisos)] };
}

/** Quantas peças por público, canal e formato. Limita o total para caber na cota. */
function planejar(briefing: Briefing): { pedidos: Pedido[]; avisos: string[] } {
  const avisos: string[] = [];
  let porCanal = briefing.variacoesPorCanal;
  const combinacoes = briefing.publicos.length * briefing.canais.length;
  if (combinacoes * porCanal > MAX_PECAS) {
    porCanal = Math.max(1, Math.floor(MAX_PECAS / combinacoes));
    avisos.push(`Para caber na cota, geramos ${porCanal} variação(ões) por canal e público, em vez de ${briefing.variacoesPorCanal}.`);
  }
  const plataformaSocial = briefing.canais.includes("tiktok") ? ("tiktok" as const) : ("reels" as const);

  const pedidos: Pedido[] = briefing.publicos.flatMap((publico) => [
    // Pedido 1: peças normais + roteiro social (Reels ou TikTok) 15s
    {
      publico,
      pecas: briefing.canais.flatMap((canal) => {
        const formatos = formatosPara(canal, briefing.formatos);
        return Array.from({ length: porCanal }, (_, i) => ({ canal, formato: formatos[i % formatos.length] }));
      }),
      roteiro: briefing.incluirRoteiros ? { plataforma: plataformaSocial, duracaoSeg: 15 as const } : undefined,
    },
    // Pedido 2: apenas roteiro Comercial 15s (sem peças duplicadas)
    {
      publico,
      pecas: [],
      roteiro: briefing.incluirRoteiros ? { plataforma: "comercial" as const, duracaoSeg: 15 as const } : undefined,
    },
    // Pedido 3: apenas roteiro Comercial 30s (sem peças duplicadas)
    {
      publico,
      pecas: [],
      roteiro: briefing.incluirRoteiros ? { plataforma: "comercial" as const, duracaoSeg: 30 as const } : undefined,
    },
  ]);
  return { pedidos, avisos };
}

function converterLLM(bruto: z.infer<typeof respostaLLM>, pedido: Pedido, ctx: Contexto, briefing: Briefing): { pecas: PecaBruta[]; roteiro?: RoteiroBruto } {
  const reserva = gerarSemIA(briefing, ctx, pedido);
  const pecas = pedido.pecas.map((p, i) => {
    const v = bruto.variacoes[i];
    if (!v) return reserva.pecas[i];
    const evidencias = (v.evidencias ?? []).map((e) => evidenciaPorId(ctx, e.refId, e.texto, limitar(e.peso ?? 0.5, 0, 1))).filter((e): e is Evidencia => e !== null);
    return {
      canal: p.canal,
      formato: p.formato,
      titulo: corte(semIds(v.titulo), p.formato === "banner" ? 40 : 90),
      texto: corte(semIds(v.texto), 400),
      cta: corte(semIds(v.cta), 40),
      selo: v.selo ? corte(semIds(v.selo), 24) : undefined,
      hashtags: (v.hashtags ?? []).slice(0, 6),
      indicacao: v.indicacao || reserva.pecas[i].indicacao,
      composicao: v.composicao?.length ? v.composicao.slice(0, 5) : reserva.pecas[i].composicao,
      evidencias: evidencias.length ? evidencias : reserva.pecas[i].evidencias,
      posologia: v.posologia || reserva.pecas[i].posologia,
    };
  });

  const r = bruto.roteiros?.[0];
  const roteiro = r
    ? {
        titulo: semIds(r.titulo),
        cenas: r.cenas.map((c) => ({ ...c, visual: semIds(c.visual), fala: semIds(c.fala ?? undefined), tela: semIds(c.tela ?? undefined) })),
        evidencias: (r.evidencias ?? []).map((e) => evidenciaPorId(ctx, e.refId, e.texto, limitar(e.peso ?? 1, 0, 1))).filter((e): e is Evidencia => e !== null),
      }
    : reserva.roteiro;
  return { pecas, roteiro };
}

function montarVariacao(p: PecaBruta, id: string, publico: string, briefing: Briefing, ctx: Contexto): Variacao {
  const candidata = {
    id,
    publico,
    canal: p.canal,
    formato: p.formato,
    titulo: p.titulo,
    texto: p.texto,
    cta: p.cta,
    selo: p.selo,
    hashtags: p.hashtags,
    advertencia: briefing.tipoProduto === "medicamento_isento" ? ADVERTENCIA_MIP : undefined,
    dose: calcularDose(p.evidencias),
    bula: { indicacao: p.indicacao, composicao: p.composicao, evidencias: p.evidencias, contraindicacoes: [], posologia: p.posologia },
    status: "rascunho" as const,
  };
  const ok = variacaoSchema.safeParse(candidata);
  if (ok.success) return aplicarGovernanca(ok.data, briefing);

  // Peça fora do contrato: usa o molde fixo para não quebrar a galeria.
  const reserva = gerarSemIA(briefing, ctx, { publico, pecas: [{ canal: p.canal, formato: p.formato }] }).pecas[0];
  return montarVariacao(reserva, id, publico, briefing, ctx);
}

function montarRoteiro(r: RoteiroBruto, id: string, pedido: Pedido, ctx: Contexto, briefing: Briefing): Roteiro | null {
  const duracao = pedido.roteiro!.duracaoSeg;
  const cenas = [...r.cenas].sort((a, b) => a.inicio - b.inicio);
  if (cenas.length) {
    cenas[0] = { ...cenas[0], inicio: 0, fim: Math.min(cenas[0].fim, 3) };
    cenas[cenas.length - 1] = { ...cenas[cenas.length - 1], fim: duracao };
  }
  // Medicamento isento de prescrição: a advertência da Anvisa fecha o vídeo, como nas peças.
  if (briefing.tipoProduto === "medicamento_isento" && cenas.length) {
    const ultima = cenas[cenas.length - 1];
    if (!(ultima.tela ?? "").includes(ADVERTENCIA_MIP)) cenas[cenas.length - 1] = { ...ultima, tela: [ultima.tela, ADVERTENCIA_MIP].filter(Boolean).join(" · ") };
  }
  const musica = ctx.musicas.find((m) => m.usoComercial);
  const candidato = {
    id,
    publico: pedido.publico,
    plataforma: pedido.roteiro!.plataforma,
    duracaoSeg: duracao,
    titulo: r.titulo,
    cenas,
    musica: musica ? { titulo: musica.termo, artista: musica.artista ?? "—", radarId: musica.id, usoComercial: true } : undefined,
    evidencias: [...r.evidencias, ...(musica ? [evidenciaPorId(ctx, musica.id, `Música liberada para uso comercial: ${musica.termo}`, 0.3)!] : [])],
  };
  const ok = roteiroSchema.safeParse(candidato);
  if (ok.success) return { ...ok.data, contraindicacoes: checarRoteiro(ok.data, briefing) };
  const reserva = gerarSemIA(briefing, ctx, pedido).roteiro;
  return reserva && reserva !== r ? montarRoteiro(reserva, id, pedido, ctx, briefing) : null;
}

function corte(s: string, max: number) {
  const t = s.trim();
  return t.length <= max ? t : t.slice(0, max - 1).trimEnd() + "…";
}

function limitar(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
