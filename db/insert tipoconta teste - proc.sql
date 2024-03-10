
DROP PROCEDURE IF EXISTS `FillTiposConta`;

DELIMITER //

CREATE PROCEDURE `FillTiposConta`()
BEGIN
  SET @idTipoConta = 1;
  SET @vezes = 0;
  
  DELETE FROM `tipoconta`
  WHERE Id NOT IN (SELECT DISTINCT IdTipoConta from `conta`);
  
  WHILE @vezes < 150 DO 
    SET @tiposConta = 0;
    SET @max_conta = FLOOR(RAND() * 15 + 1);
    
    loop2: LOOP
      SET @descricao = CONCAT('Tipo Conta Teste ', LPAD(TRIM(CONVERT(@idTipoConta, CHAR(3))), 3, '0'))      ;
      
      IF NOT EXISTS(SELECT 1 FROM `tipoconta` WHERE Descricao = @descricao) THEN
        INSERT INTO `tipoconta` (`Descricao`) VALUES (@descricao);
      
        SET @tiposConta = @tiposConta + 1;
        SET @vezes = @vezes + 1;
      
        IF @tiposConta >= @max_conta THEN
          LEAVE loop2;
        END IF;
      END IF;
  
      SET @idTipoConta = @idTipoConta + 1;
    END LOOP loop2;
  END WHILE;
END//

DELIMITER ;
