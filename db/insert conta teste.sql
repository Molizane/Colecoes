
DROP PROCEDURE IF EXISTS `FillContas`;

DELIMITER //

CREATE PROCEDURE `FillContas`()
BEGIN
  SET @min_tipo = 0;
  SET @max_tipo = 0;
  SET @idConta = 1;
  SET @vezes = 0;
  
  SELECT MIN(Id), MAX(Id)
  INTO @min_tipo, @max_tipo
  FROM `tipoconta`;
  
  DELETE FROM `conta`
  WHERE Id NOT IN (SELECT DISTINCT IdConta from `lancto`);
  
  WHILE @vezes <= 150 DO 
    SET @idTipo = FLOOR(RAND() * (@max_tipo - @min_tipo) + @min_Tipo);
    SET @contas = 0;
    SET @max_conta = FLOOR(RAND() * 15 + 1);
    
    loop2: LOOP
      SET @descricao = CONCAT('Conta ', CONVERT(@idConta, CHAR(45)));
      
      IF NOT EXISTS(SELECT 1 FROM `conta` WHERE Descricao = @descricao) THEN
        INSERT INTO `conta` (`IdTipoConta`, `Descricao`) VALUES (@idTipo, @descricao);
      
        SET @contas = @contas + 1;
        SET @vezes = @vezes + 1;
      
        IF @contas >= @max_conta THEN
          LEAVE loop2;
        END IF;
      END IF;
  
      SET @idConta = @idConta + 1;
    END LOOP loop2;
  END WHILE;
END//

DELIMITER ;
