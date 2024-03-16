CREATE DATABASE  IF NOT EXISTS `contas_prod` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_bin */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `contas_prod`;
-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: contas_dev
-- ------------------------------------------------------
-- Server version	8.0.32

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
-- Table structure for table `conta`
--

DROP TABLE IF EXISTS `conta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conta` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `IdTipoConta` int NOT NULL,
  `Descricao` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `DtCriacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `DtAlteracao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `ui_conta_nm` (`Id`,`IdTipoConta`,`Descricao`),
  KEY `idx_conta_tipoconta` (`IdTipoConta`) /*!80000 INVISIBLE */,
  KEY `idx_conta_Id_IdTipoConta` (`IdTipoConta`,`Id`),
  CONSTRAINT `fk_conta_tipoconta` FOREIGN KEY (`IdTipoConta`) REFERENCES `tipoconta` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=800 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lancto`
--

DROP TABLE IF EXISTS `lancto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lancto` (
  `Id` int unsigned NOT NULL AUTO_INCREMENT,
  `IdConta` int NOT NULL,
  `DtLancto` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Descricao` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `VlLancto` double NOT NULL,
  `VlAcrescimo` double NOT NULL DEFAULT '0',
  `VlDesconto` double NOT NULL DEFAULT '0',
  `VlTotal` double GENERATED ALWAYS AS (((`VlLancto` + `VlAcrescimo`) - `VlDesconto`)) VIRTUAL,
  `DtVencto` datetime NOT NULL,
  `DtPagto` datetime DEFAULT NULL,
  `FlPago` tinyint NOT NULL DEFAULT '0',
  `IdLote` varchar(37) COLLATE utf8mb4_bin NOT NULL,
  `DtCriacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `DtAlteracao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `ui_lancto_conta` (`IdConta`,`DtLancto`),
  UNIQUE KEY `ui_lancto_IdLote` (`IdLote`,`DtVencto`) /*!80000 INVISIBLE */,
  KEY `fk_lancto_conta_idx` (`IdConta`),
  CONSTRAINT `fk_lancto_conta` FOREIGN KEY (`IdConta`) REFERENCES `conta` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tipoconta`
--

DROP TABLE IF EXISTS `tipoconta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipoconta` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Descricao` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `DtCriacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `DtAlteracao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `ui_tipoconta_nm` (`Descricao`)
) ENGINE=InnoDB AUTO_INCREMENT=2784 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'contas_dev'
--

--
-- Dumping routines for database 'contas_dev'
--
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
  IN p_DtPagto DATETIME,
  IN p_VlAcrescimo DOUBLE,
  IN p_VlDesconto DOUBLE
)
BEGIN
  IF NOT (SELECT 1 FROM `lancto` WHERE `Id` = p_Id) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Lançamento não existe';
  END IF;

  IF p_VlAcrescimo < 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Valor do acréscimo inválido';
  END IF;

  IF p_VlDesconto < 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Valor do desconto inválido';
  END IF;

  UPDATE `lancto`
  SET `DtPagto` = p_DtPagto,
      `VlAcrescimo` = p_VlAcrescimo,
      `VlDesconto` = p_VlDesconto,
      `FlPago` = 1,
      `DtAlteracao` = CURRENT_TIMESTAMP
  WHERE `Id` = p_Id;
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
  OUT p_IdLote VARCHAR(37),
  OUT p_DtVencto DATETIME
)
BEGIN
  SELECT IdLote, DtVencto INTO p_IdLote, p_DtVencto
  FROM `lancto`
  WHERE Id = p_Id;

  DELETE FROM `lancto`
  WHERE `Id` = p_Id;
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
CREATE DEFINER=`angelo`@`localhost` PROCEDURE `FillTiposConta`()
BEGIN
  SET @idTipoConta = 1;
  SET @vezes = 0;
  
  DELETE FROM `tipoconta`
  WHERE Id NOT IN (SELECT DISTINCT IdTipoConta from `conta`);
  
  WHILE @vezes < 150 DO 
    SET @tiposConta = 0;
    SET @max_conta = FLOOR(RAND() * 15 + 1);
    
    loop2: LOOP
      SET @descricao = CONCAT('Conta ', LPAD(TRIM(CONVERT(@idTipoConta, CHAR(3))), 3, '0'))      ;
      
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
  IN p_Descricao VARCHAR(45)
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

  INSERT INTO `conta` (`IdTipoConta`, `Descricao`)
  VALUES (p_IdTipoConta, TRIM(p_Descricao));
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
  IN p_VlLancto DOUBLE,
  IN p_DtVencto DATETIME,
  OUT p_Id INT,
  INOUT p_IdLote VARCHAR(37)
)
BEGIN
  DECLARE Cnt INT;

  SELECT COUNT(1) INTO Cnt FROM `Conta` WHERE `Id` = p_IdConta;

  IF Cnt = 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Conta não existe';
  END IF;

  IF p_Descricao IS NULL OR TRIM(p_Descricao) = '' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Descrição não informada';
  END IF;

  IF p_VlLancto <= 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Valor do Lançamento inválido';
  END IF;

  IF p_IdLote IS NULL THEN
    SET p_IdLote = UUID();
  END IF;

  INSERT INTO `lancto` (`IdConta`, `Descricao`, `VlLancto`, `DtVencto`, `IdLote`)
  VALUES (p_IdConta, p_Descricao, p_VlLancto, p_DtVencto, p_IdLote);
  
  set p_id = LAST_INSERT_ID();
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
  IN p_Descricao VARCHAR(45)
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

  INSERT INTO `TipoConta` (`Descricao`) VALUES (TRIM(p_Descricao));
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
  IN p_Id INT
)
BEGIN
  IF NOT (SELECT 1 FROM `lancto` WHERE `Id` = p_Id) THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Lançamento não existe';
  END IF;

  IF NOT (SELECT 1 FROM `lancto` WHERE `Id` = p_Id AND FlPago = 1) THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Lançamento não está fechado';
  END IF;

  UPDATE `lancto`
  SET `FlPago` = 0,
      `DtAlteracao` = CURRENT_TIMESTAMP
  WHERE `Id` = p_Id;
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
  IN p_Id INT,
  IN p_Descricao VARCHAR(100),
  IN p_DtLancto DATETIME,
  IN p_VlLancto DOUBLE,
  IN p_DtVencto DATETIME,
  OUT p_IdLote VARCHAR(37)
)
BEGIN
  DECLARE v_FlPago INT;

  SELECT FlPago, IdLote INTO v_FlPago, p_IdLote
  FROM `lancto`
  WHERE Id = p_Id;

  IF v_FlPago = 1 THEN
    SIGNAL SQLSTATE '42003'
    SET MESSAGE_TEXT = 'Lançamento já fechado.';
  END IF;

  UPDATE `lancto`
  SET `Descricao` = p_Descricao,
      `VlLancto` = p_VlLancto,
      `DtLancto` = p_DtLancto,
      `DtVencto` = p_DtVencto,
      `DtAlteracao` = CURRENT_TIMESTAMP
  WHERE `Id` = p_Id;
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

-- Dump completed on 2024-03-16 13:22:37
