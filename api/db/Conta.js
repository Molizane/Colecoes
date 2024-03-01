import db from './db.js';

export async function insert(conta) {
    if (!conta) {
        return { status: -1, 'msg': 'Registro não informado' };
    }

    try {
        await db.query('call InsertConta(?,?)', [conta.idLancto, conta.descricao]);
        return { status: 0, 'msg': 'ok' };
    } catch (err) {
        console.log(err);
        return { status: err.sqlState, 'msg': err.sqlMessage };
    }
}

export async function update(conta) {
    if (!conta) {
        return { status: -1, 'msg': 'Registro não informado' };
    }

    try {
        await db.query('call UpdateConta(?, ?, ?)', [conta.id, conta.descricao]);
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
        await db.query('call DeleteConta(?)', [id]);
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
            const [results, _] = await db.query('SELECT * FROM conta WHERE Id=?', [id]);
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
        const [results, _] = await db.query('SELECT * FROM conta ORDER BY Id');

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
