import localFont from "next/font/local";

/* Fontes do design system, servidas pelo próprio app. */

export const unbounded = localFont({
  src: [
    { path: "./fonts/Unbounded-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Unbounded-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-unbounded",
  display: "swap",
});

export const instrumentSans = localFont({
  src: [
    { path: "./fonts/InstrumentSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/InstrumentSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/InstrumentSans-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-instrument",
  display: "swap",
});

export const plexMono = localFont({
  src: [
    { path: "./fonts/IBMPlexMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/IBMPlexMono-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
});
