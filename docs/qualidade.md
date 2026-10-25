# Qualidade e testes

**Atualizado em:** 25/10/2026 · O que é testado, como, e o que ainda não foi.

## Em números

| Medida | Valor |
|---|---|
| Testes automatizados | **98**, em 13 arquivos, todos passando |
| Briefings testados em produção | **10**, um para cada tipo de produto e para os casos de bloqueio ([qa-motor.md](qa-motor.md)) |
| Passos do QA em produção | 24, dos quais 21 executados com sucesso; 3 dependem de uma pessoa ou de um aparelho real ([QA em produção](qa-producao.md)) |
| Larguras de tela conferidas | 360, 390, 768 e 1280 px, sem rolagem horizontal |
| Falhas encontradas em produção e corrigidas | 3: falso positivo do superlativo (PR #90), peças escuras no modo escuro do navegador (PR #93), id de evidência no texto do roteiro (PR #111) |

## Como rodar

```bash
npm test            # os 98 testes (Vitest), em cerca de 5 s
npx tsc --noEmit    # checagem de tipos
npm run lint        # ESLint
npm run build       # build de produção
```

Os testes não chamam a IA nem a internet: o cliente do modelo é simulado e os dados vêm do adaptador de teste.

## O que os testes cobrem

| Arquivo | Testes | O que garante |
|---|---|---|
| `contratos.test.ts` | 7 | O briefing completo é aceito e ganha os padrões; o erro aparece no campo certo; preço da oferta maior que o normal é recusado; máximo de 4 públicos; o JSON de exemplo segue o contrato; toda evidência tem origem e fonte; o roteiro começa com gancho de até 3 s e a música é liberada |
| `data-source.test.ts` | 6 | O adaptador de teste devolve o histórico com métricas coerentes, filtra por canal, só devolve itens do Radar válidos na data e gera sempre as mesmas 300 campanhas |
| `csv.test.ts` | 12 | **A mesma suíte do adaptador** roda contra o CSV de exemplo; as 300 campanhas do CSV alimentam o ranking sem mudar nada nele; linha inválida é ignorada com o motivo |
| `ranking.test.ts` | 5 | As 5 melhores e as 5 piores combinações; encontra os padrões plantados; escreve o texto da Bula com número, contagem e fonte; ignora combinações com poucas campanhas |
| `motor.test.ts` | 4 | Sem chave, gera variações válidas para cada público e canal com aviso; públicos em outra ordem dão a mesma chave de cache; não guarda no cache resposta com moldes fixos; tenta de novo antes de cair nos moldes |
| `llm.test.ts` | 5 | Troca de modelo quando o principal responde 503 duas vezes; não troca quando responde; falha com a lista de avisos quando todos recusam; respeita `GEMINI_FALLBACK_MODELS`; para de tentar depois de 45 s |
| `governanca.test.ts` | 13 | Bloqueia promessa de cura, promessa de resultado, medicamento com prescrição, diagnóstico, alegação terapêutica e superlativo; exige validade quando fala de desconto e a advertência em medicamento isento; não confunde palavras parecidas nem "o melhor horário" |
| `fluxo.test.ts` | 4 | Rascunho → Em revisão → Aprovado → Publicado com responsável e data; não aprova direto do rascunho; exige nome e motivo para devolver; peça bloqueada não avança mesmo que a tela diga o contrário |
| `roteiros.test.ts` | 21 | Reels, TikTok e comercial de 15 e 30 s para cada público, com estrutura de cenas, gancho, evidências do Radar, música liberada e checklist aplicado ao texto |
| `oferta.test.ts` | 5 | R$ 100 por R$ 80 dá 20%; arredonda sem mostrar 0%; não calcula sem os dois preços; lê preço em formato brasileiro |
| `ganho.test.ts` | 8 | Resumo de tempo, variações e peças barradas; cache fora da média; contagem de moldes fixos; comparação com as premissas e volta ao padrão quando são inválidas |
| `saude.test.ts` | 6 | Base de 33 condições com ids únicos e 12 meses de 0 a 3; conteúdo completo com fonte; o texto não promete cura nem diagnostica; a janela de três meses e o calendário de campanhas |
| `texto.test.ts` | 2 | Ids de evidência saem do texto das peças e roteiros, sem mexer em texto comum entre parênteses |

## QA manual e em produção

- **[QA do motor](qa-motor.md):** 10 briefings em produção, em 22/10. Todos saíram com IA (pelo modelo de reserva), e a governança acertou 9 de 10; o erro (falso positivo do superlativo) foi corrigido no mesmo dia.
- **[QA em produção](qa-producao.md):** o percurso briefing → variações → Bula → governança → aprovação → Memória → Ganho, por API e em tela, no computador e no celular.
- **[Ano da saúde](ano-da-saude-verificacao.md):** 5 das 33 condições conferidas com fonte pública, todas consistentes; as outras 28 estão marcadas como aproximação.

## O que ainda não foi testado

| Item | Por quê | Como fazer |
|---|---|---|
| Teclado nos seletores do briefing | Precisa de uma pessoa navegando só com o teclado | Passo 1.3 do QA em produção |
| Roteiro bloqueado visto em tela | Coberto por testes automatizados; o briefing de exemplo não gera roteiro bloqueado | Passo 3.5 do QA em produção, com um briefing de medicamento com prescrição |
| Fluxo completo num celular real | Conferido só em telas simuladas no navegador | Passo 6.4 do QA em produção |
| Qualidade do texto por mais de uma pessoa | A avaliação de leitura foi de uma pessoa só | Rodada com o time de marketing no piloto |
| O modelo principal em condições normais | Na rodada de QA ele estava com cota esgotada ou sobrecarregado | Repetir a rodada com plano pago |
| Teste de carga | O protótipo usa a camada gratuita da IA | Fora do escopo do hackathon |

## Como a qualidade é garantida no processo

- **Definition of Done** com cinco blocos ([definition-of-done.md](definition-of-done.md)): build, lint e testes passando; critérios de aceitação verificados na URL publicada; design system respeitado; dados marcados; registro no quadro.
- **Pull Request para tudo**, com Squash and merge, e publicação automática na Vercel a cada merge.
- **Issue fechada com a evidência** (teste, PR ou produção), o que mostrou critérios que não estavam cumpridos de fato, como a governança dos roteiros (PR #89).
