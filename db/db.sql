CREATE DATABASE IF NOT EXISTS teleperformance;

USE teleperformance;

CREATE TABLE users (
	id INT(11) NOT NULL AUTO_INCREMENT,
    idtwitch VARCHAR(20) DEFAULT NULL,
    username VARCHAR(45) DEFAULT NULL,
	PRIMARY KEY(id)
);

ALTER TABLE `teleperformance`.`users` 
CHANGE COLUMN `idtwitch` `idtwitch` VARCHAR(20) NOT NULL ,
CHANGE COLUMN `username` `username` VARCHAR(45) NOT NULL ,
ADD UNIQUE INDEX `idtwitch_UNIQUE` (`idtwitch` ASC);
