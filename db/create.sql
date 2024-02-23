-- MySQL Workbench Synchronization
-- Generated: 2024-02-22 23:46
-- Model: New Model
-- Version: 1.0
-- Project: Name of the project
-- Author: Angelo

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

ALTER SCHEMA `contas`  DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci ;

ALTER TABLE `contas`.`conta` 
DROP FOREIGN KEY `fk_conta_tipoconta`;

ALTER TABLE `contas`.`lancto` 
DROP FOREIGN KEY `fk_lancto_conta`;

ALTER TABLE `contas`.`tipoconta` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ,
ADD COLUMN `dtcriacao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `nmtipoconta`,
ADD COLUMN `dtalteracao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `dtcriacao`;

ALTER TABLE `contas`.`conta` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ,
ADD COLUMN `dtcriacao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `nmconta`,
ADD COLUMN `dtalteracao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `dtcriacao`;

ALTER TABLE `contas`.`lancto` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ,
ADD COLUMN `dtpagto` DATETIME NULL DEFAULT NULL AFTER `dtvencto`,
CHANGE COLUMN `dtlancto` `dtlancto` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
CHANGE COLUMN `vllancto` `vllancto` REAL NOT NULL ,
CHANGE COLUMN `dtvencto` `dtvencto` DATETIME NOT NULL ,
CHANGE COLUMN `vlacrescimo` `vlacrescimo` REAL NOT NULL DEFAULT 0 ,
CHANGE COLUMN `vldesconto` `vldesconto` REAL NOT NULL DEFAULT 0 ,
CHANGE COLUMN `vltotal` `vltotal` REAL NOT NULL ,
ADD UNIQUE INDEX `ui_lancto_conta` (`idconta` ASC, `dtlancto` ASC) VISIBLE;
;

ALTER TABLE `contas`.`conta` 
ADD CONSTRAINT `fk_conta_tipoconta`
  FOREIGN KEY (`idtipoconta`)
  REFERENCES `contas`.`tipoconta` (`idtipoconta`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `contas`.`lancto` 
ADD CONSTRAINT `fk_lancto_conta`
  FOREIGN KEY (`idconta`)
  REFERENCES `contas`.`conta` (`idconta`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
