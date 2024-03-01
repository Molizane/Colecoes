import http from './http-common';

const create = (data) => {
  return http.post('/conta', data);
};

const update = (id, data) => {
  return http.put(`/conta/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/conta/${id}`);
};

const getAll = () => {
  return http.get('/conta');
};

const get = (id) => {
  return http.get(`/conta/${id}`);
};

export default {
  create,
  update,
  remove,
  getAll,
  get,
};
