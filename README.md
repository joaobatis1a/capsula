# Cápsula

**Estúdio criativo com memória para o marketing** · Next.js · TypeScript · Supabase

[![Status](https://img.shields.io/badge/status-em_desenvolvimento-FF5A1F?style=flat-square)](#status-atual)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![Groq](https://img.shields.io/badge/Groq-F55036?style=flat-square)](https://groq.com)

*Criatividade na dose certa.* A Cápsula transforma um briefing de campanha em variações de peças prontas para revisão: consulta o histórico do que funcionou e do que falhou, lê o que está em alta no TikTok e no Instagram e entrega cada peça com a sua **Bula**, que explica de onde veio cada escolha.

> Projeto do Hackathon Avanade, construído em equipe de três pessoas. **Entrega: 26/10/2026.**
> Repositório privado: o enunciado do desafio é confidencial. Não publique trechos dele nem identifique a empresa cliente fora do time.

## Sobre o projeto

O marketing de uma grande rede de farmácias precisa de cada vez mais peças: uma única oferta vira feed, story e banner, para vários públicos. A demanda cresce mais rápido que o time, e há dois custos escondidos: o que funcionou na campanha passada fica na cabeça de alguém, e toda peça precisa de revisão, porque publicidade de farmácia tem regra.

A Cápsula fecha esse ciclo:

1. **Briefing**: a pessoa descreve produto, oferta, público, canal e objetivo.
2. **Memória**: o sistema busca no histórico as combinações de gancho, formato e tom que funcionaram (e as que falharam).
3. **Radar**: junta as tendências em alta e as datas sazonais, sempre com fonte e data.
4. **Geração**: o modelo de linguagem escreve as variações em cima dessas evidências (RAG sobre dados estruturados).
5. **Governança**: o checklist automático barra o que não pode sair, e uma pessoa aprova.
6. **Aprendizado**: o resultado da campanha volta para a memória e orienta a próxima.

O nome tem três sentidos: cápsula de remédio (o cliente é uma farmácia), cápsula do tempo (o histórico) e cápsula de conteúdo (o vídeo curto que viraliza). A metade anil da marca é a memória, e a metade brasa é a tendência.

## Funcionalidades (planejadas)

- Estúdio de briefing com geração de variações em três formatos: feed (1:1), story (9:16) e banner (16:9)
- Galeria de variações com templates da marca (HTML/CSS convertido em imagem), sem imagem inventada por IA
- **Bula** em cada peça: indicação, composição (dose de memória × tendência), evidências com origem, contraindicações e posologia
- **Radar de tendências** do TikTok Creative Center e da Biblioteca de Anúncios da Meta, mais datas sazonais (São João, Natal…)
- Roteiros de Reels e TikTok cena a cena, com o gancho dos 3 primeiros segundos, e roteiros de comercial de 15 e 30 segundos
- Governança com estados Rascunho → Em revisão → Aprovado → Publicado e bloqueio com motivo
- Memória de campanhas com métricas e painel de ganho (tempo por peça, variações por briefing, peças barradas)
- Adaptador de dados (`CampaignDataSource`): hoje lê dados sintéticos; depois lê CSV ou API sem mudar o resto do sistema

## Status atual

O planejamento está pronto: escopo, guias individuais, manual do colaborador, design system e pitch. O código ainda não começou. Este repositório está na fase de estrutura inicial e vai receber o scaffold do Next.js quando o time entrar.

## Scrum Team

| Pessoa | Responsabilidade no Scrum | Frente como Developer | GitHub |
|---|---|---|---|
| João Batista | **Product Owner** | Frontend: Estúdio, galeria, Memória, aprovação, painel de ganho e pitch | [@joaobatis1a](https://github.com/joaobatis1a) |
| Hector | **Scrum Master** | Backend de dados: Supabase, adaptador de dados, Radar e governança | — |
| Ivaldo | Developer | Motor criativo, templates e rotas de API (back e front) | — |

Num time de três, os três são Developers. PO e Scrum Master acumulam essas responsabilidades com a sua frente técnica.

### Responsabilidades

- **Product Owner (João Batista):** mantém e ordena o Product Backlog, escreve os critérios de aceitação com o time, aceita ou recusa os itens na Sprint Review e responde pelo valor do produto diante da banca, inclusive no pitch.
- **Scrum Master (Hector):** facilita Planning, Review e Retrospective, acompanha a daily, remove impedimentos e garante que o acordo de trabalho e a Definition of Done sejam seguidos.
- **Developers (os três):** definem como o trabalho é feito, quebram os itens em tasks, estimam e entregam incrementos que cumprem a Definition of Done.

### Acordo de trabalho

- **Daily assíncrona no grupo do WhatsApp**, todo dia até as 10h: o que fiz, o que vou fazer e o que me bloqueia. Bloqueio é marcado como **[BLOQUEIO]** e o Scrum Master responde no mesmo dia.
- **Decisão só vale no grupo do time.** Decisão por mensagem privada não conta.
- **Cada task tem um dono só** e fica no quadro do GitHub Projects com status atualizado.
- **Ninguém commita direto na `main`.** Tudo entra por Pull Request revisado, no padrão descrito em [Fluxo de trabalho](#fluxo-de-trabalho-git).
- **Revisão de PR no mesmo dia** em que ele é aberto, seguindo o rodízio João → Ivaldo → Hector → João.
- **Travou por mais de 2 horas?** Avise no grupo em vez de esperar a daily seguinte.
- **Confidencialidade:** nada do enunciado, nem o nome da empresa cliente, sai do time. Nenhum dado real entra no repositório e nenhuma chave entra em commit.
- **Mudança neste acordo** é proposta na Retrospective e só vale com o aceite dos três.

## Stack

Tudo em planos gratuitos:

- **[Next.js](https://nextjs.org)** (App Router) + **TypeScript**: front e rotas de API num único projeto
- **[Supabase](https://supabase.com)**: Postgres compartilhado pelo time
- **[Groq](https://groq.com)**: modelo de linguagem aberto na camada gratuita, com o [OpenRouter](https://openrouter.ai) de reserva
- **[Vercel](https://vercel.com)**: deploy conectado ao repositório, com preview a cada PR

## Estrutura de pastas

```
docs/           # atividades e entregas das aulas do hackathon
```

A estrutura do código (`app/`, `lib/`, `supabase/`) entra junto com o scaffold do Next.js.

## Como rodar localmente

Disponível depois do scaffold. O fluxo previsto é:

```bash
git clone https://github.com/joaobatis1a/capsula.git
cd capsula
npm install
cp .env.example .env.local   # chaves do Supabase e do Groq
npm run dev
```

Chaves ficam só no `.env.local`, que nunca entra em commit.

## Fluxo de trabalho (Git)

**Ninguém commita direto na `main`.** Toda tarefa nasce numa branch própria e entra por Pull Request revisado.

- **Branches:** `tipo/tarefa-descricao`, por exemplo `feat/1.4-galeria-variacoes` ou `fix/2.1-bula-evidencias`
- **Commits:** `tipo(escopo): descrição`, por exemplo `feat(galeria): gera variações nos três formatos`
- **Tipos:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- **Revisão:** rodízio João → Ivaldo → Hector → João; merge com **Squash and merge**
O passo a passo completo (primeiro acesso, branches, commits, PRs e problemas comuns) está no Manual do Colaborador, nos documentos de planejamento do time.

## Documentação do projeto

- [`docs/`](docs/) — atividades das aulas do hackathon
- Escopo geral, guias individuais, manual do colaborador, design system e pitch — fora deste repositório, nos documentos de planejamento do time

## Uso de IA generativa

Registro exigido pelo workshop de Scrum (Sprint 0). Ferramenta usada: **Claude (Anthropic)**, no claude.ai e no Claude Code.

| Missão | Em que a IA ajudou | O que foi corrigido ou rejeitado pelo time |
|---|---|---|
| 1. Organização do Scrum Team | Explicou as responsabilidades do Scrum, propôs a divisão PO/SM e redigiu o acordo de trabalho a partir do manual do colaborador | O time escolheu PO, SM e canal da daily. A IA sugeriu acumular PO e SM numa pessoa só como opção, e a ideia foi rejeitada para separar valor de processo |
| 2. Visão do Produto e Product Goal | Redigiu a visão e o Product Goal a partir do escopo do projeto e separou fatos, hipóteses, dúvidas e riscos | Pendente de validação do time |

## Dados e confidencialidade

- Nenhum dado real da empresa cliente é usado: tudo é público ou sintético, com a origem marcada.
- Dados sintéticos são gerados por script e identificados como tal na interface ("nos dados de teste").
- O repositório é privado e de uso restrito ao time durante o hackathon.
