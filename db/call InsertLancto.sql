SET @p_Id = 0;
SET @p_IdLote = 0;

CALL `contas_dev`.`InsertLancto`(
   765
 , 'Carnê Casas Bahia'
 , 123.45
 , '2024-01-29'
 , 24
 , 'M'
 , 1
 , @p_Id
 , @p_IdLote);

SELECT @p_Id, @p_IdLote;
