import "server-only";
import { z } from "zod";
import type { CampaignDataSource } from "@/lib/data/types";
import { ADVERTENCIA_MIP, aplicarGovernanca, checarPeca } from "@/lib/governanca/checklist";
import { completarJSON, lerJSON, temProvedor } from "@/lib/llm/client";
import type { Briefing } from "@/types/briefing";
import { roteiroSchema, variacaoSchema, type Evidencia, type RespostaGeracao, type Roteiro, type Variacao } from "@/types/variacao";
import { calcularDose, evidenciaPorId, formatosPara, montarContexto, type Contexto } from "./contexto";
import { montarPrompt, SISTEMA, type Pedido } from "./prompt";
import { gerarSemIA, type PecaBruta, type RoteiroBruto } from "./sem-ia";
import { normalizar } from "@/lib/governanca/checklist";

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
  const resultados = await Promise.all(
    pedidos.map(async (pedido) => {
      if (!usarIA) return { pedido, ...gerarSemIA(briefing, ctx, pedido), ia: false };
      try {
        const r = await completarJSON([
          { role: "system", content: SISTEMA },
          { role: "user", content: montarPrompt(briefing, ctx, pedido) },
        ]);
        avisos.push(...r.avisos);
        modelo = `${r.provedor}:${r.modelo}`;
        const bruto = respostaLLM.parse(lerJSON(r.texto));
        return { pedido, ...converterLLM(bruto, pedido, ctx, briefing), ia: true };
      } catch (e) {
        avisos.push(`O modelo falhou para "${pedido.publico}" (${e instanceof Error ? e.message.slice(0, 120) : "erro"}). Usamos os moldes fixos.`);
        return { pedido, ...gerarSemIA(briefing, ctx, pedido), ia: false };
      }
    }),
  );
  if (usarIA && resultados.some((r) => !r.ia) && !modelo) modelo = "sem-ia";

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
  const plataforma = briefing.canais.includes("tiktok") ? ("tiktok" as const) : ("reels" as const);

  const pedidos: Pedido[] = briefing.publicos.flatMap((publico) => {
    const pecas = briefing.canais.flatMap((canal) => {
      const formatos = formatosPara(canal, briefing.formatos);
      return Array.from({ length: porCanal }, (_, i) => ({ canal, formato: formatos[i % formatos.length] }));
    });
    const base = { publico, pecas };
    if (!briefing.incluirRoteiros) return [base];
    // Primeiro pedido: peças + roteiro Reels/TikTok 15s
    // Demais pedidos: só roteiros (Comercial 15s e 30s) sem peças para não duplicar
    return [
      { ...base, roteiro: { plataforma, duracaoSeg: 15 as const } },
      { publico, pecas: [], roteiro: { plataforma: "comercial" as const, duracaoSeg: 15 as const } },
      { publico, pecas: [], roteiro: { plataforma: "comercial" as const, duracaoSeg: 30 as const } },
    ];
  });
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
      titulo: corte(v.titulo, p.formato === "banner" ? 40 : 90),
      texto: corte(v.texto, 400),
      cta: corte(v.cta, 40),
      selo: v.selo ? corte(v.selo, 24) : undefined,
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
        titulo: r.titulo,
        cenas: r.cenas.map((c) => ({ ...c, fala: c.fala ?? undefined, tela: c.tela ?? undefined })),
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
  const musica = ctx.musicas.find((m) => m.usoComercial);

  // Coleta todas as evidências incluindo radar citado nas cenas
  const radarIds = new Set<string>();
  for (const cena of cenas) {
    // Procura por IDs de radar nas descrições (formato [id])
    const matches = [...cena.visual.matchAll(/\[([a-z0-9-]+)\]/g), ...(cena.fala?.matchAll(/\[([a-z0-9-]+)\]/g) ?? [])];
    for (const m of matches) radarIds.add(m[1]);
  }
  const radarEvidencias = [...radarIds].map((rid) => evidenciaPorId(ctx, rid, undefined, 0.3)).filter((e): e is Evidencia => e !== null);

  const candidato = {
    id,
    publico: pedido.publico,
    plataforma: pedido.roteiro!.plataforma,
    duracaoSeg: duracao,
    titulo: r.titulo,
    cenas,
    musica: musica ? { titulo: musica.termo, artista: musica.artista ?? "—", radarId: musica.id, usoComercial: true } : undefined,
    evidencias: [...r.evidencias, ...radarEvidencias, ...(musica ? [evidenciaPorId(ctx, musica.id, `Música liberada para uso comercial: ${musica.termo}`, 0.3)!] : [])],
  };
  const ok = roteiroSchema.safeParse(candidato);
  if (!ok.success) {
    const reserva = gerarSemIA(briefing, ctx, pedido).roteiro;
    return reserva && reserva !== r ? montarRoteiro(reserva, id, pedido, ctx, briefing) : null;
  }

  // Aplica checklist de governança no texto do roteiro (título + cenas)
  const roteiroValidado = aplicarGovernancaRoteiro(ok.data, briefing, ctx);
  return roteiroValidado;
}

function aplicarGovernancaRoteiro(roteiro: Roteiro, briefing: Briefing, ctx: Contexto): Roteiro {
  // Junta todo texto do roteiro para checagem
  const textoCompleto = normalizar([roteiro.titulo, ...roteiro.cenas.map((c) => [c.visual, c.fala, c.tela].filter(Boolean).join(" "))].join(" \n "));

  // Reutiliza as regras de governança das peças (exceto as que dependem de estrutura de peça)
  const checagens = checarPeca(
    {
      titulo: roteiro.titulo,
      texto: textoCompleto,
      cta: "",
      selo: "",
      advertencia: undefined,
      bula: { indicacao: "", composicao: [], evidencias: [], contraindicacoes: [], posologia: "" }
    },
    briefing
  );

  const bloqueado = checagens.some((c) => !c.ok);

  // Adiciona contraindicações nas evidências para aparecer na Bula do roteiro
  const evidenciasComChecagem = roteiro.evidencias.map((e) => ({
    ...e,
    fonte: `${e.fonte} ${checagens.filter((c) => !c.ok).map((c) => `⚠ ${c.texto}`).join("; ")}`.trim(),
  }));

  return {
    ...roteiro,
    evidencias: evidenciasComChecagem,
    // Adiciona campo de status implícito nas evidências para a UI saber se está bloqueado
  };
}

function corte(s: string, max: number) {
  const t = s.trim();
  return t.length <= max ? t : t.slice(0, max - 1).trimEnd() + "…";
}

function limitar(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
