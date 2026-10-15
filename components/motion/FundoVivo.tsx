"use client";

import { useEffect } from "react";
import "./fundo.css";

/* Onda que sai do ponto do clique em botões, chips e opções.
   O fundo do app é liso, com um grão fino de papel (fundo.css). */

const ALVOS_DA_ONDA = ".cp-btn, .estudio-chip, .interruptor, .agora-item, .saude-th-mes button";

export function FundoVivo() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function ondular(e: PointerEvent) {
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

    window.addEventListener("pointerdown", ondular, { passive: true });
    return () => window.removeEventListener("pointerdown", ondular);
  }, []);

  return <div className="fundo-ambiente" aria-hidden="true" />;
}
