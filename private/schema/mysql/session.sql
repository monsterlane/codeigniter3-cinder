USE `cinder`;

CREATE TABLE IF NOT EXISTS `session` (
  `id` varchar(40) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `timestamp` int(10) unsigned DEFAULT 0 NOT NULL,
  `data` blob NOT NULL,
  KEY `session_timestamp` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
