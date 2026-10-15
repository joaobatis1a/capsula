import type { Metadata } from "next";
import { Bula, Button, DoseBar, Field, OriginTag, PieceCard, Roteiro, StatusPill, TrendItem } from "@/components/ds";

export const metadata: Metadata = { title: "Design system · Cápsula" };

/* Vitrine dos componentes para conferir tokens, temas e responsividade. Exemplos com dados de teste. */

const grid = { display: "grid", gap: "var(--space-4)", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", alignItems: "start" } as const;
const row = { display: "flex", flexWrap: "wrap", gap: "var(--space-3)", alignItems: "center" } as const;

export default function DesignSystemPage() {
  return (
    <>
      <header style={{ display: "grid", gap: "var(--space-2)" }}>
        <h1 className="t-h1">Design system</h1>
        <p className="t-muted">Os 9 componentes da Cápsula v1. Exemplos com dados de teste.</p>
      </header>

      <section style={{ display: "grid", gap: "var(--space-4)" }}>
        <h2 className="t-h2">Ações e etiquetas</h2>
        <div style={row}>
          <Button variant="capsula">Gerar variações</Button>
          <Button variant="primary" icon="check">
            Aprovar
          </Button>
          <Button variant="secondary">Ver bula</Button>
          <Button variant="ghost">Cancelar</Button>
        </div>
        <div style={row}>
          <OriginTag origin="memoria" />
          <OriginTag origin="tendencia" />
          <OriginTag origin="gerado" />
          <StatusPill status="rascunho" />
          <StatusPill status="revisao" />
          <StatusPill status="bloqueado" />
          <StatusPill status="aprovado" />
          <StatusPill status="publicado" />
        </div>
        <div style={{ maxWidth: 360 }}>
          <DoseBar memoria={62} />
        </div>
      </section>

      <section style={{ display: "grid", gap: "var(--space-4)", maxWidth: 480 }}>
        <h2 className="t-h2">Campos</h2>
        <Field label="Produto" placeholder="Protetor solar FPS 50" hint="Nome como aparece na peça." />
        <Field label="Validade da oferta" error="Informe até quando a oferta vale." />
      </section>

      <section style={{ display: "grid", gap: "var(--space-4)" }}>
        <h2 className="t-h2">Peças, Bula, Radar e Roteiro</h2>
        <div style={grid}>
          <PieceCard titulo="Protetor FPS 50 com 30% off" texto="Seu verão com proteção na dose certa." formato="feed" memoria={70} status="revisao" />
          <PieceCard titulo="Protetor FPS 50 com 30% off" formato="story" canal="Instagram Stories" memoria={45} status="rascunho" />
          <PieceCard titulo="Protetor FPS 50 com 30% off" formato="banner" canal="Site" memoria={55} status="bloqueado" />
        </div>
        <div style={grid}>
          <Bula
            titulo="Protetor FPS 50 com 30% off"
            memoria={62}
            indicacao="Público 25 a 34 anos, Instagram Reels, objetivo de conversão."
            composicao={[
              { k: "Gancho", v: "Pergunta direta" },
              { k: "Tom", v: "Próximo e leve" },
            ]}
            evidencias={[
              { origin: "memoria", text: "Gancho com pergunta teve CTR 1,8× a média", fonte: "12 campanhas · nos dados de teste" },
              { origin: "tendencia", text: "Formato antes e depois em alta", fonte: "TikTok · Creative Center · 12/10" },
            ]}
            contraindicacoes={[
              { ok: true, text: "Sem promessa de cura ou resultado garantido" },
              { ok: false, text: "Oferta sem validade informada" },
            ]}
            posologia="Publicar de terça a quinta, 19h. Validade da oferta: 31/10."
          />
          <TrendItem plataforma="TikTok" tipo="Formato" termo="Antes e depois" ideia="Mostrar a rotina de cuidado em dois cortes." fonte="Creative Center" data="12/10" validade="26/10" />
          <Roteiro
            titulo="Reels: proteção no verão"
            formato="Reels"
            duracao="15s"
            cenas={[
              { tempo: "0–3s", visual: "Close no rosto ao sol", fala: "Você reaplica o protetor?" },
              { tempo: "3–10s", visual: "Produto na mão", tela: "FPS 50 com 30% off" },
              { tempo: "10–15s", visual: "Logo e oferta", tela: "Válido até 31/10" },
            ]}
          />
        </div>
      </section>
    </>
  );
}
