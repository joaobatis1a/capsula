# Uso de IA generativa

**Atualizado em:** 25/10/2026 · Registro exigido pelo workshop de Scrum: onde a IA entrou, o que ela fez e o que o time corrigiu ou rejeitou.

A IA aparece em dois lugares diferentes, e cada um tem a sua regra.

## 1. IA dentro do produto

| O quê | Quem faz | Regra |
|---|---|---|
| Escrever o texto das peças e dos roteiros | **Gemini** (`gemini-3.5-flash-lite`, com reservas) | Só a partir das evidências fornecidas; cita cada uma por id |
| Escrever a fonte de cada evidência | **O sistema** | O modelo nunca escreve fonte; ids inventados são descartados |
| Calcular a dose | **O sistema** | Heurística declarada, a partir do peso das evidências |
| Checar as regras de publicidade | **O sistema** (checklist) | Roda em cada peça e roteiro, e de novo no servidor a cada mudança de status |
| Aprovar e publicar | **Uma pessoa** | Nenhuma peça vai ao ar sem uma pessoa aprovar, com o nome registrado |
| Imagem das peças | **Ninguém**: são templates da marca | Nenhuma imagem é gerada por IA |

Quando a IA falha, a tela diz qual modelo respondeu ou que as peças saíram dos moldes fixos. Nada é escondido.

## 2. IA no desenvolvimento

Ferramenta: **Claude (Anthropic)**, no claude.ai e no Claude Code. Toda mudança de código entrou por Pull Request, e o Product Owner decidiu o que ficava.

### Sprint 0: workshop de Scrum (14/10)

| Missão | Em que a IA ajudou | O que foi corrigido ou rejeitado pelo time |
|---|---|---|
| 1. Organização do Scrum Team | Explicou as responsabilidades do Scrum, propôs a divisão PO/SM e redigiu o acordo de trabalho a partir do manual do colaborador | O time escolheu PO, SM e canal da daily. A IA sugeriu acumular PO e SM numa pessoa só como opção, e a ideia foi rejeitada para separar valor de processo |
| 2. Visão do Produto e Product Goal | Redigiu a visão e o Product Goal a partir do escopo do projeto e separou fatos, hipóteses, dúvidas e riscos | Revisado pelo PO; o checklist do Product Goal foi atualizado com a evidência em 25/10 |
| 3. Product Backlog e critérios de aceitação | Converteu as tarefas dos guias individuais em 16 itens com critérios no formato Dado/Quando/Então, propôs a ordem e criou as issues e labels | O pitch entrou no backlog marcado como entrega final, fora da Sprint 1 |
| 4. Definition of Done e registros leves | Ampliou a definição de pronto do manual do colaborador para uma DoD em cinco blocos e redigiu os modelos de Review e Retrospective | Adotada como está; uma mudança foi proposta na Retrospective da Sprint 1 |
| 5. Ambiente colaborativo | Configurou o quadro do GitHub Projects com colunas do Scrum, criou os modelos de PR e issue e documentou acessos | A proteção da `main` sugerida no manual não está disponível no GitHub Free para repositório privado. Virou acordo do time |
| 6. Sprint Planning 1 e tasks | Propôs as datas das sprints e o Sprint Goal 1, quebrou os itens #1 a #5 em 16 tasks com dono e criou o campo Sprint no quadro | Datas aprovadas pelo PO |

### Sprint 1: app, motor e interface (15 a 20/10)

| Entrega | Em que a IA ajudou | O que foi corrigido ou rejeitado |
|---|---|---|
| Contratos, adaptador e motor (#20 a #26, #30 a #32) | Escreveu os contratos de dados, o adaptador com dados de teste, o histórico sintético de 300 campanhas, o ranking da memória e o motor, com modo sem IA | Em 15/10 o motor com modelo real ainda não tinha sido testado. Foi testado em produção na Sprint 2, com 10 briefings |
| Governança e aprovação (#7, #8) | Escreveu o checklist (RDC 96/2008 e termos proibidos) e o fluxo de quatro estados validado no servidor | O conjunto de regras é mínimo e **não é parecer jurídico**. A revisão jurídica está nos próximos passos |
| Peças e marca (#27, #28, #29) | Criou a marca fictícia "Farmácia Exemplo" e os templates nos três formatos | O PO pediu marca fictícia por confidencialidade. Nenhuma imagem é gerada por IA |
| Ano da saúde (#36) | Montou a base de 33 condições com intensidade por mês, a partir de fontes públicas | As faixas são **aproximadas**; a IA não conseguiu abrir o InfoGripe |
| Interface e movimento | Propôs e implementou animações, cabeçalho, rodapé e formas farmacêuticas | O PO **rejeitou** o fundo de bolinhas, a cartela do hero, a faixa de bula em carrossel e o seletor de segmentos, e pediu a base de saúde muito mais ampla. Bugs corrigidos na revisão: uma animação que sumiu e sobra horizontal no celular |
| Painel de ganho (#12) | Escreveu a medição e a comparação | A comparação com o processo de hoje usa **premissas declaradas e editáveis**, que não são dado da empresa |

### Sprint 2: governança, integração, QA e pitch (21 a 25/10)

| Entrega | Em que a IA ajudou | O que foi corrigido ou rejeitado |
|---|---|---|
| Troca de modelo e orçamento de tempo (PRs #88, #90, #92, #98) | Escreveu as reservas do Gemini, o limite de 20 s por tentativa e 45 s no total e a nova tentativa com JSON malformado | O PO escolheu o `gemini-3.5-flash-lite` como principal com base no QA em produção, e não no modelo maior sugerido antes |
| Fonte CSV (#13, PR #86) | Adaptou ao contrato do repositório o leitor de CSV do pacote de backend enviado pelo Hector, que também tinha sido gerado com IA | Só a parte de CSV foi aproveitada; o resto do pacote foi descartado por duplicar o que já existia ou depender de um banco fora do escopo |
| Governança dos roteiros (#10, PR #89) | Aplicou o checklist das peças ao texto dos roteiros | Achado ao fechar a issue com evidência: o critério não estava cumprido |
| QA do motor e em produção (#80, #83) | Executou os 10 briefings por API e o roteiro de QA em tela, e registrou os resultados | Executado pelo PO com apoio de IA porque a entrega individual não chegou no prazo; um falso positivo e um defeito visual foram corrigidos |
| Conferência do Ano da saúde (#76) | Pesquisou fontes públicas para as condições com recorte de meses | Só 5 de 33 conferidas; a correção sugerida para a dengue ficou para decisão do PO |
| Briefing enxuto (PRs #95, #96) | Calculou o desconto pelos preços e propôs quais campos sair do formulário | O PO decidiu o que saía: formatos, número de variações, tema e receita |
| Pitch (#16) | Redigiu os slides, as falas e a matriz da rubrica, e criou as animações em motion dos slides 5 e 6 | O PO reprovou várias versões das falas por estarem confusas e robóticas. O mentor pediu trocar a ferramenta nomeada por "IA genérica", focar na rede e enxugar os slides; tudo foi aplicado. As animações são declaradas como animação, não captura de tela |
| Documentação final (25/10) | Reescreveu o README e escreveu guia de uso, arquitetura, API, qualidade e próximos passos a partir do código | Ao capturar as telas, a IA achou um id interno vazando na fala do roteiro; corrigido com teste (PR #111) |

## Princípios que o time seguiu

- A IA propõe, o time decide. Nenhuma sugestão entrou sem Pull Request.
- O que a IA não conseguiu verificar ficou marcado como não verificado, e não como fato.
- Dado real da empresa nunca foi enviado a uma ferramenta de IA.
