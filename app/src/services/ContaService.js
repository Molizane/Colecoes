import http from './http-common';

const create = async (data) => {
  try {
    return await http.post('/conta', data);
  }
  catch (ex) {
    if (ex.response && ex.response.data && ex.response.data.msg) {
      return ex.response;
    }

    return { data: { id: -1, msg: ex.message } };
  }
};

const update = async (data) => {
  try {
    return await http.put(`/conta/${data.id}`, data);
  }
  catch (ex) {
    if (ex.response && ex.response.data && ex.response.data.msg) {
      return ex.response;
    }

    return { data: { id: -1, msg: ex.message } };
  }
};

const remove = async (id) => {
  try {
    return await http.delete(`/conta/${id}`);
  }
  catch (ex) {
    if (ex.response && ex.response.data && ex.response.data.msg) {
      return ex.response;
    }

    return { data: { id: -1, msg: ex.message } };
  }
};

const getAll = async () => {
  try {
    return await http.get('/conta');
  }
  catch (ex) {
    if (ex.response && ex.response.data && ex.response.data.msg) {
      return ex.response;
    }

    return { data: { id: -1, msg: ex.message } };
  }
};

const get = async (id) => {
  try {
    return await http.get(`/conta/${id}`);
  }
  catch (ex) {
    if (ex.response && ex.response.data && ex.response.data.msg) {
      return ex.response;
    }

    return { data: { id: -1, msg: ex.message } };
  }
};

const exportedObject = {
  create,
  update,
  remove,
  getAll,
  get,
};

export default exportedObject;
