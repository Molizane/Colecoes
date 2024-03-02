import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BsFillEyeSlashFill } from "react-icons/bs";
import { BsHandThumbsUpFill } from "react-icons/bs";
import { BsHandThumbsDownFill } from "react-icons/bs";
import { BsFloppyFill } from "react-icons/bs";
import { BsXCircleFill } from "react-icons/bs";

interface CenteredModalProps {
    backdrop?: true | false | 'static'
    titulo: string
    corTitulo?: string
    conteudo: string;
    corTexto?: string;
    tamanho?: 'sm' | 'lg' | 'xl';
    thumbsUp?: boolean;
    thumbsDown?: boolean;
    floppy?: boolean;
    eye?: boolean;
    closeButton?: boolean;
    cross?: boolean;
    show: boolean;
    onConfirm?: () => void;
    onHide?: () => void;
}

export default function CenteredModal({
    backdrop,
    titulo, corTitulo,
    conteudo, corTexto,
    tamanho,
    closeButton,
    thumbsUp, thumbsDown, floppy, eye, cross,
    show,
    onConfirm, onHide }: CenteredModalProps) {
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
                .modal-content {
                    background-color: yellow !important;
                }
                `}
            </style>

            <Modal
                backdrop={backdrop}
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
                    <h5 className='corTexto'>{conteudo}</h5>
                </Modal.Body>
                <Modal.Footer>
                    {
                        thumbsUp &&
                        <Button variant="primary" onClick={onConfirm}><BsHandThumbsUpFill /></Button>
                    }
                    {
                        floppy &&
                        <Button variant="primary" onClick={onConfirm}><BsFloppyFill /></Button>
                    }
                    {
                        thumbsDown &&
                        <Button variant="secondary" onClick={onHide}><BsHandThumbsDownFill /></Button>
                    }
                    {
                        eye &&
                        <Button variant="secondary" onClick={onHide}><BsFillEyeSlashFill /></Button>
                    }
                    {
                        cross &&
                        <Button variant="secondary" onClick={onHide}><BsXCircleFill /></Button>
                    }
                </Modal.Footer>
            </Modal >
        </>
    );
}
