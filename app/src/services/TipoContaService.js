import http from './http-common';

const create = async (data) => {
  try {
    return await http.post('/tipoconta', data);
  } catch (ex) {
    return {
      data: {
        message: ex.message
      }
    }
  }
};

const update = async (id, data) => {
  try {
    return await http.put(`/tipoconta/${id}`, data);
  } catch (ex) {
    return {
      data: {
        message: ex.message
      }
    }
  }
};

const remove = async (id) => {
  try {
    return await http.delete(`/tipoconta/${id}`);
  } catch (ex) {
    return {
      data: {
        message: ex.message
      }
    }
  }
};

const getAll = async () => {
  try {
    return await http.get('/tipoconta');
  } catch (ex) {
    return {
      data: {
        message: ex.message
      }
    }
  }
};

const get = async (id) => {
  try {
    return await http.get(`/tipoconta/${id}`);
  } catch (ex) {
    return {
      data: {
        message: ex.message
      }
    }
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
