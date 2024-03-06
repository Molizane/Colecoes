export function trataErrosApi(erro) {
    //console.log(erro);

    if (erro.response && erro.response.data && erro.response.data.msg) {
        return {
            data: {
                id: -1,
                msg: erro.response.data.msg,
            }
        };
    }

    if (erro.msg) {
        return {
            data: {
                id: -1,
                msg: erro.msg,
            }
        };
    }

    if (erro.message) {
        return {
            data: {
                id: -1,
                msg: erro.message,
            }
        };
    }

    return {
        data: {
            id: -1,
            msg: 'Erro desconhecido',
        }
    };
}
