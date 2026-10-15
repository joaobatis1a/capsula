import type { Metadata } from "next";
import { Cabecalho } from "@/components/cabecalho/Cabecalho";
import { StatusDoSistema } from "@/components/cabecalho/StatusDoSistema";
import { FormasDefs } from "@/components/ds";
import { getDataSource } from "@/lib/data";
import { provedorAtivo } from "@/lib/llm/client";
import "@/components/ds/ds.css";
import "@/components/ds/forma.css";
import { AvisosProvider } from "@/components/motion/Avisos";
import { FundoVivo } from "@/components/motion/FundoVivo";
import { Rodape } from "@/components/rodape/Rodape";
import { instrumentSans, plexMono, unbounded } from "./fonts";
import "./globals.css";
import "./motion.css";
import "./tokens.css";

export const metadata: Metadata = {
  title: "Cápsula",
  description: "Estúdio criativo com memória: criatividade na dose certa.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const modelo = provedorAtivo();
  const resumo = `${getDataSource().origem === "sintetico" ? "Dados de teste" : "Dados reais"} · ${modelo ? `IA: ${modelo}` : "Sem IA"}`;

  return (
    <html lang="pt-BR" className={`${unbounded.variable} ${instrumentSans.variable} ${plexMono.variable}`}>
      <body>
        <FormasDefs />
        <FundoVivo />
        <Cabecalho status={<StatusDoSistema />} resumo={resumo} />
        <AvisosProvider>
          <main className="app-main">{children}</main>
        </AvisosProvider>
        <Rodape />
      </body>
    </html>
  );
}
