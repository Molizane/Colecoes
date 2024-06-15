const Lancto_ = {
  id: null,
  status: "",
  tipo: "",
  descricao: "",
  idConta: 0,
  conta: "",
  flgDiasUteis: true,
  dtVencto: "",
  vlLancto: 0.0,
  tpVencto: "M",
  parcelas: 1,
  parcela: 1,
  flPago: false,
  dtPagto: "",
  tpAcrDesc: "",
  vlExtra: 0.0,
  vlAcrescimo: 0.0,
  vlDesconto: 0.0,
  vlTotal: 0.0,
  descrTipo: "",
  descrParcelas: "",
  flgUpdateAll: false,
  flgGerarParcela: false,
  flgDifFinal: true,
  flgBaixar: false,
};

export default function LanctoObj() {
  return { ...Lancto_ };
}
