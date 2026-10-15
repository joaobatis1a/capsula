"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import "./cabecalho.css";

const LINKS = [
  { href: "/", label: "Estúdio" },
  { href: "/memoria", label: "Memória" },
  { href: "/radar", label: "Radar" },
  { href: "/saude", label: "Ano da saúde" },
  { href: "/ganho", label: "Ganho" },
];

/* Cabeçalho: uma ilha em forma de cápsula, que flutua sobre a página. Anil de um lado, brasa do outro, bem suave.
   Altura fixa, sem encolher ao rolar: mudar a altura empurrava o conteúdo e dava um pulo no começo da rolagem. */

export function Cabecalho({ status }: { status: ReactNode }) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
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

  return (
    <header className="cab">
      <div className="cab-ilha">
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
    </header>
  );
}
