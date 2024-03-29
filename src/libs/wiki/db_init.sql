-- MySQL Script generated by MySQL Workbench
-- 06/03/17 17:45:10
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema wiki
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema wiki
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `wiki` DEFAULT CHARACTER SET utf8 ;
USE `wiki` ;

-- -----------------------------------------------------
-- Table `wiki`.`namespace`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wiki`.`namespace` (
  `ns_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ns_title` VARCHAR(45) NOT NULL,
  `ns_PAC` TINYINT UNSIGNED NOT NULL DEFAULT 15 COMMENT 'public access control\ncreate(8) read(4) update(2) delete(1). default 15',
  `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ns_id`),
  UNIQUE INDEX `title_UNIQUE` (`ns_title` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wiki`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wiki`.`user` (
  `user_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(128) NOT NULL,
  `nickname` VARCHAR(128) NOT NULL,
  `password` BINARY(60) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `touched` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_page_id` INT(11) UNSIGNED NULL,
  PRIMARY KEY (`user_id`),
  INDEX `fk_userpage_id_idx` (`user_page_id` ASC),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC),
  UNIQUE INDEX `nickname_UNIQUE` (`nickname` ASC),
  CONSTRAINT `fk_user_userpage_id`
    FOREIGN KEY (`user_page_id`)
    REFERENCES `wiki`.`page` (`page_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wiki`.`revision`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wiki`.`revision` (
  `page_id` INT(11) UNSIGNED NOT NULL,
  `rev_id` INT(11) UNSIGNED NOT NULL,
  `parent_id` INT(11) UNSIGNED NULL,
  `text` MEDIUMTEXT NOT NULL,
  `user_id` INT(11) UNSIGNED NULL,
  `user_text` VARCHAR(45) NOT NULL,
  `comment` VARCHAR(255) NULL,
  `minor` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`page_id`, `rev_id`),
  INDEX `fk_revisions_page_idx` (`page_id` ASC),
  INDEX `fk_user_id_idx` (`user_id` ASC),
  INDEX `fk_parent_id_idx` (`parent_id` ASC),
  INDEX `index_rev_id` (`rev_id` ASC),
  CONSTRAINT `fk_rev_page_id`
    FOREIGN KEY (`page_id`)
    REFERENCES `wiki`.`page` (`page_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_rev_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `wiki`.`user` (`user_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_rev_parent_id`
    FOREIGN KEY (`parent_id`)
    REFERENCES `wiki`.`revision` (`page_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wiki`.`page`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wiki`.`page` (
  `page_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ns_id` INT(11) UNSIGNED NOT NULL,
  `page_title` VARCHAR(255) NOT NULL,
  `page_PAC` TINYINT UNSIGNED NULL DEFAULT NULL COMMENT 'public access control\ncreate(8) read(4) update(2) delete(1). default null.',
  `rev_id` INT(11) UNSIGNED NULL DEFAULT NULL,
  `cached` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `redirect` VARCHAR(255) NULL DEFAULT NULL,
  `deleted` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `touched` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_ID` INT(11) UNSIGNED NULL,
  `user_text` VARCHAR(45) NOT NULL,
  `rev_counter` INT UNSIGNED NOT NULL DEFAULT 0,
  UNIQUE INDEX `title_UNIQUE` (`ns_id` ASC, `page_title` ASC),
  PRIMARY KEY (`page_id`),
  INDEX `fk_rev_id_idx` (`rev_id` ASC),
  CONSTRAINT `fk_page_ns_id`
    FOREIGN KEY (`ns_id`)
    REFERENCES `wiki`.`namespace` (`ns_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_page_rev_id`
    FOREIGN KEY (`rev_id`)
    REFERENCES `wiki`.`revision` (`rev_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wiki`.`logging`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wiki`.`logging` (
  `log_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `page_id` INT(11) UNSIGNED NULL,
  `action` TINYINT UNSIGNED NOT NULL,
  `params` BLOB NULL,
  `user_id` INT(11) UNSIGNED NULL,
  `user_text` VARCHAR(45) NOT NULL,
  `comment` VARCHAR(255) NULL,
  `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` TINYINT UNSIGNED NULL,
  PRIMARY KEY (`log_id`),
  INDEX `fk_logging_pages1_idx` (`page_id` ASC),
  INDEX `fk_user_id_idx` (`user_id` ASC),
  CONSTRAINT `fk_logging_page_id`
    FOREIGN KEY (`page_id`)
    REFERENCES `wiki`.`page` (`page_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_logging_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `wiki`.`user` (`user_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wiki`.`caching`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wiki`.`caching` (
  `page_id` INT UNSIGNED NOT NULL,
  `content` MEDIUMTEXT NOT NULL,
  `touched` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`page_id`),
  CONSTRAINT `fk_caching_page_id`
    FOREIGN KEY (`page_id`)
    REFERENCES `wiki`.`page` (`page_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wiki`.`pagelink`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wiki`.`pagelink` (
  `from` INT(11) UNSIGNED NOT NULL,
  `to` INT(11) UNSIGNED NULL,
  `text` VARCHAR(255) NOT NULL,
  INDEX `fk_from_page_id_idx` (`from` ASC),
  INDEX `fk_to_page_id_idx` (`to` ASC),
  CONSTRAINT `fk_pagel_from_page_id`
    FOREIGN KEY (`from`)
    REFERENCES `wiki`.`page` (`page_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_pagel_to_page_id`
    FOREIGN KEY (`to`)
    REFERENCES `wiki`.`page` (`page_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wiki`.`ACL`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wiki`.`ACL` (
  `user_id` INT(11) UNSIGNED NOT NULL,
  `ns_id` INT(11) UNSIGNED NULL,
  `page_id` INT(11) UNSIGNED NULL,
  `AC` TINYINT UNSIGNED NOT NULL,
  `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `fk_user_id_idx` (`user_id` ASC),
  INDEX `fk_ns_id_idx` (`ns_id` ASC),
  INDEX `fk_page_id_idx` (`page_id` ASC),
  CONSTRAINT `fk_acl_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `wiki`.`user` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_acl_ns_id`
    FOREIGN KEY (`ns_id`)
    REFERENCES `wiki`.`namespace` (`ns_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_acl_page_id`
    FOREIGN KEY (`page_id`)
    REFERENCES `wiki`.`page` (`page_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wiki`.`catogory`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wiki`.`catogory` (
  `page_id` INT(11) UNSIGNED NOT NULL,
  `cat_title` INT NOT NULL,
  `num_page` INT UNSIGNED NOT NULL DEFAULT 0,
  `num_subcat` INT UNSIGNED NOT NULL DEFAULT 0,
  `num_file` INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`page_id`),
  UNIQUE INDEX `title_UNIQUE` (`cat_title` ASC),
  CONSTRAINT `fk_cat_page_id`
    FOREIGN KEY (`page_id`)
    REFERENCES `wiki`.`page` (`page_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wiki`.`categorylink`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wiki`.`categorylink` (
  `from` INT(11) UNSIGNED NOT NULL,
  `to` INT(11) UNSIGNED NOT NULL,
  `type` TINYINT UNSIGNED NOT NULL,
  INDEX `fk_cat_id_idx` (`from` ASC),
  INDEX `fk_page_id_idx` (`to` ASC),
  CONSTRAINT `fk_catl_cat_id`
    FOREIGN KEY (`from`)
    REFERENCES `wiki`.`catogory` (`page_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_catlpage_id`
    FOREIGN KEY (`to`)
    REFERENCES `wiki`.`page` (`page_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

USE `wiki` ;

-- -----------------------------------------------------
-- Placeholder table for view `wiki`.`fullpage`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wiki`.`fullpage` (`ns_title` INT, `page_title` INT, `ns_id` INT, `page_id` INT, `ns_PAC` INT, `page_PAC` INT, `rev_id` INT, `cached` INT, `redirect` INT, `deleted` INT, `touched` INT, `rev_counter` INT);

-- -----------------------------------------------------
-- View `wiki`.`fullpage`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `wiki`.`fullpage`;
USE `wiki`;
CREATE  OR REPLACE VIEW `fullpage` AS
SELECT ns_title, page_title, namespace.ns_id as ns_id, page_id, ns_PAC, page_PAC, rev_id, cached, redirect, deleted, touched, rev_counter 
FROM namespace
LEFT JOIN page
ON page.ns_id = namespace.ns_id;
USE `wiki`;

DELIMITER $$
USE `wiki`$$
CREATE DEFINER = CURRENT_USER TRIGGER `wiki`.`namespace_AFTER_INSERT` AFTER INSERT ON `namespace` FOR EACH ROW
BEGIN
	INSERT INTO logging (action, params, user_text) values (21, NEW.ns_id, "ADMIN");
END$$

USE `wiki`$$
CREATE DEFINER = CURRENT_USER TRIGGER `wiki`.`namespace_AFTER_UPDATE` AFTER UPDATE ON `namespace` FOR EACH ROW
BEGIN
	IF OLD.ns_PAC <> NEW.ns_PAC THEN
		INSERT INTO logging (action, params, user_text) VALUES (23, CONCAT_WS(',', NEW.ns_id, OLD.ns_PAC, NEW.ns_PAC), "ADMIN");
	END IF;
END$$

USE `wiki`$$
CREATE DEFINER = CURRENT_USER TRIGGER `wiki`.`namespace_AFTER_DELETE` AFTER DELETE ON `namespace` FOR EACH ROW
BEGIN
	INSERT INTO logging (action, params, user_text) VALUES (29, CONCAT_WS(',', OLD.ns_id, OLD.ns_title), "ADMIN");
END$$

USE `wiki`$$
CREATE DEFINER = CURRENT_USER TRIGGER `wiki`.`user_AFTER_INSERT` AFTER INSERT ON `user` FOR EACH ROW
BEGIN
	INSERT INTO logging (action, user_id, user_text) values (11, NEW.user_ID, NEW.nickname);
END$$

USE `wiki`$$
CREATE DEFINER = CURRENT_USER TRIGGER `wiki`.`revision_AFTER_INSERT` AFTER INSERT ON `revision` FOR EACH ROW
BEGIN
	UPDATE page SET rev_id = NEW.rev_id, rev_counter = NEW.rev_id WHERE page_id = NEW.page_id;
    INSERT INTO logging (page_id, action, params, user_ID, user_text, comment) VALUES (NEW.page_id, 41, NEW.rev_ID, NEW.user_ID, NEW.user_text, NEW.comment);
END$$

USE `wiki`$$
CREATE DEFINER = CURRENT_USER TRIGGER `wiki`.`revision_AFTER_UPDATE` AFTER UPDATE ON `revision` FOR EACH ROW
BEGIN
	IF OLD.deleted <> NEW.deleted THEN
		INSERT INTO logging (page_id, action, params, user_id, user_text) VALUES (NEW.page_id, 42, CONCAT_WS(',', NEW.rev_id, NEW.deleted), NEW.user_id, NEW.user_text);
	END IF;
END$$

USE `wiki`$$
CREATE DEFINER = CURRENT_USER TRIGGER `wiki`.`page_BEFORE_UPDATE` BEFORE UPDATE ON `page` FOR EACH ROW
BEGIN
	IF OLD.rev_id <> NEW.rev_id THEN
		SET NEW.cached = 0;
	ELSEIF OLD.deleted <> NEW.deleted THEN
		INSERT INTO logging (page_id, action, params, user_id, user_text) VALUES (NEW.page_id, 32, NEW.deleted, NEW.user_id, NEW.user_text);
	ELSEIF (OLD.page_PAC <> NEW.page_PAC) OR (OLD.page_PAC IS NULL AND NEW.page_PAC IS NOT NULL) OR (OLD.page_PAC IS NOT NULL AND NEW.page_PAC IS NULL)  THEN
		INSERT INTO logging (page_id, action, params, user_id, user_text) VALUES (NEW.page_id, 33, CONCAT_WS(',', IF(OLD.page_PAC IS NULL, "", OLD.page_PAC), IF(NEW.page_PAC IS NULL, "", NEW.page_PAC)), NEW.user_id, NEW.user_text);
    ELSEIF OLD.page_title <> NEW.page_title THEN
		INSERT INTO logging (page_id, action, params, user_id, user_text) VALUES (NEW.page_id, 34, CONCAT_WS(',', OLD.page_title, NEW.page_title), NEW.user_id, NEW.user_text);
	END	IF;
END$$

USE `wiki`$$
CREATE DEFINER = CURRENT_USER TRIGGER `wiki`.`caching_AFTER_INSERT` AFTER INSERT ON `caching` FOR EACH ROW
BEGIN
	UPDATE page SET cached = 1 WHERE page_id = NEW.page_id;
END$$

USE `wiki`$$
CREATE DEFINER = CURRENT_USER TRIGGER `wiki`.`caching_AFTER_UPDATE` AFTER UPDATE ON `caching` FOR EACH ROW
BEGIN
	UPDATE page SET cached = 1 WHERE page_id = NEW.page_id;
END$$

USE `wiki`$$
CREATE DEFINER = CURRENT_USER TRIGGER `wiki`.`caching_AFTER_DELETE` AFTER DELETE ON `caching` FOR EACH ROW
BEGIN
	UPDATE page SET cached = 0 WHERE page_id = OLD.page_id;
END$$

USE `wiki`$$
CREATE DEFINER = CURRENT_USER TRIGGER `wiki`.`ACL_AFTER_INSERT` AFTER INSERT ON `ACL` FOR EACH ROW
BEGIN
	INSERT INTO logging (page_id, action, params, user_text) VALUES (NEW.page_id, 51, CONCAT_WS(',', NEW.user_id, IF(NEW.ns_id IS NULL, "", NEW.ns_id), NEW.AC), "ADMIN");
END$$

USE `wiki`$$
CREATE DEFINER = CURRENT_USER TRIGGER `wiki`.`ACL_BEFORE_DELETE` BEFORE DELETE ON `ACL` FOR EACH ROW
BEGIN
	INSERT INTO logging (page_id, action, params, user_text) VALUES (OLD.page_id, 59, CONCAT_WS(',', OLD.user_id, IF(OLD.ns_id IS NULL, "", OLD.ns_id), OLD.AC), "ADMIN");
END$$


DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
