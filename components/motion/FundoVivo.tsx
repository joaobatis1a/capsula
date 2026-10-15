"use client";

import { useEffect, useRef } from "react";
import "./fundo.css";

/* Fundo do app: o relevo de uma cartela, que acende em volta do cursor.
   E a onda que sai do ponto do clique em botões, chips e opções. */

const ALVOS_DA_ONDA = ".cp-btn, .estudio-chip, .seg-op, .cartela-celula, .interruptor";

export function FundoVivo() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fundo = ref.current;
    const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let quadro = 0;

    function mover(e: PointerEvent) {
      if (!fundo || e.pointerType !== "mouse") return;
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => {
        fundo.style.setProperty("--mx", `${e.clientX}px`);
        fundo.style.setProperty("--my", `${e.clientY}px`);
        fundo.classList.add("is-ativo");
      });
    }

    function ondular(e: PointerEvent) {
      if (semMovimento) return;
      const alvo = (e.target as HTMLElement).closest<HTMLElement>(ALVOS_DA_ONDA);
      if (!alvo || (alvo as HTMLButtonElement).disabled) return;
      const r = alvo.getBoundingClientRect();
      const tamanho = Math.max(r.width, r.height) * 2.2;
      const onda = document.createElement("span");
      onda.className = "onda";
      onda.style.width = onda.style.height = `${tamanho}px`;
      onda.style.left = `${e.clientX - r.left - tamanho / 2}px`;
      onda.style.top = `${e.clientY - r.top - tamanho / 2}px`;
      alvo.appendChild(onda);
      onda.addEventListener("animationend", () => onda.remove(), { once: true });
    }

    window.addEventListener("pointermove", mover, { passive: true });
    window.addEventListener("pointerdown", ondular, { passive: true });
    return () => {
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerdown", ondular);
      cancelAnimationFrame(quadro);
    };
  }, []);

  return (
    <div ref={ref} className="fundo-vivo" aria-hidden="true">
      <span className="fundo-relevo" />
      <span className="fundo-luz" />
    </div>
  );
}
