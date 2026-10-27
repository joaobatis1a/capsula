import "server-only";

/* Cliente do modelo de linguagem. Groq, OpenRouter e Gemini usam o mesmo formato de API (OpenAI).
   Usa a primeira chave configurada; se o provedor recusar (cota, erro), passa para o próximo. */

interface Provedor {
  id: "groq" | "openrouter" | "gemini";
  url: string;
  chave: string | undefined;
  modelo: string;
}

export interface Mensagem {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface RespostaLLM {
  texto: string;
  provedor: string;
  modelo: string;
  /** Avisos de reserva, como "o Groq recusou por cota". */
  avisos: string[];
}

/* Duas tentativas por modelo: o 503 do Gemini costuma ser do modelo e não da chave, então trocar de modelo
   resolve mais rápido do que insistir no mesmo. Os modelos de reserva sempre têm cota e carga próprias. */
const TENTATIVAS = 2;
/* A função da Vercel morre em 60s. Cada tentativa espera no máximo 20s e, passados 45s no total, não começa outra:
   melhor devolver os moldes fixos, com aviso, do que perder a resposta inteira. */
const TIMEOUT_TENTATIVA_MS = 20_000;
const ORCAMENTO_TOTAL_MS = 45_000;
/* Teto absoluto, contado do início: nenhuma tentativa pode passar disso, para a resposta sair antes dos 60s da função. */
const TETO_MS = 54_000;
const GEMINI_PRINCIPAL = "gemini-3.5-flash-lite";
const GEMINI_RESERVAS = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];

export class SemProvedorError extends Error {}
export class ProvedoresFalharamError extends Error {}

function provedores(): Provedor[] {
  const lista: Provedor[] = [
    {
      id: "groq",
      url: "https://api.groq.com/openai/v1/chat/completions",
      chave: process.env.GROQ_API_KEY,
      modelo: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    },
    {
      id: "openrouter",
      url: "https://openrouter.ai/api/v1/chat/completions",
      chave: process.env.OPENROUTER_API_KEY,
      modelo: process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free",
    },
  ];
  const principal = process.env.GEMINI_MODEL || GEMINI_PRINCIPAL;
  const configuradas = process.env.GEMINI_FALLBACK_MODELS?.split(",").map((m) => m.trim()).filter(Boolean);
  const reservas = (configuradas?.length ? configuradas : GEMINI_RESERVAS).filter((m) => m !== principal);
  for (const modelo of [principal, ...reservas]) {
    lista.push({ id: "gemini", url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", chave: process.env.GEMINI_API_KEY, modelo });
  }
  return lista.filter((p) => p.chave);
}

export function temProvedor() {
  return provedores().length > 0;
}

/** Nome curto do primeiro provedor com chave, ou null quando o motor usa os moldes fixos. */
export function provedorAtivo(): "Groq" | "OpenRouter" | "Gemini" | null {
  const p = provedores()[0];
  return p ? ({ groq: "Groq", openrouter: "OpenRouter", gemini: "Gemini" } as const)[p.id] : null;
}

/** Pede uma resposta em JSON. Tenta cada provedor (e, no Gemini, cada modelo) até 2 vezes quando há cota ou sobrecarga passageira. */
export async function completarJSON(mensagens: Mensagem[], opcoes: { temperatura?: number; timeoutMs?: number } = {}): Promise<RespostaLLM> {
  const lista = provedores();
  if (lista.length === 0) throw new SemProvedorError("Nenhuma chave de modelo configurada.");

  const avisos: string[] = [];
  const inicio = Date.now();
  for (const p of lista) {
    for (let tentativa = 0; tentativa < TENTATIVAS; tentativa++) {
      if (Date.now() - inicio > ORCAMENTO_TOTAL_MS) {
        avisos.push("O tempo para gerar com o modelo acabou.");
        throw new ProvedoresFalharamError(avisos.join(" "));
      }
      try {
        const res = await fetch(p.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${p.chave}`,
            ...(p.id === "openrouter" ? { "X-Title": "Capsula" } : {}),
          },
          body: JSON.stringify({
            model: p.modelo,
            messages: mensagens,
            temperature: opcoes.temperatura ?? 0.8,
            response_format: { type: "json_object" },
          }),
          signal: AbortSignal.timeout(Math.max(1_000, Math.min(opcoes.timeoutMs ?? TIMEOUT_TENTATIVA_MS, TETO_MS - (Date.now() - inicio)))),
        });

        // Cota (429) ou sobrecarga passageira (503, 502, 504): espera um pouco e tenta de novo no mesmo provedor.
        if ((res.status === 429 || res.status === 502 || res.status === 503 || res.status === 504) && tentativa < TENTATIVAS - 1) {
          await new Promise((r) => setTimeout(r, 1500 * (tentativa + 1)));
          continue;
        }
        if (!res.ok) {
          avisos.push(`${nome(p)} respondeu ${res.status}${res.status === 429 ? " (cota)" : ""}.`);
          break;
        }
        const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
        const texto = json.choices?.[0]?.message?.content;
        if (!texto) {
          avisos.push(`${nome(p)} devolveu uma resposta vazia.`);
          break;
        }
        if (avisos.length) avisos.push(`Usamos ${nomeNoMeio(p)} como reserva.`);
        return { texto, provedor: p.id, modelo: p.modelo, avisos };
      } catch (e) {
        avisos.push(`${nome(p)} não respondeu (${e instanceof Error && e.name === "TimeoutError" ? "tempo esgotado" : "erro de rede"}).`);
        break;
      }
    }
  }
  throw new ProvedoresFalharamError(avisos.join(" "));
}

function nome(p: Provedor) {
  const base = { groq: "O Groq", openrouter: "O OpenRouter", gemini: "O Gemini" }[p.id];
  return p.id === "gemini" ? `${base} (${p.modelo})` : base;
}

/** O nome no meio da frase, com o artigo em minúscula: "Usamos o Gemini (...) como reserva." */
function nomeNoMeio(p: Provedor) {
  return nome(p).replace(/^O /, "o ");
}

/** Extrai o primeiro objeto JSON de um texto (alguns modelos cercam o JSON com crases ou deixam texto depois dele). */
export function lerJSON(texto: string): unknown {
  const inicio = texto.indexOf("{");
  if (inicio < 0) throw new Error("Resposta sem JSON.");
  // Percorre as chaves, ignorando as que estão dentro de strings, até fechar o primeiro objeto.
  let nivel = 0;
  let emTexto = false;
  let escape = false;
  for (let i = inicio; i < texto.length; i++) {
    const c = texto[i];
    if (emTexto) {
      if (escape) escape = false;
      else if (c === "\\") escape = true;
      else if (c === '"') emTexto = false;
    } else if (c === '"') emTexto = true;
    else if (c === "{") nivel++;
    else if (c === "}" && --nivel === 0) return JSON.parse(texto.slice(inicio, i + 1));
  }
  throw new Error("Resposta sem JSON.");
}
