import { useEffect, useState } from "react";
import servico from "../../services/TipoContaService";
import styles from "./styles.module.scss";
import Card from "../../components/Card";
import CenteredModal from "../../components/ModalDialog";
import { FiPlus } from "react-icons/fi";

export default function TipoConta() {
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [status, setStatus] = useState("list");

  const [tipos, setTipos] = useState(null);
  const [id, setId] = useState();
  const [tipo, setTipo] = useState(null);

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

  const errPopup = function (msg) {
    setTitulo("Erro");
    setCorTitulo("red");
    setTexto(msg);
    setMessageShow(true);
  };

  const getAll = async () => {
    const response = await servico.getAll();

    if (response.data.message) {
      errPopup(response.data.message);
      return;
    }

    setTipos(response.data);

    if (filtro) {
      setFiltrados(
        response.data.filter(
          (reg) =>
            reg.descricao.toLowerCase().indexOf(filtro.toLowerCase()) !== -1
        )
      );
      return;
    }

    setIsLoading(false);
    setFiltrados(response.data);
  };

  useEffect(() => {
    //console.log('page_load');
    // Título da aba
    // document.title = `Contas ${process.env.NEXT_PUBLIC_VERSION} - Tipos de Conta`;
    document.title = "Tipos de Conta";
  }, []);

  useEffect(() => {
    getAll();
  }, [refresh]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTipo({ ...tipo, [name]: value });
    setLenDescricao(value.length);
  };

  const handleFilterChange = (event) => {
    var txt = event.target.value.trim();
    setFiltro(txt);

    if (txt) {
      setFiltrados(
        tipos.filter(
          (reg) => reg.descricao.toLowerCase().indexOf(txt.toLowerCase()) !== -1
        )
      );
      return;
    }

    setFiltrados(tipos);
  };

  const handleCreate = async function () {
    setTipo({ id: null, descricao: "" });
    setStatus("create");
    setTituloCRUD("Inclusão");
    setCorTituloCRUD("blue");
    setLenDescricao(0);
    setModalCRUDShow(true);
  };

  const handleEdit = async function (id) {
    const reg = tipos.find((r) => r.id == id);
    setTipo(reg);
    setStatus("edit");
    setTituloCRUD("Alteração");
    setCorTituloCRUD("blue");
    setLenDescricao(reg.descricao.length);
    setModalCRUDShow(true);
  };

  const handleDelete = async function (id) {
    setId(id);
    setStatus("delete");
    setTituloCRUD("Atenção!");
    setCorTituloCRUD("#ff0000");
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
    setTipo(null);
    setStatus("list");
  };

  const doCreate = async function () {
    const response = await servico.create(tipo);

    if (response.data.msg && response.data.msg !== "ok") {
      errPopup(response.data.msg);
      return;
    }

    setModalCRUDShow(false);
    setRefresh(!refresh);
  };

  const doUpdate = async function () {
    const response = await servico.update(tipo);

    if (response.data.msg && response.data.msg !== "ok") {
      errPopup(response.data.msg);
      return;
    }

    setModalCRUDShow(false);
    setRefresh(!refresh);
  };

  const doDelete = async function () {
    setModalCRUDShow(false);
    const response = await servico.remove(id);

    if (response.data.msg && response.data.msg !== "ok") {
      errPopup(response.data.msg);
      return;
    }

    setRefresh(!refresh);
  };

  return (
    <div className={styles.container}>
      <div className="row m-0">
        <div className="col-12">
          <div className={styles.titulo}>
            <div className={styles.titulo2}>
              <h4>Tipos de Conta</h4>
              <button className="btn-insert" onClick={handleCreate}>
                <FiPlus />
                Novo
              </button>
            </div>
            <input
              type="search"
              placeholder="Filtro.."
              name="filtro"
              maxLength={45}
              value={filtro}
              onChange={handleFilterChange}
            />
          </div>
          <hr />
        </div>
      </div>
      <div style={{ height: "82vh", overflowY: "scroll" }}>
        <div className="row row-cols-md-5 m-0">
          {!isLoading &&
            filtrados &&
            filtrados.map((tipo) => (
              <div key={`tipo${tipo.id}`} className="p-2">
                <Card
                  id={tipo.id}
                  qtde={tipo.qtde}
                  linha2={tipo.descricao}
                  color="white"
                  bgColor="#3f3f3f"
                  delColor="white"
                  bgDelColor="red"
                  editColor="white"
                  bgEditColor="green"
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            ))}
        </div>
      </div>

      {/* Popup mensagens diversas */}
      <CenteredModal
        titulo={titulo}
        corTitulo={corTitulo}
        conteudo={texto}
        corConteudo="#515151"
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
        corConteudo="white"
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
