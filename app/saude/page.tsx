import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { Forma } from "@/components/ds";
import { AnoDaSaude } from "@/components/saude/AnoDaSaude";
import { getDataSource } from "@/lib/data";
import "@/components/estudio/estudio.css";
import "@/components/estudio/movimento.css";

export const metadata: Metadata = { title: "Ano da saúde · Cápsula" };

export default function SaudePage() {
  return (
    <>
      <header style={{ display: "grid", gap: "var(--space-2)", maxWidth: 760 }}>
        <p className="receita-olho">Radar de sazonalidade</p>
        <div className="titulo-forma tem-forma">
          <Forma tipo="efervescente" size={56} className="forma-entra is-viva" />
          <h1 className="t-h1">Ano da saúde</h1>
        </div>
        <p>
          Quando cada condição sobe, onde, quem mais sente e o que a farmácia pode oferecer. Escolha um mês, filtre por tema, causa ou região e abra
          a ficha para criar um briefing já com o assunto certo.
        </p>
      </header>
      <Suspense fallback={<div className="esqueleto" style={{ height: 420 }} />}>
        <Conteudo />
      </Suspense>
    </>
  );
}

async function Conteudo() {
  await connection();
  const fonte = getDataSource();
  const [itens, datas] = await Promise.all([fonte.getSaudeDoAno(), fonte.getDatasSaude()]);
  return <AnoDaSaude itens={itens} datas={datas} mesAtual={new Date().getMonth() + 1} />;
}
