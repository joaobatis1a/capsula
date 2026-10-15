"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import "./cabecalho.css";

const LINKS = [
  { href: "/", label: "Estúdio" },
  { href: "/memoria", label: "Memória" },
  { href: "/radar", label: "Radar" },
  { href: "/saude", label: "Ano da saúde" },
  { href: "/ganho", label: "Ganho" },
];

/* Cabeçalho: uma ilha em forma de cápsula, que flutua sobre a página. Anil de um lado, brasa do outro, bem suave.
   Ao rolar para baixo a própria ilha encolhe e vira o comprimido da marca (anil e brasa, divididos no meio), no centro;
   volta ao rolar para cima, ao passar o mouse ou ao tocar nela. A faixa do cabeçalho guarda sempre a altura da ilha
   aberta, então o conteúdo nunca se mexe. */

export function Cabecalho({ status, resumo, comIA }: { status: ReactNode; resumo: string; comIA: boolean }) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const intRef = useRef<HTMLDivElement>(null);
  const compactoRef = useRef(false);
  const [compacto, setCompacto] = useState(false);
  const [altura, setAltura] = useState<number | null>(null);
  const preso = useRef(false); // mouse ou foco dentro da ilha: não recolhe
  const [pilula, setPilula] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  // A pílula acompanha o link da página atual, inclusive quando o menu rola no celular.
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const medir = () => {
      const ativo = nav.querySelector<HTMLElement>("a[aria-current='page']");
      setPilula(ativo ? { x: ativo.offsetLeft, y: ativo.offsetTop, w: ativo.offsetWidth, h: ativo.offsetHeight } : null);
      if (ativo && nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: ativo.offsetLeft - (nav.clientWidth - ativo.offsetWidth) / 2, behavior: "smooth" });
    };
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(nav);
    return () => obs.disconnect();
  }, [pathname]);

  // Guarda a altura da ilha aberta: a faixa do cabeçalho não muda quando ela se recolhe, e a ilha anima a altura até o comprimido.
  useLayoutEffect(() => {
    const el = intRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => {
      if (!compactoRef.current) setAltura(el.offsetHeight);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    compactoRef.current = compacto;
  }, [compacto]);

  // Recolhe ao rolar para baixo; abre ao rolar para cima e no topo da página.
  useEffect(() => {
    let ultimo = window.scrollY;
    const rolar = () => {
      const y = window.scrollY;
      const d = y - ultimo;
      if (y < 80) setCompacto(false);
      else if (d > 6 && !preso.current) setCompacto(true);
      else if (d < -6) setCompacto(false);
      if (Math.abs(d) > 6 || y < 80) ultimo = y;
    };
    window.addEventListener("scroll", rolar, { passive: true });
    return () => window.removeEventListener("scroll", rolar);
  }, []);

  // Ao trocar de página, a ilha abre.
  const [rota, setRota] = useState(pathname);
  if (rota !== pathname) {
    setRota(pathname);
    setCompacto(false);
  }

  return (
    <header className={compacto ? "cab is-compacto" : "cab"} style={altura ? ({ "--cab-h": `${altura + 12}px`, "--ilha-h": `${altura}px` } as React.CSSProperties) : undefined}>
      <div
        className="cab-ilha"
        onPointerEnter={() => (preso.current = true)}
        onPointerLeave={() => (preso.current = false)}
        onFocus={() => (preso.current = true)}
        onBlur={() => (preso.current = false)}
      >
        <div ref={intRef} className="cab-int" inert={compacto}>
          <Link href="/" className="cab-logo" aria-label="Cápsula, início">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo-light" src="/brand/capsula-lockup.svg" alt="" width={138} height={32} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo-dark" src="/brand/capsula-lockup-dark.svg" alt="" width={138} height={32} />
          </Link>

          <nav ref={navRef} className="cab-nav" aria-label="Principal">
            {pilula ? <span className="cab-pilula" aria-hidden="true" style={{ transform: `translate(${pilula.x}px, ${pilula.y}px)`, width: pilula.w, height: pilula.h }} /> : null}
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} aria-current={pathname === l.href ? "page" : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="cab-lado">{status}</div>
        </div>

        {/* Recolhida, a própria ilha é o comprimido: tocar nela abre o menu. O ponto na divisão mostra o estado do sistema. */}
        <button type="button" className="cab-abrir" aria-label={`Abrir o menu. Estado: ${resumo}`} title={resumo} aria-expanded={!compacto} tabIndex={compacto ? 0 : -1} onClick={() => setCompacto(false)} onPointerEnter={(e) => e.pointerType === "mouse" && setCompacto(false)}>
          <span className={comIA ? "cab-ponto is-ia" : "cab-ponto"} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
