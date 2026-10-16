import Link from "next/link";
import { FORMAS, Forma, type TipoForma } from "@/components/ds";
import { provedorAtivo } from "@/lib/llm/client";
import { VoltarAoTopo } from "./VoltarAoTopo";
import "./rodape.css";

/* Rodapé clássico: marca e slogan à esquerda, páginas no meio, formas e o essencial à direita, e uma linha de base. */

const PAGINAS = [
  { href: "/", label: "Estúdio" },
  { href: "/memoria", label: "Memória" },
  { href: "/radar", label: "Radar" },
  { href: "/saude", label: "Ano da saúde" },
  { href: "/ganho", label: "Ganho" },
];

export function Rodape() {
  const versao = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local";
  const modelo = provedorAtivo();

  return (
    <footer className="rodape">
      <div className="rodape-miolo">
        <div className="rodape-col rodape-sobre">
          <Link href="/" className="rodape-marca" aria-label="Cápsula, início">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/capsula-mark.svg" alt="" width={30} height={30} />
            <span>cápsula</span>
          </Link>
          <p className="rodape-slogan">Criatividade na dose certa.</p>
        </div>

        <nav className="rodape-col" aria-label="Páginas">
          <h2 className="rodape-titulo">Páginas</h2>
          <ul className="rodape-lista">
            {PAGINAS.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="rodape-link">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="rodape-col">
          <h2 className="rodape-titulo">Linguagem visual</h2>
          <ul className="rodape-formas" aria-label="Formas farmacêuticas da Cápsula">
            {(Object.keys(FORMAS) as TipoForma[]).map((t) => (
              <li key={t}>
                <Link
                  href="/design-system#formas"
                  className="rodape-forma tem-forma"
                  data-nome={`${FORMAS[t].nome}: ${FORMAS[t].significa.toLowerCase()}`}
                  aria-label={`${FORMAS[t].nome}: ${FORMAS[t].significa}`}
                >
                  <Forma tipo={t} size={26} />
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/design-system" className="rodape-link">
            Design system
          </Link>
        </div>
      </div>

      <div className="rodape-base">
        <p className="rodape-nota">
          Protótipo do hackathon · dados de teste · {modelo ? `IA: ${modelo}` : "sem IA"} · versão <b>{versao}</b>
        </p>
        <VoltarAoTopo />
      </div>
    </footer>
  );
}
