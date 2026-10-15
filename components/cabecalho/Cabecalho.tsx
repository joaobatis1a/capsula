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

/* Cabeçalho: logo, menu com a pílula que desliza até a página atual e o estado do sistema.
   Compacta ao rolar e mostra o progresso da página numa linha que vai do anil (memória) ao brasa (tendência). */

export function Cabecalho({ status }: { status: ReactNode }) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const cabRef = useRef<HTMLElement>(null);
  const [pilula, setPilula] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [compacto, setCompacto] = useState(false);

  // A pílula acompanha o link da página atual, inclusive quando o menu quebra de linha ou rola no celular.
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const medir = () => {
      const ativo = nav.querySelector<HTMLElement>("a[aria-current='page']");
      setPilula(ativo ? { x: ativo.offsetLeft, y: ativo.offsetTop, w: ativo.offsetWidth, h: ativo.offsetHeight } : null);
      ativo?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    };
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(nav);
    return () => obs.disconnect();
  }, [pathname]);

  // Compacta depois de 12px de rolagem e atualiza o progresso (--p, de 0 a 1) sem re-renderizar.
  useEffect(() => {
    let quadro = 0;
    const atualizar = () => {
      quadro = 0;
      const y = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      cabRef.current?.style.setProperty("--p", String(total > 0 ? Math.min(1, y / total) : 0));
      setCompacto(y > 12);
    };
    const aoRolar = () => {
      if (!quadro) quadro = requestAnimationFrame(atualizar);
    };
    atualizar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar, { passive: true });
    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
      cancelAnimationFrame(quadro);
    };
  }, [pathname]);

  return (
    <header ref={cabRef} className={compacto ? "cab is-compacto" : "cab"}>
      <div className="cab-linha">
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
      <span className="cab-progresso" aria-hidden="true" />
    </header>
  );
}
