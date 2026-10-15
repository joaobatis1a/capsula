"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

/* Mostra o conteúdo subindo quando entra na tela. `i` atrasa em passos de 60ms, para sequências. */
export function Revela({ children, i = 0, as: Tag = "div", className = "", style }: { children: ReactNode; i?: number; as?: ElementType; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisivel(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`revela ${visivel ? "is-visivel" : ""} ${className}`} style={{ ...style, "--i": i } as CSSProperties}>
      {children}
    </Tag>
  );
}

/** Conta de 0 até o valor quando aparece. */
export function Conta({ valor, duracao = 900, formatar = (n: number) => Math.round(n).toLocaleString("pt-BR") }: { valor: number; duracao?: number; formatar?: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [atual, setAtual] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let quadro = 0;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      if (semMovimento) return setAtual(valor);
      const inicio = performance.now();
      const passo = (agora: number) => {
        const t = Math.min(1, (agora - inicio) / duracao);
        setAtual(valor * (1 - Math.pow(1 - t, 3)));
        if (t < 1) quadro = requestAnimationFrame(passo);
      };
      quadro = requestAnimationFrame(passo);
    });
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(quadro);
    };
  }, [valor, duracao]);

  return (
    <span ref={ref} aria-label={formatar(valor)}>
      <span aria-hidden="true">{formatar(atual)}</span>
    </span>
  );
}
