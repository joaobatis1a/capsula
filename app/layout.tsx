import type { Metadata } from "next";
import Link from "next/link";
import { AppNav } from "@/components/AppNav";
import "@/components/ds/ds.css";
import "@/components/ds/forma.css";
import { FORMAS, Forma, FormasDefs, type TipoForma } from "@/components/ds";
import { AvisosProvider } from "@/components/motion/Avisos";
import { FundoVivo } from "@/components/motion/FundoVivo";
import { instrumentSans, plexMono, unbounded } from "./fonts";
import "./globals.css";
import "./motion.css";
import "./tokens.css";

export const metadata: Metadata = {
  title: "Cápsula",
  description: "Estúdio criativo com memória: criatividade na dose certa.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${unbounded.variable} ${instrumentSans.variable} ${plexMono.variable}`}>
      <body>
        <FormasDefs />
        <FundoVivo />
        <header className="app-header">
          <Link href="/" className="app-logo" aria-label="Cápsula, início">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo-light" src="/brand/capsula-lockup.svg" alt="" width={138} height={32} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo-dark" src="/brand/capsula-lockup-dark.svg" alt="" width={138} height={32} />
          </Link>
          <AppNav />
        </header>
        <AvisosProvider>
          <main className="app-main">{children}</main>
        </AvisosProvider>
        <footer className="app-footer t-caption t-muted">
          <ul className="rodape-formas" aria-label="Formas farmacêuticas da Cápsula">
            {(Object.keys(FORMAS) as TipoForma[]).map((t) => (
              <li key={t}>
                <Link href="/design-system#formas" className="rodape-forma tem-forma" data-nome={`${FORMAS[t].nome}: ${FORMAS[t].significa.toLowerCase()}`} aria-label={`${FORMAS[t].nome}: ${FORMAS[t].significa}`}>
                  <Forma tipo={t} size={30} />
                </Link>
              </li>
            ))}
          </ul>
          Protótipo do hackathon. Todos os dados de campanha são sintéticos.
        </footer>
      </body>
    </html>
  );
}
