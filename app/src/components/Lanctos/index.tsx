import { BsFillTrashFill } from "react-icons/bs";
import { BsPencilFill } from "react-icons/bs";
import { BsEraserFill } from "react-icons/bs";
import { BsCoin } from "react-icons/bs";

import styles from "./styles.module.scss";

import { strDate, strValue } from "../../functions/utils";

interface LanctoProps {
  id: number;
  tipo: string;
  descricao: string;
  parcelas: number;
  parcela: number;
  valor: number;
  desconto: number;
  acrescimo: number;
  dataVencto: Date;
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

export default function Lancto({
  id,
  tipo,
  descricao,
  parcelas,
  parcela,
  valor,
  desconto,
  acrescimo,
  dataVencto,
  color,
  bgColor,
  bdColor,
  editColor,
  bgEditColor,
  delColor,
  bgDelColor,
  onEdit,
  onDelete,
}: LanctoProps) {
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
    <div
      className={styles.container}
      style={{
        color: color ?? "inherited",
        backgroundColor: bgColor ?? "inherited",
        border: "1px solid " + (bdColor ?? "inherited"),
      }}
    >
      <div className={styles.dataContainer}>
        <div className={styles.dataRow2}>
          {dataVencto && false && (
            <div className={styles.dataVencto}>
              <span className={styles.descricao}>{strDate(dataVencto)}</span>
            </div>
          )}
          <div>
            <span className={styles.descricao}>{tipo}</span>
          </div>
        </div>
      </div>
      <div className={styles.actionsBtn}>
        {valor > 0 && (
          <div className={styles.valor}>
            <span>{valor}</span>
          </div>
        )}
        {!valor && onDelete && (
          <div>
            <button
              type="button"
              className={`${styles.buttonOpt}`}
              style={{ backgroundColor: bgDelColor ?? "inherited" }}
              onClick={onDeleteClick}
              data-toggle="tooltip"
              data-placement="right"
              title="Excluir"
            >
              <BsFillTrashFill
                style={{ color: delColor ?? "inherited", fontSize: "1.3rem" }}
              />
            </button>
          </div>
        )}
        {!valor && !onDelete && <div>&nbsp;</div>}
        {onEdit && (
          <div>
            <button
              type="button"
              className={`${styles.buttonOpt}`}
              style={{ backgroundColor: bgEditColor ?? "inherited" }}
              onClick={onEditClick}
              data-toggle="tooltip"
              data-placement="right"
              title="Editar"
            >
              <BsPencilFill
                style={{ color: editColor ?? "inherited", fontSize: "1.3rem" }}
              />
            </button>
          </div>
        )}
        {!onEdit && <div>&nbsp;</div>}
      </div>
    </div>
  );
}
