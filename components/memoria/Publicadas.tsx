"use client";

import { useSyncExternalStore } from "react";
import { DoseBar, Forma, StatusPill } from "@/components/ds";
import { CHAVE_PUBLICADAS, type PecaPublicada } from "@/components/estudio/Aprovacao";
import { ROTULOS, type Canal, type Formato } from "@/types/briefing";

/* Peças aprovadas e publicadas voltam para a memória (#11).
   Até o Supabase entrar (#18), ficam guardadas neste navegador. */

function ler(): string {
  try {
    return localStorage.getItem(CHAVE_PUBLICADAS) ?? "[]";
  } catch {
    return "[]";
  }
}

function assinar(aviso: () => void) {
  window.addEventListener("storage", aviso);
  return () => window.removeEventListener("storage", aviso);
}

export function Publicadas() {
  const bruto = useSyncExternalStore(assinar, ler, () => "[]");
  let pecas: PecaPublicada[] = [];
  try {
    pecas = JSON.parse(bruto);
  } catch {}

  return (
    <section className="memoria-lista" aria-labelledby="titulo-publicadas">
      <h2 id="titulo-publicadas" className="t-h2">
        Publicadas pelo Estúdio
      </h2>
      <p className="t-body-sm t-muted">
        Peças aprovadas e publicadas entram aqui e passam a contar como histórico. Por enquanto ficam neste navegador.
      </p>
      {pecas.length ? (
        <ul className="memoria-publicadas">
          {pecas.map((p) => (
            <li key={p.id} className="memoria-publicada">
              <div className="memoria-publicada-topo">
                <StatusPill status="publicado" />
                <span className="t-data t-muted">{new Date(p.em).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <p className="t-h3">{p.titulo}</p>
              <p className="t-data t-muted">
                {p.publico} · {ROTULOS.canal[p.canal as Canal] ?? p.canal} · {ROTULOS.formato[p.formato as Formato] ?? p.formato} · {p.produto}
              </p>
              <DoseBar memoria={p.dose} compact />
              <p className="t-caption t-muted">Aprovada por {p.por}. Métricas chegam quando a campanha rodar.</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="vazio-forma">
          <Forma tipo="comprimido" size={72} />
          <p className="t-h3">Nenhuma dose registrada ainda</p>
          <p className="t-body-sm t-muted">Aprove e publique uma peça no Estúdio e ela entra aqui, como histórico.</p>
        </div>
      )}
    </section>
  );
}
