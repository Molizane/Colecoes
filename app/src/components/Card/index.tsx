import { FiEdit } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import styles from "./styles.module.scss"

interface CardProps {
    id: number;
    qtde: number;
    titulo1?: string;
    linha1?: string;
    linha2: string;
    color?: string;
    bgColor?: string;
    bdColor?: string;
    editColor?: string;
    bgEditColor?: string;
    delColor?: string;
    bgDelColor?: string;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}

export default function Card({ id, qtde, titulo1, linha1, linha2, color, bgColor, bdColor, editColor, bgEditColor, delColor, bgDelColor, onEdit, onDelete }: CardProps) {
    const onEditClick = () => {
        if (onEdit) {
            onEdit(id);
        }
    };

    const onDeleteClick = () => {
        if (onDelete) {
            onDelete(id);
        }
    };

    return (
        <div className={styles.container} style={{
            color: color ?? 'inherited',
            backgroundColor: bgColor ?? 'inherited',
            border: '1px solid ' + (bdColor ?? 'inherited')
        }}>
            <div className={styles.dataContainer}>
                <div className={styles.dataRow2}>
                    {
                        linha1 && false &&
                        <div className={styles.linha1}>
                            <span className={styles.descricao}>
                                {linha1}
                            </span>
                        </div>
                    }
                    <div>
                        <span className={styles.descricao}>
                            {linha2}
                        </span>
                    </div>
                </div>
            </div>
            <div className={styles.actionsBtn}>
                {
                    qtde > 0 &&
                    <div className={styles.qtde}><span>{qtde}</span></div>
                }
                {
                    !qtde && onDelete &&
                    <div >
                        <button type='button' className={`${styles.buttonOpt}`} style={{ backgroundColor: bgDelColor ?? 'inherited' }} onClick={onDeleteClick} data-toggle='tooltip' data-placement='right' title='Excluir'>
                            <FiTrash2 style={{ color: delColor ?? 'inherited', fontSize: '1.3rem' }} />
                        </button>
                    </div>
                }
                {
                    !qtde && !onDelete &&
                    <div>&nbsp;</div>
                }
                {
                    onEdit &&
                    <div>
                        <button type='button' className={`${styles.buttonOpt}`} style={{ backgroundColor: bgEditColor ?? 'inherited' }} onClick={onEditClick} data-toggle='tooltip' data-placement='right' title='Editar'>
                            <FiEdit style={{ color: editColor ?? 'inherited', fontSize: '1.3rem' }} />
                        </button>
                    </div>
                }
                {
                    !onEdit &&
                    <div>&nbsp;</div>
                }
            </div>
        </div >
    )
}
