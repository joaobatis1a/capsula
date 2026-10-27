# Arquitetura

**Atualizado em:** 25/10/2026 · Como a Cápsula é organizada, por que foi feita assim e onde mexer em cada coisa.

Para o fluxo do motor em detalhe, veja [motor.md](motor.md). Para os contratos das rotas, veja [api.md](api.md).

## Visão geral

A Cápsula é **um projeto Next.js só**: as telas (React) e as rotas de API (funções na Vercel) moram no mesmo repositório e dividem os mesmos contratos de dados. Não há banco. Os dados de campanha chegam por um adaptador (`CampaignDataSource`), e a IA é chamada pelo servidor, nunca pelo navegador.

```
┌──────────────────────── Navegador ────────────────────────┐
│  Estúdio (/)        Memória   Radar   Ano da saúde   Ganho │
│  briefing ─┐        (/memoria)(/radar)(/saude)     (/ganho)│
│  galeria ◄─┤                                         ▲     │
│  Bula      │                                  métricas no │
│  aprovação ┼──┐                               localStorage│
└────────────┼──┼────────────────────────────────────────────┘
             │  │
     POST /api/gerar      POST /api/pecas/status     GET /api/memoria/ranking · GET /api/radar
             │  │
┌────────────▼──▼────────────── Servidor (Vercel) ──────────────────────────────────────────┐
│  types/ (Zod)  ── valida o briefing e a peça com o mesmo schema da tela                   │
│                                                                                           │
│  lib/motor ──► cache (memória do servidor) ──► contexto ──► prompt ──► lib/llm ──► Gemini │
│      │                                           ▲                       └─ reservas      │
│      │                                           │                       └─ moldes fixos  │
│      ▼                                  lib/memoria (ranking)                             │
│  montagem: fonte das evidências, dose,  lib/data ─ CampaignDataSource ─┬─ mock (teste)    │
│  ids fora do texto                                                    └─ csv + mapping    │
│      ▼                                                                                    │
│  lib/governanca: checklist (RDC 96/2008, marca) e fluxo de aprovação                      │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

## Módulos

| Pasta | Responsabilidade | Arquivos principais |
|---|---|---|
| `app/` | Páginas e rotas de API (App Router) | `page.tsx` (Estúdio), `memoria/`, `radar/`, `saude/`, `ganho/`, `design-system/`, `api/` |
| `types/` | **Contratos** do briefing e da saída do motor, em Zod. Fonte de verdade para tela e servidor | `briefing.ts`, `variacao.ts` |
| `lib/motor/` | Do briefing às variações: cache, contexto, prompt, chamada à IA, montagem e plano B sem IA | `gerar.ts`, `contexto.ts`, `prompt.ts`, `cache.ts`, `sem-ia.ts`, `texto.ts` |
| `lib/llm/` | Cliente do modelo no formato da API da OpenAI, com troca de modelo e orçamento de tempo | `client.ts` |
| `lib/memoria/` | Ranking das combinações que renderam acima e abaixo da média | `ranking.ts` |
| `lib/governanca/` | Checklist de publicidade e fluxo de aprovação em quatro estados | `checklist.ts`, `fluxo.ts` |
| `lib/data/` | Adaptador de dados e as duas fontes: dados de teste e CSV | `types.ts`, `index.ts`, `mock/`, `csv/` |
| `lib/marca/` | Manual da marca fictícia lido pelos templates, pelo prompt e pelo checklist | `marca.json` |
| `lib/ganho/` | Métricas do painel de ganho e premissas editáveis | `metricas.ts` |
| `lib/oferta.ts` | Leitura de preço em formato brasileiro, cálculo do desconto e texto da oferta | |
| `components/` | Interface: design system (`ds/`), Estúdio, peças, Memória, Ano da saúde, Ganho, movimento | `estudio/Estudio.tsx`, `estudio/Galeria.tsx`, `ds/Bula.tsx`, `pecas/Peca.tsx` |
| `tests/` | 102 testes automatizados (Vitest) | ver [qualidade.md](qualidade.md) |
| `mocks/` | CSV de exemplo, o `mapping.yaml` e o JSON de exemplo do contrato | |

## O caminho de uma geração

1. **Tela.** O Estúdio valida o briefing com `briefingSchema` antes de enviar.
2. **Rota.** `POST /api/gerar` valida de novo (o navegador não é confiável) e calcula a chave do cache: o briefing normalizado, com públicos em qualquer ordem dando a mesma chave.
3. **Cache.** Se o briefing já foi gerado nesta instância do servidor, a resposta volta em menos de 1 s, sem gastar cota.
4. **Contexto.** `montarContexto` pede ao `CampaignDataSource` as campanhas, o Radar e a sazonalidade do mês e dos dois seguintes, e o ranking da Memória filtrado pelos públicos e canais do briefing.
5. **Plano.** Uma chamada ao modelo por público, em paralelo, com 3 variações por canal nos formatos que o canal aceita (até 24 peças).
6. **IA.** O cliente tenta o modelo principal 2 vezes, depois os de reserva. Cada tentativa espera até 20 s; passados 45 s no total, não começa outra, e nenhuma passa de 54 s desde o início da geração, para a função da Vercel (limite de 60 s) não morrer. JSON malformado ganha uma nova tentativa, que divide o mesmo prazo da primeira.
7. **Montagem.** O modelo só cita evidências por **id**. O sistema troca cada id pela fonte real ("9 campanhas · 11/2025 a 09/2026 · nos dados de teste"), descarta ids inventados, calcula a dose e limpa ids que escaparam para o texto. Peça fora do contrato vira molde fixo.
8. **Governança.** O checklist roda em cada peça e em cada roteiro. Regra que falha deixa a peça **Bloqueada**, com o motivo nas contraindicações.
9. **Resposta.** Variações, roteiros, modelo usado e avisos voltam para a tela. Respostas em que algum público caiu nos moldes fixos não entram no cache.

## Decisões técnicas

| Data | Decisão | Por quê | Consequência |
|---|---|---|---|
| 14/10 | Next.js com telas e API num projeto só | Time pequeno e prazo curto: um deploy, um repositório, tipos compartilhados | A API roda como funções da Vercel, com limite de 60 s |
| 15/10 | Contratos em Zod em `types/`, usados no navegador e no servidor | Um erro de campo aparece igual nos dois lados, e a saída da IA é validada antes de chegar à tela | Mudar um campo é mudar um arquivo |
| 15/10 | Dados só pelo adaptador `CampaignDataSource` | Começar com dados de teste sem amarrar o sistema a eles | A fonte CSV entrou depois sem mexer em tela nem no motor ([dados-reais.md](dados-reais.md)) |
| 15/10 | Peças como templates HTML/CSS exportados em PNG, sem imagem gerada por IA | Fidelidade à marca, texto legível e nenhum risco de imagem inventada | A arte é a do template; a IA escreve o texto |
| 15/10 | Marca fictícia "Farmácia Exemplo" | Confidencialidade: não copiar a identidade da empresa cliente | Trocar a marca é trocar `lib/marca/marca.json` |
| 22/10 | A fonte de cada evidência é escrita pelo sistema, não pelo modelo | O modelo pode inventar fontes; o id só aponta para o que existe | Toda evidência na Bula é rastreável |
| 22/10 | Sem banco na entrega (Supabase fora do escopo) | A demonstração funciona com dados de teste atrás do adaptador; o banco não mudaria o que a banca vê | A aprovação vive na sessão do navegador; persistência é a próxima fase |
| 22/10 | Só o Gemini, com `gemini-3.5-flash-lite` como principal e duas reservas | Em produção, o `gemini-3.5-flash` falhou 10 de 10 vezes por cota ou sobrecarga, e o lite respondeu todas em 6 a 15 s ([qa-motor.md](qa-motor.md)) | Groq e OpenRouter continuam suportados pelo cliente, mas sem chave |
| 22/10 | Orçamento de 20 s por tentativa e 45 s no total (em 26/10, teto de 54 s com prazo único para a geração toda, depois do teste do Ivaldo no celular) | Um caso levou 55 s, perto do limite de 60 s da função | No pior caso, a pessoa recebe moldes fixos com aviso, nunca um erro |
| 22/10 | Checklist refeito no servidor a cada mudança de status | O status que vem da tela não é confiável | Uma peça bloqueada nunca avança, mesmo com a tela adulterada |
| 22/10 | Cache não guarda respostas com moldes fixos | Uma falha passageira da IA não deve ficar presa no cache | A próxima tentativa do mesmo briefing chama a IA de novo |
| 25/10 | Ids de evidência fora do texto das peças e roteiros | Em produção, uma fala de roteiro saiu com "[rad-musica-1]" | Prompt corrigido e limpeza no servidor, com teste (PR #111) |

## Segurança e confidencialidade

- A chave do Gemini só existe no servidor (variáveis da Vercel e `.env.local`, fora do Git). O navegador nunca fala com a IA.
- Toda entrada é validada com Zod no servidor, com limites de tamanho em cada campo.
- O checklist e o fluxo de aprovação rodam no servidor; a tela só mostra o resultado.
- Nenhum dado real da empresa entra no repositório. Os dados de teste são marcados como tal na tela e na Bula.
- O nome da empresa cliente não aparece no código, na interface, nos commits nem na documentação.

## Deploy

- **Vercel**, conectada ao repositório: cada merge na `main` publica sozinho em https://capsula-mvp.vercel.app, e cada Pull Request ganha uma prévia.
- Framework fixado em `vercel.json`. A rota de geração declara `maxDuration = 60`.
- Variáveis em produção: `GEMINI_API_KEY` (e, se precisar, `GEMINI_MODEL` e `GEMINI_FALLBACK_MODELS`). `DATA_SOURCE` fica em `mock`.
- O rodapé de cada tela mostra a versão publicada.

## Desempenho medido

| Situação | Tempo | Fonte |
|---|---|---|
| Geração com IA, um público | 6 a 15 s na maioria dos casos | [qa-motor.md](qa-motor.md), 10 briefings em 22/10 |
| Briefing de exemplo, 2 públicos e 12 peças | 9,5 s | captura em produção, 25/10 |
| Mesmo briefing de novo (cache) | 0 a 1 s | [qa-motor.md](qa-motor.md) |
| Pior caso registrado | 55,5 s, antes do orçamento de tempo (hoje limitado a 54 s, com prazo único para a geração toda) | [qa-motor.md](qa-motor.md) |

## Onde mexer

| Quero... | Mexa em |
|---|---|
| Mudar uma regra do checklist | `lib/governanca/checklist.ts` e `tests/governanca.test.ts` |
| Trocar a marca das peças | `lib/marca/marca.json` |
| Ligar os dados da empresa | `.env.local` (`DATA_SOURCE=csv`) e o `mapping.yaml` ([dados-reais.md](dados-reais.md)) |
| Trocar o modelo de IA | `GEMINI_MODEL` e `GEMINI_FALLBACK_MODELS` |
| Mudar o que a IA recebe ou deve fazer | `lib/motor/prompt.ts` |
| Adicionar um campo ao briefing | `types/briefing.ts`, depois o formulário em `components/estudio/Estudio.tsx` |
| Mudar as premissas do painel de ganho | `lib/ganho/metricas.ts` (ou na própria tela, que permite editar) |
