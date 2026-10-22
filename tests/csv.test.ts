import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CsvDataSource } from "@/lib/data/csv";
import { parseCsv } from "@/lib/data/csv/leitor";
import { carregarMapeamento } from "@/lib/data/csv/mapping";
import { rankear } from "@/lib/memoria/ranking";
import { parseData, parseNumero } from "@/lib/data/csv/registros";
import { suiteDoAdaptador } from "./helpers/suite-adaptador";

const CSV = "mocks/campanhas-exemplo.csv";
const MAPPING = "mocks/mapping.exemplo.yaml";
const mapping = readFileSync(MAPPING, "utf8");
const cabecalho = readFileSync(CSV, "utf8").split("\n")[0];

suiteDoAdaptador("csv", () => CsvDataSource.deArquivos(CSV, MAPPING));

describe("CsvDataSource", () => {
  it("lê as 300 campanhas do exemplo como dado real, já no contrato", async () => {
    const campanhas = await CsvDataSource.deArquivos(CSV, MAPPING).getCampanhas();
    expect(campanhas).toHaveLength(300);
    expect(campanhas.every((c) => c.origem === "real")).toBe(true);
    expect(campanhas[0]).toMatchObject({ id: "EX-0001", data: "2025-11-01", canal: "instagram", formato: "video", gancho: "prova_social", tom: "divertido", publico: "Adultos de 25 a 34", categoria: "Protetor solar", tipoProduto: "dermocosmetico", impressoes: 16208, cliques: 358, conversoes: 22 });
  });

  it("alimenta o ranking da Memória sem mudar nada nele", async () => {
    const r = rankear(await CsvDataSource.deArquivos(CSV, MAPPING).getCampanhas());
    expect(r.total).toBe(300);
    expect(r.melhores.length + r.piores.length).toBeGreaterThan(0);
  });

  it("ignora linha inválida com o motivo e a linha, sem derrubar a leitura", async () => {
    const csv = `${cabecalho}\nX1;Pergunta;Feed;Instagram;25 a 34 anos;Informativo;31/02/2025;1000;10;1;A;Higiene;1,0;x\nX2;Pergunta;Feed;Instagram;25 a 34 anos;Informativo;01/03/2025;1000;10;1;A;Higiene;1,0;x\nX3;Pergunta;Feed;Instagram;25 a 34 anos;Informativo;01/03/2025;10;50;1;A;Higiene;1,0;x\nX4;Meme;Feed;Instagram;25 a 34 anos;Informativo;01/03/2025;10;5;1;A;Higiene;1,0;x`;
    const fonte = CsvDataSource.deConteudo(csv, mapping);
    expect((await fonte.getCampanhas()).map((c) => c.id)).toEqual(["X2"]);
    expect(fonte.avisos).toHaveLength(3);
    expect(fonte.avisos[0]).toMatch(/^linha 2: data inválida/);
    expect(fonte.avisos[1]).toMatch(/^linha 4: cliques maiores/);
    expect(fonte.avisos[2]).toMatch(/^linha 5: gancho "meme"/);
  });

  it("explica a coluna que falta, em vez de falhar calado", async () => {
    const fonte = CsvDataSource.deConteudo("a;b\n1;2", mapping);
    await expect(fonte.getCampanhas()).rejects.toThrow(/coluna "dt_veiculacao"/);
  });

  it("recusa mapping com campo fora do contrato", () => {
    expect(() => carregarMapeamento('campanhas:\n  colunas:\n    cor: x')).toThrow(/não existe no contrato/);
  });
});

describe("leitor de CSV", () => {
  it("entende aspas, aspas escapadas, quebra de linha dentro do campo e BOM", () => {
    expect(parseCsv('\ufeffa;b\n"x;y";"diz ""oi""\nlinha 2"\n', ";")).toEqual([["a", "b"], ["x;y", 'diz "oi"\nlinha 2']]);
  });
  it("converte números e datas brasileiros", () => {
    expect(parseNumero("R$ 1.234,56", ",")).toBe(1234.56);
    expect(parseNumero("1,234.5", ".")).toBe(1234.5);
    expect(parseData("05/11/2025", "br")).toBe("2025-11-05");
    expect(parseData("31/02/2025", "br")).toBeNull();
    expect(parseData("2025-11-05T10:00", "iso")).toBe("2025-11-05");
  });
});
