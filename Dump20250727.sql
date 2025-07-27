-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: bookstore
-- ------------------------------------------------------
-- Server version	9.3.0

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
-- Table structure for table `authors`
--

DROP TABLE IF EXISTS `authors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `biography` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authors`
--

LOCK TABLES `authors` WRITE;
/*!40000 ALTER TABLE `authors` DISABLE KEYS */;
INSERT INTO `authors` VALUES (1,'Лев','Толстой','Русский писатель, мыслитель, философ','2025-07-20 10:59:40'),(2,'Федор','Достоевский','Русский писатель, мыслитель, философ','2025-07-20 10:59:40'),(3,'Александр','Пушкин','Русский поэт, драматург и прозаик','2025-07-20 10:59:40'),(4,'Джордж','Оруэлл','Английский писатель и публицист','2025-07-20 10:59:40'),(5,'Джон','Толкин','Английский писатель, лингвист, филолог','2025-07-20 10:59:40');
/*!40000 ALTER TABLE `authors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isbn` varchar(13) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `author_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int DEFAULT '0',
  `cover_image` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `book_text` mediumtext COLLATE utf8mb4_unicode_ci,
  `year_written` varchar(4) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `isbn` (`isbn`),
  KEY `author_id` (`author_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `books_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE SET NULL,
  CONSTRAINT `books_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (1,'Первая книжка','123',1,1,'Тестовое описание',120.00,3,'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/%D0%A4%D0%BE%D1%82%D0%BE%D0%BF%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_%D0%9B._%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B3%D0%BE_%28%D0%A8%D0%B5%D1%80%D0%B5%D1%80%2C_%D0%9D%D0%B0%D0%B1%D0%B3%D0%BE%D0%BB%D1%8C%D1%86_%D0%B8_%D0%9A%D0%BE%29_%28cropped%29.jpg/250px-%D0%A4%D0%BE%D1%82%D0%BE%D0%BF%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_%D0%9B._%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B3%D0%BE_%28%D0%A8%D0%B5%D1%80%D0%B5%D1%80%2C_%D0%9D%D0%B0%D0%B1%D0%B3%D0%BE%D0%BB%D1%8C%D1%86_%D0%B8_%D0%9A%D0%BE%29_%28cropped%29.jpg','2025-07-20 12:02:54','2025-07-27 13:43:33','Аверченко Аркадий Тимофеевич (1881–1925) – русский писатель, журналист, редактор журнала «Сатирикон», один из самых известных сатириков начала XX века.\n\nВ книгу вошел авторский сборник «Рассказы для выздоравливающих», наполненный «шумом, весельем, беззаботностью, бодростью и молодой дерзновенной силой».','1995'),(3,'Вторая книга','345',3,4,'Тестовое описание 2',400.00,5,'https://stuki-druki.com/biofoto4/poet-alexandr-pushkin.jpg','2025-07-20 15:48:50','2025-07-27 13:44:03','В 1811 году родители Пушкина решили отдать сына в Иезуитский коллегиум, но их планы изменились, когда в Царском Селе﻿ открылся лицей для дворянских детей﻿. По протекции друзей Пушкины устроили 12-летнего сына в элитное заведение. Изначально здесь собирались готовить детей из императорской семьи и их сверстников к высшим гражданским чинам. Но статус Лицея понизился: Пушкин учился в привилегированном и закрытом учреждении, но среди равных себе детей из обедневших фамилий. В стенах Лицея многие крепко сдружились. Три товарища — Иван Пущин﻿, Антон Дельвиг, Вильгельм Кюхельбекер﻿ — остались друзьями Пушкина﻿ на всю жизнь.\nВ Лицее преподавали известный юрист Александр Куницын, философ Александр Галич, филолог Николай Кошанский. Именно профессора в большей степени влияли на интеллектуальное и нравственное становление лицеистов — родные могли навещать своих детей только по выходным. В будние дни занятия начинались в семь утра и продолжались до позднего вечера. В годы учебы Александр Пушкин воспринимал альма-матер как «монастырь» и мечтал о свободе, которая наступит с окончанием Лицея.\nУчился Пушкин не очень хорошо, особенно тяжело юному писателю давались логика и математика. При блестящей памяти ему недоставало усидчивости и внимания. Однако преподаватели отмечали эрудицию воспитанника. В Лицее он продолжал много читать и писать тексты на французском языке. Лицеист Сергей Комовский вспоминал, что из-за любви к этому языку Пушкина «называли… в насмешку французом, а по физиономии и некоторым привычкам обезьяною и даже смесью обезьяны с тигром».\nНа русском языке Александр Пушкин составлял небольшие эпиграммы и послания, а также намечал структуру будущей автобиографии. Юного автора настолько увлекало литературное творчество, что идеи произведений рождались одна за другой на несколько месяцев вперед: «Вчера написал я третью главу «Фатама, или Разум человеческий». <…> Начал я комедию — не знаю, кончу ли ее. Третьего дня хотел я написать ироическую поэму «Игорь и Ольга». Летом напишу я «Картину Царского Села»». Писал Пушкин и стихотворения﻿. В 1814 году он впервые опубликовал одно из них — «К другу-стихотворцу»﻿ — под псевдонимом Александр Н.к.ш.п. в журнале «Вестник Европы».\nПервый крупный успех ждал Пушкина в 1815 году во время зимнего переводного экзамена — 15-летний лицеист прочитал свое стихотворение «Воспоминания в Царском Селе»﻿. На экзамене присутствовал Гавриил Державин﻿, он был потрясен творением юного поэта. Пушкин позже писал: «Не помню, как я кончил свое чтение; не помню, куда убежал. Державин был в восхищении; он меня требовал, хотел меня обнять… Меня искали, но не нашли».\nСлужба и карьера Пушкина','1901'),(4,'тест',NULL,1,1,NULL,1.00,4,'https://upload.wikimedia.org/wikipedia/commons/3/3c/Lev_Nikolayevich_Tolstoy_in_1910_by_Vladimir_Chertkov.jpg','2025-07-24 16:11:38','2025-07-27 13:44:43','Содержание книги','1920');
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Художественная литература','Романы, повести, рассказы','2025-07-20 10:59:40'),(2,'Научная фантастика','Фантастические произведения','2025-07-20 10:59:40'),(3,'Детективы','Детективные романы и повести','2025-07-20 10:59:40'),(4,'Учебная литература','Учебники и пособия','2025-07-20 10:59:40'),(5,'Бизнес','Книги по бизнесу и менеджменту','2025-07-20 10:59:40');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_books`
--

DROP TABLE IF EXISTS `user_books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_id` int NOT NULL,
  `is_purchased` tinyint(1) NOT NULL DEFAULT '0',
  `rent_end_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `book_id` (`book_id`),
  CONSTRAINT `user_books_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_books`
--

LOCK TABLES `user_books` WRITE;
/*!40000 ALTER TABLE `user_books` DISABLE KEYS */;
INSERT INTO `user_books` VALUES (3,1,1,NULL,'2025-07-20 14:28:53','2025-07-20 14:28:53'),(12,3,0,NULL,'2025-07-24 19:23:58','2025-07-27 13:21:28'),(14,4,0,'2025-07-27','2025-07-27 13:02:46','2025-07-27 13:21:28');
/*!40000 ALTER TABLE `user_books` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-27 16:52:20
