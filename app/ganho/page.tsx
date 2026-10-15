import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { Forma } from "@/components/ds";
import { PainelDeGanho } from "@/components/ganho/PainelDeGanho";
import { getDataSource } from "@/lib/data";

export const metadata: Metadata = { title: "Painel de ganho · Cápsula" };

export default function GanhoPage() {
  return (
    <div className="pg">
      <header className="pg-cabeca">
        <div className="titulo-forma tem-forma">
          <Forma tipo="capsula" size={56} className="forma-entra" />
          <div>
            <h1 className="t-h1">Painel de ganho</h1>
            <p className="pg-sub">Tempo por peça, variações por briefing e peças barradas antes da revisão. O que é medido é medido de verdade; o que é estimativa fica marcado.</p>
          </div>
        </div>
      </header>
      <Suspense fallback={<div className="esqueleto" style={{ height: 360 }} />}>
        <Conteudo />
      </Suspense>
    </div>
  );
}

async function Conteudo() {
  await connection();
  const fonte = getDataSource();
  const campanhas = await fonte.getCampanhas();
  const impressoes = campanhas.reduce((s, c) => s + c.impressoes, 0);
  const cliques = campanhas.reduce((s, c) => s + c.cliques, 0);
  const conversoes = campanhas.reduce((s, c) => s + c.conversoes, 0);
  return (
    <PainelDeGanho
      sintetico={{
        campanhas: campanhas.length,
        ctr: impressoes ? cliques / impressoes : 0,
        conversao: cliques ? conversoes / cliques : 0,
        origem: fonte.origem,
        fonte: fonte.nome,
      }}
    />
  );
}
