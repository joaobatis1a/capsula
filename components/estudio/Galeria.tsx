"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bula, Button, Icon, PieceCard, Roteiro, StatusPill, type BulaEvidencia } from "@/components/ds";
import { ROTULOS, type Canal } from "@/types/briefing";
import { tempoDaCena, type RespostaGeracao, type Variacao } from "@/types/variacao";

/* Galeria de variações (#29) com filtro por público e canal e a Bula aberta ao lado. */

export function Galeria({ resposta }: { resposta: RespostaGeracao }) {
  const [publico, setPublico] = useState<string | "todos">("todos");
  const [canal, setCanal] = useState<Canal | "todos">("todos");
  const [aberta, setAberta] = useState<Variacao | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (aberta) dialogRef.current?.showModal();
  }, [aberta]);

  const visiveis = useMemo(
    () => resposta.variacoes.filter((v) => (publico === "todos" || v.publico === publico) && (canal === "todos" || v.canal === canal)),
    [resposta, publico, canal],
  );
  const bloqueadas = resposta.variacoes.filter((v) => v.status === "bloqueado").length;
  const publicos = resposta.briefing.publicos;
  const canais = [...new Set(resposta.variacoes.map((v) => v.canal))];
  const porPublico = publicos.map((p) => ({ publico: p, pecas: visiveis.filter((v) => v.publico === p) })).filter((g) => g.pecas.length);

  return (
    <section className="galeria" aria-labelledby="titulo-galeria">
      <header className="galeria-head">
        <h2 id="titulo-galeria" className="t-h1">
          {resposta.variacoes.length} variações
        </h2>
        <p className="t-data t-muted">
          {resposta.modelo === "sem-ia" ? "Moldes fixos, sem IA" : `Modelo ${resposta.modelo}`}
          {resposta.doCache ? " · do cache" : ""} · {bloqueadas} bloqueada{bloqueadas === 1 ? "" : "s"} pela governança
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
      </div>

      {porPublico.map((g) => (
        <section key={g.publico} className="galeria-grupo" aria-label={g.publico}>
          <h3 className="t-h2">{g.publico}</h3>
          <ul className="galeria-grade">
            {g.pecas.map((v) => (
              <li key={v.id}>
                <PieceCard titulo={v.titulo} texto={v.texto} canal={ROTULOS.canal[v.canal]} formato={v.formato} memoria={v.dose} status={v.status} selo={v.selo} onBula={() => setAberta(v)} />
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
              .map((r) => (
                <li key={r.id} className="galeria-roteiro">
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

      <dialog ref={dialogRef} className="galeria-dialogo" aria-label="Bula da peça" onClose={() => setAberta(null)} onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}>
        {aberta ? (
          <div className="galeria-dialogo-corpo">
            <div className="galeria-dialogo-topo">
              <StatusPill status={aberta.status} />
              <Button variant="ghost" icon="x" onClick={() => dialogRef.current?.close()}>
                Fechar
              </Button>
            </div>
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
