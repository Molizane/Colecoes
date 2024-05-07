SELECT c.*, DAYNAME(data) AS DOW, COALESCE(f.Feriado, fm.Feriado, fe.Feriado) AS Feriado
FROM calendario c
LEFT JOIN feriados f
  ON f.Mes = c.Mes
 AND f.Dia = c.Dia
LEFT JOIN feriadosmoveis fm
  ON fm.Ano = c.Ano
 AND fm.Mes = c.Mes
 AND fm.Dia = c.Dia
LEFT JOIN feriadosestados fe
  ON fe.Estado = 'SP'
 AND fe.Mes = c.Mes
 AND fe.Dia = c.Dia
WHERE c.Feriado=1;