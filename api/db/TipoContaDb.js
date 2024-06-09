import db from './db.js';

export async function insert(tipoConta) {
  if (!tipoConta) {
    return { status: -1, msg: "Registro não informado" };
  }

  try {
    await db.query("call InsertTipoConta(?,?)", [
      tipoConta.descricao,
      tipoConta.ehCredito,
    ]);
    return { status: 0, msg: "ok" };
  } catch (err) {
    logger.info(`insert /TipoConta - ${err.sqlMessage}`);
    return { status: err.sqlState, msg: err.sqlMessage };
  }
}

export async function update(tipoConta) {
  if (!tipoConta) {
    return { status: -1, msg: "Registro não informado" };
  }

  try {
    await db.query("call UpdateTipoConta(?,?)", [
      tipoConta.id,
      tipoConta.descricao,
    ]);
    return { status: 0, msg: "ok" };
  } catch (err) {
    logger.info(`update /TipoConta - ${err.sqlMessage}`);
    return { status: err.sqlState, msg: err.sqlMessage };
  }
}

export async function exclude(id) {
    id = parseInt(id);

    if (isNaN(id)) {
        return { status: -1, 'msg': 'id não informado' };
    }

    try {
        await db.query('call DeleteTipoConta(?)', [id]);
        return { status: 0, 'msg': 'ok' };
    } catch (err) {
        logger.info(`exclude /TipoConta/${id} - ${err.sqlMessage}`);
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
            const [results, _] = await db.query('SELECT * FROM tipoconta WHERE Id=?', [id]);
            const result = results[0];

            return {
                id: result.Id,
                descricao: result.Descricao,
            }
        } catch (err) {
            logger.info(`get /TipoConta/${id} - ${err.sqlMessage}`);
            return { status: err.sqlState, 'msg': err.sqlMessage };
        }
    }

    try {
        const [results, _] = await db.query('SELECT t.*, (SELECT COUNT(1) FROM conta c WHERE c.IdTipoConta = t.Id) as qtde FROM tipoconta AS t ORDER BY t.Descricao');

        return results.map((result) => {
            return {
                id: result.Id,
                descricao: result.Descricao,
                qtde: result.qtde,
            }
        });
    } catch (err) {
        logger.info(`get /TipoConta - ${err.sqlMessage}`);
        return { status: err.sqlState, 'msg': err.sqlMessage };
    }
}
