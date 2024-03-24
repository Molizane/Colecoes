import { useEffect, useState } from 'react';
import { FiPlus } from "react-icons/fi";

import Card from '../../components/Card';
import CenteredModal from '../../components/ModalDialog';

import servicoLancto from '../../services/LanctoService';
import servicoconta from '../../services/ContaService';

import styles from './styles.module.scss'

export default function Lancto() {
    const [isLoading, setIsLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [status, setStatus] = useState('list');

    const [lanctos, setLanctos] = useState([]);
    const [id, setId] = useState();
    const [lancto, setLancto] = useState(null);
    const [contas, setContas] = useState([]);

    // Popup mensagens
    const [messageShow, setMessageShow] = useState(false);
    const [texto, setTexto] = useState('');
    const [titulo, setTitulo] = useState('');
    const [corTitulo, setCorTitulo] = useState('');

    // Popup CRUD
    const [modalCRUDShow, setModalCRUDShow] = useState(false);
    const [tituloCRUD, setTituloCRUD] = useState('');
    const [corTituloCRUD, setCorTituloCRUD] = useState('');

    const [lenDescricao, setLenDescricao] = useState(0);
    const [filtro, setFiltro] = useState('');
    const [filtrados, setFiltrados] = useState(null);
    const [filtraConta, setFiltraConta] = useState(false);

    const errPopup = function (msg) {
        setTitulo('Erro');
        setCorTitulo('red');
        setTexto(msg);
        setMessageShow(true);
    }

    const getAllContas = async () => {
        const response = await servicoconta.getAll();

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
                { key: '', value: 'Selecione um Conta de Lançamento' },
                ...results
            ])
        }
    };

    const getAllLanctos = async () => {
        const response = await servicoLancto.getAllLanctos();

        if (response.data.msg) {
            errPopup(response.data.msg);
            return;
        }

        setLanctos(response.data);
        filtraLanctos(response.data, filtro, filtraConta);
        setIsLoading(false);
    };

    useEffect(() => {
        getAllContas();

        //console.log('page_load');
        // Título da aba
        // document.title = `Lanctos ${process.env.NEXT_PUBLIC_VERSION} - Lanctos`;
        document.title = 'Lanctos';
    }, []);

    useEffect(() => {
        getAllLanctos();
    }, [refresh]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setLancto({ ...lancto, [name]: value });
        setLenDescricao(value.length);
    };

    const handleSelectChange = event => {
        setLancto({ ...lancto, idContaLancto: event.target.value });
    };

    const filtraLanctos = (lanctos, filtro, filtraConta) => {
        if (filtro) {
            const filtrados = lanctos.filter(
                (reg) =>
                    reg.descricao.toLowerCase().indexOf(filtro.toLowerCase()) !== -1
                    ||
                    (filtraConta && reg.contaLancto.toLowerCase().indexOf(filtro.toLowerCase()) !== -1));
            setFiltrados(filtrados);
            return;
        }

        setFiltrados(lanctos);
    };

    const handleFilterChange = (event) => {
        var txt = event.target.value.trim();
        setFiltro(txt);
        filtraLanctos(lanctos, txt, filtraConta);
    };

    const handleCreate = async function () {
        setLancto({ id: null, descricao: '', idContaLancto: '' });
        setStatus('create');
        setTituloCRUD('Inclusão');
        setCorTituloCRUD('blue');
        setLenDescricao(0);
        setModalCRUDShow(true);
    };

    const handleEdit = async function (id) {
        const reg = lanctos.find((r) => r.id == id);
        setLancto(reg);
        setStatus('edit');
        setTituloCRUD('Alteração');
        setCorTituloCRUD('blue');
        setLenDescricao(reg.descricao.length);
        setModalCRUDShow(true);
    };

    const handleDelete = async function (id) {
        setId(id);
        setStatus('delete');
        setTituloCRUD('Atenção!');
        setCorTituloCRUD('#ff0000');
        setModalCRUDShow(true);
    };

    const doPopupAction = async function () {
        if (status === 'delete') {
            await doDelete();
            return;
        }

        if (status === 'create') {
            await doCreate();
            return;
        }

        if (status === 'edit') {
            await doUpdate();
            return;
        }
    };

    const handleCancel = async function () {
        setModalCRUDShow(false);
        setLancto(null);
        setStatus('list');
    };

    const doCreate = async function () {
        const response = await servicoLancto.create(lancto);

        if (response.data.msg && response.data.msg !== 'ok') {
            errPopup(response.data.msg);
            return;
        }

        setModalCRUDShow(false);
        setRefresh(!refresh);
    };

    const doUpdate = async function () {
        const response = await servicoLancto.update(lancto);

        if (response.data.msg && response.data.msg !== 'ok') {
            errPopup(response.data.msg);
            return;
        }

        setModalCRUDShow(false);
        setRefresh(!refresh);
    };

    const doDelete = async function () {
        setModalCRUDShow(false);
        const response = await servicoLancto.remove(id);

        if (response.data.msg && response.data.msg !== 'ok') {
            errPopup(response.data.msg);
            return;
        }

        setRefresh(!refresh);
    };

    const handleFiltroContas = function (e) {
        setFiltraConta(e.target.checked);
        filtraLanctos(lanctos, filtro, e.target.checked);
    }

    return (
        <div className={styles.container}>
            <div className='row m-0'>
                <div className='col-12'>
                    <div className={styles.titulo}>
                        <div className={styles.titulo2}>
                            <h4>Tipos de Contas</h4>
                            <button className='btn-insert' onClick={handleCreate}><FiPlus />Novo</button>
                        </div>
                        <input type='search' placeholder='Filtro..' name='filtro' maxLength={45} value={filtro} onChange={handleFilterChange} />
                    </div>
                    <hr />
                </div>
            </div>
            <div style={{ height: '75vh', overflowY: 'scroll' }}>
                <div className='row row-cols-md-5 m-0'>
                    {
                        !isLoading && filtrados && filtrados.map(tipo => (
                            <div key={`tipo${tipo.id}`} className='p-2'>
                                <Card
                                    id={tipo.id}
                                    qtde={tipo.qtde}
                                    linha2={tipo.descricao}
                                    color='white'
                                    bgColor='#3f3f3f'
                                    delColor='white'
                                    bgDelColor='red'
                                    editColor='white'
                                    bgEditColor='green'
                                    onEdit={handleEdit}
                                    onDelete={handleDelete} />
                            </div>
                        ))
                    }
                </div>
            </div>

            {/* Popup mensagens diversas */}
            <CenteredModal
                titulo={titulo}
                corTitulo={corTitulo}
                conteudo={texto}
                corConteudo='#515151'
                closeButton={true}
                eye={true}
                show={messageShow}
                onHide={() => setMessageShow(false)} />

            {/* Popup CRUD */}
            <CenteredModal
                backdrop='static'
                titulo={tituloCRUD}
                corTitulo={corTituloCRUD}
                corConteudo='white'
                closeButton={false}
                thumbsUp={status === 'delete'}
                thumbsDown={status === 'delete'}
                floppy={status !== 'delete'}
                cancel={status !== 'delete'}
                show={modalCRUDShow}
                onConfirm={() => doPopupAction()}
                onHide={() => handleCancel()} >
                {
                    status === 'delete' &&
                    <h5>Confirme a exclusão...</h5>
                }
                {
                    (status === 'create' || status === 'edit') &&
                    <>
                        <div className='form-group'>
                            <label htmlFor='descricao' className='control-label'>Descrição</label>
                            <input
                                type='text'
                                className='form-control'
                                id='descricao'
                                required
                                value={tipo.descricao}
                                onChange={handleInputChange}
                                name='descricao'
                                maxLength={45}
                                autoFocus
                            />
                        </div>
                        <div className={styles.divContador}>
                            <span className={styles.contador}>{lenDescricao}</span>
                        </div>
                    </>
                }
            </CenteredModal>
        </div >
    );
}
