import db from './db.js';

export async function insert(lancto) {
    if (!lancto) {
        return { status: -1, 'msg': 'Registro não informado' };
    }

    try {
        if (lancto.idLote == undefined) {
            lancto.idLote = null;
        }

        const result = await db.query(
            'set @id=null; set @idLote=?; call InsertLancto(?,?,?,?,?,?,?,@id,@idLote); select @id as id, @idLote as idLote',
            [lancto.idConta, lancto.descricao, lancto.vlLancto, lancto.dtVencto,
            lancto.parcelas, lancto.intervalo, lancto.diasUteis]);

        return { status: 0, 'msg': 'ok', info: result[0][3][0] };
    } catch (err) {
        logger.info(`insert /Lancto - ${err.sqlMessage}`);
        return { status: err.sqlState, 'msg': err.sqlMessage };
    }
}

export async function update(lancto) {
    if (!lancto) {
        return { status: -1, 'msg': 'Registro não informado' };
    }

    try {
        const result = await db.query(
            'call UpdateLancto(?,?,?,?,?)',
            [lancto.id, lancto.parcela, lancto.descricao, lancto.vlLancto, lancto.dtVencto]);

        return { status: 0, 'msg': 'ok' };
    } catch (err) {
        logger.info(`update /Lancto - ${err.sqlMessage}`);
        return { status: err.sqlState, 'msg': err.sqlMessage };
    }
}

export async function exclude(id, parcela) {
    id = parseInt(id);

    if (isNaN(id)) {
        return { status: -1, 'msg': 'id não informado' };
    }

    try {
        const result = await db.query('call DeleteLancto(?,?)', [id, parcela]);

        return { status: 0, 'msg': 'ok' };
    } catch (err) {
        logger.info(`exclude /Lancto/${id} - ${err.sqlMessage}`);
        return { status: err.sqlState, 'msg': err.sqlMessage };
    }
}

export async function close(lancto) {
    if (!lancto) {
        return { status: -1, 'msg': 'Registro não informado' };
    }

    try {
        await db.query('call CloseLancto(?,?,?,?)', [lancto.id, lancto.dtPagto, lancto.vlAcrescimo, lancto.vlDesconto]);
        return { status: 0, 'msg': 'ok' };
    } catch (err) {
        logger.info(`close /Lancto/${lancto.id} - ${err.sqlMessage}`);
        return { status: err.sqlState, 'msg': err.sqlMessage };
    }
}

export async function reopen(id) {
    id = parseInt(id);

    if (isNaN(id)) {
        return { status: -1, 'msg': 'id inválido' };
    }

    try {
        await db.query('call ReopenLancto(?)', [Id]);
        return { status: 0, 'msg': 'ok' };
    } catch (err) {
        logger.info(`reopen /Lancto/${id} - ${err.sqlMessage}`);
        return { status: err.sqlState, 'msg': err.sqlMessage };
    }
}

const selectSQL =
    'SELECT {t} AS Tipo, l.`Id`, l.`IdConta`, c.`Descricao` AS `Conta`, l.`Descricao`,\n' +
    '       l.`IdLote`, l.`TpLancto`,l.`FlgDiasUteis`, l.`Parcelas`, li.`Parcela`,\n' +
    '       li.`DtVencto`, li.`VlLancto`, li.`FlPago`, li.`DtPagto`, li.`VlAcrescimo`,\n' +
    '       li.`VlDesconto`, li.`VlTotal`\n' +
    'FROM `lancto` l\n' +
    'INNER JOIN `lanctoitens` li\n' +
    '  ON li.`IdLancto`=l.`Id`\n' +
    'INNER JOIN`conta` c\n' +
    '  ON c.`Id`=l.`IdConta`\n' +
    'WHERE l.Id=?';

function mapLancto(lancto) {
  return {
    status: lancto.Status,
    tipo: lancto.Tipo,
    id: lancto.Id,
    idConta: lancto.IdConta,
    conta: lancto.Conta,
    descricao: lancto.Descricao,
    idLote: lancto.IdLote,
    tpLancto: lancto.TpLancto,
    flgDiasUteis: lancto.FlgDiasUteis,
    parcelas: lancto.Parcelas,
    parcela: lancto.Parcela,
    dtVencto: lancto.DtVencto,
    vlLancto: lancto.VlLancto,
    flPago: lancto.FlPago != 0,
    dtPagto: lancto.DtPagto,
    vlAcrescimo: lancto.VlAcrescimo,
    vlDesconto: lancto.VlDesconto,
    vlTotal: lancto.VlTotal,
    descrParcela:
      lancto.Parcelas == 1 ? "" : ` (${lancto.Parcela}/${lancto.Parcelas})`,
  };
}

export async function getAll() {
  try {
    var sql = selectSQL
      .replace("{t}", "2 AS Status, 'A vencer'")
      .replace(
        "l.Id=?",
        "li.FlPago=0 AND li.DtVencto>DATE(CURRENT_TIMESTAMP)\nUNION\n"
      );

    sql += selectSQL
      .replace("{t}", "1 AS Status, 'Vencendo'")
      .replace(
        "l.Id=?",
        "li.FlPago=0 AND li.DtVencto=DATE(CURRENT_TIMESTAMP)\nUNION\n"
      );

    sql += selectSQL
      .replace("{t}", "0 AS Status, 'Vencido'")
      .replace(
        "l.Id=?",
        "li.FlPago=0 AND li.DtVencto<DATE(CURRENT_TIMESTAMP)\nUNION\n"
      );

    sql += selectSQL
      .replace("{t}", "3 AS Status, 'Pago'")
      .replace("l.Id=?", "li.FlPago=1\n");

    sql += "ORDER BY Status, DtVencto, Tipo, Descricao";

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
        var sql = selectSQL + ''; // Para fazer uma cópia, e não criar um referência
        const pars = [];

        if (!crit) {
            crit = 'a';
        }

        switch (crit.toLowerCase().substring(0, 1)) {
            case 'a': // a vencer
                sql = sql.replace('{t}', '0')
                    .replace('l.Id=?', 'li.FlPago=0 AND li.DtVencto > DATE(CURRENT_TIMESTAMP)');
                break;
            case 'n': // vencendo
                sql = sql.replace('{t}', '1')
                    .replace('l.Id=?', 'li.FlPago=0 AND li.DtVencto=DATE(CURRENT_TIMESTAMP)');
                break;
            case 'v': // vencidos
                sql = sql.replace('{t}', '2')
                    .replace('l.Id=?', 'li.FlPago=0 AND li.DtVencto < DATE(CURRENT_TIMESTAMP)');
                break;
            default: // pagos
                sql = sql.replace('{t}', '3')
                    .replace('l.Id=?', 'li.FlPago=1');
                break;
        }

        sql += 'ORDER BY li.DtVencto, l.Descricao'

        const [results, _] = await db.query(sql, pars);

        return results.map((result) => {
            return mapLancto(result);
        });
    } catch (err) {
        logger.info(`get /Lancto/${crit} - ${err.sqlMessage}`);
        return { status: err.sqlState, 'msg': err.sqlMessage };
    }
}

export async function getByIdPai(id) {
    id = parseInt(id);

    if (!isNaN(id)) {
        if (id < 1) {
            return { status: -1, 'msg': 'id inválido' };
        }

        try {
            const [results, _] = await db.query(selectSQL, [id]);

            return mapLancto(results[0]);
        } catch (err) {
            logger.info(`get /Lancto/${id} - ${err.sqlMessage}`);
            return { status: err.sqlState, 'msg': err.sqlMessage };
        }
    }

    try {
        const [results, _] = await db.query(selectSQL.replace('WHERE l.Id=?', ''));

        return results.map((result) => {
            return mapLancto(result);
        });
    } catch (err) {
        logger.info(`get /Lancto - ${err.sqlMessage}`);
        return { status: err.sqlState, 'msg': err.sqlMessage };
    }
}

export async function getByIdParcela(id, parcela) {
    id = parseInt(id);

    if (!isNaN(id)) {
        if (id < 1) {
            return { status: -1, 'msg': 'id inválido' };
        }

        try {
            const [results, _] = await db.query(selectSQL.replace('=?', '=? AND li.Parcela=?'), [id, parcela]);

            return mapLancto(results[0]);
        } catch (err) {
            logger.info(`get /Lancto/${id} - ${err.sqlMessage}`);
            return { status: err.sqlState, 'msg': err.sqlMessage };
        }
    }

    try {
        const [results, _] = await db.query(selectSQL.replace('WHERE l.Id=?\n', ''));

        return results.map((result) => {
            return mapLancto(result);
        });
    } catch (err) {
        logger.info(`get /Lancto - ${err.sqlMessage}`);
        return { status: err.sqlState, 'msg': err.sqlMessage };
    }
}

export async function getByIdTipoConta(id) {
    id = parseInt(id);

    if (!isNaN(id) || id < 1) {
        return { status: -1, 'msg': 'Tipo de Conta inválido' };
    }

    try {
        const [results, _] = await db.query('SELECT * FROM lancto WHERE IdTipoConta=? ORDER BY Id', [id]);

        return results.map((result) => {
            return mapLancto(result);
        });
    } catch (err) {
        logger.info(`get /Lancto/Tipo/${id} - ${err.sqlMessage}`);
        return { status: err.sqlState, 'msg': err.sqlMessage };
    }
}

export async function getByIdLote(id) {
    try {
        const [results, _] = await db.query('SELECT * FROM lancto WHERE IdLote=? ORDER BY DtVencto', [id]);

        return results.map((result) => {
            return mapLancto(result);
        });
    } catch (err) {
        logger.info(`get /Lancto/Tipo/${id} - ${err.sqlMessage}`);
        return { status: err.sqlState, 'msg': err.sqlMessage };
    }
}
