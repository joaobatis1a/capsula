# Pitch da Cápsula: roteiro de falas, animações e cobertura da rubrica

Última atualização: 25/10/2026. Slides: https://claude.ai/artifact/Rq8MbmpRLwmiz9FdGx9nem (as notas de cada slide trazem a mesma fala).

## Em resumo

- **Duração:** 558 palavras de fala. Em ritmo normal (150 palavras por minuto) são **3,7 min**; em ritmo calmo (130) são **4,3 min**. Com as pausas entre slides, fica em 3:58 no ritmo normal (1:02 de margem) e 4:33 num ritmo bem calmo (0:27 de margem). Ensaie no ritmo normal.
- **10 slides.** Dois deles (5 e 6) trazem **animações do sistema em motion**, que repetem em laço enquanto você fala; os MP4 em alta estão em Downloads.
- **Fechamento:** QR code para https://capsula-mvp.vercel.app, para a banca testar na hora.
- **Honestidade:** os dados são de teste, a marca é fictícia e as contas de impacto e margem usam premissas declaradas. Isso está dito nos slides e nas notas.

## Linha do tempo

| # | Slide | Tempo | Formato | Palavras |
|---|---|---|---|---|
| 1 | Capa | 0:00 a 0:12 | Slide | 26 |
| 2 | O problema | 0:12 a 0:35 | Slide | 55 |
| 3 | A proposta | 0:35 a 1:05 | Slide | 71 |
| 4 | O diferencial | 1:05 a 1:40 | Slide | 84 |
| 5 | Já funciona | 1:40 a 1:59 | ANIMAÇÃO DO SISTEMA 1 | 42 |
| 6 | Bula e governança | 1:59 a 2:21 | ANIMAÇÃO DO SISTEMA 2 | 52 |
| 7 | Impacto esperado | 2:21 a 2:51 | Slide | 72 |
| 8 | Margem de lucro | 2:51 a 3:13 | Slide | 50 |
| 9 | Viabilidade | 3:13 a 3:44 | Slide | 73 |
| 10 | Fechamento | 3:44 a 3:58 | Slide | 33 |

Os tempos são para ritmo normal de fala. No ritmo calmo, cada bloco cresce cerca de 15%, e ainda cabe nos 5 minutos.

## As animações dos slides 5 e 6

São animações em motion feitas a partir do fluxo real do app, com dados de teste. Ficam dentro dos slides e repetem em laço; a fala vai por cima, na mesma ordem do que aparece.

### Animação 1 (16 s, slide 5)

| Tempo | O que aparece |
|---|---|
| 0:00 | O formulário de nova campanha; o produto é digitado |
| 0:02 | Preço normal R$ 79,90 e preço da oferta R$ 55,90 |
| 0:04 | O desconto de 30% aparece sozinho |
| 0:05 | Os três públicos são escolhidos e a pessoa clica em gerar |
| 0:09 | As 12 peças surgem em cascata, com os números 12 peças, 3 formatos e 12 s |

### Animação 2 (22 s, slide 6)

| Tempo | O que aparece |
|---|---|
| 0:00 | A peça e a bula dela: memória, tendência, calendário e regras, cada item destacando a parte da peça que explica |
| 0:09 | Um pedido de antibiótico é digitado e bloqueado, com a regra da Anvisa (RDC 96/2008) |
| 0:15 | O fluxo rascunho, em revisão, aprovado por uma pessoa e publicado |
| 0:19 | "Nada vai ao ar sem uma pessoa aprovar." |

Se a banca perguntar: é uma animação do fluxo, não uma captura de tela. O sistema de verdade está no QR code do último slide.

## Fala de cada slide

### 1. Capa (0:00 a 0:12)

> Boa tarde! Eu sou o João Batista e, com o Ivaldo e o Hector, vou apresentar a Cápsula, pensada para o time de marketing da rede.

*Direção:* Sorria, olhe para a câmera e fale devagar.

Se perguntarem o que é "dose": é quanto de cada peça vem da memória do que funcionou e quanto vem da tendência do momento. Aparece no slide 4.

### 2. O problema (0:12 a 0:35)

> Imagine o time de marketing da rede. Chega uma oferta de protetor solar, que precisa sair em três formatos, para três públicos. São nove peças para uma ideia só, e amanhã chega outra. Hoje eles usam planilhas, agência e ferramentas de IA genéricas, que não lembram o que funcionou nem conhecem as regras da farmácia.

*Direção:* Aponte para a conta 1 × 3 × 3 = 9 enquanto fala.

### 3. A proposta (0:35 a 1:05)

> Para esse time, criamos a Cápsula, um aplicativo web para analistas de marketing, designers e gestores de marca. A pessoa abre o app, informa produto, preços e públicos, e clica em gerar. A Cápsula olha o que já funcionou, o que está em alta e a época do ano. E a pessoa recebe as peças, cada uma com uma bula, como a de remédio, que explica de onde veio a ideia.

*Direção:* Percorra os cinco passos da esquerda para a direita. Os cartões escuros são o que continua com a pessoa: pedir e aprovar.

Se perguntarem o que é a bula: é a ficha de cada peça, com para quem ela é, de onde veio cada ideia (campanha, tendência ou época do ano), o que foi checado e onde publicar. O nome brinca com a bula de remédio, porque o cliente é uma farmácia.

### 4. O diferencial (1:05 a 1:40)

> E por que não usar uma IA qualquer? Por três motivos. Primeiro, a Cápsula tem memória: antes de escrever, ela consulta as campanhas que deram certo. Essa técnica se chama RAG. Segundo, ela conhece as regras da Anvisa: não deixa a peça prometer cura, nem anunciar remédio que só se vende com receita. Terceiro, cada peça mostra de onde veio a ideia. E daí vem o nome, criatividade na dose certa: um pouco do que já funcionou, um pouco do que está em alta.

*Direção:* Faça a pergunta do título olhando para a banca, como quem antecipa a dúvida dela. Conte nos dedos: primeiro, segundo, terceiro, apontando para cada cartão. Faça uma pausa curta antes de "e daí vem o nome".

Se perguntarem o que é RAG: antes de pedir o texto ao modelo, a Cápsula busca no histórico de campanhas, no radar de tendências e no calendário de saúde, e manda essas evidências junto com o pedido. O histórico tem 300 campanhas sintéticas (dados de teste).

### 5. Já funciona (1:40 a 1:59)

**ANIMAÇÃO DO SISTEMA 1.** A animação roda dentro do slide enquanto você fala.

> E já está funcionando. A pessoa digita o preço normal e o da oferta, e o desconto de trinta por cento aparece sozinho. Um clique, e em uns doze segundos saem doze peças nos três formatos. Já testamos com dez campanhas diferentes.

Os números: mediana de 12,4 s em 10 briefings de teste (um caso passou de 55 s antes de limitarmos o tempo da geração, já corrigido). Testes: 96 no repositório em 22/10. As peças usam o manual de uma marca fictícia, "Farmácia Exemplo"; nenhuma imagem é gerada por IA.

### 6. Bula e governança (1:59 a 2:21)

**ANIMAÇÃO DO SISTEMA 2.** A animação roda dentro do slide enquanto você fala.

> Esta é a bula de uma peça: ela mostra de onde veio cada ideia. Agora, o mais importante: se alguém tenta anunciar um antibiótico, que só se vende com receita, a Cápsula bloqueia na hora e explica o motivo, a regra da Anvisa. E nada vai ao ar sem uma pessoa aprovar.

O checklist é mínimo e inspirado na RDC 96/2008 da Anvisa e no código do CONAR; não é parecer jurídico. A animação reproduz o fluxo do site em produção, com dados de teste.

### 7. Impacto esperado (2:21 a 2:51)

> E o que muda? Pela nossa estimativa, uma peça que hoje leva uns quarenta minutos passa a pedir uns três de revisão. Ganha o time, com mais tempo para criar, e o gestor, com menos risco. O próximo passo é testar com o time de marketing da rede, com uma meta: gastar noventa por cento menos tempo em cada peça. E, dando certo, dá para levar a outras categorias, regiões e canais.

*Direção:* Diga "pela nossa estimativa" com clareza: a banca valoriza a estimativa honesta.

A conta: 40 minutos por peça hoje é uma estimativa do time, a confirmar com a empresa (não é dado dela). Na Cápsula, cerca de 3 minutos de revisão por peça mais uns 12 segundos de geração. (40 − 3,2) ÷ 40 = 92%; a meta do primeiro teste é comprovar pelo menos 90%. Se a organização informar o tempo real antes da banca, troque o número.

### 8. Margem de lucro (2:51 a 3:13)

> E a conta fecha? Cada peça custa cerca de um centavo de inteligência artificial. Se cobrarmos, por exemplo, um real por peça, numa assinatura por marca, a margem bruta fica em noventa e nove por cento, antes dos custos fixos. O preço de verdade a gente define nesse primeiro teste.

*Direção:* Faça a pergunta do título como a banca faria. Depois, um número por vez: um centavo, um real, noventa e nove por cento. Deixe claro que o um real é só um exemplo.

Como as contas foram feitas (para responder à banca):
- Custo de IA, só a estimativa que temos: o pedido ao modelo tem cerca de 6.300 caracteres (cerca de 1.800 tokens), e a resposta de 6 peças e 1 roteiro cerca de 800 tokens, mais raciocínio. Com preço de lista de terceiros do Gemini 3.5 Flash-Lite (US$ 0,30 por milhão de tokens de entrada e US$ 2,50 de saída, a confirmar na página oficial do Google), no pior caso são cerca de US$ 0,0075 por chamada, ou cerca de US$ 0,001 por peça: arredondado para R$ 0,01.
- Preço: R$ 1,00 por peça é um EXEMPLO para a conta, não uma proposta de preço. O preço real depende do primeiro teste com a empresa.
- Conta: R$ 0,01 de custo de IA ÷ R$ 1,00 de preço = 1%; margem bruta cerca de 99%. Se perguntarem do tempo poupado (40 min para 3 min de revisão), é a premissa do slide 7, não dado da empresa.
- Custos fixos (hospedagem, banco, equipe) ficam fora desta conta.

### 9. Viabilidade (3:13 a 3:44)

> E dá para fazer de verdade? Já está no ar, com Next.js, TypeScript e a IA do Gemini, na Vercel. Funciona em etapas: briefing, busca nos dados, geração, checagem da regra e aprovação. Hoje usa dados de teste, mas a empresa liga os dela por planilha, sem mudar nada, e as tendências vêm de fontes públicas. O que falta são dados reais, um plano pago de IA e uma revisão jurídica das regras.

*Direção:* Aponte a faixa de cima da esquerda para a direita enquanto fala o caminho; depois a coluna de riscos.

Detalhes se perguntarem:
- Histórico: 300 campanhas sintéticas hoje; a fonte CSV com mapping.yaml está implementada e testada (a empresa só troca o arquivo e o mapeamento).
- Radar: os itens atuais são exemplos marcados como "dados de teste"; a coleta real é manual, em fontes públicas, nunca raspando aplicativos.
- Ano da saúde: 33 condições, faixas aproximadas, 5 conferidas com fonte pública e 28 ainda não verificadas.
- Gemini: modelo principal gemini-3.5-flash-lite, com 2 modelos de reserva e, por último, moldes fixos, sempre com aviso na tela.
- Banco (Supabase): ficou fora desta entrega; hoje a aprovação vive no navegador.

### 10. Fechamento (3:44 a 3:58)

> Então, lembra daquela oferta que chega amanhã? Com a Cápsula, ela sai mais rápido, dentro das regras e com uma pessoa decidindo. O QR code está na tela: testem agora mesmo. Muito obrigado!

*Direção:* Termine olhando para a câmera, sem pressa. Faça uma pausa curta depois de "que chega amanhã", como se voltasse ao começo do pitch, e sorria no "muito obrigado". Deixe o QR code na tela por alguns segundos.

Aviso para o ensaio: o site usa o plano gratuito do Gemini, que tem cota curta. Se muita gente testar ao mesmo tempo, algumas gerações saem dos moldes fixos, e a tela avisa. O site continua funcionando. Teste o QR code com o celular antes da gravação.

Tempo total das falas: cerca de 558 palavras: 3:58 em ritmo normal, com as pausas entre slides (1:02 de margem nos 5 minutos), e 4:33 em ritmo bem calmo (0:27 de margem). Ensaie no ritmo normal.

## Cobertura da rubrica (25 critérios)

Conferido contra os slides **e** contra a fala. O que a banca avalia é o que é dito, então cada critério tem uma frase falada.

### CLAREZA

| Critério | Slide | Onde está na fala |
|---|---|---|
| 1. Problema com contexto concreto (quem é afetado e em que situação) | 2 | "Imagine o time de marketing da rede. Chega uma oferta de protetor solar, que precisa sair em três formatos, para três públicos. São nove peças para uma ideia só" |
| 2. Solução nomeada e descrita | 1, 3 | "criamos a Cápsula, um aplicativo web" |
| 3. O que a solução faz | 3 | "A Cápsula olha o que já funcionou, o que está em alta e a época do ano. E a pessoa recebe as peças, cada uma com uma bula" |
| 4. Público-alvo citado | 2, 3 | "para analistas de marketing, designers e gestores de marca" |
| 5. Exemplo ou cenário concreto | 2, 3, 5 | "uma oferta de protetor solar... nove peças"; "o desconto de trinta por cento aparece sozinho" |

### INOVAÇÃO

| Critério | Slide | Onde está na fala |
|---|---|---|
| 1. Solução existente ou forma atual citada | 2, 4 | "Hoje eles usam planilhas, agência e ferramentas de IA genéricas, que não lembram o que funcionou nem conhecem as regras" |
| 2. Diferencial afirmado | 4 | "E por que não usar uma IA qualquer? Por três motivos. Primeiro, a Cápsula tem memória... Segundo, ela conhece as regras da Anvisa... Terceiro, cada peça mostra de onde veio a ideia" |
| 3. Funcionalidade além do básico | 3, 4, 6 | a bula de cada peça; o bloqueio: "não deixa a peça prometer cura, nem anunciar remédio que só se vende com receita"; a dose de cada peça |
| 4. Tecnologia avançada | 4, 9 | "antes de escrever, ela consulta as campanhas que deram certo. Essa técnica se chama RAG"; "a IA do Gemini" |
| 5. Duas ou mais fontes combinadas | 3, 4, 9 | "o que já funcionou, o que está em alta e a época do ano"; "um pouco do que já funcionou, um pouco do que está em alta" |

### IMPACTO

| Critério | Slide | Onde está na fala |
|---|---|---|
| 1. Beneficiados identificados | 7 | "Ganha o time, com mais tempo para criar, e o gestor, com menos risco" |
| 2. Benefício concreto | 7 | "uma peça que hoje leva uns quarenta minutos passa a pedir uns três de revisão" |
| 3. Número sobre o problema ou o público | 2, 7 | "três formatos, para três públicos"; "nove peças"; "quarenta minutos" |
| 4. Meta ou métrica mensurável | 7 | "O próximo passo é testar com o time de marketing da rede, com uma meta: gastar noventa por cento menos tempo em cada peça" |
| 5. Escala ou expansão | 7 | "dando certo, dá para levar a outras categorias, regiões e canais" |

### VIABILIDADE

| Critério | Slide | Onde está na fala |
|---|---|---|
| 1. Tecnologia nomeada | 9 | "com Next.js, TypeScript e a IA do Gemini, na Vercel" |
| 2. Como funciona tecnicamente | 9 | "Funciona em etapas: briefing, busca nos dados, geração, checagem da regra e aprovação" |
| 3. Fonte dos dados ou integrações | 9 | "a empresa liga os dela por planilha, sem mudar nada, e as tendências vêm de fontes públicas" |
| 4. Protótipo, MVP, teste ou resultado | 5, 6, 9 | "E já está funcionando"; "em uns doze segundos saem doze peças"; "Já testamos com dez campanhas diferentes"; "Já está no ar" |
| 5. Riscos, limitações, custos, próximos passos ou modelo de negócio | 8, 9 | "Hoje usa dados de teste... O que falta são dados reais, um plano pago de IA e uma revisão jurídica das regras"; "numa assinatura por marca... a margem bruta fica em noventa e nove por cento" |

### COMUNICAÇÃO

| Critério | Slide | Onde está na fala |
|---|---|---|
| 1. Abertura antes do conteúdo | 1 | "Boa tarde! Eu sou o João Batista e, com o Ivaldo e o Hector, vou apresentar a Cápsula" |
| 2. Problema antes da solução | 2 antes de 3 | a capa só traz o nome e o tema; o problema vem no slide 2 e a proposta no 3 |
| 3. Encerramento explícito | 10 | "O QR code está na tela: testem agora mesmo. Muito obrigado!" |
| 4. Nome da solução e da equipe | 1, 10 | "Cápsula"; "o João Batista e, com o Ivaldo e o Hector" |
| 5. Passo a passo de uso | 3, 5 | "A pessoa abre o app, informa produto, preços e públicos, e clica em gerar... E a pessoa recebe as peças" |

**Resultado: os 25 critérios aparecem na fala e nos slides.**

### Pontos extras pedidos

| Pedido | Como foi atendido |
|---|---|
| Margem de lucro | Slide 8 e fala: o custo de IA é de cerca de R$ 0,01 por peça; com um preço de exemplo de R$ 1,00 por peça a margem bruta é de ≈ 99%, antes dos custos fixos. O preço real fica para o primeiro teste |
| Cores que incentivam a compra | Laranja e amarelo de etiqueta de oferta sobre o anil da marca, com fundo creme; sem nome nem marca da empresa |
| No máximo 5 minutos, com margem | 10 slides, cerca de 3:58 em ritmo normal e 4:33 em ritmo calmo |
| QR code final | Slide 10, para https://capsula-mvp.vercel.app, com a URL escrita embaixo |
| Problema, proposta, impacto, o que foi construído e viabilidade | Slides 2, 3, 7, 5 e 6, 9 |

## Premissas que precisam de confirmação antes de apresentar

- **40 minutos por peça hoje** e **3 minutos de revisão**: premissas do painel de ganho, não dado da empresa. Se a organização informar o tempo real, troque o número no slide 7 e na fala.
- **R$ 1,00 por peça** (slide 8): é um preço de exemplo para a conta da margem, não uma proposta. O preço real depende do primeiro teste.
- **US$ 0,001 de IA por peça**: estimativa com preço de lista de terceiros do Gemini 3.5 Flash-Lite (US$ 0,30 por milhão de tokens de entrada e US$ 2,50 de saída), a confirmar na página oficial do Google.
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
