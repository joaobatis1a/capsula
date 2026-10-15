"use client";

import { useRef, type CSSProperties, type PointerEvent } from "react";
import { OriginTag } from "@/components/ds";

/* A assinatura do Estúdio: a cápsula de duas metades.
   Abre: as metades chegam e se encaixam. Gerando: se afastam e dosam. Pronto: fecham com um brilho. */

export type EstadoCapsula = "parado" | "dosando" | "pronto";

export function CapsulaViva({ estado }: { estado: EstadoCapsula }) {
  const ref = useRef<HTMLDivElement>(null);

  function mover(e: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", String((e.clientX - r.left) / r.width - 0.5));
    el.style.setProperty("--py", String((e.clientY - r.top) / r.height - 0.5));
  }

  function sair() {
    ref.current?.style.setProperty("--px", "0");
    ref.current?.style.setProperty("--py", "0");
  }

  return (
    <div ref={ref} className={`capsula-viva is-${estado}`} onPointerMove={mover} onPointerLeave={sair} style={{ "--px": 0, "--py": 0 } as CSSProperties} aria-hidden="true">
      <span className="capsula-viva-halo" />
      <svg className="capsula-viva-svg" viewBox="0 0 64 64">
        <g transform="rotate(-35 32 32)">
          <g className="capsula-viva-memoria">
            <path fill="var(--memoria-fill)" d="M30.75 20H18a12 12 0 0 0 0 24h12.75z" />
            <rect className="capsula-viva-linha" fill="var(--on-memoria)" x="12" y="27" width="14" height="2.6" rx="1.3" />
            <rect className="capsula-viva-linha capsula-viva-linha-2" fill="var(--on-memoria)" x="12" y="32.4" width="9" height="2.6" rx="1.3" />
          </g>
          <g className="capsula-viva-tendencia">
            <path fill="var(--tendencia-fill)" d="M33.25 20H46a12 12 0 0 1 0 24H33.25z" />
            <path className="capsula-viva-radar" fill="none" stroke="var(--on-tendencia)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" d="M37.6 37.4l4.2-5 3 2.8 5.6-6.6" />
          </g>
        </g>
      </svg>
      <span className="capsula-viva-tag capsula-viva-tag-m">
        <OriginTag origin="memoria">O que já funcionou</OriginTag>
      </span>
      <span className="capsula-viva-tag capsula-viva-tag-t">
        <OriginTag origin="tendencia">O que está em alta</OriginTag>
      </span>
    </div>
  );
}
