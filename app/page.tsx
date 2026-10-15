import { connection } from "next/server";
import { Suspense } from "react";
import { Estudio } from "@/components/estudio/Estudio";
import { getDataSource } from "@/lib/data";

export default function EstudioPage() {
  return (
    <>
      <header style={{ display: "grid", gap: "var(--space-2)", maxWidth: 720 }}>
        <h1 className="t-display">Criatividade na dose certa</h1>
        <p>
          Escreva um briefing e a Cápsula gera variações para cada público e canal, usando o que funcionou nas campanhas
          anteriores, o que está em alta e a época do ano. Cada peça sai com a sua Bula.
        </p>
      </header>
      <Suspense fallback={<p className="t-muted">Carregando o Estúdio…</p>}>
        <EstudioComDados />
      </Suspense>
    </>
  );
}

async function EstudioComDados() {
  await connection();
  const fonte = getDataSource();
  const [publicos, sazonalidade] = await Promise.all([fonte.getPublicos(), fonte.getSazonalidade(new Date().getMonth() + 1)]);
  return <Estudio publicos={publicos} sazonalidade={sazonalidade} />;
}
