# Guia do Hector: dados, fontes e processo

**Papel:** Scrum Master e Developer da frente de dados · **Prazo das entregas: 22/10/2026** · **Site:** https://capsula-mvp.vercel.app · **Quadro:** https://github.com/users/joaobatis1a/projects/1

Este guia substitui a lista antiga de tarefas. Ele diz **o que já existe**, **o que falta na sua frente** e **como saber que cada entrega está pronta**. O escopo congela em **24/10**, o envio é em **25/10** e a submissão em **26/10**. Entregar até **22/10** deixa dois dias para integrar e corrigir.

## O que já existe (para você não refazer)

- O site no ar, com Estúdio, Memória, Radar, Ano da saúde e painel de Ganho. Tudo usa **dados sintéticos** e a marca fictícia "Farmácia Exemplo".
- O contrato de dados em [`lib/data/types.ts`](../lib/data/types.ts): `Campanha`, `ItemRadar`, `Sazonalidade` e a interface `CampaignDataSource`. Todo o sistema lê dados só por ela.
- O motor com IA (Gemini) e o checklist de governança, descritos em [motor.md](motor.md).
- A base do Ano da saúde, com 33 condições, em `lib/data/mock/saude/`.

O que ainda **não** existe é o que está abaixo. É trabalho real e é seu.

## Suas entregas

### H1. Supabase e migration (#18)

**Por quê:** hoje o status das peças, as peças aprovadas e o cache vivem só no navegador de quem usa. Com o banco, o time inteiro vê a mesma coisa.

**O que fazer**
1. Criar o projeto no Supabase (plano gratuito), na sua conta. Nome: `capsula`.
2. Escrever a migration em `supabase/migrations/0001_pecas.sql` com:
   - `pecas`: `id` (uuid), `briefing` (jsonb), `variacao` (jsonb), `status` (texto: `rascunho`, `em_revisao`, `aprovado`, `bloqueado`), `criado_em`, `atualizado_em`.
   - `historico_status`: `id`, `peca_id`, `de`, `para`, `em`, `quem`. Serve para provar a aprovação humana.
3. Ativar a segurança por linha (RLS) em ambas as tabelas.
4. Mandar ao João, **por canal privado e fora do repositório**, a URL do projeto e a `service_role key`. Elas entram só no `.env.local` dele e na Vercel.

**Pronto quando:** a migration está num PR aprovado, o projeto tem as duas tabelas e o João recebeu as chaves. A ligação do app ao banco é feita depois pelo João com o Claude, e o crédito da migration é seu.

**Cuidado:** o Supabase gratuito pausa após 7 dias sem uso. Acesse o projeto antes de cada apresentação.

### H2. Radar com fontes reais (#9)

**Por quê:** hoje os itens do Radar são exemplos. Para a banca, o Radar precisa mostrar tendências reais, com fonte e data.

**O que fazer**
1. Coletar **de 15 a 20 itens** à mão, em fontes públicas (TikTok Creative Center, central de criação do Meta, calendário de datas de saúde, listas públicas de músicas). **Nunca raspar aplicativos.**
2. Para cada item, preencher estes campos (iguais ao contrato `ItemRadar`):

| Campo | Exemplo |
|---|---|
| `plataforma` | TikTok, Instagram, Meta Ads ou Calendário |
| `tipo` | `hashtag`, `formato`, `musica` ou `data_sazonal` |
| `termo` | "Antes e depois em dois cortes" |
| `ideia` | Uma frase de como usar na farmácia |
| `fonte` | Nome da fonte **e o link** |
| `vistoEm` | Data em que você viu (aaaa-mm-dd) |
| `validade` | Até quando vale (aaaa-mm-dd). Item vencido sai das sugestões |
| `artista` e `usoComercial` | Só para música: se a marca pode usar, conforme a licença da fonte |

3. Marcar a origem como `publico`.
4. Entregar numa planilha e depois abrir um PR que acrescenta os itens em [`lib/data/mock/radar.ts`](../lib/data/mock/radar.ts).

**Pronto quando:** 15 itens ou mais, cada um com link que abre, datas e validade preenchidas, e pelo menos 3 músicas com a licença conferida.

**Cuidado:** não invente item para completar o número. Menos itens verdadeiros valem mais que muitos duvidosos.

### H3. Conferir o Ano da saúde

**Por quê:** as faixas de intensidade por mês foram montadas a partir de fontes públicas, mas são **aproximadas**, e a ferramenta que as montou não conseguiu abrir o InfoGripe. Se a banca perguntar "de onde vem isso?", a resposta precisa ser sólida.

**O que fazer**
1. Abrir https://capsula-mvp.vercel.app/saude e conferir as 33 condições.
2. Comparar cada uma com os boletins vigentes (InfoGripe/Fiocruz, Ministério da Saúde, sociedades médicas).
3. Registrar numa tabela: condição, meses que estão certos, meses que precisam mudar, fonte (com link).

Em [`lib/data/mock/saude/`](../lib/data/mock/saude) cada condição tem `meses: "332110011233"`: são 12 dígitos, de janeiro a dezembro, com 0 = fora de época, 1 = baixo, 2 = médio, 3 = pico. Você pode propor a correção direto nesse texto num PR.

**Pronto quando:** tabela completa, correções propostas por PR (ou listadas para o João aplicar) e as condições que você não conseguiu confirmar marcadas como "não verificada".

### H4. Dados reais: CSV e `mapping.yaml` (#13)

**Por quê:** a empresa vai entregar dados no formato dela. O sistema precisa ler um CSV sem mudar nenhuma tela.

**O que fazer**
1. Implementar `CsvDataSource` em `lib/data/csv.ts`, seguindo a interface `CampaignDataSource`, e registrar o caso `csv` em [`lib/data/index.ts`](../lib/data/index.ts) (há um comentário marcando o lugar).
2. Criar `mocks/campanhas-exemplo.csv` com 20 linhas e as colunas do contrato `Campanha`.
3. Criar `mocks/mapping.exemplo.yaml`, que diz qual coluna do CSV da empresa corresponde a cada campo nosso (para o caso de os nomes serem diferentes).
4. Escrever o teste em `tests/` que lê o CSV de exemplo e confere uma contagem e uma métrica.
5. Escrever o guia curto `docs/dados-reais.md`: passo a passo de como conectar um CSV novo.

**Pronto quando:** `DATA_SOURCE=csv` faz a Memória funcionar com o CSV de exemplo e `npm test` passa. Se travar, avise até 20/10, e o João com o Claude assumem a parte de código para a entrega não cair.

### H5. Scrum Master

- **Sprint Review e Retrospective da Sprint 1**, nos modelos de [`templates/`](templates), salvos em `docs/sprints/`. O que entrou está em [`sprint-1-planning.md`](sprints/sprint-1-planning.md) e no histórico de PRs.
- **Sprint Planning 2 (21/10):** propor o Sprint Goal e as tasks da Sprint 2 com base neste guia e no do Ivaldo.
- **Quadro atualizado**: cada task com dono e status. Uma task, um dono só.
- **Daily** no grupo, até as 10h.

**Pronto quando:** os dois registros estão em `docs/sprints/` e o quadro reflete a realidade.

## Pitch (#16): a sua parte

O pitch de 5 minutos é eliminatório. João faz a narrativa e o slide. Você cuida dos **números** (o que o painel de Ganho mostra e a premissa de cada um) e do **ensaio com cronômetro**, com pelo menos 2 ensaios completos. Os detalhes saem depois do congelamento.

## Como entregar

1. **Branch** por tarefa: `tipo/tarefa-descricao`, por exemplo `feat/18-supabase-migration`.
2. **Commits** em português, no padrão `tipo(escopo): descrição`, por exemplo `feat(dados): migration das peças e do histórico de status`.
3. **Pull Request** para a `main`, com o modelo do repositório. Ninguém commita direto na `main`. O João revisa no mesmo dia.
4. **Uso de IA:** se você usar uma IA para escrever código, texto ou pesquisa, acrescente uma linha na tabela "Uso de IA generativa" do [README](../README.md#uso-de-ia-generativa), dizendo o que ela fez e o que você corrigiu. A banca avalia isso.
5. **Rodar o projeto:** `npm install` e `npm run dev`. Sem chave de IA o sistema funciona no modo "Sem IA". **Não use a chave do João**; se precisar de IA local, crie a sua no Google AI Studio.

## Regras que valem para tudo

- **Confidencialidade:** nada do enunciado e **nenhum nome da empresa cliente** em código, commit, issue ou planilha. Só dados públicos ou sintéticos, sempre com a origem marcada.
- **Chaves** só no `.env.local`, que nunca entra em commit. Nunca cole chave em chat, issue ou print.
- **Sem acesso ao repositório?** Mande seu usuário do GitHub ao João.

## Registro das suas entregas

Preencha quando concluir cada uma. Este quadro é o que mostra o que cada pessoa construiu.

| Entrega | PR ou documento | Data | Observação |
|---|---|---|---|
| H1 Supabase e migration | | | |
| H2 Radar real | | | |
| H3 Ano da saúde conferido | | | |
| H4 CSV e `mapping.yaml` | | | |
| H5 Review, Retro e Planning 2 | | | |
