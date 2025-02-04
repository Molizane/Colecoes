import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BsFillEyeSlashFill } from "react-icons/bs";
import { BsHandThumbsUpFill } from "react-icons/bs";
import { BsHandThumbsDownFill } from "react-icons/bs";
import { BsFloppyFill } from "react-icons/bs";
import { BsXCircleFill } from "react-icons/bs";
import { AiFillDollarCircle, AiOutlineClose } from "react-icons/ai";

interface CenteredModalProps {
  backdrop?: true | false | "static";
  titulo: string;
  corTitulo?: string;
  children: any;
  conteudo: string;
  corConteudo?: string;
  tamanho?: "sm" | "lg" | "xl";
  thumbsUp?: boolean;
  thumbsDown?: boolean;
  floppy?: boolean;
  eye?: boolean;
  closeButton?: boolean;
  payButton?: boolean;
  cancel?: boolean;
  show: boolean;
  warning?: boolean;
  onConfirm?: () => void;
  onHide?: () => void;
  onExtraOpc?: () => void;
}

export default function CenteredModal({
  backdrop,
  titulo,
  corTitulo,
  children,
  conteudo,
  corConteudo,
  tamanho,
  closeButton,
  payButton,
  thumbsUp,
  thumbsDown,
  floppy,
  eye,
  cancel,
  show,
  warning,
  onConfirm,
  onHide,
  onExtraOpc,
}: CenteredModalProps) {
  if (!corTitulo) {
    corTitulo = "black";
  }

  if (!corConteudo) {
    corConteudo = "black";
  }

  const bg = {
    overlay: {
      background: "yellow",
    },
  };

  return (
    <>
      <style>
        {`
          .corTitulo {
            color: ${corTitulo};
          }
          .corConteudo {
            color: ${corConteudo};
          }
        `}
      </style>

      <Modal
        backdrop={backdrop}
        show={show}
        onHide={onHide}
        size={tamanho}
        aria-labelledby="contained-modal-title"
        centered
      >
        <Modal.Header closeButton={closeButton} className="corFundoTitulo">
          <Modal.Title id="contained-modal-title">
            <span className="corTitulo">{titulo}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span className="corConteudo">{children || conteudo}</span>
        </Modal.Body>
        <Modal.Footer>
          {payButton && (
            <Button variant="primary" onClick={onExtraOpc}>
              <AiFillDollarCircle />
            </Button>
          )}
          {thumbsUp && (
            <Button variant="primary" onClick={onConfirm}>
              <BsHandThumbsUpFill />
            </Button>
          )}
          {floppy && (
            <Button variant="primary" onClick={onConfirm}>
              <BsFloppyFill />
            </Button>
          )}
          {thumbsDown && (
            <Button variant="secondary" onClick={onHide}>
              <BsHandThumbsDownFill />
            </Button>
          )}
          {eye && (
            <Button variant="secondary" onClick={onHide}>
              <BsFillEyeSlashFill />
            </Button>
          )}
          {cancel && (
            <Button variant="secondary" onClick={onHide}>
              <AiOutlineClose />
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}
