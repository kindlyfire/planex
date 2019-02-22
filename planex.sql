
-- Adminer 4.7.1 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP DATABASE IF EXISTS `planex`;
CREATE DATABASE `planex` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `planex`;

DROP TABLE IF EXISTS `classes`;
CREATE TABLE `classes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `schedule_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `schedule_id` (`schedule_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`) ON DELETE CASCADE,
  CONSTRAINT `classes_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `class_groups` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=477 DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `class_groups`;
CREATE TABLE `class_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `schedule_id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `availability_json` text NOT NULL,
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `schedule_id` (`schedule_id`),
  CONSTRAINT `class_groups_ibfk_2` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `constraints`;
CREATE TABLE `constraints` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `schedule_id` int(11) NOT NULL,
  `type` text NOT NULL,
  `data_json` text NOT NULL,
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `schedule_id` (`schedule_id`),
  CONSTRAINT `constraints_ibfk_1` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `constraints_exam_instances`;
CREATE TABLE `constraints_exam_instances` (
  `constraint_id` int(11) NOT NULL,
  `exam_instance_id` int(11) NOT NULL,
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  KEY `constraint_id` (`constraint_id`),
  KEY `exam_instance_id` (`exam_instance_id`),
  CONSTRAINT `constraints_exam_instances_ibfk_1` FOREIGN KEY (`constraint_id`) REFERENCES `constraints` (`id`) ON DELETE CASCADE,
  CONSTRAINT `constraints_exam_instances_ibfk_2` FOREIGN KEY (`exam_instance_id`) REFERENCES `exam_instances` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `constraints_teachers`;
CREATE TABLE `constraints_teachers` (
  `constraint_id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  KEY `constraint_id` (`constraint_id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `constraints_teachers_ibfk_1` FOREIGN KEY (`constraint_id`) REFERENCES `constraints` (`id`) ON DELETE CASCADE,
  CONSTRAINT `constraints_teachers_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `exams`;
CREATE TABLE `exams` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `schedule_id` int(11) NOT NULL,
  `name` text NOT NULL,
  `length` smallint(6) NOT NULL DEFAULT '4',
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `schedule_id` (`schedule_id`),
  CONSTRAINT `exams_ibfk_2` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `exam_instances`;
CREATE TABLE `exam_instances` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `exam_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `description` varchar(64) NOT NULL,
  `autoadd_classes` int(11) NOT NULL DEFAULT '1',
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `exam_id` (`exam_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `exam_instances_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE,
  CONSTRAINT `exam_instances_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `class_groups` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `exam_instances_classes`;
CREATE TABLE `exam_instances_classes` (
  `exam_instance_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  KEY `exam_instance_id` (`exam_instance_id`),
  KEY `class_id` (`class_id`),
  CONSTRAINT `exam_instances_classes_ibfk_1` FOREIGN KEY (`exam_instance_id`) REFERENCES `exam_instances` (`id`) ON DELETE CASCADE,
  CONSTRAINT `exam_instances_classes_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `exam_instances_teachers`;
CREATE TABLE `exam_instances_teachers` (
  `exam_instance_id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  KEY `exam_instance_id` (`exam_instance_id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `exam_instances_teachers_ibfk_1` FOREIGN KEY (`exam_instance_id`) REFERENCES `exam_instances` (`id`) ON DELETE CASCADE,
  CONSTRAINT `exam_instances_teachers_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `schedules`;
CREATE TABLE `schedules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `start_day` tinyint(4) NOT NULL,
  `days` tinyint(4) NOT NULL,
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `solutions`;
CREATE TABLE `solutions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `schedule_id` int(11) NOT NULL,
  `days` int(11) NOT NULL,
  `starred` tinyint(4) NOT NULL DEFAULT '0',
  `name` text NOT NULL,
  `status` varchar(16) NOT NULL,
  `solution_data` longtext NOT NULL,
  `solver_output` text NOT NULL,
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `schedule_id` (`schedule_id`),
  CONSTRAINT `solutions_ibfk_2` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=151 DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `teachers`;
CREATE TABLE `teachers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `schedule_id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `size` int(11) NOT NULL,
  `email` varchar(128) NOT NULL,
  `availability_json` text NOT NULL,
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `schedule_id` (`schedule_id`),
  CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=latin1;


-- 2019-02-22 18:55:15
