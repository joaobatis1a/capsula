# Motor criativo

Como um briefing vira variações com Bula. Código em `lib/motor`, `lib/memoria`, `lib/governanca` e `lib/llm`.

## Fluxo

1. **Validação.** `POST /api/gerar` valida o briefing com o mesmo schema da tela (`types/briefing.ts`).
2. **Cache.** O briefing normalizado vira uma chave (hash). Se já foi gerado, a resposta volta do cache sem gastar cota. Por enquanto o cache fica na memória do servidor; a tabela no Supabase vem depois.
3. **Contexto.** `montarContexto` junta:
   - **Memória:** o ranking de combinações do histórico (`lib/memoria/ranking.ts`), filtrado pelos públicos e canais do briefing.
   - **Radar:** tendências válidas hoje e músicas com uso comercial.
   - **Sazonalidade de saúde:** condições com pico no mês atual e nos dois seguintes.
4. **Plano.** Uma rodada por público. Em cada rodada, N peças por canal (3 a 5), nos formatos que o canal aceita. O total fica limitado a 24 peças para caber na cota.
5. **Geração.** Cada público vira uma chamada ao modelo, em paralelo, pedindo JSON.
6. **Montagem.** O sistema, não o modelo, escreve a fonte de cada evidência a partir do id citado. Ids inventados são descartados. Peça fora do contrato é trocada pelo molde fixo.
7. **Governança.** O checklist (`lib/governanca/checklist.ts`) roda em cada peça. Se uma regra falha, a peça fica **Bloqueada** e a Bula mostra o motivo.

## Provedores do modelo

O projeto usa o **Gemini** (`GEMINI_API_KEY`, modelo padrão `gemini-3.5-flash`, trocável por `GEMINI_MODEL`). O motor também aceita Groq e OpenRouter, na ordem `GROQ_API_KEY`, `OPENROUTER_API_KEY`, `GEMINI_API_KEY`, mas o time decidiu usar só o Gemini. Todos usam o formato da API da OpenAI.

Quando o provedor responde 429 (cota) ou 502, 503 e 504 (sobrecarga passageira), o motor tenta até 3 vezes, esperando um pouco mais a cada vez. Se ainda assim falhar, passa para o próximo provedor com chave e avisa na tela.

Sem nenhuma chave, ou se todas as tentativas falham, as peças saem do **modo sem IA**: moldes fixos guiados pelo ranking. A tela avisa, e essas respostas não entram no cache.

O plano gratuito do Google tem cota curta: depois de umas 5 gerações seguidas pode vir o erro 429. Prefira o `gemini-3.5-flash` (cerca de 2 s); o `gemini-3.8-flash` levou 150 s em teste e não serve para a demonstração.

## Dose

A dose diz quanto da peça veio da memória:

```
dose = soma dos pesos das evidências de memória / soma dos pesos de todas as evidências × 100
```

O resto é tendência e sazonalidade. **É uma heurística**, e deve ser apresentada assim: o peso de cada evidência é declarado pelo modelo (ou fixo no modo sem IA) e limitado entre 0 e 1.

## Regras de governança (conjunto mínimo)

| Regra | Quando bloqueia |
|---|---|
| Prescrição | Medicamento com prescrição não pode ter propaganda para o público (RDC 96/2008) |
| Advertência | Medicamento isento de prescrição sem "SE PERSISTIREM OS SINTOMAS, O MÉDICO DEVERÁ SER CONSULTADO." |
| Termos proibidos | cura, milagre, garantido, 100% eficaz, sem efeitos colaterais, infalível |
| Promessa | prazo de efeito ("em 7 dias"), resultado imediato ou definitivo |
| Diagnóstico | "você está com gripe?", diagnóstico, remédio para dengue |
| Alegação terapêutica | "previne", "trata", "combate", "fortalece a imunidade", "emagrece", "rejuvenesce" ou "elimina rugas" em dermocosmético, suplemento, higiene e infantil (não vale para medicamento nem serviço) |
| Superlativo | "o melhor", "nº 1", "único do mercado" sem prova |
| Oferta | preço ou desconto sem a validade da oferta |

O motor coloca a advertência sozinho quando o produto é medicamento isento de prescrição. As normas completas (CONAR e Anvisa) ficam como limitação declarada. O texto oficial da RDC 96/2008 precisa ser conferido antes da banca.

## Padrões plantados no histórico sintético

Estão em `lib/data/mock/campanhas.ts`. O ranking os encontra, e **ninguém pode apresentá-los como descoberta real**: são a prova de que o ranking funciona.
