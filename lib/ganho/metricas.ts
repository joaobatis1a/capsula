/* Painel de ganho (#12): o que o app mede de verdade e como compara com o processo de hoje.
   Medido: tempo de geração, variações e peças barradas pelo checklist, registrados no navegador a cada geração.
   Premissa: o processo de hoje é uma estimativa do time, declarada e editável. Nunca é dado da empresa.
   Sintético: CTR e conversão do histórico de teste. Ficam separados no painel. */

export interface EventoGeracao {
  tipo: "geracao";
  em: string;
  /** Do primeiro campo tocado até o clique em Gerar. Nulo quando ninguém digitou (briefing de exemplo automático). */
  briefingMs: number | null;
  geracaoMs: number;
  variacoes: number;
  bloqueadas: number;
  roteiros: number;
  publicos: number;
  canais: number;
  modelo: string;
  doCache: boolean;
}

export interface EventoAprovacao {
  tipo: "aprovacao";
  em: string;
  /** Da chegada das variações até a pessoa aprovar. Inclui o tempo humano de revisão. */
  aposMs: number;
}

export type Evento = EventoGeracao | EventoAprovacao;

export interface Premissas {
  /** Peças que um briefing vira hoje: uma por formato. */
  pecasPorBriefingHoje: number;
  /** Minutos para produzir uma peça hoje, do rascunho à versão final. */
  minutosPorPecaHoje: number;
  /** Minutos para revisar uma variação na Cápsula. */
  minutosRevisaoPorVariacao: number;
}

export const PREMISSAS_PADRAO: Premissas = { pecasPorBriefingHoje: 3, minutosPorPecaHoje: 40, minutosRevisaoPorVariacao: 3 };

export const CHAVE_EVENTOS = "capsula:metricas";
export const CHAVE_PREMISSAS = "capsula:premissas";
export const AVISO_DE_MUDANCA = "capsula:metricas-mudou";
const LIMITE = 200;

export function lerBruto(chave: string, vazio: string) {
  try {
    return localStorage.getItem(chave) ?? vazio;
  } catch {
    return vazio;
  }
}

export function interpretarEventos(bruto: string): Evento[] {
  try {
    const lista = JSON.parse(bruto);
    return Array.isArray(lista) ? (lista as Evento[]) : [];
  } catch {
    return [];
  }
}

export function interpretarPremissas(bruto: string): Premissas {
  try {
    const p = JSON.parse(bruto) as Partial<Premissas>;
    const ok = (n: unknown, padrao: number) => (typeof n === "number" && n > 0 && n < 100000 ? n : padrao);
    return {
      pecasPorBriefingHoje: ok(p.pecasPorBriefingHoje, PREMISSAS_PADRAO.pecasPorBriefingHoje),
      minutosPorPecaHoje: ok(p.minutosPorPecaHoje, PREMISSAS_PADRAO.minutosPorPecaHoje),
      minutosRevisaoPorVariacao: ok(p.minutosRevisaoPorVariacao, PREMISSAS_PADRAO.minutosRevisaoPorVariacao),
    };
  } catch {
    return PREMISSAS_PADRAO;
  }
}

function avisar() {
  window.dispatchEvent(new Event(AVISO_DE_MUDANCA));
}

/** Guarda um evento neste navegador. Sem armazenamento, a medição some, mas a tela segue funcionando. */
export function registrar(evento: Evento) {
  try {
    const lista = interpretarEventos(lerBruto(CHAVE_EVENTOS, "[]"));
    localStorage.setItem(CHAVE_EVENTOS, JSON.stringify([...lista, evento].slice(-LIMITE)));
    avisar();
  } catch {}
}

export function limparMedicoes() {
  try {
    localStorage.removeItem(CHAVE_EVENTOS);
    avisar();
  } catch {}
}

export function salvarPremissas(p: Premissas) {
  try {
    localStorage.setItem(CHAVE_PREMISSAS, JSON.stringify(p));
    avisar();
  } catch {}
}

const media = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
function mediana(xs: number[]) {
  if (!xs.length) return null;
  const o = [...xs].sort((a, b) => a - b);
  const m = Math.floor(o.length / 2);
  return o.length % 2 ? o[m] : (o[m - 1] + o[m]) / 2;
}

export interface Resumo {
  geracoes: number;
  variacoes: number;
  bloqueadas: number;
  /** Fração de 0 a 1 das variações barradas pelo checklist. */
  taxaBloqueio: number | null;
  geracaoMs: number | null;
  /** Só das gerações em que alguém preencheu o briefing. */
  briefingMs: number | null;
  variacoesPorBriefing: number | null;
  /** Tempo de geração dividido pelas variações. */
  geracaoPorVariacaoMs: number | null;
  aprovacoes: number;
  primeiraAprovacaoMs: number | null;
  doCache: number;
  /** Gerações que usaram os moldes fixos: o tempo medido nelas não é o do modelo. */
  semIA: number;
}

export function resumir(eventos: Evento[]): Resumo {
  const g = eventos.filter((e): e is EventoGeracao => e.tipo === "geracao");
  const a = eventos.filter((e): e is EventoAprovacao => e.tipo === "aprovacao");
  const variacoes = g.reduce((s, e) => s + e.variacoes, 0);
  const bloqueadas = g.reduce((s, e) => s + e.bloqueadas, 0);
  const reais = g.filter((e) => !e.doCache);
  return {
    geracoes: g.length,
    variacoes,
    bloqueadas,
    taxaBloqueio: variacoes ? bloqueadas / variacoes : null,
    // Resposta do cache não mede o motor: fica fora da média de tempo.
    geracaoMs: media(reais.map((e) => e.geracaoMs)),
    briefingMs: media(g.flatMap((e) => (e.briefingMs != null ? [e.briefingMs] : []))),
    variacoesPorBriefing: media(g.map((e) => e.variacoes)),
    geracaoPorVariacaoMs: variacoes && reais.length ? (media(reais.map((e) => e.geracaoMs)) ?? 0) / (media(reais.map((e) => e.variacoes)) || 1) : null,
    aprovacoes: a.length,
    primeiraAprovacaoMs: mediana(a.map((e) => e.aposMs)),
    doCache: g.length - reais.length,
    semIA: g.filter((e) => e.modelo === "sem-ia").length,
  };
}

export interface Comparacao {
  /** Minutos por peça hoje (premissa) e na Cápsula (revisão medida pela premissa + geração medida). */
  minutosPorPecaHoje: number;
  minutosPorPecaCapsula: number;
  reducaoPorPeca: number;
  pecasPorBriefingHoje: number;
  variacoesPorBriefing: number;
  multiplicadorDePecas: number;
  /** Minutos para um briefing completo: hoje (peças × minutos) e na Cápsula (preencher + gerar + revisar tudo). */
  minutosPorBriefingHoje: number;
  minutosPorBriefingCapsula: number;
}

/** Compara o processo de hoje (premissa) com o medido. Devolve null enquanto não há geração medida. */
export function comparar(r: Resumo, p: Premissas): Comparacao | null {
  if (r.variacoesPorBriefing == null || r.geracaoPorVariacaoMs == null) return null;
  const minutosPorPecaCapsula = r.geracaoPorVariacaoMs / 60000 + p.minutosRevisaoPorVariacao;
  const minutosPorBriefingHoje = p.pecasPorBriefingHoje * p.minutosPorPecaHoje;
  const minutosPorBriefingCapsula = ((r.briefingMs ?? 0) + (r.geracaoMs ?? 0)) / 60000 + r.variacoesPorBriefing * p.minutosRevisaoPorVariacao;
  return {
    minutosPorPecaHoje: p.minutosPorPecaHoje,
    minutosPorPecaCapsula,
    reducaoPorPeca: 1 - minutosPorPecaCapsula / p.minutosPorPecaHoje,
    pecasPorBriefingHoje: p.pecasPorBriefingHoje,
    variacoesPorBriefing: r.variacoesPorBriefing,
    multiplicadorDePecas: r.variacoesPorBriefing / p.pecasPorBriefingHoje,
    minutosPorBriefingHoje,
    minutosPorBriefingCapsula,
  };
}

/** Briefings de exemplo para medir sem digitar: um liberado, um com advertência obrigatória e um que o checklist barra. */
export function briefingsDeExemplo(validade: string) {
  const base = { canais: ["instagram", "site"], formatos: ["feed", "story", "banner"], objetivo: "conversao", variacoesPorCanal: 3, incluirRoteiros: false, radarIds: [] as string[] };
  return [
    { ...base, produto: "Protetor solar FPS 50", categoria: "Protetor solar", tipoProduto: "dermocosmetico", oferta: { descricao: "30% off no protetor solar FPS 50", precoDe: 79.9, precoPor: 55.9, validade }, publicos: ["Jovens de 18 a 24", "Mães e pais de crianças pequenas"] },
    { ...base, produto: "Antigripal em cápsulas", categoria: "Antigripais", tipoProduto: "medicamento_isento", oferta: { descricao: "20% off no antigripal", precoDe: 29.9, precoPor: 23.9, validade }, publicos: ["Adultos de 25 a 34", "Pessoas com 60 anos ou mais"] },
    // Medicamento com prescrição: o checklist barra toda peça (RDC 96/2008). Mostra a governança no painel.
    { ...base, produto: "Anti-hipertensivo (exemplo)", categoria: "Medicamentos", tipoProduto: "medicamento_prescricao", oferta: { descricao: "Leve 2 e pague 1", validade }, publicos: ["Adultos de 35 a 59 com uso contínuo"], canais: ["instagram"], formatos: ["feed"] },
  ];
}
