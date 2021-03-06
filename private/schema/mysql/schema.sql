
CREATE SCHEMA `cinder` ;
USE `cinder`;

CREATE TABLE `migration` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `version` bigint(20) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `migration` VALUES (1,'20160617101306');

CREATE TABLE `error_type` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(16) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

INSERT INTO `error_type` VALUES (1,'PHP'),(2,'MySQL'),(3,'404'),(4,'JavaScript');

CREATE TABLE `error` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `error_type_id` int(10) unsigned NOT NULL COMMENT 'name=Error type',
  `message` varchar(255) DEFAULT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `line` int(5) DEFAULT NULL,
  `ip_address` varchar(16) NOT NULL COMMENT 'name=IP Address\ndefault=userip\n',
  `created_datetime` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `error_to_error_type_idx` (`error_type_id`),
  CONSTRAINT `error_to_error_type` FOREIGN KEY (`error_type_id`) REFERENCES `error_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
