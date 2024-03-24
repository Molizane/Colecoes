/*
TRUNCATE TABLE `contas_dev`.`lanctoitens`;
TRUNCATE TABLE `contas_dev`.`lancto`;
TRUNCATE TABLE `contas_dev`.`lote`;
*/

-- SELECT l.`Id`, l.`IdConta`, l.`Descricao`, l.`DtLancto`, l.`IdLote`, l.`Parcelas`, l.`TpLancto`, l.`FlgDiasUteis`
-- FROM `contas_dev`.`lancto` l
-- ORDER BY l.`IdLote`;

-- SELECT li.`IdLancto`, li.`Parcela`, li.`DtVencto`, li.`VlLancto`, li.`FlPago`, li.`DtPagto`, li.`VlAcrescimo`, li.`VlDesconto`, li.`VlTotal`
-- FROM `contas_dev`.`lanctoitens` li
-- ORDER BY li.`IdLancto`, li.`DtVencto`;

SELECT l.`Id`, l.`IdConta`, c.`Descricao` AS `Conta`, l.`Descricao`, l.`DtLancto`, l.`IdLote`, l.`TpLancto`, l.`FlgDiasUteis`, l.`Parcelas`
     , li.`Parcela`, li.`DtVencto`, li.`VlLancto`, li.`FlPago`, li.`DtPagto`, li.`VlAcrescimo`, li.`VlDesconto`, li.`VlTotal`
FROM `contas_dev`.`lancto` l
INNER JOIN `contas_dev`.`lanctoitens` li
ON li.`IdLancto` = l.`Id`
INNER JOIN `contas_dev`.`conta` c
ON c.`Id` = l.`IdConta`
ORDER BY li.`DtVencto`, l.`Descricao`, l.`IdLote`, li.`IdLancto`;
