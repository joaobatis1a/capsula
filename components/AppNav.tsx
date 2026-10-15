"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Estúdio" },
  { href: "/design-system", label: "Design system" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="app-nav" aria-label="Principal">
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} aria-current={pathname === l.href ? "page" : undefined}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
