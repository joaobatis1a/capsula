"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Field, Forma, Icon, Selecao } from "@/components/ds";
import type { PublicoSugerido, Sazonalidade } from "@/lib/data/types";
import { CANAIS, formatosDosCanais, OBJETIVOS, ROTULOS, TIPOS_PRODUTO, validarBriefing, type BriefingEntrada, type Canal, type ErrosBriefing, type Objetivo, type TipoProduto } from "@/types/briefing";
import type { ErroApi, RespostaGeracao } from "@/types/variacao";
import { useAvisar } from "@/components/motion/Avisos";
import { Revela } from "@/components/motion/Revela";
import { registrar } from "@/lib/ganho/metricas";
import { calcularDesconto, descricaoDaOferta, lerPreco, reais } from "@/lib/oferta";
import { Abertura } from "./Abertura";
import { Escolha, Interruptor } from "./Controles";
import { Dosagem } from "./Dosagem";
import { Galeria } from "./Galeria";
import "./estudio.css";
import "./movimento.css";

/* Tela do Estúdio (#25, #26): briefing → /api/gerar → galeria. */

interface Form {
  produto: string;
  categoria: string;
  tipoProduto: TipoProduto;
  precoDe: string;
  precoPor: string;
  condicao: string;
  validade: string;
  publicos: string[];
  canais: Canal[];
  objetivo: Objetivo;
  incluirRoteiros: boolean;
  radarIds: string[];
  observacoes: string;
}

/** Quase todo briefing tem a mesma condição; já vem preenchida e se edita se for outra. */
const CONDICAO_PADRAO = "No app e nas lojas, enquanto durar o estoque.";
/** Quantas variações por canal e público: fixo, para caber na cota do modelo. */
const VARIACOES_POR_CANAL = 3;

const VAZIO: Form = {
  produto: "",
  categoria: "",
  tipoProduto: "dermocosmetico",
  precoDe: "",
  precoPor: "",
  condicao: CONDICAO_PADRAO,
  validade: "",
  publicos: [],
  canais: ["instagram"],
  objetivo: "conversao",
  incluirRoteiros: true,
  radarIds: [],
  observacoes: "",
};

/** O briefing que um tema do Ano da saúde sugere: categoria, tipo, produto de exemplo, públicos e o ângulo da época. */
function formDe(s: Sazonalidade, publicos: PublicoSugerido[]): Form {
  return {
    ...VAZIO,
    produto: s.produtosExemplo[0] ?? "",
    categoria: s.categorias[0] ?? "",
    tipoProduto: s.tiposProduto[0] ?? "dermocosmetico",
    publicos: s.publicos.filter((p) => publicos.some((x) => x.nome === p)).slice(0, 2),
    radarIds: [s.id],
    observacoes: `Ângulo da época: ${s.angulo}`,
  };
}

const CAMPOS_DO_TEMA = ["produto", "categoria", "tipo", "observacoes"];

export function Estudio({ publicos, agora, temaInicial, mes }: { publicos: PublicoSugerido[]; agora: Sazonalidade[]; temaInicial?: Sazonalidade; mes: number }) {
  const [form, setForm] = useState<Form>(() => (temaInicial ? formDe(temaInicial, publicos) : VAZIO));
  const [erros, setErros] = useState<ErrosBriefing>({});
  const [publicoLivre, setPublicoLivre] = useState("");
  const [estado, setEstado] = useState<"parado" | "gerando" | "erro">("parado");
  const [mensagemErro, setMensagemErro] = useState("");
  const [resposta, setResposta] = useState<RespostaGeracao | null>(null);
  const [pronto, setPronto] = useState(false);
  const [preenchidos, setPreenchidos] = useState<string[]>(() => (temaInicial ? CAMPOS_DO_TEMA : []));
  const resultadoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  // Quando a pessoa começou a preencher o briefing: alimenta o painel de ganho.
  const inicioRef = useRef<number | null>(null);
  const tocou = () => {
    inicioRef.current ??= Date.now();
  };

  // Vindo do Ano da saúde com um tema escolhido: desce até o briefing já preenchido.
  useEffect(() => {
    if (!temaInicial) return;
    const t = setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 700);
    return () => clearTimeout(t);
  }, [temaInicial]);
  const avisar = useAvisar();

  // O brilho de "pronto" e o destaque dos campos preenchidos duram pouco.
  useEffect(() => {
    if (!pronto) return;
    const t = setTimeout(() => setPronto(false), 1200);
    return () => clearTimeout(t);
  }, [pronto]);
  useEffect(() => {
    if (!preenchidos.length) return;
    const t = setTimeout(() => setPreenchidos([]), 1000);
    return () => clearTimeout(t);
  }, [preenchidos]);
  const marca = (campo: string) => (preenchidos.includes(campo) ? "is-preenchido" : undefined);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    tocou();
    setForm((f) => ({ ...f, [k]: v }));
  };
  const alternar = <T,>(lista: T[], item: T) => (lista.includes(item) ? lista.filter((x) => x !== item) : [...lista, item]);

  function adicionarPublicoLivre() {
    const nome = publicoLivre.trim();
    if (nome.length < 2 || form.publicos.includes(nome) || form.publicos.length >= 4) return;
    set("publicos", [...form.publicos, nome]);
    setPublicoLivre("");
  }

  function usarTema(t: Sazonalidade) {
    tocou();
    setForm((f) => ({ ...formDe(t, publicos), precoDe: f.precoDe, precoPor: f.precoPor, condicao: f.condicao, validade: f.validade, canais: f.canais, objetivo: f.objetivo }));
    setErros({});
    setPreenchidos(CAMPOS_DO_TEMA);
    rolarParaOBriefing(true);
  }

  function rolarParaOBriefing(focar = false) {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (focar) setTimeout(() => document.getElementById("cp-f-oferta")?.focus({ preventScroll: true }), 600);
  }

  function preencherExemplo() {
    tocou();
    const daqui30 = new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);
    setForm({
      ...VAZIO,
      produto: "Protetor solar FPS 50",
      categoria: "Protetor solar",
      precoDe: "79.90",
      precoPor: "55.90",
      validade: daqui30,
      publicos: publicos.slice(0, 2).map((p) => p.nome),
      canais: ["instagram", "site"],
    });
    setErros({});
    setPreenchidos(["produto", "categoria", "desconto", "precoDe", "precoPor", "validade", "condicao"]);
  }

  function paraBriefing(): BriefingEntrada {
    const precoDe = lerPreco(form.precoDe);
    const precoPor = lerPreco(form.precoPor);
    return {
      produto: form.produto,
      categoria: form.categoria,
      tipoProduto: form.tipoProduto,
      oferta: { descricao: descricaoDaOferta(form.produto, precoDe, precoPor), precoDe, precoPor, condicao: form.condicao || undefined, validade: form.validade },
      publicos: form.publicos,
      canais: form.canais,
      formatos: formatosDosCanais(form.canais),
      objetivo: form.objetivo,
      variacoesPorCanal: VARIACOES_POR_CANAL,
      incluirRoteiros: form.incluirRoteiros,
      radarIds: form.radarIds,
      observacoes: form.observacoes || undefined,
    };
  }

  async function gerar(e?: React.FormEvent) {
    e?.preventDefault();
    const v = validarBriefing(paraBriefing());
    if (!v.ok) {
      setErros(v.erros);
      const primeiro = document.querySelector<HTMLElement>("[aria-invalid='true']");
      primeiro?.focus();
      return;
    }
    setErros({});
    setEstado("gerando");
    const clicouEm = Date.now();
    const briefingMs = inicioRef.current ? clicouEm - inicioRef.current : null;
    requestAnimationFrame(() => resultadoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    try {
      // A dosagem fica na tela pelo menos 1,8s, para não piscar quando a resposta vem do cache ou dos moldes.
      const t0 = performance.now();
      let geracaoMs = 0;
      const [res] = await Promise.all([
        fetch("/api/gerar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v.briefing) }).then((r) => {
          geracaoMs = performance.now() - t0;
          return r;
        }),
        new Promise((r) => setTimeout(r, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1800)),
      ]);
      // Quando a função estoura o tempo, a Vercel devolve texto puro (não JSON): trata como erro de geração.
      const json = await res.json().catch(() => null);
      if (!json) throw new Error("A geração demorou mais do que o esperado. Toque em \"Tentar de novo\".");
      if (!res.ok) {
        const err = json as ErroApi;
        if (err.campos) setErros(err.campos);
        throw new Error(err.erro);
      }
      const r = json as RespostaGeracao;
      registrar({
        tipo: "geracao",
        em: new Date().toISOString(),
        briefingMs,
        geracaoMs: Math.round(geracaoMs),
        variacoes: r.variacoes.length,
        bloqueadas: r.variacoes.filter((x) => x.status === "bloqueado").length,
        roteiros: r.roteiros.length,
        publicos: v.briefing.publicos.length,
        canais: v.briefing.canais.length,
        modelo: r.modelo,
        doCache: r.doCache,
      });
      inicioRef.current = null;
      setResposta(r);
      setEstado("parado");
      setPronto(true);
      avisar(`${(json as RespostaGeracao).variacoes.length} variações prontas`);
      requestAnimationFrame(() => resultadoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (err) {
      setMensagemErro(err instanceof Error && err.message !== "Failed to fetch" ? err.message : "Sem conexão com o servidor.");
      setEstado("erro");
    }
  }

  const sugeridos = publicos.filter((p) => !form.publicos.includes(p.nome));
  const desconto = calcularDesconto(lerPreco(form.precoDe), lerPreco(form.precoPor));
  const totalPecas = Math.min(24, form.publicos.length * form.canais.length * VARIACOES_POR_CANAL);

  return (
    <div className="estudio">
      <Abertura agora={agora} mes={mes} onUsar={usarTema} onEscrever={() => rolarParaOBriefing(true)} />

      <form id="briefing" ref={formRef} className="estudio-form" onSubmit={gerar} noValidate aria-labelledby="titulo-briefing">
        <div className="estudio-form-head">
          <div className="titulo-forma tem-forma">
            <Forma tipo="caplet" size={44} />
            <div>
              <h2 id="titulo-briefing" className="t-h2">
                Briefing
              </h2>
            </div>
          </div>
          <Button variant="ghost" onClick={preencherExemplo}>
            Preencher exemplo
          </Button>
        </div>

        <Revela as="fieldset" className="estudio-grupo">
          <legend className="estudio-legenda">Produto e oferta</legend>
          <div className="estudio-grade">
            <Field id="cp-f-produto" className={marca("produto")} label="Produto" value={form.produto} onChange={(e) => set("produto", e.target.value)} error={erros.produto} placeholder="Protetor solar FPS 50" />
            <Field className={marca("categoria")} label="Categoria" value={form.categoria} onChange={(e) => set("categoria", e.target.value)} error={erros.categoria} placeholder="Protetor solar" />
            <Selecao
              id="cp-f-tipo-de-produto"
              className={marca("tipo")}
              rotulo="Tipo de produto"
              valor={form.tipoProduto}
              mudar={(v) => set("tipoProduto", v)}
              opcoes={TIPOS_PRODUTO.map((t) => ({ valor: t, nome: ROTULOS.tipoProduto[t] }))}
              dica={form.tipoProduto === "medicamento_prescricao" ? "Não pode ter propaganda para o público. As peças sairão bloqueadas." : form.tipoProduto === "medicamento_isento" ? "As peças levam a advertência obrigatória da Anvisa." : undefined}
            />
            <Field className={marca("precoDe")} label="Preço normal (R$)" inputMode="decimal" value={form.precoDe} onChange={(e) => set("precoDe", e.target.value)} error={erros["oferta.precoDe"]} placeholder="79,90" />
            <Field className={marca("precoPor")} label="Preço da oferta (R$)" inputMode="decimal" value={form.precoPor} onChange={(e) => set("precoPor", e.target.value)} error={erros["oferta.precoPor"]} placeholder="55,90" />
            <div className={`cp-field ${marca("desconto") ?? ""}`}>
              <span className="cp-label" id="rotulo-desconto">
                Desconto
              </span>
              <output className={desconto.tipo === "ok" ? "estudio-desconto is-ok" : "estudio-desconto"} aria-labelledby="rotulo-desconto" aria-live="polite">
                {desconto.tipo === "ok" ? (
                  <>
                    <b>{desconto.percentual}%</b>
                    <span>economiza {reais(desconto.economia)}</span>
                  </>
                ) : (
                  "Calculado pelos dois preços"
                )}
              </output>
            </div>
            <Field className={marca("validade")} label="Validade da oferta" type="date" value={form.validade} onChange={(e) => set("validade", e.target.value)} error={erros["oferta.validade"] && "Informe até quando a oferta vale."} />
            <Field className={marca("condicao")} label="Condição" value={form.condicao} onChange={(e) => set("condicao", e.target.value)} placeholder="No app e nas lojas, enquanto durar o estoque" />
          </div>
        </Revela>

        <Revela as="fieldset" className="estudio-grupo" aria-describedby="hint-publicos">
          <legend className="estudio-legenda">Públicos</legend>
          <p id="hint-publicos" className={erros.publicos ? "cp-hint cp-hint-error" : "cp-hint"}>
            {erros.publicos ? <Icon name="x" size={14} /> : null}
            {erros.publicos ?? "Escolha até 4. Cada público recebe as suas próprias variações."}
          </p>
          {form.publicos.length ? (
            <ul className="estudio-chips" aria-label="Públicos escolhidos">
              {form.publicos.map((p) => (
                <li key={p}>
                  <button type="button" className="estudio-chip is-on" aria-label={`Remover ${p}`} onClick={() => set("publicos", form.publicos.filter((x) => x !== p))}>
                    {p}
                    <Icon name="x" size={14} />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <ul className="estudio-chips" aria-label="Públicos sugeridos">
            {sugeridos.map((p) => (
              <li key={p.id}>
                <button type="button" className="estudio-chip" disabled={form.publicos.length >= 4} title={`${p.faixaEtaria} · ${p.momento} · ${p.necessidades.join(", ")}`} onClick={() => set("publicos", [...form.publicos, p.nome])}>
                  {p.nome}
                </button>
              </li>
            ))}
          </ul>
          <div className="estudio-livre">
            <Field
              label="Outro público"
              value={publicoLivre}
              onChange={(e) => setPublicoLivre(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  adicionarPublicoLivre();
                }
              }}
              placeholder="Ex.: gestantes"
            />
            <Button variant="secondary" onClick={adicionarPublicoLivre} disabled={form.publicos.length >= 4}>
              Adicionar
            </Button>
          </div>
        </Revela>

        <Revela as="fieldset" className="estudio-grupo">
          <legend className="estudio-legenda">Canais e objetivo</legend>
          <div className="estudio-grade">
            <Opcoes rotulo="Canais" erro={erros.canais} itens={CANAIS} nomes={ROTULOS.canal} escolhidos={form.canais} alternar={(c) => set("canais", alternar(form.canais, c))} />
            <Escolha rotulo="Objetivo" opcoes={OBJETIVOS.map((o) => ({ valor: o, nome: ROTULOS.objetivo[o] }))} valor={form.objetivo} mudar={(v) => set("objetivo", v)} />
          </div>
          <p className="cp-hint">
            Formatos gerados pelos canais escolhidos: {formatosDosCanais(form.canais).map((f) => ROTULOS.formato[f]).join(", ") || "nenhum"}.
          </p>
          <Interruptor ligado={form.incluirRoteiros} mudar={(v) => set("incluirRoteiros", v)}>
            Incluir roteiro de vídeo curto (Reels ou TikTok) com sugestão de música
          </Interruptor>
          <details className="estudio-obs" open={Boolean(temaInicial) || undefined}>
            <summary>Adicionar observação</summary>
            <Field as="textarea" className={marca("observacoes")} label="Observações" value={form.observacoes} onChange={(e) => set("observacoes", e.target.value)} placeholder="Algo que a peça precisa ou não pode dizer" />
          </details>
        </Revela>

        <div className="estudio-acoes">
          <Button variant="capsula" type="submit" className={estado === "gerando" ? "is-dosando" : undefined} disabled={estado === "gerando"} icon={estado === "gerando" ? "clock" : "arrow"}>
            {estado === "gerando" ? "Gerando variações…" : "Gerar variações"}
          </Button>
          <p className="posologia-viva" aria-live="polite">
            {estado === "gerando" ? (
              "Consultando a memória, o radar e o modelo."
            ) : (
              <>
                Vai gerar <b key={totalPecas}>{totalPecas}</b> peças
                <span>
                  {form.publicos.length || 0} público{form.publicos.length === 1 ? "" : "s"} × {form.canais.length} cana{form.canais.length === 1 ? "l" : "is"} × {VARIACOES_POR_CANAL}
                </span>
              </>
            )}
          </p>
        </div>

        {estado === "erro" ? (
          <div className="estudio-alerta is-erro" role="alert">
            <Icon name="x" size={18} />
            <p>{mensagemErro}</p>
            <Button variant="secondary" onClick={() => gerar()}>
              Tentar de novo
            </Button>
          </div>
        ) : null}
      </form>

      <div ref={resultadoRef} className="estudio-resultado">
        {estado === "gerando" ? (
          <Dosagem pecas={form.publicos.length * form.canais.length * VARIACOES_POR_CANAL} />
        ) : resposta ? (
          <Galeria key={resposta.geradoEm} resposta={resposta} />
        ) : null}
      </div>
    </div>
  );
}

function Opcoes<T extends string>({ rotulo, erro, itens, nomes, escolhidos, alternar }: { rotulo: string; erro?: string; itens: readonly T[]; nomes: Record<T, string>; escolhidos: T[]; alternar: (item: T) => void }) {
  return (
    <div className="cp-field" role="group" aria-label={rotulo}>
      <span className="cp-label">{rotulo}</span>
      <ul className="estudio-chips">
        {itens.map((i) => (
          <li key={i}>
            <button type="button" className={escolhidos.includes(i) ? "estudio-chip is-on" : "estudio-chip"} aria-pressed={escolhidos.includes(i)} onClick={() => alternar(i)}>
              {escolhidos.includes(i) ? <Icon name="check" size={14} /> : null}
              {nomes[i]}
            </button>
          </li>
        ))}
      </ul>
      {erro ? (
        <p className="cp-hint cp-hint-error">
          <Icon name="x" size={14} />
          {erro}
        </p>
      ) : null}
    </div>
  );
}
