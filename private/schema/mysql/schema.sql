
CREATE TABLE `error` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `error_type_id` int(10) unsigned NOT NULL COMMENT 'name=Error type',
  `message` varchar(255) DEFAULT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `line` int(5) DEFAULT NULL,
  `ip_address` varchar(16) NOT NULL COMMENT 'name=IP Address|default=userip',
  `created_datetime` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `error_to_error_type_idx` (`error_type_id`),
  CONSTRAINT `error_to_error_type` FOREIGN KEY (`error_type_id`) REFERENCES `error_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `error_type` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(16) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
