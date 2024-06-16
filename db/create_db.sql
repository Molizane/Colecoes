-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: contas_dev
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `calendario`
--

DROP TABLE IF EXISTS `calendario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calendario` (
  `Data` date NOT NULL,
  `Ano` int GENERATED ALWAYS AS (year(`Data`)) VIRTUAL,
  `Mes` tinyint GENERATED ALWAYS AS (month(`Data`)) VIRTUAL,
  `Dia` tinyint GENERATED ALWAYS AS (dayofmonth(`Data`)) VIRTUAL,
  `DiaUtil` int unsigned NOT NULL DEFAULT '1',
  `Feriado` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`Data`),
  UNIQUE KEY `ui_calendario_DMY` (`Ano`,`Mes`,`Dia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `conta`
--

DROP TABLE IF EXISTS `conta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conta` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `IdTipoConta` int NOT NULL,
  `Descricao` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `EhCredito` tinyint NOT NULL DEFAULT '0',
  `DtCriacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `DtAlteracao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `ui_conta_nm` (`Id`,`IdTipoConta`,`Descricao`),
  KEY `idx_conta_tipoconta` (`IdTipoConta`) /*!80000 INVISIBLE */,
  KEY `idx_conta_Id_IdTipoConta` (`IdTipoConta`,`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `efetivado`
--

DROP TABLE IF EXISTS `efetivado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `efetivado` (
  `Data` date NOT NULL,
  `Valor` decimal(15,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`Data`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `feriados`
--

DROP TABLE IF EXISTS `feriados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feriados` (
  `Mes` tinyint unsigned NOT NULL,
  `Dia` tinyint unsigned NOT NULL,
  `Feriado` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  PRIMARY KEY (`Mes`,`Dia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `feriadosestados`
--

DROP TABLE IF EXISTS `feriadosestados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feriadosestados` (
  `Estado` varchar(2) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `Mes` tinyint unsigned NOT NULL,
  `Dia` tinyint unsigned NOT NULL,
  `Feriado` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  PRIMARY KEY (`Estado`,`Mes`,`Dia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `feriadosmoveis`
--

DROP TABLE IF EXISTS `feriadosmoveis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feriadosmoveis` (
  `Ano` int unsigned NOT NULL,
  `Mes` tinyint unsigned NOT NULL,
  `Dia` tinyint unsigned NOT NULL,
  `Estado` varchar(2) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL DEFAULT '--',
  `Feriado` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  PRIMARY KEY (`Ano`,`Mes`,`Dia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lancto`
--

DROP TABLE IF EXISTS `lancto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lancto` (
  `Id` int unsigned NOT NULL AUTO_INCREMENT,
  `IdConta` int unsigned NOT NULL,
  `DtLancto` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Parcelas` int NOT NULL DEFAULT '1',
  `TpVencto` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT 'U',
  `FlgDiasUteis` tinyint unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`),
  KEY `fk_lancto_conta_idx` (`IdConta`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lanctoitens`
--

DROP TABLE IF EXISTS `lanctoitens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lanctoitens` (
  `IdLancto` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'Id único do lançamento',
  `DtVencto` date NOT NULL COMMENT 'Data do vencimento',
  `Parcela` int unsigned NOT NULL DEFAULT '0' COMMENT 'Nº da parcela',
  `Descricao` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `VlLancto` decimal(15,2) unsigned NOT NULL COMMENT 'Valor da parcela',
  `FlPago` tinyint unsigned NOT NULL DEFAULT '0' COMMENT 'Flag de Pago',
  `DtPagto` date DEFAULT NULL COMMENT 'Data de pagamento',
  `VlAcrescimo` decimal(15,2) unsigned NOT NULL DEFAULT '0.00' COMMENT 'Acréscimo',
  `VlDesconto` decimal(15,2) unsigned NOT NULL DEFAULT '0.00' COMMENT 'Desconto',
  `VlTotal` decimal(15,2) GENERATED ALWAYS AS (((`VlLancto` + `VlAcrescimo`) - `VlDesconto`)) VIRTUAL COMMENT 'Valor Total (calculado)',
  `DtAlteracao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`IdLancto`,`DtVencto`),
  UNIQUE KEY `ui_lancoitens_parcela` (`IdLancto`,`Parcela`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='Tabela das parcelas do lançamento';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `saldo`
--

DROP TABLE IF EXISTS `saldo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saldo` (
  `Data` date NOT NULL,
  `Valor` decimal(15,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`Data`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tipoconta`
--

DROP TABLE IF EXISTS `tipoconta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipoconta` (
  `Id` int unsigned NOT NULL AUTO_INCREMENT,
  `Descricao` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `EhCredito` tinyint NOT NULL DEFAULT '0',
  `DtCriacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `DtAlteracao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `ui_tipoconta_nm` (`Descricao`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'contas_dev'
--

--
-- Dumping routines for database 'contas_dev'
--
/*!50003 DROP FUNCTION IF EXISTS `Pascoa` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`angelo`@`localhost` FUNCTION `Pascoa`(p_Ano INT) RETURNS date
    NO SQL
BEGIN
  DECLARE v_R1, v_R2, v_R3, v_R4, v_R5 INT;
  DECLARE r_Pascoa DATE;
  DECLARE v_VD INT;

  SET v_R1 = p_Ano mod 19;
  SET v_R2 = p_Ano mod 4;
  SET v_R3 = p_Ano mod 7;
  SET v_R4 = (19 * v_R1 + 24) mod 30;
  SET v_R5 = (6 * v_R4 + 4 * v_R3 + 2 * v_R2 + 5) mod 7;
  SET r_Pascoa = STR_TO_DATE(CONCAT(p_Ano, ',', 3, ',', 22), '%Y,%m,%d');
  SET r_Pascoa = DATE_ADD(r_Pascoa, INTERVAL v_R4 + v_R5 DAY);
  SET v_VD = DAYOFMONTH(r_Pascoa);

  IF v_VD = 26 THEN
    SET r_Pascoa = STR_TO_DATE(CONCAT(p_Ano, ',', 4, ',', 19), '%Y,%m,%d');
  ELSEIF v_VD = 25 AND v_R1 > 10 then
    SET r_Pascoa = STR_TO_DATE(CONCAT(p_Ano, ',', 4, ',', 18), '%Y,%m,%d');
  END IF;

  RETURN r_Pascoa;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CloseLancto` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`angelo`@`localhost` PROCEDURE `CloseLancto`(
  IN p_Id INT,
  IN p_Parcela INT,
  IN p_DtPagto DATETIME,
  IN p_VlAcrescimo DECIMAL(15,2),
  IN p_VlDesconto DECIMAL(15,2)
)
BEGIN
  DECLARE v_VlLancto DECIMAL(15,2);
  DECLARE v_p DECIMAL(15,2);
  DECLARE v_VlTotal DECIMAL(15,2);
  DECLARE v_DtVencto DATE;

  IF NOT (SELECT 1 FROM `lancto` WHERE `Id` = p_Id) THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Lançamento não existe';
  END IF;
  
  SELECT VlLancto, DtVencto INTO v_VlLancto, v_DtVencto
  FROM `lanctoitens`
  WHERE `IdLancto` = p_Id
  AND `Parcela` = p_Parcela;

  IF FOUND_ROWS() = 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Lançamento não existe';
  END IF;

  IF p_VlAcrescimo < 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Valor do acréscimo inválido';
  END IF;

  IF p_VlDesconto < 0 OR p_VlDesconto >= v_VlLancto THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Valor do desconto inválido';
  END IF;

  UPDATE `lanctoitens`
  SET `DtPagto` = p_DtPagto,
      `VlAcrescimo` = p_VlAcrescimo,
      `VlDesconto` = p_VlDesconto,
      `FlPago` = 1,
      `DtAlteracao` = CURRENT_TIMESTAMP
  WHERE `IdLancto` = p_Id
  AND `Parcela` = p_Parcela;

  UPDATE `saldo`
  SET `Valor` = `Valor` - (p_VlAcrescimo - p_VlDesconto)
  WHERE `Data` >= v_DtVencto;
    
  -- Datas diferentes; ajusta saldos
  IF v_DtVencto <> p_DtPagto THEN
    UPDATE `saldo`
    SET `Valor` = `Valor` + (v_VlLancto + p_VlAcrescimo - p_VlDesconto)
    WHERE `Data` >= v_DtVencto;

    -- Deleta o registro se o saldo for igual a zero
    DELETE FROM `saldo`
    WHERE `Data` = v_DtVencto
    AND `Valor` = 0;

    -- Se não existir o registro de saldo na nova data, cria
    IF NOT EXISTS (SELECT 1 FROM `saldo` WHERE `Data` = p_DtPagto) THEN
      SET v_p = 0;

      -- Obtém o saldo da data anterior
      SELECT `Valor`
      INTO v_p
      FROM `saldo`
      WHERE `Data` < p_DtPagto
      ORDER BY `Data` DESC
      LIMIT 1;

      -- Adiciona-se o valor anterior, para não ajustar errado logo abaixo
      INSERT INTO `saldo` (`Data`, `Valor`)
      VALUES (p_DtPagto, COALESCE(v_p, 0));
    END IF;

    UPDATE `saldo`
    SET `Valor` = `Valor` - (v_VlLancto + p_VlAcrescimo - p_VlDesconto)
    WHERE `Data` >= p_DtPagto;
  END IF;
    
  IF NOT EXISTS (SELECT 1 FROM `efetivado` WHERE `Data` = p_DtPagto) THEN
    SET v_p = 0;

    -- Obtém o saldo da data anterior
    SELECT `Valor`
    INTO v_p
    FROM `efetivado`
    WHERE `Data` < p_DtPagto
    ORDER BY `Data` DESC
    LIMIT 1;
     
    INSERT INTO `efetivado` (`Data`, `Valor`)
    VALUES (p_DtPagto, COALESCE(v_p, 0));
  END IF;

  SET v_p = v_VlLancto + COALESCE(p_VlAcrescimo, 0) - COALESCE(p_VlDesconto, 0);

  UPDATE `efetivado`
  SET `Valor` = `Valor` - v_p
  WHERE `Data` >= p_DtPagto;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `DeleteConta` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`angelo`@`localhost` PROCEDURE `DeleteConta`(
  IN p_Id INT
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLSTATE '42000'
    SELECT 'Conta não pode ser excluída.';

  IF EXISTS (SELECT 1 FROM `lancto` WHERE `IdConta` = p_Id) THEN
    CALL raise_error;
  END IF;

  DELETE FROM `conta`
  WHERE `Id` = p_Id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `DeleteLancto` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`angelo`@`localhost` PROCEDURE `DeleteLancto`(
  IN p_Id INT,
  IN p_Parcela INT,
  IN p_Tipo CHAR(1)
)
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE v_VlLancto DECIMAL(15,2);
  DECLARE v_DtVencto DATE;
  DECLARE v_FlPago TINYINT;
  DECLARE v_MinDate DATE;
  DECLARE v_MaxDate DATE;
  DECLARE v_Signal INT DEFAULT 1;
  DECLARE v_Parcelas INT;
  
  DECLARE crsr CURSOR FOR SELECT `DtVencto`, `VlLancto`, `FlPago` FROM `tmpitens` ORDER BY `DtVencto`;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
    -- SET @full_error = CONCAT("ERROR #", @errno, " (", @sqlstate, "): ", @text);
    SET @full_error = COALESCE(@text, "Not defined");
    -- SELECT @full_error;
    
    DROP TEMPORARY TABLE IF EXISTS `tmpitens`;
    ROLLBACK;

    SIGNAL SQLSTATE '42000'
    SET MESSAGE_TEXT = @full_error;
  END;

  START TRANSACTION;

  DROP TEMPORARY TABLE IF EXISTS `tmpitens`;

  SELECT `Parcelas` INTO v_Parcelas
  FROM `lancto`
  WHERE `Id` = p_Id;
  
  CREATE TEMPORARY TABLE `tmpitens`
  (
    `IdLancto` INT, 
    `Parcela` INT, 
    `VlLancto` DECIMAL(15,2), 
    `DtVencto` DATE,
    `FlPago` INT
  );

  IF p_Tipo = 'T' THEN
    INSERT INTO `tmpitens` (`IdLancto`, `Parcela`, `VlLancto`, `DtVencto`, `FlPago`)
      SELECT `IdLancto`, `Parcela`, `VlLancto`, `DtVencto`, `FlPago`
      FROM `lanctoitens`
      WHERE `IdLancto` = p_Id;
  ELSEIF  p_Tipo = 'A' THEN
    INSERT INTO `tmpitens` (`IdLancto`, `Parcela`, `VlLancto`, `DtVencto`, `FlPago`)
      SELECT `IdLancto`, `Parcela`, `VlLancto`, `DtVencto`, `FlPago`
      FROM `lanctoitens`
      WHERE `IdLancto` = p_Id
      AND `Parcela` <= p_Parcela;
  ELSEIF  p_Tipo = 'P' THEN
    INSERT INTO `tmpitens` (`IdLancto`, `Parcela`, `VlLancto`, `DtVencto`, `FlPago`)
      SELECT `IdLancto`, `Parcela`, `VlLancto`, `DtVencto`, `FlPago`
      FROM `lanctoitens`
      WHERE `IdLancto` = p_Id
      AND `Parcela` >= p_Parcela;
  ELSE
    INSERT INTO `tmpitens` (`IdLancto`, `Parcela`, `VlLancto`, `DtVencto`, `FlPago`)
      SELECT `IdLancto`, `Parcela`, `VlLancto`, `DtVencto`, `FlPago`
      FROM `lanctoitens`
      WHERE `IdLancto` = p_Id
      AND `Parcela` = p_Parcela;
  END IF;
  
  -- Se não for lançamento de crédito, inverte o sinal
  IF v_Parcelas <> 0 THEN
    -- UPDATE `tmpitens` SET `VlLancto` = -`VlLancto`;
    SET v_Signal = -1;
  END IF;

  OPEN crsr;

  -- Atualiza os registros 
  upd_loop: LOOP
    FETCH crsr INTO v_DtVencto, v_VlLancto, v_FlPago;

    IF done THEN
      LEAVE upd_loop;
    END IF;

    UPDATE `saldo`
    SET `Valor` = `Valor` - v_VlLancto * v_Signal
    WHERE `Data` >= v_DtVencto;

    -- Se a parcela já estava paga, ajusta os registros de "efetivado"
    IF v_FlPago <> 0 THEN
      UPDATE `efetivado`
      SET `Valor` = `Valor` - v_VlLancto * v_Signal
      WHERE `Data` >= v_DtVencto;
    END IF;
  END LOOP;

  CLOSE crsr;

  -- Elimina os registros no intervalo que tem o valor igual a zero
  SELECT MIN(`DtVencto`), MAX(`DtVencto`) INTO v_MinDate, v_MaxDate
  FROM `tmpitens`;

  DELETE FROM `saldo`
  WHERE `Data` BETWEEN v_MinDate AND v_MaxDate
  AND `Valor` = 0;

  DELETE FROM `efetivado`
  WHERE `Data` BETWEEN v_MinDate AND v_MaxDate
  AND `Valor` = 0;

  DELETE FROM `lanctoitens`
  WHERE EXISTS (SELECT 1
                FROM `tmpitens`
                WHERE `IdLancto` = `lanctoitens`.`IdLancto`
                AND `Parcela` = `lanctoitens`.`Parcela`);

  IF p_Tipo = 'T' OR NOT EXISTS(SELECT 1 FROM `lanctoitens` WHERE `IdLancto` = p_Id) THEN
    DELETE FROM `lancto`
    WHERE `Id` = p_Id;
  END IF;

  DROP TEMPORARY TABLE `tmpitens`;
  COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `DeleteTipoConta` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`angelo`@`localhost` PROCEDURE `DeleteTipoConta`(
  IN p_Id INT
)
BEGIN
  IF p_Id IS NULL THEN
    SIGNAL SQLSTATE '42100'
    SET MESSAGE_TEXT = 'Id não informado.';
  END IF;

  IF NOT (SELECT 1 FROM `TipoConta` WHERE `Id` = p_Id) THEN
    SIGNAL SQLSTATE '42000'
    SET MESSAGE_TEXT = 'Registro não existe.';
  END IF;

  IF (SELECT 1 FROM `conta` WHERE `IdTipoConta` = p_Id) THEN
    SIGNAL SQLSTATE '42003'
    SET MESSAGE_TEXT = 'Registro não pode ser excluído.';
  END IF;

  DELETE FROM `TipoConta`
  WHERE `Id` = p_Id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `DiasUteis` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`angelo`@`%` PROCEDURE `DiasUteis`(INOUT p_DataRef DATE)
BEGIN
  DECLARE v_Dt DATE DEFAULT p_DataRef;
  DECLARE v_Feriado INT;
  DECLARE v_DiaUtil INT DEFAULT 0;
  
  IF DAYOFWEEK(v_Dt) = 1 THEN -- Domingo
    SET v_Dt = ADDDATE(v_Dt, INTERVAL 1 DAY);
  ELSEIF DAYOFWEEK(v_Dt) = 2 THEN -- Sábado
    SET v_Dt = ADDDATE(v_Dt, INTERVAL 2 DAY);
  END IF;

  diasuteis: LOOP
    SELECT SQL_CALC_FOUND_ROWS `Feriado`, `DiaUtil` INTO v_Feriado, v_DiaUtil
    FROM `calendario`
    WHERE `Data` = v_Dt;

    -- Não achou a data no calendário
    IF FOUND_ROWS() = 0 THEN
      LEAVE diasuteis;
    END IF;

    IF v_Feriado = 1 THEN
      SET v_Dt = ADDDATE(v_Dt, INTERVAL 1 DAY);

      IF DAYOFWEEK(v_Dt) = 1 THEN -- Domingo
        SET v_Dt = ADDDATE(v_Dt, INTERVAL 1 DAY);
      ELSEIF DAYOFWEEK(v_Dt) = 2 THEN -- Sábado
        SET v_Dt = ADDDATE(v_Dt, INTERVAL 2 DAY);
      END IF;
	ELSE
      LEAVE diasuteis;
    END IF;
  END LOOP;

  SET p_DataRef = v_Dt;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `FillContas` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`angelo`@`localhost` PROCEDURE `FillContas`()
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
    SET @idTipoConta = FLOOR(RAND() * (@max_tipo - @min_tipo) + @min_Tipo);
    SET @contas = 0;
    SET @max_conta = FLOOR(RAND() * 15 + 1);
    
    loop2: LOOP
      SET @descricao = CONCAT('Conta Teste ', LPAD(TRIM(CONVERT(@idConta, CHAR(3))), 3, '0'))      ;
      
      IF NOT EXISTS(SELECT 1 FROM `conta` WHERE Descricao = @descricao) THEN
        INSERT INTO `conta` (`IdTipoConta`, `Descricao`) VALUES (@idTipoConta, @descricao);
      
        SET @contas = @contas + 1;
        SET @vezes = @vezes + 1;
      
        IF @contas >= @max_conta THEN
          LEAVE loop2;
        END IF;
      END IF;
  
      SET @idConta = @idConta + 1;
    END LOOP loop2;
  END WHILE;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `FillTiposConta` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`angelo`@`%` PROCEDURE `FillTiposConta`()
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `InsertConta` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`angelo`@`localhost` PROCEDURE `InsertConta`(
  IN p_IdTipoConta INT,
  IN p_Descricao VARCHAR(45),
  IN p_EhCredito TINYINT
)
BEGIN
  IF NOT (SELECT 1 FROM `TipoConta` WHERE `Id` = p_IdTipoConta) THEN
    SIGNAL SQLSTATE '42000'
    SET MESSAGE_TEXT = 'Tipo de Conta não existe.';
  END IF;

  IF (SELECT 1 FROM `conta` WHERE `IdTipoConta` = p_IdTipoConta AND `Descricao` = TRIM(p_Descricao)) THEN
    SIGNAL SQLSTATE '42000'
    SET MESSAGE_TEXT = 'Conta já existe para esse Tipo de Conta.';
  END IF;

  INSERT INTO `conta` (`IdTipoConta`, `Descricao`, `EhCredito`)
  VALUES (p_IdTipoConta, TRIM(p_Descricao), COALESCE(p_EhCredito, 0));
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `InsertLancto` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`angelo`@`localhost` PROCEDURE `InsertLancto`(
  IN p_IdConta INT,
  IN p_Descricao VARCHAR(100),
  IN p_VlLancto DECIMAL(15,2),
  IN p_DtVencto DATE,
  IN p_Parcelas INT, -- número de registros a serem criados no lote
  IN p_Intervalo CHAR(1), -- (U)nico, (S)emanal, (Q)uinzenal, (M)ensal, (B)imestral, (T)rimestral, (4) Quadrimestral, (6) Semestral, (A)nual
  IN p_DiasUteis INT,
  IN p_GerarParcela INT,
  IN p_DifFinal INT,
  IN p_Baixa INT,
  OUT p_Id INT
)
BEGIN
  DECLARE v_DtReal DATE DEFAULT p_DtVencto;
  DECLARE v_Parcela INT DEFAULT 1;
  DECLARE v_Feriado INT;
  DECLARE v_DiaUtil INT DEFAULT 0;
  DECLARE v_DiaVencto INT DEFAULT DAYOFMONTH(p_DtVencto);
  DECLARE v_ValParcela DECIMAL(15,2) DEFAULT p_VlLancto;
  DECLARE v_ValParcPri DECIMAL(15,2) DEFAULT p_VlLancto;
  DECLARE v_ValParcUlt DECIMAL(15,2) DEFAULT p_VlLancto;
  DECLARE v_p DECIMAL(15,2) DEFAULT 0;
  DECLARE v_r DECIMAL(15,2) DEFAULT 0;
  DECLARE v_Parcelas INT DEFAULT p_Parcelas;
  DECLARE v_FlPago INT DEFAULT 0;
  DECLARE v_DtVencto DATE;
  
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    GET DIAGNOSTICS CONDITION 1
      @sqlstate = RETURNED_SQLSTATE,
      @errno = MYSQL_ERRNO,
      @text = MESSAGE_TEXT;

    -- SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
    SET @full_error = COALESCE(@text, "Not defined");

    ROLLBACK;

    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = @full_error;
  END;

  START TRANSACTION;

  IF (SELECT COUNT(1) FROM `conta` WHERE `Id` = p_IdConta) = 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Conta não existe';
  END IF;

  IF p_Descricao IS NULL OR TRIM(p_Descricao) = '' THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Descrição não informada';
  END IF;

  IF p_VlLancto IS NULL OR p_VlLancto <= 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Valor do Lançamento inválido';
  END IF;

  IF p_DtVencto IS NULL  THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Data de vencimento inválido.';
  END IF;

  SET p_Intervalo = UPPER(p_Intervalo);

  IF p_Parcelas IS NULL OR p_Parcelas < 0 THEN
    SET p_Parcelas = 1;
  END IF;

  IF p_Parcelas IN (0, 1) THEN -- Lançamento de crédito ou de débito baixa automática
    SET p_Intervalo = 'U'; -- Único
    SET p_DiasUteis = 0; -- Ajuste para conformidade
  ELSEIF p_Intervalo NOT IN ('S', 'Q', 'M', 'B', 'T', '4', '6', 'A') THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Intervalo inválido.';
  END IF;

  -- Ajusta dias úteis, caso seja informado errado
  IF p_DiasUteis NOT IN (0, 1) THEN
    SET p_DiasUteis = 0;
  END IF;

  SET p_id = 0;
  SET p_Descricao = TRIM(p_Descricao); -- Elimina espaços na descrição

  INSERT INTO `lancto` (`IdConta`, `Parcelas`, `TpVencto`, `FlgDiasUteis`)
  VALUES (p_IdConta, p_Parcelas, p_Intervalo, p_DiasUteis);

  SET p_id = LAST_INSERT_ID(); -- Retorna o ID do registro criado
  
  -- Tratamento de cálculo de parcelas, quando informado o valor total do débito
  IF p_Parcelas > 1 AND p_GerarParcela <> 0 THEN
    SET v_ValParcela = ROUND(p_VlLancto / p_Parcelas, 2);
    SET v_r = p_VlLancto - (v_ValParcela * (p_Parcelas - 1));
    
    IF p_DifFinal = 0 THEN -- Se o resto da divisão das parcelas devem ser aplicado na última
      SET v_ValParcPri = v_ValParcela;
      SET v_ValParcUlt = v_r;
	ELSE -- Se o resto da divisão das parcelas devem ser aplicado na primeira
      SET v_ValParcPri = v_r;
      SET v_ValParcUlt = v_ValParcela;
    END IF;
  END IF;

  IF p_DiasUteis <> 0 THEN
    CALL `DiasUteis`(v_DtReal);
  END IF;

  insert_loop: LOOP
    -- Ajuste do valor das parcelas, primeira e última
    IF v_Parcelas > 1 THEN
      IF p_Parcelas = v_parcelas THEN
        SET p_VlLancto = v_ValParcUlt;
      ELSEIF p_Parcelas = 1 THEN
        SET p_VlLancto = v_ValParcPri;
      ELSE
        SET p_VlLancto = v_ValParcela;
      END IF;
	END IF;

    IF p_Parcelas = 0 OR (p_Parcelas = 1 AND p_Baixa = 1) THEN -- Lançamento de crédito OU Baixa automática
      SET v_FlPago = 1;
      SET v_DtVencto = v_DtReal;
    END IF;

    INSERT INTO `lanctoitens` (`IdLancto`, `Parcela`, `Descricao`, `DtVencto`, `VlLancto`, `FlPago`, `DtPagto`)
    VALUES (p_Id, v_Parcela, p_Descricao, v_DtReal, p_VlLancto, v_FlPago, v_DtVencto);

    -- Se não existir um registro na data da parcela em "saldo", cria e inicializa o valor (saldo do dia anterior)
    IF NOT EXISTS (SELECT 1 FROM `saldo` WHERE `Data` = v_DtReal) THEN
      SET v_p = 0;
      
      -- Obtém o saldo da data anterior
      SELECT `Valor`
      INTO v_p
      FROM `saldo`
      WHERE `Data` < v_DtReal
      ORDER BY `Data` DESC
      LIMIT 1;
     
      INSERT INTO `saldo` (`Data`, `Valor`)
      VALUES (v_DtReal, COALESCE(v_p, 0));
    END IF;

    -- Ajusta o valor dos registros atual e futuro com os saldos
    UPDATE `saldo`
    SET Valor = Valor + p_VlLancto * CASE WHEN p_Parcelas = 0 THEN 1 ELSE -1 END
    WHERE `Data` >= v_DtReal;
    
    -- Se for um crédito, então atualiza também a tabela "efetivado"
    IF p_Parcelas = 0 OR (p_Parcelas = 1 AND p_Baixa = 1) THEN
      IF NOT EXISTS (SELECT 1 FROM `efetivado` WHERE `Data` = v_DtReal) THEN
        SET v_p = 0;
      
        -- Obtém o saldo da data anterior
        SELECT `Valor`
        INTO v_p
        FROM `efetivado`
        WHERE `Data` < v_DtReal
        ORDER BY `Data` DESC
        LIMIT 1;
     
        INSERT INTO `efetivado` (`Data`, `Valor`)
        VALUES (v_DtReal, COALESCE(v_p, 0));
      END IF;

      UPDATE `efetivado`
      SET Valor = Valor + p_VlLancto
      WHERE `Data` >= v_DtReal;
	ELSEIF p_Parcelas = 1 AND p_Baixa <> 0 THEN
      CALL `CloseLancto` (p_Id, 1, v_DtReal, 0, 0);
    END IF;

    SET p_Parcelas = p_Parcelas - 1;

    IF p_Parcelas <= 0 THEN -- < 0 => registro de crédito. = 0 => registro de débito
      LEAVE insert_loop;
    END IF;

    SET v_Parcela = v_Parcela + 1;

    -- Calcula a próxima data de vencimento
    SET p_DtVencto = CASE p_Intervalo
                          WHEN 'S' THEN ADDDATE(p_DtVencto, INTERVAL 1 WEEK)
                          WHEN 'Q' THEN ADDDATE(p_DtVencto, INTERVAL 2 WEEK)
                          WHEN 'B' THEN ADDDATE(p_DtVencto, INTERVAL 2 MONTH)
                          WHEN 'T' THEN ADDDATE(p_DtVencto, INTERVAL 3 MONTH)
                          WHEN '4' THEN ADDDATE(p_DtVencto, INTERVAL 4 MONTH)
                          WHEN '6' THEN ADDDATE(p_DtVencto, INTERVAL 6 MONTH)
                          WHEN 'A' THEN ADDDATE(p_DtVencto, INTERVAL 1 YEAR)
                          ELSE ADDDATE(p_DtVencto, INTERVAL 1 MONTH)
                     END;

    IF v_DiaVencto > 28 AND DAYOFMONTH(p_DtVencto) <> v_DiaVencto AND p_DtVencto <> LAST_DAY(p_DtVencto) THEN
      IF v_DiaVencto > DAYOFMONTH(LAST_DAY(p_DtVencto)) THEN
        SET p_DtVencto = LAST_DAY(p_DtVencto);
      ELSE
        SET p_DtVencto = STR_TO_DATE(CONCAT(YEAR(p_DtVencto), ',', MONTH(p_DtVencto), ',', v_DiaVencto), '%Y,%m,%d');
      END IF;
    END IF;

    SET v_DtReal = p_DtVencto;

    -- Quando o movimento for em dias úteis, ajusta a data
    IF p_DiasUteis <> 0 THEN
      CALL `DiasUteis`(v_DtReal);
    END IF;
  END LOOP insert_loop;

  COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `InsertTipoConta` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`angelo`@`localhost` PROCEDURE `InsertTipoConta`(
  IN p_Descricao VARCHAR(45),
  IN p_EhCredito TINYINT
)
BEGIN
  IF p_Descricao IS NULL OR TRIM(p_Descricao) = '' THEN
    SIGNAL SQLSTATE '42101'
    SET MESSAGE_TEXT = 'Descrição não informada.';
  END IF;

  IF (SELECT 1 FROM `TipoConta` WHERE `Descricao` = TRIM(p_Descricao)) THEN
    SIGNAL SQLSTATE '42001'
    SET MESSAGE_TEXT = 'Já existe.';
  END IF;

  INSERT INTO `TipoConta` (`Descricao`, `EhCredito`) VALUES (TRIM(p_Descricao), COALESCE(p_EhCredito, 0));
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `PreencherCalendario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`angelo`@`localhost` PROCEDURE `PreencherCalendario`(p_Ano INT)
BEGIN
  DECLARE v_DataAtual DATE;
  DECLARE v_DataInicial DATE;
  DECLARE v_DataFinal DATE;
  DECLARE v_DataPascoa DATE;
  DECLARE v_Carnaval DATE;
  DECLARE v_SextaSanta DATE;
  DECLARE v_CorpusChristi DATE;

  IF p_Ano < 1000 THEN
    SET p_Ano = p_Ano + 2000;
  END IF;

  SET v_DataInicial = CONCAT(p_Ano, '-01-31');
  SET v_DataFinal = CONCAT(p_Ano, '-12-31');
  SET v_DataAtual = v_DataInicial;

  DELETE FROM `calendario` WHERE data BETWEEN v_DataInicial AND v_DataFinal;
  DELETE FROM `feriadosmoveis` WHERE Ano = p_Ano AND Estado = '--';

  WHILE v_DataAtual < v_DataFinal DO
      INSERT INTO `calendario` (`Data`, `DiaUtil`)
      VALUES (v_DataAtual, CASE DAYOFWEEK(v_DataAtual) WHEN 1 THEN 0 WHEN 7 then 0 ELSE 1 END);

      SET v_DataAtual = ADDDATE(v_DataAtual, INTERVAL 1 DAY);
  END WHILE;

  SET v_DataPascoa = Pascoa(p_Ano);
  SET v_Carnaval = SUBDATE(v_DataPascoa, INTERVAL 47 DAY);
  SET v_SextaSanta = SUBDATE(v_DataPascoa, INTERVAL 2 DAY);
  SET v_CorpusChristi = ADDDATE(v_DataPascoa, INTERVAL 60 DAY);

  INSERT INTO `feriadosmoveis` (`Ano`, `Mes`, `Dia`, `Feriado`)
  VALUES (YEAR(v_Carnaval), MONTH(v_Carnaval), DAYOFMONTH(v_Carnaval), 'Carnaval');

  INSERT INTO `feriadosmoveis` (`Ano`, `Mes`, `Dia`, `Feriado`)
  VALUES (YEAR(v_SextaSanta), MONTH(v_SextaSanta), DAYOFMONTH(v_SextaSanta), 'Sexta-feira Santa');

  INSERT INTO `feriadosmoveis` (`Ano`, `Mes`, `Dia`, `Feriado`)
  VALUES (YEAR(v_CorpusChristi), MONTH(v_CorpusChristi), DAYOFMONTH(v_CorpusChristi), 'Corpus Christi');

  UPDATE calendario c
  INNER JOIN feriados f
    ON f.Dia = c.Dia
   AND f.Mes = c.Mes
  SET c.Feriado = 1
  WHERE data BETWEEN v_DataInicial AND v_DataFinal;

  UPDATE calendario c
  INNER JOIN feriadosmoveis f
    ON f.Ano = c.Ano
   AND f.Dia = c.Dia
   AND f.Mes = c.Mes
   AND f.Estado IN ('--', 'SP')
  SET c.Feriado = 1
  WHERE data BETWEEN v_DataInicial AND v_DataFinal;

  -- Carnaval, Sexta-Feira Santa, Corpus Christi
  -- UPDATE calendario c
  -- SET c.Feriado = 1
  -- WHERE data IN (SUBDATE(v_DataPascoa, INTERVAL 47 DAY), SUBDATE(v_DataPascoa, INTERVAL 2 DAY), ADDDATE(v_DataPascoa, INTERVAL 60 DAY));

  UPDATE calendario c
  INNER JOIN feriadosestados f
    ON f.Dia = c.Dia
   AND f.Mes = c.Mes
   AND f.Estado = 'SP'
  SET c.Feriado = 1
  WHERE data BETWEEN v_DataInicial AND v_DataFinal;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ReopenLancto` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`angelo`@`localhost` PROCEDURE `ReopenLancto`(
  IN p_Id INT,
  IN p_Parcela INT
)
BEGIN
  DECLARE v_VlLancto DECIMAL(15,2);
  DECLARE v_VlTotal DECIMAL(15,2);
  DECLARE v_p DECIMAL(15,2);
  DECLARE v_DtVencto DATE;
  DECLARE v_DtPagto DATE;
  DECLARE v_FlPago INT;
  
  IF NOT (SELECT 1 FROM `lancto` WHERE `Id` = p_Id) THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Lançamento não existe';
  END IF;

  SELECT VlLancto, VlTotal, DtVencto, DtPagto, FlPago INTO v_VlLancto, v_VlTotal, v_DtVencto, v_DtPagto, v_FlPago
  FROM `lanctoitens`
  WHERE `IdLancto` = p_Id
  AND `Parcela` = p_Parcela;

  IF FOUND_ROWS() = 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Lançamento não existe';
  END IF;

  IF v_FlPago <> 1 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Lançamento não está fechado';
  END IF;

  UPDATE `lanctoitens`
  SET `FlPago` = 0,
      `VlAcrescimo` = 0,
      `VlDesconto` = 0,
      `DtPagto` = NULL,
      `DtAlteracao` = CURRENT_TIMESTAMP
  WHERE `IdLancto` = p_Id
  AND `Parcela` = p_Parcela;

  UPDATE `efetivado`
  SET `Valor` = `Valor` + v_VlTotal
  WHERE `Data` >= v_DtPagto;
  
  DELETE FROM `efetivado`
  WHERE `Data` = v_DtPagto
  AND `Valor` = 0;

  UPDATE `saldo`
  SET `Valor` = `Valor` + (v_VlTotal - v_VlLancto)
  WHERE `Data` >= v_DtPagto;
  
  DELETE FROM `saldo`
  WHERE `Data` = v_DtPagto
  AND `Valor` = 0;

  -- Datas diferentes; ajusta saldos
  IF v_DtPagto <> v_DtVencto THEN
    UPDATE `saldo`
    SET `Valor` = `Valor` + v_VlLancto
    WHERE `Data` >= v_DtPagto;

    -- Deleta o registro se o saldo for igual a zero
    DELETE FROM `saldo`
    WHERE `Data` = v_DtPagto
    AND `Valor` = 0;

    -- Se não existir o registro de saldo na nova data, cria
    IF NOT EXISTS (SELECT 1 FROM `saldo` WHERE `Data` = v_DtVencto) THEN
      SET v_p = 0;

      -- Obtém o saldo da data anterior
      SELECT `Valor`
      INTO v_p
      FROM `saldo`
      WHERE `Data` < v_DtVencto
      ORDER BY `Data` DESC
      LIMIT 1;

      -- Adiciona-se o valor anterior, para não ajustar errado logo abaixo
      INSERT INTO `saldo` (`Data`, `Valor`)
      VALUES (v_DtVencto, COALESCE(v_p, 0));
    END IF;

    UPDATE `saldo`
    SET `Valor` = `Valor` - v_VlLancto
    WHERE `Data` >= v_DtVencto;
  END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateConta` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`angelo`@`localhost` PROCEDURE `UpdateConta`(
  IN p_Id INT,
  IN p_Descricao VARCHAR(45)
)
BEGIN
  DECLARE v_IdTipoConta INT;

  SELECT `IdTipoConta` INTO v_IdTipoConta
  FROM `conta`
  WHERE Id = p_Id;

  IF EXISTS (SELECT 1 FROM `conta` WHERE `IdTipoConta` = v_IdTipoConta AND `Id` <> p_Id AND `Descricao` = TRIM(p_Descricao)) THEN
    SIGNAL SQLSTATE '42000'
    SET MESSAGE_TEXT = 'Conta já existe.';
  END IF;

  UPDATE conta
  SET Descricao = p_Descricao,
      DtAlteracao = CURRENT_TIMESTAMP
  WHERE Id = p_Id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateLancto` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`angelo`@`localhost` PROCEDURE `UpdateLancto`(
  IN p_IdLancto INT,
  IN p_Parcela INT,
  IN p_Descricao VARCHAR(100),
  IN p_VlLancto DECIMAL(15,2),
  IN p_DtVencto DATETIME,
  IN p_flgUpdateAll INT
)
BEGIN
  DECLARE v_FlPago INT;
  DECLARE v_Parcelas INT;
  DECLARE v_DtVenctoAnt DATE;
  DECLARE v_VlLanctoAnt DECIMAL(15,2);
  DECLARE v_Dif DECIMAL(15,2);
  DECLARE v_p DECIMAL(15,2);

  SELECT `Parcelas`
  INTO v_Parcelas
  FROM `lancto`
  WHERE `Id` = p_IdLancto;

  IF FOUND_ROWS() = 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Lançamento não existe';
  END IF;

  SELECT `VlLancto`, `DtVencto`, `FlPago`
  INTO v_VlLanctoAnt, v_DtVenctoAnt, v_FlPago
  FROM `lanctoitens`
  WHERE `IdLancto` = p_IdLancto
    AND `Parcela` = p_Parcela;

  -- Análise somente para lançamentos de débito
  IF v_FlPago = 1 AND v_Parcelas > 0 THEN
    SIGNAL SQLSTATE '42003'
    SET MESSAGE_TEXT = 'Lançamento já fechado.';
  END IF;

  UPDATE `lanctoitens`
  SET `Descricao` = p_Descricao,
      `VlLancto` = p_VlLancto,
      `DtVencto` = p_DtVencto,
      `DtAlteracao` = CURRENT_TIMESTAMP
  WHERE `IdLancto` = p_IdLancto
    AND `Parcela` = p_Parcela;

  -- Só atualiza em registro de débito
  IF v_Parcelas > 0 AND p_flgUpdateAll <> 0 THEN
    UPDATE `lanctoitens`
    SET `Descricao` = p_Descricao,
        `DtAlteracao` = CURRENT_TIMESTAMP
    WHERE `IdLancto` = p_IdLancto
    AND `Parcela` <> p_Parcela;
  END IF;

  -- Valor diferente do anterior; ajusta saldo
  IF v_VlLanctoAnt <> p_VlLancto THEN
    SET v_Dif = (v_VlLanctoAnt - p_VlLancto) * CASE v_Parcelas WHEN 0 THEN 1 ELSE -1 END;

    UPDATE `saldo`
    SET `Valor` = `Valor` - v_Dif
    WHERE `Data` >= v_DtVenctoAnt;

    DELETE FROM `saldo`
    WHERE `Data` = v_DtVenctoAnt
    AND `Valor` = 0;

    -- Ajustes de lançamentos de crédito
    IF v_Parcelas = 0 THEN
      UPDATE `efetivado`
      SET `Valor` = `Valor` - v_Dif
      WHERE `Data` >= v_DtVenctoAnt;

      DELETE FROM `efetivado`
      WHERE `Data` = v_DtVenctoAnt
      AND `Valor` = 0;
    END IF;
  END IF;
  
  -- Datas diferentes; ajusta saldos
  IF v_DtVenctoAnt <> p_DtVencto THEN
    -- Ajusta o saldo da data em que o lançamento pertencia
    -- Subtrai se o valor de crédito ou soma, se o valor é de débito
    SET v_Dif = p_VlLancto * CASE v_Parcelas WHEN 0 THEN 1 ELSE -1 END;

    UPDATE `saldo`
    SET `Valor` = `Valor` - v_Dif
    WHERE `Data` >= v_DtVenctoAnt;

    -- Deleta o registro se o saldo for igual a zero
    DELETE FROM `saldo`
    WHERE `Data` = v_DtVenctoAnt
    AND `Valor` = 0;

    -- Se não existir o registro de saldo na nova data, cria
    IF NOT EXISTS (SELECT 1 FROM `saldo` WHERE `Data` = p_DtVencto) THEN
      SET v_p = 0;

      -- Obtém o saldo da data anterior
      SELECT `Valor`
      INTO v_p
      FROM `saldo`
      WHERE `Data` < p_DtVencto
      ORDER BY `Data` DESC
      LIMIT 1;

      -- Adiciona-se o valor anterior, para não ajustar errado logo abaixo
      INSERT INTO `saldo` (`Data`, `Valor`)
      VALUES (p_DtVencto, COALESCE(v_p, 0));
    END IF;

    UPDATE `saldo`
    SET `Valor` = `Valor` + p_VlLancto * CASE v_Parcelas WHEN 0 THEN 1 ELSE -1 END
    WHERE `Data` >= p_DtVencto;

    IF v_Parcelas = 0 THEN
      UPDATE `efetivado`
      SET `Valor` = `Valor` - v_Dif
      WHERE `Data` >= v_DtVenctoAnt;

      -- Deleta o registro se o saldo for igual a zero
      DELETE FROM `efetivado`
      WHERE `Data` = v_DtVenctoAnt
      AND `Valor` = 0;

      -- Se não existir o registro de saldo na nova data, cria
      IF NOT EXISTS (SELECT 1 FROM `efetivado` WHERE `Data` = p_DtVencto) THEN
        SET v_p = 0;

        -- Obtém o saldo da data anterior
        SELECT `Valor`
        INTO v_p
        FROM `efetivado`
        WHERE `Data` < p_DtVencto
        ORDER BY `Data` DESC
        LIMIT 1;

        -- Adiciona-se o valor anterior, para não ajustar errado logo abaixo
        INSERT INTO `efetivado` (`Data`, `Valor`)
        VALUES (p_DtVencto, COALESCE(v_p, 0));
      END IF;

      UPDATE `efetivado`
      SET `Valor` = `Valor` + p_VlLancto * CASE v_Parcelas WHEN 0 THEN 1 ELSE -1 END
      WHERE `Data` >= p_DtVencto;
    END IF;
  END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateTipoConta` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`angelo`@`localhost` PROCEDURE `UpdateTipoConta`(
  IN p_Id INT,
  IN p_Descricao VARCHAR(45)
)
BEGIN
  IF p_Id IS NULL THEN
    SIGNAL SQLSTATE '42100'
    SET MESSAGE_TEXT = 'Id não informado.';
  END IF;

  IF p_Descricao IS NULL OR TRIM(p_Descricao) = '' THEN
    SIGNAL SQLSTATE '42101'
    SET MESSAGE_TEXT = 'Descrição não informada.';
  END IF;

  IF (SELECT 1 FROM `TipoConta` WHERE `Id` <> p_Id AND `Descricao` = TRIM(p_Descricao)) THEN
    SIGNAL SQLSTATE '42001'
    SET MESSAGE_TEXT = 'Já existe.';
  END IF;

  IF NOT (SELECT 1 FROM `TipoConta` WHERE `Id` = p_Id) THEN
    SIGNAL SQLSTATE '42000'
    SET MESSAGE_TEXT = 'Não existe.';
  END IF;

  UPDATE `TipoConta`
  SET `Descricao` = TRIM(p_Descricao),
      `DtAlteracao` = CURRENT_TIMESTAMP
  WHERE `Id` = p_Id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-15 23:40:33
