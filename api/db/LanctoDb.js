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
            'set @id = null; set @idLote = ?; call InsertLancto(?,?,?,?,@id,@idLote); select @id as id, @idLote as idLote',
            [lancto.idLote, lancto.idConta, lancto.descricao, lancto.vlLancto, lancto.dtVencto]);

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
            'set @idLote = null; call UpdateLancto(?,?,?,?,?,@idLote); select @idLote as idLote',
            [lancto.id, lancto.descricao, lancto.dtLancto, lancto.vlLancto, lancto.dtVencto]);

        return { status: 0, 'msg': 'ok', info: result[0][2][0] };
    } catch (err) {
        logger.info(`update /Lancto - ${err.sqlMessage}`);
        return { status: err.sqlState, 'msg': err.sqlMessage };
    }
}

export async function exclude(id) {
    id = parseInt(id);

    if (isNaN(id)) {
        return { status: -1, 'msg': 'id não informado' };
    }

    try {
        const result = await db.query(
            'set @idLote = null; set @dtVencto = null; call DeleteLancto(?,@idLote,@dtVencto); select @idLote as idLote, @dtVencto as dtVencto',
            [id]);

        return { status: 0, 'msg': 'ok', info: result[0][3][0] };
    } catch (err) {
        logger.info(`exclude /Lancto/${id} - ${err.sqlMessage}`);
        return { status: err.sqlState, 'msg': err.sqlMessage };
    }
}

export async function getById(id) {
    id = parseInt(id);

    if (!isNaN(id)) {
        if (id < 1) {
            return { status: -1, 'msg': 'id inválido' };
        }

        try {
            const [results, _] = await db.query('SELECT * FROM lancto WHERE Id=?', [id]);
            const result = results[0];

            return {
                id: result.Id,
                descricao: result.Descricao,
            }
        } catch (err) {
            logger.info(`get /Lancto/${id} - ${err.sqlMessage}`);
            return { status: err.sqlState, 'msg': err.sqlMessage };
        }
    }

    try {
        const [results, _] = await db.query('SELECT * FROM lancto ORDER BY Id');

        return results.map((result) => {
            return {
                idLote: result.IdLote,
                id: result.Id,
                descricao: result.Descricao,
                vlLancto: result.VlLancto,
                dtVencto: result.DtVencto,
                dtPagto: result.DtPagto,
                vlAcrescimo: result.VlAcrescimo,
                vlDesconto: result.VlDesconto,
                vlTotal: result.VlTotal,
                flPago: result.FlPago,
            }
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
            return {
                idLote: result.IdLote,
                id: result.Id,
                descricao: result.Descricao,
                vlLancto: result.VlLancto,
                dtVencto: result.DtVencto,
                dtPagto: result.DtPagto,
                vlAcrescimo: result.VlAcrescimo,
                vlDesconto: result.VlDesconto,
                vlTotal: result.VlTotal,
                flPago: result.FlPago,
            }
        });
    } catch (err) {
        logger.info(`get /Lancto/Tipo/${id} - ${err.sqlMessage}`);
        return { status: err.sqlState, 'msg': err.sqlMessage };
    }
}

export async function getByIdLote(id) {
    try {
        const [results, _] = await db.query('SELECT * FROM lancto WHERE IdLote=? ORDER BY DtLancto', [id]);

        return results.map((result) => {
            return {
                idLote: result.IdLote,
                id: result.Id,
                descricao: result.Descricao,
                vlLancto: result.VlLancto,
                dtVencto: result.DtVencto,
                dtPagto: result.DtPagto,
                vlAcrescimo: result.VlAcrescimo,
                vlDesconto: result.VlDesconto,
                vlTotal: result.VlTotal,
                flPago: result.FlPago,
            }
        });
    } catch (err) {
        logger.info(`get /Lancto/Tipo/${id} - ${err.sqlMessage}`);
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
