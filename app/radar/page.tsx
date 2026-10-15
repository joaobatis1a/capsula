import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { Forma, Icon, OriginTag, TrendItem } from "@/components/ds";
import { Revela } from "@/components/motion/Revela";
import { FaixaAno } from "@/components/saude/FaixaAno";
import { getDataSource } from "@/lib/data";
import type { ItemRadar } from "@/lib/data/types";
import "@/components/estudio/estudio.css";
import "@/components/memoria/memoria.css";
import "@/components/saude/saude.css";

export const metadata: Metadata = { title: "Radar · Cápsula" };

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const TIPO: Record<ItemRadar["tipo"], string> = { hashtag: "Hashtag", formato: "Formato", musica: "Música", data_sazonal: "Data" };

export default function RadarPage() {
  return (
    <div className="pg pg-radar">
      <header className="pg-cabeca">
        <div className="titulo-forma tem-forma">
          <Forma tipo="softgel" size={56} className="forma-entra" />
          <div>
            <h1 className="t-h1">Radar</h1>
            <p className="pg-sub">O que está em alta agora e o que vem pela frente. Todo item tem fonte, data e validade, e sai das sugestões quando vence.</p>
          </div>
        </div>
      </header>
      <Suspense fallback={<div className="esqueleto" style={{ height: 320 }} />}>
        <Itens />
      </Suspense>
    </div>
  );
}

async function Itens() {
  await connection();
  const fonte = getDataSource();
  const hoje = new Date();
  const mes = hoje.getMonth() + 1;
  const [radar, sazonalidade] = await Promise.all([fonte.getRadar(hoje.toISOString().slice(0, 10)), fonte.getSazonalidade(mes)]);
  const emAlta = sazonalidade.sort((a, b) => b.intensidade[mes - 1] - a.intensidade[mes - 1]).slice(0, 6);
  const tendencias = radar.filter((i) => i.tipo === "formato" || i.tipo === "hashtag");
  const musicas = radar.filter((i) => i.tipo === "musica");
  const datas = radar.filter((i) => i.tipo === "data_sazonal");

  return (
    <>
      <Painel
        i={0}
        id="r-saz"
        titulo="Sazonalidade de saúde"
        nota={`${emAlta.length} em alta agora`}
        extra={
          <Link href="/saude" className="memoria-limpar">
            Ver as 33 condições
          </Link>
        }
      >
        {emAlta.map((s, n) => (
          <li key={s.id} style={{ "--i": n } as React.CSSProperties}>
            <article className="cp-trend radar-card">
              <div className="cp-trend-top">
                <OriginTag origin="tendencia">Sazonalidade</OriginTag>
                <span className="cp-trend-tipo">pico {s.mesesPico.map((m) => MESES[m - 1]).slice(0, 3).join(", ")}</span>
              </div>
              <h3 className="cp-trend-term">{s.condicao}</h3>
              <p className="cp-trend-idea">{s.angulo}</p>
              <FaixaAno intensidade={s.intensidade} mes={mes} nome={s.condicao} />
              <dl className="cp-trend-meta radar-meta-2">
                <div>
                  <dt>Categorias</dt>
                  <dd>{s.categorias.slice(0, 2).join(" · ")}</dd>
                </div>
                <div>
                  <dt>Fonte</dt>
                  <dd>{s.fonte}</dd>
                </div>
              </dl>
            </article>
          </li>
        ))}
      </Painel>

      <Painel i={1} id="r-tend" titulo="Tendências" nota={`${tendencias.length} itens`}>
        {tendencias.map((i, n) => (
          <li key={i.id} style={{ "--i": n } as React.CSSProperties}>
            <Item item={i} />
          </li>
        ))}
      </Painel>

      <Painel i={2} id="r-mus" titulo="Músicas e áudios" nota="só as liberadas são sugeridas nos roteiros">
        {musicas.map((i, n) => (
          <li key={i.id} style={{ "--i": n } as React.CSSProperties}>
            <Item item={i} />
          </li>
        ))}
      </Painel>

      <Painel i={3} id="r-datas" titulo="Datas do calendário" nota={`${datas.length} datas`}>
        {datas.map((i, n) => (
          <li key={i.id} style={{ "--i": n } as React.CSSProperties}>
            <Item item={i} />
          </li>
        ))}
      </Painel>
    </>
  );
}

function Item({ item: i }: { item: ItemRadar }) {
  return (
    <TrendItem
      plataforma={i.plataforma}
      tipo={TIPO[i.tipo] + (i.origem === "sintetico" ? " · exemplo" : "")}
      termo={i.termo}
      ideia={i.artista ? `${i.artista}. ${i.ideia}` : i.ideia}
      fonte={i.fonte}
      data={curta(i.vistoEm)}
      validade={curta(i.validade)}
      rodape={
        i.tipo === "musica" ? (
          <p className={i.usoComercial ? "radar-uso is-ok" : "radar-uso is-nao"}>
            <Icon name={i.usoComercial ? "check" : "x"} size={16} />
            {i.usoComercial ? "Liberada para uso comercial" : "Sem liberação para marcas"}
          </p>
        ) : null
      }
    />
  );
}

function Painel({ i, id, titulo, nota, extra, children }: { i: number; id: string; titulo: string; nota: string; extra?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Revela as="section" i={i} className="painel" aria-labelledby={id}>
      <header className="painel-topo">
        <div className="painel-titulo">
          <span className="painel-ponto" aria-hidden="true" />
          <h2 id={id} className="t-h2">
            {titulo}
          </h2>
        </div>
        <div className="painel-lado">
          <span className="painel-nota">{nota}</span>
          {extra}
        </div>
      </header>
      <ul className="radar-grade">{children}</ul>
    </Revela>
  );
}

function curta(iso: string) {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}
