import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";

import Card from "../../components/Card";
import CenteredModal from "../../components/ModalDialog";

import servicoConta from "../../services/ContaService";
import servicoTipo from "../../services/TipoContaService";

import styles from "./styles.module.scss";
import { themeColors } from "../../functions/utils";

export default function Conta() {
  const theme = themeColors();

  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [status, setStatus] = useState("list");

  const [contas, setContas] = useState([]);
  const [id, setId] = useState();
  const [conta, setConta] = useState(null);
  const [tipos, setTipos] = useState([]);
  const [tiposDistintos, setTiposDistintos] = useState([]);

  // Popup mensagens
  const [messageShow, setMessageShow] = useState(false);
  const [texto, setTexto] = useState("");
  const [titulo, setTitulo] = useState("");
  const [corTitulo, setCorTitulo] = useState("");

  // Popup CRUD
  const [modalCRUDShow, setModalCRUDShow] = useState(false);
  const [tituloCRUD, setTituloCRUD] = useState("");
  const [corTituloCRUD, setCorTituloCRUD] = useState("");

  const [lenDescricao, setLenDescricao] = useState(0);
  const [filtro, setFiltro] = useState("");
  const [filtrados, setFiltrados] = useState(null);
  const [filtraTipo, setFiltraTipo] = useState(false);

  const errPopup = function (msg) {
    setTitulo("Erro");
    setCorTitulo(theme.colors.tomato11);
    setTexto(msg);
    setMessageShow(true);
  };

  const getAllTipos = async () => {
    const response = await servicoTipo.getAll();

    if (response.data.msg) {
      errPopup(response.data.msg);
      return;
    }

    if (response.data) {
      const results = [];

      response.data.forEach((value) => {
        results.push({
          key: value.id,
          value: value.descricao,
        });
      });

      setTipos([{ key: "", value: "Selecione um tipo de conta" }, ...results]);
    }
  };

  const getAll = async () => {
    const response = await servicoConta.getAll();

    if (response.data.msg) {
      errPopup(response.data.msg);
      return;
    }

    setContas(response.data);
    filtraContas(response.data, filtro, filtraTipo);
    setIsLoading(false);
  };

  const filtraContas = (contas, filtro, filtraTipo) => {
    if (filtro) {
      const filtrados = contas.filter(
        (reg) =>
          reg.descricao.toLowerCase().indexOf(filtro.toLowerCase()) !== -1 ||
          (filtraTipo &&
            reg.tipoConta.toLowerCase().indexOf(filtro.toLowerCase()) !== -1)
      );
      setFiltrados(filtrados);
      const tiposDistintos = [
        ...new Set(filtrados.map((item) => item.tipoConta)),
      ];
      setTiposDistintos(tiposDistintos);
      return;
    }

    setFiltrados(contas);
    const tiposDistintos = [...new Set(contas.map((item) => item.tipoConta))];
    setTiposDistintos(tiposDistintos);
  };

  useEffect(() => {
    //console.log('page_load');
    // Título da aba
    // document.title = `Contas ${process.env.NEXT_PUBLIC_VERSION} - Contas`;
    document.title = "Contas";
  }, []);

  useEffect(() => {
    console.log("page_refresh");
    getAllTipos();
    getAll();
  }, [refresh]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setConta({ ...conta, [name]: value });
    setLenDescricao(value.length);
  };

  const handleFilterChange = (event) => {
    var txt = event.target.value.trim();
    setFiltro(txt);
    filtraContas(contas, txt, filtraTipo);
  };

  const handleTipoContaChange = (event) => {
    setConta({ ...conta, idTipoConta: event.target.value });
  };

  const handleCreate = async function () {
    setConta({ id: null, descricao: "", idTipoConta: "" });
    setStatus("create");
    setTituloCRUD("Inclusão");
    setCorTituloCRUD(theme.colors.blue12);
    setLenDescricao(0);
    setModalCRUDShow(true);
  };

  const handleEdit = async function (id) {
    const reg = contas.find((r) => r.id == id);
    setConta(reg);
    setStatus("edit");
    setTituloCRUD("Alteração");
    setCorTituloCRUD(theme.colors.blue12);
    setLenDescricao(reg.descricao.length);
    setModalCRUDShow(true);
  };

  const handleDelete = async function (id) {
    setId(id);
    setStatus("delete");
    setTituloCRUD("Atenção!");
    setCorTituloCRUD(theme.colors.tomato11);
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
    setConta(null);
    setStatus("list");
  };

  const doCreate = async function () {
    const response = await servicoConta.create(conta);

    if (response.data.msg && response.data.msg !== "ok") {
      errPopup(response.data.msg);
      return;
    }

    setModalCRUDShow(false);
    setRefresh(!refresh);
  };

  const doUpdate = async function () {
    const response = await servicoConta.update(conta);

    if (response.data.msg && response.data.msg !== "ok") {
      errPopup(response.data.msg);
      return;
    }

    setModalCRUDShow(false);
    setRefresh(!refresh);
  };

  const doDelete = async function () {
    setModalCRUDShow(false);
    const response = await servicoConta.remove(id);

    if (response.data.msg && response.data.msg !== "ok") {
      errPopup(response.data.msg);
      return;
    }

    setRefresh(!refresh);
  };

  const handleFiltroTipos = function (e) {
    setFiltraTipo(e.target.checked);
    filtraContas(contas, filtro, e.target.checked);
  };

  return (
    <div className={styles.container}>
      <div className="row m-0">
        <div className="col-12">
          <div className={styles.titulo}>
            <div className={styles.titulo2}>
              <h4>Contas</h4>
              <button className="btn-insert" onClick={handleCreate}>
                <FiPlus />
                Novo
              </button>
            </div>
            <div>
              <span className={styles.spanTipos}>Incluir tipo no filtro</span>
              <input
                className={styles.spanTipos}
                type="checkbox"
                name="chkTipos"
                onChange={handleFiltroTipos}
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
          <hr />
        </div>
      </div>
      <div style={{ height: "82vh", overflowY: "scroll" }}>
        <div className="row m-0">
          {!isLoading &&
            filtrados &&
            tiposDistintos &&
            tiposDistintos.map((tipo) => (
              <div key={`${tipo}`} className={styles.grupoConta}>
                <div className={`col-12 ${styles.grupoTitulo}`}>
                  <span className={styles.grupoTexto}>{tipo}</span>
                </div>
                <div className={`col-12 p-0 m-0 ${styles.cardContainer}`}>
                  <div className="row row-cols-md-5 m-0">
                    {!isLoading &&
                      filtrados &&
                      filtrados
                        .filter((f) => f.tipoConta === tipo)
                        .map((conta) => (
                          <div key={`${tipo}conta${conta.id}`} className="p-2">
                            <Card
                              id={conta.id}
                              qtde={conta.qtde}
                              titulo1="Tipo"
                              linha1={`${conta.tipoConta}`}
                              linha2={conta.descricao}
                              color={theme.colors.gray1}
                              bgColor={theme.colors.gray11}
                              delColor={theme.colors.gray1}
                              bgDelColor={theme.colors.tomato11}
                              editColor={theme.colors.gray1}
                              bgEditColor={theme.colors.green11}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                            />
                          </div>
                        ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

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
      <CenteredModal
        backdrop="static"
        titulo={tituloCRUD}
        corTitulo={corTituloCRUD}
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
        {status === "delete" && <h5>Confirme a exclusão...</h5>}
        {(status === "create" || status === "edit") && (
          <>
            <div className="form-group">
              <label htmlFor="descricao" className="control-label">
                Descrição
              </label>
              <input
                type="text"
                className="form-control"
                id="descricao"
                required
                value={conta.descricao}
                onChange={handleInputChange}
                name="descricao"
                maxLength={45}
                autoFocus
              />
            </div>
            <div className={styles.divContador}>
              <span className={styles.contador}>{lenDescricao}</span>
            </div>
            <div className="form-group">
              <label htmlFor="tipo" className="control-label">
                Tipo de Conta
              </label>
              {status === "create" && (
                <select
                  className="form-control"
                  value={conta.idTipoConta}
                  onChange={handleTipoContaChange}
                >
                  {tipos.map((tipo) => {
                    const { key, value } = tipo;
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
                  type="text"
                  className="form-control"
                  disabled
                  value={conta.tipoConta}
                  style={{ width: "100%" }}
                />
              )}
            </div>
          </>
        )}
      </CenteredModal>
    </div>
  );
}
