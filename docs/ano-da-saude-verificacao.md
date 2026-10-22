# Ano da saúde: conferência das intensidades por mês (H3, #76)

As intensidades de cada condição (`meses: "001233321000"`, de janeiro a dezembro; 0 fora de época, 1 baixo, 2 médio, 3 pico) em [`lib/data/mock/saude/`](../lib/data/mock/saude) são **aproximadas**: padrão geral do país, sem recorte regional. Esta página registra o que foi conferido com fonte pública em 22/10/2026 e o que **não foi**.

> **Escopo desta conferência.** Foi uma passada por pesquisa na web, só nas condições em que o boletim público traz um recorte de meses. Das 33 condições, **5 foram conferidas** e **28 ficam como "não verificada"**. Quem for apresentar deve dizer "padrão aproximado a partir de fontes públicas", nunca "dado oficial".

## Conferidas

| Condição | Meses no sistema | Resultado | Fonte |
|---|---|---|---|
| Gripe (influenza) | `001233321000`: março a setembro, pico de maio a julho | **Consistente.** O InfoGripe/Fiocruz trata março a agosto como o período de circulação dos vírus respiratórios, e em 2026 a influenza A subiu em junho e a SRAG caiu em julho | [CNN Brasil](https://www.cnnbrasil.com.br/saude/sobe-para-16-o-numero-de-estados-com-avanco-de-srag-alerta-fiocruz/) · [Band](https://www.band.com.br/saude/noticias/vsr-e-gripe-avancam-no-brasil-e-elevam-internacoes-alerta-fiocruz-202606111230) |
| Bronquiolite e VSR | `001233210000`: março a agosto, pico de maio a junho | **Consistente.** O InfoGripe aponta o VSR em alta no primeiro semestre, em crianças pequenas (82% dos casos de SRAG por VSR em 2025 foram em menores de 2 anos), e ainda elevado em julho | [Agência Gov](https://agenciagov.ebc.com.br/noticias/202512/infogripe-ressalta-importancia-da-vacina-contra-o-vsr) |
| Resfriado comum | `112233322111` | **Consistente com a janela de março a agosto**, mas sem boletim próprio: o resfriado não é monitorado pelo InfoGripe. Tratar como aproximação | (mesmas fontes da gripe) |
| Pneumonia | `001233321000` | **Consistente com a janela dos vírus respiratórios**, sem boletim próprio | (mesmas fontes da gripe) |
| Dengue | `233321000001`: pico de fevereiro a abril | **Consistente, com uma ressalva.** O Ministério da Saúde situa o pico nos meses mais chuvosos de cada região, em geral de novembro a maio, e uma revisão de 10 anos aponta mais de 70% dos casos de janeiro a maio. O sistema mostra novembro em 0 e dezembro em 1 | [Revisão epidemiológica, BJIHS](https://bjihs.emnuvens.com.br/bjihs/article/view/5386) · [Folha Vitória](https://www.folhavitoria.com.br/saude/dengue-casos-e-mortes-disparam-no-brasil-mudanca-climatica-faz-virus-circular/) |

**Correção sugerida (não aplicada):** dengue, novembro de `0` para `1` (`233321000011`), para refletir que o período de transmissão começa em novembro nas regiões mais chuvosas. É uma decisão do João Batista, porque muda o desenho da tabela.

## Não verificadas (28)

Sem conferência com fonte pública nesta passada. Na tela, continuam com a fonte que já constava na ficha de cada uma.

Exposição ao sol e queimaduras · Manchas e melasma depois do verão · Pele seca e dermatite atópica · Micoses de pele e unhas · Otite externa · Picadas de insetos e alergias de pele · Conjuntivite · Olho seco e irritação ocular · Ar seco · Rinite alérgica e alergias respiratórias · Desidratação e intermação · Pressão alta no frio · Piolho · Viagens e férias · Chikungunya · Zika · Febre amarela · Leptospirose · Gastroenterite viral · Diarreia e intoxicação alimentar · Catapora · Síndrome mão-pé-boca · Meningite · Infecção urinária · COVID-19 · Dor de garganta e amigdalite · Otite e sinusite · Asma e bronquite

COVID-19 merece atenção: o sistema mostra `111122221111` (quase constante), o que reflete a circulação ao longo do ano, e não há um recorte sazonal estável para afirmar mais que isso.

## Limites

- Os boletins pesquisados são de 2025 e 2026; sazonalidade muda de ano para ano e de região para região.
- A pesquisa não abriu os boletins do InfoGripe diretamente; usou reportagens e a revisão acadêmica que os citam. Para uma afirmação oficial, abrir o boletim mais recente da [Fiocruz/InfoGripe](https://portal.fiocruz.br/infogripe) e os boletins epidemiológicos do Ministério da Saúde.
- A conferência completa das 28 restantes cabe ao Hector (#76), com os boletins à mão.
