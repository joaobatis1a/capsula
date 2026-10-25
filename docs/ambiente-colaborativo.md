# Ambiente colaborativo

**Atualizado em:** 25/10/2026 · **Responsável:** João Batista (Product Owner)

O time trabalha num repositório privado no GitHub, com o backlog em Issues e o quadro no GitHub Projects. O acesso é só para os integrantes e os avaliadores autorizados.

## Onde fica cada coisa

| O quê | Onde | Visibilidade |
|---|---|---|
| Código e documentação | [joaobatis1a/capsula](https://github.com/joaobatis1a/capsula) | Privado |
| Product Backlog | [Issues](https://github.com/joaobatis1a/capsula/issues) | Privado |
| Quadro do Scrum | [Cápsula: Product Backlog](https://github.com/users/joaobatis1a/projects/1) | Privado |
| Deploy | Vercel: https://capsula-mvp.vercel.app, publicado a cada merge na `main` | Público; prévia por PR |
| Banco de dados | Fora da entrega desde 22/10: os dados de teste ficam atrás do adaptador `CampaignDataSource` | — |
| Comunicação e daily | Grupo do time no WhatsApp | Só o time |

## Quadro do Scrum

| Coluna | Significa |
|---|---|
| Product Backlog | Itens ordenados pelo PO, ainda fora da sprint |
| Sprint Backlog | Selecionados no Sprint Planning |
| Em andamento | Alguém está trabalhando nisso (um dono por item) |
| Em revisão | PR aberto, aguardando o revisor do rodízio |
| Pronto | Cumpre a [Definition of Done](definition-of-done.md) |

Um item fechado por PR com `Closes #n` vai sozinho para **Pronto**.

## Padrões no repositório

- **Modelo de PR** (`.github/pull_request_template.md`): o que muda, como testar, prints e o checklist da DoD.
- **Modelos de issue** (`.github/ISSUE_TEMPLATE/`): user story e bug. Issue em branco está desativada.
- **Labels:** tipo (`user-story`, `habilitador`, `entrega-final`), área, prioridade e tamanho.
- **`.gitignore`** com `.env.local` e chaves fora dos commits.

## Acessos

| Pessoa | Papel | Repositório | Quadro |
|---|---|---|---|
| João Batista | Product Owner | Dono | Dono |
| Ivaldo | Developer | Write (aceito) | Write |
| Hector | Scrum Master | Write (aceito) | Write |
| Mentoria | Avaliação | Write (aceito) | — |

Integrantes entram como **Write** no repositório e no quadro. Repositório pessoal no GitHub não tem papel só de leitura para convidados, por isso a mentoria entrou como **Write**, com o acordo de não alterar nada.

## Limitações conhecidas

- **Proteção da `main`:** o GitHub Free não permite regras de proteção de branch em repositório privado. A regra "ninguém commita direto na `main`" vale como acordo do time e é conferida pelo Scrum Master. Se algum integrante tiver o GitHub Pro (gratuito no GitHub Student Developer Pack), a regra pode ser ativada.
- **Cota gratuita da IA:** o Gemini pode recusar por cota. Antes de apresentar, gere o briefing de exemplo uma vez para o cache guardar uma resposta com IA.
