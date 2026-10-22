# Sprint Review: Sprint 1

**Data:** 22/10/2026 (adiada do dia 20/10) · **Duração:** até 20 minutos · **Facilitação:** Scrum Master · **Presentes:** [a preencher pelo time]

> **Rascunho.** Preparado pelo Product Owner a partir do histórico de PRs e issues, para o time conferir e completar (presentes, feedback). O que não está comprovado no repositório ficou marcado.

## Sprint Goal

> Ao fim da Sprint 1, um briefing preenchido na tela gera variações reais de texto nos três formatos, usando o histórico sintético, publicado na Vercel.

**Atingido?** Sim. Na URL da Vercel um briefing gera variações com o Gemini, com o manual de marca sintético nos três formatos e com as combinações do ranking no contexto, todas marcadas como sintéticas. A parte do Supabase do item #1 saiu do escopo (ver abaixo).

## O que foi entregue

Só entram os itens que cumprem a [Definition of Done](../definition-of-done.md): critérios de aceitação verificados e issue fechada com a evidência.

| Issue | Item | Demonstrado por | Aceito pelo PO? |
|---|---|---|---|
| #1 | Ambiente do projeto (repositório, Vercel, `.env.example`) | João Batista | Sim, com o banco e o Groq fora do escopo |
| #2 | Contratos de dados e adaptador com mock | João Batista | Sim; a troca mock → CSV foi provada no PR #86 |
| #3 | Gerar variações a partir de um briefing | João Batista | Sim; testado em produção, com modelos de reserva (PR #88) |
| #4 | Peças nos três formatos com o manual de marca | João Batista | Sim, com o critério da fonte ajustado para "fonte e data registradas" |
| #5 | Memória de campanhas com ranking | João Batista | Sim |

Também entraram nesta janela, de itens da Sprint 2: #6 Bula, #10 Roteiros, #13 Guia de dados reais, #15 Responsividade e #37 Música liberada (fechados em 22/10).

## O que não foi entregue

| Issue | Item | Motivo | Destino |
|---|---|---|---|
| #18 | Projeto Supabase e primeira migration | Decisão de 22/10: a demonstração usa dados de teste atrás do `CampaignDataSource` | Descartado da entrega; próxima fase do produto |
| #19 | Chaves do Groq e OpenRouter | O modelo em uso é só o Gemini | Descartado |

## Feedback recebido

- **De quem:** [time, professor, mentoria] · **Feedback:** [a preencher] · **Ação:** [a preencher]

## Mudanças no Product Backlog

- Critérios do #1 e do #14 passaram de "Supabase ativo" para "dados de teste atrás do adaptador" (22/10).
- Critério do #4 ajustado para "fonte e data registradas" (22/10).
- Criadas as 10 issues de entrega individual, #74 a #83 (H1 a H5 e I1 a I5); H1 saiu do escopo.

## Uso de IA nesta sprint

- O motor gera texto com o Gemini; o código foi escrito com apoio de IA e revisado pelo João Batista, com testes automatizados (86 na data desta Review).
- O pacote de backend do Hector foi gerado com IA e escrito para outro contrato de dados; só a fonte CSV foi aproveitada, adaptada e testada (PR #86). O restante foi descartado por duplicar o que o repositório já tinha.
