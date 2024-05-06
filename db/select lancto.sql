/*
TRUNCATE TABLE `contas_dev`.`lanctoitens`;
TRUNCATE TABLE `contas_dev`.`lancto`;
TRUNCATE TABLE `contas_dev`.`lote`;
*/

SELECT l.`Id`, l.`IdLote`, l.`Parcelas`, li.`Parcela`, l.`IdConta`, c.`Descricao` AS `Conta`, l.`Descricao`,
       l.`DtLancto`, l.`TpLancto`, l.`FlgDiasUteis`, li.`DtVencto`, li.`VlLancto`, li.`FlPago`, li.`DtPagto`,
       li.`VlAcrescimo`, li.`VlDesconto`, li.`VlTotal`,
       CASE l.`TpLancto`
         WHEN 'S' THEN 'Semanal'
         WHEN 'Q' THEN 'Quinzenal'
         WHEN 'M' THEN 'Mensal'
         WHEN 'B' THEN 'Bimestral'
         WHEN 'T' THEN 'Trimestral'
         WHEN '4' THEN 'Quadrimestral'
         WHEN '6' THEN 'Semestral'
         WHEN 'A' THEN 'Anual'
         ELSE l.`TpLancto`
       END AS `DescrTipo`
FROM `contas_dev`.`lancto` l
INNER JOIN `contas_dev`.`lanctoitens` li
ON li.`IdLancto` = l.`Id`
INNER JOIN `contas_dev`.`conta` c
ON c.`Id` = l.`IdConta`
ORDER BY li.`DtVencto`, l.`Descricao`, l.`IdLote`, li.`IdLancto`;
