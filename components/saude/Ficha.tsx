"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button, Icon, OriginTag } from "@/components/ds";
import { FaixaAno } from "./FaixaAno";
import type { Sazonalidade } from "@/lib/data/types";
import { REGIOES, ROTULO_AGENTE, ROTULO_CATEGORIA, ROTULO_REGIAO, intensidadeDe } from "@/lib/saude/rotulos";
import { ROTULOS } from "@/types/briefing";

/* Ficha de uma condição: o ano, quem sente mais, como se prevenir, o que a farmácia oferece e como comunicar. */

export function Ficha({ item, mes, onFechar }: { item: Sazonalidade | null; mes: number; onFechar: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (item && !d.open) d.showModal();
    if (!item && d.open) d.close();
  }, [item]);

  function fechar() {
    const d = ref.current;
    if (!d || !d.open) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return d.close();
    d.classList.add("is-fechando");
    d.addEventListener(
      "animationend",
      () => {
        d.classList.remove("is-fechando");
        d.close();
      },
      { once: true },
    );
  }

  return (
    <dialog
      ref={ref}
      className="galeria-dialogo ficha"
      aria-label={item ? `Ficha: ${item.condicao}` : "Ficha"}
      onClose={onFechar}
      onCancel={(e) => {
        e.preventDefault();
        fechar();
      }}
      onClick={(e) => e.target === ref.current && fechar()}
    >
      {item ? (
        <div className="ficha-corpo">
          <div className="ficha-topo">
            <div className="ficha-etiquetas">
              <OriginTag origin="tendencia">{ROTULO_CATEGORIA[item.categoriaSaude]}</OriginTag>
              <span className="ficha-agente">{ROTULO_AGENTE[item.agente]}</span>
            </div>
            <Button variant="ghost" icon="x" onClick={fechar}>
              Fechar
            </Button>
          </div>

          <header className="ficha-titulo">
            <h2 className="t-h1">{item.condicao}</h2>
            <p>{item.resumo}</p>
          </header>

          <section className="ficha-bloco" aria-labelledby="ficha-ano">
            <h3 id="ficha-ano" className="cp-bula-label">
              Ao longo do ano
            </h3>
            <div className="ficha-regioes">
              <FaixaAno intensidade={item.intensidade} mes={mes} rotulos nome={`${item.condicao}, padrão geral`} />
              {item.porRegiao
                ? REGIOES.map((r) => (
                    <div key={r} className="ficha-regiao">
                      <span className="ficha-regiao-nome">{ROTULO_REGIAO[r]}</span>
                      <FaixaAno intensidade={intensidadeDe(item, r)} mes={mes} nome={`${item.condicao}, ${ROTULO_REGIAO[r]}`} />
                    </div>
                  ))
                : null}
            </div>
            <p className="t-body-sm t-muted">{item.regiao}</p>
            <p className="t-caption t-muted">Faixas aproximadas, a partir de fontes públicas, de janeiro a dezembro. Confira o boletim vigente.</p>
          </section>

          <div className="ficha-duas">
            <Lista titulo="Quem mais sente" itens={item.gruposRisco} />
            <Lista titulo="Sintomas mais comuns" itens={item.sintomas} nota="Para reconhecer o assunto. A peça nunca faz diagnóstico." />
          </div>

          <section className="ficha-bloco">
            <h3 className="cp-bula-label">Prevenção</h3>
            <ul className="ficha-checks">
              {item.prevencao.map((p) => (
                <li key={p}>
                  <Icon name="check" size={16} />
                  {p}
                </li>
              ))}
            </ul>
            {item.vacina ? (
              <p className="ficha-vacina t-body-sm">
                <Icon name="shield" size={16} />
                <span>
                  <b>Vacina.</b> {item.vacina}
                </span>
              </p>
            ) : null}
          </section>

          <section className="ficha-bloco ficha-farmacia">
            <h3 className="cp-bula-label">O que a farmácia pode oferecer</h3>
            <div className="ficha-chips">
              {item.categorias.map((c) => (
                <span key={c} className="ficha-chip">
                  {c}
                </span>
              ))}
            </div>
            <p className="t-body-sm">
              <b>Exemplos:</b> {item.produtosExemplo.join(", ")}.
            </p>
            <p className="t-body-sm">
              <b>Tipos de produto:</b> {item.tiposProduto.map((t) => ROTULOS.tipoProduto[t]).join(" · ")}
            </p>
            <p className="t-body-sm">
              <b>Públicos que mais combinam:</b> {item.publicos.join(" · ")}
            </p>
          </section>

          <section className="ficha-bloco">
            <h3 className="cp-bula-label">Como comunicar</h3>
            <p>{item.angulo}</p>
            <p className="ficha-cuidado t-body-sm">
              <Icon name="x" size={16} />
              <span>{item.cuidado}</span>
            </p>
          </section>

          <section className="ficha-bloco">
            <h3 className="cp-bula-label">Fontes</h3>
            <ul className="ficha-fontes">
              {item.fontes.map((f) => (
                <li key={f.nome} className="t-data">
                  {f.url ? (
                    <a href={f.url} target="_blank" rel="noreferrer">
                      {f.nome}
                    </a>
                  ) : (
                    f.nome
                  )}
                </li>
              ))}
            </ul>
          </section>

          <div className="ficha-acoes">
            <Link href={`/?saude=${item.id}#briefing`} className="cp-btn cp-btn-primary" onClick={fechar}>
              <Icon name="spark" size={18} />
              <span>Criar briefing com este tema</span>
            </Link>
            <p className="t-caption t-muted">Conteúdo informativo para planejar campanhas. Não substitui a orientação de um profissional de saúde.</p>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}

function Lista({ titulo, itens, nota }: { titulo: string; itens: string[]; nota?: string }) {
  return (
    <section className="ficha-bloco">
      <h3 className="cp-bula-label">{titulo}</h3>
      <ul className="ficha-pontos">
        {itens.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
      {nota ? <p className="t-caption t-muted">{nota}</p> : null}
    </section>
  );
}
