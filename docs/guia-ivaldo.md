# Guia do Ivaldo: motor, roteiros e peças

**Papel:** Developer da frente de motor criativo, templates e API · **Prazo das entregas: 22/10/2026** · **Site:** https://capsula-mvp.vercel.app · **Quadro:** https://github.com/users/joaobatis1a/projects/1

Este guia substitui a lista antiga de tarefas. Ele diz **o que já existe**, **o que falta na sua frente** e **como saber que cada entrega está pronta**. O escopo congela em **24/10**, o envio é em **25/10** e a submissão em **26/10**. Entregar até **22/10** deixa dois dias para integrar e corrigir.

## O que já existe (para você não refazer)

- O motor, ponta a ponta, descrito em [motor.md](motor.md): briefing validado, memória, radar, Ano da saúde, geração, Bula e governança. Código em `lib/motor`, `lib/llm` e `lib/governanca`.
- **A IA está ligada em produção**: o motor usa o Gemini (`gemini-3.5-flash`) e, se ele falhar ou a cota acabar, cai nos moldes fixos e avisa na tela.
- Templates das peças em `components/pecas/Peca.tsx`: feed 1:1, story 9:16 e banner 16:9, com exportação em PNG pelo navegador.
- O checklist de governança, com os termos proibidos, a advertência da Anvisa e a regra de alegação terapêutica.

O que ainda **não** foi feito, ou nunca foi testado a fundo, é o que está abaixo. É trabalho real e é seu.

## Suas entregas

### I1. Roteiros de Reels, TikTok e comercial (#10)

**Por quê:** o Estúdio gera roteiros, mas eles são a parte menos revisada. O pedido original inclui comercial de 15 e 30 segundos.

**O que fazer**
1. Ler `lib/motor/prompt.ts`, `lib/motor/gerar.ts` e o tipo `Roteiro` em [`types/variacao.ts`](../types/variacao.ts).
2. Gerar roteiros no site (briefing com "Incluir roteiros" ligado) e avaliar: gancho nos 3 primeiros segundos, duração, marcação de cena, fala e texto na tela.
3. Melhorar o prompt para:
   - roteiros de **15 e 30 segundos** para comercial, além de Reels e TikTok;
   - mostrar **de onde veio a tendência do Radar** usada em cada roteiro;
   - passar pelo **checklist de governança**, como as peças.
4. Acrescentar testes em `tests/` para o que for lógica (por exemplo, a duração e a governança dos roteiros).

**Pronto quando:** PR aprovado, 5 roteiros de exemplo avaliados por você (o que ficou bom e o que ainda falha) e os testes passando.

### I2. Teste do motor com 10 briefings

**Por quê:** o motor com IA real só passou a rodar em 15/10, e foi testado com 5 briefings. A banca vai usar casos que não imaginamos.

**O que fazer**
1. Montar **10 briefings variados** (medicamento isento, prescrição, dermocosmético, suplemento, infantil, serviço; vários públicos e canais) e rodá-los no site.
2. Para cada um, anotar: tempo, se usou IA ou molde fixo, qualidade do texto, se a governança bloqueou o que devia e se deixou passar algo que não devia.
3. Escrever o relatório em `docs/qa-motor.md`, com uma tabela por caso e a lista dos problemas, em ordem de gravidade.

**Pronto quando:** relatório com os 10 casos, e cada problema grave virou issue ou PR.

**Cuidado:** a cota gratuita do Google é curta. Depois de umas 5 gerações seguidas pode vir o erro 429, e o motor usa os moldes fixos (a tela avisa). Espace as gerações e anote quando isso acontecer, porque a banca pode ver o mesmo.

### I3. Música liberada na Bula (#37)

**Por quê:** a Bula de um roteiro deve citar a música sugerida e dizer que o uso comercial está liberado.

**O que fazer**
1. O Radar tem itens de `tipo: "musica"` com `usoComercial`. Só os com `usoComercial: true` podem ser sugeridos.
2. Fazer o motor incluir uma música liberada no roteiro e mostrá-la na Bula, com a fonte e a data do item do Radar.
3. Teste: um item com `usoComercial: false` **nunca** aparece na sugestão.

**Pronto quando:** PR aprovado e o teste do item sem liberação passando.

### I4. Revisão dos templates e do PNG

**Por quê:** as peças são o que a banca mais vai olhar.

**O que fazer**
1. Gerar peças nos três formatos e baixar o PNG de cada uma, nos dois temas (claro e escuro do sistema).
2. Conferir: texto cortado, contraste, marca fictícia aplicada, proporção correta (1:1, 9:16, 16:9) e nitidez do PNG.
3. Registrar os problemas numa lista e corrigir pelo menos um deles por PR (código em `components/pecas/`).

**Pronto quando:** lista de problemas entregue e pelo menos 1 PR de correção aprovado.

### I5. Integração e QA em produção (#14)

**Por quê:** só funciona de verdade quando funciona no site público, do começo ao fim.

**O que fazer**
1. Escrever o checklist em `docs/qa-producao.md`: briefing → variações → Bula → aprovação em 4 estados → resultado na Memória → painel de Ganho.
2. Executar o checklist em https://capsula-mvp.vercel.app, em computador e celular.
3. Cada falha vira issue com passos para repetir e um print.

**Pronto quando:** o checklist está executado, com data, e as falhas registradas como issues.

## Pitch (#16): a sua parte

O pitch de 5 minutos é eliminatório. João faz a narrativa e o slide, Hector cuida dos números e do ensaio. Você grava o **vídeo da demonstração**: o fluxo completo no site, em até 2 minutos, com áudio limpo. O roteiro do vídeo sai depois do congelamento.

## Como entregar

1. **Branch** por tarefa: `tipo/tarefa-descricao`, por exemplo `feat/10-roteiros-15-30s`.
2. **Commits** em português, no padrão `tipo(escopo): descrição`, por exemplo `feat(motor): roteiros de 15 e 30 segundos para comercial`.
3. **Pull Request** para a `main`, com o modelo do repositório. Ninguém commita direto na `main`. O João revisa no mesmo dia.
4. **Uso de IA:** se você usar uma IA para escrever código, texto ou pesquisa, acrescente uma linha na tabela "Uso de IA generativa" do [README](../README.md#uso-de-ia-generativa), dizendo o que ela fez e o que você corrigiu. A banca avalia isso.
5. **Rodar o projeto:** `npm install` e `npm run dev`. Sem chave de IA o sistema funciona no modo "Sem IA". **Não use a chave do João**; para testar o motor com IA local, crie a sua no Google AI Studio e coloque em `GEMINI_API_KEY` no `.env.local`.

## Regras que valem para tudo

- **Confidencialidade:** nada do enunciado e **nenhum nome da empresa cliente** em código, commit, issue ou print. Só dados públicos ou sintéticos, sempre com a origem marcada.
- **Chaves** só no `.env.local`, que nunca entra em commit. Nunca cole chave em chat, issue ou print.
- **Sem acesso ao repositório?** Mande seu usuário do GitHub ao João.

## Registro das suas entregas

Preencha quando concluir cada uma. Este quadro é o que mostra o que cada pessoa construiu.

| Entrega | PR ou documento | Data | Observação |
|---|---|---|---|
| I1 Roteiros 15/30s e Reels/TikTok | | | |
| I2 Teste do motor (10 briefings) | | | |
| I3 Música liberada na Bula | | | |
| I4 Templates e PNG | | | |
| I5 QA em produção | | | |
