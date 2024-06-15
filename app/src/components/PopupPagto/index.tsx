import { Row } from "react-bootstrap";
import { strValue, themeColors } from "../../functions/utils";
import CenteredModal from "../CenteredModal";
import { useState } from "react";

interface PopupProps {
  id: number;
  status: string;
  lancto_: any;
  tpsAcrDesc: any;
  handlePopupAction: (lancto: any) => void;
  handleCancel: () => void;
}

export default function PopupPagto({
  id,
  status,
  lancto_,
  tpsAcrDesc,
  handlePopupAction,
  handleCancel,
}: PopupProps) {
  const theme = themeColors();

  const [lancto, setLancto] = useState({ ...lancto_ });

  const handleInputChange = (event: any) => {
    var { name, value } = event.target;

    if (name == "vlLancto_") {
      value = Math.round(value * 100) / 100;
    } else if (name == "parcelas") {
      value = value.replace(",", "").replace(".", "");
    } else if (name == "tpAcrDesc") {
      var vlAcrescimo = 0;
      var vlDesconto = 0;

      if (value == "A") {
        vlAcrescimo = lancto.vlExtra;
        lancto.vlTotal = lancto.vlLancto + lancto.vlExtra;
      } else {
        vlDesconto = lancto.vlExtra;
        lancto.vlTotal = lancto.vlLancto - lancto.vlExtra;
      }

      lancto.vlAcrescimo = vlAcrescimo;
      lancto.vlDesconto = vlDesconto;
    } else if (name == "vlExtra") {
      value = parseFloat(value);

      if (lancto.tpAcrDesc == "A") {
        lancto.vlAcrescimo = value;
        lancto.vlTotal = lancto.vlLancto + value;
      } else {
        lancto.vlDesconto = value;
        lancto.vlTotal = lancto.vlLancto - value;
      }
    } else if (name == "flgDiasUteis") {
      value = !lancto.flgDiasUteis;
    } else if (name == "flgUpdateAll") {
      value = !lancto.flgUpdateAll;
    } else if (name == "flgGerarParcela") {
      value = !lancto.flgGerarParcela;
    } else if (name == "flgDifFinal") {
      value = !lancto.flgDifFinal;
    }

    setLancto({ ...lancto, [name]: value });
  };

  {
    /* Popup Baixar/Visualizar */
  }

  return (
    <CenteredModal
      tamanho="lg"
      backdrop="static"
      titulo={status === "payment" ? "Baixar" : "Dados do Lançamento"}
      corTitulo={theme.colors.blue12}
      conteudo={""}
      corConteudo={theme.colors.gray11}
      closeButton={false}
      thumbsUp={false}
      thumbsDown={false}
      floppy={status === "payment"}
      cancel={true}
      show={true}
      onConfirm={() => handlePopupAction(lancto)}
      onHide={() => handleCancel()}
    >
      <Row>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="descricao" className="control-label">
              Descrição
            </label>
            <input
              className="form-control"
              name="descricao"
              id="descricao"
              type="text"
              disabled
              value={`${lancto.descricao}`}
            />
          </div>
        </div>

        <div className="col-3">
          <div className="form-group">
            <label htmlFor="parcela" className="control-label">
              Parcela
            </label>
            <input
              className="form-control"
              name="parcela"
              id="parcela"
              type="text"
              disabled
              value={lancto.descrParcelas.replace("(", "").replace(")", "")}
            />
          </div>
        </div>

        <div className="col-3">
          <div className="form-group">
            <label htmlFor="dtVencto" className="control-label">
              Data Vencimento
            </label>
            <input
              className="form-control"
              name="dtVencto"
              id="dtVencto"
              type="date"
              disabled
              value={lancto.dtVencto.substring(0, 10)}
            />
          </div>
        </div>

        <div className="col-3">
          <div className="form-group">
            <label htmlFor="vlLancto" className="control-label">
              Valor
            </label>
            <input
              className="form-control"
              name="vlLancto"
              id="vlLancto"
              disabled
              value={strValue(lancto.vlLancto)}
            />
          </div>
        </div>

        <div className="col-3">
          <div className="form-group">
            <label htmlFor="tipo" className="control-label">
              Situação
            </label>
            <input
              className="form-control"
              name="tipo"
              id="tipo"
              disabled
              value={lancto.tipo}
            />
          </div>
        </div>

        {(status === "payment" || lancto.flPago) && (
          <>
            <div className="col-3">
              <div className="form-group">
                <label htmlFor="dtPagto" className="control-label">
                  Data Pagamento
                </label>
                <input
                  className="form-control"
                  name="dtPagto"
                  id="dtPagto"
                  type="date"
                  required
                  autoFocus
                  disabled={status !== "payment"}
                  value={lancto.dtPagto ? lancto.dtPagto.substring(0, 10) : ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="col-3">
              <div className="form-group">
                <label htmlFor="tpAcrDesc" className="control-label">
                  Acréscimo/Desconto
                </label>
                <select
                  name="tpAcrDesc"
                  id="tpAcrDesc"
                  className="form-control"
                  value={lancto.tpAcrDesc}
                  disabled={status !== "payment"}
                  onChange={handleInputChange}
                >
                  {tpsAcrDesc.map((tpAcrDesc: any) => {
                    const { key, value } = tpAcrDesc;
                    return (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="col-3">
              <div className="form-group">
                <label htmlFor="vlExtra" className="control-label">
                  Valor A/D
                </label>
                <input
                  className="form-control"
                  name="vlExtra"
                  id="vlExtra"
                  type={status == "payment" ? "number" : "text"}
                  required
                  min={0}
                  step={0.01}
                  pattern="([0-9]{1,3}).([0-9]{1,3})"
                  value={
                    status == "payment"
                      ? lancto.vlExtra
                      : strValue(lancto.vlExtra)
                  }
                  disabled={status !== "payment"}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="col-3">
              <div className="form-group">
                <label htmlFor="vlTotal" className="control-label">
                  Valor Total
                </label>
                <input
                  className="form-control"
                  name="vlTotal"
                  id="vlTotal"
                  value={strValue(lancto.vlTotal)}
                  disabled
                />
              </div>
            </div>
          </>
        )}
      </Row>
    </CenteredModal>
  );
}
