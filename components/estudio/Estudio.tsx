"use client";

import { useRef, useState } from "react";
import { Button, Field, Icon, OriginTag } from "@/components/ds";
import type { PublicoSugerido, Sazonalidade } from "@/lib/data/types";
import { CANAIS, FORMATOS, OBJETIVOS, ROTULOS, TIPOS_PRODUTO, validarBriefing, type BriefingEntrada, type Canal, type ErrosBriefing, type Formato, type Objetivo, type TipoProduto } from "@/types/briefing";
import type { ErroApi, RespostaGeracao } from "@/types/variacao";
import { Galeria } from "./Galeria";
import "./estudio.css";

/* Tela do Estúdio (#25, #26): briefing → /api/gerar → galeria. */

interface Form {
  produto: string;
  categoria: string;
  tipoProduto: TipoProduto;
  descricao: string;
  precoDe: string;
  precoPor: string;
  condicao: string;
  validade: string;
  publicos: string[];
  canais: Canal[];
  formatos: Formato[];
  objetivo: Objetivo;
  variacoesPorCanal: number;
  incluirRoteiros: boolean;
  radarIds: string[];
  observacoes: string;
}

const VAZIO: Form = {
  produto: "",
  categoria: "",
  tipoProduto: "dermocosmetico",
  descricao: "",
  precoDe: "",
  precoPor: "",
  condicao: "",
  validade: "",
  publicos: [],
  canais: ["instagram"],
  formatos: ["feed", "story"],
  objetivo: "conversao",
  variacoesPorCanal: 3,
  incluirRoteiros: true,
  radarIds: [],
  observacoes: "",
};

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export function Estudio({ publicos, sazonalidade }: { publicos: PublicoSugerido[]; sazonalidade: Sazonalidade[] }) {
  const [form, setForm] = useState<Form>(VAZIO);
  const [erros, setErros] = useState<ErrosBriefing>({});
  const [publicoLivre, setPublicoLivre] = useState("");
  const [estado, setEstado] = useState<"parado" | "gerando" | "erro">("parado");
  const [mensagemErro, setMensagemErro] = useState("");
  const [resposta, setResposta] = useState<RespostaGeracao | null>(null);
  const resultadoRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));
  const alternar = <T,>(lista: T[], item: T) => (lista.includes(item) ? lista.filter((x) => x !== item) : [...lista, item]);

  function adicionarPublicoLivre() {
    const nome = publicoLivre.trim();
    if (nome.length < 2 || form.publicos.includes(nome) || form.publicos.length >= 4) return;
    set("publicos", [...form.publicos, nome]);
    setPublicoLivre("");
  }

  function usarSazonalidade(s: Sazonalidade) {
    setForm((f) => ({
      ...f,
      categoria: s.categorias[0],
      tipoProduto: s.tiposProduto[0],
      radarIds: f.radarIds.includes(s.id) ? f.radarIds : [...f.radarIds, s.id],
      observacoes: f.observacoes || `Ângulo da época: ${s.angulo}`,
    }));
    document.getElementById("cp-f-produto")?.focus();
  }

  function preencherExemplo() {
    const daqui30 = new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);
    setForm({
      ...VAZIO,
      produto: "Protetor solar FPS 50",
      categoria: "Protetor solar",
      descricao: "30% off no protetor solar FPS 50",
      precoDe: "79.90",
      precoPor: "55.90",
      condicao: "No app e nas lojas, enquanto durar o estoque.",
      validade: daqui30,
      publicos: publicos.slice(0, 2).map((p) => p.nome),
      canais: ["instagram", "site"],
      formatos: ["feed", "story", "banner"],
    });
    setErros({});
  }

  function paraBriefing(): BriefingEntrada {
    const num = (s: string) => (s.trim() ? Number(s.replace(",", ".")) : undefined);
    return {
      produto: form.produto,
      categoria: form.categoria,
      tipoProduto: form.tipoProduto,
      oferta: { descricao: form.descricao, precoDe: num(form.precoDe), precoPor: num(form.precoPor), condicao: form.condicao || undefined, validade: form.validade },
      publicos: form.publicos,
      canais: form.canais,
      formatos: form.formatos,
      objetivo: form.objetivo,
      variacoesPorCanal: form.variacoesPorCanal,
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
    try {
      const res = await fetch("/api/gerar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v.briefing) });
      const json = await res.json();
      if (!res.ok) {
        const err = json as ErroApi;
        if (err.campos) setErros(err.campos);
        throw new Error(err.erro);
      }
      setResposta(json as RespostaGeracao);
      setEstado("parado");
      requestAnimationFrame(() => resultadoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (err) {
      setMensagemErro(err instanceof Error && err.message !== "Failed to fetch" ? err.message : "Sem conexão com o servidor.");
      setEstado("erro");
    }
  }

  const sugeridos = publicos.filter((p) => !form.publicos.includes(p.nome));

  return (
    <div className="estudio">
      {sazonalidade.length ? (
        <section className="estudio-epoca" aria-labelledby="titulo-epoca">
          <div className="estudio-epoca-head">
            <h2 id="titulo-epoca" className="t-h2">
              Em alta nesta época
            </h2>
            <p className="t-body-sm t-muted">Condições de saúde que costumam aumentar agora e nos próximos dois meses. Fontes públicas.</p>
          </div>
          <ul className="estudio-epoca-lista">
            {sazonalidade.map((s) => (
              <li key={s.id} className="estudio-epoca-item">
                <div className="estudio-epoca-top">
                  <OriginTag origin="tendencia">Sazonalidade</OriginTag>
                  <span className="t-data t-muted">pico {s.mesesPico.map((m) => MESES[m - 1]).join(", ")}</span>
                </div>
                <h3 className="t-h3">{s.condicao}</h3>
                <p className="t-body-sm">{s.categorias.join(" · ")}</p>
                <p className="t-data t-muted">
                  {s.regiao} ·{" "}
                  <a href={s.fonteUrl} target="_blank" rel="noreferrer">
                    {s.fonte}
                  </a>
                </p>
                <Button variant="secondary" onClick={() => usarSazonalidade(s)} aria-pressed={form.radarIds.includes(s.id)}>
                  {form.radarIds.includes(s.id) ? "No briefing" : "Usar no briefing"}
                </Button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <form className="estudio-form" onSubmit={gerar} noValidate aria-labelledby="titulo-briefing">
        <div className="estudio-form-head">
          <h2 id="titulo-briefing" className="t-h2">
            Briefing
          </h2>
          <Button variant="ghost" onClick={preencherExemplo}>
            Preencher exemplo
          </Button>
        </div>

        <fieldset className="estudio-grupo">
          <legend className="estudio-legenda">Produto e oferta</legend>
          <div className="estudio-grade">
            <Field id="cp-f-produto" label="Produto" value={form.produto} onChange={(e) => set("produto", e.target.value)} error={erros.produto} placeholder="Protetor solar FPS 50" />
            <Field label="Categoria" value={form.categoria} onChange={(e) => set("categoria", e.target.value)} error={erros.categoria} placeholder="Protetor solar" />
            <Field
              as="select"
              label="Tipo de produto"
              value={form.tipoProduto}
              onChange={(e) => set("tipoProduto", e.target.value as TipoProduto)}
              hint={form.tipoProduto === "medicamento_prescricao" ? "Não pode ter propaganda para o público. As peças sairão bloqueadas." : form.tipoProduto === "medicamento_isento" ? "As peças levam a advertência obrigatória da Anvisa." : undefined}
            >
              {TIPOS_PRODUTO.map((t) => (
                <option key={t} value={t}>
                  {ROTULOS.tipoProduto[t]}
                </option>
              ))}
            </Field>
            <Field label="Oferta" value={form.descricao} onChange={(e) => set("descricao", e.target.value)} error={erros["oferta.descricao"]} placeholder="30% off no protetor FPS 50" />
            <Field label="Preço normal (R$)" inputMode="decimal" value={form.precoDe} onChange={(e) => set("precoDe", e.target.value)} error={erros["oferta.precoDe"]} placeholder="79,90" />
            <Field label="Preço da oferta (R$)" inputMode="decimal" value={form.precoPor} onChange={(e) => set("precoPor", e.target.value)} error={erros["oferta.precoPor"]} placeholder="55,90" />
            <Field label="Validade da oferta" type="date" value={form.validade} onChange={(e) => set("validade", e.target.value)} error={erros["oferta.validade"] && "Informe até quando a oferta vale."} />
            <Field label="Condição" value={form.condicao} onChange={(e) => set("condicao", e.target.value)} placeholder="No app e nas lojas, enquanto durar o estoque" />
          </div>
        </fieldset>

        <fieldset className="estudio-grupo" aria-describedby="hint-publicos">
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
        </fieldset>

        <fieldset className="estudio-grupo">
          <legend className="estudio-legenda">Canais e formatos</legend>
          <div className="estudio-grade">
            <Opcoes rotulo="Canais" erro={erros.canais} itens={CANAIS} nomes={ROTULOS.canal} escolhidos={form.canais} alternar={(c) => set("canais", alternar(form.canais, c))} />
            <Opcoes rotulo="Formatos" erro={erros.formatos} itens={FORMATOS} nomes={ROTULOS.formato} escolhidos={form.formatos} alternar={(f) => set("formatos", alternar(form.formatos, f))} />
            <Field as="select" label="Objetivo" value={form.objetivo} onChange={(e) => set("objetivo", e.target.value as Objetivo)}>
              {OBJETIVOS.map((o) => (
                <option key={o} value={o}>
                  {ROTULOS.objetivo[o]}
                </option>
              ))}
            </Field>
            <Field as="select" label="Variações por canal e público" value={String(form.variacoesPorCanal)} onChange={(e) => set("variacoesPorCanal", Number(e.target.value))}>
              {[3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Field>
          </div>
          <label className="estudio-check">
            <input type="checkbox" checked={form.incluirRoteiros} onChange={(e) => set("incluirRoteiros", e.target.checked)} />
            Incluir roteiro de vídeo curto (Reels ou TikTok) com sugestão de música
          </label>
          <Field as="textarea" label="Observações" value={form.observacoes} onChange={(e) => set("observacoes", e.target.value)} placeholder="Algo que a peça precisa ou não pode dizer" />
        </fieldset>

        <div className="estudio-acoes">
          <Button variant="capsula" type="submit" disabled={estado === "gerando"} icon={estado === "gerando" ? "clock" : "arrow"}>
            {estado === "gerando" ? "Gerando variações…" : "Gerar variações"}
          </Button>
          <p className="t-body-sm t-muted" aria-live="polite">
            {estado === "gerando" ? "Consultando a memória, o radar e o modelo. Leva alguns segundos." : null}
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
        {resposta ? <Galeria key={resposta.geradoEm} resposta={resposta} /> : null}
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
