# Dados reais: do CSV da empresa ao ranking (H4, #13)

O sistema só lê campanhas pelo adaptador `CampaignDataSource` (`lib/data`). Trocar a fonte não muda o ranking, a Bula, as telas nem o motor. Para dados reais mudam só o `mapping.yaml` e duas variáveis de ambiente.

> **Origem.** O leitor de CSV, o mini leitor de YAML e a lógica de linhas inválidas vêm do pacote enviado pelo Hector (`backend_hector.zip`, gerado com apoio de IA). O pacote foi escrito para outro contrato de dados; aqui foi adaptado ao nosso (`lib/data/types.ts`) e coberto por testes. O resto do pacote (checklist, estados da peça, rotas de API, migrations do Supabase) não entrou, porque duplica o que o repositório já tem ou depende de um banco que ainda não existe.

## Os 5 passos

1. **Receba o CSV de campanhas** e guarde-o fora do Git (repositório privado ou pasta ignorada). Dado real não vai para commit nem para print.
2. **Copie `mocks/mapping.exemplo.yaml` e edite**: em `campanhas.colunas`, escreva `campo_do_contrato: nome_da_coluna_real`. Ajuste `separador` (`,` ou `;`), `formato_data` (`iso` ou `br`) e `decimal` (`.` ou `,`). Em `valores:`, traduza o que for diferente (ex.: `"Reels": "video"`).
3. **Aponte e escolha a fonte** no `.env.local`: `DATA_SOURCE=csv`, `CSV_CAMPANHAS=caminho/do/arquivo.csv`, `CSV_MAPPING=caminho/do/mapping.yaml`. Sem as duas últimas, ele lê o exemplo da pasta `mocks/`.
4. **Rode `npm test`.** Se faltar coluna, o erro diz qual ("A coluna X (campo Y) não existe no arquivo. Colunas encontradas: ..."). Linha inválida não derruba a leitura: é ignorada e fica em `avisos`, com o número da linha e o motivo.
5. **Confira a origem.** Todo registro do CSV sai com `origem: "real"`. Os itens do Radar, o Ano da saúde e os públicos sugeridos não vêm da empresa e continuam na base de teste.

## Campos do contrato

| Campo | Obrigatório | Observação |
|---|---|---|
| `data` | sim | início da veiculação |
| `canal` | sim | `instagram`, `tiktok`, `facebook` ou `site` |
| `formato` | sim | `feed`, `story`, `banner` ou `video` |
| `publico` | sim | texto livre; é o nome que aparece na tela |
| `gancho` | sim | `pergunta`, `beneficio`, `oferta_direta`, `prova_social`, `urgencia` ou `humor` |
| `impressoes`, `cliques` | sim | inteiros; cliques ≤ impressões |
| `id` | não | se faltar, a linha vira `CSV-00002` (número da linha) |
| `tom` | não | `proximo`, `informativo`, `divertido` ou `institucional` (padrão: `informativo`) |
| `categoria` | não | texto livre (padrão: "Sem categoria") |
| `tipo_produto` | não | os mesmos 7 tipos do briefing (padrão: `higiene_beleza`) |
| `conversoes` | não | padrão 0 |

Valor fora das listas fechadas vira aviso da linha ("gancho "dica" fora de ..."). O jeito de resolver é traduzi-lo em `valores:`, sem mexer no código.

## Prova de que só o mapping muda

`mocks/campanhas-exemplo.csv` usa nomes de coluna, separador (`;`), datas (`DD/MM/AAAA`) e rótulos diferentes dos do contrato, mais colunas que a Cápsula ignora (`verba_rs`, `responsavel`). O `mocks/mapping.exemplo.yaml` o descreve. `tests/csv.test.ts` roda a mesma suíte do adaptador (`tests/helpers/suite-adaptador.ts`) contra o mock e contra esse CSV e confere que o ranking da Memória funciona sobre ele. As 300 linhas do exemplo são **ilustrativas**, não são dados de empresa.

## Na Vercel

O mock é embutido no build. O CSV é lido do disco: para usar `DATA_SOURCE=csv` em produção, inclua o arquivo no deploy (`outputFileTracingIncludes` no `next.config`) ou aponte para um caminho que exista no servidor. No dia da banca a demo roda com `DATA_SOURCE=mock`.
