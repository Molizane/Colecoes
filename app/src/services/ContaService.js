import http from './http-common';
import { trataErrosApi } from '../functions/utils'

const create = async (data) => {
  try {
    return await http.post('/conta', data);
  } catch (ex) {
    return trataErrosApi(ex);
  }
};

const update = async (data) => {
  try {
    return await http.put(`/conta/${data.id}`, data);
  } catch (ex) {
    return trataErrosApi(ex);
  }
};

const remove = async (id) => {
  try {
    return await http.delete(`/conta/${id}`);
  } catch (ex) {
    return trataErrosApi(ex);
  }
};

const getAll = async () => {
  try {
    return await http.get('/conta');
  } catch (ex) {
    return trataErrosApi(ex);
  }
};

const get = async (id) => {
  try {
    return await http.get(`/conta/${id}`);
  } catch (ex) {
    return trataErrosApi(ex);
  }
};

const exportedObject = { create, update, remove, getAll, get };

export default exportedObject;
