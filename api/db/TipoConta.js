import db from './index.js';

export async function insert(tipoConta) {
    if (!tipoConta) {
        throw new Error('Tipo de Conta não informado');
    }

    await db.query('call InsertTipoConta(?)', [tipoConta.Descricao],
        function (err, result) {
            if (err) {
                return { err };
            } else {
                return { result };
            }
        });
}

export async function update(tipoConta) {
    await db.query('call UpdateTipoConta(?, ?)', [tipoConta.Id, tipoConta.Descricao],
        function (err, result) {
            if (err) {
                return { err };
            } else {
                return { result };
            }
        });
}

export async function exclude(id) {
    id = parseInt(id);

    await db.query('call DeleteTipoConta(?)', [id],
        function (err, result) {
            if (err) {
                return { err };
            } else {
                return { result };
            }
        });
}

export async function close(tipoConta) {
    await db.query('call CloseLancto(?,?,?,?)', [tipoConta.Id, tipoConta.DtPagto, tipoConta.VlAcrescimo, tipoConta.VlDesconto],
        function (err, result) {
            if (err) {
                return { err };
            } else {
                return { result };
            }
        });
}

export async function reopen(id) {
    await db.query('call ReopenLancto(?)', [Id],
        function (err, result) {
            if (err) {
                return { err };
            } else {
                return { result };
            }
        });
}

export async function getById(id) {
    id = parseInt(id);

    if (!isNaN(id)) {
        if (id < 1) {
            throw new Error('ID inválido');
        }

        try {
            const [results, _] = await db.query('SELECT * FROM tipoconta WHERE Id=?', [id]);
            return results[0];
        } catch (err) {
            return err;
        }
    }

    try {
        const [results, _] = await db.query('SELECT * FROM tipoconta');
        return results;
    } catch (err) {
        return err;
    }
}
