import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { Forma } from "@/components/ds";
import { PainelDeGanho } from "@/components/ganho/PainelDeGanho";
import { getDataSource } from "@/lib/data";

export const metadata: Metadata = { title: "Painel de ganho · Cápsula" };

export default function GanhoPage() {
  return (
    <>
      <header style={{ display: "grid", gap: "var(--space-2)", maxWidth: 760 }}>
        <p className="receita-olho">Capacidade da área</p>
        <div className="titulo-forma tem-forma">
          <Forma tipo="capsula" size={56} className="forma-entra" />
          <h1 className="t-h1">Painel de ganho</h1>
        </div>
        <p>
          Quanto tempo uma peça leva, quantas variações saem de um briefing e quantas o checklist barra antes da revisão. O que é medido aqui é medido de verdade, no
          seu uso. O que é estimativa fica marcado e pode ser ajustado.
        </p>
      </header>
      <Suspense fallback={<div className="esqueleto" style={{ height: 360 }} />}>
        <Conteudo />
      </Suspense>
    </>
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
