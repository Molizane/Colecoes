/*
TRUNCATE TABLE `contas_dev`.`planejado`;
TRUNCATE TABLE `contas_dev`.`efetivado`;
TRUNCATE TABLE `contas_dev`.`lanctoitens`;
TRUNCATE TABLE `contas_dev`.`lancto`;
*/

SELECT l.`Id`, l.`Parcelas`, li.`Parcela`, l.`IdConta`, c.`Descricao` AS `Conta`, li.`Descricao`,
       l.`DtLancto`, l.`TpVencto`, l.`FlgDiasUteis`, li.`DtVencto`, li.`VlLancto`, li.`FlPago`,
       li.`DtPagto`, li.`VlAcrescimo`, li.`VlDesconto`, li.`VlTotal`,
       CASE WHEN l.Parcelas = 0
            THEN 'Crédito'
            ELSE CASE l.`TpVencto`
                   WHEN 'S' THEN 'Semanal'
                   WHEN 'Q' THEN 'Quinzenal'
                   WHEN 'M' THEN 'Mensal'
                   WHEN 'B' THEN 'Bimestral'
                   WHEN 'T' THEN 'Trimestral'
                   WHEN '4' THEN 'Quadrimestral'
                   WHEN '6' THEN 'Semestral'
                   WHEN 'A' THEN 'Anual'
                   ELSE l.`TpVencto`
                 END
       END AS `DescrTipo`
FROM `contas_dev`.`lancto` l
INNER JOIN `contas_dev`.`lanctoitens` li
ON li.`IdLancto` = l.`Id`
INNER JOIN `contas_dev`.`conta` c
ON c.`Id` = l.`IdConta`
ORDER BY li.`DtVencto`, li.`Descricao`, li.`IdLancto`;
