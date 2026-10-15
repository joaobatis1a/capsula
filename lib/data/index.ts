import "server-only";
import { MockDataSource } from "./mock";
import type { CampaignDataSource } from "./types";

/* Ponto único de acesso aos dados. A variável DATA_SOURCE escolhe a fonte (padrão: mock).
   Para ligar dados reais: implemente CampaignDataSource (csv ou api) e registre aqui. Nada mais muda. */

let fonte: CampaignDataSource | null = null;

export function getDataSource(): CampaignDataSource {
  if (fonte) return fonte;
  const tipo = process.env.DATA_SOURCE ?? "mock";
  switch (tipo) {
    case "mock":
      fonte = new MockDataSource();
      break;
    // case "csv": fonte = new CsvDataSource(...) (#13)
    // case "api": fonte = new ApiDataSource(...) (próxima fase)
    default:
      throw new Error(`DATA_SOURCE "${tipo}" não é suportada. Use "mock".`);
  }
  return fonte;
}

export type * from "./types";
