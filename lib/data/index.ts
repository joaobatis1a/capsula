import "server-only";
import { CsvDataSource } from "./csv";
import { MockDataSource } from "./mock";
import type { CampaignDataSource } from "./types";

/* Ponto único de acesso aos dados. A variável DATA_SOURCE escolhe a fonte (padrão: mock).
   Dados reais: "csv" lê o arquivo da empresa pelo mapping.yaml (docs/dados-reais.md); "api" fica para a próxima fase. Nada mais muda. */

let fonte: CampaignDataSource | null = null;

export function getDataSource(): CampaignDataSource {
  if (fonte) return fonte;
  const tipo = process.env.DATA_SOURCE ?? "mock";
  switch (tipo) {
    case "mock":
      fonte = new MockDataSource();
      break;
    case "csv":
      fonte = CsvDataSource.deArquivos(process.env.CSV_CAMPANHAS ?? "mocks/campanhas-exemplo.csv", process.env.CSV_MAPPING ?? "mocks/mapping.exemplo.yaml");
      break;
    // case "api": fonte = new ApiDataSource(...) (próxima fase)
    default:
      throw new Error(`DATA_SOURCE "${tipo}" não é suportada. Use "mock" ou "csv".`);
  }
  return fonte;
}

export type * from "./types";
