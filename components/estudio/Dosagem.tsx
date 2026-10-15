"use client";

import { useEffect, useState } from "react";
import { Forma, type TipoForma } from "@/components/ds";
import { CapsulaViva } from "./CapsulaViva";

/* O que a tela mostra enquanto o motor trabalha: as etapas reais da geração e a galeria em esqueleto.
   Cada etapa tem a forma de aquilo que ela usa: comprimido (memória), softgel (radar), cápsula (peça) e drágea (aprovada na Bula). */

const ETAPAS: { nome: string; forma: TipoForma }[] = [
  { nome: "Lendo a memória de campanhas", forma: "comprimido" },
  { nome: "Consultando o radar e a época do ano", forma: "softgel" },
  { nome: "Escrevendo as variações", forma: "capsula" },
  { nome: "Checando a Bula de cada peça", forma: "dragea" },
];

export function Dosagem({ pecas }: { pecas: number }) {
  const [etapa, setEtapa] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setEtapa((e) => Math.min(e + 1, ETAPAS.length - 1)), 1100);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="dosagem" aria-live="polite" aria-label="Gerando variações">
      <div className="dosagem-topo">
        <CapsulaViva estado="dosando" />
        <div>
          <p className="receita-olho">Dosando {pecas} peças</p>
          <ol className="dosagem-etapas">
            {ETAPAS.map((e, i) => (
              <li key={e.nome} className={i < etapa ? "is-feita" : i === etapa ? "is-atual" : ""}>
                <span className="dosagem-forma">
                  <Forma tipo={e.forma} size={26} className={i === etapa ? "forma-balanca" : undefined} />
                </span>
                {e.nome}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <ul className="dosagem-esqueletos" aria-hidden="true">
        {Array.from({ length: Math.min(pecas, 8) }, (_, i) => (
          <li key={i} className="esqueleto" style={{ animationDelay: `${i * 90}ms` }} />
        ))}
      </ul>
    </section>
  );
}
