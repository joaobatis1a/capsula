import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import Link from "next/link";
import { FaixaAno } from "@/components/saude/FaixaAno";
import { Icon, OriginTag, TrendItem } from "@/components/ds";
import "@/components/saude/saude.css";
import { getDataSource } from "@/lib/data";
import type { ItemRadar } from "@/lib/data/types";
import "@/components/estudio/estudio.css";
import "@/components/memoria/memoria.css";

export const metadata: Metadata = { title: "Radar · Cápsula" };

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const TIPO: Record<ItemRadar["tipo"], string> = { hashtag: "Hashtag", formato: "Formato", musica: "Música", data_sazonal: "Data" };

export default function RadarPage() {
  return (
    <>
      <header style={{ display: "grid", gap: "var(--space-2)", maxWidth: 720 }}>
        <h1 className="t-h1">Radar</h1>
        <p>
          O que está em alta agora e o que vem pela frente na saúde. Todo item tem fonte, data e validade, e sai das sugestões quando vence. A
          coleta é manual, em fontes públicas, sem raspar os aplicativos.
        </p>
      </header>
      <Suspense fallback={<p className="t-muted">Carregando o radar…</p>}>
        <Itens />
      </Suspense>
    </>
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
      <Secao titulo="Sazonalidade de saúde" descricao="O que mais pede atenção neste mês e nos dois seguintes, com a categoria de produto ligada.">
        {emAlta.map((s, n) => (
          <li key={s.id} className="estudio-epoca-item" style={{ "--i": n } as React.CSSProperties}>
            <div className="estudio-epoca-top">
              <OriginTag origin="tendencia">Sazonalidade</OriginTag>
              <span className="t-data t-muted">pico {s.mesesPico.map((m) => MESES[m - 1]).join(", ")}</span>
            </div>
            <h3 className="t-h3">{s.condicao}</h3>
            <p className="t-body-sm">{s.angulo}</p>
            <FaixaAno intensidade={s.intensidade} mes={mes} nome={s.condicao} />
            <p className="t-body-sm">{s.categorias.join(" · ")}</p>
            <p className="t-data t-muted">
              {s.regiao} ·{" "}
              <a href={s.fonteUrl} target="_blank" rel="noreferrer">
                {s.fonte}
              </a>
            </p>
          </li>
        ))}
      </Secao>

      <p className="radar-ver-mais">
        <Link href="/saude" className="abertura-link">
          Ver as 33 condições e o calendário de campanhas no Ano da saúde
          <Icon name="arrow" size={16} />
        </Link>
      </p>

      <Secao titulo="Tendências" descricao="Formatos e hashtags em alta nas plataformas.">
        {tendencias.map((i, n) => (
          <li key={i.id} style={{ "--i": n } as React.CSSProperties}>
            <Item item={i} />
          </li>
        ))}
      </Secao>

      <Secao titulo="Músicas e áudios" descricao="Perfis de marca só podem usar áudio liberado para uso comercial. Os roteiros só sugerem os liberados.">
        {musicas.map((i, n) => (
          <li key={i.id} style={{ "--i": n } as React.CSSProperties}>
            <Item item={i} />
            <p className={i.usoComercial ? "radar-uso is-ok" : "radar-uso is-nao"}>
              <Icon name={i.usoComercial ? "check" : "x"} size={16} />
              {i.usoComercial ? "Liberada para uso comercial" : "Sem liberação para marcas"}
            </p>
          </li>
        ))}
      </Secao>

      <Secao titulo="Datas do calendário" descricao="Datas comerciais e campanhas de saúde próximas.">
        {datas.map((i, n) => (
          <li key={i.id} style={{ "--i": n } as React.CSSProperties}>
            <Item item={i} />
          </li>
        ))}
      </Secao>
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
    />
  );
}

function Secao({ titulo, descricao, children }: { titulo: string; descricao: string; children: React.ReactNode }) {
  return (
    <section className="radar-secao" aria-label={titulo}>
      <h2 className="t-h2">{titulo}</h2>
      <p className="t-body-sm t-muted">{descricao}</p>
      <ul className="radar-grade">{children}</ul>
    </section>
  );
}

function curta(iso: string) {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}
