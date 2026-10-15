import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { OriginTag } from "@/components/ds";
import { Publicadas } from "@/components/memoria/Publicadas";
import { Conta, Revela } from "@/components/motion/Revela";
import { getDataSource } from "@/lib/data";
import { rankear, rotular, type ItemRanking } from "@/lib/memoria/ranking";
import { CANAIS, ROTULOS, type Canal } from "@/types/briefing";
import "@/components/estudio/estudio.css";
import "@/components/memoria/memoria.css";

export const metadata: Metadata = { title: "Memória · Cápsula" };

export default function MemoriaPage({ searchParams }: { searchParams: Promise<{ canal?: string; publico?: string }> }) {
  return (
    <>
      <header style={{ display: "grid", gap: "var(--space-2)", maxWidth: 720 }}>
        <h1 className="t-h1">Memória</h1>
        <p>O que funcionou e o que falhou nas campanhas anteriores. É daqui que o motor tira as evidências de memória da Bula.</p>
      </header>
      <Suspense fallback={<p className="t-muted">Carregando a memória…</p>}>
        <Ranking searchParams={searchParams} />
      </Suspense>
      <Publicadas />
    </>
  );
}

async function Ranking({ searchParams }: { searchParams: Promise<{ canal?: string; publico?: string }> }) {
  await connection();
  const params = await searchParams;
  const canal = CANAIS.includes(params.canal as Canal) ? (params.canal as Canal) : undefined;
  const fonte = getDataSource();
  const publicos = await fonte.getPublicos();
  const publico = publicos.some((p) => p.nome === params.publico) ? params.publico : undefined;

  const todas = await fonte.getCampanhas();
  const filtradas = await fonte.getCampanhas({ canal, publico });
  const ranking = rankear(filtradas, { minimo: canal || publico ? 5 : 8, fonte: fonte.nome });
  const datas = todas.map((c) => c.data).sort();

  const link = (mudar: { canal?: string; publico?: string }) => {
    const q = new URLSearchParams();
    const c = "canal" in mudar ? mudar.canal : canal;
    const p = "publico" in mudar ? mudar.publico : publico;
    if (c) q.set("canal", c);
    if (p) q.set("publico", p);
    return `/memoria${q.size ? `?${q}` : ""}`;
  };

  return (
    <>
      <section className="memoria-resumo" aria-label="Resumo do histórico">
        <Numero valor={<Conta valor={todas.length} />} rotulo="campanhas no histórico" />
        <Numero valor={<Conta key={filtradas.length} valor={filtradas.length} />} rotulo="no filtro atual" />
        <Numero valor={`${dataCurta(datas[0])} a ${dataCurta(datas.at(-1)!)}`} rotulo="período" />
        <p className="memoria-origem">
          <OriginTag origin="memoria">{fonte.origem === "sintetico" ? "Dados de teste" : "Dados reais"}</OriginTag>
          <span className="t-body-sm t-muted">
            {fonte.origem === "sintetico" ? "Histórico sintético: os números não são da empresa." : `Fonte: ${fonte.nome}.`}
          </span>
        </p>
      </section>

      <nav className="galeria-filtros" aria-label="Filtros da memória">
        <div className="galeria-filtro">
          <span className="cp-label">Canal</span>
          <ul className="estudio-chips">
            <Chip href={link({ canal: undefined })} ativo={!canal}>
              Todos
            </Chip>
            {CANAIS.map((c) => (
              <Chip key={c} href={link({ canal: c })} ativo={canal === c}>
                {ROTULOS.canal[c]}
              </Chip>
            ))}
          </ul>
        </div>
        <div className="galeria-filtro">
          <span className="cp-label">Público</span>
          <ul className="estudio-chips">
            <Chip href={link({ publico: undefined })} ativo={!publico}>
              Todos
            </Chip>
            {publicos.map((p) => (
              <Chip key={p.id} href={link({ publico: p.nome })} ativo={publico === p.nome}>
                {p.nome}
              </Chip>
            ))}
          </ul>
        </div>
      </nav>

      <div className="memoria-colunas" key={`${canal}-${publico}`}>
        <Lista titulo="O que funcionou" vazio="Poucas campanhas neste filtro para recomendar algo." itens={ranking.melhores} />
        <Lista titulo="O que evitar" vazio="Nenhuma combinação abaixo da média neste filtro." itens={ranking.piores} />
      </div>
    </>
  );
}

function Lista({ titulo, itens, vazio }: { titulo: string; itens: ItemRanking[]; vazio: string }) {
  return (
    <section className="memoria-lista" aria-label={titulo}>
      <h2 className="t-h2">{titulo}</h2>
      {itens.length ? (
        <ol>
          {itens.map((item, n) => (
            <Revela as="li" key={item.id} i={n} className="memoria-item">
              <span className={item.lift >= 1 ? "memoria-lift is-alto" : "memoria-lift is-baixo"}>{item.lift.toLocaleString("pt-BR", { maximumFractionDigits: 1, minimumFractionDigits: 1 })}×</span>
              <div>
                <p className="t-h3">{capitalizar(rotular(item.combinacao))}</p>
                <span className={item.lift >= 1 ? "memoria-barra is-alto" : "memoria-barra is-baixo"} style={{ "--w": `${Math.min(100, (item.lift / 2) * 100)}%` } as React.CSSProperties} aria-hidden="true" />
                <p className="t-body-sm">{item.texto}</p>
                <p className="t-data t-muted">{item.fonte}</p>
              </div>
            </Revela>
          ))}
        </ol>
      ) : (
        <p className="t-body-sm t-muted">{vazio}</p>
      )}
    </section>
  );
}

function Numero({ valor, rotulo }: { valor: React.ReactNode; rotulo: string }) {
  return (
    <div className="memoria-numero">
      <span className="t-h2">{valor}</span>
      <span className="t-caption t-muted">{rotulo}</span>
    </div>
  );
}

function Chip({ href, ativo, children }: { href: string; ativo: boolean; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className={ativo ? "estudio-chip is-on" : "estudio-chip"} aria-current={ativo ? "true" : undefined} scroll={false}>
        {children}
      </Link>
    </li>
  );
}

function dataCurta(iso: string) {
  const [a, m] = iso.split("-");
  return `${m}/${a}`;
}

function capitalizar(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
