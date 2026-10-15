/* Ícones de traço do design system: grade de 24px, traço 1,75, cor herdada do texto. */

export type IconName =
  | "check"
  | "x"
  | "clock"
  | "archive"
  | "trend"
  | "spark"
  | "arrow"
  | "shield"
  | "dot"
  | "draft";

const PATHS: Record<Exclude<IconName, "dot" | "draft">, string[]> = {
  check: ["M5 12.5l4.5 4.5L19 7.5"],
  x: ["M6.5 6.5l11 11", "M17.5 6.5l-11 11"],
  clock: ["M12 4a8 8 0 1 1 0 16a8 8 0 1 1 0-16z", "M12 8v4.5l3 2"],
  archive: [
    "M4.5 5h15a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-15a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5z",
    "M5.5 9v9a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9",
    "M10 13h4",
  ],
  trend: ["M4 16.5l5-5 3.5 3.5L20 7.5", "M15 7.5h5v5"],
  spark: ["M12 4l1.9 5.1L19 11l-5.1 1.9L12 18l-1.9-5.1L5 11l5.1-1.9z"],
  arrow: ["M5 12h14", "M13 6l6 6-6 6"],
  shield: ["M12 3.5l7 2.5v5.5c0 4.2-3 7.4-7 9-4-1.6-7-4.8-7-9V6z"],
};

export function Icon({ name, size = 16, className }: { name: IconName; size?: number; className?: string }) {
  let kids;
  if (name === "dot") kids = <circle cx={12} cy={12} r={4.5} fill="currentColor" stroke="none" />;
  else if (name === "draft") kids = <circle cx={12} cy={12} r={7} strokeDasharray="3 3" />;
  else kids = PATHS[name].map((d) => <path key={d} d={d} />);

  return (
    <svg
      className={cx("cp-icon", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {kids}
    </svg>
  );
}

export function cx(...names: (string | false | null | undefined)[]) {
  return names.filter(Boolean).join(" ");
}
