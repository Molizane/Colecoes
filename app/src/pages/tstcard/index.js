import { useState } from 'react';
import Card from '../../components/Card'
import CenteredModal from '../../components/ModalDialog';

const Home = () => {
  const [modalShow, setModalShow] = useState(false);

  const showModal = () => {
    setModalShow(true);
  };

  return (
    <>
      <div className="row m-0">
        <div className='col-3'>
          <Card id={1} qtde={0} descricao='Teste 1' bdColor='red' color='yellow' bgColor='blue' delColor='red' onEdit={() => showModal()} />
        </div>
        <div className='col-3'>
          <Card id={2} qtde={4} descricao='Teste 2' editColor='red' />
        </div>
        <div className='col-3'>
          <Card id={3} qtde={6} descricao='Teste 3' />
        </div >
        <div className='col-3'>
          <Card id={4} qtde={8} descricao='Teste 4' />
        </div >
        <div className='col-3'>
          <Card id={5} qtde={10} descricao='Teste 5' />
        </div >
        <div className='col-3'>
          <Card id={6} qtde={12} descricao='Teste 6' />
        </div >
      </div>

      <CenteredModal
        titulo='Teste Modal'
        corTitulo='navy'
        texto='Teste 1'
        corTexto='#515151'
        closeButton={true}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  )
}

export default Home
