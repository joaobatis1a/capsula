"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bula, Button, Icon, PieceCard, Roteiro, StatusPill, type BulaEvidencia } from "@/components/ds";
import { baixarPng, PecaEscalada, type ConteudoPeca } from "@/components/pecas/Peca";
import { FORMATOS, ROTULOS, type Briefing, type Canal, type Formato } from "@/types/briefing";
import { tempoDaCena, type RespostaGeracao, type Variacao } from "@/types/variacao";
import type { Registro } from "@/lib/governanca/fluxo";
import { Aprovacao, guardarPublicada } from "./Aprovacao";
import { useAvisar } from "@/components/motion/Avisos";
import { Chuva } from "@/components/motion/Chuva";
import { registrar } from "@/lib/ganho/metricas";
import { Conta } from "@/components/motion/Revela";

function conteudoDe(v: Variacao, b: Briefing): ConteudoPeca {
  return {
    titulo: v.titulo,
    texto: v.texto,
    cta: v.cta,
    selo: v.selo,
    precoDe: b.oferta.precoDe,
    precoPor: b.oferta.precoPor,
    validade: b.oferta.validade,
    condicao: b.oferta.condicao,
    advertencia: v.advertencia,
  };
}

/* Galeria de variações (#29) com filtro por público e canal e a Bula aberta ao lado. */

type Tema = "claro" | "escuro" | "sistema";

export function Galeria({ resposta }: { resposta: RespostaGeracao }) {
  const [publico, setPublico] = useState<string | "todos">("todos");
  const [canal, setCanal] = useState<Canal | "todos">("todos");
  const [pecas, setPecas] = useState<Variacao[]>(resposta.variacoes);
  const [historico, setHistorico] = useState<Record<string, Registro[]>>({});
  const [abertaId, setAbertaId] = useState<string | null>(null);
  const [tema, setTema] = useState<Tema>("sistema");
  const aberta = pecas.find((p) => p.id === abertaId) ?? null;
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (abertaId) dialogRef.current?.showModal();
  }, [abertaId]);

  // Marca a chegada das variações: o tempo até a aprovação conta daqui.
  useEffect(() => {
    chegouEm.current = Date.now();
  }, []);

  const avisar = useAvisar();
  const chegouEm = useRef(0);
  const [carimbo, setCarimbo] = useState<{ id: string; status: "aprovado" | "publicado"; n: number } | null>(null);

  function fechar() {
    const d = dialogRef.current;
    if (!d || !d.open) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return d.close();
    d.classList.add("is-fechando");
    d.addEventListener(
      "animationend",
      () => {
        d.classList.remove("is-fechando");
        d.close();
      },
      { once: true },
    );
  }

  function mudou(peca: Variacao, registro: Registro) {
    const mensagens = { revisao: "Peça enviada para revisão", aprovado: "Peça aprovada", publicado: "Peça publicada e guardada na Memória", rascunho: "Peça devolvida para rascunho", bloqueado: "" };
    avisar(mensagens[peca.status]);
    if (peca.status === "aprovado") registrar({ tipo: "aprovacao", em: new Date().toISOString(), aposMs: Date.now() - chegouEm.current });
    if (peca.status === "aprovado" || peca.status === "publicado") setCarimbo({ id: peca.id, status: peca.status, n: Date.now() });
    setPecas((lista) => lista.map((p) => (p.id === peca.id ? peca : p)));
    setHistorico((h) => ({ ...h, [peca.id]: [...(h[peca.id] ?? []), registro] }));
    if (peca.status === "publicado") guardarPublicada(peca, resposta.briefing, registro);
  }

  const visiveis = useMemo(
    () => pecas.filter((v) => (publico === "todos" || v.publico === publico) && (canal === "todos" || v.canal === canal)),
    [pecas, publico, canal],
  );
  const bloqueadas = pecas.filter((v) => v.status === "bloqueado").length;
  const aprovadas = pecas.filter((v) => v.status === "aprovado" || v.status === "publicado").length;
  const publicos = resposta.briefing.publicos;
  const canais = [...new Set(resposta.variacoes.map((v) => v.canal))];
  const porPublico = publicos.map((p) => ({ publico: p, pecas: visiveis.filter((v) => v.publico === p) })).filter((g) => g.pecas.length);

  return (
    <section className="galeria" aria-labelledby="titulo-galeria">
      <header className="galeria-head">
        <h2 id="titulo-galeria" className="t-h1">
          <Conta valor={resposta.variacoes.length} duracao={700} /> variações
        </h2>
        <p className="t-data t-muted">
          {resposta.modelo === "sem-ia" ? "Moldes fixos, sem IA" : `Modelo ${resposta.modelo}`}
          {resposta.doCache ? " · do cache" : ""} · {bloqueadas} bloqueada{bloqueadas === 1 ? "" : "s"} pela governança · {aprovadas} aprovada{aprovadas === 1 ? "" : "s"}
        </p>
      </header>

      {resposta.avisos.length ? (
        <div className="estudio-alerta" role="status">
          <Icon name="shield" size={18} />
          <ul>
            {resposta.avisos.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="galeria-filtros">
        <Filtro rotulo="Público" valor={publico} opcoes={publicos.map((p) => [p, p])} mudar={setPublico} />
        <Filtro rotulo="Canal" valor={canal} opcoes={canais.map((c) => [c, ROTULOS.canal[c]])} mudar={(c) => setCanal(c as Canal | "todos")} />
        <TemaSeletor valor={tema} mudar={setTema} />
      </div>

      {porPublico.map((g) => (
        <section key={g.publico} className="galeria-grupo" aria-label={g.publico}>
          <h3 className="t-h2">{g.publico}</h3>
          <ul className="galeria-grade" key={`${publico}-${canal}`}>
            {g.pecas.map((v, i) => (
              <li key={v.id} style={{ "--i": i } as React.CSSProperties}>
                <PieceCard titulo={v.titulo} texto={v.texto} canal={ROTULOS.canal[v.canal]} formato={v.formato} memoria={v.dose} status={v.status} selo={v.selo} onBula={() => setAbertaId(v.id)}>
                  <PecaEscalada conteudo={conteudoDe(v, resposta.briefing)} formato={v.formato} tema={tema} />
                </PieceCard>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {resposta.roteiros.length ? (
        <section className="galeria-grupo" aria-labelledby="titulo-roteiros">
          <h3 id="titulo-roteiros" className="t-h2">
            Roteiros
          </h3>
          <ul className="galeria-roteiros">
            {resposta.roteiros
              .filter((r) => publico === "todos" || r.publico === publico)
              .map((r, i) => (
                <li key={r.id} className="galeria-roteiro" style={{ "--i": i } as React.CSSProperties}>
                  <Roteiro titulo={r.titulo} formato={`${r.plataforma === "reels" ? "Reels" : r.plataforma === "tiktok" ? "TikTok" : "Comercial"} · ${r.publico}`} duracao={`${r.duracaoSeg}s`} cenas={r.cenas.map((c) => ({ tempo: tempoDaCena(c), visual: c.visual, fala: c.fala, tela: c.tela }))} />
                  {r.musica ? (
                    <p className="galeria-musica t-body-sm">
                      <Icon name="trend" size={16} />
                      <span>
                        Música sugerida: <b>{r.musica.titulo}</b> · {r.musica.artista} · {r.musica.usoComercial ? "liberada para uso comercial" : "sem liberação para marcas"}
                      </span>
                    </p>
                  ) : null}
                </li>
              ))}
          </ul>
        </section>
      ) : null}

      <dialog ref={dialogRef} className="galeria-dialogo" aria-label="Bula da peça" onClose={() => setAbertaId(null)} onCancel={(e) => {
          e.preventDefault();
          fechar();
        }}
        onClick={(e) => e.target === dialogRef.current && fechar()}
      >
        {aberta ? (
          <div className="galeria-dialogo-corpo">
            <div className="galeria-dialogo-topo">
              <StatusPill key={aberta.status} status={aberta.status} />
              <Button variant="ghost" icon="x" onClick={fechar}>
                Fechar
              </Button>
            </div>
            <Aprovacao key={`ap-${aberta.id}`} peca={aberta} briefing={resposta.briefing} historico={historico[aberta.id] ?? []} onMudou={mudou} />
            <VerFormatos key={aberta.id} variacao={aberta} briefing={resposta.briefing} carimbo={carimbo?.id === aberta.id ? carimbo : null} tema={tema} />
            <div className="galeria-peca">
              <p className="t-data t-muted">
                {aberta.publico} · {ROTULOS.canal[aberta.canal]} · {ROTULOS.formato[aberta.formato]}
              </p>
              <p className="t-h3">{aberta.titulo}</p>
              <p>{aberta.texto}</p>
              <p className="t-body-sm">
                <b>CTA:</b> {aberta.cta}
                {aberta.hashtags.length ? ` · ${aberta.hashtags.join(" ")}` : ""}
              </p>
              {aberta.advertencia ? <p className="galeria-advertencia t-data">{aberta.advertencia}</p> : null}
            </div>
            <Bula
              titulo={aberta.titulo}
              memoria={aberta.dose}
              indicacao={aberta.bula.indicacao}
              composicao={aberta.bula.composicao}
              evidencias={aberta.bula.evidencias.map(
                (e): BulaEvidencia => ({ origin: e.origem === "memoria" ? "memoria" : "tendencia", rotulo: e.origem === "sazonalidade" ? "Sazonalidade" : undefined, text: e.texto, fonte: e.fonte }),
              )}
              contraindicacoes={aberta.bula.contraindicacoes.map((c) => ({ ok: c.ok, text: c.texto }))}
              posologia={aberta.bula.posologia}
            />
          </div>
        ) : null}
      </dialog>
    </section>
  );
}

/** A variação nos três formatos, em tamanho de leitura, com download do PNG em tamanho real. */
function VerFormatos({ variacao, briefing, carimbo, tema }: { variacao: Variacao; briefing: Briefing; carimbo: { status: "aprovado" | "publicado"; n: number } | null; tema: Tema }) {
  const avisar = useAvisar();
  const [formato, setFormato] = useState<Formato>(variacao.formato);
  const [baixando, setBaixando] = useState(false);
  const pecaRef = useRef<HTMLDivElement>(null);

  async function baixar() {
    if (!pecaRef.current) return;
    setBaixando(true);
    try {
      await baixarPng(pecaRef.current, formato, variacao.id);
      avisar(`PNG de ${ROTULOS.formato[formato]} baixado`);
    } finally {
      setBaixando(false);
    }
  }

  return (
    <section className="galeria-formatos" aria-label="Peça nos três formatos">
      <ul className="estudio-chips" role="group" aria-label="Formato">
        {FORMATOS.map((f) => (
          <li key={f}>
            <button type="button" className={formato === f ? "estudio-chip is-on" : "estudio-chip"} aria-pressed={formato === f} onClick={() => setFormato(f)}>
              {ROTULOS.formato[f]}
            </button>
          </li>
        ))}
      </ul>
      <div className={`galeria-formato galeria-formato-${formato}`}>
        {carimbo ? (
          <>
            <span key={carimbo.n} className={carimbo.status === "publicado" ? "carimbo is-publicado" : "carimbo"} aria-hidden="true">
              {carimbo.status === "publicado" ? "Publicado" : "Aprovado"}
            </span>
            <Chuva key={`chuva-${carimbo.n}`} quantidade={carimbo.status === "publicado" ? 12 : 7} />
          </>
        ) : null}
        <PecaEscalada conteudo={conteudoDe(variacao, briefing)} formato={formato} pecaRef={pecaRef} tema={tema} />
      </div>
      <Button variant="secondary" icon="arrow" onClick={baixar} disabled={baixando || variacao.status === "bloqueado"}>
        {variacao.status === "bloqueado" ? "Peça bloqueada" : baixando ? "Gerando PNG…" : "Baixar PNG"}
      </Button>
    </section>
  );
}

function Filtro({ rotulo, valor, opcoes, mudar }: { rotulo: string; valor: string; opcoes: [string, string][]; mudar: (v: string) => void }) {
  return (
    <div className="galeria-filtro" role="group" aria-label={`Filtrar por ${rotulo.toLowerCase()}`}>
      <span className="cp-label">{rotulo}</span>
      <ul className="estudio-chips">
        {[["todos", "Todos"] as [string, string], ...opcoes].map(([v, nome]) => (
          <li key={v}>
            <button type="button" className={valor === v ? "estudio-chip is-on" : "estudio-chip"} aria-pressed={valor === v} onClick={() => mudar(v)}>
              {nome}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TemaSeletor({ valor, mudar }: { valor: Tema; mudar: (v: Tema) => void }) {
  const opcoes: [Tema, string][] = [
    ["sistema", "Sistema"],
    ["claro", "Claro"],
    ["escuro", "Escuro"],
  ];
  return (
    <div className="galeria-filtro" role="group" aria-label="Tema da peça">
      <span className="cp-label">Tema</span>
      <ul className="estudio-chips">
        {opcoes.map(([v, nome]) => (
          <li key={v}>
            <button type="button" className={valor === v ? "estudio-chip is-on" : "estudio-chip"} aria-pressed={valor === v} onClick={() => mudar(v)}>
              {nome}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
