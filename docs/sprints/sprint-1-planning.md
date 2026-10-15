# Sprint Planning: Sprint 1

**Sprint:** 15/10 a 20/10/2026 (6 dias) · **Planning em:** 14/10/2026 · **Status:** proposta para aprovação do time
**Quadro:** [Cápsula: Product Backlog](https://github.com/users/joaobatis1a/projects/1), filtro `Sprint: Sprint 1`

## Sprint Goal

> **Ao fim da Sprint 1, um briefing preenchido na tela gera variações reais de texto nos três formatos, usando o histórico sintético, publicado na Vercel.**

O objetivo prova o núcleo do [Product Goal](../visao-produto.md#product-goal): briefing → memória → variações. Bula, governança e radar ficam para a Sprint 2 e dependem desse núcleo.

## Sprint Backlog

Itens escolhidos pelo Product Owner, na ordem do backlog. O plano de execução (tasks e donos) foi definido pelos Developers.

| Item | Tasks | Donos |
|---|---|---|
| [#1 Ambiente do projeto](https://github.com/joaobatis1a/capsula/issues/1) | #17 Scaffold Next.js e Vercel · #18 Supabase e migration · #19 Chaves e variáveis | João, Hector, Ivaldo |
| [#2 Contratos e adaptador](https://github.com/joaobatis1a/capsula/issues/2) | #20 Tipos do briefing · #21 Contrato de saída · #22 CampaignDataSource mock | João, Ivaldo, Hector |
| [#3 Gerar variações](https://github.com/joaobatis1a/capsula/issues/3) | #23 Rota de geração · #24 Cache e reserva · #25 Tela do Estúdio · #26 Ligar Estúdio à rota | Ivaldo, Ivaldo, João, João |
| [#4 Peças nos três formatos](https://github.com/joaobatis1a/capsula/issues/4) | #27 Manual de marca sintético · #28 Templates · #29 Galeria | João, Ivaldo, João |
| [#5 Memória com ranking](https://github.com/joaobatis1a/capsula/issues/5) | #30 Histórico sintético · #31 Ranking · #32 Contexto no motor | Hector, Hector, Ivaldo |

**Carga por pessoa:** João Batista 6 tasks · Ivaldo 6 tasks · Hector 4 tasks, mais a facilitação como Scrum Master.

## Ordem de execução

1. **15/10:** #17, #18 e #19 (ambiente) em paralelo com #20, #21 e #22 (contratos). Os contratos destravam todo o resto.
2. **16 e 17/10:** #23, #25, #27, #30. Front usa o JSON de exemplo do contrato até a rota ficar pronta.
3. **18 e 19/10:** #24, #26, #28, #29, #31, #32.
4. **20/10:** integração, deploy e Sprint Review e Retrospective.

## Como saber que o Sprint Goal foi atingido

- [ ] Na URL da Vercel, um briefing gera de 3 a 5 variações por canal com o modelo real.
- [ ] As variações aparecem na galeria em feed, story e banner com o manual de marca sintético.
- [ ] O motor recebe as combinações do ranking no contexto, e elas vêm marcadas como sintéticas.
- [ ] Todos os itens entregues cumprem a [Definition of Done](../definition-of-done.md).

## Premissas e riscos

| Tipo | Item | Resposta |
|---|---|---|
| Premissa | Ivaldo e Hector entram no repositório até 15/10 | O PO envia os convites assim que tiver os usuários do GitHub |
| Premissa | A stack aprovada (Next.js, Supabase, Groq, Vercel) não muda | Mudança só com o aceite dos três |
| Risco | A cota gratuita do Groq não basta nos testes | Cache desde a #24 e OpenRouter de reserva |
| Risco | A conversão de template em imagem atrasa | A galeria mostra o template em HTML até a imagem ficar pronta |
| Risco | Os contratos (#20, #21) atrasam e travam o paralelo | Prazo de 15/10 e revisão no mesmo dia |

## Previsão das próximas sprints

Planejamento indicativo. A Sprint 2 é confirmada no seu próprio Planning, em 21/10.

| Quando | O quê |
|---|---|
| **Sprint 2 (21 a 25/10)** | #6 Bula, #7 Checklist, #8 Aprovação, #9 Radar, #10 Roteiros, #11 Tela da Memória, #12 Painel de ganho, #13 Dados reais, #14 Integração, #15 Responsividade. Inclui a mentoria (21 a 23/10) e o congelamento do escopo em 24/10 |
| **Entrega (26/10)** | #16 Pitch de 5 minutos e vídeo de demonstração. **Está previsto no planejamento, mas não faz parte da Sprint 1** |
