import http from './http-common';

const create = async (data) => {
  return await http.post('/tipoconta', data);
};

const update = async (id, data) => {
  return await http.put(`/tipoconta/${id}`, data);
};

const remove = async (id) => {
  return await http.delete(`/tipoconta/${id}`);
};

const getAll = async () => {
  return await http.get('/tipoconta');
};

const get = async (id) => {
  return await http.get(`/tipoconta/${id}`);
};

const exportedObject = {
  create,
  update,
  remove,
  getAll,
  get,
};

export default exportedObject;
