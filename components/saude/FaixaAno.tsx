import { MESES_LETRA, MESES_NOME, NIVEL } from "@/lib/saude/rotulos";

/* Os 12 meses de uma condição em uma faixa. A intensidade vai de 0 a 3 e o mês atual leva contorno. */
export function FaixaAno({ intensidade, mes, rotulos = false, nome }: { intensidade: number[]; mes?: number; rotulos?: boolean; nome: string }) {
  return (
    <span className="faixa-ano" role="img" aria-label={`${nome}: ${intensidade.map((v, i) => `${MESES_NOME[i]} ${NIVEL[v].toLowerCase()}`).join(", ")}`}>
      {intensidade.map((v, i) => (
        <span key={i} className={`faixa-celula n${v}${mes === i + 1 ? " is-hoje" : ""}`} style={{ "--c": i } as React.CSSProperties}>
          {rotulos ? MESES_LETRA[i] : null}
        </span>
      ))}
    </span>
  );
}
