# Pitch da Cápsula: roteiro de falas, gravações e cobertura da rubrica

Última atualização: 22/10/2026. Slides: https://claude.ai/artifact/Rq8MbmpRLwmiz9FdGx9nem (as notas de cada slide trazem a mesma fala).

## Em resumo

- **Duração:** 482 palavras de fala. Em ritmo normal (150 palavras por minuto) são **3,2 min**; em ritmo calmo (130) são **3,7 min**. Com as pausas entre slides, fica em 3:27 no ritmo normal (1:32 de margem) e 3:57 num ritmo bem calmo (1:02 de margem). Ensaie no ritmo normal.
- **10 slides.** Dois deles (5 e 6) são **gravações de tela do sistema** com a fala por cima; os outros oito são slides.
- **Fechamento:** QR code para https://capsula-mvp.vercel.app, para a banca testar na hora.
- **Honestidade:** os dados são de teste, a marca é fictícia e as contas de impacto e margem usam premissas declaradas. Isso está dito nos slides e nas notas.

## Linha do tempo

| # | Slide | Tempo | Formato | Palavras |
|---|---|---|---|---|
| 1 | Capa | 0:00 a 0:11 | Slide | 26 |
| 2 | O problema | 0:11 a 0:35 | Slide | 56 |
| 3 | A proposta | 0:35 a 1:02 | Slide | 63 |
| 4 | O diferencial | 1:02 a 1:26 | Slide | 57 |
| 5 | Já funciona | 1:26 a 1:43 | GRAVAÇÃO DE TELA 1 | 38 |
| 6 | Bula e governança | 1:43 a 2:02 | GRAVAÇÃO DE TELA 2 | 44 |
| 7 | Impacto esperado | 2:02 a 2:29 | Slide | 63 |
| 8 | Margem de lucro | 2:29 a 2:50 | Slide | 49 |
| 9 | Viabilidade | 2:50 a 3:17 | Slide | 64 |
| 10 | Fechamento | 3:17 a 3:27 | Slide | 22 |

Os tempos são para ritmo normal de fala. No ritmo calmo, cada bloco cresce cerca de 15%, e ainda cabe nos 5 minutos.

## O que é slide e o que é gravação do sistema

| Trecho | No vídeo aparece | Quando fica o slide |
|---|---|---|
| Slides 1 a 4 | Slide | sempre |
| **Slide 5, "Já funciona"** | **Gravação de tela 1** (24 s) | o slide é a reserva se a gravação falhar |
| **Slide 6, "Bula e governança"** | **Gravação de tela 2** (23 s) | o slide é a reserva se a gravação falhar |
| Slides 7 a 10 | Slide | sempre; no 10 o QR code fica na tela até o fim |

A fala nas gravações é a mesma do slide, dita por cima da tela em movimento. Os slides 5 e 6 trazem capturas reais do sistema em produção, então também funcionam sozinhos.

### Gravação de tela 1 (24 s, slide 5)

| Tempo | O que mostrar |
|---|---|
| 0:00 | Estúdio aberto em capsula-mvp.vercel.app; clique em "Preencher exemplo" |
| 0:05 | Cursor em Preço normal (79,90) e Preço da oferta (55,90): o campo Desconto mostra 30%, "economiza R$ 24,00" |
| 0:11 | Clique em "Gerar variações" (a tela de dosagem aparece por 2 s) |
| 0:15 | A galeria com 12 peças; rolar devagar mostrando feed, story e banner |

### Gravação de tela 2 (23 s, slide 6)

| Tempo | O que mostrar |
|---|---|
| 0:00 | Na galeria do protetor solar, clique em "Ver bula" na primeira peça |
| 0:05 | Rolar até "Evidências": uma etiqueta Memória e uma Sazonalidade, cada uma com origem e data |
| 0:11 | Fechar e abrir uma peça do briefing do antibiótico (tipo "Medicamento com prescrição"), marcada "Bloqueado" |
| 0:15 | Rolar até "Contraindicações": a caixa vermelha "Medicamento com prescrição não pode ter propaganda para o público em geral (RDC 96/2008)" |
| 0:20 | Voltar ao topo: o cartão de Aprovação diz "Bloqueada pelo checklist. Uma peça bloqueada não avança" |

### Antes de gravar

- Gere os dois briefings (protetor solar e antibiótico) **antes**, fora do take. Assim a gravação não gasta cota do Gemini nem espera resposta.
- Confirme que a peça não diz "Molde fixo" na bula e que o canto do site mostra "IA: Gemini". Se disser molde fixo, refaça a geração (o Gemini às vezes falha; o sistema avisa).
- Grave em 1920×1080, com o zoom do navegador em 125% a 150%, para a letra ficar legível no vídeo.
- Use uma janela limpa, sem outras abas, sem dados pessoais, e só dados de teste.
- A voz pode ser gravada depois e colocada por cima, para a fala não atropelar o cursor.

## Fala de cada slide

### 1. Capa (0:00 a 0:11)

> Boa tarde! Eu sou o João Batista e, com o Ivaldo e o Hector, apresento a Cápsula: criatividade na dose certa para o marketing de farmácias.

*Direção:* Sorria, olhe para a câmera e fale devagar.

Se perguntarem o que é "dose": é quanto de cada peça vem da memória do que funcionou e quanto vem da tendência do momento. Aparece no slide 4.

### 2. O problema (0:11 a 0:35)

> Pense no time de marketing de uma rede de farmácias, uma das cerca de noventa mil do Brasil. Chega uma oferta de protetor solar: três formatos, três públicos, nove peças. Amanhã vem outra. Hoje isso é feito com planilhas, agência e geradores genéricos, como o ChatGPT, que esquecem o que funcionou e não conhecem as regras.

*Direção:* Aponte para a conta 1 × 3 × 3 = 9 enquanto fala.

Fonte do número: cerca de 90 mil estabelecimentos segundo o Conselho Federal de Farmácia, citado pelo InfoMoney; a Abrafarma informou 93,7 mil em 2024.

### 3. A proposta (0:35 a 1:02)

> A nossa proposta é a Cápsula, um aplicativo web para analistas de marketing, designers e gestores de marca. O usuário abre o app, informa produto, preços e públicos, e clica em gerar. A Cápsula consulta a memória de campanhas, o radar de tendências e o calendário de saúde, e o usuário recebe as peças, cada uma com a sua bula. Uma pessoa aprova.

*Direção:* Percorra os cinco passos da esquerda para a direita. Os cartões escuros são decisões que continuam com a pessoa (briefing e aprovação); os claros são o que a Cápsula faz.

Se perguntarem se é RAG: sim. Antes de gerar, a Cápsula busca no histórico, no radar e no calendário e coloca essas evidências no pedido ao modelo. Os dados já são tabelas, por isso não usamos grafo.

### 4. O diferencial (1:02 a 1:26)

> São três diferenciais em relação a um gerador genérico. Memória: a IA lê as campanhas que funcionaram antes de escrever, a técnica chamada RAG. Regra: bloqueia cura, promessa e remédio com receita. Transparência: toda afirmação mostra a fonte. Cada peça tem a sua dose de memória e de tendência. Usamos o Gemini, com três fontes de dados.

*Direção:* Este é o slide para a banca lembrar. Faça uma pausa curta depois de "a dose".

Os 55% e 45% são o exemplo real da peça da próxima tela; no sistema, a dose vem do motor. O histórico de 300 campanhas é sintético (dados de teste).

### 5. Já funciona (1:26 a 1:43)

**GRAVAÇÃO DE TELA 1.** O slide inteiro é trocado pela gravação do sistema.

> E já funciona. O usuário informa os preços e o desconto aparece sozinho: trinta por cento. Um clique, e saem doze peças em cerca de doze segundos. Já testamos dez briefings e temos noventa e seis testes automáticos.

Os números: mediana de 12,4 s em 10 briefings de teste (um caso passou de 55 s antes de limitarmos o tempo da geração, já corrigido). Testes: 96 no repositório em 22/10. As peças usam o manual de uma marca fictícia, "Farmácia Exemplo"; nenhuma imagem é gerada por IA.

### 6. Bula e governança (1:43 a 2:02)

**GRAVAÇÃO DE TELA 2.** O slide inteiro é trocado pela gravação do sistema.

> Cada peça tem a sua bula, com origem e data. E aqui está o ponto sensível: um antibiótico, que só se vende com receita, é bloqueado na hora, com o motivo, a RDC noventa e seis. A IA nunca aprova sozinha: só uma pessoa.

O checklist é mínimo e inspirado na RDC 96/2008 da Anvisa e no código do CONAR; não é parecer jurídico. A gravação mostra o site em produção, com dados de teste.

### 7. Impacto esperado (2:02 a 2:29)

> O impacto: o time de marketing passa de quarenta minutos por peça, premissa nossa, para três de revisão: noventa por cento menos tempo. Ganham o gestor, com menos risco, e o público, com comunicação responsável. A meta do piloto é reduzir noventa por cento do tempo, medido no painel de ganho. E dá para escalar: outras redes, outros setores regulados e outros canais.

*Direção:* Fale "premissa" com clareza: a banca valoriza a estimativa honesta.

A conta: o painel de ganho usa 40 minutos por peça hoje (premissa do time, a confirmar com a empresa) e 3 minutos de revisão por variação; a geração medida soma cerca de 12 segundos por briefing. (40 − 3,2) ÷ 40 = 92%. Os 40 minutos NÃO são dado da empresa. Antes da banca, se a organização informar o tempo real, troque o número.

### 8. Margem de lucro (2:29 a 2:50)

> Sobre a margem: cada peça poupa cerca de dezoito reais e meio de trabalho e custa cerca de um centavo de IA. Com uma assinatura de dez por cento do valor poupado, a margem bruta fica perto de noventa e nove por cento. São estimativas, que o piloto valida.

*Direção:* Fale devagar e deixe claro que são estimativas com premissas declaradas.

Como as contas foram feitas (para responder à banca):
- Tempo poupado: 40 min hoje menos cerca de 3 min de revisão = 37 min por peça (premissa do painel de ganho, não dado da empresa).
- Valor da hora: R$ 30 é premissa NOSSA, conservadora, para validar. 37 min x R$ 30 ÷ 60 = R$ 18,50.
- Custo de IA: o pedido ao modelo tem cerca de 6.300 caracteres (cerca de 1.800 tokens) e a resposta de 6 peças e 1 roteiro cerca de 800 tokens, mais raciocínio. Com preço de lista de terceiros do Gemini 3.5 Flash-Lite (US$ 0,30 por milhão de tokens de entrada, US$ 2,50 de saída, a confirmar na página oficial do Google), no pior caso são cerca de US$ 0,0075 por chamada, ou cerca de US$ 0,001 por peça: arredondado para R$ 0,01.
- Preço hipotético: 10% de R$ 18,50 = R$ 1,85. Custo de IA / receita = 0,5%, então margem bruta cerca de 99%.
- Custos fixos (hospedagem, banco, equipe) ficam fora desta conta.

### 9. Viabilidade (2:50 a 3:17)

> É viável hoje. O fluxo vai do briefing à aprovação e roda em Next.js, TypeScript e Gemini, na Vercel. Os dados de teste ficam atrás de um adaptador que troca por CSV da empresa, e o radar usa fontes públicas, como o TikTok Creative Center. Riscos: dados de teste, cota gratuita da IA e regras ainda mínimas. Próximos passos: dados reais e revisão jurídica.

*Direção:* Aponte a faixa de cima da esquerda para a direita e depois leia as três colunas.

Detalhes se perguntarem:
- Histórico: 300 campanhas sintéticas hoje; a fonte CSV com mapping.yaml está implementada e testada (a empresa só troca o arquivo e o mapeamento).
- Radar: os itens atuais são exemplos marcados como "dados de teste"; a coleta real é manual, em fontes públicas, nunca raspando aplicativos.
- Ano da saúde: 33 condições, faixas aproximadas, 5 conferidas com fonte pública e 28 ainda não verificadas.
- Gemini: modelo principal gemini-3.5-flash-lite, com reservas e, por último, moldes fixos, sempre com aviso na tela.
- Banco (Supabase): ficou fora desta entrega; hoje a aprovação vive no navegador.

### 10. Fechamento (3:17 a 3:27)

> Obrigado! A Cápsula une memória, regra e aprovação humana. Aponte a câmera para o QR code e teste agora. Ficamos à disposição!

*Direção:* Termine com a câmera, sem pressa, e deixe o QR code na tela por alguns segundos.

Aviso para o ensaio: o site usa o plano gratuito do Gemini, que tem cota curta. Se muita gente testar ao mesmo tempo, algumas gerações saem dos moldes fixos, e a tela avisa. O site continua funcionando. Teste o QR code com o celular antes da gravação.

Tempo total das falas: cerca de 480 palavras: 3:27 em ritmo normal, com as pausas entre slides (1:32 de margem nos 5 minutos), e 3:57 em ritmo bem calmo (1:02 de margem). Ensaie no ritmo normal.

## Cobertura da rubrica (25 critérios)

Conferido contra os slides **e** contra a fala. O que a banca avalia é o que é dito, então cada critério tem uma frase falada.

### CLAREZA

| Critério | Slide | Onde está na fala |
|---|---|---|
| 1. Problema com contexto concreto (quem é afetado e em que situação) | 2 | "o time de marketing de uma rede de farmácias... chega uma oferta de protetor solar: três formatos, três públicos, nove peças" |
| 2. Solução nomeada e descrita | 1, 3 | "a Cápsula, um aplicativo web" |
| 3. O que a solução faz | 3 | "consulta a memória de campanhas, o radar de tendências e o calendário de saúde, e o usuário recebe as peças, cada uma com a sua bula" |
| 4. Público-alvo citado | 2, 3 | "analistas de marketing, designers e gestores de marca" |
| 5. Exemplo ou cenário concreto | 2, 3, 5 | "oferta de protetor solar... nove peças"; "o desconto aparece sozinho: trinta por cento" |

### INOVAÇÃO

| Critério | Slide | Onde está na fala |
|---|---|---|
| 1. Solução existente ou forma atual citada | 2, 4 | "planilhas, agência e geradores genéricos, como o ChatGPT, que esquecem o que funcionou e não conhecem as regras" |
| 2. Diferencial afirmado | 4 | "São três diferenciais em relação a um gerador genérico. Memória... Regra... Transparência" |
| 3. Funcionalidade além do básico | 4, 6 | "cada peça tem a sua dose de memória e de tendência"; a bula; o bloqueio de "cura, promessa e remédio com receita" |
| 4. Tecnologia avançada | 4 | "a IA lê as campanhas que funcionaram antes de escrever, a técnica chamada RAG... Usamos o Gemini" |
| 5. Duas ou mais fontes combinadas | 3, 4 | "a memória de campanhas, o radar de tendências e o calendário de saúde"; "três fontes de dados" |

### IMPACTO

| Critério | Slide | Onde está na fala |
|---|---|---|
| 1. Beneficiados identificados | 7 | "o time de marketing... o gestor... o público" |
| 2. Benefício concreto | 7 | "de quarenta minutos por peça... para três de revisão: noventa por cento menos tempo" |
| 3. Número sobre o problema ou o público | 2, 7 | "cerca de noventa mil" farmácias; "nove peças"; "quarenta minutos por peça" |
| 4. Meta ou métrica mensurável | 7 | "A meta do piloto é reduzir noventa por cento do tempo, medido no painel de ganho" |
| 5. Escala ou expansão | 7, 10 | "outras redes, outros setores regulados e outros canais" |

### VIABILIDADE

| Critério | Slide | Onde está na fala |
|---|---|---|
| 1. Tecnologia nomeada | 9 | "Next.js, TypeScript e Gemini, na Vercel" |
| 2. Como funciona tecnicamente | 3, 9 | "o fluxo vai do briefing à aprovação" |
| 3. Fonte dos dados ou integrações | 9 | "um adaptador que troca por CSV da empresa"; "o radar usa fontes públicas, como o TikTok Creative Center" |
| 4. Protótipo, MVP, teste ou resultado | 5, 6, 9 | "E já funciona"; "doze peças em cerca de doze segundos"; "dez briefings" e "noventa e seis testes" |
| 5. Riscos, limitações, custos, próximos passos ou modelo de negócio | 8, 9, 10 | "Riscos: dados de teste, cota gratuita da IA e regras ainda mínimas. Próximos passos: dados reais e revisão jurídica"; "uma assinatura de dez por cento do valor poupado" |

### COMUNICAÇÃO

| Critério | Slide | Onde está na fala |
|---|---|---|
| 1. Abertura antes do conteúdo | 1 | "Boa tarde! Eu sou o João Batista e, com o Ivaldo e o Hector, apresento a Cápsula" |
| 2. Problema antes da solução | 2 antes de 3 | a ordem dos slides: problema no 2, proposta no 3; a capa só traz o nome |
| 3. Encerramento explícito | 10 | "Obrigado!... Aponte a câmera para o QR code e teste agora. Ficamos à disposição!" |
| 4. Nome da solução e da equipe | 1, 10 | "Cápsula"; "João Batista, Ivaldo e Hector" |
| 5. Passo a passo de uso | 3, 5 | "O usuário abre o app, informa produto, preços e públicos, e clica em gerar... e o usuário recebe as peças" |

**Resultado: os 25 critérios aparecem na fala e nos slides.**

### Pontos extras pedidos

| Pedido | Como foi atendido |
|---|---|
| Margem de lucro | Slide 8 e fala: ≈ R$ 18,50 poupados por peça menos ≈ R$ 0,01 de IA; assinatura de 10% do valor poupado dá margem bruta de ≈ 99%, antes dos custos fixos. Premissas declaradas |
| Cores que incentivam a compra | Laranja e amarelo de etiqueta de oferta sobre o anil da marca, com fundo creme; sem nome nem marca da empresa |
| No máximo 5 minutos, com margem | 10 slides, cerca de 3:27 em ritmo normal e 3:57 em ritmo calmo |
| QR code final | Slide 10, para https://capsula-mvp.vercel.app, com a URL escrita embaixo |
| Problema, proposta, impacto, o que foi construído e viabilidade | Slides 2, 3, 7, 5 e 6, 9 |

## Premissas que precisam de confirmação antes de apresentar

- **40 minutos por peça hoje** e **3 minutos de revisão**: premissas do painel de ganho, não dado da empresa. Se a organização informar o tempo real, troque o número no slide 7 e na fala.
- **R$ 30 por hora**: premissa nossa, conservadora.
- **US$ 0,001 de IA por peça**: estimativa com preço de lista de terceiros do Gemini 3.5 Flash-Lite (US$ 0,30 por milhão de tokens de entrada e US$ 2,50 de saída), a confirmar na página oficial do Google.
- **Cerca de 90 mil farmácias**: Conselho Federal de Farmácia, citado pelo InfoMoney; a Abrafarma informou 93,7 mil em 2024.
- **Dados de teste**: 300 campanhas sintéticas, marca fictícia "Farmácia Exemplo", radar de exemplo, 5 de 33 condições de saúde conferidas.

## Perguntas prováveis, com resposta curta

| Pergunta | Resposta |
|---|---|
| É RAG? | Sim. Antes de gerar, busca no histórico, no radar e no calendário e coloca as evidências no pedido ao modelo. Os dados já são tabelas, então não usamos grafo |
| E se o Gemini errar ou acabar a cota? | O motor tenta de novo, troca para dois modelos de reserva e, por último, usa moldes fixos. A tela sempre avisa qual modo foi usado |
| Os dados são reais? | Não. São 300 campanhas sintéticas e uma marca fictícia. A fonte CSV com mapping.yaml já está pronta: a empresa troca o arquivo, e o sistema não muda |
| O checklist é parecer jurídico? | Não. É um conjunto mínimo, inspirado na RDC 96/2008 da Anvisa e no código do CONAR, e a aprovação final é sempre de uma pessoa |
| De onde vêm os 40 minutos? | É uma premissa nossa, editável no painel de ganho e a confirmar com a empresa. O sistema mede o resto |
| Por que não tem banco de dados? | Escolhemos entregar o fluxo completo com dados de teste atrás de um adaptador. O banco é a próxima fase, para a aprovação persistir entre sessões |
| O radar é real? | Os itens atuais são exemplos marcados como tal. A coleta real é manual, em fontes públicas, sem raspar aplicativos |
| Quanto custa rodar? | Cerca de US$ 0,001 de IA por peça, estimativa com preço de lista; hoje o protótipo roda em planos gratuitos |
