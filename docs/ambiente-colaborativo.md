# Ambiente colaborativo

**Atualizado em:** 14/10/2026 · **Responsável:** João Batista (Product Owner)

O time trabalha num repositório privado no GitHub, com o backlog em Issues e o quadro no GitHub Projects. O acesso é só para os integrantes e os avaliadores autorizados.

## Onde fica cada coisa

| O quê | Onde | Visibilidade |
|---|---|---|
| Código e documentação | [joaobatis1a/capsula](https://github.com/joaobatis1a/capsula) | Privado |
| Product Backlog | [Issues](https://github.com/joaobatis1a/capsula/issues) | Privado |
| Quadro do Scrum | [Cápsula: Product Backlog](https://github.com/users/joaobatis1a/projects/1) | Privado |
| Deploy | Vercel, a conectar no item [#1](https://github.com/joaobatis1a/capsula/issues/1) | Prévia por PR |
| Banco de dados | Supabase, plano gratuito, a criar no item [#1](https://github.com/joaobatis1a/capsula/issues/1) | Só o time |
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
| Ivaldo | Developer | Convite pendente | Convite pendente |
| Hector | Scrum Master | Convite pendente | Convite pendente |
| Avaliadores | Leitura | A definir | A definir |

Integrantes entram como **Write** no repositório e **Write** no quadro. Avaliadores entram como **Read**.

## Limitações conhecidas

- **Proteção da `main`:** o GitHub Free não permite regras de proteção de branch em repositório privado. A regra "ninguém commita direto na `main`" vale como acordo do time e é conferida pelo Scrum Master. Se algum integrante tiver o GitHub Pro (gratuito no GitHub Student Developer Pack), a regra pode ser ativada.
- **Supabase gratuito** pausa após 7 dias sem uso. Alguém precisa acessar o projeto antes de cada apresentação.
