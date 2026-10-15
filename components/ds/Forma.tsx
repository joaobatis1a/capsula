import { cx } from "./Icon";

/* Formas farmacêuticas da Cápsula. Cada forma significa uma coisa do produto:
   cápsula = a peça gerada · comprimido sulcado = memória · softgel = tendência
   efervescente = em alta · drágea = aprovado · comprimido oblongo = briefing.
   Os gradientes ficam em <FormasDefs /> (uma vez no layout). O gesto de hover vem de forma.css. */

export type TipoForma = "capsula" | "comprimido" | "softgel" | "efervescente" | "dragea" | "caplet";

export const FORMAS: Record<TipoForma, { nome: string; significa: string; uso: string }> = {
  capsula: { nome: "Cápsula", significa: "A peça gerada", uso: "Duas metades: memória e tendência juntas. Marca e etiqueta Gerado." },
  comprimido: { nome: "Comprimido sulcado", significa: "Memória", uso: "A dose registrada. O sulco divide o histórico do que veio depois." },
  softgel: { nome: "Cápsula gelatinosa", significa: "Tendência", uso: "Brilhante e viva: o que está em alta nas plataformas." },
  efervescente: { nome: "Efervescente", significa: "Em alta agora", uso: "O pico do mês. As bolhas sobem quando algo está acontecendo." },
  dragea: { nome: "Drágea", significa: "Aprovado", uso: "Revestida e pronta: passou pela governança e por uma pessoa." },
  caplet: { nome: "Comprimido oblongo", significa: "Briefing", uso: "A receita que começa a campanha." },
};

/** Gradientes e filtros usados pelas formas. Renderize uma vez, no layout. */
export function FormasDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="fg-corpo" cx="34%" cy="28%" r="80%">
          <stop offset="0" style={{ stopColor: "var(--forma-corpo)" }} />
          <stop offset="1" style={{ stopColor: "var(--forma-corpo-sombra)" }} />
        </radialGradient>
        <linearGradient id="fg-corpo-h" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--forma-corpo)" }} />
          <stop offset="1" style={{ stopColor: "var(--forma-corpo-sombra)" }} />
        </linearGradient>
        <radialGradient id="fg-soft" cx="35%" cy="30%" r="85%">
          <stop offset="0" style={{ stopColor: "var(--brasa-300)" }} />
          <stop offset="0.55" style={{ stopColor: "var(--brasa-500)" }} />
          <stop offset="1" style={{ stopColor: "var(--brasa-700)" }} />
        </radialGradient>
        <radialGradient id="fg-dragea" cx="34%" cy="28%" r="85%">
          <stop offset="0" style={{ stopColor: "#7ADFB6" }} />
          <stop offset="0.5" style={{ stopColor: "#1FA97A" }} />
          <stop offset="1" style={{ stopColor: "#087449" }} />
        </radialGradient>
        <linearGradient id="fg-sombra-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const A = "M30.75 20H18a12 12 0 0 0 0 24h12.75z";
const B = "M33.25 20H46a12 12 0 0 1 0 24H33.25z";

export function Forma({ tipo, size = 24, className, titulo, style }: { tipo: TipoForma; size?: number; className?: string; titulo?: string; style?: React.CSSProperties }) {
  return (
    <svg
      className={cx("forma", `forma-${tipo}`, className)}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role={titulo ? "img" : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
      focusable="false"
    >
      {tipo === "capsula" ? (
        <g transform="rotate(-35 32 32)">
          <g className="fm-a">
            <path d={A} fill="var(--memoria-fill)" />
            <path d={A} fill="url(#fg-sombra-v)" />
            <rect x="14" y="23" width="13" height="2.8" rx="1.4" fill="#fff" opacity="0.42" />
          </g>
          <g className="fm-b">
            <path d={B} fill="var(--tendencia-fill)" />
            <path d={B} fill="url(#fg-sombra-v)" />
            <rect x="37" y="23" width="13" height="2.8" rx="1.4" fill="#fff" opacity="0.42" />
          </g>
        </g>
      ) : null}

      {tipo === "comprimido" ? (
        <g transform="rotate(-35 32 32)">
          <g className="fm-a">
            <path d="M31.4 10.5a21.5 21.5 0 0 0 0 43z" fill="url(#fg-corpo)" stroke="var(--forma-borda)" strokeWidth="1.5" />
            <rect x="15" y="25" width="11" height="2.8" rx="1.4" fill="var(--memoria-fill)" />
            <rect x="15" y="31" width="7" height="2.8" rx="1.4" fill="var(--memoria-fill)" opacity="0.7" />
          </g>
          <g className="fm-b">
            <path d="M32.6 10.5a21.5 21.5 0 0 1 0 43z" fill="url(#fg-corpo)" stroke="var(--forma-borda)" strokeWidth="1.5" />
          </g>
          <ellipse cx="22" cy="17.5" rx="6" ry="2.6" fill="#fff" opacity="0.55" transform="rotate(20 22 17.5)" />
        </g>
      ) : null}

      {tipo === "softgel" ? (
        <g transform="rotate(-35 32 32)">
          <g className="fm-corpo">
            <ellipse cx="32" cy="32" rx="25" ry="13.5" fill="url(#fg-soft)" />
            <ellipse cx="32" cy="32" rx="25" ry="13.5" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="1" />
            <path d="M13 29.5c2.6-5.6 8.6-8 14.4-8.2" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="2.6" strokeLinecap="round" />
            <ellipse cx="45" cy="37.5" rx="5.5" ry="2" fill="#fff" opacity="0.22" />
            <circle cx="36" cy="30.5" r="1.6" fill="#fff" opacity="0.35" />
          </g>
        </g>
      ) : null}

      {tipo === "efervescente" ? (
        <g>
          <g className="fm-bolhas" fill="none" stroke="var(--memoria-fill)" strokeWidth="1.6">
            <circle className="fm-bolha b1" cx="24" cy="14" r="2.6" />
            <circle className="fm-bolha b2" cx="35" cy="10" r="2" />
            <circle className="fm-bolha b3" cx="45" cy="14.5" r="2.9" />
          </g>
          <g className="fm-corpo">
            <circle cx="32" cy="36" r="20" fill="url(#fg-corpo)" stroke="var(--forma-borda)" strokeWidth="1.5" />
            <g>
              <circle cx="22" cy="31" r="1.7" fill="var(--memoria-fill)" />
              <circle cx="31" cy="26" r="1.4" fill="var(--tendencia-fill)" />
              <circle cx="41" cy="31" r="1.8" fill="var(--memoria-fill)" />
              <circle cx="26" cy="40" r="1.5" fill="var(--tendencia-fill)" />
              <circle cx="37" cy="42" r="1.7" fill="var(--memoria-fill)" />
              <circle cx="44" cy="39" r="1.2" fill="var(--tendencia-fill)" />
              <circle cx="31" cy="47" r="1.3" fill="var(--memoria-fill)" />
            </g>
            <ellipse cx="23.5" cy="24" rx="6" ry="2.6" fill="#fff" opacity="0.5" transform="rotate(-30 23.5 24)" />
          </g>
        </g>
      ) : null}

      {tipo === "dragea" ? (
        <g className="fm-corpo">
          <circle cx="32" cy="32" r="21.5" fill="url(#fg-dragea)" />
          <circle cx="32" cy="32" r="21.5" fill="none" stroke="#04442b" strokeOpacity="0.35" strokeWidth="1.2" />
          <path className="fm-brilho" d="M17.5 24.5c2.8-6.2 8.8-9.6 15-9.4" fill="none" stroke="#fff" strokeOpacity="0.75" strokeWidth="3" strokeLinecap="round" />
          <path d="M23 33.5l6 6 12-13" fill="none" stroke="#fff" strokeOpacity="0.95" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : null}

      {tipo === "caplet" ? (
        <g transform="rotate(-35 32 32)">
          <g className="fm-corpo">
            <rect x="7" y="23" width="50" height="18" rx="9" fill="url(#fg-corpo-h)" stroke="var(--forma-borda)" strokeWidth="1.5" />
            <path d="M32 24v16" stroke="var(--forma-borda)" strokeWidth="1.6" strokeLinecap="round" />
            <rect x="13" y="29" width="13" height="2.6" rx="1.3" fill="var(--tendencia-fill)" />
            <rect x="13" y="34" width="8" height="2.6" rx="1.3" fill="var(--tendencia-fill)" opacity="0.7" />
            <rect x="12" y="25.2" width="16" height="2.4" rx="1.2" fill="#fff" opacity="0.55" />
          </g>
        </g>
      ) : null}
    </svg>
  );
}
