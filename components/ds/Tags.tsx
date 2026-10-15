import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export type Origem = "memoria" | "tendencia" | "gerado";
export type Status = "rascunho" | "revisao" | "bloqueado" | "aprovado" | "publicado";

const ORIGEM: Record<Origem, { label: string; icon: IconName }> = {
  memoria: { label: "Memória", icon: "archive" },
  tendencia: { label: "Tendência", icon: "trend" },
  gerado: { label: "Gerado", icon: "spark" },
};

/** Etiqueta que diz de onde veio uma informação. */
export function OriginTag({ origin, children }: { origin: Origem; children?: ReactNode }) {
  const def = ORIGEM[origin];
  return (
    <span className={`cp-tag cp-tag-${origin}`}>
      <Icon name={def.icon} size={14} />
      <span>{children ?? def.label}</span>
    </span>
  );
}

const STATUS: Record<Status, { label: string; icon: IconName }> = {
  rascunho: { label: "Rascunho", icon: "draft" },
  revisao: { label: "Em revisão", icon: "clock" },
  bloqueado: { label: "Bloqueado", icon: "x" },
  aprovado: { label: "Aprovado", icon: "check" },
  publicado: { label: "Publicado", icon: "dot" },
};

/** Status de governança de uma peça: forma, ícone e palavra. */
export function StatusPill({ status, children }: { status: Status; children?: ReactNode }) {
  const def = STATUS[status];
  return (
    <span className={`cp-status cp-status-${status}`}>
      <Icon name={def.icon} size={14} />
      <span>{children ?? def.label}</span>
    </span>
  );
}
