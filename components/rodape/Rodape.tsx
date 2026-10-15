import Link from "next/link";
import { FORMAS, Forma, type TipoForma } from "@/components/ds";
import { VoltarAoTopo } from "./VoltarAoTopo";
import "./rodape.css";

/* Rodapé: uma ilha que espelha o cabeçalho. A marca, as seis formas (cada uma com o seu significado) e o essencial. */

export function Rodape() {
  const versao = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local";

  return (
    <footer className="rodape">
      <div className="rodape-ilha">
        <Link href="/" className="rodape-marca" aria-label="Cápsula, início">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/capsula-mark.svg" alt="" width={30} height={30} />
          <span>cápsula</span>
        </Link>

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

        <div className="rodape-acoes">
          <Link href="/design-system" className="rodape-link">
            Design system
          </Link>
          <VoltarAoTopo />
        </div>
      </div>
      <p className="rodape-nota">
        Protótipo do hackathon · dados de teste · versão <b>{versao}</b>
      </p>
    </footer>
  );
}
