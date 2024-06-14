SELECT 'Saldo' AS Tipo, li.`DtVencto` AS Data, -SUM(li.`VlTotal`) AS Lanctos, pl.`Valor` AS Saldo
FROM `lancto` l
INNER JOIN `lanctoitens` li
ON li.`IdLancto` = l.`Id`
LEFT OUTER JOIN `saldo` pl
ON pl.`Data` = li.`DtVencto`
WHERE li.`FlPago` = 0
GROUP BY li.`DtVencto`
ORDER BY li.`DtVencto`;

SELECT 'Efetivado' AS Tipo, li.`DtPagto` AS Data, SUM(li.`VlTotal` * CASE li.Parcela WHEN 0 THEN 1 ELSE -1 END) AS Lanctos, ef.`Valor` AS Saldo
FROM `lancto` l
INNER JOIN `lanctoitens` li
ON li.`IdLancto` = l.`Id`
LEFT OUTER JOIN `efetivado` ef
ON ef.`Data` = li.`DtPagto`
WHERE li.`FlPago` = 1
GROUP BY li.`DtPagto`
ORDER BY li.`DtPagto`;
