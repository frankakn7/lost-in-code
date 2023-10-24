CREATE DATABASE  IF NOT EXISTS `db_lost_in_code` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `db_lost_in_code`;
-- MySQL dump 10.13  Distrib 8.0.33, for macos13 (arm64)
--
-- Host: localhost    Database: db_lost_in_code
-- ------------------------------------------------------
-- Server version	8.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `chapter`
--

DROP TABLE IF EXISTS `chapter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chapter` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `material` text,
  `curriculum_id` int NOT NULL,
  `order_position` int NOT NULL COMMENT 'The position of the chapter in the curriculum',
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `curriculum_id_idx` (`curriculum_id`),
  CONSTRAINT `curriculum_chapter` FOREIGN KEY (`curriculum_id`) REFERENCES `curriculum` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `chapter_questions`
--

DROP TABLE IF EXISTS `chapter_questions`;
/*!50001 DROP VIEW IF EXISTS `chapter_questions`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `chapter_questions` AS SELECT 
 1 AS `chapter_id`,
 1 AS `chapter_name`,
 1 AS `chapter_material`,
 1 AS `chapter_curriculum_id`,
 1 AS `chapter_order_position`,
 1 AS `question_id`,
 1 AS `question_text`,
 1 AS `hint`,
 1 AS `type`,
 1 AS `difficulty`,
 1 AS `code_text`,
 1 AS `question_element_id`,
 1 AS `question_element_content`,
 1 AS `question_element_element_identifier`,
 1 AS `question_element_correct_order_position`,
 1 AS `question_element_is_correct`,
 1 AS `correct_answer_id`,
 1 AS `answer`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `correct_answer`
--

DROP TABLE IF EXISTS `correct_answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `correct_answer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `answer` text,
  `question_element_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `question_element_correct_answer_idx` (`question_element_id`),
  CONSTRAINT `question_element_correct_answer` FOREIGN KEY (`question_element_id`) REFERENCES `question_element` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `curriculum`
--

DROP TABLE IF EXISTS `curriculum`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curriculum` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `description` text,
  `prog_lang` varchar(45) NOT NULL DEFAULT 'php',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ID_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `curriculum_chapters`
--

DROP TABLE IF EXISTS `curriculum_chapters`;
/*!50001 DROP VIEW IF EXISTS `curriculum_chapters`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `curriculum_chapters` AS SELECT 
 1 AS `curriculum_id`,
 1 AS `curriculum_name`,
 1 AS `curriculum_description`,
 1 AS `curriculum_prog_lang`,
 1 AS `chapter_id`,
 1 AS `chapter_name`,
 1 AS `chapter_material`,
 1 AS `chapter_order_position`,
 1 AS `chapter_curriculum_id`,
 1 AS `question_id`,
 1 AS `question_text`,
 1 AS `hint`,
 1 AS `type`,
 1 AS `difficulty`,
 1 AS `code_text`,
 1 AS `question_element_id`,
 1 AS `question_element_content`,
 1 AS `question_element_element_identifier`,
 1 AS `question_element_correct_order_position`,
 1 AS `question_element_is_correct`,
 1 AS `correct_answer_id`,
 1 AS `answer`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `full_question`
--

DROP TABLE IF EXISTS `full_question`;
/*!50001 DROP VIEW IF EXISTS `full_question`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `full_question` AS SELECT 
 1 AS `question_id`,
 1 AS `question_text`,
 1 AS `hint`,
 1 AS `type`,
 1 AS `difficulty`,
 1 AS `code_text`,
 1 AS `chapter_id`,
 1 AS `question_element_id`,
 1 AS `question_element_content`,
 1 AS `question_element_element_identifier`,
 1 AS `question_element_correct_order_position`,
 1 AS `question_element_is_correct`,
 1 AS `correct_answer_id`,
 1 AS `answer`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `game_state`
--

DROP TABLE IF EXISTS `game_state`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_state` (
  `id` int NOT NULL AUTO_INCREMENT,
  `state_data` json NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`),
  KEY `game_state_user_idx` (`user_id`),
  CONSTRAINT `user_game_state` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `group`
--

DROP TABLE IF EXISTS `group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `description` text,
  `curriculum_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `curriculum_group_idx` (`curriculum_id`),
  CONSTRAINT `curriculum_group` FOREIGN KEY (`curriculum_id`) REFERENCES `curriculum` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question_text` text NOT NULL,
  `hint` text,
  `type` enum('CHOICE','SINGLE_INPUT','CLOZE','DRAG_DROP','SELECT_ONE','CREATE') NOT NULL,
  `difficulty` tinyint NOT NULL,
  `code_text` text,
  `chapter_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `chapter_question_idx` (`chapter_id`),
  CONSTRAINT `chapter_question` FOREIGN KEY (`chapter_id`) REFERENCES `chapter` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `question_element`
--

DROP TABLE IF EXISTS `question_element`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question_element` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text,
  `element_identifier` varchar(45) DEFAULT NULL,
  `correct_order_position` int DEFAULT NULL,
  `is_correct` tinyint DEFAULT NULL,
  `question_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `question_question_element_idx` (`question_id`),
  CONSTRAINT `question_question_element` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `password_hash` char(60) NOT NULL,
  `group_id` int DEFAULT NULL,
  `role` enum('USER','ADMIN') NOT NULL DEFAULT 'USER',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `group_user_idx` (`group_id`),
  CONSTRAINT `group_user` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','admin@admin','$2b$10$nzqtgyBVJC3mJReLVcitU.rphDfJJzGyxi8ZdQi8DatdmYuCoUsuq',NULL,'ADMIN');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `user_game_curriculum`
--

DROP TABLE IF EXISTS `user_game_curriculum`;
/*!50001 DROP VIEW IF EXISTS `user_game_curriculum`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `user_game_curriculum` AS SELECT 
 1 AS `user_id`,
 1 AS `username`,
 1 AS `email`,
 1 AS `role`,
 1 AS `game_state`,
 1 AS `group_id`,
 1 AS `group_name`,
 1 AS `curriculum_id`,
 1 AS `curriculum_name`,
 1 AS `curriculum_description`,
 1 AS `curriculum_prog_lang`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `chapter_questions`
--

/*!50001 DROP VIEW IF EXISTS `chapter_questions`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `chapter_questions` AS select `chapter`.`id` AS `chapter_id`,`chapter`.`name` AS `chapter_name`,`chapter`.`material` AS `chapter_material`,`chapter`.`curriculum_id` AS `chapter_curriculum_id`,`chapter`.`order_position` AS `chapter_order_position`,`full_question`.`question_id` AS `question_id`,`full_question`.`question_text` AS `question_text`,`full_question`.`hint` AS `hint`,`full_question`.`type` AS `type`,`full_question`.`difficulty` AS `difficulty`,`full_question`.`code_text` AS `code_text`,`full_question`.`question_element_id` AS `question_element_id`,`full_question`.`question_element_content` AS `question_element_content`,`full_question`.`question_element_element_identifier` AS `question_element_element_identifier`,`full_question`.`question_element_correct_order_position` AS `question_element_correct_order_position`,`full_question`.`question_element_is_correct` AS `question_element_is_correct`,`full_question`.`correct_answer_id` AS `correct_answer_id`,`full_question`.`answer` AS `answer` from ((`chapter` join `question` on((`chapter`.`id` = `question`.`chapter_id`))) join `full_question` on((`question`.`id` = `full_question`.`question_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `curriculum_chapters`
--

/*!50001 DROP VIEW IF EXISTS `curriculum_chapters`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `curriculum_chapters` AS select `curriculum`.`id` AS `curriculum_id`,`curriculum`.`name` AS `curriculum_name`,`curriculum`.`description` AS `curriculum_description`,`curriculum`.`prog_lang` AS `curriculum_prog_lang`,`chapter`.`id` AS `chapter_id`,`chapter`.`name` AS `chapter_name`,`chapter`.`material` AS `chapter_material`,`chapter`.`order_position` AS `chapter_order_position`,`chapter`.`curriculum_id` AS `chapter_curriculum_id`,`chapter_questions`.`question_id` AS `question_id`,`chapter_questions`.`question_text` AS `question_text`,`chapter_questions`.`hint` AS `hint`,`chapter_questions`.`type` AS `type`,`chapter_questions`.`difficulty` AS `difficulty`,`chapter_questions`.`code_text` AS `code_text`,`chapter_questions`.`question_element_id` AS `question_element_id`,`chapter_questions`.`question_element_content` AS `question_element_content`,`chapter_questions`.`question_element_element_identifier` AS `question_element_element_identifier`,`chapter_questions`.`question_element_correct_order_position` AS `question_element_correct_order_position`,`chapter_questions`.`question_element_is_correct` AS `question_element_is_correct`,`chapter_questions`.`correct_answer_id` AS `correct_answer_id`,`chapter_questions`.`answer` AS `answer` from ((`curriculum` left join `chapter` on((`curriculum`.`id` = `chapter`.`curriculum_id`))) left join `chapter_questions` on((`chapter`.`id` = `chapter_questions`.`chapter_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `full_question`
--

/*!50001 DROP VIEW IF EXISTS `full_question`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `full_question` AS select `question`.`id` AS `question_id`,`question`.`question_text` AS `question_text`,`question`.`hint` AS `hint`,`question`.`type` AS `type`,`question`.`difficulty` AS `difficulty`,`question`.`code_text` AS `code_text`,`question`.`chapter_id` AS `chapter_id`,`question_element`.`id` AS `question_element_id`,`question_element`.`content` AS `question_element_content`,`question_element`.`element_identifier` AS `question_element_element_identifier`,`question_element`.`correct_order_position` AS `question_element_correct_order_position`,`question_element`.`is_correct` AS `question_element_is_correct`,`correct_answer`.`id` AS `correct_answer_id`,`correct_answer`.`answer` AS `answer` from ((`question` join `question_element` on((`question`.`id` = `question_element`.`question_id`))) left join `correct_answer` on((`question_element`.`id` = `correct_answer`.`question_element_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `user_game_curriculum`
--

/*!50001 DROP VIEW IF EXISTS `user_game_curriculum`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `user_game_curriculum` AS select `u`.`id` AS `user_id`,`u`.`username` AS `username`,`u`.`email` AS `email`,`u`.`role` AS `role`,`gs`.`state_data` AS `game_state`,`g`.`id` AS `group_id`,`g`.`name` AS `group_name`,`c`.`id` AS `curriculum_id`,`c`.`name` AS `curriculum_name`,`c`.`description` AS `curriculum_description`,`c`.`prog_lang` AS `curriculum_prog_lang` from (((`user` `u` left join `game_state` `gs` on((`u`.`id` = `gs`.`user_id`))) join `group` `g` on((`u`.`group_id` = `g`.`id`))) join `curriculum` `c` on((`g`.`curriculum_id` = `c`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-23 20:03:24
