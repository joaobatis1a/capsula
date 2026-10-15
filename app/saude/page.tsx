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
    <div className="pg pg-saude">
      <header className="pg-cabeca">
        <div className="titulo-forma tem-forma">
          <Forma tipo="efervescente" size={56} className="forma-entra is-viva" />
          <div>
            <h1 className="t-h1">Ano da saúde</h1>
            <p className="pg-sub">Quando cada condição sobe, onde, quem mais sente e o que a farmácia pode oferecer. Escolha um mês e abra a ficha para criar um briefing.</p>
          </div>
        </div>
      </header>
      <Suspense fallback={<div className="esqueleto" style={{ height: 420 }} />}>
        <Conteudo />
      </Suspense>
    </div>
  );
}

async function Conteudo() {
  await connection();
  const fonte = getDataSource();
  const [itens, datas] = await Promise.all([fonte.getSaudeDoAno(), fonte.getDatasSaude()]);
  return <AnoDaSaude itens={itens} datas={datas} mesAtual={new Date().getMonth() + 1} />;
}
