# Contribuições por integrante

**Atualizado em:** 25/10/2026 · Quem entregou cada parte do projeto, com a evidência no repositório.

O escopo foi dividido entre os três integrantes em 15/10, nos guias individuais ([Hector](guia-hector.md) e [Ivaldo](guia-ivaldo.md)), com prazo em 22/10. Este registro compara o que foi combinado com o que foi entregue. Ele se baseia só no que é verificável: commits, Pull Requests, issues e arquivos recebidos.

## Contexto

Os três conciliaram o hackathon com compromissos pessoais, e cada um teve uma disponibilidade diferente ao longo das duas semanas. Por isso, em vários momentos o João tomou a frente para adiantar partes do trabalho, para que o prazo não ficasse em risco.

Em alguns momentos, o João e a mentoria conversaram sobre como trazer um pouco mais de envolvimento de todos. Isso fez o Hector e o Ivaldo participarem mais na reta final, com entregas, ajuda nas decisões e retorno sobre o pitch.

**O saldo do time é positivo, e não há nada a criticar em nenhum dos integrantes.** As diferenças de volume abaixo refletem a disponibilidade de cada um, e não o compromisso com o projeto.

## Em números

| | João Batista | Ivaldo | Hector |
|---|---|---|---|
| Papel no Scrum | Product Owner e Developer | Developer | Scrum Master e Developer |
| Commits na `main` | 70 | 2 (com o trabalho de 3 entregas) | 0 |
| Pull Requests abertos e mergeados | 69 | 0 | 0 |
| Entregas individuais combinadas | Estúdio, galeria, Memória, aprovação, painel de ganho e pitch (frente original) | I1 a I5 | H1 a H5 |
| Entregas individuais recebidas | — | 3 de 5 | 1 de 5, em parte |

## Entregas combinadas e o que aconteceu

### Ivaldo (I1 a I5)

| Entrega | Situação | Evidência |
|---|---|---|
| I1. Roteiros de Reels, TikTok e comercial (#79) | **Entregue pelo Ivaldo**: roteiros de comercial de 15 e 30 s, com o arquivo de testes dos roteiros. Ajustes de integração feitos depois pelo João (rótulo no prompt, uma chamada ao modelo por público) | Branch `feat/10-roteiros-15-30s` (21/10), que entrou na `main` junto com o commit `4173bd8`, com `tests/roteiros.test.ts` · ajuste `03c298a` |
| I2. Teste do motor com 10 briefings (#80) | **Assumido pelo João** depois do prazo | [qa-motor.md](qa-motor.md) |
| I3. Música liberada na Bula (#81) | **Entregue pelo Ivaldo** | Commit `4173bd8` "feat: música na bula da variação" (22/10) |
| I4. Revisão dos templates e do PNG (#82) | **Entregue pelo Ivaldo**, com correções do João (PNG no tamanho real, limite de linhas do feed, erro de digitação na marca) | Commit `77b4fc9` "feat: revisão templates" (22/10) · correção `de232bf` |
| I5. Integração e QA em produção (#83) | **Assumido pelo João** | [qa-producao.md](qa-producao.md) |

### Hector (H1 a H5)

O Hector enviou, em 22/10 às 19:59, um pacote de arquivos (`backend_hector.zip`, cerca de 3.500 linhas). Segundo o próprio pacote, o código foi escrito com IA, num ambiente sem rede: as migrations não foram executadas contra um banco de verdade, e os 74 testes rodaram com bibliotecas simuladas. O pacote foi escrito para um contrato de dados diferente do que o repositório já usava desde 15/10.

| Entrega | Situação | Evidência |
|---|---|---|
| H1. Supabase e migration (#74) | **Fora do escopo** desde 22/10: o banco saiu da entrega. As migrations do pacote não foram usadas | Decisão na [Review da Sprint 1](sprints/sprint-1-review.md) |
| H2. Radar com fontes reais (#75) | **Não entregue.** O pacote trazia 18 itens marcados como exemplo ilustrativo, sem coleta real | Issue aberta; próxima fase |
| H3. Conferir o Ano da saúde (#76) | **Não entregue pelo Hector.** O João fez uma conferência parcial: 5 das 33 condições | [ano-da-saude-verificacao.md](ano-da-saude-verificacao.md) |
| H4. Dados reais: CSV e `mapping.yaml` (#77) | **Entregue em parte.** O leitor de CSV, o leitor de YAML e o tratamento de linhas inválidas do pacote foram aproveitados; o João adaptou ao contrato do repositório e cobriu com testes. O resto do pacote (checklist, estados, rotas, migrations) duplicava o que já existia e foi descartado | Commit `3e27cac` · [dados-reais.md](dados-reais.md) |
| H5. Documentos das cerimônias (#78) | **Feito pelo João.** O pacote não trazia esses documentos | [`docs/sprints/`](sprints/) |

### João Batista

Além da frente original, o João escreveu o restante do sistema e assumiu as entregas acima, sempre por Pull Request: o scaffold e o design system, os contratos e o adaptador de dados, o motor com a troca de modelo e o orçamento de tempo, a governança e o fluxo de aprovação, a marca fictícia e os templates, as telas (Estúdio, galeria, Bula, Memória, Radar, Ano da saúde, painel de ganho), os 98 testes, o QA, a documentação e o pitch. A IA usada nesse trabalho está registrada em [Uso de IA generativa](uso-de-ia.md).

## Fora do repositório

O Hector e o Ivaldo ajudaram em decisões de apoio ao longo do projeto, nas conversas do time, e participaram das decisões sobre o pitch, tomadas em acordo com a maioria. Essas contribuições não aparecem no Git, mas fazem parte do resultado.

## Como este registro foi feito

- **Commits e PRs:** `git shortlog` da `main` e a lista de Pull Requests mergeados no GitHub, em 25/10/2026. Os PRs entram na `main` com Squash and merge, por isso cada PR conta como um commit.
- **Entregas:** as issues #74 a #83 e os guias individuais de 15/10.
- **Pacote do Hector:** a lista de arquivos e o `LEIA-ME.md` do próprio pacote.

Os números servem para registrar quem fez cada parte, e não para avaliar as pessoas.
