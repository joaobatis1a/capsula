import { Forma } from "@/components/ds";
import { getDataSource } from "@/lib/data";
import { provedorAtivo } from "@/lib/llm/client";

/* Estado real do sistema, no cabeçalho: de onde vêm os dados e qual modelo escreve as peças.
   Sem chave de modelo, o motor usa moldes fixos, e a tela diz isso em vez de esconder. */

export function StatusDoSistema() {
  const fonte = getDataSource();
  const modelo = provedorAtivo();
  const sintetico = fonte.origem === "sintetico";

  return (
    <div className="status">
      <button type="button" className="status-botao" aria-describedby="status-detalhe">
        <Forma tipo={modelo ? "capsula" : "comprimido"} size={18} />
        <span className="status-texto">
          <span>{sintetico ? "Dados de teste" : "Dados reais"}</span>
          <span className="status-sep" aria-hidden="true" />
          <span className={modelo ? "status-modelo is-ia" : "status-modelo"}>{modelo ? `IA: ${modelo}` : "Sem IA"}</span>
        </span>
      </button>
      <div id="status-detalhe" role="tooltip" className="status-detalhe">
        <p className="cp-bula-label">Estado do sistema</p>
        <dl>
          <div>
            <dt>Dados</dt>
            <dd>{sintetico ? "Histórico sintético de 300 campanhas. Os números não são de nenhuma empresa." : `Fonte: ${fonte.nome}.`}</dd>
          </div>
          <div>
            <dt>Modelo</dt>
            <dd>{modelo ? `${modelo} escreve as peças, com reserva automática se a cota acabar.` : "Nenhuma chave configurada: as peças saem de moldes fixos, guiados pelo ranking."}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
