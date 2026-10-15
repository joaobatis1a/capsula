"use client";

import { useState } from "react";
import type { Sazonalidade } from "@/lib/data/types";
import { ordenarDoses, type Dose } from "@/lib/estudio/doses";
import "./abertura.css";

/* Abertura do Estúdio: a palavra-cápsula, a cartela de doses e a faixa de bula.
   Destacar uma dose da cartela preenche o briefing. */

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export function Abertura({
  sazonalidade,
  sazonalidadeAno,
  onDose,
  onEscrever,
}: {
  sazonalidade: Sazonalidade[];
  sazonalidadeAno: Sazonalidade[];
  onDose: (d: Dose) => void;
  onEscrever: () => void;
}) {
  const emAlta = sazonalidade.map((s) => s.id);
  const doses = ordenarDoses(emAlta);
  const [destacada, setDestacada] = useState<string | null>(null);
  const hoje = new Date();
  const validade = new Date(hoje.getFullYear() + 1, hoje.getMonth(), 1);

  function destacar(d: Dose) {
    setDestacada(d.id);
    onDose(d);
  }

  return (
    <section className="abertura" aria-labelledby="titulo-abertura">
      <div className="abertura-texto">
        <p className="abertura-olho">Estúdio criativo com memória</p>
        <h1 id="titulo-abertura" className="abertura-titulo">
          <span className="abertura-linha">Criatividade</span>
          <span className="abertura-linha">
            na{" "}
            <span className="palavra-capsula" aria-label="dose">
              <span className="pc-m" aria-hidden="true">
                do
              </span>
              <span className="pc-t" aria-hidden="true">
                se
              </span>
            </span>{" "}
            certa
          </span>
        </h1>
        <p className="abertura-sub">
          A Cápsula junta o que já funcionou nas suas campanhas com o que está em alta agora e entrega variações prontas para revisar,
          cada uma com a sua bula.
        </p>
        <p className="abertura-convite">
          <span>Destaque uma dose da cartela para começar,</span>{" "}
          <button type="button" className="abertura-link" onClick={onEscrever}>
            ou escreva o seu briefing
          </button>
        </p>
      </div>

      <div className="cartela" role="group" aria-label="Doses prontas da época">
        <span className="cartela-brilho" aria-hidden="true" />
        <div className="cartela-grade">
          {doses.map((d, i) => {
            const saz = sazonalidadeAno.find((s) => s.id === d.sazonalidadeId);
            const alta = emAlta.includes(d.sazonalidadeId ?? "");
            const estado = destacada === d.id ? "is-destacada" : "";
            return (
              <button
                key={d.id}
                type="button"
                className={`cartela-celula ${estado}`}
                style={{ "--i": i } as React.CSSProperties}
                onClick={() => destacar(d)}
                aria-pressed={destacada === d.id}
                aria-label={`${d.titulo}, ${d.epoca}${alta ? ", em alta agora" : ""}. Usar no briefing.`}
              >
                <span className="bolha" aria-hidden="true">
                  <span className="mini-capsula">
                    <span className="mc-m" />
                    <span className="mc-t" />
                  </span>
                </span>
                <span className="cartela-rotulo" aria-hidden="true">
                  <span className="cartela-epoca">
                    {alta ? <span className="cartela-alta" title="Em alta agora" /> : null}
                    {d.epoca}
                  </span>
                  <span className="cartela-titulo">{d.titulo}</span>
                  {destacada === d.id ? (
                    <span className="cartela-no">no briefing ↓</span>
                  ) : (
                    <span className="cartela-pico">{saz ? `pico ${MESES[saz.mesesPico[0] - 1]}–${MESES[saz.mesesPico.at(-1)! - 1]}` : "uso contínuo"}</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
        <p className="cartela-impressao" aria-hidden="true">
          <span>CÁPSULA · 6 DOSES DE CAMPANHA</span>
          <span>
            LOTE {String(hoje.getFullYear()).slice(2)}
            {String(hoje.getMonth() + 1).padStart(2, "0")} · VAL {String(validade.getMonth() + 1).padStart(2, "0")}/{validade.getFullYear()}
          </span>
        </p>
      </div>

      <div className="faixa-bula" aria-label="Como a Cápsula funciona">
        <div className="faixa-bula-trilho">
          {[0, 1].map((copia) => (
            <p key={copia} className="faixa-bula-texto" aria-hidden={copia === 1}>
              <b>Indicação</b> campanhas de uma rede de farmácias <b>Composição</b> memória de campanhas + tendências + época do ano{" "}
              <b>Posologia</b> 3 a 5 variações por canal e público <b>Contraindicações</b> promessa de cura, diagnóstico, desconto sem validade{" "}
              <b>Advertência</b> toda peça passa pela aprovação de uma pessoa
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
