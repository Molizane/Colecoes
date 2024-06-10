const Lancto_ = {
  id: null,
  idLote: 0,
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
  descrParcela: "",
  flgUpdateAll: false,
  flgGerarParcela: false,
  flgDifFinal: true,
};

export default function LanctoObj() {
  return { ...Lancto_ };
}
