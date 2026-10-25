# API

**Atualizado em:** 25/10/2026 · Rotas do servidor da Cápsula. Base em produção: `https://capsula-mvp.vercel.app`.

Todas recebem e devolvem JSON. Os contratos ficam em `types/briefing.ts` e `types/variacao.ts` (Zod): o que está lá é a fonte de verdade, e este documento resume.

| Método | Rota | Para quê |
|---|---|---|
| `POST` | `/api/gerar` | Briefing → variações com Bula, roteiros e avisos |
| `POST` | `/api/pecas/status` | Muda o status de uma peça no fluxo de aprovação |
| `GET` | `/api/memoria/ranking` | As 5 combinações que mais renderam e as 5 que menos renderam |
| `GET` | `/api/radar` | Tendências válidas hoje e a sazonalidade de saúde do mês e dos dois seguintes |

## Erros

Toda rota devolve erros no mesmo formato:

```json
{ "erro": "Confira os campos do briefing.", "codigo": "validacao", "campos": { "produto": "Informe o produto." } }
```

| Status | `codigo` | Quando |
|---|---|---|
| 400 | `validacao` | JSON inválido ou campo fora do contrato. `campos` diz qual campo e por quê |
| 409 | `validacao` | Mudança de status não permitida (peça bloqueada, transição inválida, sem nome, devolução sem motivo) |
| 500 | `interno` | Erro inesperado no servidor |

Falha da IA **não** vira erro: o motor troca de modelo e, no limite, devolve as peças dos moldes fixos com um aviso em `avisos`.

## POST /api/gerar

### Pedido

```json
{
  "produto": "Protetor solar FPS 50",
  "categoria": "Dermocosméticos",
  "tipoProduto": "dermocosmetico",
  "oferta": {
    "descricao": "De R$ 79,90 por R$ 55,90",
    "precoDe": 79.9,
    "precoPor": 55.9,
    "condicao": "No app e nas lojas, enquanto durar o estoque.",
    "validade": "2026-11-24"
  },
  "publicos": ["Jovens de 18 a 24", "Adultos de 25 a 34"],
  "canais": ["instagram", "site"],
  "formatos": ["feed", "story", "banner"],
  "objetivo": "conversao",
  "variacoesPorCanal": 3,
  "incluirRoteiros": true,
  "observacoes": "Destacar o uso diário."
}
```

| Campo | Tipo | Regras |
|---|---|---|
| `produto` | texto | 2 a 80 caracteres |
| `categoria` | texto | 2 a 60 caracteres |
| `tipoProduto` | lista fechada | `medicamento_isento`, `medicamento_prescricao`, `dermocosmetico`, `higiene_beleza`, `suplemento`, `infantil`, `servico` |
| `oferta.descricao` | texto | 3 a 120 caracteres |
| `oferta.precoDe`, `oferta.precoPor` | número | opcionais; o preço da oferta precisa ser menor que o normal |
| `oferta.validade` | data | `aaaa-mm-dd` |
| `publicos` | lista de textos | 1 a 4 |
| `canais` | lista | `instagram`, `tiktok`, `facebook`, `site` |
| `formatos` | lista | `feed`, `story`, `banner` (a tela preenche a partir dos canais) |
| `objetivo` | lista fechada | `awareness`, `consideracao`, `conversao` |
| `variacoesPorCanal` | inteiro | 3 a 5; padrão 3 |
| `incluirRoteiros` | sim ou não | padrão `false` |
| `radarIds` | lista | ids do Radar ou do Ano da saúde que inspiraram o briefing; opcional |
| `observacoes` | texto | até 500 caracteres; opcional |

### Resposta (200)

```json
{
  "briefing": { "...": "o briefing validado, com os padrões aplicados" },
  "variacoes": [
    {
      "id": "v-…",
      "publico": "Jovens de 18 a 24",
      "canal": "instagram",
      "formato": "feed",
      "titulo": "Sua pele protegida todo dia",
      "texto": "Já conferiu o protetor solar FPS 50 na sua rotina de cuidado? De R$ 79,90 por R$ 55,90. Oferta válida até 24/11.",
      "cta": "Compre no app",
      "selo": "30% off",
      "hashtags": ["#skincare", "#autocuidado"],
      "dose": 70,
      "status": "rascunho",
      "bula": {
        "indicacao": "Para jovens de 18 a 24 anos inserirem proteção na rotina.",
        "composicao": [{ "k": "Gancho", "v": "Pergunta direta" }, { "k": "Tom", "v": "Próximo e cuidadoso" }],
        "evidencias": [
          { "origem": "memoria", "texto": "Pergunta direcionada ao público jovem no Instagram", "fonte": "9 campanhas · 11/2025 a 09/2026 · nos dados de teste", "refId": "rk-…", "peso": 0.7 },
          { "origem": "tendencia", "texto": "Música comercial liberada do Radar", "fonte": "TikTok Creative Center · Commercial Music Library · 12/10", "refId": "rad-musica-1", "peso": 0.3 }
        ],
        "contraindicacoes": [{ "regra": "termos-proibidos", "ok": true, "texto": "Sem termos proibidos (cura, milagre, garantido)" }],
        "posologia": "Publicar pela manhã no feed do Instagram"
      }
    }
  ],
  "roteiros": [
    {
      "id": "r-…",
      "publico": "Jovens de 18 a 24",
      "plataforma": "reels",
      "duracaoSeg": 15,
      "titulo": "Reels: protetor solar",
      "cenas": [{ "inicio": 0, "fim": 3, "visual": "Farmacêutico sorri para a câmera", "fala": "Você já protegeu sua pele hoje?", "tela": "Proteção diária" }],
      "musica": { "titulo": "Faixa instrumental animada (exemplo)", "artista": "Artista de exemplo", "radarId": "rad-musica-1", "usoComercial": true },
      "evidencias": [],
      "contraindicacoes": []
    }
  ],
  "geradoEm": "2026-10-25T15:30:00.000Z",
  "modelo": "gemini:gemini-3.5-flash-lite",
  "doCache": false,
  "avisos": []
}
```

Os valores acima são ilustrativos e abreviados (`…`).

| Campo | Significado |
|---|---|
| `variacoes[].status` | `rascunho`, ou `bloqueado` quando o checklist reprovou |
| `variacoes[].dose` | 0 a 100: quanto veio da memória. O resto é tendência e sazonalidade |
| `variacoes[].advertencia` | Presente em medicamento isento: "SE PERSISTIREM OS SINTOMAS, O MÉDICO DEVERÁ SER CONSULTADO." |
| `bula.evidencias[].origem` | `memoria`, `tendencia` ou `sazonalidade` |
| `bula.evidencias[].fonte` | Escrita pelo sistema a partir do `refId`, nunca pelo modelo |
| `bula.contraindicacoes` | Uma linha por regra do checklist (`prescricao`, `advertencia-mip`, `termos-proibidos`, `promessa`, `diagnostico`, `alegacao-saude`, `superlativo`, `tom-marca`, `oferta-validade`); `ok: false` bloqueia a peça |
| `roteiros[].plataforma` | `reels`, `tiktok` ou `comercial`; a primeira cena termina até 3 s |
| `modelo` | `gemini:<modelo>` ou `sem-ia` quando a resposta veio dos moldes fixos |
| `doCache` | `true` quando o mesmo briefing já tinha sido gerado nesta instância do servidor |
| `avisos` | Mensagens para a tela, como a troca para um modelo de reserva |

### Exemplo com `curl`

```bash
curl -X POST https://capsula-mvp.vercel.app/api/gerar \
  -H "Content-Type: application/json" \
  -d @briefing.json
```

Cada chamada sem cache consome cota da IA (uma chamada por público). Prefira testar pela tela.

## POST /api/pecas/status

Muda o status de uma peça. O servidor **refaz o checklist** sobre o conteúdo recebido antes de aceitar: uma peça bloqueada não avança, mesmo que o status enviado diga outra coisa.

### Pedido

```json
{
  "peca": { "...": "a variação inteira, como veio de /api/gerar" },
  "briefing": { "...": "o briefing validado" },
  "acao": "enviar",
  "por": "Ana Souza",
  "motivo": "obrigatório só para devolver"
}
```

| `acao` | De | Para |
|---|---|---|
| `enviar` | rascunho | revisao |
| `aprovar` | revisao | aprovado |
| `devolver` | revisao ou aprovado | rascunho (exige `motivo`) |
| `publicar` | aprovado | publicado |

`por` é o nome de quem muda (2 a 80 caracteres).

### Resposta (200)

```json
{
  "peca": { "...": "a peça com o novo status" },
  "registro": { "de": "rascunho", "para": "revisao", "acao": "enviar", "por": "Ana Souza", "em": "2026-10-25T15:31:00.000Z" }
}
```

### Recusas (409)

| Situação | Mensagem |
|---|---|
| Peça bloqueada pelo checklist | "A peça está bloqueada pelo checklist e não pode avançar. Veja as contraindicações na Bula." |
| Transição fora da ordem | `Não é possível "aprovar" uma peça em "rascunho".` |
| Sem nome | "Informe o nome de quem está fazendo a mudança." |
| Devolução sem motivo | "Diga o motivo da devolução." |

Nesta versão a mudança **não é gravada em banco**: o registro volta para a tela, que guarda o histórico na sessão. A persistência é a próxima fase ([limitações](limitacoes-e-proximos-passos.md)).

## GET /api/memoria/ranking

```json
{
  "melhores": [
    { "id": "rk-ctr-…", "combinacao": { "gancho": "pergunta", "formato": "video" }, "metrica": "ctr", "lift": 1.8, "campanhas": 12, "texto": "CTR 1,8× a média · 12 campanhas", "fonte": "…" }
  ],
  "piores": [ "… mesmo formato …" ],
  "total": 300,
  "fonte": "nos dados de teste",
  "origem": "sintetico"
}
```

- `lift` é quanto a combinação rende em relação à média (1,8 = 80% acima), com o CTR normalizado pelo formato.
- Combinações com poucas campanhas são ignoradas.
- Com `DATA_SOURCE=csv`, `origem` passa a ser `real`.

## GET /api/radar

```json
{
  "radar": [ { "id": "rad-musica-1", "plataforma": "TikTok", "tipo": "musica", "termo": "…", "fonte": "…", "validade": "…", "origem": "sintetico" } ],
  "sazonalidade": [ { "id": "saz-dengue", "condicao": "Dengue", "intensidade": [2, 3, 3, 3, 2, 1, 0, 0, 0, 0, 0, 1], "categorias": ["…"], "fontes": ["…"] } ],
  "consultadoEm": "2026-10-25T15:32:00.000Z"
}
```

- `radar` traz só os itens válidos na data da consulta.
- `sazonalidade` traz as condições do mês atual e dos dois seguintes. Em `intensidade`, cada posição é um mês de janeiro a dezembro: 0 fora de época, 1 baixo, 2 médio, 3 pico.
