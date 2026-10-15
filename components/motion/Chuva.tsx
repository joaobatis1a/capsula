import { Forma, type TipoForma } from "@/components/ds";

/* Doses que caem sobre a peça quando ela é aprovada ou publicada. Posições fixas por índice: sem sorteio, sem diferença entre servidor e cliente. */

const MIX: TipoForma[] = ["dragea", "capsula", "comprimido", "softgel", "dragea", "caplet", "efervescente", "capsula", "dragea", "comprimido", "softgel", "dragea"];

export function Chuva({ quantidade = 12 }: { quantidade?: number }) {
  return (
    <span className="chuva" aria-hidden="true">
      {MIX.slice(0, quantidade).map((tipo, i) => {
        const x = (i * 37 + 8) % 92;
        return (
          <Forma
            key={i}
            tipo={tipo}
            size={30 + ((i * 7) % 3) * 8}
            className="chuva-forma"
            style={{ "--x": `${x}%`, "--d": `${(i % 6) * 90}ms`, "--t": `${1100 + ((i * 130) % 500)}ms`, "--h": `${112 + ((i * 7) % 18)}cqh`, "--r": `${(i % 2 ? 1 : -1) * (180 + i * 24)}deg` } as React.CSSProperties}
          />
        );
      })}
    </span>
  );
}
