# Documentação da Cápsula

**Atualizado em:** 25/10/2026 · Índice de toda a documentação do projeto, por assunto. O resumo do projeto está no [README principal](../README.md).

**No ar:** https://capsula-mvp.vercel.app

## Por onde começar

| Se você quer... | Leia |
|---|---|
| Entender o projeto em 5 minutos | [README principal](../README.md) |
| Usar o sistema | [Guia de uso](guia-de-uso.md) |
| Avaliar o código | [Arquitetura](arquitetura.md) → [Motor criativo](motor.md) → [API](api.md) |
| Conferir se funciona | [Qualidade e testes](qualidade.md) |
| Saber o que falta | [Limitações e próximos passos](limitacoes-e-proximos-passos.md) |

## 1. Produto

| Documento | Conteúdo |
|---|---|
| [Visão do produto](visao-produto.md) | Para quem, problema, valor, Product Goal (atingido) e premissas |
| [Guia de uso](guia-de-uso.md) | Passo a passo de cada tela, com capturas da produção e glossário |
| [Manual de marca](manual-de-marca.md) | A marca fictícia usada nas peças: cores, tipografia, tom e regras |
| [Limitações e próximos passos](limitacoes-e-proximos-passos.md) | O que o protótipo não faz, plano de evolução, indicadores e custo |

## 2. Técnica

| Documento | Conteúdo |
|---|---|
| [Arquitetura](arquitetura.md) | Módulos, caminho de uma geração, decisões técnicas, segurança, deploy e desempenho |
| [Motor criativo](motor.md) | Do briefing às variações: contexto, provedores de IA, dose e regras de governança |
| [API](api.md) | As quatro rotas, com pedidos, respostas e erros |
| [Dados reais](dados-reais.md) | Como ligar o CSV da empresa pelo `mapping.yaml`, sem mudar o sistema |

## 3. Qualidade

| Documento | Conteúdo |
|---|---|
| [Qualidade e testes](qualidade.md) | Os 102 testes, o que cobrem e o que ainda não foi testado |
| [QA do motor](qa-motor.md) | 10 briefings em produção, um por tipo de produto, e os problemas achados |
| [QA em produção](qa-producao.md) | O fluxo completo conferido por API e em tela, no computador e no celular |
| [Ano da saúde](ano-da-saude-verificacao.md) | Conferência das intensidades por mês com fontes públicas |

## 4. Processo (Scrum)

| Documento | Conteúdo |
|---|---|
| [README principal: Time e processo](../README.md#time-e-processo) | Papéis, sprints e fluxo de Git |
| [Definition of Done](definition-of-done.md) | O que "pronto" quer dizer, em cinco blocos |
| [Ambiente colaborativo](ambiente-colaborativo.md) | Repositório, quadro, deploy e padrões |
| [Sprint 1: Planning](sprints/sprint-1-planning.md) · [Review](sprints/sprint-1-review.md) · [Retrospective](sprints/sprint-1-retrospective.md) | App, motor e interface (15 a 20/10) |
| [Sprint 2: Planning](sprints/sprint-2-planning.md) · [Review](sprints/sprint-2-review.md) · [Retrospective](sprints/sprint-2-retrospective.md) | Governança, integração, QA e pitch (21 a 25/10) |
| [Modelos de Review](templates/sprint-review.md) e [de Retrospective](templates/sprint-retrospective.md) | Registros leves |
| [Contribuições por integrante](contribuicoes.md) | O escopo combinado com cada pessoa e quem entregou cada parte, com evidência |
| [Uso de IA generativa](uso-de-ia.md) | O que a IA fez no produto e no desenvolvimento, e o que o time corrigiu ou rejeitou |
| [Product Backlog](https://github.com/joaobatis1a/capsula/issues) · [Quadro](https://github.com/users/joaobatis1a/projects/1) | 45 issues com critérios de aceitação |

## 5. Pitch

| Documento | Conteúdo |
|---|---|
| [Roteiro de falas](pitch-roteiro-de-falas.md) · [vídeo gravado](https://drive.google.com/file/d/1AvHGMe0L-eU0a4wTjmnpy4tsK1Twsqg5/view?usp=drive_link) | O vídeo do pitch (4:27), os 10 slides, a fala de cada um, as animações do sistema e a cobertura dos 25 critérios da rubrica |

## 6. Registro das atividades do workshop

| Data | Atividade | Onde |
|---|---|---|
| 14/10 | Missão 1: Organização do Scrum Team | [README principal](../README.md#time-e-processo) |
| 14/10 | Missão 2: Visão do Produto e Product Goal | [visao-produto.md](visao-produto.md) |
| 14/10 | Missão 3: Product Backlog e critérios de aceitação | [Issues #1 a #16](https://github.com/joaobatis1a/capsula/issues) |
| 14/10 | Missão 4: Definition of Done e registros leves | [definition-of-done.md](definition-of-done.md) · [templates/](templates/) |
| 14/10 | Missão 5: Ambiente colaborativo | [ambiente-colaborativo.md](ambiente-colaborativo.md) |
| 14/10 | Missão 6: Sprint Planning 1 e tasks | [sprint-1-planning.md](sprints/sprint-1-planning.md) · [Tasks #17 a #32](https://github.com/joaobatis1a/capsula/issues?q=label%3Atask) |
| 15/10 | Divisão das entregas individuais | [guia-hector.md](guia-hector.md) · [guia-ivaldo.md](guia-ivaldo.md) |
| 22/10 | QA, conferências e cerimônias da Sprint 1 | [qa-motor.md](qa-motor.md) · [qa-producao.md](qa-producao.md) · [sprint-1-review.md](sprints/sprint-1-review.md) |
| 22 a 25/10 | Pitch | [pitch-roteiro-de-falas.md](pitch-roteiro-de-falas.md) |
| 25/10 | Documentação final e cerimônias da Sprint 2 | este índice · [sprint-2-review.md](sprints/sprint-2-review.md) |

Os guias individuais ([Hector](guia-hector.md) e [Ivaldo](guia-ivaldo.md)) são documentos internos de divisão de trabalho, mantidos como registro.
