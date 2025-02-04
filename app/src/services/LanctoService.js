import http from "./http-common";
import { trataErrosApi } from "../functions/utils";

const create = async (data) => {
  try {
    return await http.post("/lancto", data);
  } catch (ex) {
    return trataErrosApi(ex);
  }
};

const update = async (data) => {
  try {
    return await http.put("/lancto", data);
  } catch (ex) {
    return trataErrosApi(ex);
  }
};

const payment = async (data) => {
  try {
    return await http.put("/lancto/close", data);
  } catch (ex) {
    return trataErrosApi(ex);
  }
};

const reopen = async (data) => {
  try {
    return await http.put(`/lancto/reopen`, data);
  } catch (ex) {
    return trataErrosApi(ex);
  }
};

const remove = async (id, parcela, tipo) => {
  try {
    return await http.delete(`/lancto/${id}/${parcela}/${tipo}`);
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

const getById = async (id) => {
  try {
    return await http.get(`/lancto/${id}`);
  } catch (ex) {
    return trataErrosApi(ex);
  }
};

const getExtrato = async (ano, mes) => {
  try {
    return await http.get(`/lancto/extrato/${ano}/${mes}`);
  } catch (ex) {
    return trataErrosApi(ex);
  }
};

const exportedObject = {
  create,
  update,
  payment,
  reopen,
  remove,
  getAll,
  getById,
  getExtrato,
};

export default exportedObject;
