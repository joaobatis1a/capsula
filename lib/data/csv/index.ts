import { readFileSync } from "node:fs";
import { MockDataSource } from "../mock";
import type { Campanha, CampaignDataSource, FiltroCampanhas } from "../types";
import { csvParaRegistros } from "./leitor";
import { carregarMapeamento } from "./mapping";
import { registroParaCampanha, validarCabecalho } from "./registros";

/* Fonte CSV (#13): o histórico de campanhas vem do arquivo da empresa, lido pelo mapping.yaml.
   O CSV só cobre campanhas. Radar, Ano da saúde e públicos não vêm da empresa e seguem na base de teste. */

export class CsvDataSource implements CampaignDataSource {
  readonly nome = "nos dados da empresa (CSV)";
  readonly origem = "real" as const;
  /** Linhas ignoradas na última leitura, com o motivo. */
  avisos: string[] = [];
  private readonly resto = new MockDataSource();
  private cache: Campanha[] | null = null;

  private constructor(private readonly carregar: () => { csv: string; mapping: string }) {}

  static deArquivos(caminhoCsv: string, caminhoMapping: string): CsvDataSource {
    const ler = (c: string, rotulo: string) => {
      try {
        return readFileSync(c, "utf8");
      } catch {
        throw new Error(`Não consegui ler o arquivo de ${rotulo}: ${c}. Confira CSV_CAMPANHAS e CSV_MAPPING no .env.local.`);
      }
    };
    return new CsvDataSource(() => ({ csv: ler(caminhoCsv, "campanhas"), mapping: ler(caminhoMapping, "mapeamento (mapping.yaml)") }));
  }

  static deConteudo(csv: string, mapping: string): CsvDataSource {
    return new CsvDataSource(() => ({ csv, mapping }));
  }

  async getCampanhas(filtro: FiltroCampanhas = {}) {
    this.cache ??= this.ler();
    return this.cache.filter(
      (c) =>
        (!filtro.canal || c.canal === filtro.canal) &&
        (!filtro.formato || c.formato === filtro.formato) &&
        (!filtro.publico || c.publico === filtro.publico) &&
        (!filtro.categoria || c.categoria === filtro.categoria) &&
        (!filtro.desde || c.data >= filtro.desde),
    );
  }

  private ler(): Campanha[] {
    const { csv, mapping } = this.carregar();
    const mapa = carregarMapeamento(mapping);
    const { cabecalho, registros } = csvParaRegistros(csv, mapa.opcoes.separador);
    const problemas = validarCabecalho(cabecalho, mapa);
    if (problemas.length) throw new Error(`CSV incompatível com o mapping.yaml:\n- ${problemas.join("\n- ")}`);

    const validas: Campanha[] = [];
    const avisos: string[] = [];
    registros.forEach((reg, i) => {
      const r = registroParaCampanha(reg, mapa, i + 2); // +2: o cabeçalho é a linha 1
      if (r.ok) validas.push(r.valor);
      else avisos.push(r.erro);
    });
    if (registros.length > 0 && validas.length === 0) throw new Error(`Nenhuma linha válida no CSV. Primeiros problemas:\n- ${avisos.slice(0, 5).join("\n- ")}`);
    this.avisos = avisos;
    if (avisos.length) console.warn(`[CsvDataSource] ${avisos.length} linha(s) ignorada(s).`);
    return validas;
  }

  getRadar(data?: string) {
    return this.resto.getRadar(data);
  }
  getSazonalidade(mes: number) {
    return this.resto.getSazonalidade(mes);
  }
  getSaudeDoAno() {
    return this.resto.getSaudeDoAno();
  }
  getDatasSaude() {
    return this.resto.getDatasSaude();
  }
  getPublicos() {
    return this.resto.getPublicos();
  }
}
