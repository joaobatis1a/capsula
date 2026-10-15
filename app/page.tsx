import { connection } from "next/server";
import { Suspense } from "react";
import { Estudio } from "@/components/estudio/Estudio";
import { getDataSource } from "@/lib/data";
import { atencao } from "@/lib/saude/rotulos";

export default function EstudioPage({ searchParams }: { searchParams: Promise<{ saude?: string }> }) {
  return (
    <Suspense fallback={<p className="t-muted">Carregando o Estúdio…</p>}>
      <EstudioComDados searchParams={searchParams} />
    </Suspense>
  );
}

async function EstudioComDados({ searchParams }: { searchParams: Promise<{ saude?: string }> }) {
  await connection();
  const { saude } = await searchParams;
  const fonte = getDataSource();
  const mes = new Date().getMonth() + 1;
  const [publicos, base] = await Promise.all([fonte.getPublicos(), fonte.getSaudeDoAno()]);
  const agora = base
    .filter((s) => atencao(s, mes) >= 2)
    .sort((a, b) => b.intensidade[mes - 1] - a.intensidade[mes - 1] || b.intensidade[mes % 12] - a.intensidade[mes % 12])
    .slice(0, 4);
  const temaInicial = base.find((s) => s.id === saude);
  return <Estudio publicos={publicos} agora={agora} temaInicial={temaInicial} mes={mes} />;
}
