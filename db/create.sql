-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: contas
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
  `Descricao` varchar(45) NOT NULL,
  `DtCriacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `DtAlteracao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `ui_conta_nm` (`Id`,`IdTipoConta`,`Descricao`),
  KEY `idx_conta_tipoconta` (`IdTipoConta`) /*!80000 INVISIBLE */,
  KEY `idx_conta_Id_IdTipoConta` (`IdTipoConta`,`Id`),
  CONSTRAINT `fk_conta_tipoconta` FOREIGN KEY (`IdTipoConta`) REFERENCES `tipoconta` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lancto`
--

DROP TABLE IF EXISTS `lancto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lancto` (
  `Id` int unsigned NOT NULL,
  `IdConta` int NOT NULL,
  `DtLancto` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Descricao` varchar(100) COLLATE utf8mb3_bin NOT NULL,
  `VlLancto` double NOT NULL,
  `VlAcrescimo` double NOT NULL DEFAULT '0',
  `VlDesconto` double NOT NULL DEFAULT '0',
  `VlTotal` double GENERATED ALWAYS AS (((`VlLancto` + `VlAcrescimo`) - `VlDesconto`)) VIRTUAL,
  `DtVencto` datetime NOT NULL,
  `DtPagto` datetime DEFAULT NULL,
  `FlPago` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `ui_lancto_conta` (`IdConta`,`DtLancto`),
  KEY `fk_lancto_conta_idx` (`IdConta`),
  CONSTRAINT `fk_lancto_conta` FOREIGN KEY (`IdConta`) REFERENCES `conta` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tipoconta`
--

DROP TABLE IF EXISTS `tipoconta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipoconta` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Descricao` varchar(45) CHARACTER SET utf8mb3 NOT NULL,
  `DtCriacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `DtAlteracao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `ui_tipoconta_nm` (`Descricao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'contas'
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
  p_Id INT,
  p_DtPagto DATETIME,
  p_VlAcrescimo DOUBLE,
  p_VlDesconto DOUBLE
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
CREATE DEFINER=`angelo`@`localhost` PROCEDURE `DeleteConta`(p_Id INT)
BEGIN
  DECLARE EXIT HANDLER FOR SQLSTATE '42000'
    SELECT 'Conta não pode ser excluída.';

  IF (SELECT 1 FROM `lancto` WHERE `IdConta` = p_Id) THEN
    CALL raise_error;
  END IF;

  DELETE FROM `Conta`
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
  p_Id INT
)
BEGIN
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
CREATE DEFINER=`angelo`@`localhost` PROCEDURE `DeleteTipoConta`(p_Id INT)
BEGIN
  DECLARE EXIT HANDLER FOR SQLSTATE '42000'
    SELECT 'Tipo de Conta não pode ser excluída.';

  IF (SELECT 1 FROM `conta` WHERE `IdTipoConta` = p_Id) THEN
    CALL raise_error;
  END IF;

  DELETE FROM `TipoConta`
  WHERE `Id` = p_Id;
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
  p_IdTipoConta INT, 
  p_Descricao VARCHAR(45)
)
BEGIN
  IF NOT (SELECT 1 FROM `TipoConta` WHERE `Id` = p_IdTipoConta) THEN
    SIGNAL SQLSTATE '42000'
    SET MESSAGE_TEXT = 'Tipo de Conta não existe.';
  END IF;

  IF (SELECT 1 FROM `conta` WHERE `IdTipoConta` = p_IdTipoConta AND `Descricao` = TRIM (p_Descricao)) THEN
    SIGNAL SQLSTATE '42000'
    SET MESSAGE_TEXT = 'Conta já existe para esse Tipo de Conta.';
  END IF;

  INSERT INTO `conta` (`IdTipoConta`, `Descricao`)
  VALUES (p_IdTipoConta, TRIM (p_Descricao));
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
  p_IdConta INT,
  p_Descricao VARCHAR(100),
  p_VlLancto DOUBLE, 
  p_DtVencto DATETIME
)
BEGIN
  DECLARE Cnt INT;

  SELECT COUNT(1) INTO Cnt FROM `Conta` WHERE `IdConta` = p_IdConta;

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

  INSERT INTO `lancto` (`IdConta`, `Descricao`, `VlLancto`, `DtVencto`)
  VALUES (p_IdConta, p_Descricao, p_VlLancto, p_DtVencto);
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
  IF (SELECT 1 FROM `TipoConta` WHERE `Descricao` = TRIM(p_Descricao)) THEN
    SIGNAL SQLSTATE '42000'
    SET MESSAGE_TEXT = 'Tipo de Conta já existe.';
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
  p_Id INT
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
  p_Id INT,
  p_Descricao VARCHAR(45)
)
BEGIN
  DECLARE v_IdTipoConta INT;
  
  SELECT IdTipoConta INTO v_IdTipoConta
  WHERE Id = p_Id;
  
  IF (SELECT 1 FROM `conta` WHERE `IdTipoConta` = v_IdTipoConta AND `Id` <> p_Id AND `Descricao` = TRIM (p_Descricao)) THEN
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
CREATE DEFINER=`angelo`@`localhost` PROCEDURE `UpdateLancto`()
BEGIN
  UPDATE `lancto`
  SET `VlLancto` = p_VlLancto,
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
  IF (SELECT 1 FROM `TipoConta` WHERE `Id` <> p_Id AND `Descricao` = TRIM(p_Descricao)) THEN
    SIGNAL SQLSTATE '42000'
    SET MESSAGE_TEXT = 'Tipo de Conta já existe.';
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

-- Dump completed on 2024-02-23 18:13:19
