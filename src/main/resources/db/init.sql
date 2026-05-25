-- =============================================
-- 运输费报价系统 - 数据库初始化脚本
-- 在新机器上执行：mysql -u root -p < init.sql
-- =============================================

CREATE DATABASE IF NOT EXISTS my_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE my_db;

DROP TABLE IF EXISTS `price_rule`;
DROP TABLE IF EXISTS `product`;

CREATE TABLE `product` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '品名',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='品名表';

CREATE TABLE `price_rule` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint NOT NULL,
  `min_density` decimal(10,4) NOT NULL COMMENT '密度下限(含)',
  `max_density` decimal(10,4) NOT NULL COMMENT '密度上限(不含)',
  `unit_price` decimal(10,2) NOT NULL COMMENT '单价(元/kg)',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_product_density` (`product_id`,`min_density`,`max_density`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='密度区间单价表';

-- 品名数据
INSERT INTO `product` VALUES
  (1,'普货','2026-05-25 14:43:35','2026-05-25 14:43:35',0),
  (2,'冷链','2026-05-25 14:43:35','2026-05-25 14:43:35',0);

-- 密度区间单价数据
INSERT INTO `price_rule` VALUES
  (1,1,0.0000,100.0000,5.00,'2026-05-25 14:43:35','2026-05-25 14:43:35',0),
  (2,1,100.0000,500.0000,4.50,'2026-05-25 14:43:35','2026-05-25 14:43:35',0),
  (3,1,500.0000,9999.0000,4.00,'2026-05-25 14:43:35','2026-05-25 14:43:35',0),
  (4,2,0.0000,200.0000,8.00,'2026-05-25 14:43:35','2026-05-25 14:43:35',0),
  (5,2,200.0000,9999.0000,7.00,'2026-05-25 14:43:35','2026-05-25 14:43:35',0);
