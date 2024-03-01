import db from './db.js';

export async function insert(lancto) {
    if (!lancto) {
        return { status: -1, 'msg': 'Registro não informado' };
    }

    try {
        await db.query('call InsertLancto(?)', [lancto.id, lancto.descricao, lancto.vlLancto, lancto.dtVencto]);
        return { status: 0, 'msg': 'ok' };
    } catch (err) {
        console.log(err);
        return { status: err.sqlState, 'msg': err.sqlMessage };
    }
}

export async function update(lancto) {
    if (!lancto) {
        return { status: -1, 'msg': 'Registro não informado' };
    }

    try {
        await db.query('call UpdateLancto(?, ?, ?, ?)', [lancto.id, lancto.descricao, lancto.vlLancto, lancto.dtVencto]);
        return { status: 0, 'msg': 'ok' };
    } catch (err) {
        return { status: err.sqlState, 'msg': err.sqlMessage };
    }
}

export async function exclude(id) {
    id = parseInt(id);

    if (isNaN(id)) {
        return { status: -1, 'msg': 'id não informado' };
    }

    try {
        await db.query('call DeleteLancto(?)', [id]);
        return { status: 0, 'msg': 'ok' };
    } catch (err) {
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
            return err;
        }
    }

    try {
        const [results, _] = await db.query('SELECT * FROM lancto ORDER BY Id');

        return results.map((result) => {
            return {
                id: result.Id,
                descricao: result.Descricao,
            }
        });
    } catch (err) {
        return err;
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
                id: result.Id,
                descricao: result.Descricao,
            }
        });
    } catch (err) {
        return err;
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
        return { status: err.sqlState, 'msg': err.sqlMessage };
    }
}
