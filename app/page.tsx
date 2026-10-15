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
  const mes = new Date().getMonth() + 1;
  const [publicos, sazonalidade, ...porMes] = await Promise.all([
    fonte.getPublicos(),
    fonte.getSazonalidade(mes),
    ...Array.from({ length: 12 }, (_, i) => fonte.getSazonalidade(i + 1)),
  ]);
  const doAno = [...new Map(porMes.flat().map((s) => [s.id, s])).values()];
  return <Estudio publicos={publicos} sazonalidade={sazonalidade} sazonalidadeAno={doAno} />;
}
