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
  `banner` VARCHAR(1024) NOT NULL DEFAULT '/img/nebulosaBanner.jpg',
  `biografia` TEXT NULL,
  `progresso1` INT NOT NULL DEFAULT 0,
  `progresso2` INT NOT NULL DEFAULT 0,
  `progresso3` INT NOT NULL DEFAULT 0,
  `email` VARCHAR(100) NOT NULL,
  `senha` VARCHAR(100) NULL,
  `curso` VARCHAR(45) NULL,
  `idioma` ENUM("pt-br", "en-us") NOT NULL,
  `tema` ENUM("dark", "light") NOT NULL,
  `role` ENUM('aluno','professor') NOT NULL DEFAULT 'aluno',
  `provider` ENUM("local","google") NULL,
  `google_id` VARCHAR(255) NULL,
  `seguidores` INT NOT NULL DEFAULT 0,
  `seguindo` INT NOT NULL DEFAULT 0,
  `active_palette_id` INT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `user_UNIQUE` (`user` ASC) VISIBLE,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `colocacao_UNIQUE` (`colocacao` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `google_id_UNIQUE` (`google_id` ASC) VISIBLE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `NEBULA`.`usuario_palette`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `NEBULA`.`usuario_palette` ;

CREATE TABLE IF NOT EXISTS `NEBULA`.`usuario_palette` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `label` VARCHAR(60) NOT NULL,
  `base` ENUM('preto','branco') NOT NULL DEFAULT 'preto',
  `primary_hex` CHAR(7) NOT NULL,
  `metadata` JSON NULL,
  `is_default` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_usuario_palette_user` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_usuario_palette_user`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `NEBULA`.`usuario` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

ALTER TABLE `NEBULA`.`usuario`
  ADD CONSTRAINT `fk_usuario_active_palette`
    FOREIGN KEY (`active_palette_id`)
    REFERENCES `NEBULA`.`usuario_palette` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

-- -----------------------------------------------------
-- Table `NEBULA`.`usuario_follow`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `NEBULA`.`usuario_follow` ;

CREATE TABLE IF NOT EXISTS `NEBULA`.`usuario_follow` (
  `seguidor_id` INT NOT NULL,
  `seguido_id` INT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`seguidor_id`, `seguido_id`),
  INDEX `idx_follow_seguido` (`seguido_id` ASC) VISIBLE,
  CONSTRAINT `fk_follow_seguidor`
    FOREIGN KEY (`seguidor_id`)
    REFERENCES `NEBULA`.`usuario` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_follow_seguido`
    FOREIGN KEY (`seguido_id`)
    REFERENCES `NEBULA`.`usuario` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `NEBULA`.`anotacoes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `NEBULA`.`anotacoes` ;

CREATE TABLE IF NOT EXISTS `NEBULA`.`anotacoes` (
  `usuario_id` INT NOT NULL,
  `conteudo` VARCHAR(2000) NOT NULL,
  `img` TEXT NULL,
  `pdf` LONGBLOB NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `posicao` INT NOT NULL DEFAULT 0,
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

ALTER TABLE `NEBULA`.`anotacoes`
ADD COLUMN `coluna` INT NOT NULL DEFAULT 1 AFTER `usuario_id`,
ADD COLUMN `pdfNome` VARCHAR(255) NULL DEFAULT NULL AFTER `pdf`;
-- Add created_at timestamp to track insertion time. New table creation
-- already includes `created_at`. For existing databases that don't have
-- the column, run an ALTER TABLE conditionally using information_schema.
-- This is compatible with older MySQL versions that don't support
-- "ADD COLUMN IF NOT EXISTS".
SET @created_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'NEBULA' AND TABLE_NAME = 'anotacoes' AND COLUMN_NAME = 'created_at'
);
SET @sql = IF(@created_exists = 0,
  'ALTER TABLE `NEBULA`.`anotacoes` ADD COLUMN `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `pdfNome`',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add posicao column for ordering (higher posicao => appears first in column).
SET @pos_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'NEBULA' AND TABLE_NAME = 'anotacoes' AND COLUMN_NAME = 'posicao'
);
SET @sql2 = IF(@pos_exists = 0,
  'ALTER TABLE `NEBULA`.`anotacoes` ADD COLUMN `posicao` INT NOT NULL DEFAULT 0 AFTER `created_at`',
  'SELECT 1'
);
PREPARE stmt2 FROM @sql2;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

-- -----------------------------------------------------
-- Table `NEBULA`.`forum_post`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `NEBULA`.`forum_post` ;

CREATE TABLE IF NOT EXISTS `NEBULA`.`forum_post` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NULL,
  `nome_usuario` VARCHAR(100) NOT NULL,
  `foto_perfil` VARCHAR(1024) NOT NULL,
  `assinatura` ENUM('Universo','Galáxia','Órbita') NOT NULL DEFAULT 'Universo',
  `titulo` VARCHAR(200) NOT NULL,
  `conteudo` TEXT NOT NULL,
  `tags` JSON NOT NULL,
  `numero_avaliacao` DECIMAL(5,2) NOT NULL DEFAULT 0,
  `avaliacao_do_usuario` VARCHAR(45) NOT NULL DEFAULT 'esteUsuario',
  `imagem_url` MEDIUMTEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_forum_post_created_at` (`created_at` DESC),
  CONSTRAINT `fk_forum_post_usuario`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `NEBULA`.`usuario` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `NEBULA`.`forum_resposta`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `NEBULA`.`forum_resposta` ;

CREATE TABLE IF NOT EXISTS `NEBULA`.`forum_resposta` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `post_id` INT NOT NULL,
  `parent_id` BIGINT NULL,
  `usuario_id` INT NULL,
  `nome_usuario` VARCHAR(100) NOT NULL,
  `foto_perfil` VARCHAR(1024) NOT NULL,
  `assinatura` ENUM('Universo','Galáxia','Órbita') NOT NULL DEFAULT 'Universo',
  `conteudo` TEXT NOT NULL,
  `imagem_url` MEDIUMTEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_resposta_post` (`post_id` ASC),
  INDEX `idx_resposta_parent` (`parent_id` ASC),
  CONSTRAINT `fk_forum_resposta_post`
    FOREIGN KEY (`post_id`)
    REFERENCES `NEBULA`.`forum_post` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_forum_resposta_parent`
    FOREIGN KEY (`parent_id`)
    REFERENCES `NEBULA`.`forum_resposta` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_forum_resposta_usuario`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `NEBULA`.`usuario` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `NEBULA`.`forum_post_like`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `NEBULA`.`forum_post_like` ;

CREATE TABLE IF NOT EXISTS `NEBULA`.`forum_post_like` (
  `post_id` INT NOT NULL,
  `usuario_id` INT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`, `usuario_id`),
  CONSTRAINT `fk_forum_post_like_post`
    FOREIGN KEY (`post_id`)
    REFERENCES `NEBULA`.`forum_post` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_forum_post_like_usuario`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `NEBULA`.`usuario` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

  -- -----------------------------------------------------
  -- Table `NEBULA`.`chat_room`
  -- -----------------------------------------------------
  DROP TABLE IF EXISTS `NEBULA`.`chat_room` ;

  CREATE TABLE IF NOT EXISTS `NEBULA`.`chat_room` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `owner_id` INT NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `tag` VARCHAR(40) NULL DEFAULT NULL,
    `is_group` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_chat_room_owner` (`owner_id` ASC) VISIBLE,
    CONSTRAINT `fk_chat_room_owner`
      FOREIGN KEY (`owner_id`)
      REFERENCES `NEBULA`.`usuario` (`id`)
      ON DELETE CASCADE
      ON UPDATE CASCADE
  ) ENGINE = InnoDB AUTO_INCREMENT = 1000;

  -- -----------------------------------------------------
  -- Table `NEBULA`.`chat_room_participant`
  -- -----------------------------------------------------
  DROP TABLE IF EXISTS `NEBULA`.`chat_room_participant` ;

  CREATE TABLE IF NOT EXISTS `NEBULA`.`chat_room_participant` (
    `room_id` BIGINT NOT NULL,
    `user_id` INT NOT NULL,
    `added_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`room_id`, `user_id`),
    INDEX `idx_chat_participant_user` (`user_id` ASC) VISIBLE,
    CONSTRAINT `fk_chat_participant_room`
      FOREIGN KEY (`room_id`)
      REFERENCES `NEBULA`.`chat_room` (`id`)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    CONSTRAINT `fk_chat_participant_user`
      FOREIGN KEY (`user_id`)
      REFERENCES `NEBULA`.`usuario` (`id`)
      ON DELETE CASCADE
      ON UPDATE CASCADE
  ) ENGINE = InnoDB;

  -- -----------------------------------------------------
  -- Table `NEBULA`.`chat_message`
  -- -----------------------------------------------------
  DROP TABLE IF EXISTS `NEBULA`.`chat_message` ;

  CREATE TABLE IF NOT EXISTS `NEBULA`.`chat_message` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `room_id` BIGINT NOT NULL,
    `author_id` INT NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_chat_message_room` (`room_id` ASC, `created_at` DESC) VISIBLE,
    INDEX `idx_chat_message_author` (`author_id` ASC) VISIBLE,
    CONSTRAINT `fk_chat_message_room`
      FOREIGN KEY (`room_id`)
      REFERENCES `NEBULA`.`chat_room` (`id`)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    CONSTRAINT `fk_chat_message_author`
      FOREIGN KEY (`author_id`)
      REFERENCES `NEBULA`.`usuario` (`id`)
      ON DELETE CASCADE
      ON UPDATE CASCADE
  ) ENGINE = InnoDB;

  -- -----------------------------------------------------
  -- Table `NEBULA`.`chat_notification`
  -- -----------------------------------------------------
  DROP TABLE IF EXISTS `NEBULA`.`chat_notification` ;

  CREATE TABLE IF NOT EXISTS `NEBULA`.`chat_notification` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `conversation_id` BIGINT NOT NULL,
    `message_id` BIGINT NOT NULL,
    `author_id` INT NOT NULL,
    `conversation_name` VARCHAR(255) NOT NULL,
    `content_snapshot` VARCHAR(2048) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `read_at` DATETIME NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_chat_notification_user` (`user_id` ASC, `read_at` ASC, `created_at` DESC) VISIBLE,
    INDEX `idx_chat_notification_message` (`message_id` ASC) VISIBLE,
    CONSTRAINT `fk_chat_notification_user`
      FOREIGN KEY (`user_id`)
      REFERENCES `NEBULA`.`usuario` (`id`)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    CONSTRAINT `fk_chat_notification_conversation`
      FOREIGN KEY (`conversation_id`)
      REFERENCES `NEBULA`.`chat_room` (`id`)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    CONSTRAINT `fk_chat_notification_message`
      FOREIGN KEY (`message_id`)
      REFERENCES `NEBULA`.`chat_message` (`id`)
      ON DELETE CASCADE
      ON UPDATE CASCADE
  ) ENGINE = InnoDB;

  -- -----------------------------------------------------
  -- Table `NEBULA`.`chat_unread_counter`
  -- -----------------------------------------------------
  DROP TABLE IF EXISTS `NEBULA`.`chat_unread_counter` ;

  CREATE TABLE IF NOT EXISTS `NEBULA`.`chat_unread_counter` (
    `user_id` INT NOT NULL,
    `conversation_id` BIGINT NOT NULL,
    `unread_count` INT NOT NULL DEFAULT 0,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`, `conversation_id`),
    CONSTRAINT `fk_chat_unread_counter_user`
      FOREIGN KEY (`user_id`)
      REFERENCES `NEBULA`.`usuario` (`id`)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    CONSTRAINT `fk_chat_unread_counter_conversation`
      FOREIGN KEY (`conversation_id`)
      REFERENCES `NEBULA`.`chat_room` (`id`)
      ON DELETE CASCADE
      ON UPDATE CASCADE
  ) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `NEBULA`.`forum_resposta_like`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `NEBULA`.`forum_resposta_like` ;

CREATE TABLE IF NOT EXISTS `NEBULA`.`forum_resposta_like` (
  `resposta_id` BIGINT NOT NULL,
  `usuario_id` INT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`resposta_id`, `usuario_id`),
  CONSTRAINT `fk_forum_resposta_like_resposta`
    FOREIGN KEY (`resposta_id`)
    REFERENCES `NEBULA`.`forum_resposta` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_forum_resposta_like_usuario`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `NEBULA`.`usuario` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `NEBULA`.`avaliacao`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `NEBULA`.`avaliacao` ;
DROP TABLE IF EXISTS `NEBULA`.`avaliação` ;

CREATE TABLE IF NOT EXISTS `NEBULA`.`avaliacao` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `estrelas` TINYINT NOT NULL,
  `texto` TEXT NOT NULL,
  `curso` VARCHAR(45) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_avaliacao_usuario` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_avaliacao_usuario`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `NEBULA`.`usuario` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `chk_avaliacao_estrelas` CHECK ((`estrelas` BETWEEN 1 AND 5))
) ENGINE = InnoDB;

ALTER TABLE usuario DROP INDEX colocacao_UNIQUE;

SET @banner_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'NEBULA' AND TABLE_NAME = 'usuario' AND COLUMN_NAME = 'banner'
);
SET @sql_banner = IF(@banner_exists = 0,
  'ALTER TABLE `NEBULA`.`usuario` ADD COLUMN `banner` VARCHAR(1024) NOT NULL DEFAULT ''/img/nebulosaBanner.jpg'' AFTER `icon`',
  'SELECT 1'
);
PREPARE stmt_banner FROM @sql_banner;
EXECUTE stmt_banner;
DEALLOCATE PREPARE stmt_banner;


-- MEXE SO DAQUI PRA FRENTE!!!!!!!!!!
SELECT * FROM usuario;
SELECT * FROM chat_room;
SELECT * FROM chat_message;

-- Usuários de teste para ranking
INSERT INTO usuario (username, user, pontos, colocacao, icon, banner, biografia, progresso1, progresso2, progresso3, email, senha, curso, idioma, tema, role, provider, seguidores, seguindo)
VALUES
('Ana Souza', '@anasouza', 120, 1, 'https://randomuser.me/api/portraits/women/1.jpg', '/img/nebulosaBanner.jpg', 'Astrônoma apaixonada', 0, 0, 0, 'ana@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'aluno', 'local', 0, 0),
('Bruno Lima', '@brunolima', 85, 2, 'https://randomuser.me/api/portraits/men/2.jpg', '/img/nebulosaBanner.jpg', 'Fã de estrelas', 0, 0, 0, 'bruno@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'aluno', 'local', 0, 0),
('Carla Dias', '@carladias', 210, 3, 'https://randomuser.me/api/portraits/women/3.jpg', '/img/nebulosaBanner.jpg', 'Exploradora do universo', 0, 0, 0, 'carla@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'aluno', 'local', 0, 0),
('Diego Alves', '@diegoalves', 45, 4, 'https://randomuser.me/api/portraits/men/4.jpg', '/img/nebulosaBanner.jpg', 'Caçador de cometas', 0, 0, 0, 'diego@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'aluno', 'local', 0, 0),
('Elisa Martins', '@elisamartins', 300, 5, 'https://randomuser.me/api/portraits/women/5.jpg', '/img/nebulosaBanner.jpg', 'Aventureira espacial', 0, 0, 0, 'elisa@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'aluno', 'local', 0, 0),
('Felipe Torres', '@felipetorres', 190, 6, 'https://randomuser.me/api/portraits/men/6.jpg', '/img/nebulosaBanner.jpg', 'Observador de galáxias', 0, 0, 0, 'felipe@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'aluno', 'local', 0, 0),
('Giovana Rocha', '@giovanarocha', 75, 7, 'https://randomuser.me/api/portraits/women/7.jpg', '/img/nebulosaBanner.jpg', 'Curiosa do espaço', 0, 0, 0, 'giovana@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'aluno', 'local', 0, 0),
('Henrique Melo', '@henriquemelo', 160, 8, 'https://randomuser.me/api/portraits/men/8.jpg', '/img/nebulosaBanner.jpg', 'Futuro astronauta', 0, 0, 0, 'henrique@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'aluno', 'local', 0, 0),
('Isabela Nunes', '@isabelanunes', 230, 9, 'https://randomuser.me/api/portraits/women/9.jpg', '/img/nebulosaBanner.jpg', 'Amante da Via Láctea', 0, 0, 0, 'isabela@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'aluno', 'local', 0, 0),
('João Pedro', '@joaopedro', 55, 10, 'https://randomuser.me/api/portraits/men/10.jpg', '/img/nebulosaBanner.jpg', 'Descobridor de planetas', 0, 0, 0, 'joao@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'aluno', 'local', 0, 0);

-- Mais usuários de teste para ranking
INSERT INTO usuario (username, user, pontos, colocacao, icon, banner, biografia, progresso1, progresso2, progresso3, email, senha, curso, idioma, tema, role, provider, seguidores, seguindo)
VALUES
('Karen Silva', '@karensilva', 110, 11, 'https://randomuser.me/api/portraits/women/11.jpg', '/img/nebulosaBanner.jpg', 'Apaixonada por astronomia', 0, 0, 0, 'karen@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'aluno', 'local', 0, 0),
('Lucas Pinto', '@lucaspinto', 95, 12, 'https://randomuser.me/api/portraits/men/12.jpg', '/img/nebulosaBanner.jpg', 'Viajante das estrelas', 0, 0, 0, 'lucas@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'aluno', 'local', 0, 0),
('Marina Costa', '@marinacosta', 180, 13, 'https://randomuser.me/api/portraits/women/13.jpg', '/img/nebulosaBanner.jpg', 'Estudante de física', 0, 0, 0, 'marina@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'aluno', 'local', 0, 0),
('Nicolas Ramos', '@nicolasramos', 60, 14, 'https://randomuser.me/api/portraits/men/14.jpg', '/img/nebulosaBanner.jpg', 'Fã de buracos negros', 0, 0, 0, 'nicolas@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'aluno', 'local', 0, 0),
('Olivia Teixeira', '@oliviateixeira', 250, 15, 'https://randomuser.me/api/portraits/women/15.jpg', '/img/nebulosaBanner.jpg', 'Aventureira do espaço', 0, 0, 0, 'olivia@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'aluno', 'local', 0, 0),
('Paulo Vieira', '@paulovieira', 130, 16, 'https://randomuser.me/api/portraits/men/16.jpg', '/img/nebulosaBanner.jpg', 'Observador de planetas', 0, 0, 0, 'paulo@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'aluno', 'local', 0, 0),
('Quésia Lopes', '@quesialopes', 170, 17, 'https://randomuser.me/api/portraits/women/17.jpg', '/img/nebulosaBanner.jpg', 'Curiosa do universo', 0, 0, 0, 'quesia@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'aluno', 'local', 0, 0),
('Rafael Souza', '@rafaelsouza', 80, 18, 'https://randomuser.me/api/portraits/men/18.jpg', '/img/nebulosaBanner.jpg', 'Futuro cientista', 0, 0, 0, 'rafael@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'aluno', 'local', 0, 0),
('Sofia Castro', '@sofiacastro', 220, 19, 'https://randomuser.me/api/portraits/women/19.jpg', '/img/nebulosaBanner.jpg', 'Exploradora de galáxias', 0, 0, 0, 'sofia@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'aluno', 'local', 0, 0),
('Thiago Gomes', '@thiagogomes', 140, 20, 'https://randomuser.me/api/portraits/men/20.jpg', '/img/nebulosaBanner.jpg', 'Amante do céu noturno', 0, 0, 0, 'thiago@email.com', NULL, 'Astronomia', 'pt-br', 'dark', 'aluno', 'local', 0, 0);

-- Conta professor oficial
INSERT INTO usuario (username, user, pontos, colocacao, icon, banner, biografia, progresso1, progresso2, progresso3, email, senha, curso, idioma, tema, role, provider, seguidores, seguindo)
VALUES
('Nebula Professor', '@professornebula', 0, 21, '/img/defaultUser.png', '/img/nebulosaBanner.jpg', 'Conta oficial da equipe acadêmica Nebula.', 0, 0, 0, 'nebula.academy.brasil@gmail.com', '$2b$10$Za58iKqVd/MhEfkfmDfn8uLWdjtN7pM/JXiFlOoMlFnQJ15G7S90q', 'Astrofísica', 'pt-br', 'dark', 'professor', 'local', 0, 0);

-- Repita/adapte para até 50 usuários se desejar mais exemplos

-- -----------------------------------------------------
-- Forum seed data
-- -----------------------------------------------------
INSERT INTO `NEBULA`.`forum_post`
  (`usuario_id`, `nome_usuario`, `foto_perfil`, `assinatura`, `titulo`, `conteudo`, `tags`, `numero_avaliacao`, `avaliacao_do_usuario`, `imagem_url`)
VALUES
  (1, 'Ana Souza', 'https://randomuser.me/api/portraits/women/1.jpg', 'Universo', 'Como ganhar mais pontos no ranking?',
   'Estou parada na parte inferior do ranking. Quais tarefas realmente contam pontos? Já finalizei vídeos, mas nada muda.',
   JSON_ARRAY('Dúvida','Universo'), 24.0, 'esteUsuario', 'src/pages/forum/ImgComentarioTEMP/comentarioImg1.png'),
  (2, 'Bruno Lima', 'https://randomuser.me/api/portraits/men/2.jpg', 'Galáxia', 'Trilha ideal para iniciantes em programação',
   'Quero começar desenvolvimento web, mas não sei em qual trilha focar primeiro. Sugestões?',
   JSON_ARRAY('Dúvida','Galáxia','Conselho'), 38.0, 'outroUsuario', NULL),
  (3, 'Carla Dias', 'https://randomuser.me/api/portraits/women/3.jpg', 'Órbita', 'Material complementar de algoritmos',
   'Preciso de exercícios extras antes da prova de algoritmos. Alguém recomenda livros ou sites?',
   JSON_ARRAY('Material','Órbita','Dúvida'), 17.0, 'outroUsuario', NULL),
  (4, 'Diego Alves', 'https://randomuser.me/api/portraits/men/4.jpg', 'Universo', 'Bug na plataforma: vídeos não carregam',
   'Os vídeos travam desde ontem. Já limpei cache e nada resolveu. Mais alguém?',
   JSON_ARRAY('Problema','Universo'), 42.0, 'outroUsuario', NULL),
  (5, 'Elisa Martins', 'https://randomuser.me/api/portraits/women/5.jpg', 'Galáxia', 'Organizando grupo de estudos para Python',
   'Estou formando um grupo no Discord para revisar Python. Quem tiver interesse me chama!',
   JSON_ARRAY('Convite','Galáxia','Debate'), 56.0, 'outroUsuario', NULL),
  (6, 'Felipe Torres', 'https://randomuser.me/api/portraits/men/6.jpg', 'Órbita', 'JavaScript vs TypeScript: qual aprender primeiro?',
   'Tenho base em lógica e queria entender a ordem ideal entre JS e TS.',
   JSON_ARRAY('Dúvida','Órbita','Conselho'), 31.0, 'outroUsuario', NULL),
  (7, 'Giovana Rocha', 'https://randomuser.me/api/portraits/women/7.jpg', 'Universo', 'Certificado não foi emitido após conclusão',
   'Concluí o curso de React e o certificado não chegou. Quanto tempo normalmente demora?',
   JSON_ARRAY('Problema','Universo'), 19.0, 'outroUsuario', NULL),
  (8, 'Henrique Melo', 'https://randomuser.me/api/portraits/men/8.jpg', 'Galáxia', 'Sugestão: modo escuro na plataforma',
   'Estudo à noite e sinto falta de um modo escuro para cansar menos a vista.',
   JSON_ARRAY('Observação','Galáxia','Debate'), 89.0, 'outroUsuario', NULL),
  (9, 'Isabela Nunes', 'https://randomuser.me/api/portraits/women/9.jpg', 'Órbita', 'Dúvida sobre exercício de Arrays',
   'Não consigo resolver o exercício 7 do módulo 3 sem usar sort(). Alguma dica?',
   JSON_ARRAY('Dúvida','Órbita','Material'), 12.0, 'outroUsuario', NULL),
  (10, 'João Pedro', 'https://randomuser.me/api/portraits/men/10.jpg', 'Universo', 'Vale fazer Node antes de React?',
   'Já entendo JS e quero planejar a trilha. Faço Node antes ou depois de React?',
   JSON_ARRAY('Conselho','Universo','Debate'), 27.0, 'outroUsuario', NULL),
  (11, 'Karen Silva', 'https://randomuser.me/api/portraits/women/11.jpg', 'Galáxia', 'Live de dúvidas sobre SQL',
   'Perdi a última live de SQL. Ficou gravada? Já existe data para a próxima?',
   JSON_ARRAY('Dúvida','Galáxia'), 33.0, 'outroUsuario', NULL),
  (12, 'Lucas Pinto', 'https://randomuser.me/api/portraits/men/12.jpg', 'Órbita', 'Compartilhando meu primeiro projeto',
   'Terminei meu primeiro projeto com React + TS e gostaria de feedbacks.',
   JSON_ARRAY('Debate','Órbita','Observação'), 67.0, 'outroUsuario', NULL);

INSERT INTO `NEBULA`.`forum_resposta`
  (`post_id`, `parent_id`, `usuario_id`, `nome_usuario`, `foto_perfil`, `assinatura`, `conteudo`, `imagem_url`)
VALUES
  (1, NULL, 2, 'Bruno Lima', 'https://randomuser.me/api/portraits/men/2.jpg', 'Órbita',
   'Você só ganha pontos concluindo atividades e marcando aulas como finalizadas. Ver vídeos não basta.', NULL),
  (1, 1, 1, 'Ana Souza', 'https://randomuser.me/api/portraits/women/1.jpg', 'Universo',
   'Obrigado pela dica! Vou começar a finalizar as aulas e ver se sobe.', NULL),
  (2, NULL, 6, 'Felipe Torres', 'https://randomuser.me/api/portraits/men/6.jpg', 'Galáxia',
   'Comece com HTML, CSS e JavaScript. Depois parte para React que usa tudo isso.', NULL),
  (2, 3, 2, 'Bruno Lima', 'https://randomuser.me/api/portraits/men/2.jpg', 'Galáxia',
   'Show! Vou seguir essa ordem. Valeu!', NULL),
  (4, NULL, 11, 'Karen Silva', 'https://randomuser.me/api/portraits/women/11.jpg', 'Galáxia',
   'Também estou com o bug nos vídeos. A equipe de suporte já avisou que está corrigindo.', NULL),
  (5, NULL, 9, 'Isabela Nunes', 'https://randomuser.me/api/portraits/women/9.jpg', 'Órbita',
   'Quero participar do grupo! Pode mandar o link?', NULL),
  (6, NULL, 8, 'Henrique Melo', 'https://randomuser.me/api/portraits/men/8.jpg', 'Galáxia',
   'Aprende JavaScript primeiro. Depois o TypeScript fica bem mais fácil.', NULL),
  (6, 7, 6, 'Felipe Torres', 'https://randomuser.me/api/portraits/men/6.jpg', 'Órbita',
   'Perfeito, obrigado! Faz sentido começar por JS mesmo.', NULL),
  (9, NULL, 5, 'Elisa Martins', 'https://randomuser.me/api/portraits/women/5.jpg', 'Galáxia',
   'Use bubble sort: compare pares adjacentes e troque até tudo ficar ordenado.', NULL),
  (9, 9, 9, 'Isabela Nunes', 'https://randomuser.me/api/portraits/women/9.jpg', 'Órbita',
   'Agora entendi! Vou implementar e posto o resultado.', NULL);

-- -----------------------------------------------------
-- Progress tables: modules and activities completed by users
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `NEBULA`.`modulos_concluidos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `assinatura` VARCHAR(255) NOT NULL,
  `modulo_id` INT NOT NULL,
  `completed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_user_mod` (`usuario_id`, `assinatura`, `modulo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `NEBULA`.`atividades_concluidas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `assinatura` VARCHAR(255) NOT NULL,
  `modulo_id` INT NOT NULL,
  `atividade_id` INT NOT NULL,
  `completed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_user_act` (`usuario_id`, `assinatura`, `modulo_id`, `atividade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `NEBULA`.`atividade_tentativas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `assinatura` VARCHAR(255) NOT NULL,
  `modulo_id` INT NOT NULL,
  `atividade_id` INT NOT NULL,
  `tentativas` INT NOT NULL DEFAULT 0,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_tentativa_user_act` (`usuario_id`, `assinatura`, `modulo_id`, `atividade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Course builder tables for professores
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `NEBULA`.`curso_modulo_custom` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `assinatura` VARCHAR(255) NOT NULL,
  `titulo` VARCHAR(255) NOT NULL,
  `descricao` TEXT NOT NULL,
  `introducao_descricao` TEXT NOT NULL,
  `introducao_video` VARCHAR(1024) NOT NULL,
  `introducao_background` VARCHAR(1024) NOT NULL,
  `ordem` INT NOT NULL DEFAULT 0,
  `created_by` INT NOT NULL,
  `updated_by` INT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_curso_modulo_assinatura` (`assinatura`),
  CONSTRAINT `fk_curso_modulo_usuario_criador`
    FOREIGN KEY (`created_by`) REFERENCES `NEBULA`.`usuario`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_curso_modulo_usuario_editor`
    FOREIGN KEY (`updated_by`) REFERENCES `NEBULA`.`usuario`(`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `NEBULA`.`curso_modulo_atividade` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `modulo_id` INT NOT NULL,
  `titulo` VARCHAR(255) NOT NULL,
  `descricao` TEXT NOT NULL,
  `questoes` JSON NULL,
  `ordem` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_curso_modulo_atividade_modulo` (`modulo_id`),
  CONSTRAINT `fk_curso_modulo_atividade_modulo`
    FOREIGN KEY (`modulo_id`) REFERENCES `NEBULA`.`curso_modulo_custom`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `NEBULA`.`curso_modulo_video` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `modulo_id` INT NOT NULL,
  `titulo` VARCHAR(255) NOT NULL,
  `subtitulo` VARCHAR(255) NULL,
  `descricao` TEXT NULL,
  `video_url` VARCHAR(1024) NOT NULL,
  `background_url` VARCHAR(1024) NULL,
  `ordem` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_curso_modulo_video_modulo` (`modulo_id`),
  CONSTRAINT `fk_curso_modulo_video_modulo`
    FOREIGN KEY (`modulo_id`) REFERENCES `NEBULA`.`curso_modulo_custom`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
