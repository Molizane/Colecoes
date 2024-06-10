import { useEffect, useState } from "react";
import { FaArrowsRotate } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";

import CenteredModal from "../../components/CenteredModal";
import contaService from "../../services/ContaService";
import lanctoService from "../../services/LanctoService";
import { strDate, strValue, themeColors } from "../../functions/utils";
import LanctoObj from "../../classes/LanctoObj";

import "react-tooltip/dist/react-tooltip.css";
import styles from "./styles.module.scss";

import { Row } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import { AiFillEye, AiFillEdit } from "react-icons/ai";
import { BsFillTrash3Fill } from "react-icons/bs";
import { MdPriceCheck, MdOutlineMoneyOff } from "react-icons/md";

export default function Lancto() {
  const theme = themeColors();
  const redGridColors = [theme.colors.red9, theme.colors.red11];
  const yellowGridColors = [theme.colors.yellow4, theme.colors.yellow5];
  const greenGridColors = [theme.colors.green5, theme.colors.green8];
  const cyanGridColors = [theme.colors.cyan5, theme.colors.cyan8];
  //const slateGridColors = [theme.colors.slate11, theme.colors.slate1];

  const tpsLancto = [
    { key: "S", value: "Semanal" },
    { key: "Q", value: "Quinzenal" },
    { key: "M", value: "Mensal" },
    { key: "B", value: "Bimestral" },
    { key: "T", value: "Trimestral" },
    { key: "4", value: "Quadrimestral" },
    { key: "6", value: "Semestral" },
    { key: "A", value: "Anual" },
  ];

  const tpsExclusao = [
    { key: "L", value: "Lançamento atual" },
    { key: "A", value: "Lançamento atual e anteriores" },
    { key: "P", value: "Lançamento atual e posteriores" },
    { key: "T", value: "Todos os lançamentos" },
  ];

  const tpsAcrDesc = [
    { key: "D", value: "Desconto" },
    { key: "A", value: "Acréscimo" },
  ];

  const tiposVencto = [
    { key: "0", value: "Vencidos" },
    { key: "1", value: "Vencendo" },
    { key: "2", value: "A vencer" },
    { key: "3", value: "Pagos" },
    { key: "4", value: "Todos" },
  ];

  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [status, setStatus] = useState("list");
  const [isFirst, setIsFirst] = useState(true);

  const [lanctos, setLanctos] = useState([]);
  const [lancto, setLancto] = useState(LanctoObj());
  const [contas, setContas] = useState([]);
  const [criterio, setCriterio] = useState("4");

  // Popup mensagens
  const [messageShow, setMessageShow] = useState(false);
  const [texto, setTexto] = useState("");
  const [titulo, setTitulo] = useState("");
  const [corTitulo, setCorTitulo] = useState("");

  // Popup CRUD
  const [modalCRUDShow, setModalCRUDShow] = useState(false);
  const [tituloCRUD, setTituloCRUD] = useState("");
  const [modalDeleteShow, setModalDeleteShow] = useState(false);
  const [modalBaixarShow, setModalBaixarShow] = useState(false);
  const [tituloExcluir, setTituloExcluir] = useState("");

  const [lenDescricao, setLenDescricao] = useState(0);
  const [filtro, setFiltro] = useState("");
  const [filtrados, setFiltrados] = useState(null);
  const [filtraConta, setFiltraConta] = useState(false);
  const [tipoVencto, setTipoVencto] = useState("0");

  const erroPopup = function (msg) {
    setTitulo("Erro");
    setCorTitulo(theme.colors.tomato11);
    setTexto(msg);
    setMessageShow(true);
  };

  useEffect(() => {
    //console.log("page_load");
    // Título da aba
    //document.title = `Contas ${process.env.NEXT_PUBLIC_VERSION} - Lançamentos de Pagamentos`;
    document.title = "Lançamentos de Pagamentos";
  }, []);

  useEffect(() => {
    //console.log("page_refresh");
    getAllContas();
    getAll();
  }, [refresh]);

  useEffect(() => {
    filtraLanctos(lanctos, filtro, filtraConta, tipoVencto);
  }, [lanctos, filtro, filtraConta, tipoVencto]);

  const filtraLanctos = (lanctos, filtro, filtraConta, tipoVencto) => {
    if (filtro || tipoVencto != "4") {
      var filtrados =
        tipoVencto == "4"
          ? lanctos
          : lanctos.filter((reg) => reg.status == tipoVencto);

      if (filtro) {
        filtrados = filtrados.filter(
          (reg) =>
            (
              reg.descricao.toLowerCase() + reg.descrParcela.toLowerCase()
            ).indexOf(filtro.toLowerCase()) !== -1 ||
            (filtraConta &&
              reg.conta.toLowerCase().indexOf(filtro.toLowerCase()) !== -1)
        );
      }

      setFiltrados(filtrados);
      return;
    }

    setFiltrados(lanctos);
  };

  const getAllContas = async () => {
    const response = await contaService.getAll("D");

    if (response.data.msg) {
      erroPopup(response.data.msg);
      return;
    }

    if (response.data) {
      const sort = (a, b) => {
        return a.descricao.localeCompare(b.descricao, "pt", {
          sensitivity: "base",
        });
      };

      const data = response.data.sort(sort);
      const results = [];

      data.forEach((value) => {
        results.push({
          key: value.id,
          value: value.descricao,
        });
      });

      setContas([
        { key: "", value: "Selecione uma conta de lançamento" },
        ...results,
      ]);
    }
  };

  const getAll = async () => {
    const response = await lanctoService.getAll(criterio);

    if (response.data.msg) {
      erroPopup(response.data.msg);
      setLanctos([]);
      return;
    }

    if (isFirst) {
      var min = 0;

      const tiposDistintos = [
        ...new Set(response.data.map((item) => item.status)),
      ];

      if (tiposDistintos.length === 0) {
        min = 4;
      } else {
        min = tiposDistintos[0];

        if (min == 3) {
          min = 4;
        }
      }

      setIsFirst(false);
      setTipoVencto(min);
    }

    setLanctos(response.data);
    setIsLoading(false);
  };

  const handleTipoVencto = (event) => {
    setTipoVencto(event.target.value);
  };

  const handleFilterChange = (event) => {
    var txt = event.target.value.trim();
    setFiltro(txt);
  };

  const handleInputChange = (event) => {
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

    if (name == "descricao") {
      setLenDescricao(value.length);
    }
  };

  const handleToggle = (event) => {
    var name = event.target.name;

    if (name === "flgDiasUteis") {
      setLancto({ ...lancto, flgDiasUteis: !lancto.flgDiasUteis });
      return;
    }

    if (name === "flgUpdateAll") {
      setLancto({ ...lancto, flgUpdateAll: !lancto.flgUpdateAll });
    }
  };

  const handleCreate = async function () {
    document.activeElement.blur();
    setLancto(LanctoObj());
    setStatus("create");
    setTituloCRUD("Inclusão");
    setLenDescricao(0);
    setModalCRUDShow(true);
  };

  const handleEdit = async function (id, parcela) {
    document.activeElement.blur();
    const reg = lanctos.find((r) => r.id == id && r.parcela == parcela);
    setLancto({ ...reg, flgUpdateAll: false });
    setStatus("edit");
    setTituloCRUD("Alteração");
    setLenDescricao(reg.descricao.length);
    setModalCRUDShow(true);
  };

  const handleView = async function (id, parcela) {
    document.activeElement.blur();
    var reg = lanctos.find((r) => r.id == id && r.parcela == parcela);
    reg = { ...reg };
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
    setStatus("view");
    setModalBaixarShow(true);
  };

  const handleDelete = async function (id, parcela) {
    document.activeElement.blur();
    const reg = lanctos.find((r) => r.id == id && r.parcela == parcela);
    setLancto({ ...reg, tpExclusao: reg.parcelas == 1 ? "T" : "L" });
    setStatus("delete");
    setTituloExcluir("Confirme a EXCLUSÃO...");
    setModalDeleteShow(true);
  };

  const handleBaixar = async function (id, parcela) {
    document.activeElement.blur();
    var reg = lanctos.find((r) => r.id == id && r.parcela == parcela);
    reg = { ...reg };
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
    setStatus("payment");
    setModalBaixarShow(true);
  };

  const handleEstornar = async function (id, parcela) {
    document.activeElement.blur();
    const reg = lanctos.find((r) => r.id == id && r.parcela == parcela);
    setLancto(reg);
    setStatus("reopen");
    setTituloExcluir("Confirme o ESTORNO DO PAGAMENTO...");
    setModalDeleteShow(true);
  };

  const handleCancel = async function () {
    setModalCRUDShow(false);
    setModalDeleteShow(false);
    setModalBaixarShow(false);
    setLancto(LanctoObj());
    setStatus("list");
  };

  const doPopupAction = async function () {
    if (status === "create") {
      await doCreate();
      return;
    }

    if (status === "edit") {
      await doUpdate();
      return;
    }

    if (status === "view") {
      setStatus("list");
      setModalBaixarShow(false);
      return;
    }

    if (status === "delete") {
      await doDelete();
      return;
    }

    if (status === "payment") {
      await doPayment();
      return;
    }

    if (status === "reopen") {
      await doReopen();
      return;
    }
  };

  const doCreate = async function () {
    if (!lancto.dtVencto) {
      erroPopup("Favor informar a data de vencimento");
      return;
    }

    if (!lancto.idConta) {
      erroPopup("Favor informar a conta");
      return;
    }

    const response = await lanctoService.create(lancto);

    if (response.data.msg && response.data.msg !== "ok") {
      erroPopup(response.data.msg);
      return;
    }

    setStatus("list");
    setModalCRUDShow(false);
    setRefresh(!refresh);
  };

  const doUpdate = async function () {
    const response = await lanctoService.update(lancto);

    if (response.data.msg && response.data.msg !== "ok") {
      erroPopup(response.data.msg);
      return;
    }

    setStatus("list");
    setModalCRUDShow(false);
    setRefresh(!refresh);
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

  const doReopen = async function () {
    const response = await lanctoService.reopen(lancto);

    if (response.data.msg && response.data.msg !== "ok") {
      erroPopup(response.data.msg);
      return;
    }

    setModalDeleteShow(false);
    setRefresh(!refresh);
  };

  const doDelete = async function () {
    setModalDeleteShow(false);

    const response = await lanctoService.remove(
      lancto.id,
      lancto.parcela,
      lancto.tpExclusao
    );

    if (response.data.msg && response.data.msg !== "ok") {
      erroPopup(response.data.msg);
      return;
    }

    setStatus("list");
    setRefresh(!refresh);
  };

  const handleFiltroContas = function (e) {
    setFiltraConta(e.target.checked);
  };

  const doRefresh = function () {
    setRefresh(!refresh);
  };

  const descrColLen = `col-${tipoVencto == "4" ? "5" : "6"}`;

  return (
    <>
      <div className={styles.container}>
        <Tooltip
          id="atualizarTip"
          effect="solid"
          opacity={1}
          border={`1px solid ${theme.colors.blue12}`}
          style={{
            backgroundColor: theme.colors.blue10,
            color: theme.colors.red1,
            zIndex: 999,
          }}
          className="tooltip-bg"
        />

        <Row className="m-0">
          <div className="col-12">
            <div className={styles.titulo}>
              <div className={styles.titulo2}>
                <h4>Lançamentos de Pagamentos</h4>
                <button className="btn-insert" onClick={handleCreate}>
                  <FiPlus />
                  Novo
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                  <span className={styles.spanTipos}>
                    Incluir lançamento no filtro
                  </span>
                  <select
                    className={styles.spanTipos}
                    name="tipoVencto"
                    id="tipoVencto"
                    value={tipoVencto}
                    onChange={handleTipoVencto}
                  >
                    {tiposVencto.map((tipoVencto) => {
                      const { key, value } = tipoVencto;
                      return (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <span className={styles.spanTipos}>
                    Incluir conta no filtro
                  </span>
                  <input
                    className={styles.spanTipos}
                    type="checkbox"
                    name="chkContas"
                    onChange={handleFiltroContas}
                  />
                  <input
                    type="search"
                    className={styles.search}
                    placeholder="Filtro.."
                    name="filtro"
                    maxLength={45}
                    value={filtro}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
            </div>
            <hr />
          </div>
        </Row>

        <div style={{ marginLeft: "100px", marginRight: "118px" }}>
          <Row
            style={{
              marginLeft: "1px",
              marginRight: "1px",
              fontWeight: "bold",
            }}
          >
            {tipoVencto == "4" && <div className="col-1">Situação</div>}
            <div className={descrColLen}>Descrição</div>
            <div className="col-2">Vencimento</div>
            <div className={`col-2 ${styles.vlLancto}`}>Valor</div>
            <div className={`col-2 ${styles.refresh} `}>
              <button
                type="button"
                className="btn-refresh"
                onClick={doRefresh}
                data-tooltip-id="atualizarTip"
                data-tooltip-content="Atualizar"
                data-tooltip-place="top"
              >
                <FaArrowsRotate />
              </button>
            </div>
          </Row>

          <Row>
            <div className="col-12">
              <hr style={{ marginTop: "1px", marginBottom: "2px" }} />
            </div>
          </Row>
        </div>

        <div
          style={{
            height: "79vh",
            overflowY: "scroll",
            overflowX: "hidden",
            marginLeft: "100px",
            marginRight: "100px",
          }}
        >
          {!isLoading &&
            filtrados &&
            filtrados.map((lancto, index) => {
              var style = "";

              if (lancto.status == 0) {
                // Vencido
                style = {
                  backgroundColor: redGridColors[index % 2],
                  color: theme.colors.slate6,
                  fontWeight: "bold",
                };
              } else if (lancto.status == 1) {
                // Vencendo
                style = {
                  ...style,
                  backgroundColor: yellowGridColors[index % 2],
                  color: theme.colors.blue11,
                  fontWeight: "bold",
                };
              } else if (lancto.status == 2) {
                // A vencer
                style = {
                  backgroundColor: greenGridColors[index % 2],
                  color: theme.colors.slate11,
                };
              } else {
                // Pago
                style = {
                  backgroundColor: cyanGridColors[index % 2],
                  color: theme.colors.red9,
                };
              }

              return (
                <Row
                  className="m-0"
                  style={style}
                  key={`lancto${lancto.id}${lancto.parcela}`}
                >
                  {tipoVencto == "4" && (
                    <div className="col-1">{lancto.tipo}</div>
                  )}
                  <div
                    className={descrColLen}
                  >{`${lancto.descricao}${lancto.descrParcela}`}</div>
                  <div className="col-2">{strDate(lancto.dtVencto)}</div>
                  <div className={`col-2 ${styles.vlLancto}`}>
                    {strValue(lancto.vlTotal)}
                  </div>
                  <div className={`col-2 ${styles.funcoes}`}>
                    <div className={styles.refresh}>
                      <button
                        className="btn-refresh"
                        onClick={() => {
                          handleView(lancto.id, lancto.parcela);
                        }}
                      >
                        <AiFillEye
                          className="btn-refresh"
                          data-tooltip-id="atualizarTip"
                          data-tooltip-content="Visualizar"
                          data-tooltip-place="top"
                        />
                      </button>
                      <button
                        className="btn-refresh"
                        onClick={() => {
                          handleEdit(lancto.id, lancto.parcela);
                        }}
                      >
                        <AiFillEdit
                          className="btn-refresh"
                          data-tooltip-id="atualizarTip"
                          data-tooltip-content="Editar"
                          data-tooltip-place="top"
                        />
                      </button>
                      <button
                        className="btn-refresh"
                        onClick={() => {
                          handleDelete(lancto.id, lancto.parcela);
                        }}
                      >
                        <BsFillTrash3Fill
                          className="btn-refresh"
                          data-tooltip-id="atualizarTip"
                          data-tooltip-content="Excluir"
                          data-tooltip-place="top"
                        />
                      </button>
                      {!lancto.flPago && (
                        <button
                          className="btn-refresh"
                          onClick={() => {
                            handleBaixar(lancto.id, lancto.parcela);
                          }}
                        >
                          <MdPriceCheck
                            className="btn-refresh"
                            data-tooltip-id="atualizarTip"
                            data-tooltip-content="Baixar"
                            data-tooltip-place="top"
                          />
                        </button>
                      )}
                      {lancto.flPago && (
                        <button
                          className="btn-refresh"
                          onClick={() => {
                            handleEstornar(lancto.id, lancto.parcela);
                          }}
                        >
                          <MdOutlineMoneyOff
                            className="btn-refresh"
                            data-tooltip-id="atualizarTip"
                            data-tooltip-content="Estornar"
                            data-tooltip-place="top"
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </Row>
              );
            })}
        </div>
      </div>

      {/* Popup mensagens diversas */}
      <CenteredModal
        tamanho="lg"
        titulo={titulo}
        corTitulo={corTitulo}
        conteudo={texto}
        corConteudo={theme.colors.gray12}
        closeButton={true}
        eye={true}
        show={messageShow}
        onHide={() => setMessageShow(false)}
      />

      {/* Excluir/Estornar */}
      <CenteredModal
        tamanho="lg"
        backdrop="static"
        titulo="Atenção!"
        corTitulo={theme.colors.tomato11}
        corConteudo={theme.colors.gray11}
        closeButton={false}
        thumbsUp={true}
        thumbsDown={true}
        floppy={false}
        cancel={false}
        show={modalDeleteShow}
        onConfirm={() => doPopupAction()}
        onHide={() => handleCancel()}
      >
        <Row>
          <div className="col-12 mb-2">
            <h5>{tituloExcluir}</h5>
          </div>
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
                value={`${lancto.descricao}${lancto.descrParcela}`}
                onChange={handleInputChange}
                maxLength={100}
              />
            </div>
          </div>
          {status == "delete" && lancto.parcelas > 1 && (
            <div className="col-6">
              <div className="form-group">
                <label htmlFor="tpExclusao" className="control-label">
                  Tipo de EXCLUSÃO
                </label>
                <select
                  name="tpExclusao"
                  id="tpExclusao"
                  className="form-control"
                  value={lancto.tpExclusao}
                  onChange={handleInputChange}
                >
                  {tpsExclusao.map((tpExclusao) => {
                    const { key, value } = tpExclusao;
                    return (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          )}
        </Row>
      </CenteredModal>

      {/* Popup Incluir/Alterar */}
      <CenteredModal
        tamanho="lg"
        backdrop="static"
        titulo={tituloCRUD}
        corTitulo={theme.colors.blue12}
        corConteudo={theme.colors.gray11}
        closeButton={false}
        thumbsUp={false}
        thumbsDown={false}
        floppy={true}
        cancel={true}
        show={modalCRUDShow}
        onConfirm={() => doPopupAction()}
        onHide={() => handleCancel()}
      >
        <Row>
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
                required
                autoFocus
                value={lancto.dtVencto.substring(0, 10)}
                onChange={handleInputChange}
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
                type="number"
                required
                min={0}
                step={0.01}
                pattern="([0-9]{1,3}).([0-9]{1,3})"
                value={lancto.vlLancto}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {status === "create" && (
            <>
              <div className="col-2">
                <div className="form-group">
                  <label htmlFor="parcelas" className="control-label">
                    Parcelas
                  </label>
                  <input
                    className="form-control"
                    name="parcelas"
                    id="parcelas"
                    type="number"
                    required
                    min={1}
                    value={lancto.parcelas}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              {lancto.parcelas > 1 && (
                <>
                  <div className="col-2">
                    <div className="form-group">
                      <label
                        htmlFor="flgGerarParcela"
                        className="control-label"
                      >
                        &nbsp;
                      </label>
                      <div className="form-control">
                        <input
                          type="checkbox"
                          name="flgGerarParcela"
                          id="flgGerarParcela"
                          checked={lancto.flgGerarParcela}
                          onChange={handleInputChange}
                        />
                        <label
                          htmlFor="flgGerarParcela"
                          className={`control-label ${styles.spanTipos}`}
                        >
                          Dividir
                        </label>
                      </div>
                    </div>
                  </div>
                  {lancto.flgGerarParcela && (
                    <div className="col-2">
                      <div className="form-group">
                        <label htmlFor="flgDifFinal" className="control-label">
                          &nbsp;
                        </label>
                        <div className="form-control">
                          <input
                            type="checkbox"
                            name="flgDifFinal"
                            id="flgDifFinal"
                            checked={lancto.flgDifFinal}
                            onChange={handleInputChange}
                          />
                          <label
                            htmlFor="flgDifFinal"
                            className={`control-label ${styles.spanTipos}`}
                          >
                            Ajus.últ.
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {status === "edit" && (
            <div className="col-2">
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
                  value={lancto.descrParcela.replace("(", "").replace(")", "")}
                />
              </div>
            </div>
          )}
        </Row>

        <Row>
          <div className={`col-${lancto.parcelas == 1 ? "8" : "6"}`}>
            <div className="form-group">
              <label htmlFor="idConta" className="control-label">
                Conta
              </label>
              {status === "create" && (
                <select
                  name="idConta"
                  id="idConta"
                  className="form-control"
                  value={lancto.IdConta}
                  onChange={handleInputChange}
                >
                  {contas.map((conta) => {
                    const { key, value } = conta;
                    return (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    );
                  })}
                </select>
              )}
              {status === "edit" && (
                <input
                  name="idConta"
                  id="idConta"
                  type="text"
                  className="form-control"
                  disabled
                  value={lancto.conta}
                  style={{ width: "100%" }}
                />
              )}
            </div>
          </div>

          {lancto.parcelas > 1 && (
            <>
              <div className="col-3">
                <div className="form-group">
                  <label htmlFor="tpVencto" className="control-label">
                    Intervalo
                  </label>
                  {status === "create" && (
                    <select
                      name="tpVencto"
                      id="tpVencto"
                      className="form-control"
                      value={lancto.tpVencto}
                      onChange={handleInputChange}
                    >
                      {tpsLancto.map((tpVencto) => {
                        const { key, value } = tpVencto;
                        return (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        );
                      })}
                    </select>
                  )}
                  {status === "edit" && (
                    <input
                      name="tpVencto"
                      id="tpVencto"
                      type="text"
                      className="form-control"
                      disabled
                      value={lancto.descrTipo}
                      style={{ width: "100%" }}
                    />
                  )}
                </div>
              </div>
              <div className="col-3">
                <div className="form-group">
                  <label htmlFor="flgDiasUteis" className="control-label">
                    &nbsp;
                  </label>
                  <div className="form-control">
                    <input
                      type="checkbox"
                      name="flgDiasUteis"
                      id="flgDiasUteis"
                      checked={lancto.flgDiasUteis}
                      onChange={handleInputChange}
                      disabled={status == "edit" ? "disabled" : ""}
                    />
                    <label
                      htmlFor="flgDiasUteis"
                      className={`control-label ${styles.spanTipos}`}
                    >
                      Dias úteis
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}
        </Row>

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
                required
                value={lancto.descricao}
                onChange={handleInputChange}
                maxLength={100}
              />
              <div className="div-contador">
                <span className="contador">{lenDescricao}</span>
              </div>
            </div>
          </div>
        </Row>

        {status == "edit" && lancto.parcelas > 1 && (
          <Row>
            <div className="col-7">
              <div className="form-group">
                <div className="form-control">
                  <input
                    type="checkbox"
                    name="flgUpdateAll"
                    id="flgUpdateAll"
                    checked={lancto.flgUpdateAll}
                    onChange={handleInputChange}
                  />
                  <label
                    htmlFor="flgUpdateAll"
                    className={`control-label ${styles.spanTipos}`}
                  >
                    Atualizar todos os lançamentos com esta descrição
                  </label>
                </div>
              </div>
            </div>
          </Row>
        )}
      </CenteredModal>

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
        show={modalBaixarShow}
        onConfirm={() => doPopupAction()}
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
                value={lancto.descrParcela.replace("(", "").replace(")", "")}
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
    </>
  );
}
