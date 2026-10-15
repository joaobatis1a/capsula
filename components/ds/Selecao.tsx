"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cx, Icon } from "./Icon";
import "./selecao.css";

/* Seletor da Cápsula: no lugar do <select> nativo, cuja lista abre seca, do jeito do navegador.
   Abre com um movimento suave, cada opção entra em sequência e o teclado funciona por inteiro
   (setas, Home, End, Enter, Espaço, Esc e digitar a primeira letra). Padrão ARIA de combobox só de seleção. */

export interface OpcaoSelecao<T extends string> {
  valor: T;
  nome: string;
  descricao?: string;
}

export function Selecao<T extends string>({
  rotulo,
  opcoes,
  valor,
  mudar,
  id,
  dica,
  erro,
  className,
}: {
  rotulo: string;
  opcoes: OpcaoSelecao<T>[];
  valor: T;
  mudar: (v: T) => void;
  id?: string;
  dica?: string;
  erro?: string;
  className?: string;
}) {
  const auto = useId();
  const base = id ?? `sel-${auto.replace(/:/g, "")}`;
  const listaId = `${base}-lista`;
  const [aberto, setAberto] = useState(false);
  const [ativo, setAtivo] = useState(0);
  const [acima, setAcima] = useState(false);
  const caixa = useRef<HTMLDivElement>(null);
  const botao = useRef<HTMLButtonElement>(null);
  const busca = useRef({ texto: "", t: 0 });

  const atual = opcoes.find((o) => o.valor === valor) ?? opcoes[0];
  const indiceAtual = Math.max(0, opcoes.findIndex((o) => o.valor === valor));

  // Fecha ao clicar fora.
  useEffect(() => {
    if (!aberto) return;
    const fora = (e: PointerEvent) => {
      if (!caixa.current?.contains(e.target as Node)) setAberto(false);
    };
    document.addEventListener("pointerdown", fora);
    return () => document.removeEventListener("pointerdown", fora);
  }, [aberto]);

  // Mantém a opção ativa à vista quando a lista rola.
  useEffect(() => {
    if (aberto) document.getElementById(`${base}-op-${ativo}`)?.scrollIntoView({ block: "nearest" });
  }, [aberto, ativo, base]);

  function abrir() {
    const r = botao.current?.getBoundingClientRect();
    // Abre para cima quando não cabe embaixo.
    setAcima(r ? window.innerHeight - r.bottom < Math.min(opcoes.length * 52 + 24, 340) && r.top > window.innerHeight - r.bottom : false);
    setAtivo(indiceAtual);
    setAberto(true);
  }

  function escolher(i: number) {
    mudar(opcoes[i].valor);
    setAberto(false);
    botao.current?.focus();
  }

  function teclado(e: React.KeyboardEvent) {
    const ultimo = opcoes.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!aberto) abrir();
        else setAtivo((a) => Math.min(ultimo, a + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!aberto) abrir();
        else setAtivo((a) => Math.max(0, a - 1));
        break;
      case "Home":
        if (aberto) {
          e.preventDefault();
          setAtivo(0);
        }
        break;
      case "End":
        if (aberto) {
          e.preventDefault();
          setAtivo(ultimo);
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (aberto) escolher(ativo);
        else abrir();
        break;
      case "Escape":
        if (aberto) {
          e.preventDefault();
          setAberto(false);
        }
        break;
      case "Tab":
        setAberto(false);
        break;
      default:
        // Digitar a primeira letra pula para a opção que começa com ela.
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const agora = Date.now();
          busca.current.texto = agora - busca.current.t > 700 ? e.key.toLowerCase() : busca.current.texto + e.key.toLowerCase();
          busca.current.t = agora;
          const i = opcoes.findIndex((o) => o.nome.toLowerCase().startsWith(busca.current.texto));
          if (i >= 0) {
            if (!aberto) abrir();
            setAtivo(i);
          }
        }
    }
  }

  return (
    <div className={cx("cp-field", "sel", erro && "is-error", className)} ref={caixa}>
      <span className="cp-label" id={`${base}-rotulo`}>
        {rotulo}
      </span>
      <div className={cx("sel-caixa", aberto && "is-aberto", acima && "is-acima")}>
        <button
          ref={botao}
          id={base}
          type="button"
          role="combobox"
          className="sel-botao"
          aria-haspopup="listbox"
          aria-expanded={aberto}
          aria-controls={listaId}
          aria-labelledby={`${base}-rotulo ${base}`}
          aria-activedescendant={aberto ? `${base}-op-${ativo}` : undefined}
          aria-invalid={erro ? true : undefined}
          onClick={() => (aberto ? setAberto(false) : abrir())}
          onKeyDown={teclado}
        >
          <span className="sel-valor">{atual?.nome}</span>
          <span className="sel-seta" aria-hidden="true" />
        </button>

        <ul id={listaId} role="listbox" aria-labelledby={`${base}-rotulo`} className="sel-lista" tabIndex={-1}>
          {opcoes.map((o, i) => (
            <li
              key={o.valor}
              id={`${base}-op-${i}`}
              role="option"
              aria-selected={o.valor === valor}
              className={cx("sel-op", i === ativo && "is-ativo", o.valor === valor && "is-escolhida")}
              style={{ "--i": i } as React.CSSProperties}
              onPointerEnter={() => setAtivo(i)}
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => escolher(i)}
            >
              <span className="sel-op-texto">
                <span>{o.nome}</span>
                {o.descricao ? <small>{o.descricao}</small> : null}
              </span>
              {o.valor === valor ? <Icon name="check" size={16} /> : null}
            </li>
          ))}
        </ul>
      </div>
      {erro ? (
        <p className="cp-hint cp-hint-error">
          <Icon name="x" size={14} />
          {erro}
        </p>
      ) : dica ? (
        <p className="cp-hint">{dica}</p>
      ) : null}
    </div>
  );
}
