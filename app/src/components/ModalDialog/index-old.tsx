import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styles from './styles.module.scss';

interface ModalDialogProps {
    id: number;
    titulo: string;
    texto: string;
    tipo: string;
}

export function ModalDialog({ id, titulo, texto, tipo }: ModalDialogProps) {
    const closeModal = () => {
        const { Modal } = require("bootstrap");
        const modalDialog = new Modal("#modalDialog");
        modalDialog.hide();
    };

    return (
        <div className={`modal fade ${styles.containt}`} id='modalDialog'>
            <div className='modal-dialog modal-dialog-scrollable'>
                {
                    tipo !== 'erro' &&
                    <div id='dvModal' className={`modal-content modal-content-success popupAlertaFeedback ${styles.modalContent}`}>
                        <div className='modal-header border-0 p-0 m-0'>
                            <button type='button' className={`close text-white ${styles.modalButton}`}
                                data-dismiss='modal' onClick={closeModal}>
                                &times;
                            </button>
                        </div>
                        <div className={`modal-body pt-0 ${styles.modalBody}`}>
                            <div className={`row ${styles.modalRow}`}>
                                <div className={`col-3 ${styles.divIcon}`}>
                                    <i className={`fas fa-check-circle erro ${styles.icon}`}></i>
                                </div>
                                <div className={`col-9 ${styles.divMessage}`}>
                                    <p id='dvModalTitle' className={`popupAlertaFeedback ${styles.divMessage}`}>{titulo}</p>
                                    <p id='dvModalMessageSuccess' className='popupAlertaFeedback'>{texto}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {
                    tipo === 'erro' &&
                    <div id='dvModal' className={`modal-content modal-content-success popupAlertaFeedback erro ${styles.modalContent}`}>
                        <div className='modal-header border-0 p-0 m-0'>
                            <button type='button' className={`close text-white ${styles.buttonClose}`} data-dismiss='modal' onClick={closeModal}>
                                &times;
                            </button>
                        </div>
                        <div className={`modal-body tp-0 ${styles.modalBody}`}>
                            <div className={`row ${styles.modalRow}`}>
                                <div className={`col-3 ${styles.divMessage}`}>
                                    <i className={`fas fa-times-circle erro ${styles.icon}`}></i>
                                </div>
                                <div className={`col-9 ${styles.divMessage}`}>
                                    <p id='dvModalTitleError' className={`popupAlertaFeedback ${styles.dvModalTitle}`}>Oops</p>
                                    <p id='dvModalMessageError' className='popupAlertaFeedback'>{texto}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}
