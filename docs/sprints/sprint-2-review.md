# Sprint Review: Sprint 2

**Data:** 25/10/2026 · **Duração:** até 20 minutos · **Facilitação:** Scrum Master · **Presentes:** [a preencher pelo time]

> **Rascunho** do Product Owner, montado a partir do histórico de PRs, issues e QA. O time confere e completa presentes e feedback.

## Sprint Goal

> Até 24/10 (congelamento do escopo), o fluxo briefing → variações → Bula → governança → aprovação → Memória roda de ponta a ponta na URL da Vercel, sem intervenção manual, e o pitch está pronto para 26/10.

**Atingido?** Sim. O fluxo completo roda em https://capsula-mvp.vercel.app e foi conferido por API e em tela ([qa-producao.md](../qa-producao.md)). O pitch tem slides, falas e animações do sistema prontos ([roteiro](../pitch-roteiro-de-falas.md)).

| Critério do Sprint Goal | Situação |
|---|---|
| O roteiro de demonstração roda na URL da Vercel do começo ao fim (#14) | ✅ conferido em 22/10 e de novo em 25/10, com uma geração em 9,5 s |
| O Radar mostra itens com fonte e data, e os de exemplo estão marcados | ✅ todos os itens com fonte, data e validade, marcados "dados de teste"; a coleta real (#75) ficou para a próxima fase |
| O pitch de 5 minutos e o vídeo estão prontos (#16) | ✅ 10 slides, 558 palavras de fala (3:58 em ritmo normal) e duas animações do sistema; o ensaio é do time |
| Os itens entregues cumprem a Definition of Done | ✅ cada item fechado com a evidência |

## O que foi entregue

| Issue | Item | Evidência |
|---|---|---|
| #6 | Bula em cada peça | 5 seções, dose e evidências com fonte; QA 3.1 |
| #7 | Checklist bloqueia peça inadequada | 9 regras, 13 testes; QA do motor com 10 briefings |
| #8 | Aprovação humana em quatro estados | Validação no servidor, 4 testes; QA 4.1 a 4.4 em tela |
| #10 | Roteiros de Reels, TikTok e comercial | 21 testes; checklist aplicado aos roteiros (PR #89) |
| #11 | Tela da Memória e ciclo de aprendizado | QA 5.1 e 5.2 em tela |
| #12 | Painel de ganho | 8 testes; QA 5.3 |
| #13 | Testes e guia para dados reais | Fonte CSV com a mesma suíte do adaptador ([dados-reais.md](../dados-reais.md)) |
| #15 | Responsividade e acabamento | 360, 768 e 1280 px sem rolagem lateral |
| #37 | Música liberada nos roteiros | Só música com uso comercial é sugerida |
| #80, #83 | QA do motor e em produção | [qa-motor.md](../qa-motor.md) · [qa-producao.md](../qa-producao.md) |

Também entraram: troca automática de modelo com orçamento de tempo (PRs #88, #90, #92, #98), briefing mais enxuto com desconto calculado pelos preços (PRs #95, #96) e, depois do congelamento, uma correção de erro (PR #111: id interno aparecia na fala do roteiro).

## O que não foi entregue

| Issue | Item | Motivo | Destino |
|---|---|---|---|
| #9 e #75 | Radar com fontes reais | A entrega individual não chegou até o congelamento | Próxima fase: coleta automática |
| #76 | Conferência completa do Ano da saúde | 5 de 33 condições conferidas | Próxima fase: conferir as 28 restantes com os boletins |
| #14 | Integração e deploy estável | Entregue na prática: os 24 passos do QA em produção passaram em 25/10, incluindo teclado, roteiro bloqueado em tela e o fluxo no celular por emulação. Fica aberta só por decisão do PO | Fechar com a evidência do [QA em produção](../qa-producao.md); aparelho físico como complemento |
| #16 | Pitch e vídeo | Material pronto; falta o ensaio do time e a apresentação | Fecha em 26/10 |

## Feedback recebido

| De quem | Feedback | Decisão do time |
|---|---|---|
| Mentoria (sugestão) | Considerar citar a IA em geral, em vez de uma ferramenta específica | Discutida pelos integrantes e adotada em acordo com a maioria: slides 2 e 4 e falas (PR #107) |
| Mentoria (sugestão) | Considerar manter o foco na rede, em vez de "farmácias em geral" | Discutida pelos integrantes e adotada em acordo com a maioria: "o time de marketing da rede", com escala por categorias, regiões e canais (PR #107) |
| Mentoria (sugestão) | Considerar menos texto nos slides, mantendo a fala | Discutida pelos integrantes e adotada em acordo com a maioria: slides enxutos, com a explicação na fala (PRs #107 e #109) |
| Product Owner | Falas confusas e robóticas em versões anteriores | Reescritas em tom de conversa (PRs #102, #106, #108, #109) |
| [time] | [a preencher] | [a preencher] |

## Mudanças no Product Backlog

- Supabase (#18, #74) fora da entrega desde 22/10; persistência vira próxima fase.
- Radar real (#75) e conferência completa do Ano da saúde (#76) passam para depois da entrega.
- Documentação final organizada em [`docs/README.md`](../README.md), com guia de uso, arquitetura, API, qualidade e próximos passos.

## Uso de IA nesta sprint

Registrado em [uso-de-ia.md](../uso-de-ia.md#sprint-2-governança-integração-qa-e-pitch-21-a-2510).
