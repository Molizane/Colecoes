SELECT 'P' AS tipo, p.* FROM contas_dev.planejado p
UNION ALL
SELECT 'E' AS tipo, e.* FROM contas_dev.efetivado e
ORDER BY Data, tipo DESC
;
