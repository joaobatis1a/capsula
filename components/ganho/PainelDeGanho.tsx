"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Button, Forma, Icon, StatusPill } from "@/components/ds";
import { Conta, Revela } from "@/components/motion/Revela";
import { useAvisar } from "@/components/motion/Avisos";
import {
  AVISO_DE_MUDANCA,
  briefingsDeExemplo,
  CHAVE_EVENTOS,
  CHAVE_PREMISSAS,
  comparar,
  interpretarEventos,
  interpretarPremissas,
  lerBruto,
  limparMedicoes,
  PREMISSAS_PADRAO,
  registrar,
  resumir,
  salvarPremissas,
  type EventoGeracao,
  type Premissas,
} from "@/lib/ganho/metricas";
import type { RespostaGeracao } from "@/types/variacao";
import "./ganho.css";

/* Painel de ganho (#12). Três tipos de número, sempre separados e marcados:
   MEDIDO (tempo, quantidade, barradas), PREMISSA (o processo de hoje, estimado e editável) e SINTÉTICO (CTR do histórico de teste). */

const assinar = (aviso: () => void) => {
  window.addEventListener(AVISO_DE_MUDANCA, aviso);
  window.addEventListener("storage", aviso);
  return () => {
    window.removeEventListener(AVISO_DE_MUDANCA, aviso);
    window.removeEventListener("storage", aviso);
  };
};

const seg = (ms: number | null) => (ms == null ? "—" : ms < 950 ? `${Math.round(ms)} ms` : `${(ms / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} s`);
const min = (m: number) => (m < 1 ? `${Math.round(m * 60)} s` : `${m.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} min`);
const pct = (f: number | null) => (f == null ? "—" : `${(f * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`);

export function PainelDeGanho({ sintetico }: { sintetico: { campanhas: number; ctr: number; conversao: number; origem: string; fonte: string } }) {
  const brutoEventos = useSyncExternalStore(assinar, () => lerBruto(CHAVE_EVENTOS, "[]"), () => "[]");
  const brutoPremissas = useSyncExternalStore(assinar, () => lerBruto(CHAVE_PREMISSAS, "{}"), () => "{}");
  const eventos = useMemo(() => interpretarEventos(brutoEventos), [brutoEventos]);
  const premissas = useMemo(() => interpretarPremissas(brutoPremissas), [brutoPremissas]);
  const resumo = useMemo(() => resumir(eventos), [eventos]);
  const comp = useMemo(() => comparar(resumo, premissas), [resumo, premissas]);
  const ultimas = useMemo(() => eventos.filter((e): e is EventoGeracao => e.tipo === "geracao").slice(-6).reverse(), [eventos]);
  const [medindo, setMedindo] = useState<number | null>(null);
  const avisar = useAvisar();

  async function medirComExemplos() {
    const validade = new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);
    const lista = briefingsDeExemplo(validade);
    for (let i = 0; i < lista.length; i++) {
      setMedindo(i + 1);
      const t0 = performance.now();
      try {
        const res = await fetch("/api/gerar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lista[i]) });
        const geracaoMs = performance.now() - t0;
        if (!res.ok) continue;
        const r = (await res.json()) as RespostaGeracao;
        registrar({
          tipo: "geracao",
          em: new Date().toISOString(),
          briefingMs: null,
          geracaoMs: Math.round(geracaoMs),
          variacoes: r.variacoes.length,
          bloqueadas: r.variacoes.filter((v) => v.status === "bloqueado").length,
          roteiros: r.roteiros.length,
          publicos: r.briefing.publicos.length,
          canais: r.briefing.canais.length,
          modelo: r.modelo,
          doCache: r.doCache,
        });
      } catch {
        avisar("Sem conexão com o servidor");
        break;
      }
    }
    setMedindo(null);
    avisar("Medição concluída");
  }

  const vazio = resumo.geracoes === 0;

  return (
    <div className="ganho">
      <div className="ganho-acoes">
        <Button variant="capsula" onClick={medirComExemplos} disabled={medindo !== null} icon={medindo ? "clock" : "spark"} className={medindo ? "is-dosando" : undefined}>
          {medindo ? `Medindo ${medindo} de 3…` : "Medir com 3 briefings de exemplo"}
        </Button>
        {!vazio ? (
          <Button variant="ghost" onClick={() => limparMedicoes()}>
            Limpar medições
          </Button>
        ) : null}
        <p className="t-body-sm t-muted">
          Os números ficam neste navegador, e cada briefing gerado no Estúdio entra aqui. O terceiro exemplo é um medicamento com prescrição: o checklist barra, e isso conta nas peças barradas.
        </p>
      </div>

      {vazio ? (
        <div className="vazio-forma">
          <Forma tipo="comprimido" size={72} />
          <p className="t-h3">Nada medido ainda</p>
          <p className="t-body-sm t-muted">Gere um briefing no Estúdio ou meça com os três de exemplo. Em poucos segundos o painel se preenche.</p>
        </div>
      ) : (
        <>
          <Revela as="section" className="painel ganho-bloco" aria-labelledby="g-medido">
            <header className="ganho-bloco-topo">
              <h2 id="g-medido" className="t-h2 painel-h2">
                <span className="painel-ponto" aria-hidden="true" />
                O que o app mediu
              </h2>
              <span className="selo-dado is-medido">
                <Icon name="check" size={14} />
                Medido
              </span>
            </header>
            {resumo.semIA ? (
              <p className="ganho-aviso" role="note">
                <Icon name="shield" size={16} />
                <span>
                  <b>
                    {resumo.semIA} de {resumo.geracoes} geraç{resumo.geracoes === 1 ? "ão" : "ões"} usaram moldes fixos, sem IA.
                  </b>{" "}
                  O tempo de geração nelas é só o da máquina montando textos prontos. Com o modelo escrevendo, cada briefing leva alguns segundos. Configure uma chave de modelo para medir o tempo real.
                </span>
              </p>
            ) : null}
            <ul className="ganho-numeros">
              <Numero i={0} rotulo="Tempo de geração por briefing" valor={seg(resumo.geracaoMs)} nota={resumo.doCache ? `${resumo.doCache} resposta(s) do cache ficaram fora da média` : "Do clique em Gerar até as variações chegarem"} />
              <Numero i={1} rotulo="Variações por briefing" valor={<Conta valor={resumo.variacoesPorBriefing ?? 0} formatar={(n) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} />} nota={`${resumo.variacoes} variações em ${resumo.geracoes} briefing${resumo.geracoes === 1 ? "" : "s"}`} />
              <Numero i={2} rotulo="Tempo de geração por variação" valor={seg(resumo.geracaoPorVariacaoMs)} nota="Só a máquina. A revisão humana vem na comparação" />
              <Numero
                i={3}
                destaque
                rotulo="Barradas antes da revisão"
                valor={
                  <>
                    <Conta valor={resumo.bloqueadas} /> <small>de {resumo.variacoes}</small>
                  </>
                }
                nota={`${pct(resumo.taxaBloqueio)} das variações bloqueadas pelo checklist`}
              />
              <Numero i={4} rotulo="Preenchimento do briefing" valor={seg(resumo.briefingMs)} nota={resumo.briefingMs == null ? "Só conta quando uma pessoa preenche" : "Do primeiro campo ao clique em Gerar"} />
              <Numero i={5} rotulo="Até a primeira aprovação" valor={seg(resumo.primeiraAprovacaoMs)} nota={resumo.aprovacoes ? `Mediana de ${resumo.aprovacoes} aprovação(ões), com o tempo humano` : "Aparece quando uma peça é aprovada"} />
            </ul>
          </Revela>

          <Revela as="section" className="painel ganho-bloco" aria-labelledby="g-comp">
            <header className="ganho-bloco-topo">
              <h2 id="g-comp" className="t-h2 painel-h2">
                <span className="painel-ponto" aria-hidden="true" />
                Comparação com o processo de hoje
              </h2>
              <span className="selo-dado is-premissa">
                <Icon name="clock" size={14} />
                Premissa
              </span>
            </header>
            <p className="ganho-declara">
              <b>Premissa declarada.</b> Hoje cada briefing vira uma peça por formato (feed, story e banner). Os minutos abaixo são uma <b>estimativa do time</b>, para confirmar com a empresa
              na mentoria. <b>Não são dado da empresa.</b> Ajuste e veja a conta mudar.
            </p>
            <Ajustes premissas={premissas} />

            {comp ? (
              <div className="ganho-comp">
                <Barras
                  titulo="Minutos por peça"
                  linhas={[
                    { nome: "Hoje (estimativa)", valor: comp.minutosPorPecaHoje, texto: min(comp.minutosPorPecaHoje), tom: "hoje" },
                    { nome: "Cápsula (geração medida + revisão estimada)", valor: comp.minutosPorPecaCapsula, texto: min(comp.minutosPorPecaCapsula), tom: "capsula" },
                  ]}
                  conclusao={`${pct(comp.reducaoPorPeca)} menos tempo por peça`}
                />
                <Barras
                  titulo="Peças por briefing"
                  linhas={[
                    { nome: "Hoje (uma por formato)", valor: comp.pecasPorBriefingHoje, texto: String(comp.pecasPorBriefingHoje), tom: "hoje" },
                    { nome: "Cápsula (medido)", valor: comp.variacoesPorBriefing, texto: comp.variacoesPorBriefing.toLocaleString("pt-BR", { maximumFractionDigits: 1 }), tom: "capsula" },
                  ]}
                  conclusao={`${comp.multiplicadorDePecas.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}× mais variações`}
                />
                <p className="ganho-frase">
                  Um briefing completo leva cerca de <b>{min(comp.minutosPorBriefingHoje)}</b> hoje, para {comp.pecasPorBriefingHoje} peças. Na Cápsula, <b>{min(comp.minutosPorBriefingCapsula)}</b> para{" "}
                  {comp.variacoesPorBriefing.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} variações, já revisadas.
                </p>
              </div>
            ) : null}
          </Revela>

          <Revela as="section" className="painel ganho-bloco" aria-labelledby="g-sint">
            <header className="ganho-bloco-topo">
              <h2 id="g-sint" className="t-h2 painel-h2">
                <span className="painel-ponto" aria-hidden="true" />
                Desempenho do histórico
              </h2>
              <span className="selo-dado is-sintetico">
                <Forma tipo="comprimido" size={16} />
                Sintético
              </span>
            </header>
            <p className="ganho-declara">
              <b>Não é medição.</b> São {sintetico.campanhas} campanhas geradas para teste ({sintetico.fonte}). Servem para mostrar o ranking da Memória, não para provar resultado.
            </p>
            <ul className="ganho-numeros is-sintetico">
              <Numero i={0} rotulo="CTR médio do histórico" valor={pct(sintetico.ctr)} nota="Cliques sobre impressões, nos dados de teste" />
              <Numero i={1} rotulo="Conversão média do histórico" valor={pct(sintetico.conversao)} nota="Conversões sobre cliques, nos dados de teste" />
            </ul>
          </Revela>

          <Revela as="section" className="painel ganho-bloco" aria-labelledby="g-ult">
            <header className="ganho-bloco-topo">
              <h2 id="g-ult" className="t-h2 painel-h2">
                <span className="painel-ponto" aria-hidden="true" />
                Últimas gerações
              </h2>
            </header>
            <ol className="ganho-lista">
              {ultimas.map((e) => (
                <li key={e.em}>
                  <span className="t-data t-muted">{new Date(e.em).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
                  <span>
                    <b>{e.variacoes}</b> variações · {e.publicos} público{e.publicos === 1 ? "" : "s"} × {e.canais} canal{e.canais === 1 ? "" : "is"}
                  </span>
                  <span className="t-data">{seg(e.geracaoMs)}</span>
                  <span className="t-data t-muted">{e.modelo === "sem-ia" ? "sem IA" : e.modelo}</span>
                  {e.bloqueadas ? <StatusPill status="bloqueado">{e.bloqueadas} barrada{e.bloqueadas === 1 ? "" : "s"}</StatusPill> : <span />}
                </li>
              ))}
            </ol>
          </Revela>
        </>
      )}
    </div>
  );
}

function Numero({ i, rotulo, valor, nota, destaque }: { i: number; rotulo: string; valor: React.ReactNode; nota: string; destaque?: boolean }) {
  return (
    <li className={destaque ? "ganho-numero is-destaque" : "ganho-numero"} style={{ "--i": i } as React.CSSProperties}>
      <span className="ganho-numero-rotulo">{rotulo}</span>
      <b className="ganho-numero-valor">{valor}</b>
      <span className="ganho-numero-nota">{nota}</span>
    </li>
  );
}

function Ajustes({ premissas }: { premissas: Premissas }) {
  const campos: { chave: keyof Premissas; rotulo: string; dica: string }[] = [
    { chave: "pecasPorBriefingHoje", rotulo: "Peças por briefing hoje", dica: "Uma por formato: feed, story e banner" },
    { chave: "minutosPorPecaHoje", rotulo: "Minutos por peça hoje", dica: "Do rascunho à versão final" },
    { chave: "minutosRevisaoPorVariacao", rotulo: "Minutos para revisar uma variação", dica: "Na Cápsula, com a Bula ao lado" },
  ];
  return (
    <div className="ganho-ajustes">
      {campos.map((c) => (
        <label key={c.chave} className="cp-field">
          <span className="cp-label">{c.rotulo}</span>
          <input
            className="cp-input"
            type="number"
            inputMode="decimal"
            min={0.5}
            step={c.chave === "pecasPorBriefingHoje" ? 1 : 0.5}
            value={premissas[c.chave]}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v > 0) salvarPremissas({ ...premissas, [c.chave]: v });
            }}
          />
          <span className="cp-hint">{c.dica}</span>
        </label>
      ))}
      {JSON.stringify(premissas) !== JSON.stringify(PREMISSAS_PADRAO) ? (
        <Button variant="ghost" onClick={() => salvarPremissas(PREMISSAS_PADRAO)}>
          Voltar ao padrão
        </Button>
      ) : null}
    </div>
  );
}

function Barras({ titulo, linhas, conclusao }: { titulo: string; linhas: { nome: string; valor: number; texto: string; tom: "hoje" | "capsula" }[]; conclusao: string }) {
  const maximo = Math.max(...linhas.map((l) => l.valor), 0.0001);
  return (
    <figure className="ganho-barras">
      <figcaption>
        <span className="cp-bula-label">{titulo}</span>
        <b className="ganho-conclusao">{conclusao}</b>
      </figcaption>
      {linhas.map((l) => (
        <div key={l.nome} className="ganho-barra-linha">
          <span className="ganho-barra-nome">{l.nome}</span>
          <span className="ganho-barra-trilho">
            <span className={`ganho-barra is-${l.tom}`} style={{ width: `${Math.max(2, (l.valor / maximo) * 100)}%` }} />
          </span>
          <span className="ganho-barra-valor t-data">{l.texto}</span>
        </div>
      ))}
    </figure>
  );
}
