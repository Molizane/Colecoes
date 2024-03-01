import { MdEdit, MdDelete } from "react-icons/md";
import styles from "./styles.module.scss"

interface CardProps {
    id: number;
    qtde: number;
    descricao: string;
    color?: string;
    bgColor?: string;
    bdColor?: string;
    editColor?: string;
    delColor?: string;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}

export default function Card({ id, qtde, descricao, color, bgColor, bdColor, editColor, delColor, onEdit, onDelete }: CardProps) {
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
            backgroundColor: bgColor ?? 'transparent',
            border: '1px solid ' + (bdColor ?? '#eaeaea')
        }}>
            <div className={styles.dataContainer}>
                <div className={styles.dataRow1}>
                    <div><span></span></div>
                </div>
                <div className={styles.dataRow2}>
                    {descricao}
                </div>
            </div>
            <div className={styles.actions}>
                {
                    qtde > 0 &&
                    <div className={styles.qtde}><span>{qtde}</span></div>
                }
                {
                    !qtde && onDelete &&
                    <div className={styles.action} >
                        <button type='button' onClick={onDeleteClick} className={`${styles.buttonOpt} 'btn'`} data-toggle='tooltip' data-placement='right' title='Excluir'>
                            <MdDelete className={styles.action} style={{ color: delColor ?? 'inherited' }} />
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
                        <button type='button' onClick={onEditClick} className={`${styles.buttonOpt} 'btn'`} data-toggle='tooltip' data-placement='right' title='Editar'>
                            <MdEdit className={styles.action} style={{ color: editColor ?? 'inherited' }} />
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
