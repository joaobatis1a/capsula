import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { Forma, OriginTag } from "@/components/ds";
import { Publicadas } from "@/components/memoria/Publicadas";
import { Conta, Revela } from "@/components/motion/Revela";
import { getDataSource } from "@/lib/data";
import { rankear, rotular, type ItemRanking } from "@/lib/memoria/ranking";
import { CANAIS, ROTULOS, type Canal } from "@/types/briefing";
import "@/components/estudio/estudio.css";
import "@/components/memoria/memoria.css";

export const metadata: Metadata = { title: "Memória · Cápsula" };

type Busca = Promise<{ canal?: string; publico?: string }>;

export default function MemoriaPage({ searchParams }: { searchParams: Busca }) {
  return (
    <div className="pg pg-memoria">
      <header className="pg-cabeca">
        <div className="titulo-forma tem-forma">
          <Forma tipo="comprimido" size={56} className="forma-entra" />
          <div>
            <h1 className="t-h1">Memória</h1>
            <p className="pg-sub">O que funcionou e o que falhou nas campanhas anteriores. É daqui que o motor tira as evidências da Bula.</p>
          </div>
        </div>
      </header>
      <Suspense fallback={<div className="esqueleto" style={{ height: 320 }} />}>
        <Ranking searchParams={searchParams} />
      </Suspense>
      <Publicadas />
    </div>
  );
}

async function Ranking({ searchParams }: { searchParams: Busca }) {
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
      <Revela as="section" className="painel" aria-labelledby="m-geral">
        <header className="painel-topo">
          <div className="painel-titulo">
            <span className="painel-ponto" aria-hidden="true" />
            <h2 id="m-geral" className="t-h2">
              Visão geral
            </h2>
          </div>
          <OriginTag origin="memoria">{fonte.origem === "sintetico" ? "Dados de teste" : "Dados reais"}</OriginTag>
        </header>
        <ul className="memoria-numeros">
          <Numero valor={<Conta valor={todas.length} />} rotulo="campanhas no histórico" />
          <Numero valor={<Conta key={filtradas.length} valor={filtradas.length} />} rotulo="no filtro atual" />
          <Numero valor={`${dataCurta(datas[0])} a ${dataCurta(datas.at(-1)!)}`} rotulo="período coberto" />
        </ul>
        {fonte.origem === "sintetico" ? <p className="painel-nota">Histórico sintético: os números não são da empresa.</p> : null}
      </Revela>

      <Revela as="section" i={1} className="painel" aria-labelledby="m-filtros">
        <header className="painel-topo">
          <div className="painel-titulo">
            <span className="painel-ponto" aria-hidden="true" />
            <h2 id="m-filtros" className="t-h2">
              Filtrar
            </h2>
          </div>
          {canal || publico ? (
            <Link href="/memoria" className="memoria-limpar" scroll={false}>
              Limpar filtros
            </Link>
          ) : null}
        </header>
        <div className="memoria-filtros">
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
        </div>
      </Revela>

      <div className="memoria-colunas" key={`${canal}-${publico}`}>
        <Lista id="m-funcionou" i={2} titulo="O que funcionou" nota="acima da média" vazio="Poucas campanhas neste filtro para recomendar algo." itens={ranking.melhores} />
        <Lista id="m-evitar" i={3} titulo="O que evitar" nota="abaixo da média" vazio="Nenhuma combinação abaixo da média neste filtro." itens={ranking.piores} evitar />
      </div>
    </>
  );
}

function Lista({ id, i, titulo, nota, itens, vazio, evitar }: { id: string; i: number; titulo: string; nota: string; itens: ItemRanking[]; vazio: string; evitar?: boolean }) {
  return (
    <Revela as="section" i={i} className={evitar ? "painel painel-evitar" : "painel"} aria-labelledby={id}>
      <header className="painel-topo">
        <div className="painel-titulo">
          <span className="painel-ponto" aria-hidden="true" />
          <h2 id={id} className="t-h2">
            {titulo}
          </h2>
        </div>
        <span className="painel-nota">{itens.length ? `${itens.length} combinações, ${nota}` : nota}</span>
      </header>
      {itens.length ? (
        <ol className="memoria-lista">
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
    </Revela>
  );
}

function Numero({ valor, rotulo }: { valor: React.ReactNode; rotulo: string }) {
  return (
    <li className="memoria-numero">
      <span className="memoria-numero-valor">{valor}</span>
      <span className="t-caption t-muted">{rotulo}</span>
    </li>
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
