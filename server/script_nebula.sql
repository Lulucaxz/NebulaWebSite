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

-- Usuários de teste para ranking
INSERT INTO usuario (username, user, pontos, colocacao, icon, biografia, progresso1, progresso2, progresso3, email, senha, curso, idioma, tema, provider, seguidores, seguindo)
VALUES
('Ana Souza', '@anasouza', 0, 1, 'https://randomuser.me/api/portraits/women/1.jpg', 'Astrônoma apaixonada', 0, 0, 0, 'ana@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'local', 0, 0),
('Bruno Lima', '@brunolima', 0, 2, 'https://randomuser.me/api/portraits/men/2.jpg', 'Fã de estrelas', 0, 0, 0, 'bruno@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'local', 0, 0),
('Carla Dias', '@carladias', 0, 3, 'https://randomuser.me/api/portraits/women/3.jpg', 'Exploradora do universo', 0, 0, 0, 'carla@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'local', 0, 0),
('Diego Alves', '@diegoalves', 0, 4, 'https://randomuser.me/api/portraits/men/4.jpg', 'Caçador de cometas', 0, 0, 0, 'diego@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'local', 0, 0),
('Elisa Martins', '@elisamartins', 0, 5, 'https://randomuser.me/api/portraits/women/5.jpg', 'Aventureira espacial', 0, 0, 0, 'elisa@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'local', 0, 0),
('Felipe Torres', '@felipetorres', 0, 6, 'https://randomuser.me/api/portraits/men/6.jpg', 'Observador de galáxias', 0, 0, 0, 'felipe@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'local', 0, 0),
('Giovana Rocha', '@giovanarocha', 0, 7, 'https://randomuser.me/api/portraits/women/7.jpg', 'Curiosa do espaço', 0, 0, 0, 'giovana@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'local', 0, 0),
('Henrique Melo', '@henriquemelo', 0, 8, 'https://randomuser.me/api/portraits/men/8.jpg', 'Futuro astronauta', 0, 0, 0, 'henrique@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'local', 0, 0),
('Isabela Nunes', '@isabelanunes', 0, 9, 'https://randomuser.me/api/portraits/women/9.jpg', 'Amante da Via Láctea', 0, 0, 0, 'isabela@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'local', 0, 0),
('João Pedro', '@joaopedro', 0, 10, 'https://randomuser.me/api/portraits/men/10.jpg', 'Descobridor de planetas', 0, 0, 0, 'joao@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'local', 0, 0);

-- Mais usuários de teste para ranking
INSERT INTO usuario (username, user, pontos, colocacao, icon, biografia, progresso1, progresso2, progresso3, email, senha, curso, idioma, tema, provider, seguidores, seguindo)
VALUES
('Karen Silva', '@karensilva', 0, 11, 'https://randomuser.me/api/portraits/women/11.jpg', 'Apaixonada por astronomia', 0, 0, 0, 'karen@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'local', 0, 0),
('Lucas Pinto', '@lucaspinto', 0, 12, 'https://randomuser.me/api/portraits/men/12.jpg', 'Viajante das estrelas', 0, 0, 0, 'lucas@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'local', 0, 0),
('Marina Costa', '@marinacosta', 0, 13, 'https://randomuser.me/api/portraits/women/13.jpg', 'Estudante de física', 0, 0, 0, 'marina@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'local', 0, 0),
('Nicolas Ramos', '@nicolasramos', 0, 14, 'https://randomuser.me/api/portraits/men/14.jpg', 'Fã de buracos negros', 0, 0, 0, 'nicolas@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'local', 0, 0),
('Olivia Teixeira', '@oliviateixeira', 0, 15, 'https://randomuser.me/api/portraits/women/15.jpg', 'Aventureira do espaço', 0, 0, 0, 'olivia@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'local', 0, 0),
('Paulo Vieira', '@paulovieira', 0, 16, 'https://randomuser.me/api/portraits/men/16.jpg', 'Observador de planetas', 0, 0, 0, 'paulo@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'local', 0, 0),
('Quésia Lopes', '@quesialopes', 0, 17, 'https://randomuser.me/api/portraits/women/17.jpg', 'Curiosa do universo', 0, 0, 0, 'quesia@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'local', 0, 0),
('Rafael Souza', '@rafaelsouza', 0, 18, 'https://randomuser.me/api/portraits/men/18.jpg', 'Futuro cientista', 0, 0, 0, 'rafael@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'local', 0, 0),
('Sofia Castro', '@sofiacastro', 0, 19, 'https://randomuser.me/api/portraits/women/19.jpg', 'Exploradora de galáxias', 0, 0, 0, 'sofia@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'local', 0, 0),
('Thiago Gomes', '@thiagogomes', 0, 20, 'https://randomuser.me/api/portraits/men/20.jpg', 'Amante do céu noturno', 0, 0, 0, 'thiago@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'local', 0, 0);

-- Repita/adapte para até 50 usuários se desejar mais exemplos