import db from "./db.js";
import { strDateUS } from "../functions/utils.js";

export async function insert(lancto) {
  if (!lancto) {
    return { status: -1, msg: "Registro não informado" };
  }

  try {
    const result = await db.query(
      "set @id=null; call InsertLancto(?,?,?,?,?,?,?,?,?,?,@id); select @id as id",
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
        lancto.flgBaixar,
      ]
    );

    return { status: 0, msg: "ok", info: result[0][2][0] };
  } catch (err) {
    if (err.message) {
      logger.info(`insert /Lancto - ${err.message}`);
      return { status: -1, msg: err.message };
    }

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
    if (err.message) {
      logger.info(`update /Lancto - ${err.message}`);
      return { status: -1, msg: err.message };
    }

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
    if (err.message) {
      logger.info(`exclude /Lancto/${id}/${parcela}/${tipo} - ${err.message}`);
      return { status: -1, msg: err.message };
    }

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
    if (err.message) {
      logger.info(`close /Lancto/${lancto.id} - ${err.message}`);
      return { status: -1, msg: err.message };
    }

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
    if (err.message) {
      logger.info(
        `reopen /Lancto/${lancto.id}/${lancto.parcela} - ${err.message}`
      );
      return { status: -1, msg: err.message };
    }

    logger.info(
      `reopen /Lancto/${lancto.id}/${lancto.parcela} - ${err.sqlMessage}`
    );
    return { status: err.sqlState, msg: err.sqlMessage };
  }
}

const selectSQLLista =
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
    tpVencto: lancto.tpVencto,
    flgDiasUteis: lancto.FlgDiasUteis,
    parcelas: lancto.Parcelas,
    parcela: lancto.Parcela,
    dtVencto: strDateUS(lancto.DtVencto),
    vlLancto: parseFloat(lancto.VlLancto),
    flPago: lancto.FlPago != 0,
    dtPagto: strDateUS(lancto.DtPagto),
    vlAcrescimo: parseFloat(lancto.VlAcrescimo),
    vlDesconto: parseFloat(lancto.VlDesconto),
    vlTotal: parseFloat(lancto.VlTotal),
    descrTipo: lancto.DescrTipo,
    descrParcelas:
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
      sql = selectSQLLista
        .replace("{t}", "0 AS `Status`, 'Crédito'")
        .replace("l.`Id`=?", "l.`Parcelas`=0");
    } else {
      if (crit === "4" || crit === "2") {
        sql = selectSQLLista
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

        sql += selectSQLLista
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

        sql += selectSQLLista
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

        sql += selectSQLLista
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
    if (err.message) {
      logger.info(`get /Lancto - ${err.message}`);
      return { status: -1, msg: err.message };
    }

    logger.info(`get /Lancto - ${err.sqlMessage}`);
    return { status: err.sqlState, msg: err.sqlMessage };
  }
}

export async function getAllByCriter(crit) {
  try {
    var sql = selectSQLLista + ""; // Para fazer uma cópia, e não criar um referência
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
    if (err.message) {
      logger.info(`get /Lancto/${crit} - ${err.message}`);
      return { status: -1, msg: err.message };
    }

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
      const [results, _] = await db.query(selectSQLLista, [id]);

      return mapLancto(results[0]);
    } catch (err) {
      if (err.message) {
        logger.info(`get /Lancto/${id} - ${err.message}`);
        return { status: -1, msg: err.message };
      }

      logger.info(`get /Lancto/${id} - ${err.sqlMessage}`);
      return { status: err.sqlState, msg: err.sqlMessage };
    }
  }

  try {
    const [results, _] = await db.query(
      selectSQLLista.replace("WHERE l.`Id`=?", "")
    );

    return results.map((result) => {
      return mapLancto(result);
    });
  } catch (err) {
    if (err.message) {
      logger.info(`get /Lancto - ${err.message}`);
      return { status: -1, msg: err.message };
    }

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
        selectSQLLista.replace("=?", "=? AND li.`Parcela`=?"),
        [id, parcela]
      );

      return mapLancto(results[0]);
    } catch (err) {
      if (err.message) {
        logger.info(`get /Lancto/${id} - ${err.message}`);
        return { status: -1, msg: err.message };
      }

      logger.info(`get /Lancto/${id} - ${err.sqlMessage}`);
      return { status: err.sqlState, msg: err.sqlMessage };
    }
  }

  try {
    const [results, _] = await db.query(
      selectSQLLista.replace("WHERE l.`Id`=?\n", "")
    );

    return results.map((result) => {
      return mapLancto(result);
    });
  } catch (err) {
    if (err.message) {
      logger.info(`get /Lancto - ${err.message}`);
      return { status: -1, msg: err.message };
    }

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
    if (err.message) {
      logger.info(`get /Lancto/Tipo/${id} -${err.message}`);
      return { status: -1, msg: err.message };
    }

    logger.info(`get /Lancto/Tipo/${id} - ${err.sqlMessage}`);
    return { status: err.sqlState, msg: err.sqlMessage };
  }
}

export async function getExtrato(ano, mes) {
  try {
    const dtInicio = new Date(ano, mes - 1, 1)
      .toLocaleString("lt-LT")
      .substring(0, 10);

    var dtFim = new Date(ano, mes, 0);
    const ultDia = dtFim.getDate();
    var dtFim = dtFim.toLocaleString("lt-LT").substring(0, 10);

    var [saldoAnterior, lx] = await db.query(
      "SELECT * FROM `saldo` WHERE `Data` = (SELECT MAX(`Data`) FROM `saldo` WHERE `Data` < ?)",
      [dtInicio]
    );

    var saldoAnt = 0;

    if (saldoAnterior.length == 0) {
      saldoAnterior = { valor: 0 };
    } else {
      saldoAnterior = {
        data: strDateUS(saldoAnterior[0].Data),
        valor: parseFloat(saldoAnterior[0].Valor),
      };

      saldoAnt = saldoAnterior.valor;
    }

    var [saldoNegativo, lx] = await db.query(
      "SELECT MIN(`Data`) AS `Data` FROM `saldo` WHERE `Valor` < 0"
    );

    if (saldoNegativo.length == 0) {
      saldoNegativo = null;
    } else {
      saldoNegativo = strDateUS(saldoNegativo[0].Data);
    }

    var [saldos, lx] = await db.query(
      "SELECT DAY(`Data`) AS `Dia`, `Valor` FROM `saldo` WHERE `Data` BETWEEN ? AND ? ORDER BY `Data`",
      [dtInicio, dtFim]
    );

    var saldos2 = [];

    saldos.map((s) => {
      saldos2.push({ dia: s.Dia, valor: parseFloat(s.Valor) });
    });

    saldos = [];
    var r;

    for (var i = 1; i <= ultDia; i++) {
      var ds = saldos2.find((s) => s.dia == i);
      if (ds) {
        r = { dia: i, valor: ds.valor };
        saldoAnt = ds.valor;
      } else {
        r = { dia: i, valor: saldoAnt };
      }

      saldos.push(r);
    }

    var sql =
      "SELECT l.`Id`, l.`Parcelas`, li.`Parcela`,\n" +
      "       CASE WHEN l.`Parcelas` = 0 THEN 'Crédito' ELSE 'Débito' END AS 'Movimento',\n" +
      "       CASE li.`FlPago` WHEN 1 THEN 'Baixado' ELSE 'Pendente' END AS `Status`,\n" +
      "       CONCAT(li.`Descricao`, CASE WHEN l.`Parcelas` > 1 THEN CONCAT(' (', li.`Parcela`, ' / ', l.`Parcelas`, ')') ELSE '' END) AS `Descricao`,\n" +
      "       li.`DtVencto`, li.`DtPagto`, li.`FlPago`, li.`VlLancto`,\n" +
      "       li.`VlTotal` * CASE l.`Parcelas` WHEN 0 THEN 1 ELSE -1 END AS `VlTotal`\n" +
      "FROM `lancto` l\n" +
      "INNER JOIN `lanctoitens` li\n" +
      "ON li.`IdLancto` = l.`Id`\n" +
      "WHERE {*}\n" +
      "ORDER BY COALESCE(li.`DtPagto`, li.`DtVencto`), l.`Id`, li.`Descricao`, li.`IdLancto`\n";

    var [lanctos, lx] = await db.query(
      sql.replace(
        "{*}",
        "COALESCE(li.`DtPagto`, li.`DtVencto`) BETWEEN ? AND ?"
      ),
      [dtInicio, dtFim]
    );

    lanctos = lanctos.map((lancto) => {
      return mapLancto(lancto);
    });

    var [pendentes, lx] = await db.query(
      sql.replace(
        "{*}",
        "li.`FlPago` = 0 AND (li.`DtVencto` < ? OR li.`DtVencto` BETWEEN ? AND CURRENT_DATE)"
      ),
      [dtInicio, dtFim]
    );

    pendentes = pendentes.map((pendente) => {
      return mapLancto(pendente);
    });

    const retorno = {
      intervalo: { ano: parseInt(ano), mes: parseInt(mes), dtInicio, dtFim },
      saldoNegativo,
      saldoAnterior,
      saldos,
      lanctos,
      pendentes,
    };

    return retorno;
  } catch (err) {
    if (err.message) {
      logger.info(`get /Lancto/getSaldos - ${err.message}`);
      return { status: -1, msg: err.message };
    }

    logger.info(`get /Lancto/getSaldos - ${err.sqlMessage}`);
    return { status: err.sqlState, msg: err.sqlMessage };
  }
}
