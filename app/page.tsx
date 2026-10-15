import { connection } from "next/server";
import { Suspense } from "react";
import { Estudio } from "@/components/estudio/Estudio";
import { getDataSource } from "@/lib/data";

export default function EstudioPage() {
  return (
    <Suspense fallback={<p className="t-muted">Carregando o Estúdio…</p>}>
      <EstudioComDados />
    </Suspense>
  );
}

async function EstudioComDados() {
  await connection();
  const fonte = getDataSource();
  const [publicos, sazonalidade] = await Promise.all([fonte.getPublicos(), fonte.getSazonalidade(new Date().getMonth() + 1)]);
  return <Estudio publicos={publicos} sazonalidade={sazonalidade} />;
}
