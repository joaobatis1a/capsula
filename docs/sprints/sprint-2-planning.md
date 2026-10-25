# Sprint Planning: Sprint 2

**Sprint:** 21/10 a 25/10/2026 · **Planning em:** 22/10/2026 (adiado do dia 21/10) · **Status:** proposta para aprovação do time
**Quadro:** [Cápsula: Product Backlog](https://github.com/users/joaobatis1a/projects/1), filtro `Sprint: Sprint 2`

> **Rascunho** do Product Owner. A Sprint 2 já está em andamento: o planejamento registra o que já foi feito, o que resta e as decisões de escopo.

## Sprint Goal

> **Até 24/10 (congelamento do escopo), o fluxo briefing → variações → Bula → governança → aprovação → Memória roda de ponta a ponta na URL da Vercel, sem intervenção manual, e o pitch está pronto para 26/10.**

## Sprint Backlog

| Item | Estado em 22/10 | O que falta |
|---|---|---|
| #6 Bula | Fechado | |
| #7 Checklist de governança | Entregue; roteiros também passam pelo checklist (#10) | |
| #8 Aprovação em 4 estados | Entregue | Conferir em tela na produção (I5) |
| #9 Radar | Aberto | Itens reais com fonte e data (H2) |
| #10 Roteiros | Fechado | |
| #11 Tela da Memória | Entregue | Conferir em tela na produção (I5) |
| #12 Painel de ganho | Entregue | Conferir em tela na produção (I5) |
| #13 Dados reais | Fechado | |
| #14 Integração e deploy estável | Aberto | QA em produção (I5), teste visual |
| #15 Responsividade | Fechado | Ver num celular real |
| #16 Pitch e vídeo | Aberto | Slide, roteiro do vídeo, ideias futuras |
| #37 Música liberada | Fechado | |

Entregas individuais com prazo em 22/10: #75 (Radar real), #76 (Ano da saúde), #78 (documentos do Scrum Master), #80 (teste de 10 briefings), #83 (QA em produção). O #74 (Supabase) saiu do escopo.

## Ordem de execução

1. **22 e 23/10:** Radar com fontes reais (#75), conferência do Ano da saúde (#76), QA em produção (#83) e teste do motor (#80).
2. **24/10:** congelamento do escopo; só correções de erro depois disso.
3. **25/10:** versão final publicada e envio; vídeo de demonstração gravado.
4. **26/10:** entrega.

## Como saber que o Sprint Goal foi atingido

- [x] O roteiro de demonstração roda na URL da Vercel do começo ao fim (#14). *Resultado na [Review](sprint-2-review.md) e no [QA em produção](../qa-producao.md).*
- [x] O Radar mostra itens com fonte e data, e os que ainda são exemplo estão marcados ("dados de teste").
- [x] O pitch de 5 minutos e o vídeo estão prontos (#16). *10 slides, falas de 3:58 e duas animações do sistema.*
- [x] Os itens entregues cumprem a [Definition of Done](../definition-of-done.md).

## Premissas e riscos

| Tipo | Item | Resposta |
|---|---|---|
| Premissa | O Supabase fica fora da entrega; a persistência é a próxima fase | Decisão de 22/10; confirmar com Hector e Ivaldo |
| Risco | O Gemini responde 503 ou 429 na hora da banca | Modelos de reserva e moldes fixos (PR #88); gerar uma vez perto do horário para o cache guardar uma resposta com IA; vídeo gravado como plano B |
| Risco | Radar sem itens reais até 24/10 | Os itens de exemplo continuam marcados como tal; o pitch trata o Radar real como próxima fase |
| Risco | Entregas individuais atrasadas | O Product Owner assume o que não chegar até 23/10 e registra a autoria real |
