# QA do motor com 10 briefings (I2, #80)

**Executado em:** 22/10/2026, em produção (https://capsula-mvp.vercel.app, rota `POST /api/gerar`), com intervalo de 25 s entre os casos por causa da cota gratuita do Gemini. **Quem:** João Batista, com apoio de IA, porque a entrega do I2 não chegou até o prazo; o Ivaldo pode complementar e preencher o próprio registro de entregas no guia.

Cada caso gerou 3 variações por canal e público e os roteiros (Reels/TikTok 15 s, comercial 15 s e 30 s). "Bloqueadas" é o resultado do checklist de governança.

## Resultado por caso

| # | Produto (tipo) | Tempo | Modelo que respondeu | Peças (bloqueadas) | Roteiros (bloqueados) | A governança fez o que devia? |
|---|---|---|---|---|---|---|
| 1 | Antigripal (medicamento isento) | 15,6 s | `gemini-3.5-flash-lite` (principal deu 503) | 6 (0) | 3 (0) | **Sim.** Passou, com a advertência da Anvisa nas peças e na última cena dos roteiros |
| 2 | Antibiótico (prescrição) | 13,6 s | `flash-lite` (principal 503) | 3 (3) | 3 (3) | **Sim.** Tudo bloqueado por "prescrição", como manda a RDC 96/2008 |
| 3 | Protetor solar (dermocosmético) | 55,5 s | `flash-lite` (principal sem resposta) | 6 (1) | 3 (0) | **Sim.** A peça bloqueada trazia "imperdível", que o manual de marca manda evitar; a IA o usou no selo |
| 4 | Vitamina C (suplemento) | 6,3 s | `flash-lite` (principal 429) | 3 (0) | 3 (0) | **Sim.** Passou sem alegar imunidade |
| 5 | Fralda (infantil) | 13,5 s | `flash-lite` (principal 429) | 6 (0) | 3 (0) | **Sim** |
| 6 | Vacina da gripe (serviço) | 12,2 s | `flash-lite` (principal 429) | 6 (0) | 3 (**1**) | **Não, falso positivo.** O Reels foi bloqueado por "superlativo" porque dizia "escolhe o melhor horário". Corrigido no PR #90 |
| 7 | Creme dental (higiene) | 5,9 s | `flash-lite` (principal 429) | 3 (0) | 3 (0) | **Sim** |
| 8 | Analgésico (isento), oferta com "garantido em 5 minutos, o melhor" | 9,1 s | `flash-lite` (principal 429) | 3 (0) | 3 (**2**) | **Sim.** A IA reescreveu a oferta sem a promessa; os roteiros de molde, que copiam a descrição da oferta, foram bloqueados |
| 9 | Colágeno (suplemento), oferta "emagrece, rejuvenesce e fortalece a imunidade" | 6,2 s | `flash-lite` (principal 429) | 3 (0) | 3 (**2**) | **Sim.** Mesma coisa: a IA evitou a alegação nas peças e os roteiros de molde foram bloqueados |
| 10 | Hidratante (dermocosmético), oferta com "tem alergia? é o remédio para dermatite" | 12,6 s | `flash-lite` (principal 429) | 3 (0) | 3 (**2**) | **Sim.** Diagnóstico e indicação de tratamento bloqueados nos roteiros de molde |

Os 10 casos saíram **com IA** (nenhum caiu nos moldes fixos), mas **nenhum com o modelo principal**: o `gemini-3.5-flash` respondeu 503, 429 ou não respondeu em todos, e o `gemini-3.5-flash-lite` de reserva respondeu. O cache funcionou: repetir o mesmo briefing devolveu em 0 a 1 s.

**Qualidade do texto (avaliação de leitura, subjetiva):** frases curtas, sem emoji, validade da oferta em todas as peças e tom coerente com o público (por exemplo, "um gesto simples de carinho" para 60+). Fraqueza: a estrutura se repete entre produtos ("Você já ... na sua rotina?") e a palavra "rotina" aparece em quase todas as peças.

## Problemas, por gravidade

| # | Gravidade | Problema | Situação |
|---|---|---|---|
| 1 | Alta | O modelo principal falhou nos 10 casos (429 de cota ou 503) e o caso 3 levou 55,5 s, perto dos 60 s em que a função da Vercel morre | **Tempo corrigido** no PR #90: cada tentativa espera no máximo 20 s e, passados 45 s no total, o motor devolve os moldes fixos com aviso. **Cota:** trocar o modelo principal por `gemini-3.5-flash-lite` (variável `GEMINI_MODEL` na Vercel) evitaria duas tentativas perdidas por chamada; decisão do João |
| 2 | Média | Falso positivo do superlativo: "escolhe o melhor horário" bloqueava um roteiro (caso 6) | **Corrigido** no PR #90, com teste; "o melhor protetor" continua bloqueado |
| 3 | Média | Uma oferta com promessa ou diagnóstico na descrição só aparece como "roteiro bloqueado" depois de gerar; a pessoa não é avisada no formulário (casos 8 a 10) | Aberto. Sugestão: rodar a checagem de termos na descrição da oferta antes de gerar |
| 4 | Baixa | Medicamento de prescrição ainda gasta uma chamada ao modelo para gerar texto que será bloqueado (caso 2) | Aberto. É útil para a demonstração do bloqueio; se a cota apertar, pular a geração nesse tipo |
| 5 | Baixa | Repetição de estrutura e de vocabulário entre produtos | Aberto. Variar os ganchos e proibir "rotina" mais de uma vez por conjunto no prompt |

## O que não foi medido

- Qualidade do texto por mais de uma pessoa: a nota acima é de uma leitura só.
- O modelo principal em condições normais: por causa da cota e da instabilidade, não houve uma única resposta dele nesta rodada.
- Briefings com mais de um público: cada caso usou um público, para poupar cota.
