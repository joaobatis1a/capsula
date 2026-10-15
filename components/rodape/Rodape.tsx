import Link from "next/link";
import { FORMAS, Forma, type TipoForma } from "@/components/ds";
import { Revela } from "@/components/motion/Revela";
import { VoltarAoTopo } from "./VoltarAoTopo";
import "./rodape.css";

/* Rodapé em forma de bula: o que o produto indica, o que ele barra e o que o time precisa saber.
   Sem título grande: tudo em tipografia de bula, e os dados são reais (a versão publicada, por exemplo). */

const PRODUTO = [
  { href: "/", label: "Estúdio" },
  { href: "/memoria", label: "Memória" },
  { href: "/radar", label: "Radar" },
  { href: "/saude", label: "Ano da saúde" },
  { href: "/ganho", label: "Painel de ganho" },
];

const TIME = [
  { href: "/design-system", label: "Design system" },
  { href: "/design-system#formas", label: "Formas farmacêuticas" },
];
const DADOS = [
  { href: "/api/memoria/ranking", label: "Ranking da memória" },
  { href: "/api/radar", label: "Radar e sazonalidade" },
];

export function Rodape() {
  const versao = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local";

  return (
    <footer className="rodape">
      <div className="rodape-grade">
        <Revela i={0} className="rodape-marca">
          <Link href="/" className="rodape-logo" aria-label="Cápsula, início">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/capsula-mark.svg" alt="" width={36} height={36} />
            <span>cápsula</span>
          </Link>
          <p>Estúdio criativo com memória para o marketing de farmácia.</p>
          <ul className="rodape-formas" aria-label="Formas farmacêuticas da Cápsula">
            {(Object.keys(FORMAS) as TipoForma[]).map((t) => (
              <li key={t}>
                <Link
                  href="/design-system#formas"
                  className="rodape-forma tem-forma"
                  data-nome={`${FORMAS[t].nome}: ${FORMAS[t].significa.toLowerCase()}`}
                  aria-label={`${FORMAS[t].nome}: ${FORMAS[t].significa}`}
                >
                  <Forma tipo={t} size={28} />
                </Link>
              </li>
            ))}
          </ul>
        </Revela>

        <Revela i={1} as="nav" className="rodape-col" aria-label="Produto">
          <h2 className="rodape-rotulo">Produto</h2>
          <ul>
            {PRODUTO.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </Revela>

        <Revela i={2} as="nav" className="rodape-col" aria-label="Para o time">
          <h2 className="rodape-rotulo">Para o time</h2>
          <ul>
            {TIME.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
            {DADOS.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noreferrer">
                  {l.label} <span className="rodape-json">JSON</span>
                </a>
              </li>
            ))}
          </ul>
        </Revela>

        <Revela i={3} className="rodape-bula">
          <dl>
            <div>
              <dt>Indicação</dt>
              <dd>Equipes de marketing que precisam de mais peças sem perder a marca nem as regras do setor.</dd>
            </div>
            <div>
              <dt>Contraindicações</dt>
              <dd>Promessa de cura, diagnóstico e oferta sem validade. O checklist barra antes da revisão.</dd>
            </div>
            <div>
              <dt>Advertências</dt>
              <dd>O histórico de campanhas e a marca Farmácia Exemplo são sintéticos. Conteúdo de saúde é informativo e não substitui um profissional.</dd>
            </div>
          </dl>
        </Revela>
      </div>

      <div className="rodape-base">
        <p>
          Cápsula · protótipo do hackathon · versão <b>{versao}</b>
        </p>
        <VoltarAoTopo />
      </div>
    </footer>
  );
}
