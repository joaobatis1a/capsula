"use client";

import { useRef } from "react";
import "./controles.css";

/* Controles do briefing: escolha única em chips e interruptor. */

/** Escolha única: chips com o mesmo preenchimento animado dos demais. As setas do teclado trocam a opção. */
export function Escolha<T extends string | number>({ rotulo, opcoes, valor, mudar }: { rotulo: string; opcoes: { valor: T; nome: string }[]; valor: T; mudar: (v: T) => void }) {
  const grupo = useRef<HTMLUListElement>(null);

  function teclado(e: React.KeyboardEvent, i: number) {
    const passo = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!passo) return;
    e.preventDefault();
    mudar(opcoes[(i + passo + opcoes.length) % opcoes.length].valor);
    requestAnimationFrame(() => grupo.current?.querySelector<HTMLElement>("[aria-checked='true']")?.focus());
  }

  return (
    <div className="cp-field" role="radiogroup" aria-label={rotulo}>
      <span className="cp-label">{rotulo}</span>
      <ul ref={grupo} className="estudio-chips">
        {opcoes.map((o, i) => (
          <li key={String(o.valor)}>
            <button
              type="button"
              role="radio"
              aria-checked={o.valor === valor}
              tabIndex={o.valor === valor ? 0 : -1}
              className={o.valor === valor ? "estudio-chip is-on" : "estudio-chip"}
              onClick={() => mudar(o.valor)}
              onKeyDown={(e) => teclado(e, i)}
            >
              {o.nome}
            </button>
          </li>
        ))}
      </ul>
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
