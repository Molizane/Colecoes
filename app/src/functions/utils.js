import {
  gray,
  red,
  green,
  blue,
  tomato,
  yellow,
  amber,
  cyan,
} from "@radix-ui/colors";

export function trataErrosApi(erro) {
  //console.log(erro);

  if (erro.response && erro.response.data && erro.response.data.msg) {
    return {
      data: {
        id: -1,
        msg: erro.response.data.msg,
      },
    };
  }

  if (erro.msg) {
    return {
      data: {
        id: -1,
        msg: erro.msg,
      },
    };
  }

  if (erro.message) {
    return {
      data: {
        id: -1,
        msg: erro.message,
      },
    };
  }

  return {
    data: {
      id: -1,
      msg: "Erro desconhecido",
    },
  };
}

export function strDate(dt) {
  return dt.substr(0, 10).split("-").reverse().join("/");
}

export function strDateEdit(dt) {
  var day = dt.getDate();
  var month = dt.getMonth() + 1;
  var year = dt.getFullYear();

  if (day < 10) {
    day = `0${day}`;
  }

  if (month < 10) {
    month = `0${month}`;
  }

  return `${year}-${month}-${day}`;
}

export function strValue(vl) {
  return vl.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function themeColors() {
  return {
    colors: {
      ...gray,
      ...red,
      ...green,
      ...blue,
      ...tomato,
      ...yellow,
      ...amber,
      ...cyan,
    },
  };
}
