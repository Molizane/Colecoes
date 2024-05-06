export function strDateBR(dt) {
  if (!dt) {
    return dt;
  }

  return dt.substr(0, 10).split("-").reverse().join("/");
}

export function strDateUS(dt) {
  if (!dt) {
    return dt;
  }

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
