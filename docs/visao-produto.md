# Visão do Produto e Product Goal

**Produto:** Cápsula, *criatividade na dose certa*
**Product Owner:** João Batista · **Atualizado em:** 14/10/2026 · **Status:** proposta para aprovação do time

## Visão do produto

> Para **o time de marketing de uma grande rede de farmácias**, que precisa produzir cada vez mais peças por campanha sem perder a identidade da marca nem as regras de publicidade do setor, a **Cápsula** é um **estúdio criativo com memória** que transforma um briefing em variações prontas para revisão. **Diferente de um gerador de texto comum**, que não lembra de nada, a Cápsula aprende com o histórico do que funcionou e do que falhou, combina isso com as tendências em alta e entrega cada peça com uma **Bula** que mostra de onde veio cada escolha e quais regras ela já passou.

**Para quem:**
- **Quem cria:** analistas, redatores e designers que precisam de muitas variações por dia.
- **Quem aprova:** gestão de marca e, quando preciso, o jurídico. Essas pessoas precisam ler a Bula rápido e decidir.

**Problema:** a demanda por peças cresce mais rápido que a capacidade do time. Uma oferta vira feed, story e banner para vários públicos. O que funcionou antes fica na cabeça de alguém, e toda peça precisa de revisão.

**Valor entregue:** mais variações por briefing, decisões apoiadas em evidência e menos peças inadequadas chegando à revisão. O fluxo da área não muda: o briefing continua sendo o começo, e a aprovação continua com as mesmas pessoas.

## Product Goal

> **Até 26/10/2026, ter publicado um protótipo funcional da Cápsula em que um briefing gera de 3 a 5 variações por canal nos formatos feed, story e banner, cada uma com Bula e checklist de governança, usando memória de campanhas sintéticas e radar de tendências, demonstrado no pitch de até 5 minutos.**

Como saber que o objetivo foi atingido:
- [ ] Um briefing gera variações nos 3 formatos, de ponta a ponta, no ambiente publicado na Vercel.
- [ ] Toda variação exibe a Bula com dose, evidências com origem e resultado do checklist.
- [ ] Uma peça com promessa de resultado é bloqueada com o motivo visível.
- [ ] Uma peça só chega a "Aprovado" por ação de uma pessoa.
- [ ] O pitch de até 5 minutos e a demonstração gravada são entregues até 26/10.

## Fatos, hipóteses, dúvidas e riscos

| Tipo | Item |
|---|---|
| **Fato** | O desafio é acelerar a criação de peças de marketing com IA sem perder identidade de marca nem governança. |
| **Fato** | O desafio não fornece dados da empresa. Todo dado do MVP é público ou sintético, com a origem marcada. |
| **Fato** | O prazo de submissão é 26/10/2026, a mentoria acontece de 21 a 23/10, e o enunciado é confidencial. |
| **Fato** | O pitch tem até 5 minutos e é eliminatório. |
| **Hipótese** | Hoje um briefing vira cerca de 3 peças (uma por formato). Com a Cápsula, vira até 15, ou 5× mais variações. |
| **Hipótese** | Um histórico de cerca de 300 campanhas sintéticas basta para demonstrar o ranking de combinações. |
| **Hipótese** | A camada gratuita da Groq (cerca de 1.000 requisições por dia) cobre o desenvolvimento e a demonstração. |
| **Dúvida** | Qual é o tempo atual de produção por peça? É preciso confirmar com a empresa na mentoria. |
| **Dúvida** | Que regras de publicidade a empresa já aplica? O checklist do MVP é um conjunto mínimo. |
| **Risco** | Cotas gratuitas mudarem ou acabarem. Mitigação: OpenRouter como reserva e cache das saídas. |
| **Risco** | O Supabase gratuito pausar após 7 dias sem uso. Mitigação: acessar o projeto antes de cada apresentação. |
| **Risco** | O escopo crescer além de 12 dias com 3 pessoas. Mitigação: congelar o escopo em 24/10 e enviar em 25/10. |
| **Risco** | Vazamento de informação confidencial. Mitigação: repositório privado, chaves só no `.env.local` e nada do enunciado fora do time. |

## Fora do escopo desta entrega

Integração com dados reais da empresa, coleta automática de tendências por API, geração de imagem e vídeo por IA, regras de governança validadas pelo jurídico e permissões por papel. Tudo isso está documentado como próxima fase.
