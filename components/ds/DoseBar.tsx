import { cx } from "./Icon";

/** Proporção de memória (0 a 100); o resto é tendência. O número vem do motor, nunca é decorativo. */
export function DoseBar({ memoria, compact }: { memoria: number; compact?: boolean }) {
  const m = Math.max(0, Math.min(100, Math.round(memoria)));
  const t = 100 - m;

  return (
    <div className={cx("cp-dose", compact && "is-compact")}>
      <div className="cp-dose-track" role="img" aria-label={`${m}% memória, ${t}% tendência`}>
        {m > 0 ? <span className="cp-dose-m" style={{ flexGrow: m }} /> : null}
        {m > 0 && t > 0 ? <span className="cp-dose-seam" /> : null}
        {t > 0 ? <span className="cp-dose-t" style={{ flexGrow: t }} /> : null}
      </div>
      {compact ? null : (
        <div className="cp-dose-legend">
          <span className="cp-dose-lm">{m}% memória</span>
          <span className="cp-dose-lt">{t}% tendência</span>
        </div>
      )}
    </div>
  );
}
