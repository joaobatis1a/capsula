import type { Metadata } from "next";
import Link from "next/link";
import { AppNav } from "@/components/AppNav";
import "@/components/ds/ds.css";
import { AvisosProvider } from "@/components/motion/Avisos";
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
          Protótipo do hackathon. Todos os dados de campanha são sintéticos.
        </footer>
      </body>
    </html>
  );
}
