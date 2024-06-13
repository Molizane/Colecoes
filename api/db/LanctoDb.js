import db from "./db.js";
import { strDateUS } from "../functions/utils.js";

export async function insert(lancto) {
  if (!lancto) {
    return { status: -1, msg: "Registro não informado" };
  }

  try {
    const result = await db.query(
      "set @id=null; call InsertLancto(?,?,?,?,?,?,?,?,?,@id); select @id as id",
      [
        lancto.idConta,
        lancto.descricao,
        lancto.vlLancto,
        lancto.dtVencto,
        lancto.parcelas,
        lancto.tpVencto,
        lancto.flgDiasUteis,
        lancto.flgGerarParcela,
        lancto.flgDifFinal,
      ]
    );

    return { status: 0, msg: "ok", info: result[0][2][0] };
  } catch (err) {
    console.log(err);
    logger.info(`insert /Lancto - ${err.sqlMessage}`);
    return { status: err.sqlState, msg: err.sqlMessage };
  }
}

export async function update(lancto) {
  if (!lancto) {
    return { status: -1, msg: "Registro não informado" };
  }

  try {
    const result = await db.query("call UpdateLancto(?,?,?,?,?,?)", [
      lancto.id,
      lancto.parcela,
      lancto.descricao,
      lancto.vlLancto,
      lancto.dtVencto.substr(0, 10),
      lancto.flgUpdateAll,
    ]);

    return { status: 0, msg: "ok" };
  } catch (err) {
    logger.info(`update /Lancto - ${err.sqlMessage}`);
    return { status: err.sqlState, msg: err.sqlMessage };
  }
}

export async function exclude(id, parcela, tipo) {
  id = parseInt(id);

  if (isNaN(id)) {
    return { status: -1, msg: "id não informado" };
  }

  try {
    const result = await db.query("call DeleteLancto(?,?,?)", [
      id,
      parcela,
      tipo,
    ]);

    return { status: 0, msg: "ok" };
  } catch (err) {
    logger.info(`exclude /Lancto/${id}/${parcela}/${tipo} - ${err.sqlMessage}`);
    return { status: err.sqlState, msg: err.sqlMessage };
  }
}

export async function close(lancto) {
  if (!lancto) {
    return { status: -1, msg: "Registro não informado" };
  }

  try {
    await db.query("call CloseLancto(?,?,?,?,?)", [
      lancto.id,
      lancto.parcela,
      lancto.dtPagto,
      lancto.vlAcrescimo,
      lancto.vlDesconto,
    ]);
    return { status: 0, msg: "ok" };
  } catch (err) {
    logger.info(`close /Lancto/${lancto.id} - ${err.sqlMessage}`);
    return { status: err.sqlState, msg: err.sqlMessage };
  }
}

export async function reopen(lancto) {
  if (!lancto) {
    return { status: -1, msg: "Registro não informado" };
  }

  try {
    await db.query("call ReopenLancto(?,?)", [lancto.id, lancto.parcela]);
    return { status: 0, msg: "ok" };
  } catch (err) {
    logger.info(
      `reopen /Lancto/${lancto.id}/${lancto.parcela} - ${err.sqlMessage}`
    );
    return { status: err.sqlState, msg: err.sqlMessage };
  }
}

const selectSQL =
  "SELECT {t} AS Tipo, l.`Id`, l.`IdConta`, c.`Descricao` AS `Conta`, li.`Descricao`,\n" +
  "       l.`tpVencto`, l.`FlgDiasUteis`, l.`Parcelas`, li.`Parcela`, li.`DtVencto`,\n" +
  "       li.`VlLancto`, li.`FlPago`, li.`DtPagto`, li.`VlAcrescimo`, li.`VlDesconto`,\n" +
  "       li.`VlTotal`,\n" +
  "       l.`DtLancto`,\n" +
  "       CASE l.`tpVencto`\n" +
  "         WHEN 'S' THEN 'Semanal'\n" +
  "         WHEN 'Q' THEN 'Quinzenal'\n" +
  "         WHEN 'M' THEN 'Mensal'\n" +
  "         WHEN 'B' THEN 'Bimestral'\n" +
  "         WHEN 'T' THEN 'Trimestral'\n" +
  "         WHEN '4' THEN 'Quadrimestral'\n" +
  "         WHEN '6' THEN 'Semestral'\n" +
  "         WHEN 'A' THEN 'Anual'\n" +
  "         ELSE l.`tpVencto`\n" +
  "       END AS `DescrTipo`\n" +
  "FROM `lancto` l\n" +
  "INNER JOIN `lanctoitens` li\n" +
  "   ON li.`IdLancto`=l.`Id`\n" +
  "INNER JOIN`conta` c\n" +
  "   ON c.`Id`=l.`IdConta`\n" +
  "WHERE l.`Id`=?";

function mapLancto(lancto) {
  return {
    status: lancto.Status,
    tipo: lancto.Tipo,
    id: lancto.Id,
    idConta: lancto.IdConta,
    conta: lancto.Conta,
    descricao: lancto.Descricao,
    idLote: lancto.Id,
    tpVencto: lancto.tpVencto,
    flgDiasUteis: lancto.FlgDiasUteis,
    parcelas: lancto.Parcelas,
    parcela: lancto.Parcela,
    dtVencto: strDateUS(lancto.DtVencto),
    vlLancto: lancto.VlLancto,
    flPago: lancto.FlPago != 0,
    dtPagto: strDateUS(lancto.DtPagto),
    vlAcrescimo: lancto.VlAcrescimo,
    vlDesconto: lancto.VlDesconto,
    vlTotal: lancto.VlTotal,
    descrTipo: lancto.DescrTipo,
    descrParcela:
      lancto.Parcelas == 1 ? "" : ` (${lancto.Parcela}/${lancto.Parcelas})`,
  };
}

export async function getAll(crit) {
  try {
    if (typeof crit !== "string") {
      crit = "4";
    } else {
      crit = crit.toUpperCase();
    }

    var sql = "";

    // Lançamentos de crédito
    if (crit === "C") {
      sql = selectSQL
        .replace("{t}", "0 AS `Status`, 'Crédito'")
        .replace("l.`Id`=?", "l.`Parcelas`=0");
    } else {
      if (crit === "4" || crit === "2") {
        sql = selectSQL
          .replace("{t}", "2 AS `Status`, 'A vencer'")
          .replace(
            "l.`Id`=?",
            "l.`Parcelas`>0 AND li.`FlPago`=0 AND li.`DtVencto`>DATE(CURRENT_TIMESTAMP)"
          );
      }

      if (crit === "4" || crit === "1") {
        if (crit === "4") {
          sql += "\nUNION\n";
        }

        sql += selectSQL
          .replace("{t}", "1 AS `Status`, 'Vencendo'")
          .replace(
            "l.`Id`=?",
            "l.`Parcelas`>0 AND li.`FlPago`=0 AND li.`DtVencto`=DATE(CURRENT_TIMESTAMP)"
          );
      }

      if (crit === "4" || crit === "0") {
        if (crit === "4") {
          sql += "\nUNION\n";
        }

        sql += selectSQL
          .replace("{t}", "0 AS `Status`, 'Vencido'")
          .replace(
            "l.`Id`=?",
            "l.`Parcelas`>0 AND li.`FlPago`=0 AND li.`DtVencto`<DATE(CURRENT_TIMESTAMP)"
          );
      }

      if (crit === "4" || crit === "3") {
        if (crit === "4") {
          sql += "\nUNION\n";
        }

        sql += selectSQL
          .replace("{t}", "3 AS `Status`, 'Pago'")
          .replace("l.`Id`=?", "l.`Parcelas`>0 AND li.`FlPago`=1");
      }
    }

    sql += "\nORDER BY `Status`, `DtVencto`, `DtLancto`, `Tipo`, `Descricao`";

    const pars = [];
    const [results, _] = await db.query(sql, pars);

    return results.map((result) => {
      return mapLancto(result);
    });
  } catch (err) {
    logger.info(`get /Lancto - ${err.sqlMessage}`);
    return { status: err.sqlState, msg: err.sqlMessage };
  }
}

export async function getAllByCriter(crit) {
  try {
    var sql = selectSQL + ""; // Para fazer uma cópia, e não criar um referência
    const pars = [];

    if (!crit) {
      crit = "a";
    }

    switch (crit.toLowerCase().substring(0, 1)) {
      case "a": // a vencer
        sql = sql
          .replace("{t}", "0")
          .replace(
            "l.`Id`=?",
            "li.`FlPago`=0 AND li.`DtVencto` > DATE(CURRENT_TIMESTAMP)"
          );
        break;
      case "n": // vencendo
        sql = sql
          .replace("{t}", "1")
          .replace(
            "l.`Id`=?",
            "li.`FlPago`=0 AND li.`DtVencto` = DATE(CURRENT_TIMESTAMP)"
          );
        break;
      case "v": // vencidos
        sql = sql
          .replace("{t}", "2")
          .replace(
            "l.`Id`=?",
            "li.`FlPago`=0 AND li.`DtVencto` < DATE(CURRENT_TIMESTAMP)"
          );
        break;
      default: // pagos
        sql = sql.replace("{t}", "3").replace("l.`Id`=?", "li.`FlPago`=1");
        break;
    }

    sql += "ORDER BY li.`DtVencto`, l.`DtLancto`, li.`Descricao`";

    const [results, _] = await db.query(sql, pars);

    return results.map((result) => {
      return mapLancto(result);
    });
  } catch (err) {
    logger.info(`get /Lancto/${crit} - ${err.sqlMessage}`);
    return { status: err.sqlState, msg: err.sqlMessage };
  }
}

export async function getByIdPai(id) {
  id = parseInt(id);

  if (!isNaN(id)) {
    if (id < 1) {
      return { status: -1, msg: "id inválido" };
    }

    try {
      const [results, _] = await db.query(selectSQL, [id]);

      return mapLancto(results[0]);
    } catch (err) {
      logger.info(`get /Lancto/${id} - ${err.sqlMessage}`);
      return { status: err.sqlState, msg: err.sqlMessage };
    }
  }

  try {
    const [results, _] = await db.query(
      selectSQL.replace("WHERE l.`Id`=?", "")
    );

    return results.map((result) => {
      return mapLancto(result);
    });
  } catch (err) {
    logger.info(`get /Lancto - ${err.sqlMessage}`);
    return { status: err.sqlState, msg: err.sqlMessage };
  }
}

export async function getByIdParcela(id, parcela) {
  id = parseInt(id);

  if (!isNaN(id)) {
    if (id < 1) {
      return { status: -1, msg: "id inválido" };
    }

    try {
      const [results, _] = await db.query(
        selectSQL.replace("=?", "=? AND li.`Parcela`=?"),
        [id, parcela]
      );

      return mapLancto(results[0]);
    } catch (err) {
      logger.info(`get /Lancto/${id} - ${err.sqlMessage}`);
      return { status: err.sqlState, msg: err.sqlMessage };
    }
  }

  try {
    const [results, _] = await db.query(
      selectSQL.replace("WHERE l.`Id`=?\n", "")
    );

    return results.map((result) => {
      return mapLancto(result);
    });
  } catch (err) {
    logger.info(`get /Lancto - ${err.sqlMessage}`);
    return { status: err.sqlState, msg: err.sqlMessage };
  }
}

export async function getByIdTipoConta(id) {
  id = parseInt(id);

  if (!isNaN(id) || id < 1) {
    return { status: -1, msg: "Tipo de Conta inválido" };
  }

  try {
    const [results, _] = await db.query(
      "SELECT * FROM `lancto` WHERE `IdTipoConta`=? ORDER BY `Id`",
      [id]
    );

    return results.map((result) => {
      return mapLancto(result);
    });
  } catch (err) {
    logger.info(`get /Lancto/Tipo/${id} - ${err.sqlMessage}`);
    return { status: err.sqlState, msg: err.sqlMessage };
  }
}

export async function getSaldos(dtInicio, dtFim) {
  try {
    const [planejado, pl] = await db.query(
      "SELECT * FROM `planejado` WHERE `Data` BETWEEN ? AND ? ORDER BY `Data`",
      [dtInicio, dtFim]
    );

    const [planejados, psl] = await db.query(
      "SELECT MAX(`Data`) AS MaxData, MIN(`Data`) As MinData FROM `planejado`",
      [dtInicio, dtFim]
    );

    const [efetivado, ef] = await db.query(
      "SELECT * FROM `efetivado` WHERE `Data` BETWEEN ? AND ? ORDER BY `Data`",
      [dtInicio, dtFim]
    );

    const [efetivados, efl] = await db.query(
      "SELECT MAX(`Data`) AS MaxData, MIN(`Data`) As MinData FROM `efetivado`",
      [dtInicio, dtFim]
    );

    const saldos = {
      planejado,
      planejados: planejados[0],
      efetivado,
      efetivados: efetivados[0],
    };
    return saldos;
  } catch (err) {
    logger.info(`get /Lancto/Tipo/${id} - ${err.sqlMessage}`);
    return { status: err.sqlState, msg: err.sqlMessage };
  }
}