import type { CampaignDataSource, Campanha, FiltroCampanhas } from "../types";
import { gerarCampanhas } from "./campanhas";
import { PUBLICOS } from "./publicos";
import { RADAR } from "./radar";
import { SAZONALIDADE } from "./sazonalidade";

/* Fonte mock: tudo em memória, sem banco e sem rede. Padrão em desenvolvimento e nos testes. */

let cache: Campanha[] | null = null;

export class MockDataSource implements CampaignDataSource {
  readonly nome = "nos dados de teste";
  readonly origem = "sintetico" as const;

  async getCampanhas(filtro: FiltroCampanhas = {}) {
    cache ??= gerarCampanhas();
    return cache.filter(
      (c) =>
        (!filtro.canal || c.canal === filtro.canal) &&
        (!filtro.formato || c.formato === filtro.formato) &&
        (!filtro.publico || c.publico === filtro.publico) &&
        (!filtro.categoria || c.categoria === filtro.categoria) &&
        (!filtro.desde || c.data >= filtro.desde),
    );
  }

  async getRadar(data = hoje()) {
    return RADAR.filter((i) => i.vistoEm <= data && i.validade >= data);
  }

  async getSazonalidade(mes: number) {
    const janela = [mes, (mes % 12) + 1, ((mes + 1) % 12) + 1];
    return SAZONALIDADE.filter((s) => s.mesesPico.some((m) => janela.includes(m)));
  }

  async getPublicos() {
    return PUBLICOS;
  }
}

function hoje() {
  return new Date().toISOString().slice(0, 10);
}
