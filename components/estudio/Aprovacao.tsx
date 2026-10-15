"use client";

import { useState } from "react";
import { Button, Field, Icon } from "@/components/ds";
import { acoesPara, ROTULO_ACAO, type Acao, type Registro } from "@/lib/governanca/fluxo";
import type { Briefing } from "@/types/briefing";
import type { ErroApi, StatusPeca, Variacao } from "@/types/variacao";

/* Painel de aprovação (#8): só uma pessoa move a peça. O servidor valida cada passo. */

const CHAVE_RESPONSAVEL = "capsula:responsavel";
export const CHAVE_PUBLICADAS = "capsula:publicadas";

const NOME_STATUS: Record<StatusPeca, string> = {
  rascunho: "Rascunho",
  revisao: "Em revisão",
  bloqueado: "Bloqueado",
  aprovado: "Aprovado",
  publicado: "Publicado",
};

/** Peça publicada, guardada neste navegador até o Supabase entrar (#18). */
export interface PecaPublicada {
  id: string;
  titulo: string;
  publico: string;
  canal: string;
  formato: string;
  categoria: string;
  produto: string;
  dose: number;
  por: string;
  em: string;
}

export function guardarPublicada(peca: Variacao, briefing: Briefing, registro: Registro) {
  try {
    const lista: PecaPublicada[] = JSON.parse(localStorage.getItem(CHAVE_PUBLICADAS) ?? "[]");
    const nova: PecaPublicada = {
      id: `${registro.em}-${peca.id}`,
      titulo: peca.titulo,
      publico: peca.publico,
      canal: peca.canal,
      formato: peca.formato,
      categoria: briefing.categoria,
      produto: briefing.produto,
      dose: peca.dose,
      por: registro.por,
      em: registro.em,
    };
    localStorage.setItem(CHAVE_PUBLICADAS, JSON.stringify([nova, ...lista].slice(0, 100)));
  } catch {
    // Sem armazenamento do navegador: a peça segue publicada na tela, só não vai para a Memória.
  }
}

export function Aprovacao({
  peca,
  briefing,
  historico,
  onMudou,
}: {
  peca: Variacao;
  briefing: Briefing;
  historico: Registro[];
  onMudou: (peca: Variacao, registro: Registro) => void;
}) {
  // O painel só aparece depois de um clique, no navegador: dá para ler o nome salvo já no primeiro render.
  const [por, setPor] = useState(() => {
    try {
      return localStorage.getItem(CHAVE_RESPONSAVEL) ?? "";
    } catch {
      return "";
    }
  });
  const [motivo, setMotivo] = useState("");
  const [devolvendo, setDevolvendo] = useState(false);
  const [enviando, setEnviando] = useState<Acao | null>(null);
  const [erro, setErro] = useState("");

  async function executar(acao: Acao) {
    if (acao === "devolver" && !devolvendo) {
      setDevolvendo(true);
      return;
    }
    setErro("");
    setEnviando(acao);
    try {
      const res = await fetch("/api/pecas/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ peca, briefing, acao, por, motivo: acao === "devolver" ? motivo : undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error((json as ErroApi).erro);
      try {
        localStorage.setItem(CHAVE_RESPONSAVEL, por.trim());
      } catch {}
      setDevolvendo(false);
      setMotivo("");
      onMudou(json.peca, json.registro);
    } catch (e) {
      setErro(e instanceof Error && e.message !== "Failed to fetch" ? e.message : "Sem conexão com o servidor.");
    } finally {
      setEnviando(null);
    }
  }

  const acoes = acoesPara(peca.status);

  return (
    <section className="aprovacao" aria-labelledby="titulo-aprovacao">
      <h3 id="titulo-aprovacao" className="cp-bula-label">
        Aprovação
      </h3>

      {peca.status === "bloqueado" ? (
        <p className="aprovacao-bloqueio t-body-sm">
          <Icon name="x" size={16} />
          Bloqueada pelo checklist. Uma peça bloqueada não avança: veja as contraindicações na Bula e gere de novo.
        </p>
      ) : peca.status === "publicado" ? (
        <p className="t-body-sm">Publicada. A peça já entrou na Memória deste navegador.</p>
      ) : (
        <>
          <Field label="Seu nome" value={por} onChange={(e) => setPor(e.target.value)} hint="Fica registrado em cada mudança de status." autoComplete="name" />
          {devolvendo ? <Field as="textarea" label="Motivo da devolução" value={motivo} onChange={(e) => setMotivo(e.target.value)} /> : null}
          <div className="aprovacao-acoes">
            {acoes.map((a) => (
              <Button
                key={a}
                variant={a === "aprovar" || a === "publicar" ? "primary" : "secondary"}
                icon={a === "aprovar" ? "check" : a === "devolver" ? "x" : "arrow"}
                disabled={enviando !== null}
                onClick={() => executar(a)}
              >
                {enviando === a ? "Salvando…" : a === "devolver" && devolvendo ? "Confirmar devolução" : ROTULO_ACAO[a]}
              </Button>
            ))}
          </div>
        </>
      )}

      {erro ? (
        <p className="cp-hint cp-hint-error" role="alert">
          <Icon name="x" size={14} />
          {erro}
        </p>
      ) : null}

      {historico.length ? (
        <ol className="aprovacao-historico">
          {historico.map((r) => (
            <li key={r.em} className="t-data">
              {new Date(r.em).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })} · {r.por}: {NOME_STATUS[r.de]} → {NOME_STATUS[r.para]}
              {r.motivo ? ` (${r.motivo})` : ""}
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
