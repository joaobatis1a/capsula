import { OriginTag } from "@/components/ds";

export default function EstudioPage() {
  return (
    <section style={{ display: "grid", gap: "var(--space-4)", maxWidth: 720 }}>
      <h1 className="t-display">Criatividade na dose certa</h1>
      <p>
        Escreva um briefing e a Cápsula gera variações para cada público e canal, usando o que funcionou nas campanhas
        anteriores e o que está em alta agora. Cada peça sai com a sua Bula.
      </p>
      <p style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
        <OriginTag origin="memoria" />
        <OriginTag origin="tendencia" />
        <OriginTag origin="gerado" />
      </p>
      <p className="t-body-sm t-muted">O formulário de briefing chega na task #25.</p>
    </section>
  );
}
