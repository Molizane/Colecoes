/*
TRUNCATE TABLE `contas_dev`.`lanctoitens`;
TRUNCATE TABLE `contas_dev`.`lancto`;
TRUNCATE TABLE `contas_dev`.`lote`;
*/

SELECT `lancto`.`Id`,
       `lancto`.`IdConta`,
       `lancto`.`Descricao`,
       `lancto`.`DtLancto`,
       `lancto`.`IdLote`,
       `lancto`.`Parcelas`,
       `lancto`.`TpLancto`,
       `lancto`.`FlgDiasUteis`
FROM `contas_dev`.`lancto`
ORDER BY IdLote;

SELECT `lanctoitens`.`Id`,
       `lanctoitens`.`Parcela`,
       `lanctoitens`.`DtVencto`,
       `lanctoitens`.`VlLancto`,
       `lanctoitens`.`FlPago`,
       `lanctoitens`.`DtPagto`,
       `lanctoitens`.`VlAcrescimo`,
       `lanctoitens`.`VlDesconto`,
       `lanctoitens`.`VlTotal`
FROM `contas_dev`.`lanctoitens`
ORDER BY Id, DtVencto;
