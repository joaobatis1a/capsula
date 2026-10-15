"use client";

import Link from "next/link";
import { Button, Icon } from "@/components/ds";
import { FaixaAno } from "@/components/saude/FaixaAno";
import type { Sazonalidade } from "@/lib/data/types";
import { MESES_NOME, NIVEL } from "@/lib/saude/rotulos";
import "@/components/saude/saude.css";
import "./abertura.css";

/* Abertura do Estúdio: o título com a palavra-cápsula e o que está em alta agora na saúde, com dados reais da base.
   Escolher um tema preenche o briefing. */

export function Abertura({ agora, mes, onUsar, onEscrever }: { agora: Sazonalidade[]; mes: number; onUsar: (s: Sazonalidade) => void; onEscrever: () => void }) {
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
          A Cápsula junta o que já funcionou nas suas campanhas com o que está em alta e com a época do ano, e entrega variações prontas para revisar, cada
          uma com a sua bula.
        </p>
        <div className="abertura-acoes">
          <Button variant="capsula" onClick={onEscrever}>
            Escrever um briefing
          </Button>
          <Link href="/saude" className="abertura-link">
            Ver o ano da saúde
            <Icon name="arrow" size={16} />
          </Link>
        </div>
      </div>

      <aside className="agora" aria-labelledby="titulo-agora">
        <header className="agora-topo">
          <p className="receita-olho">Agora na saúde · {MESES_NOME[mes - 1]}</p>
          <h2 id="titulo-agora" className="t-h3">
            Escolha um tema e o briefing se preenche
          </h2>
        </header>
        <ul className="agora-lista">
          {agora.map((s, i) => (
            <li key={s.id} style={{ "--i": i } as React.CSSProperties}>
              <button
                type="button"
                className="agora-item"
                onClick={() => onUsar(s)}
                aria-label={`Usar no briefing: ${s.condicao}. ${NIVEL[s.intensidade[mes - 1]]} em ${MESES_NOME[mes - 1]}.`}
              >
                <span className="agora-nome">{s.condicao}</span>
                <span className="agora-sub">{s.categorias.slice(0, 3).join(" · ")}</span>
                <FaixaAno intensidade={s.intensidade} mes={mes} nome={s.condicao} />
                <span className="agora-usar" aria-hidden="true">
                  Usar no briefing
                  <Icon name="arrow" size={14} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
