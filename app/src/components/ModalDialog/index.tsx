import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface CenteredModalProps {
    titulo: string
    corTitulo?: string
    texto: string;
    corTexto?: string;
    tamanho?: 'sm' | 'lg' | 'xl';
    closeButton: boolean;
    show: boolean;
    onHide: () => void;
}

export default function CenteredModal({ titulo, corTitulo, texto, corTexto, tamanho, closeButton, show, onHide }: CenteredModalProps) {
    if (!corTitulo) {
        corTitulo = 'black';
    }

    if (!corTexto) {
        corTexto = 'black';
    }

    const bg = {
        overlay: {
            background: 'yellow'
        }
    };

    return (
        <>
            <style jsx>
                {`
                .corTitulo {
                    color: ${corTitulo};
                }
                .corTexto {
                    color: ${corTexto};
                }
                .corFundoTitulo {
                    background-color: yellow;
                }
                `}
            </style>

            <Modal
                show={show}
                onHide={onHide}
                size={tamanho || 'sm'}
                aria-labelledby='contained-modal-title'
                centered
                classNames={{ overlay: { background: 'yellow' } }}>
                <Modal.Header closeButton={closeButton} className='corFundoTitulo'>
                    <Modal.Title id='contained-modal-title'>
                        <span className='corTitulo'>{titulo}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 className='corTexto'>{texto}</h5>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onHide}>&times;</Button>
                </Modal.Footer>
            </Modal >
        </>
    );
}
