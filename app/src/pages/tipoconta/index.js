import { useEffect, useState } from 'react';
import servico from '../../services/TipoContaService';
import styles from './styles.module.scss'
import Card from '../../components/Card';
import CenteredModal from '../../components/ModalDialog';
import { CiCirclePlus } from 'react-icons/ci';

export default function TipoConta() {
    const [isLoading, setIsLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [status, setStatus] = useState('list');

    const [tipos, setTipos] = useState(null);
    const [id, setId] = useState();
    const [tipo, setTipo] = useState(null);

    const [messageShow, setMessageShow] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [corTitulo, setCorTitulo] = useState('');
    const [texto, setTexto] = useState('');

    const [lenDescricao, setLenDescricao] = useState(0);
    const [filtro, setFiltro] = useState('');
    const [filtrados, setFiltrados] = useState(null);

    const errPopup = function (msg) {
        setTitulo('Erro');
        setCorTitulo('red');
        setTexto(msg);
        setTipos(null);
        setMessageShow(true);
    }

    const getAll = async () => {
        const response = await servico.getAll();
        setIsLoading(false);

        if (response.data.message) {
            errPopup(response.data.message);
            return;
        }

        setTipos(response.data);

        if (filtro) {
            setFiltrados(response.data.filter((reg) => reg.descricao.toLowerCase().indexOf(filtro.toLowerCase()) !== -1));
            return;
        }

        setFiltrados(response.data);
    };

    useEffect(() => {
        //console.log('page_load');
        // Título da aba
        // document.title = `Contas ${process.env.NEXT_PUBLIC_VERSION} - Tipos de Contas`;
        document.title = 'Tipos de Contas';
    }, []);

    useEffect(() => {
        getAll();
    }, [refresh]);

    const handleInputChange = (event) => {
        //console.log(event.target);
        const { name, value } = event.target;
        setTipo({ ...tipo, [name]: value });
        setLenDescricao(value.length);
    };

    const handleFilterChange = (event) => {
        //console.log(event.target);
        var txt = event.target.value.trim();
        setFiltro(txt);

        if (txt) {
            setFiltrados(tipos.filter((reg) => reg.descricao.toLowerCase().indexOf(txt.toLowerCase()) !== -1));
            return;
        }

        setFiltrados(tipos);
    };

    const handleCreate = async function () {
        setStatus('create');
        setTitulo('Inclusão');
        setCorTitulo('blue');
        setTipo({ id: null, descricao: null });
        setLenDescricao(0);
        setModalShow(true);
    };

    const handleEdit = async function (id) {
        const reg = tipos.find((r) => r.id == id);
        setTipo(reg);
        setStatus('edit');
        setTitulo('Alteração');
        setCorTitulo('blue');
        setLenDescricao(reg.descricao.length);
        setModalShow(true);
    };

    const handleDelete = async function (id) {
        setId(id);
        setStatus('delete');
        setTitulo('Atenção!');
        setCorTitulo('#ff0000');
        setModalShow(true);
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
        setModalShow(false);
        setTipo(null);
        setStatus('list');
    };

    const doCreate = async function () {
        const response = await servico.create(tipo);

        if (response.data.message) {
            errPopup(response.data.message);
            return;
        }

        setModalShow(false);
        setRefresh(!refresh);
    };

    const doUpdate = async function () {
        console.log(tipo);
        const response = await servico.update(tipo);

        if (response.data.message) {
            errPopup(response.data.message);
            return;
        }

        setModalShow(false);
        setRefresh(!refresh);
    };

    const doDelete = async function () {
        setModalShow(false);
        const response = await servico.remove(id);

        if (response.data.message) {
            errPopup(response.data.message);
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
                            <h2>Tipos de Contas</h2>
                            <div className={styles.btnInsert} onClick={handleCreate}><CiCirclePlus /></div>
                        </div>
                        <input type='text' placeholder='Filtro..' name='filtro' maxLength={45} value={filtro} onChange={handleFilterChange} />
                    </div>
                    <hr />
                </div>
            </div>
            <div style={{ height: '75vh', overflowY: 'scroll' }}>
                <div className='row m-0'>
                    {
                        !isLoading && filtrados && filtrados.map(tipo => (
                            <div key={`tipo${tipo.id}`} className='col-3 p-2'>
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
                titulo={titulo}
                corTitulo={corTitulo}
                //corConteudo='#515151'
                corConteudo='white'
                closeButton={false}
                thumbsUp={status === 'delete'}
                thumbsDown={status === 'delete'}
                floppy={status !== 'delete'}
                cancel={status !== 'delete'}
                show={modalShow}
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
                            <label htmlFor='descricao'>Descrição</label>
                            <input
                                type='text'
                                className='form-control'
                                id='descricao'
                                required
                                value={tipo.descricao}
                                onChange={handleInputChange}
                                name='descricao'
                                maxLength={45}
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
