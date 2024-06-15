SELECT 'Saldo' AS tipo, s.* FROM saldo s
UNION ALL
SELECT 'Efetivado' AS tipo, e.* FROM efetivado e
ORDER BY Data, tipo DESC;

SELECT s.`Data`, s.`Valor` AS `Saldo`, e.`Valor` AS `Efetivado`
FROM saldo s
LEFT OUTER JOIN efetivado e
ON e.`Data` = s.Data
ORDER BY s.Data