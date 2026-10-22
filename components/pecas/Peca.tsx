"use client";

import { Nunito_Sans, Poppins } from "next/font/google";
import { forwardRef, useEffect, useRef, useState, type CSSProperties } from "react";
import { MARCA, getVariaveisCSS, type Tema } from "@/lib/marca";
import type { Formato } from "@/types/briefing";
import "./pecas.css";

/* Templates das peças (#28): HTML e CSS nos três formatos, só com o manual de marca sintético.
   Nenhuma imagem gerada por IA: o visual vem de cor, forma e tipografia. */

const titulo = Poppins({ subsets: ["latin"], weight: ["800"], variable: "--peca-fonte-titulo", display: "swap" });
const texto = Nunito_Sans({ subsets: ["latin"], weight: ["600", "800"], variable: "--peca-fonte-texto", display: "swap" });

export const TAMANHOS: Record<Formato, { largura: number; altura: number }> = {
  feed: { largura: 1080, altura: 1080 },
  story: { largura: 1080, altura: 1920 },
  banner: { largura: 1920, altura: 1080 },
};

export interface ConteudoPeca {
  titulo: string;
  texto: string;
  cta: string;
  selo?: string;
  precoDe?: number;
  precoPor?: number;
  /** aaaa-mm-dd */
  validade: string;
  condicao?: string;
  advertencia?: string;
}

export interface PecaProps {
  conteudo: ConteudoPeca;
  formato: Formato;
  /** Tema da peça: "claro" (padrão, a marca verde), "escuro" ou "sistema" (segue o navegador) */
  tema?: Tema;
}

/** A peça no tamanho real (1080 ou 1920 px). Use dentro de <PecaEscalada> para caber na tela. */
export const Peca = forwardRef<HTMLDivElement, PecaProps>(
  function Peca({ conteudo: c, formato, tema = "claro" }, ref) {
    const { largura, altura } = TAMANHOS[formato];
    const [ano, mes, dia] = c.validade.split("-");
    const temPreco = c.precoDe != null && c.precoPor != null;

    // Resolve tema: "sistema" usa prefers-color-scheme
    const temaResolvido: "claro" | "escuro" = tema === "sistema"
      ? (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "escuro" : "claro")
      : (tema as "claro" | "escuro");

    const vars = getVariaveisCSS(temaResolvido);

    return (
      <div
        ref={ref}
        className={`peca peca-${formato} ${titulo.variable} ${texto.variable}`}
        style={{ ...vars, width: largura, height: altura } as CSSProperties}
        role="img"
        aria-label={`${c.titulo}. ${c.texto}`}
      >
        <span className="peca-forma" aria-hidden="true" />
        <span className="peca-forma peca-forma-2" aria-hidden="true" />

        <header className="peca-topo">
          <span className="peca-logo">
            <span className="peca-logo-cruz" aria-hidden="true">
              +
            </span>
            {MARCA.nome}
          </span>
          {c.selo ? <span className="peca-selo">{c.selo}</span> : null}
        </header>

        <div className="peca-corpo">
          <h2 className="peca-titulo">{c.titulo}</h2>
          <p className="peca-texto">{c.texto}</p>
        </div>

        <div className="peca-acao">
          {temPreco ? (
            <p className="peca-preco">
              <span className="peca-preco-de">De {real(c.precoDe!)}</span>
              <span className="peca-preco-por">
                por <b>{real(c.precoPor!)}</b>
              </span>
            </p>
          ) : null}
          <span className="peca-cta">{c.cta}</span>
        </div>

        <footer className="peca-rodape">
          <p className="peca-legal">
            Oferta válida até {dia}/{mes}/{ano}.{c.condicao ? ` ${c.condicao}` : ""}
          </p>
          {c.advertencia ? <p className="peca-advertencia">{c.advertencia}</p> : null}
        </footer>
      </div>
    );
  }
);

/** Mostra a peça em qualquer largura, mantendo a proporção do formato. */
export function PecaEscalada({ conteudo, formato, pecaRef, tema }: { conteudo: ConteudoPeca; formato: Formato; pecaRef?: React.Ref<HTMLDivElement>; tema?: Tema }) {
  const caixa = useRef<HTMLDivElement>(null);
  const [escala, setEscala] = useState(0);
  const { largura, altura } = TAMANHOS[formato];

  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const medir = () => setEscala(el.clientWidth / largura);
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    return () => obs.disconnect();
  }, [largura]);

  return (
    <div ref={caixa} className="peca-caixa" style={{ aspectRatio: `${largura} / ${altura}` }}>
      <div className="peca-escala" style={{ transform: `scale(${escala})`, visibility: escala ? "visible" : "hidden" }}>
        <Peca ref={pecaRef} conteudo={conteudo} formato={formato} tema={tema} />
      </div>
    </div>
  );
}

/** Gera o PNG da peça no tamanho real, no navegador. */
export async function baixarPng(no: HTMLElement, formato: Formato, nome: string) {
  const { toPng } = await import("html-to-image");
  const { largura, altura } = TAMANHOS[formato];
  const url = await toPng(no, { width: largura, height: altura, pixelRatio: 1, cacheBust: true });
  const a = document.createElement("a");
  a.href = url;
  a.download = `${nome}-${formato}.png`;
  a.click();
}

function real(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}