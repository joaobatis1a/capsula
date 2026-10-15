"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";

const LINKS = [
  { href: "/", label: "Estúdio" },
  { href: "/memoria", label: "Memória" },
  { href: "/radar", label: "Radar" },
  { href: "/saude", label: "Ano da saúde" },
  { href: "/design-system", label: "Design system" },
];

/* Menu com uma pílula que desliza até a página atual. */
export function AppNav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const [pilula, setPilula] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const medir = () => {
      const ativo = nav.querySelector<HTMLElement>("a[aria-current='page']");
      setPilula(ativo ? { x: ativo.offsetLeft, y: ativo.offsetTop, w: ativo.offsetWidth, h: ativo.offsetHeight } : null);
    };
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(nav);
    return () => obs.disconnect();
  }, [pathname]);

  return (
    <nav ref={navRef} className="app-nav" aria-label="Principal">
      {pilula ? <span className="app-nav-pilula" aria-hidden="true" style={{ transform: `translate(${pilula.x}px, ${pilula.y}px)`, width: pilula.w, height: pilula.h }} /> : null}
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} aria-current={pathname === l.href ? "page" : undefined}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
