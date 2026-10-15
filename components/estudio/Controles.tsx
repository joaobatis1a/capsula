"use client";

import { useLayoutEffect, useRef, useState } from "react";
import "./controles.css";

/* Controles do briefing com movimento: seletor de segmentos com marcador que desliza e interruptor. */

export function Segmentos<T extends string | number>({
  rotulo,
  opcoes,
  valor,
  mudar,
}: {
  rotulo: string;
  opcoes: { valor: T; nome: string }[];
  valor: T;
  mudar: (v: T) => void;
}) {
  const grupo = useRef<HTMLDivElement>(null);
  const [marcador, setMarcador] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const el = grupo.current;
    if (!el) return;
    const medir = () => {
      const ativo = el.querySelector<HTMLElement>("[aria-checked='true']");
      if (ativo) setMarcador({ x: ativo.offsetLeft, y: ativo.offsetTop, w: ativo.offsetWidth, h: ativo.offsetHeight });
    };
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    return () => obs.disconnect();
  }, [valor]);

  function teclado(e: React.KeyboardEvent, i: number) {
    const passo = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!passo) return;
    e.preventDefault();
    const proxima = opcoes[(i + passo + opcoes.length) % opcoes.length];
    mudar(proxima.valor);
    requestAnimationFrame(() => grupo.current?.querySelector<HTMLElement>("[aria-checked='true']")?.focus());
  }

  return (
    <div className="cp-field">
      <span className="cp-label" id={`seg-${rotulo}`}>
        {rotulo}
      </span>
      <div ref={grupo} className="segmentos" role="radiogroup" aria-labelledby={`seg-${rotulo}`}>
        {marcador ? <span className="segmentos-marcador" aria-hidden="true" style={{ transform: `translate(${marcador.x}px, ${marcador.y}px)`, width: marcador.w, height: marcador.h }} /> : null}
        {opcoes.map((o, i) => (
          <button
            key={String(o.valor)}
            type="button"
            role="radio"
            aria-checked={o.valor === valor}
            tabIndex={o.valor === valor ? 0 : -1}
            className="seg-op"
            onClick={() => mudar(o.valor)}
            onKeyDown={(e) => teclado(e, i)}
          >
            {o.nome}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Interruptor({ ligado, mudar, children }: { ligado: boolean; mudar: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="interruptor-linha">
      <button type="button" role="switch" aria-checked={ligado} className="interruptor" onClick={() => mudar(!ligado)}>
        <span className="interruptor-bolinha" />
      </button>
      <span>{children}</span>
    </label>
  );
}
