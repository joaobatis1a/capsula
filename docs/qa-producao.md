# QA em produção (I5, #83 e #14)

**URL:** https://capsula-mvp.vercel.app · **Checklist criado e executado em:** 22/10/2026 (por API e, depois, em tela no Chrome, no computador)

Percurso completo: briefing → variações → Bula → governança → aprovação em 4 estados → Memória → painel de Ganho. Cada linha tem o estado da última execução. **API** = executado por chamadas às rotas da URL publicada. **Tela** = precisa de uma pessoa (ou do Chrome conectado) abrindo o site.

Legenda: ✅ passou · ⬜ ainda não executado · ❌ falhou (vira issue com passos e print).

## 1. Briefing

| # | Passo | Como | Estado |
|---|---|---|---|
| 1.1 | A tela do Estúdio abre e o botão "Preencher exemplo" preenche tudo | Tela | ✅ 22/10 |
| 1.2 | Briefing incompleto mostra quais campos faltam (produto vazio → erro no campo) | API (400 com `campos`) · Tela | ✅ API · ✅ Tela ("Informe o produto.", campo com `aria-invalid`) |
| 1.3 | Seletor de tipo de produto, públicos e canais funcionam com o teclado | Tela | ⬜ |

## 2. Variações

| # | Passo | Como | Estado |
|---|---|---|---|
| 2.1 | "Gerar variações" devolve 3 peças por canal e público, com Bula | API | ✅ 22/10 |
| 2.2 | Aparece o modelo usado; se o Gemini falha, passa para os modelos de reserva e depois para os moldes fixos, sempre com aviso | API (reserva usada em produção em 22/10) | ✅ |
| 2.3 | Roteiros: Reels ou TikTok 15s, comercial 15s e 30s, com música liberada | API | ✅ |
| 2.4 | Peças nos três formatos (feed, story, banner) e "Baixar PNG" no tamanho real | Tela, em produção | ✅ 1080×1080, 1080×1920 e 1920×1080. **Achado:** com o navegador em modo escuro as peças saíam quase pretas (tema "sistema"); corrigido no PR #93 (padrão "claro") |

## 3. Bula e governança

| # | Passo | Como | Estado |
|---|---|---|---|
| 3.1 | A Bula tem as 5 seções, a dose vem do motor e cada evidência tem fonte | API | ✅ |
| 3.2 | Peça sem Bula, com Bula vazia ou sem evidências é recusada | API (400) | ✅ |
| 3.3 | Peça com promessa de cura fica bloqueada e não avança, com o motivo na Bula | API (409) | ✅ |
| 3.4 | Medicamento com prescrição bloqueia tudo; medicamento isento leva a advertência da Anvisa | API (ver `qa-motor.md`) | ✅ |
| 3.5 | Roteiro com texto proibido aparece como "bloqueado pelo checklist" | Testes automatizados · Tela | ✅ testes · ⬜ Tela (o briefing de exemplo não gera roteiro bloqueado; o card "Veio de:" apareceu nos 6 roteiros) |

## 4. Aprovação em 4 estados

| # | Passo | Como | Estado |
|---|---|---|---|
| 4.1 | Rascunho → em revisão → aprovado → publicado, com o nome de quem mudou | API (200 nos três passos) | ✅ |
| 4.2 | Sem o nome da pessoa, a mudança é recusada | API (409) | ✅ |
| 4.3 | Publicar sem aprovar é recusado | API (409) | ✅ |
| 4.4 | O carimbo "Aprovado"/"Publicado" aparece e o histórico lista quem mudou | Tela | ✅ Bula aberta, "Enviar para revisão" → "Aprovar" → "Publicar", carimbo PUBLICADO e 3 linhas de histórico com nome e hora |

## 5. Memória e Ganho

| # | Passo | Como | Estado |
|---|---|---|---|
| 5.1 | A tela da Memória carrega o ranking (melhores e piores combinações) com origem "sintético" | API (200) · Tela | ✅ API · ✅ Tela (300 campanhas, período 10/2025 a 09/2026) |
| 5.2 | A peça aprovada volta para a Memória | Tela | ✅ "Publicadas pelo Estúdio: 1 peça, aprovada por Teste QA" |
| 5.3 | O painel de Ganho abre e mostra os números | Tela | ✅ tempo por briefing, variações por briefing e peças barradas |
| 5.4 | Radar e Ano da saúde carregam; itens de exemplo aparecem marcados | API (200) · Tela | ✅ API · ✅ Tela (Radar com 16 itens marcados "dados de teste", música liberada e sem liberação; rodapé mostra a versão publicada) |

## 6. Computador e celular

| # | Passo | Como | Estado |
|---|---|---|---|
| 6.1 | Sem rolagem horizontal em 360, 768 e 1280px em nenhuma das 5 telas | Chrome (22/10) | ✅ |
| 6.2 | Barra de baixo no celular recolhe ao rolar; alvos de toque de 44px | Chrome (15/10) | ✅ |
| 6.3 | Tabela do Ano da saúde legível no celular depois do PR #73 | Chrome, tela de 390 px (iframe) | ✅ nome de 112 px, cabeçalho preso, meses legíveis. ⬜ aparelho real |
| 6.4 | Fluxo completo num celular real | Aparelho real | ⬜ só uma pessoa com o celular |

## Falhas registradas

Uma falha de aparência encontrada em tela (peças pretas no navegador em modo escuro) e corrigida no mesmo dia (PR #93). Nenhuma outra falha de produto nas execuções por API e em tela. **Não executados:** teclado nos seletores (1.3), roteiro bloqueado em tela (3.5) e o fluxo num celular real (6.4); ao fazê-los, trocar o ⬜ por ✅ ou ❌, anotar a data e abrir uma issue por falha, com passos e print.

Observação de risco já conhecida: o Gemini responde 503 ou 429 com alguma frequência no plano gratuito. O sistema avisa e usa reserva, mas o texto pode sair de molde fixo. Antes da banca, gerar uma vez no horário para o cache guardar uma resposta com IA.
