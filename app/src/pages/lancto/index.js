import { useEffect, useState } from "react";
import { FaArrowsRotate } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";

import CenteredModal from "../../components/ModalDialog";
import servicoLancto from "../../services/LanctoService";
import servicoConta from "../../services/ContaService";
import { strDate, strValue, themeColors } from "../../functions/utils";

import styles from "./styles.module.scss";

import { FiPlus } from "react-icons/fi";
import { AiFillEye, AiFillEdit } from "react-icons/ai";
import { BsFillTrash3Fill } from "react-icons/bs";
//import { IoWallet } from "react-icons/io5";
import { MdPriceCheck, MdOutlineMoneyOff } from "react-icons/md";

export default function Lancto() {
  const theme = themeColors();
  const tomatoGridColors = [theme.colors.tomato5, theme.colors.tomato8];
  const amberGridColors = [theme.colors.amber5, theme.colors.amber8];
  const greenGridColors = [theme.colors.green5, theme.colors.green8];
  const cyanGridColors = [theme.colors.cyan5, theme.colors.cyan8];

  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [status, setStatus] = useState("list");

  const [lanctos, setLanctos] = useState([]);
  const [id, setId] = useState();
  const [lancto, setLancto] = useState(null);
  const [contas, setContas] = useState([]);
  const [criterio, setCriterio] = useState("a");

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
  const [filtraConta, setFiltraConta] = useState(false);

  const errPopup = function (msg) {
    setTitulo("Erro");
    setCorTitulo(theme.colors.tomato11);
    setTexto(msg);
    setMessageShow(true);
  };

  const getAllContas = async () => {
    const response = await servicoConta.getAll();

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

      setContas([
        { key: "", value: "Selecione uma conta de lançamento" },
        ...results,
      ]);
    }
  };

  const getAll = async () => {
    const response = await servicoLancto.getAll(criterio);

    if (response.data.msg) {
      errPopup(response.data.msg);
      return;
    }

    setLanctos(response.data);
    filtraLanctos(response.data, filtro, filtraConta);
    setIsLoading(false);
  };

  const filtraLanctos = (lanctos, filtro, filtraConta) => {
    if (filtro) {
      const filtrados = lanctos.filter(
        (reg) =>
          (
            reg.descricao.toLowerCase() + reg.descrParcela.toLowerCase()
          ).indexOf(filtro.toLowerCase()) !== -1 ||
          (filtraConta &&
            reg.conta.toLowerCase().indexOf(filtro.toLowerCase()) !== -1)
      );
      setFiltrados(filtrados);
      return;
    }

    setFiltrados(lanctos);
  };

  useEffect(() => {
    //console.log('page_load');
    // Título da aba
    //document.title = `Contas ${process.env.NEXT_PUBLIC_VERSION} - Lançamentos`;
    document.title = "Lançamentos";
  }, []);

  useEffect(() => {
    console.log("page_refresh");
    getAllContas();
    getAll();
  }, [refresh]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLancto({ ...lancto, [name]: value });
    setLenDescricao(value.length);
  };

  const handleFilterChange = (event) => {
    var txt = event.target.value.trim();
    setFiltro(txt);
    filtraLanctos(lanctos, txt, filtraConta);
  };

  const handleCreate = async function () {
    setLancto({ id: null, descricao: "", idContaLancto: "" });
    setStatus("create");
    setTituloCRUD("Inclusão");
    setCorTituloCRUD(theme.colors.blue12);
    setLenDescricao(0);
    setModalCRUDShow(true);
  };

  const handleEdit = async function (id) {
    const reg = lanctos.find((r) => r.id == id);
    setLancto(reg);
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
    setLancto(null);
    setStatus("list");
  };

  const doCreate = async function () {
    const response = await servicoLancto.create(lancto);

    if (response.data.msg && response.data.msg !== "ok") {
      errPopup(response.data.msg);
      return;
    }

    setModalCRUDShow(false);
    setRefresh(!refresh);
  };

  const doUpdate = async function () {
    const response = await servicoLancto.update(lancto);

    if (response.data.msg && response.data.msg !== "ok") {
      errPopup(response.data.msg);
      return;
    }

    setModalCRUDShow(false);
    setRefresh(!refresh);
  };

  const doDelete = async function () {
    setModalCRUDShow(false);
    const response = await servicoLancto.remove(id);

    if (response.data.msg && response.data.msg !== "ok") {
      errPopup(response.data.msg);
      return;
    }

    setRefresh(!refresh);
  };

  const handleFiltroContas = function (e) {
    setFiltraConta(e.target.checked);
    filtraLanctos(lanctos, filtro, e.target.checked);
  };

  const doRefresh = function () {
    setRefresh(!refresh);
  };

  return (
    <div className={styles.container}>
      <div className="row m-0">
        <div className="col-12">
          <div className={styles.titulo}>
            <div className={styles.titulo2}>
              <h4>Lançamentos de Contas</h4>
              <button className="btn-insert" onClick={handleCreate}>
                <FiPlus />
                Novo
              </button>
            </div>
            <div>
              <span className={styles.spanTipos}>Incluir conta no filtro</span>
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
          <hr />
        </div>
      </div>

      <div style={{ marginLeft: "12px", marginRight: "22px" }}>
        <Tooltip
          id="atualizarTip"
          effect="solid"
          style={{
            backgroundColor: theme.colors.blue10,
            color: theme.colors.gray1,
          }}
        />

        <div className="row m-0" style={{ fontWeight: "bold" }}>
          <div className="col-1">Situação</div>
          <div className="col-4">Descrição</div>
          <div className="col-4">Conta</div>
          <div className="col-1">Vencimento</div>
          <div className="col-1">Valor</div>
          <div className={`col-1 ${styles.refresh} `}>
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
        </div>
      </div>

      <div className="row m-0">
        <div className="col-12">
          <hr style={{ marginTop: "1px", marginBottom: "2px" }} />
        </div>
      </div>

      <div
        style={{
          height: "79vh",
          overflowY: "scroll",
          overflowX: "hidden",
          marginLeft: "12px",
        }}
      >
        {!isLoading &&
          filtrados &&
          filtrados.map((lancto, index) => {
            var style = "";

            if (lancto.status == 0) {
              // Vencido
              style = {
                //backgroundColor: theme.colors.tomato8,
                backgroundColor: tomatoGridColors[index % 2],
                color: theme.colors.gray11,
                fontWeight: "bold",
              };
            } else if (lancto.status == 1) {
              // Vencendo
              style = {
                //backgroundColor: theme.colors.amber3,
                backgroundColor: amberGridColors[index % 2],
                color: theme.colors.gray11,
                fontWeight: "bold",
              };
            } else if (lancto.status == 2) {
              // A vencer
              style = {
                //backgroundColor: theme.colors.green6,
                backgroundColor: greenGridColors[index % 2],
                color: theme.colors.gray11,
              };
            } else {
              // Pago
              style = {
                //backgroundColor: theme.colors.gray3,
                backgroundColor: cyanGridColors[index % 2],
                color: theme.colors.gray11,
              };
            }

            return (
              <div
                className="row m-0"
                style={style}
                key={`lancto${lancto.id}${lancto.parcela}`}
              >
                <div className="col-1">{lancto.tipo}</div>
                <div className="col-4">{`${lancto.descricao}${lancto.descrParcela}`}</div>
                <div className="col-4">{lancto.conta}</div>
                <div className="col-1">{strDate(lancto.dtVencto)}</div>
                <div className="col-1">{strValue(lancto.vlTotal)}</div>
                <div className={`col-1 ${styles.funcoes}`}>
                  <AiFillEye
                    className="btn-refresh"
                    data-tooltip-id="atualizarTip"
                    data-tooltip-content="Visualizar"
                    data-tooltip-place="top"
                  />
                  <AiFillEdit
                    className="btn-refresh"
                    data-tooltip-id="atualizarTip"
                    data-tooltip-content="Editar"
                    data-tooltip-place="top"
                  />
                  <BsFillTrash3Fill
                    className="btn-refresh"
                    data-tooltip-id="atualizarTip"
                    data-tooltip-content="Excluir"
                    data-tooltip-place="top"
                  />
                  {!lancto.flPago && (
                    <MdPriceCheck
                      className="btn-refresh"
                      data-tooltip-id="atualizarTip"
                      data-tooltip-content="Baixar"
                      data-tooltip-place="top"
                    />
                  )}
                  {lancto.flPago && (
                    <MdOutlineMoneyOff
                      className="btn-refresh"
                      data-tooltip-id="atualizarTip"
                      data-tooltip-content="Estornar"
                      data-tooltip-place="top"
                    />
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Popup mensagens diversas */}
      <CenteredModal
        titulo={titulo}
        corTitulo={corTitulo}
        conteudo={texto}
        corConteudo={theme.colors.gray8}
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
                value={tipo.descricao}
                onChange={handleInputChange}
                name="descricao"
                maxLength={45}
                autoFocus
              />
            </div>
            <div className={styles.divContador}>
              <span className={styles.contador}>{lenDescricao}</span>
            </div>
          </>
        )}
      </CenteredModal>
    </div>
  );
}
