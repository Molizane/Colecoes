SELECT 'Saldo' AS tipo, s.* FROM contas_dev.saldo s
UNION ALL
SELECT 'Efetivado' AS tipo, e.* FROM contas_dev.efetivado e
ORDER BY Data, tipo DESC
;
