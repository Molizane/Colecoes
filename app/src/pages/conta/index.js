import { useEffect, useState } from 'react';
import { FiPlus } from "react-icons/fi";

import Card from '../../components/Card';
import CenteredModal from '../../components/ModalDialog';

import servicoConta from '../../services/ContaService';
import servico from '../../services/TipoContaService';

import styles from './styles.module.scss'

export default function Conta() {
    const [isLoading, setIsLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [status, setStatus] = useState('list');

    const [contas, setContas] = useState([]);
    const [id, setId] = useState();
    const [conta, setConta] = useState(null);
    const [tipos, setTipos] = useState([]);
    const [tiposDistintos, setTiposDistintos] = useState([]);

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

    const errPopup = function (msg) {
        setTitulo('Erro');
        setCorTitulo('red');
        setTexto(msg);
        setMessageShow(true);
    }

    const getAllTipos = async () => {
        const response = await servico.getAll();

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

            setTipos([
                { key: '', value: 'Selecione um Tipo de Conta' },
                ...results
            ])
        }
    };

    const getAll = async () => {
        const response = await servicoConta.getAll();

        if (response.data.msg) {
            errPopup(response.data.msg);
            return;
        }

        setContas(response.data);
        setIsLoading(false);

        if (filtro) {
            const filtrados = response.data.filter((reg) => reg.descricao.toLowerCase().indexOf(filtro.toLowerCase()) !== -1);
            setFiltrados(filtrados);
            const tiposDistintos = [...new Set(filtrados.map(item => item.tipoConta))];
            setTiposDistintos(tiposDistintos);
            return;
        }

        setFiltrados(response.data);
        const tiposDistintos = [...new Set(response.data.map(item => item.tipoConta))];
        setTiposDistintos(tiposDistintos);
    };

    useEffect(() => {
        getAllTipos();

        //console.log('page_load');
        // Título da aba
        // document.title = `Contas ${process.env.NEXT_PUBLIC_VERSION} - Contas`;
        document.title = 'Contas';
    }, []);

    useEffect(() => {
        getAll();
    }, [refresh]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setConta({ ...conta, [name]: value });
        setLenDescricao(value.length);
    };

    const handleSelectChange = event => {
        setConta({ ...conta, idTipoConta: event.target.value });
    };

    const handleFilterChange = (event) => {
        var txt = event.target.value.trim();
        setFiltro(txt);

        if (txt) {
            const filtrados = contas.filter((reg) => reg.descricao.toLowerCase().indexOf(txt.toLowerCase()) !== -1);
            setFiltrados(filtrados);

            const tiposDistintos = [...new Set(filtrados.map(item => item.tipoConta))];
            setTiposDistintos(tiposDistintos);
            return;
        }

        setFiltrados(contas);

        const tiposDistintos = [...new Set(contas.map(item => item.tipoConta))];
        setTiposDistintos(tiposDistintos);
    };

    const handleCreate = async function () {
        setConta({ id: null, descricao: '', idTipoConta: '' });
        setStatus('create');
        setTituloCRUD('Inclusão');
        setCorTituloCRUD('blue');
        setLenDescricao(0);
        setModalCRUDShow(true);
    };

    const handleEdit = async function (id) {
        console.log(id);
        const reg = contas.find((r) => r.id == id);
        setConta(reg);
        setStatus('edit');
        setTituloCRUD('Alteração');
        setCorTituloCRUD('blue');
        setLenDescricao(reg.descricao.length);
        setModalCRUDShow(true);
    };

    const handleDelete = async function (id) {
        console.log(id);
        setId(id);
        setStatus('delete');
        setTituloCRUD('Atenção!');
        setCorTituloCRUD('#ff0000');
        setModalCRUDShow(true);
    };

    const doPopupAction = async function () {
        console.log(status);

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
        setConta(null);
        setStatus('list');
    };

    const doCreate = async function () {
        const response = await servicoConta.create(conta);

        if (response.data.msg && response.data.msg !== 'ok') {
            errPopup(response.data.msg);
            return;
        }

        setModalCRUDShow(false);
        setRefresh(!refresh);
    };

    const doUpdate = async function () {
        const response = await servicoConta.update(conta);

        if (response.data.msg && response.data.msg !== 'ok') {
            errPopup(response.data.msg);
            return;
        }

        setModalCRUDShow(false);
        setRefresh(!refresh);
    };

    const doDelete = async function () {
        setModalCRUDShow(false);
        const response = await servicoConta.remove(id);

        if (response.data.msg && response.data.msg !== 'ok') {
            errPopup(response.data.msg);
            return;
        }

        setRefresh(!refresh);
    };

    return (
        <div className={styles.container}>
            <div className='row m-0'>
                <div className='col-12'>
                    <div className={styles.titulo}>
                        <div className={styles.titulo2}>
                            <span>Contas</span>
                            <button className='btn-insert' onClick={handleCreate}><FiPlus />Novo</button>
                        </div>
                        <input type='search' className={styles.search} placeholder='Filtro..' name='filtro' maxLength={45} value={filtro} onChange={handleFilterChange} />
                    </div>
                    <hr />
                </div>
            </div>
            <div style={{ height: '75vh', overflowY: 'scroll' }}>
                <div className='row m-0'>
                    {
                        !isLoading && filtrados && tiposDistintos && tiposDistintos.map(tipo => (
                            <div key={`${tipo}`} className={styles.grupoConta}>
                                <div className={`col-12 ${styles.grupoTitulo}`}>
                                    <span className={styles.grupoTexto}>{tipo}</span>
                                </div>
                                <div className={`col-12 p-0 m-0 ${styles.cardContainer}`} >
                                    <div className='row row-cols-md-5 m-0'>
                                        {
                                            !isLoading && filtrados && filtrados
                                                .filter(f => f.tipoConta === tipo)
                                                .map(conta => (
                                                    <div key={`${tipo}conta${conta.id}`} className='p-2'>
                                                        <Card
                                                            id={conta.id}
                                                            qtde={conta.qtde}
                                                            titulo1='Tipo'
                                                            linha1={`${conta.tipoConta}`}
                                                            linha2={conta.descricao}
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
                                value={conta.descricao}
                                onChange={handleInputChange}
                                name='descricao'
                                maxLength={45}
                                autoFocus
                            />
                        </div>
                        <div className={styles.divContador}>
                            <span className={styles.contador}>{lenDescricao}</span>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='tipo' className='control-label'>Tipo de Conta</label>
                            {
                                status === 'create' &&
                                <select className='form-control'
                                    value={conta.idTipoConta}
                                    onChange={handleSelectChange}>
                                    {tipos.map(tipo => {
                                        const { key, value } = tipo;
                                        return (<option key={key} value={key}>{value}</option>
                                        );
                                    })}
                                </select>
                            }
                            {
                                status === 'edit' &&
                                <input
                                    type='text'
                                    className='form-control'
                                    disabled
                                    value={conta.tipoConta}
                                    style={{ width: '100%' }} />
                            }
                        </div>
                    </>
                }
            </CenteredModal>
        </div >
    );
}
