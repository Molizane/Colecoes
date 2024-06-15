/*
TRUNCATE TABLE `contas_dev`.`saldo`;
TRUNCATE TABLE `contas_dev`.`efetivado`;
TRUNCATE TABLE `contas_dev`.`lanctoitens`;
TRUNCATE TABLE `contas_dev`.`lancto`;
*/

SELECT l.`Id`,
       CASE WHEN l.Parcelas = 0
            THEN 'Entrada'
            ELSE 'Saída'
	   END AS 'Movimento',
       CASE l.`TpVencto`
           WHEN 'S' THEN 'Semanal'
           WHEN 'Q' THEN 'Quinzenal'
           WHEN 'M' THEN 'Mensal'
           WHEN 'B' THEN 'Bimestral'
           WHEN 'T' THEN 'Trimestral'
           WHEN '4' THEN 'Quadrimestral'
           WHEN '6' THEN 'Semestral'
           WHEN 'A' THEN 'Anual'
           WHEN 'U' THEN 'Único'
           ELSE l.`TpVencto`
       END AS `Tipo`,
       l.`Parcelas`, li.`Parcela`, l.`IdConta`, c.`Descricao` AS `Conta`,
       CONCAT(li.`Descricao`, CASE WHEN l.`Parcelas` > 1 THEN CONCAT(' (', li.`Parcela`, ' / ', l.`Parcelas`, ')') ELSE "" END) AS `Descricao`,
       l.`DtLancto`, l.`TpVencto`, l.`FlgDiasUteis`, li.`DtVencto`, li.`VlLancto`, li.`FlPago`,
       li.`DtPagto`, li.`VlAcrescimo`, li.`VlDesconto`,
       li.`VlTotal` * CASE l.`Parcelas` WHEN 0 THEN 1 ELSE -1 END AS `VlTotal`
FROM `contas_dev`.`lancto` l
INNER JOIN `contas_dev`.`lanctoitens` li
ON li.`IdLancto` = l.`Id`
INNER JOIN `contas_dev`.`conta` c
ON c.`Id` = l.`IdConta`
ORDER BY li.`DtVencto`, li.`Descricao`, li.`IdLancto`;
