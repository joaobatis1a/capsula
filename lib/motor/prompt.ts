import { MARCA } from "@/lib/marca";
import { rotular } from "@/lib/memoria/ranking";
import { ROTULOS, type Briefing, type Canal, type Formato } from "@/types/briefing";
import { dataCurta, mesesPorExtenso, type Contexto } from "./contexto";

/* Prompt do motor em quatro partes: regras, briefing, memória e tendências.
   O modelo só pode citar evidências pelos ids fornecidos; a fonte é escrita pelo sistema depois. */

export const SISTEMA = `Você é redator sênior de uma rede de farmácias brasileira. Escreve peças curtas para redes sociais e site, em português do Brasil, falando com "você".

Regras que nunca podem ser quebradas:
- Nunca prometa cura, resultado garantido ou prazo de efeito. Nunca use "cura", "milagre", "garantido", "100% eficaz" ou "sem efeitos colaterais".
- Nunca faça diagnóstico ("você está com gripe?") nem indique remédio para doença. Fale de prevenção, cuidado e do produto.
- Nunca use superlativo absoluto ("o melhor", "nº 1") nem invente números, estatísticas ou depoimentos.
- Toda peça que fala de preço ou desconto informa a validade da oferta no texto (ex.: "até 15/11").
- Sem emoji. Frases curtas. Botões começam com verbo.
- Use só os ids de evidência fornecidos. Cada peça cita de 1 a 3 evidências.

Responda somente com um objeto JSON válido, sem texto antes ou depois.`;

export interface Pedido {
  publico: string;
  pecas: { canal: Canal; formato: Formato }[];
  roteiro?: { plataforma: "reels" | "tiktok"; duracaoSeg: 15 | 30 };
}

export function montarPrompt(briefing: Briefing, ctx: Contexto, pedido: Pedido): string {
  const o = briefing.oferta;
  const preco = o.precoDe && o.precoPor ? ` De R$ ${o.precoDe.toFixed(2).replace(".", ",")} por R$ ${o.precoPor.toFixed(2).replace(".", ",")}.` : "";

  const linhas = [
    "## Manual de marca",
    `Tom de voz: ${MARCA.tomDeVoz.descricao}`,
    `Faça: ${MARCA.tomDeVoz.faca.join(" ")}`,
    `Nunca use: ${MARCA.tomDeVoz.evite.map((t) => `"${t}"`).join(", ")}.`,
    "",
    "## Briefing",
    `Produto: ${briefing.produto} (${briefing.categoria}, ${ROTULOS.tipoProduto[briefing.tipoProduto]})`,
    `Oferta: ${o.descricao}.${preco} Válida até ${dataCurta(o.validade)}.${o.condicao ? ` Condição: ${o.condicao}` : ""}`,
    `Objetivo: ${ROTULOS.objetivo[briefing.objetivo]}`,
    `Público desta rodada: ${pedido.publico}`,
    briefing.observacoes ? `Observações: ${briefing.observacoes}` : "",
    "",
    "## O que funcionou (Memória, use como evidência)",
    ...ctx.melhores.map((i) => `- [${i.id}] ${rotular(i.combinacao)}: ${i.texto}`),
    "",
    "## O que evitar (Memória)",
    ...ctx.piores.map((i) => `- [${i.id}] ${rotular(i.combinacao)}: ${i.texto}`),
    "",
    "## Em alta agora (Radar)",
    ...ctx.radar.slice(0, 6).map((i) => `- [${i.id}] ${i.plataforma} · ${i.tipo}: ${i.termo}. ${i.ideia}`),
    "",
    "## Época do ano (sazonalidade de saúde)",
    ...ctx.sazonalidade.slice(0, 4).map((s) => `- [${s.id}] ${s.condicao} (pico em ${mesesPorExtenso(s.mesesPico)}). Ângulo: ${s.angulo} Cuidado: ${s.cuidado}`),
    "",
    "## Peças pedidas",
    ...pedido.pecas.map((p, i) => `${i + 1}. ${ROTULOS.canal[p.canal]} · ${ROTULOS.formato[p.formato]}`),
    "Cada peça deve explorar um gancho diferente. Adapte tom, gancho e benefício ao público.",
    "Limites: título até 60 caracteres (banner até 40), texto até 220, CTA até 24, selo até 18.",
  ];

  if (pedido.roteiro) {
    linhas.push(
      "",
      `## Roteiro pedido: ${pedido.roteiro.plataforma === "reels" ? "Reels" : "TikTok"} de ${pedido.roteiro.duracaoSeg}s`,
      "A primeira cena é o gancho e vai de 0 a 3s. As cenas cobrem o vídeo inteiro sem buracos e a última termina exatamente na duração.",
    );
  }

  linhas.push(
    "",
    "## Formato da resposta",
    `{"variacoes":[{"canal":"instagram","formato":"feed","titulo":"","texto":"","cta":"","selo":"","hashtags":[],"indicacao":"para quem e por quê, em uma frase","composicao":[{"k":"Gancho","v":""},{"k":"Tom","v":""},{"k":"Benefício","v":""}],"evidencias":[{"refId":"id da lista","texto":"como a evidência foi usada","peso":0.6}],"posologia":"quando e como publicar"}]${
      pedido.roteiro ? `,"roteiros":[{"titulo":"","cenas":[{"inicio":0,"fim":3,"visual":"","fala":"","tela":""}],"evidencias":[{"refId":"","texto":"","peso":1}]}]` : ""
    }}`,
    `Devolva exatamente ${pedido.pecas.length} variações, na ordem pedida.`,
  );

  return linhas.filter((l) => l !== undefined).join("\n");
}
