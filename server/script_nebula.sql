-- -----------------------------------------------------
-- Schema NEBULA
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `NEBULA` ;

-- -----------------------------------------------------
-- Schema NEBULA
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `NEBULA` DEFAULT CHARACTER SET utf8 ;
USE `NEBULA` ;

-- -----------------------------------------------------
-- Table `NEBULA`.`usuario`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `NEBULA`.`usuario` ;

CREATE TABLE IF NOT EXISTS `NEBULA`.`usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `user` VARCHAR(45) NOT NULL,
  `pontos` INT NOT NULL DEFAULT 0,
  `colocacao` INT NOT NULL,
  `icon` TEXT NOT NULL,
  `biografia` TEXT NULL,
  `progresso1` INT NOT NULL DEFAULT 0,
  `progresso2` INT NOT NULL DEFAULT 0,
  `progresso3` INT NOT NULL DEFAULT 0,
  `email` VARCHAR(100) NOT NULL,
  `senha` VARCHAR(100) NULL,
  `curso` VARCHAR(45) NOT NULL,
  `idioma` ENUM("pt-br", "en-us") NOT NULL,
  `tema` ENUM("dark", "light") NOT NULL,
  `provider` ENUM("local","google") NULL,
  `seguidores` INT NOT NULL,
  `seguindo` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `user_UNIQUE` (`user` ASC) VISIBLE,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `colocacao_UNIQUE` (`colocacao` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `NEBULA`.`anotacoes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `NEBULA`.`anotacoes` ;

CREATE TABLE IF NOT EXISTS `NEBULA`.`anotacoes` (
  `usuario_id` INT NOT NULL,
  `conteudo` VARCHAR(2000) NOT NULL,
  `img` TEXT NULL,
  `pdf` TEXT NULL,
  `id` VARCHAR(45) NOT NULL,
  INDEX `fk_anotacoes_usuario_idx` (`usuario_id` ASC) VISIBLE,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  CONSTRAINT `fk_anotacoes_usuario`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `NEBULA`.`usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `NEBULA`.`comentario`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `NEBULA`.`comentario` ;

CREATE TABLE IF NOT EXISTS `NEBULA`.`comentario` (
  `id` INT NOT NULL,
  `conteudo` TEXT(200) NOT NULL,
  `curtidas` INT NOT NULL,
  `respostas` INT NOT NULL,
  `datapublicacao` VARCHAR(45) NULL,
  `usuario_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_comentario_usuario1_idx` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_comentario_usuario1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `NEBULA`.`usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `NEBULA`.`respostas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `NEBULA`.`respostas` ;

CREATE TABLE IF NOT EXISTS `NEBULA`.`respostas` (
  `id` INT UNSIGNED NOT NULL,
  `conteudo` VARCHAR(45) NOT NULL,
  `datapublicacao` VARCHAR(45) NOT NULL,
  `comentario_id` INT NOT NULL,
  `usuario_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_respostas_comentario1_idx` (`comentario_id` ASC) VISIBLE,
  INDEX `fk_respostas_usuario1_idx` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_respostas_comentario1`
    FOREIGN KEY (`comentario_id`)
    REFERENCES `NEBULA`.`comentario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_respostas_usuario1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `NEBULA`.`usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `NEBULA`.`avaliação`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `NEBULA`.`avaliação` ;

CREATE TABLE IF NOT EXISTS `NEBULA`.`avaliação` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `star` INT NOT NULL,
  `conteudo` TEXT(2000) NOT NULL,
  `usuario_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_avaliação_usuario1_idx` (`usuario_id` ASC) VISIBLE,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  CONSTRAINT `fk_avaliação_usuario1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `NEBULA`.`usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

ALTER TABLE usuario DROP INDEX colocacao_UNIQUE;


-- MEXE SO DAQUI PRA FRENTE!!!!!!!!!!
SELECT * FROM usuario;