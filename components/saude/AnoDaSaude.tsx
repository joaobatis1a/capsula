"use client";

import { useMemo, useState } from "react";
import { Forma, Icon } from "@/components/ds";
import { Interruptor } from "@/components/estudio/Controles";
import { Revela } from "@/components/motion/Revela";
import { AGENTES, CATEGORIAS_SAUDE, REGIOES, type Agente, type CategoriaSaude, type DataSaude, type Regiao, type Sazonalidade } from "@/lib/data/types";
import { atencao, intensidadeDe, MESES_CURTOS, MESES_NOME, NIVEL, ROTULO_AGENTE, ROTULO_CATEGORIA, ROTULO_REGIAO } from "@/lib/saude/rotulos";
import { Ficha } from "./Ficha";
import "./saude.css";

/* Ano da saúde: a base de condições com sazonalidade, filtrável por tema, causa, região e mês,
   com a ficha de cada uma e o calendário de campanhas. */

const sem = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function AnoDaSaude({ itens, datas, mesAtual }: { itens: Sazonalidade[]; datas: DataSaude[]; mesAtual: number }) {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState<CategoriaSaude | "todas">("todas");
  const [agente, setAgente] = useState<Agente | "todos">("todos");
  const [regiao, setRegiao] = useState<Regiao | "todas">("todas");
  const [mes, setMes] = useState(mesAtual);
  const [soAlta, setSoAlta] = useState(false);
  const [ordem, setOrdem] = useState<"az" | "mes">("mes");
  const [abertaId, setAbertaId] = useState<string | null>(null);

  const indice = useMemo(() => itens.map((s) => ({ s, texto: sem([s.condicao, s.resumo, ...s.sintomas, ...s.categorias, ...s.produtosExemplo, ROTULO_CATEGORIA[s.categoriaSaude]].join(" ")) })), [itens]);

  const nivel = (s: Sazonalidade) => intensidadeDe(s, regiao)[mes - 1];
  const filtrados = useMemo(() => {
    const q = sem(busca.trim());
    const lista = indice
      .filter(({ s, texto }) => (categoria === "todas" || s.categoriaSaude === categoria) && (agente === "todos" || s.agente === agente) && (!q || texto.includes(q)))
      .map(({ s }) => s)
      .filter((s) => !soAlta || intensidadeDe(s, regiao)[mes - 1] >= 2);
    return ordem === "az" ? lista : [...lista].sort((a, b) => nivel(b) - nivel(a) || a.condicao.localeCompare(b.condicao, "pt-BR"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indice, busca, categoria, agente, soAlta, ordem, regiao, mes]);

  const noPico = itens.filter((s) => intensidadeDe(s, regiao)[mes - 1] === 3);
  const emAlta = itens.filter((s) => intensidadeDe(s, regiao)[mes - 1] >= 2);
  const proximos = itens.filter((s) => atencao(s, mes, regiao) >= 2 && intensidadeDe(s, regiao)[mes - 1] < 2);
  const contagem = (c: CategoriaSaude) => itens.filter((s) => s.categoriaSaude === c).length;
  const aberta = itens.find((s) => s.id === abertaId) ?? null;
  const assinatura = `${categoria}-${agente}-${regiao}-${soAlta}-${ordem}-${busca}`;
  const datasDoMes = datas.filter((d) => d.mes === mes);

  return (
    <div className="saude">
      <Revela as="section" className="saude-numeros" aria-label="Resumo">
        <Numero valor={itens.length} rotulo="condições na base" />
        <Numero valor={CATEGORIAS_SAUDE.length} rotulo="grupos de saúde" />
        <Numero valor={emAlta.length} rotulo={`em alta em ${MESES_NOME[mes - 1]}`} destaque />
        <Numero valor={noPico.length} rotulo="no pico do mês" destaque />
      </Revela>

      <Revela as="section" i={1} className="painel saude-controles" aria-label="Filtros">
        <div className="saude-busca">
          <Icon name="archive" size={18} />
          <input
            className="cp-input"
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Busque por condição, sintoma ou produto: dengue, tosse, repelente…"
            aria-label="Buscar na base de sazonalidade"
          />
        </div>

        <Grupo rotulo="Tema">
          <Chip ativo={categoria === "todas"} onClick={() => setCategoria("todas")}>
            Todos <small>{itens.length}</small>
          </Chip>
          {CATEGORIAS_SAUDE.map((c) => (
            <Chip key={c} ativo={categoria === c} onClick={() => setCategoria(c)}>
              {ROTULO_CATEGORIA[c]} <small>{contagem(c)}</small>
            </Chip>
          ))}
        </Grupo>
        <Grupo rotulo="Causa">
          <Chip ativo={agente === "todos"} onClick={() => setAgente("todos")}>
            Todas
          </Chip>
          {AGENTES.map((a) => (
            <Chip key={a} ativo={agente === a} onClick={() => setAgente(a)}>
              {ROTULO_AGENTE[a]}
            </Chip>
          ))}
        </Grupo>
        <Grupo rotulo="Região">
          <Chip ativo={regiao === "todas"} onClick={() => setRegiao("todas")}>
            Brasil
          </Chip>
          {REGIOES.map((r) => (
            <Chip key={r} ativo={regiao === r} onClick={() => setRegiao(r)}>
              {ROTULO_REGIAO[r]}
            </Chip>
          ))}
        </Grupo>
        <div className="saude-linha-opcoes">
          <Interruptor ligado={soAlta} mudar={setSoAlta}>
            Só o que está em alta em {MESES_NOME[mes - 1]}
          </Interruptor>
          <Grupo rotulo="Ordenar">
            <Chip ativo={ordem === "mes"} onClick={() => setOrdem("mes")}>
              Mais intenso no mês
            </Chip>
            <Chip ativo={ordem === "az"} onClick={() => setOrdem("az")}>
              A a Z
            </Chip>
          </Grupo>
        </div>
      </Revela>

      <Revela as="section" i={2} className="saude-mes" aria-live="polite">
        <p className="receita-olho">Mês escolhido · {MESES_NOME[mes - 1]}</p>
        <p className="saude-mes-texto">
          {noPico.length ? (
            <>
              No pico: {noPico.slice(0, 5).map((s, i) => (
                <span key={s.id}>
                  {i ? ", " : ""}
                  <button type="button" className="saude-link" onClick={() => setAbertaId(s.id)}>
                    {s.condicao}
                  </button>
                </span>
              ))}
              {noPico.length > 5 ? ` e mais ${noPico.length - 5}` : ""}.
            </>
          ) : (
            "Nenhuma condição da base no pico neste mês e nesta região."
          )}
          {proximos.length ? (
            <span className="saude-prox">
              {" "}
              Vem aí no mês seguinte: {proximos.slice(0, 3).map((s) => s.condicao).join(", ")}
              {proximos.length > 3 ? ` e mais ${proximos.length - 3}` : ""}.
            </span>
          ) : null}
        </p>
        {datasDoMes.length ? (
          <p className="saude-mes-datas t-body-sm">
            <Icon name="clock" size={16} />
            {datasDoMes.map((d) => `${d.nome} (${d.tema.toLowerCase()})`).join(" · ")}
          </p>
        ) : null}
      </Revela>

      <Revela as="section" i={3} className="painel saude-tabela-caixa" aria-label="Sazonalidade por mês">
        <div className="saude-rolagem">
        <table className="saude-tabela" key={assinatura}>
          <caption className="sr-only">Intensidade de cada condição por mês, de janeiro a dezembro. Clique no mês para ver o que está em alta.</caption>
          <thead>
            <tr>
              <th scope="col" className="saude-th-nome">
                {filtrados.length} {filtrados.length === 1 ? "condição" : "condições"}
              </th>
              {MESES_CURTOS.map((m, i) => (
                <th key={m} scope="col" className={`saude-th-mes${mes === i + 1 ? " is-sel" : ""}${mesAtual === i + 1 ? " is-hoje" : ""}`}>
                  <button type="button" onClick={() => setMes(i + 1)} aria-pressed={mes === i + 1} aria-label={`${MESES_NOME[i]}${mesAtual === i + 1 ? " (mês atual)" : ""}`}>
                    {m}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map((s, l) => {
              const v = intensidadeDe(s, regiao);
              return (
                <tr key={s.id} className="saude-linha" style={{ "--l": Math.min(l, 14) } as React.CSSProperties}>
                  <th scope="row" className="saude-td-nome">
                    <button type="button" onClick={() => setAbertaId(s.id)}>
                      <span className="saude-nome">{s.condicao}</span>
                      <span className="saude-sub">{ROTULO_CATEGORIA[s.categoriaSaude]}</span>
                    </button>
                  </th>
                  {v.map((n, i) => (
                    <td key={i} className={`saude-celula n${n}${mes === i + 1 ? " is-mes" : ""}`} style={{ "--c": i } as React.CSSProperties}>
                      <span className="sr-only">
                        {MESES_NOME[i]}: {NIVEL[n].toLowerCase()}
                      </span>
                      <span className="saude-bloco" aria-hidden="true" title={`${s.condicao} · ${MESES_NOME[i]}: ${NIVEL[n].toLowerCase()}`} />
                    </td>
                  ))}
                </tr>
              );
            })}
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={13} className="saude-vazio">
                  <Forma tipo="comprimido" size={56} />
                  Nenhuma condição com esses filtros. Tire um filtro ou procure por outro termo.
                  <button
                    type="button"
                    className="saude-link"
                    onClick={() => {
                      setBusca("");
                      setCategoria("todas");
                      setAgente("todos");
                      setSoAlta(false);
                    }}
                  >
                    Limpar filtros
                  </button>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        </div>
        <ul className="saude-legenda" aria-label="Legenda">
          {[1, 2, 3].map((n) => (
            <li key={n}>
              <span className={`saude-bloco n${n}`} aria-hidden="true" /> {NIVEL[n]}
            </li>
          ))}
          <li>
            <span className="saude-bloco n0" aria-hidden="true" /> Fora de época
          </li>
          <li className="t-muted">Faixas aproximadas, a partir de fontes públicas. Confira o boletim vigente antes de publicar.</li>
        </ul>
      </Revela>

      <Revela as="section" i={4} className="painel saude-datas" aria-labelledby="titulo-datas">
        <h2 id="titulo-datas" className="t-h2">
          Calendário de campanhas de saúde
        </h2>
        <p className="t-body-sm t-muted">Datas e temas divulgados pelo Ministério da Saúde. A marca informa e convida, sem pegar carona na causa.</p>
        <ol className="saude-datas-lista">
          {MESES_CURTOS.map((m, i) => {
            const doMes = datas.filter((d) => d.mes === i + 1);
            return (
              <li key={m} className={`saude-datas-mes${mes === i + 1 ? " is-sel" : ""}`}>
                <button type="button" className="saude-datas-topo" onClick={() => setMes(i + 1)} aria-pressed={mes === i + 1}>
                  {MESES_NOME[i]}
                </button>
                {doMes.length ? (
                  doMes.map((d) => (
                    <div key={d.id} className="saude-data">
                      <p className="saude-data-nome">{d.nome}</p>
                      <p className="t-body-sm">{d.tema}</p>
                      <p className="t-caption t-muted">{d.foco.join(" · ")}</p>
                    </div>
                  ))
                ) : (
                  <p className="t-caption t-muted">Sem campanha nacional fixa.</p>
                )}
              </li>
            );
          })}
        </ol>
      </Revela>

      <Ficha item={aberta} mes={mes} onFechar={() => setAbertaId(null)} />
    </div>
  );
}

function Numero({ valor, rotulo, destaque }: { valor: number; rotulo: string; destaque?: boolean }) {
  return (
    <div className={destaque ? "saude-numero is-destaque tem-forma" : "saude-numero"}>
      {destaque ? <Forma tipo="efervescente" size={34} className="saude-numero-forma" /> : null}
      <b key={valor}>{valor}</b>
      <span>{rotulo}</span>
    </div>
  );
}

function Grupo({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="saude-grupo" role="group" aria-label={rotulo}>
      <span className="cp-label">{rotulo}</span>
      <ul className="estudio-chips">{children}</ul>
    </div>
  );
}

function Chip({ ativo, onClick, children }: { ativo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <li>
      <button type="button" className={ativo ? "estudio-chip is-on" : "estudio-chip"} aria-pressed={ativo} onClick={onClick}>
        {children}
      </button>
    </li>
  );
}
