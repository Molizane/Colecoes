import { useState } from 'react';
import Card from '../../components/Card'
import CenteredModal from '../../components/ModalDialog';

const Home = () => {
  const [modalShow, setModalShow] = useState(false);
  const [modalDelShow, setModalDelShow] = useState(false);

  const showModal = () => {
    setModalShow(true);
  };

  const showDelete = () => {
    setModalDelShow(true);
  };

  return (
    <>
      <div className="row m-0">
        <div className='col-3'>
          <Card id={1} qtde={0} linha1='Teste 1' bdColor='red' color='yellow' bgColor='blue' delColor='red' onEdit={() => showModal()} onDelete={() => showDelete(1)} />
        </div>
        <div className='col-3'>
          <Card id={2} qtde={4} linha1='Teste 2' editColor='red' />
        </div>
        <div className='col-3'>
          <Card id={3} qtde={6} linha1='Teste 3' />
        </div >
        <div className='col-3'>
          <Card id={4} qtde={8} linha1='Teste 4' />
        </div >
        <div className='col-3'>
          <Card id={5} qtde={10} linha1='Teste 5' />
        </div >
        <div className='col-3'>
          <Card id={6} qtde={12} linha1='Teste 6' />
        </div >
      </div>

      <CenteredModal
        titulo='Teste Modal'
        corTitulo='navy'
        conteudo='Teste 1'
        corConteudo='#515151'
        closeButton={true}
        eye={true}
        show={modalShow}
        onHide={() => setModalShow(false)} />

      <CenteredModal
        backdrop='static'
        titulo='Atenção!'
        corTitulo='#ff0000'
        conteudo='Confirme a exclusão...'
        corConteudo='#515151'
        closeButton={false}
        thumbsUp={true}
        cancel={true}
        show={modalDelShow}
        onConfirm={() => setModalDelShow(false)}
        onHide={() => setModalDelShow(false)} />
    </>
  )
}

export default Home
