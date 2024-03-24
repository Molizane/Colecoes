TRUNCATE TABLE `contas_dev`.`lanctoitens`;
TRUNCATE TABLE `contas_dev`.`lancto`;
TRUNCATE TABLE `contas_dev`.`lote`;

SET @p_Id = 0;
SET @p_IdLote = 0;

CALL `contas_dev`.`InsertLancto`(800, 'Casas Bahia - Geladeira', 123.45, '2024-01-29', 24, 'M', 1, @p_Id, @p_IdLote);
SELECT @p_Id, @p_IdLote;

CALL `contas_dev`.`InsertLancto`(800, 'Consórcio - Imóvel', 1065.96, '2024-01-31', 60, 'M', 1, @p_Id, @p_IdLote);
SELECT @p_Id, @p_IdLote;

CALL `contas_dev`.`InsertLancto`(801, 'Tratamento dentário', 100, '2024-01-10', 12, 'M', 1, @p_Id, @p_IdLote);
SELECT @p_Id, @p_IdLote;
