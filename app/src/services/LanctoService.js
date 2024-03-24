import http from './http-common';
import { trataErrosApi } from '../functions/utils'

const create = async (data) => {
    try {
        return await http.post('/lancto', data);
    } catch (ex) {
        return trataErrosApi(ex);
    }
};

const update = async (data) => {
    try {
        return await http.put(`/lancto/${data.id}`, data);
    } catch (ex) {
        return trataErrosApi(ex);
    }
};

const remove = async (id) => {
    try {
        return await http.delete(`/lancto/${id}`);
    } catch (ex) {
        return trataErrosApi(ex);
    }
};

const getAll = async (crit) => {
    try {
        return await http.get(`/lancto/list/${crit}`);
    } catch (ex) {
        return trataErrosApi(ex);
    }
};

const get = async (id) => {
    try {
        return await http.get(`/lancto/${id}`);
    } catch (ex) {
        return trataErrosApi(ex);
    }
};

const exportedObject = {
    create,
    update,
    remove,
    getAllLanctos: getAll,
    get,
};

export default exportedObject;
