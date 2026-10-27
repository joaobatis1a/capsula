# Limitações e próximos passos

**Atualizado em:** 26/10/2026 · O que o protótipo ainda não faz, o que falta para virar produto e como medir se valeu a pena.

> Tudo o que está aqui é **fora do escopo da entrega de 26/10**. O protótipo foi congelado em 24/10; depois disso só entraram correções de erro.

## Limitações do protótipo

| Limitação | Hoje | Por que é assim | O que muda na próxima fase |
|---|---|---|---|
| **Dados de campanha** | 300 campanhas sintéticas, com padrões plantados para provar o ranking | O desafio não fornece dados da empresa, e o enunciado é confidencial | A empresa liga o histórico dela por CSV, sem mudar o sistema ([dados-reais.md](dados-reais.md)), e depois por API |
| **Regras de publicidade** | Conjunto mínimo inspirado na RDC 96/2008 da Anvisa e no CONAR | O time não tem como validar regra jurídica | Revisão jurídica das regras e das mensagens de bloqueio; regras novas por categoria |
| **Radar de tendências** | Itens de exemplo com fonte, data e validade, marcados como tal | Coleta automática exige acesso às plataformas | Coleta periódica de fontes públicas (TikTok Creative Center, Biblioteca de Anúncios da Meta, calendário de saúde) |
| **Ano da saúde** | 33 condições; 5 conferidas com fonte pública, 28 aproximadas | Conferir todas exige os boletins oficiais à mão | Conferência das 28 restantes com InfoGripe e boletins do Ministério da Saúde, com recorte por região |
| **Persistência** | Aprovação, histórico e métricas vivem no navegador | Banco tirado do escopo em 22/10, porque não mudava a demonstração | Banco (Supabase/Postgres) para peças, status, histórico e cache compartilhados entre pessoas |
| **Permissões** | Qualquer pessoa aprova informando o nome | Sem login no protótipo | Login e papéis: quem cria, quem revisa, quem aprova e o jurídico |
| **IA** | Gemini na camada gratuita, com reservas e moldes fixos. Quando o modelo principal demora, a geração pode levar cerca de um minuto (o teste do Ivaldo no celular, em 26/10, mostrou isso) | Custo zero no hackathon, e a função da Vercel tem limite de 60 s | Plano pago, com cota estável e o modelo principal respondendo sempre |
| **Imagem das peças** | Templates com a arte da marca; a IA só escreve o texto | Fidelidade à marca e nenhum risco de imagem inventada | Banco de imagens aprovadas da marca, escolhidas pelo contexto |
| **Aprendizado** | A peça publicada aparece na Memória da sessão | Sem banco, o resultado não volta ao ranking | Métricas reais da peça publicada (impressões, cliques, vendas) voltando ao ranking |
| **Dose** | Heurística: peso das evidências de memória sobre o total | O peso de cada evidência é declarado pelo modelo | Calibrar a dose com o resultado real das campanhas |

## Próximos passos

### 1. Primeiro teste com o time de marketing (até 30 dias)

- Ligar o histórico real de campanhas por CSV e conferir o ranking com quem conhece as campanhas.
- Revisão jurídica do checklist.
- Plano pago de IA.
- Rodar com um grupo pequeno do time de marketing em ofertas reais, ainda com aprovação humana em tudo.
- Medir os indicadores abaixo desde o primeiro dia.

### 2. Produto (30 a 90 dias)

- Banco de dados, login e papéis de aprovação.
- Radar com coleta automática e Ano da saúde conferido por região.
- Resultado das peças publicadas voltando à Memória.
- Exportação direta para as ferramentas que o time já usa.

### 3. Escala (depois de 90 dias)

- Outras categorias, regiões e canais da rede.
- Novos formatos (vídeo curto com a arte da marca, e-mail, push do app).

## Como medir se deu certo

| Indicador | Meta do primeiro teste | Como medir |
|---|---|---|
| Tempo por peça | **90% menos** (de cerca de 40 min para cerca de 3 min de revisão) | Painel de ganho, com o tempo real de hoje no lugar da premissa |
| Variações por briefing | De 3 para 12 ou mais | Painel de ganho |
| Peças barradas antes da revisão humana | Toda peça com promessa de cura ou remédio com receita barrada | Checklist e amostragem pelo jurídico |
| Peças aprovadas sem edição | A definir na primeira semana | Histórico de aprovação |
| Resultado das peças | Igual ou melhor que o das peças feitas hoje | Impressões, cliques e vendas das campanhas |

O tempo de hoje (40 minutos por peça) é uma **premissa do time**, declarada e editável no painel de ganho, e não um dado da empresa. O primeiro teste existe também para trocá-la pelo número real.

## Custo e modelo de negócio

Estimativa, para mostrar que a conta fecha. Os números exatos saem do primeiro teste.

| Item | Valor | Como chegamos |
|---|---|---|
| Custo de IA por peça | cerca de **R$ 0,01** | Pedido de cerca de 1.800 tokens e resposta de cerca de 800, a preço de lista de terceiros do Gemini 3.5 Flash-Lite (US$ 0,30 por milhão de tokens de entrada e US$ 2,50 de saída, a confirmar no site do Google): cerca de US$ 0,001 por peça |
| Preço de exemplo | R$ 1,00 por peça, numa assinatura por marca | Exemplo para a conta, não uma proposta |
| Margem bruta | cerca de **99%** | R$ 0,01 de custo ÷ R$ 1,00 de preço, antes dos custos fixos (hospedagem, banco, equipe) |

## Ideias registradas para depois

Surgiram durante o projeto e não foram aprovadas nem estimadas:

- Mais provedores de IA como reserva (Groq e OpenRouter já são suportados pelo cliente, sem chave).
- Checar a descrição da oferta no próprio formulário, antes de gerar, para avisar promessas e diagnósticos mais cedo ([qa-motor.md](qa-motor.md), problema 3).
- Pular a chamada à IA para medicamento com prescrição, que sempre é bloqueado ([qa-motor.md](qa-motor.md), problema 4).
- Variar mais os ganchos e o vocabulário entre produtos ([qa-motor.md](qa-motor.md), problema 5).
- Pontuação da Bula por peça, comparando a previsão com o resultado publicado.
