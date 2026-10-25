# Definition of Done

**Atualizado em:** 14/10/2026 · **Status:** proposta para aprovação do time

Um item do Product Backlog só está **pronto** quando cumpre **todos** os pontos abaixo, além dos critérios de aceitação da própria issue. Item que não cumpre a DoD não é apresentado na Sprint Review e volta para o Product Backlog.

## Código

- [ ] Está numa branch `tipo/tarefa-descricao` e entrou na `main` por Pull Request com **Squash and merge**.
- [ ] O PR foi revisado e aprovado por **outro integrante**, seguindo o rodízio João → Ivaldo → Hector → João.
- [ ] Os commits seguem o padrão `tipo(escopo): descrição`.
- [ ] `npm run build` e `npm run lint` passam sem erro.
- [ ] Os testes da área passam. Quando o item mexe em dados, a mesma suíte roda contra o mock.

## Funcionamento

- [ ] Todos os critérios de aceitação da issue foram verificados e marcados.
- [ ] A funcionalidade roda na **URL publicada na Vercel**, não só em `localhost`.
- [ ] Usa os contratos de dados (tipos compartilhados) e acessa os dados pelo `CampaignDataSource`, nunca direto no mock.
- [ ] Quando a cota do modelo de linguagem acaba ou um serviço falha, a tela mostra um aviso em vez de quebrar.

## Interface

- [ ] Usa os tokens e componentes do design system da Cápsula. Não há cor nem fonte fora dele.
- [ ] Funciona em 360px e 1280px de largura sem rolagem horizontal.
- [ ] Status e origem têm palavra e ícone, não só cor. O foco de teclado é visível.

## Dados, segurança e confidencialidade

- [ ] Nenhuma chave, senha ou `.env.local` entrou em commit.
- [ ] Todo dado sintético aparece marcado como sintético ("nos dados de teste").
- [ ] Toda evidência e tendência mostra a origem (fonte e data).
- [ ] Nada do enunciado nem o nome da empresa cliente aparece no código, na interface ou nos commits.

## Registro

- [ ] A issue foi movida para **Done** no quadro do GitHub Projects, com o PR vinculado (`Closes #n`).
- [ ] Se o item mudou alguma premissa, a decisão foi registrada no README ou em `docs/`.
- [ ] Se a IA ajudou no item, o uso foi registrado em [Uso de IA generativa](uso-de-ia.md).

## Como a DoD muda

A DoD só muda na **Sprint Retrospective**, por proposta de qualquer integrante e com o aceite dos três. O Scrum Master garante que ela seja seguida nas revisões de PR.

## Registros leves

- [Modelo de Sprint Review](templates/sprint-review.md)
- [Modelo de Sprint Retrospective](templates/sprint-retrospective.md)

Cada sprint gera uma cópia preenchida em `docs/sprints/sprint-N-review.md` e `docs/sprints/sprint-N-retro.md`.
