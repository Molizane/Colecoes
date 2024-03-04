export function trataErrosApi(erro) {
    //console.log(erro);

    if (erro.response && erro.response.data && erro.response.data.msg) {
        return {
            data: {
                message: erro.response.data.msg
            }
        }
    }

    if (erro.message) {
        return {
            data: {
                message: erro.message
            }
        }
    }

    return {
        data: {
            message: 'Erro desconhecido'
        }
    }
}
