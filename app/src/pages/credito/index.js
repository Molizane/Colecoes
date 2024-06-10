import { useEffect, useState } from "react";
import tipoContaService from "../../services/TipoContaService";
import contaService from "../../services/ContaService";
import lanctoService from "../../services/LanctoService";
import styles from "./styles.module.scss";
import Card from "../../components/Card";
import CenteredModal from "../../components/CenteredModal";
import { FiPlus } from "react-icons/fi";
import { strDate, strValue, themeColors } from "../../functions/utils";
import LanctoObj from "../../classes/LanctoObj";
import { Row } from "react-bootstrap";
import { FaArrowsRotate } from "react-icons/fa6";
import { AiFillEdit, AiFillEye } from "react-icons/ai";
import { BsFillTrash3Fill } from "react-icons/bs";

export default function Credito() {
  const theme = themeColors();
  const greenGridColors = [theme.colors.green5, theme.colors.green8];

  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [status, setStatus] = useState("list");

  const [tiposVencto, setTiposVencto] = useState([]);
  const [contas, setContas] = useState([]);
  const [lanctos, setLanctos] = useState([]);

  const [regCRUD, setRegCRUD] = useState(null);
  const [lancto, setLancto] = useState(null);

  // Popup mensagens
  const [messageShow, setMessageShow] = useState(false);
  const [texto, setTexto] = useState("");
  const [titulo, setTitulo] = useState("");
  const [corTitulo, setCorTitulo] = useState("");

  // Popup CRUD
  const [tipoCRUD, setTipoCRUD] = useState("");
  const [modalCRUDShow, setModalCRUDShow] = useState(false);
  const [modalLanctoShow, setModalLanctoShow] = useState(false);

  const [lenDescricao, setLenDescricao] = useState(0);
  const [filtrados, setFiltrados] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [tipoVencto, setTipoVencto] = useState("0");

  const erroPopup = function (msg) {
    setTitulo("Erro");
    setCorTitulo(theme.colors.tomato11);
    setTexto(msg);
    setMessageShow(true);
  };

  const getAll = async () => {
    var response = await tipoContaService.getAll("C");

    if (response.data.msg) {
      erroPopup(response.data.msg);
      return;
    }

    setTiposVencto(response.data);

    response = await contaService.getAll("C");

    if (response.data.msg) {
      setTiposVencto([]);
      setContas([]);
      erroPopup(response.data.msg);
      return;
    }

    setContas(response.data);

    response = await lanctoService.getAll("C");

    if (response.data.msg) {
      erroPopup(response.data.msg);
      setLanctos([]);
      return;
    }

    setLanctos(response.data);
    setIsLoading(false);
  };

  useEffect(() => {
    //console.log('page_load');
    // Título da aba
    // document.title = `Contas ${process.env.NEXT_PUBLIC_VERSION} - Manutenção de Crédito`;
    document.title = "Manutenção de Crédito";
  }, []);

  useEffect(() => {
    //console.log("page_refresh");
    getAll();
  }, [refresh]);

  useEffect(() => {
    filtraLanctos(lanctos, filtro, tipoVencto);
  }, [lanctos, filtro, tipoVencto]);

  const filtraLanctos = (lanctos, filtro, tipoVencto) => {
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
            ).indexOf(filtro.toLowerCase()) !== -1
        );
      }

      setFiltrados(filtrados);
      return;
    }

    setFiltrados(lanctos);
  };

  const handleTipoVencto = (event) => {
    setTipoVencto(event.target.value);
  };

  const handleFilterChange = (event) => {
    var txt = event.target.value.trim();
    setFiltro(txt);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (tipoCRUD === "T" || tipoCRUD === "C") {
      setRegCRUD({ ...regCRUD, [name]: value });
    } else {
      setLancto({ ...lancto, [name]: value });
    }

    if (name == "descricao") {
      setLenDescricao(value.length);
    }
  };

  const handleCreateTipo = async function () {
    await handleCreate("T");
  };

  const handleCreateConta = async function () {
    await handleCreate("C");
  };

  const handleCreateLancto = async function () {
    await handleCreate("L");
  };

  const handleCreate = async function (tipo) {
    setTipoCRUD(tipo);

    if (tipo === "T") {
      setRegCRUD({ id: null, descricao: "", ehCredito: true });
    } else if (tipo === "C") {
      setRegCRUD({
        id: null,
        descricao: "",
        idTipoConta: tiposVencto[0].id,
        ehCredito: true,
      });
    } else {
      setLancto({
        ...LanctoObj(),
        idConta: contas[0].id,
        flgDiasUteis: false,
        parcelas: 0,
        parcela: 0,
        flPago: true,
      });
    }

    setStatus("create");
    setCorTitulo(theme.colors.blue12);
    setLenDescricao(0);

    if (tipo === "T" || tipo === "C") {
      setTitulo(`Inclusão de ${tipo === "T" ? "Tipo de " : ""}Conta`);
      setModalCRUDShow(true);
    } else {
      setTitulo("Inclusão de Lançamento");
      setModalLanctoShow(true);
    }
  };

  const handleEditTipo = async function (id) {
    await handleEdit("T", id);
  };

  const handleEditConta = async function (id) {
    await handleEdit("C", id);
  };

  const handleEditLancto = async function (id) {
    await handleEdit("L", id);
  };

  const handleEdit = async function (tipo, id) {
    setTipoCRUD(tipo);

    var reg;

    if (tipo === "T") {
      reg = { ...tiposVencto[0] };
      setRegCRUD(reg);
    } else if (tipo === "C") {
      reg = { ...contas[0] };
      setRegCRUD(reg);
    } else {
      setTipoCRUD("");
      return;
    }

    setStatus("edit");

    if (tipo === "T" || tipo === "C") {
      setTitulo(`Alteração de ${tipo === "T" ? "Tipo de " : ""}Conta`);
    } else {
      setTitulo("Alteração de Lançamento");
    }

    setCorTitulo(theme.colors.blue12);
    setLenDescricao(reg.descricao.length);
    setModalCRUDShow(true);
  };

  const handleDelete = async function (id) {
    setId(id);
    setStatus("delete");
    setTitulo("Atenção!");
    setCorTitulo(theme.colors.tomato11);
    setModalCRUDShow(true);
  };

  const doPopupAction = async function () {
    if (status === "delete") {
      await doDelete();
      return;
    }

    if (status === "create") {
      await doCreate();
      return;
    }

    if (status === "edit") {
      await doUpdate();
      return;
    }
  };

  const handleCancel = async function () {
    setModalCRUDShow(false);
    setRegCRUD(null);
    setTipoCRUD("");
    setStatus("list");
  };

  const doCreate = async function () {
    var response;

    if (tipoCRUD == "T") {
      response = await tipoContaService.create(regCRUD);
    } else if (tipoCRUD == "C") {
      response = await contaService.create(regCRUD);
    } else {
      response = await lanctoService.create(lancto);
    }

    if (response.data.msg && response.data.msg !== "ok") {
      erroPopup(response.data.msg);
      return;
    }

    setTipoCRUD("");
    setStatus("list");
    setModalCRUDShow(false);
    setRefresh(!refresh);
  };

  const doUpdate = async function () {
    var response;

    if (tipoCRUD == "T") {
      response = await tipoContaService.update(regCRUD);
    } else if (tipoCRUD == "C") {
      response = await contaService.update(regCRUD);
    } else {
      response = await lanctoService.update(lancto);
    }

    if (response.data.msg && response.data.msg !== "ok") {
      erroPopup(response.data.msg);
      return;
    }

    setTipoCRUD("");
    setStatus("list");
    setModalCRUDShow(false);
    setRefresh(!refresh);
  };

  const doDelete = async function () {
    setModalCRUDShow(false);
    const response = await lanctoService.remove(id);

    if (response.data.msg && response.data.msg !== "ok") {
      erroPopup(response.data.msg);
      return;
    }

    setTipoCRUD("");
    setStatus("list");
    setRefresh(!refresh);
  };

  const handleFiltroContas = function (e) {
    setFiltraConta(e.target.checked);
  };

  const doRefresh = function () {
    setRefresh(!refresh);
  };

  const descrColLen = `col-6`;

  return (
    <div className={styles.container}>
      <Row className="m-0">
        <div className="col-12">
          <div className={styles.titulo}>
            <div className={styles.titulo2}>
              <h4>Manutenção de Crédito</h4>
            </div>
          </div>
          <hr />
        </div>
      </Row>

      <Row className="m-0">
        <div className="col-12">
          <div className={styles.titulo}>
            <div className={styles.titulo2}>
              <h5>Tipo de Lançamento</h5>
              {!isLoading && tiposVencto.length === 0 && (
                <button className="btn-insert" onClick={handleCreateTipo}>
                  <FiPlus />
                  Novo
                </button>
              )}
            </div>
          </div>
        </div>
      </Row>

      {!isLoading && tiposVencto.length > 0 && (
        <>
          <Row className="m-0">
            <div className="col-12">
              <div className="row-cols-md-5 m-0">
                {tiposVencto.map((regCRUD) => (
                  <div key={`regCRUD${regCRUD.id}`} className="p-2">
                    <Card
                      id={regCRUD.id}
                      qtde={0}
                      linha2={regCRUD.descricao}
                      color={theme.colors.gray1}
                      bgColor={theme.colors.gray11}
                      delColor={theme.colors.gray1}
                      bgDelColor={theme.colors.tomato11}
                      editColor={theme.colors.gray1}
                      bgEditColor={theme.colors.green11}
                      onEdit={handleEditTipo}
                    />
                  </div>
                ))}
              </div>
              <hr />
            </div>
          </Row>

          <Row className="m-0">
            <div className="col-12">
              <div className={styles.titulo}>
                <div className={styles.titulo2}>
                  <h5>Conta</h5>
                  {contas.length === 0 && (
                    <button className="btn-insert" onClick={handleCreateConta}>
                      <FiPlus />
                      Novo
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Row>

          {contas.length === 0 && (
            <Row className="m-0">
              <div className="col-12">
                <hr />
              </div>
            </Row>
          )}

          {contas.length > 0 && (
            <>
              <Row className="m-0">
                <div className="col-12">
                  <Row className="row-cols-md-5 m-0">
                    {contas.map((regCRUD) => (
                      <div
                        key={`${regCRUD}regCRUD${regCRUD.id}`}
                        className="p-2"
                      >
                        <Card
                          id={regCRUD.id}
                          qtde={0}
                          titulo1="Tipo"
                          linha1={`${regCRUD.tipoConta}`}
                          linha2={regCRUD.descricao}
                          color={theme.colors.gray1}
                          bgColor={theme.colors.gray11}
                          delColor={theme.colors.gray1}
                          bgDelColor={theme.colors.tomato11}
                          editColor={theme.colors.gray1}
                          bgEditColor={theme.colors.green11}
                          onEdit={handleEditConta}
                        />
                      </div>
                    ))}
                  </Row>
                  <hr />
                </div>
              </Row>

              <Row className="m-0">
                <div className="col-12">
                  <div className={styles.titulo}>
                    <div className={styles.titulo2}>
                      <h5>Lançamentos de Crédito</h5>
                      <button
                        className="btn-insert"
                        onClick={handleCreateLancto}
                      >
                        <FiPlus />
                        Novo
                      </button>
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div>
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
                </div>
              </Row>

              <div style={{ marginLeft: "50px", marginRight: "68px" }}>
                <Row
                  style={{
                    marginLeft: "1px",
                    marginRight: "1px",
                    fontWeight: "bold",
                  }}
                >
                  <div className="col-6">Descrição</div>
                  <div className="col-2">Data</div>
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
                  height: "39vh",
                  overflowY: "scroll",
                  overflowX: "hidden",
                  marginLeft: "50px",
                  marginRight: "50px",
                }}
              >
                {!isLoading &&
                  filtrados.length > 0 &&
                  filtrados.map((lancto, index) => {
                    var style = {
                      ...style,
                      backgroundColor: greenGridColors[index % 2],
                      color: theme.colors.slate11,
                      fontWeight: "bold",
                    };

                    return (
                      <Row
                        className="m-0"
                        style={style}
                        key={`lancto${lancto.id}`}
                      >
                        <div className={descrColLen}>{lancto.descricao}</div>
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
                          </div>
                        </div>
                      </Row>
                    );
                  })}
              </div>
            </>
          )}
        </>
      )}

      {/* Popup mensagens diversas */}
      <CenteredModal
        titulo={titulo}
        corTitulo={corTitulo}
        conteudo={texto}
        corConteudo={theme.colors.gray11}
        closeButton={true}
        eye={true}
        show={messageShow}
        onHide={() => setMessageShow(false)}
      />

      {/* Popup CRUD */}
      {(tipoCRUD === "T" || tipoCRUD === "C") && (
        <CenteredModal
          backdrop="static"
          titulo={titulo}
          corTitulo={corTitulo}
          corConteudo={theme.colors.gray1}
          closeButton={false}
          thumbsUp={status === "delete"}
          thumbsDown={status === "delete"}
          floppy={status !== "delete"}
          cancel={status !== "delete"}
          show={modalCRUDShow}
          onConfirm={() => doPopupAction()}
          onHide={() => handleCancel()}
        >
          {(status === "create" || status === "edit") && (
            <>
              <div className="form-group">
                <label htmlFor="descricao" className="control-label">
                  Descrição
                </label>
                <input
                  name="descricao"
                  id="descricao"
                  type="text"
                  className="form-control"
                  required
                  value={regCRUD.descricao}
                  onChange={handleInputChange}
                  maxLength={45}
                  autoFocus
                />
                <div className="div-contador">
                  <span className="contador">{lenDescricao}</span>
                </div>
              </div>
            </>
          )}
        </CenteredModal>
      )}

      {/* Popup lançamento */}
      {tipoCRUD === "L" && (
        <CenteredModal
          backdrop="static"
          titulo={titulo}
          corTitulo={corTitulo}
          corConteudo={theme.colors.gray1}
          closeButton={false}
          thumbsUp={false}
          thumbsDown={false}
          floppy={true}
          cancel={true}
          show={modalLanctoShow}
          onConfirm={() => doPopupAction()}
          onHide={() => handleCancel()}
        >
          <Row>
            <div className="col-6">
              <div className="form-group">
                <label htmlFor="dtVencto" className="control-label">
                  Data
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
            <div className="col-6">
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
        </CenteredModal>
      )}
    </div>
  );
}
