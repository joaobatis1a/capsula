import type { ReactNode } from "react";
import { DoseBar } from "./DoseBar";
import { cx } from "./Icon";
import { OriginTag, StatusPill, type Status } from "./Tags";

export type Formato = "feed" | "story" | "banner";

const FORMATO: Record<Formato, string> = { feed: "Feed 1:1", story: "Story 9:16", banner: "Banner 16:9" };

/** Card de uma variação gerada, na galeria, no formato real. */
export interface PieceCardProps {
  titulo: string;
  texto?: string;
  canal?: string;
  formato?: Formato;
  memoria?: number;
  status?: Status;
  selo?: string;
  onBula?: () => void;
  children?: ReactNode;
}

export function PieceCard({ titulo, texto, canal = "Instagram", formato = "feed", memoria = 50, status = "rascunho", selo, onBula, children }: PieceCardProps) {
  return (
    <article className={cx("cp-piece", `cp-piece-${formato}`)}>
      <DoseBar memoria={memoria} compact />
      <div className="cp-piece-thumb">
        {children ?? (
          <div className="cp-piece-mock">
            <span className="cp-piece-mock-k">{selo ?? "Oferta"}</span>
            <span className="cp-piece-mock-t">{titulo}</span>
          </div>
        )}
      </div>
      <div className="cp-piece-body">
        <p className="cp-piece-meta">
          {canal} · {FORMATO[formato]}
        </p>
        <h3 className="cp-piece-title">{titulo}</h3>
        {texto ? <p className="cp-piece-text">{texto}</p> : null}
      </div>
      <footer className="cp-piece-foot">
        <StatusPill status={status} />
        {onBula ? (
          <button type="button" className="cp-link" onClick={onBula}>
            Ver bula
          </button>
        ) : (
          <span className="cp-link is-static">Ver bula</span>
        )}
      </footer>
    </article>
  );
}

/** Item do radar de tendências, sempre com fonte, data e validade. */
export interface TrendItemProps {
  plataforma: string;
  tipo: string;
  termo: string;
  ideia?: string;
  fonte?: string;
  data?: string;
  validade?: string;
}

export function TrendItem({ plataforma, tipo, termo, ideia, fonte = "Observação manual", data = "—", validade = "—" }: TrendItemProps) {
  return (
    <article className="cp-trend">
      <div className="cp-trend-top">
        <OriginTag origin="tendencia">{plataforma}</OriginTag>
        <span className="cp-trend-tipo">{tipo}</span>
      </div>
      <h3 className="cp-trend-term">{termo}</h3>
      {ideia ? <p className="cp-trend-idea">{ideia}</p> : null}
      <dl className="cp-trend-meta">
        <div>
          <dt>Fonte</dt>
          <dd>{fonte}</dd>
        </div>
        <div>
          <dt>Visto em</dt>
          <dd>{data}</dd>
        </div>
        <div>
          <dt>Vale até</dt>
          <dd>{validade}</dd>
        </div>
      </dl>
    </article>
  );
}

export interface Cena {
  tempo: string;
  visual?: string;
  fala?: string;
  tela?: string;
}

/** Roteiro de vídeo curto ou comercial, cena a cena. A primeira cena é o gancho (0 a 3s). */
export interface RoteiroProps {
  titulo: string;
  formato?: string;
  duracao?: string;
  cenas: Cena[];
}

export function Roteiro({ titulo, formato, duracao = "", cenas }: RoteiroProps) {
  return (
    <article className="cp-roteiro">
      <header className="cp-roteiro-head">
        <h3 className="cp-roteiro-title">{titulo}</h3>
        <span className="cp-roteiro-dur">
          {formato ? `${formato} · ` : ""}
          {duracao}
        </span>
      </header>
      <ol className="cp-roteiro-list">
        {cenas.map((c, i) => (
          <li key={i} className={cx("cp-cena", i === 0 && "is-hook")}>
            <span className="cp-cena-t">{c.tempo}</span>
            <div className="cp-cena-b">
              {i === 0 ? <span className="cp-cena-kick">Gancho</span> : null}
              {c.visual ? (
                <p>
                  <b>Visual: </b>
                  {c.visual}
                </p>
              ) : null}
              {c.fala ? (
                <p>
                  <b>Fala: </b>
                  {c.fala}
                </p>
              ) : null}
              {c.tela ? (
                <p>
                  <b>Na tela: </b>
                  {c.tela}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}
