# Sprint Retrospective: Sprint 1

**Data:** 22/10/2026 · **Duração:** até 15 minutos · **Facilitação:** Scrum Master · **Presentes:** [a preencher pelo time]

> **Rascunho** do Product Owner com base em fatos do repositório. O time acrescenta o que sentiu e aceita ou rejeita as ações.

## Ações da retrospectiva anterior

Primeira retrospectiva: não há ações anteriores.

## O que funcionou

- **Contratos antes do código.** Os tipos do briefing, da saída do motor e o `CampaignDataSource` ficaram prontos no começo. Por isso a troca de mock para CSV (PR #86) não mexeu em tela nem no motor.
- **Um PR por mudança, com testes.** Cada merge na `main` publicou sozinho na Vercel. A suíte passou de 49 para 86 testes sem quebrar.
- **Critério de aceitação verificável.** Fechar as issues com a evidência (teste, produção ou PR) mostrou quais critérios não estavam cumpridos de fato, como a governança dos roteiros (PR #89).
- **Plano B para a IA.** O motor tem modelos de reserva e moldes fixos, então o Gemini em 503 não derruba a demonstração.

## O que atrapalhou

- **Disponibilidades diferentes no começo.** Os integrantes conciliaram o hackathon com compromissos pessoais. Até 15/10, o Product Owner tomou a frente e adiantou a maior parte do código, e as outras entregas chegaram em 22/10.
- **Contrato alinhado tarde.** O backend preparado para a parte de dados foi escrito para outro contrato, e só uma parte dele pôde ser aproveitada. Alinhar o contrato (`lib/data/types.ts`) antes de codar teria poupado retrabalho.
- **Premissas de stack nunca revistas.** O Supabase e o Groq estavam no plano desde o início e só foram retirados em 22/10, depois de a demonstração funcionar sem eles.
- **Convites ao repositório atrasaram.** Um dos convites levou uma semana para ser aceito.

## O que vamos tentar

| Ação | Responsável | Como saber se funcionou |
|---|---|---|
| Cada entrega começa com um PR aberto em rascunho no primeiro dia | Cada Developer | Todo item da Sprint 2 tem PR aberto até 23/10 |
| Daily no grupo até as 10h, com "o que fiz / o que vou fazer / o que me trava" | Scrum Master | Uma mensagem por pessoa por dia, até 25/10 |
| Quem entrega algo escrito fora do repositório confere antes com o contrato e os testes | Cada Developer | `npm test` e `npx tsc --noEmit` verdes no PR |

## Mudanças no acordo de trabalho ou na DoD

- Proposta: a Definition of Done passa a incluir "issue fechada com a evidência (teste, PR ou produção)". Aceite dos três: [pendente].
