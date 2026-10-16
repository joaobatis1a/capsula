"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/ds";
import "./cabecalho.css";

const LINKS: { href: string; label: string; curto: string; icone: IconName }[] = [
  { href: "/", label: "Estúdio", curto: "Estúdio", icone: "edit" },
  { href: "/memoria", label: "Memória", curto: "Memória", icone: "archive" },
  { href: "/radar", label: "Radar", curto: "Radar", icone: "trend" },
  { href: "/saude", label: "Ano da saúde", curto: "Saúde", icone: "heart" },
  { href: "/ganho", label: "Ganho", curto: "Ganho", icone: "chart" },
];

/* No celular (até 860px) não há barra no topo: tudo vive numa barra flutuante embaixo, como nos aplicativos, com um ícone de
   traço e o nome de cada página, como no LinkedIn. O ponto na cápsula do Estúdio mostra o estado do sistema. */
const CELULAR = "(max-width: 860px)";
function useCelular() {
  return useSyncExternalStore(
    (aviso) => {
      const m = window.matchMedia(CELULAR);
      m.addEventListener("change", aviso);
      return () => m.removeEventListener("change", aviso);
    },
    () => window.matchMedia(CELULAR).matches,
    () => false,
  );
}

/* Cabeçalho: uma ilha em forma de cápsula, que flutua sobre a página. Anil de um lado, brasa do outro, bem suave.
   Ao rolar para baixo a própria ilha encolhe e vira o comprimido da marca (anil e brasa, divididos no meio), no centro;
   volta ao rolar para cima, ao passar o mouse ou ao tocar nela. A faixa do cabeçalho guarda sempre a altura da ilha
   aberta, então o conteúdo nunca se mexe. No celular o topo tem só o logo e o estado, e é a barra de baixo que faz isso. */

export function Cabecalho({ status, resumo, comIA }: { status: ReactNode; resumo: string; comIA: boolean }) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const celular = useCelular();
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
                <Icon name={l.icone} size={18} />
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="cab-lado">{status}</div>
        </div>

        {/* Recolhida, a própria ilha é o comprimido: tocar nela abre o menu. */}
        <button type="button" className="cab-abrir" aria-label={`Abrir o menu. Estado: ${resumo}`} title={resumo} aria-expanded={!compacto} tabIndex={compacto ? 0 : -1} onClick={() => setCompacto(false)} onPointerEnter={(e) => e.pointerType === "mouse" && setCompacto(false)} />
      </div>

      {/* Celular: barra de baixo em forma de comprimido. Recolhe ao rolar para baixo e volta ao rolar para cima. */}
      <nav className="cab-baixo" aria-label="Principal">
        <div className="cab-baixo-ilha" onPointerEnter={() => (preso.current = true)} onPointerLeave={() => (preso.current = false)} onFocus={() => (preso.current = true)} onBlur={() => (preso.current = false)}>
          <div className="cab-baixo-int" inert={compacto && celular}>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} aria-current={pathname === l.href ? "page" : undefined} aria-label={l.href === "/" ? `${l.label}. Estado: ${resumo}` : undefined}>
                <span className="cab-baixo-icone">
                  <Icon name={l.icone} size={24} />
                  {l.href === "/" ? <span className={comIA ? "cab-ponto is-ia" : "cab-ponto"} aria-hidden="true" title={resumo} /> : null}
                </span>
                <span>{l.curto}</span>
              </Link>
            ))}
          </div>
          <button type="button" className="cab-abrir cab-abrir-baixo" aria-label="Abrir o menu" aria-expanded={!compacto} tabIndex={compacto && celular ? 0 : -1} onClick={() => setCompacto(false)} />
        </div>
      </nav>
    </header>
  );
}
