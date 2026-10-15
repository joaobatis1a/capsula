"use client";

import { Icon } from "@/components/ds";

export function VoltarAoTopo() {
  return (
    <button type="button" className="rodape-topo" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}>
      Voltar ao topo
      <span className="rodape-topo-seta">
        <Icon name="arrow" size={16} />
      </span>
    </button>
  );
}
