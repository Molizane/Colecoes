import { useEffect, useState } from 'react';
import { Row } from 'react-bootstrap';
import { FiPlus } from 'react-icons/fi';
import { FaArrowsRotate } from 'react-icons/fa6';
import { AiFillEdit, AiFillEye } from 'react-icons/ai';
import { BsFillTrash3Fill } from 'react-icons/bs';

import styles from './styles.module.scss';

import { strDate, strValue, themeColors } from '../../functions/utils';
import CenteredModal from '../../components/CenteredModal';
import tipoContaService from '../../services/TipoContaService';
import contaService from '../../services/ContaService';
import lanctoService from '../../services/LanctoService';
import LanctoObj from '../../classes/LanctoObj';

export default function Credito() {
  const theme = themeColors();
  const greenGridColors = [theme.colors.green5, theme.colors.green8];

  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [status, setStatus] = useState('list');

  const [tiposVencto, setTiposVencto] = useState([]);
  const [contas, setContas] = useState([]);
  const [lanctos, setLanctos] = useState([]);

  const [regCRUD, setRegCRUD] = useState(null);
  const [lancto, setLancto] = useState(LanctoObj());

  const [id, setId] = useState(null);
  const [parcela, setParcela] = useState(null);

  // Popup mensagens
  const [messageShow, setMessageShow] = useState(false);
  const [texto, setTexto] = useState('');
  const [titulo, setTitulo] = useState('');
  const [corTitulo, setCorTitulo] = useState('');

  // Popup CRUD
  const [tipoCRUD, setTipoCRUD] = useState('');
  const [modalLanctoShow, setModalLanctoShow] = useState(false);
  const [modalDeleteShow, setModalDeleteShow] = useState(false);

  const [lenDescricao, setLenDescricao] = useState(0);
  const [filtrados, setFiltrados] = useState(null);
  const [filtro, setFiltro] = useState('');

  const erroPopup = function (msg) {
    setTitulo('Erro');
    setCorTitulo(theme.colors.tomato11);
    setTexto(msg);
    setMessageShow(true);
  };

  async function getTiposVencto() {
    var response = await tipoContaService.getAll('C');

    if (response.data.msg) {
      erroPopup(response.data.msg);
      return 0;
    }

    console.log('getTiposVencto');
    console.log(response.data);

    if (response.data.length == 0) {
      const reg = {
        id: null,
        descricao: 'Lançamento de Crédito',
        ehCredito: true,
      };

      if (!(await doCreate('T', reg))) {
        return 0;
      }

      return await getTiposVencto();
    }

    setTiposVencto(response.data);
    return response.data[0].id;
  }

  async function getContas(idTipoConta) {
    var response = await contaService.getAll('C');

    if (response.data.msg) {
      erroPopup(idTipoConta);
      return false;
    }

    console.log('getContas');
    console.log(idTipoConta);
    console.log(response.data);

    if (response.data.length == 0) {
      const reg = {
        id: null,
        descricao: 'Lançamentos de Crédito',
        idTipoConta: idTipoConta,
        ehCredito: true,
      };

      if (!doCreate('C', reg)) {
        return false;
      }

      return await getContas(idTipoConta);
    }

    setContas(response.data);
    return true;
  }

  const getLanctos = async () => {
    const response = await lanctoService.getAll('C');

    if (response.data.msg) {
      erroPopup(response.data.msg);
      setLanctos([]);
    } else {
      setLanctos(response.data);
    }
  };

  const getAll = async () => {
    var idTipoConta = await getTiposVencto();

    if (idTipoConta) {
      if (!(await getContas(idTipoConta))) {
        idTipoConta = 0;
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    //console.log('page_load');
    // Título da aba
    // document.title = `Contas ${process.env.NEXT_PUBLIC_VERSION} - Manutenção de Crédito`;
    document.title = 'Manutenção de Crédito';
    getAll();
  }, []);

  useEffect(() => {
    //console.log('page_refresh');
    getLanctos();
  }, [refresh]);

  useEffect(() => {
    filtraLanctos(lanctos, filtro);
  }, [lanctos, filtro]);

  const filtraLanctos = (lanctos, filtro) => {
    if (filtro) {
      var regs = regs.filter(
        (reg) =>
          (
            reg.descricao.toLowerCase() + reg.descrParcelas.toLowerCase()
          ).indexOf(filtro.toLowerCase()) !== -1
      );

      setFiltrados(regs);
      return;
    }

    setFiltrados(lanctos);
  };

  const handleFilterChange = (event) => {
    var txt = event.target.value.trim();
    setFiltro(txt);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLancto({ ...lancto, [name]: value });

    if (name == 'descricao') {
      setLenDescricao(value.length);
    }
  };

  const handleCreate = async function () {
    document.activeElement.blur();
    setTipoCRUD('L');
    setLancto({
      ...LanctoObj(),
      idConta: contas[0].id,
      flgDiasUteis: false,
      parcelas: 0,
      parcela: 0,
      flPago: true,
    });
    setStatus('create');
    setCorTitulo(theme.colors.blue12);
    setLenDescricao(0);
    setTitulo('Inclusão de Lançamento');
    setModalLanctoShow(true);
  };

  const handleEdit = async function (id, parcela) {
    document.activeElement.blur();
    setTipoCRUD('L');

    document.activeElement.blur();
    const reg = lanctos.find((r) => r.id == id && r.parcela == parcela);
    setLancto({ ...reg, flgUpdateAll: false });

    setStatus('edit');
    setTitulo('Alteração de Lançamento');

    setCorTitulo(theme.colors.blue12);
    setLenDescricao(reg.descricao.length);
    setModalLanctoShow(true);
  };

  const handleDelete = async function (id, parcela) {
    document.activeElement.blur();
    setId(id);
    setParcela(parcela);
    const reg = lanctos.find((r) => r.id == id && r.parcela == parcela);
    setLancto({ ...reg });
    setStatus('delete');
    setTitulo('Atenção!');
    setCorTitulo(theme.colors.tomato11);
    setModalDeleteShow(true);
  };

  const doPopupAction = async function () {
    if (status === 'create') {
      await doCreate('L');
      return;
    }

    if (status === 'edit') {
      await doUpdate();
      return;
    }

    if (status === 'delete') {
      await doDelete();
      return;
    }
  };

  const handleCancel = async function () {
    setModalDeleteShow(false);
    setRegCRUD(null);
    setTipoCRUD('');
    setStatus('list');
  };

  const doCreate = async function (tipoCRUD, reg) {
    var response;

    if (tipoCRUD == 'T') {
      response = await tipoContaService.create(reg);
    } else if (tipoCRUD == 'C') {
      response = await contaService.create(reg);
    } else {
      response = await lanctoService.create(lancto);
    }

    if (response.data.msg && response.data.msg !== 'ok') {
      erroPopup(response.data.msg);
      return false;
    }

    if (tipoCRUD === 'L') {
      setTipoCRUD('');
      setStatus('list');
      setModalLanctoShow(false);
      setRefresh(!refresh);
    }

    return true;
  };

  const doUpdate = async function () {
    var response;

    if (tipoCRUD == 'T') {
      response = await tipoContaService.update(regCRUD);
    } else if (tipoCRUD == 'C') {
      response = await contaService.update(regCRUD);
    } else {
      response = await lanctoService.update(lancto);
    }

    if (response.data.msg && response.data.msg !== 'ok') {
      erroPopup(response.data.msg);
      return;
    }

    setTipoCRUD('');
    setStatus('list');
    setModalLanctoShow(false);
    setRefresh(!refresh);
  };

  const doDelete = async function () {
    setModalLanctoShow(false);
    const response = await lanctoService.remove(id, parcela, 'U');

    if (response.data.msg && response.data.msg !== 'ok') {
      erroPopup(response.data.msg);
      return;
    }

    setTipoCRUD('');
    setStatus('list');
    setModalDeleteShow(false);
    setRefresh(!refresh);
  };

  const doRefresh = function () {
    setRefresh(!refresh);
  };

  return (
    <div className={styles.container}>
      <Row className='m-0'>
        <div className='col-12'>
          <div className={styles.titulo}>
            <div className={styles.titulo2}>
              <h4>Manutenção de Crédito</h4>
            </div>
          </div>
          <hr />
        </div>
      </Row>

      {!isLoading && tiposVencto.length > 0 && contas.length > 0 && (
        <>
          <Row className='m-0'>
            <div className='col-12'>
              <div className={styles.titulo}>
                <div className={styles.titulo2}>
                  <h5>Lançamentos de Crédito</h5>
                  <button className='btn-insert' onClick={handleCreate}>
                    <FiPlus />
                    Novo
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div>
                    <input
                      type='search'
                      className={styles.search}
                      placeholder='Filtro..'
                      name='filtro'
                      maxLength={45}
                      value={filtro}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Row>

          <div style={{ marginLeft: '50px', marginRight: '68px' }}>
            <Row
              style={{
                marginLeft: '1px',
                marginRight: '1px',
                fontWeight: 'bold',
              }}
            >
              <div className='col-6'>Descrição</div>
              <div className='col-2'>Data</div>
              <div className={`col-2 ${styles.vlLancto}`}>Valor</div>
              <div className={`col-2 ${styles.refresh} `}>
                <button
                  type='button'
                  className='btn-refresh'
                  onClick={doRefresh}
                  data-tooltip-id='atualizarTip'
                  data-tooltip-content='Atualizar'
                  data-tooltip-place='top'
                >
                  <FaArrowsRotate />
                </button>
              </div>
            </Row>

            <Row>
              <div className='col-12'>
                <hr style={{ marginTop: '1px', marginBottom: '2px' }} />
              </div>
            </Row>
          </div>

          <div
            style={{
              height: '39vh',
              overflowY: 'scroll',
              overflowX: 'hidden',
              marginLeft: '50px',
              marginRight: '50px',
            }}
          >
            {!isLoading &&
              filtrados.length > 0 &&
              filtrados.map((lancto, index) => {
                var style = {
                  ...style,
                  backgroundColor: greenGridColors[index % 2],
                  color: theme.colors.slate11,
                  fontWeight: 'bold',
                };

                return (
                  <Row className='m-0' style={style} key={`lancto${lancto.id}`}>
                    <div className='col-6'>{lancto.descricao}</div>
                    <div className='col-2'>{strDate(lancto.dtVencto)}</div>
                    <div className={`col-2 ${styles.vlLancto}`}>
                      {strValue(lancto.vlTotal)}
                    </div>
                    <div className={`col-2 ${styles.funcoes}`}>
                      <div className={styles.refresh}>
                        <button
                          className='btn-refresh'
                          onClick={() => {
                            handleView(lancto.id, lancto.parcela);
                          }}
                        >
                          <AiFillEye
                            className='btn-refresh'
                            data-tooltip-id='atualizarTip'
                            data-tooltip-content='Visualizar'
                            data-tooltip-place='top'
                          />
                        </button>
                        <button
                          className='btn-refresh'
                          onClick={() => {
                            handleEdit(lancto.id, lancto.parcela);
                          }}
                        >
                          <AiFillEdit
                            className='btn-refresh'
                            data-tooltip-id='atualizarTip'
                            data-tooltip-content='Editar'
                            data-tooltip-place='top'
                          />
                        </button>
                        <button
                          className='btn-refresh'
                          onClick={() => {
                            handleDelete(lancto.id, lancto.parcela);
                          }}
                        >
                          <BsFillTrash3Fill
                            className='btn-refresh'
                            data-tooltip-id='atualizarTip'
                            data-tooltip-content='Excluir'
                            data-tooltip-place='top'
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

      {/* Popup lançamento */}
      {tipoCRUD === 'L' && (
        <CenteredModal
          backdrop='static'
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
          <form>
            <Row>
              <div className='col-6'>
                <div className='form-group'>
                  <label htmlFor='dtVencto' className='control-label'>
                    Data
                  </label>
                  <input
                    className='form-control'
                    name='dtVencto'
                    id='dtVencto'
                    type='date'
                    required
                    autoFocus
                    value={lancto.dtVencto.substring(0, 10)}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className='col-6'>
                <div className='form-group'>
                  <label htmlFor='vlLancto' className='control-label'>
                    Valor
                  </label>
                  <input
                    className='form-control'
                    name='vlLancto'
                    id='vlLancto'
                    type='number'
                    min={0}
                    step={0.01}
                    pattern='([0-9]{1,3}).([0-9]{1,3})'
                    required
                    value={lancto.vlLancto}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </Row>

            <Row>
              <div className='col-12'>
                <div className='form-group'>
                  <label htmlFor='descricao' className='control-label'>
                    Descrição
                  </label>
                  <input
                    className='form-control'
                    name='descricao'
                    id='descricao'
                    type='text'
                    value={lancto.descricao}
                    onChange={handleInputChange}
                    maxLength={100}
                  />
                  <div className='div-contador'>
                    <span className='contador'>{lenDescricao}</span>
                  </div>
                </div>
              </div>
            </Row>
          </form>
        </CenteredModal>
      )}

      {/* Excluir/Estornar */}
      <CenteredModal
        backdrop='static'
        titulo='Atenção!'
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
          <div className='col-12 mb-2'>
            <h5>Confirme a EXCLUSÃO...</h5>
          </div>
          <div className='col-6'>
            <div className='form-group'>
              <label htmlFor='dtVencto' className='control-label'>
                Data
              </label>
              <input
                className='form-control'
                name='dtVencto'
                id='dtVencto'
                type='date'
                disabled={true}
                value={lancto.dtVencto.substring(0, 10)}
              />
            </div>
          </div>
          <div className='col-6'>
            <div className='form-group'>
              <label htmlFor='vlLancto' className='control-label'>
                Valor
              </label>
              <input
                className='form-control'
                name='vlLancto'
                id='vlLancto'
                type='number'
                min={0}
                step={0.01}
                pattern='([0-9]{1,3}).([0-9]{1,3})'
                disabled={true}
                value={lancto.vlLancto}
              />
            </div>
          </div>
          <div className='col-12'>
            <div className='form-group'>
              <label htmlFor='descricao' className='control-label'>
                Descrição
              </label>
              <input
                className='form-control'
                name='descricao'
                id='descricao'
                type='text'
                disabled
                value={lancto.descricao}
                onChange={handleInputChange}
                maxLength={100}
              />
            </div>
          </div>
        </Row>
      </CenteredModal>
    </div>
  );
}
