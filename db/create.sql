-- MySQL Workbench Synchronization
-- Generated: 2024-02-22 23:36
-- Model: New Model
-- Version: 1.0
-- Project: Name of the project
-- Author: Angelo

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE SCHEMA IF NOT EXISTS `contas` DEFAULT CHARACTER SET utf8 ;

CREATE TABLE IF NOT EXISTS `contas`.`tipoconta` (
  `idtipoconta` INT(11) NOT NULL AUTO_INCREMENT,
  `nmtipoconta` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idtipoconta`),
  UNIQUE INDEX `ui_tipoconta_nm` (`nmtipoconta` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `contas`.`conta` (
  `idconta` INT(11) NOT NULL AUTO_INCREMENT,
  `idtipoconta` INT(11) NOT NULL,
  `nmconta` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idconta`),
  UNIQUE INDEX `ui_conta_nm` (`idconta` ASC, `idtipoconta` ASC, `nmconta` ASC) VISIBLE,
  INDEX `idx_conta_tipoconta` (`idtipoconta` ASC) INVISIBLE,
  CONSTRAINT `fk_conta_tipoconta`
    FOREIGN KEY (`idtipoconta`)
    REFERENCES `contas`.`tipoconta` (`idtipoconta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `contas`.`lancto` (
  `idlancto` INT(10) UNSIGNED NOT NULL,
  `idconta` INT(11) NOT NULL,
  `dtlancto` DATETIME NOT NULL,
  `vllancto` REAL NOT NULL,
  `dtvencto` DATE NOT NULL,
  `vlacrescimo` REAL NOT NULL DEFAULT 0,
  `vldesconto` REAL NOT NULL DEFAULT 0,
  `vltotal` REAL NOT NULL,
  PRIMARY KEY (`idlancto`),
  INDEX `fk_lancto_conta_idx` (`idconta` ASC) VISIBLE,
  CONSTRAINT `fk_lancto_conta`
    FOREIGN KEY (`idconta`)
    REFERENCES `contas`.`conta` (`idconta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
