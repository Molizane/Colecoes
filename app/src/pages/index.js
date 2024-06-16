import { useEffect, useState } from "react";
import { Calendar } from "react-multi-date-picker";
import { Row } from "react-bootstrap";
import { Tooltip } from "react-tooltip";
// import { BsCalendar3 } from "react-icons/bs";

import { AiFillDollarCircle, AiFillEye } from "react-icons/ai";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as TooltipJS,
  Legend,
} from "chart.js";

import gregorian_pt_br from "react-date-object/locales/gregorian_pt_br";

import styles from "../styles/Home.module.scss";
import lanctoService from "../services/LanctoService";
import { strDate, strValue, themeColors } from "../functions/utils";
import LanctoObj from "../classes/LanctoObj";
import CenteredModal from "../components/CenteredModal";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  TooltipJS,
  Legend
);

const options = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    legend: { position: "top", display: false },
    title: { display: true, text: "Movimento Mensal" },
  },
};

const meses = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

const tpsAcrDesc = [
  { key: "D", value: "Desconto" },
  { key: "A", value: "Acréscimo" },
];

const Home = () => {
  const theme = themeColors();
  const [data, setData] = useState(Date.now);
  const [isLoading, setIsLoading] = useState(true);
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear());
  const [mesAtual, setMesAtual] = useState(new Date().getMonth() + 1);
  const [dsExtrato, setDsExtrato] = useState([]);
  const [grafico, setGrafico] = useState({
    labels: ["1", "2", "3"],
    datasets: [
      {
        data: [2, 4, 6],
        backgroundColor: ["red"],
        borderWidth: 1,
      },
    ],
  });

  const [modalBaixarShow, setModalBaixarShow] = useState(false);
  const [status, setStatus] = useState("");
  const [lancto, setLancto] = useState(LanctoObj());
  const [refresh, setRefresh] = useState(false);

  const [op, setOp] = useState("");
  const [referencia, setReferencia] = useState("");
  const [saldoNegativo, setSaldoNegativo] = useState("");

  const handleVencto = async function (id, parcela, op, referencia) {
    document.activeElement.blur();
    var reg = {};

    setOp(op);
    setReferencia(referencia);

    switch (referencia) {
      case "A": // Vencidos antes do mês atual
        reg = dsExtrato.vencidos.find(
          (r) => r.id == id && r.parcela == parcela
        );
        break;

      case "V": // Vencidos no mês
        reg = dsExtrato.vencidosNoMes.find(
          (r) => r.id == id && r.parcela == parcela
        );
        break;

      case "F": // Vencendo após a data atual
        reg = dsExtrato.vencendoNoMes.find(
          (r) => r.id == id && r.parcela == parcela
        );

      default: // "H": // Vencendo na data
        reg = dsExtrato.vencendo.find(
          (r) => r.id == id && r.parcela == parcela
        );
        break;
    }

    reg = { ...reg };

    switch (op) {
      case "C":
        const parts = reg.dtVencto.split("-");
        const data = new Date(parts[0], parts[1] - 1, parts[2]);
        setAnoAtual(data.getYear());
        setMesAtual(data.getMonth());
        setData(data);
        break;

      case "V": // Visualizar
      case "B": // Baixar
        reg.tpAcrDesc = reg.vlAcrescimo ? "A" : "D";
        reg.vlAcrescimo = reg.vlAcrescimo ? parseFloat(reg.vlAcrescimo) : 0;
        reg.vlDesconto = reg.vlDesconto ? parseFloat(reg.vlDesconto) : 0;
        reg.vlExtra = reg.vlAcrescimo ? reg.vlAcrescimo : reg.vlDesconto;
        reg.vlLancto = parseFloat(reg.vlLancto);
        reg.vlTotal = reg.vlLancto + reg.vlAcrescimo - reg.vlDesconto;

        if (!reg.dtPagto) {
          reg.dtPagto = reg.dtVencto;
        }

        setLancto(reg);
        setStatus(op == "V" ? "view" : "payment");
        setModalBaixarShow(true);
        break;
    }
  };

  const handleInputChange = (event) => {
    var { name, value } = event.target;

    if (name == "tpAcrDesc") {
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
    }

    setLancto({ ...lancto, [name]: value });
  };

  const handleDayChanged = (e) => {
    setAnoAtual(e.year);
    setMesAtual(e.month.index + 1);
  };

  const handleMonthChanged = (e) => {
    setData(e);
  };

  const handleCancel = async function () {
    setModalBaixarShow(false);
    setLancto(LanctoObj());
    setStatus("list");
  };

  useEffect(() => {
    //console.log('page_load');
    // Título da aba
    // document.title = `Contas ${process.env.NEXT_PUBLIC_VERSION} - Dashboard`;
    document.title = "Dashboard";
  }, []);

  useEffect(() => {
    carregaExtrato();
  }, [anoAtual, mesAtual, refresh]);

  const carregaExtrato = async () => {
    const extrato = await lanctoService.getExtrato(anoAtual, mesAtual);
    setDsExtrato(extrato.data);

    const dias = extrato.data.saldos.map((s) => s.dia);
    const valores = extrato.data.saldos.map((s) => s.valor);
    const cores = extrato.data.saldos.map((s) => {
      return s.valor < 0 ? "red" : s.valor == 0 ? "yellow" : "green";
    });

    options.plugins.title.text = `Movimento em ${
      meses[mesAtual - 1]
    } de ${anoAtual}`;

    const gr = {
      labels: dias,
      datasets: [
        {
          data: valores,
          backgroundColor: cores,
          borderWidth: 1,
          fill: false,
          // lineTension: 0.5,
        },
      ],
    };

    setGrafico(gr);
    setIsLoading(false);
    setSaldoNegativo(
      extrato.data.saldoNegativo
        ? `Saldo negativo em ${strDate(extrato.data.saldoNegativo)}`
        : ""
    );
  };

  const doPopupAction = async function (isPayment) {
    if (status === "view") {
      if (isPayment) {
        setStatus("payment");
        return;
      }

      setModalBaixarShow(false);
      return;
    }

    if (status === "payment") {
      await doPayment();
      return;
    }
  };

  const doPayment = async function () {
    const response = await lanctoService.payment(lancto);

    if (response.data.msg && response.data.msg !== "ok") {
      erroPopup(response.data.msg);
      return;
    }

    setStatus("list");
    setModalBaixarShow(false);
    setRefresh(!refresh);
  };

  return (
    <div className={styles.container}>
      <Tooltip
        id="atualizarTip"
        effect="solid"
        opacity={1}
        border={`1px solid ${theme.colors.gray12}`}
        style={{
          backgroundColor: theme.colors.gray10,
          color: theme.colors.red1,
          zIndex: 999,
        }}
        className="tooltip-bg"
      />

      {/* Popup Baixar/Visualizar */}
      <CenteredModal
        tamanho="lg"
        backdrop="static"
        titulo={status === "payment" ? "Baixar" : "Dados do Lançamento"}
        corTitulo={theme.colors.blue12}
        corConteudo={theme.colors.gray11}
        closeButton={false}
        thumbsUp={false}
        thumbsDown={false}
        floppy={status === "payment"}
        cancel={true}
        payButton={status === "view"}
        show={modalBaixarShow}
        onConfirm={() => doPopupAction(false)}
        onExtraOpc={() => doPopupAction(true)}
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

          <div className="col-6">
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

          <div className="col-6">
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
                    disabled={status == "payment" ? "" : "disabled"}
                    value={
                      lancto.dtPagto ? lancto.dtPagto.substring(0, 10) : ""
                    }
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
                    disabled={status == "payment" ? "" : "disabled"}
                    onChange={handleInputChange}
                  >
                    {tpsAcrDesc.map((tpAcrDesc) => {
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
                    disabled={status == "payment" ? "" : "disabled"}
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

      <Row className="m-0">
        <div className="col-12">
          <div className={styles.titulo}>
            <div className={styles.titulo2}>
              <h4>Dashboard</h4>
            </div>
          </div>
          <hr />
        </div>
      </Row>

      <Row className="m-0">
        <div className={`col-3 ${styles.calendario}`}>
          <Calendar
            value={data}
            onlyMonthPicker={true}
            locale={gregorian_pt_br}
            onChange={handleDayChanged}
            onMonthChange={handleMonthChanged}
          />
        </div>
        <div className="col-7" style={{ maxWidth: "50%", maxHeight: "320px" }}>
          <Line options={options} data={grafico} />
        </div>
        <div className="col-2">
          {saldoNegativo && (
            <div className={styles.atencao}>
              <h4>Atenção</h4>
              <h5>{saldoNegativo}</h5>
            </div>
          )}
        </div>
      </Row>

      <Row className={`m-0 ${styles.moldura}`}>
        <div className={`col-3 ${styles.extra}`}>
          <div className={styles.titulo3}>
            <h5>Vencimentos atrasados</h5>
          </div>
          <div className={styles.quadr}>
            <div className={styles.quadr2}>
              {!isLoading &&
                dsExtrato.vencidos.map((lancto) => {
                  return (
                    <div
                      key={`lancto-${lancto.id}-${lancto.parcela}`}
                      className={styles.cardMoldura}
                    >
                      <div className={styles.cardLeft}>
                        <div className={styles.cardDataValor}>
                          <div className={styles.cardData}>
                            {strDate(lancto.dtVencto)}
                          </div>
                          <div className={styles.cardValor}>
                            {strValue(lancto.vlLancto)}
                          </div>
                        </div>
                        <div className={styles.cardDataValor}>&nbsp;</div>
                        <div className={styles.cardDataValor}>
                          {lancto.descricao}
                        </div>
                      </div>
                      <div className={styles.cardRight2}>
                        <div>
                          <button
                            className="btn-refresh"
                            onClick={() => {
                              handleVencto(lancto.id, lancto.parcela, "V", "A");
                            }}
                          >
                            <AiFillEye
                              data-tooltip-id="atualizarTip"
                              data-tooltip-content="Visualizar"
                              data-tooltip-place="top"
                            />
                          </button>
                        </div>
                        {/* <div>
                        <button
                          className="btn-refresh"
                          onClick={() => {
                            handleVencto(lancto.id, lancto.parcela, "C", "A");
                          }}
                        >
                          <BsCalendar3
                            data-tooltip-id="atualizarTip"
                            data-tooltip-content="Ir para o mês"
                            data-tooltip-place="top"
                          />
                        </button>
                      </div> */}
                        <div>
                          <button
                            className="btn-refresh"
                            onClick={() => {
                              handleVencto(lancto.id, lancto.parcela, "B", "A");
                            }}
                          >
                            <AiFillDollarCircle
                              data-tooltip-id="atualizarTip"
                              data-tooltip-content="Baixar"
                              data-tooltip-place="left"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className={styles.titulo3}>
            <h5>Vencimentos atrasados no mês</h5>
          </div>
          <div className={styles.quadr}>
            <div className={styles.quadr2}>
              {!isLoading &&
                dsExtrato.vencidosNoMes.map((lancto, index) => {
                  return (
                    <div
                      key={`lancto-${lancto.id}-${lancto.parcela}`}
                      className={styles.cardMoldura}
                    >
                      <div className={styles.cardLeft}>
                        <div className={styles.cardDataValor}>
                          <div className={styles.cardData}>
                            {strDate(lancto.dtVencto)}
                          </div>
                          <div className={styles.cardValor}>
                            {strValue(lancto.vlLancto)}
                          </div>
                        </div>
                        <div className={styles.cardDataValor}>&nbsp;</div>
                        <div className={styles.cardDataValor}>
                          {lancto.descricao}
                        </div>
                      </div>
                      <div className={styles.cardRight2}>
                        <div>
                          <button
                            className="btn-refresh"
                            onClick={() => {
                              handleVencto(lancto.id, lancto.parcela, "V", "V");
                            }}
                          >
                            <AiFillEye
                              data-tooltip-id="atualizarTip"
                              data-tooltip-content="Visualizar"
                              data-tooltip-place="top"
                            />
                          </button>
                        </div>
                        <div>
                          <button
                            className="btn-refresh"
                            onClick={() => {
                              handleVencto(lancto.id, lancto.parcela, "B", "V");
                            }}
                          >
                            <AiFillDollarCircle
                              data-tooltip-id="atualizarTip"
                              data-tooltip-content="Baixar"
                              data-tooltip-place="left"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className={styles.titulo3}>
            <h5>Vencimentos hoje</h5>
          </div>
          <div className={styles.quadr}>
            <div className={styles.quadr2}>
              {!isLoading &&
                dsExtrato.vencendo.map((lancto, index) => {
                  return (
                    <div
                      key={`lancto-${lancto.id}-${lancto.parcela}`}
                      className={styles.cardMoldura}
                    >
                      <div className={styles.cardLeft}>
                        <div className={styles.cardDataValor}>
                          <div className={styles.cardData}>
                            {strDate(lancto.dtVencto)}
                          </div>
                          <div className={styles.cardValor}>
                            {strValue(lancto.vlLancto)}
                          </div>
                        </div>
                        <div className={styles.cardDataValor}>&nbsp;</div>
                        <div className={styles.cardDataValor}>
                          {lancto.descricao}
                        </div>
                      </div>
                      <div className={styles.cardRight2}>
                        <div>
                          <button
                            className="btn-refresh"
                            onClick={() => {
                              handleVencto(lancto.id, lancto.parcela, "V", "H");
                            }}
                          >
                            <AiFillEye
                              data-tooltip-id="atualizarTip"
                              data-tooltip-content="Visualizar"
                              data-tooltip-place="top"
                            />
                          </button>
                        </div>
                        <div>
                          <button
                            className="btn-refresh"
                            onClick={() => {
                              handleVencto(lancto.id, lancto.parcela, "B", "H");
                            }}
                          >
                            <AiFillDollarCircle
                              data-tooltip-id="atualizarTip"
                              data-tooltip-content="Baixar"
                              data-tooltip-place="left"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className={styles.titulo3}>
            <h5>Próximos vencimentos no mês atual</h5>
          </div>
          <div className={styles.quadr}>
            <div className={styles.quadr2}>
              {!isLoading &&
                dsExtrato.vencendoNoMes.map((lancto, index) => {
                  return (
                    <div
                      key={`lancto-${lancto.id}-${lancto.parcela}`}
                      className={styles.cardMoldura}
                    >
                      <div className={styles.cardLeft}>
                        <div className={styles.cardDataValor}>
                          <div className={styles.cardData}>
                            {strDate(lancto.dtVencto)}
                          </div>
                          <div className={styles.cardValor}>
                            {strValue(lancto.vlLancto)}
                          </div>
                        </div>
                        <div className={styles.cardDataValor}>&nbsp;</div>
                        <div className={styles.cardDataValor}>
                          {lancto.descricao}
                        </div>
                      </div>
                      <div className={styles.cardRight2}>
                        <div>
                          <button
                            className="btn-refresh"
                            onClick={() => {
                              handleVencto(lancto.id, lancto.parcela, "V", "F");
                            }}
                          >
                            <AiFillEye
                              data-tooltip-id="atualizarTip"
                              data-tooltip-content="Visualizar"
                              data-tooltip-place="top"
                            />
                          </button>
                        </div>
                        <div>
                          <button
                            className="btn-refresh"
                            onClick={() => {
                              handleVencto(lancto.id, lancto.parcela, "B", "F");
                            }}
                          >
                            <AiFillDollarCircle
                              data-tooltip-id="atualizarTip"
                              data-tooltip-content="Baixar"
                              data-tooltip-place="left"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </Row>
    </div>
  );
};

export default Home;
