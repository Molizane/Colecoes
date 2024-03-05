import { FiEdit } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import styles from "./styles.module.scss"

interface CardProps {
    id: number;
    qtde: number;
    descricao: string;
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

export default function Card({ id, qtde, descricao, color, bgColor, bdColor, editColor, bgEditColor, delColor, bgDelColor, onEdit, onDelete }: CardProps) {
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
                    <span className={styles.descricao}>
                        {descricao}
                    </span>
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
