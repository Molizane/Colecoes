import { useEffect, useState } from "react";
import servico from "../../services/TipoContaService";
import styles from "./styles.module.scss"
import Card from "../../components/Card";
import CenteredModal from "../../components/ModalDialog";

export default function TipoConta() {
    const [tipos, setTipos] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [tipo, setTipo] = useState();
    const [id, setId] = useState();
    const [status, setStatus] = useState('lista');
    const [modalShow, setModalShow] = useState(false);
    const [modalDelShow, setModalDelShow] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [corTitulo, setCorTitulo] = useState('');
    const [texto, setTexto] = useState('');

    const getAll = async () => {
        const response = await servico.getAll();

        if (response.data.message) {
            setTitulo('Erro');
            setCorTitulo('red');
            setTexto(response.data.message);
            setModalShow(true);
            return;
        }

        setTipos(response.data);
    };

    useEffect(() => {
        console.log('page_load');

        // Título da aba
        // document.title = `Contas ${process.env.NEXT_PUBLIC_VERSION} - Tipos de Contas`;
        document.title = 'Tipos de Contas';
    }, []);

    useEffect(() => {
        getAll();
    }, [refresh]);

    const showModal = () => {
        setModalShow(true);
    };

    const handleInsert = async function () {
        setCurrReg(null);
        setStatus('insert');
    }

    const handleEdit = async function (id) {
        const reg = tipos.find((r) => r.id == id);
        setTipo(reg);
        setStatus('edit');
    }

    const handleDelete = async function (id) {
        setId(id);
        setStatus('delete');
        setModalDelShow(true);
    }

    const doDelete = async function () {
        setModalDelShow(false);
        const response = await servico.remove(id);
        console.log(response);
        setRefresh(!refresh);
    }

    const handleCancel = async function () {
        setCurrReg(null);
        setModalDelShow(false);
        setModalShow(false);
        setStatus('list');
    }

    return (
        <>
            <div className='row m-0'>
                <div className='col-12'>
                    <div className={styles.titulo}>
                        <h2>Tipos de Contas</h2>
                    </div>
                    <hr />
                </div>
                {
                    tipos && tipos.map(tipo => (
                        <div key={`tipo${tipo.id}`} className='col-3'>
                            <Card
                                id={tipo.id}
                                qtde={tipo.qtde}
                                descricao={tipo.descricao}
                                color='white'
                                bgColor='#3f3f3f'
                                delColor='red'
                                editColor='yellow'
                                onEdit={handleEdit}
                                onDelete={handleDelete} />
                        </div>
                    ))
                }
            </div>

            <CenteredModal
                titulo={titulo}
                corTitulo={corTitulo}
                conteudo={texto}
                corTexto='#515151'
                closeButton={true}
                eye={true}
                show={modalShow}
                onHide={() => setModalShow(false)} />

            <CenteredModal
                backdrop='static'
                titulo='Atenção!'
                corTitulo='#ff0000'
                conteudo='Confirme a exclusão...'
                corTexto='#515151'
                closeButton={false}
                thumbsUp={true}
                cross={true}
                show={modalDelShow}
                onConfirm={() => doDelete()}
                onHide={() => setModalDelShow(false)} />
        </>
    )
}
