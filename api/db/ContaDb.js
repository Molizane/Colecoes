import db from './db.js';

export async function insert(conta) {
    if (!conta) {
        return { status: -1, 'msg': 'Registro não informado' };
    }

    try {
        await db.query('call InsertConta(?,?)', [conta.idTipoConta, conta.descricao]);
        return { status: 0, 'msg': 'ok' };
    } catch (err) {
        logger.info(`insert /Conta - ${err.sqlMessage}`);
        return { status: err.sqlState, 'msg': err.sqlMessage };
    }
}

export async function update(conta) {
    if (!conta) {
        return { status: -1, 'msg': 'Registro não informado' };
    }

    try {
        await db.query('call UpdateConta(?, ?)', [conta.id, conta.descricao]);
        return { status: 0, 'msg': 'ok' };
    } catch (err) {
        logger.info(`update /Conta - ${err.sqlMessage}`);
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
        logger.info(`exclude /Conta/${id} - ${err.sqlMessage}`);
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
                idTipoConta: result.IdTipoConta,
            }
        } catch (err) {
            logger.info(`get /Conta/${id} - ${err.sqlMessage}`);
            return { status: err.sqlState, 'msg': err.sqlMessage };
        }
    }

    try {
        const [results, _] = await db.query('SELECT t.*, c.Descricao AS TipoConta, (SELECT COUNT(1) FROM lancto c WHERE c.IdConta = t.Id) as qtde FROM conta AS t INNER JOIN tipoconta c ON c.Id = t.IdTipoConta ORDER BY c.Descricao, t.Descricao');

        return results.map((result) => {
            return {
                id: result.Id,
                descricao: result.Descricao,
                idTipoConta: result.IdTipoConta,
                tipoConta: result.TipoConta,
                qtde: result.qtde,
            }
        });
    } catch (err) {
        logger.info(`get /Conta - ${err.sqlMessage}`);
        return { status: err.sqlState, 'msg': err.sqlMessage };
    }
}
