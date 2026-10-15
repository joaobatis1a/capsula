import type { ReactNode } from "react";
import { DoseBar } from "./DoseBar";
import { cx, Icon } from "./Icon";
import { OriginTag, type Origem } from "./Tags";

export interface BulaEvidencia {
  origin: Origem;
  text: string;
  fonte?: string;
}

export interface BulaChecagem {
  ok: boolean;
  text: string;
}

/** A bula que acompanha toda peça gerada. Sem Bula, a peça não vai para revisão. */
export interface BulaProps {
  titulo: string;
  memoria?: number;
  indicacao?: string;
  composicao?: { k: string; v: string }[];
  evidencias?: BulaEvidencia[];
  contraindicacoes?: BulaChecagem[];
  posologia?: string;
}

function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="cp-bula-sec">
      <h4 className="cp-bula-label">{titulo}</h4>
      {children}
    </section>
  );
}

export function Bula({ titulo, memoria, indicacao, composicao, evidencias = [], contraindicacoes = [], posologia }: BulaProps) {
  const bloqueada = contraindicacoes.some((c) => !c.ok);

  return (
    <article className={cx("cp-bula", bloqueada && "is-blocked")}>
      <header className="cp-bula-head">
        <span className="cp-bula-kicker">Bula da peça</span>
        <h3 className="cp-bula-title">{titulo}</h3>
        {memoria != null ? <DoseBar memoria={memoria} /> : null}
      </header>

      {indicacao ? (
        <Secao titulo="Indicação">
          <p>{indicacao}</p>
        </Secao>
      ) : null}

      {composicao?.length ? (
        <Secao titulo="Composição">
          <ul className="cp-bula-comp">
            {composicao.map((c) => (
              <li key={c.k}>
                <span className="cp-bula-k">{c.k}</span>
                <span className="cp-bula-v">{c.v}</span>
              </li>
            ))}
          </ul>
        </Secao>
      ) : null}

      {evidencias.length ? (
        <Secao titulo="Evidências">
          <ul className="cp-bula-ev">
            {evidencias.map((e, i) => (
              <li key={i}>
                <OriginTag origin={e.origin} />
                <span className="cp-bula-evt">{e.text}</span>
                {e.fonte ? <span className="cp-bula-src">{e.fonte}</span> : null}
              </li>
            ))}
          </ul>
        </Secao>
      ) : null}

      {contraindicacoes.length ? (
        <Secao titulo="Contraindicações">
          <ul className="cp-bula-ci">
            {contraindicacoes.map((c, i) => (
              <li key={i} className={c.ok ? "is-ok" : "is-fail"}>
                <Icon name={c.ok ? "check" : "x"} size={16} />
                <span>{c.text}</span>
              </li>
            ))}
          </ul>
        </Secao>
      ) : null}

      {posologia ? (
        <Secao titulo="Posologia">
          <p className="cp-bula-pos">{posologia}</p>
        </Secao>
      ) : null}
    </article>
  );
}
