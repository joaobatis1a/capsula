"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ds";

/* O que a tela mostra enquanto o motor trabalha: as etapas reais da geração e a galeria em esqueleto. */

const ETAPAS = ["Lendo a memória de campanhas", "Consultando o radar e a época do ano", "Escrevendo as variações", "Checando a Bula de cada peça"];

export function Dosagem({ pecas }: { pecas: number }) {
  const [etapa, setEtapa] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setEtapa((e) => Math.min(e + 1, ETAPAS.length - 1)), 1100);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="dosagem" aria-live="polite" aria-label="Gerando variações">
      <ol className="dosagem-etapas">
        {ETAPAS.map((nome, i) => (
          <li key={nome} className={i < etapa ? "is-feita" : i === etapa ? "is-atual" : ""}>
            <span className="dosagem-marca">{i < etapa ? <Icon name="check" size={14} /> : null}</span>
            {nome}
          </li>
        ))}
      </ol>
      <ul className="dosagem-esqueletos" aria-hidden="true">
        {Array.from({ length: Math.min(pecas, 8) }, (_, i) => (
          <li key={i} className="esqueleto" style={{ animationDelay: `${i * 90}ms` }} />
        ))}
      </ul>
    </section>
  );
}
