/*
Host: 127.0.0.1
Erstellungszeit: 20. Jul 2020 um 10:45
Server-Version: 10.4.8-MariaDB
PHP-Version: 7.3.11
*/
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

/*
 Datenbank: `inventur`
*/
CREATE DATABASE IF NOT EXISTS `inventur` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `inventur`;

/*#######################################################

Tabellenstruktur für Tabelle `artikel`
*/

-- phpMyAdmin SQL Dump
-- version 4.8.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 12. Okt 2020 um 08:50
-- Server-Version: 10.1.33-MariaDB
-- PHP-Version: 7.2.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `inventur`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `artikel`
--

CREATE TABLE `artikel` (
  `id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `keywords` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `artikel`
--

INSERT INTO `artikel` (`id`, `name`, `category`, `keywords`) VALUES
(1, 'Kugelschreiber', 'Schreibwaren', 'Stifte'),
(2, 'HDMI Kabel 2M', 'Kabel', 'Hardware'),
(3, 'test', 'Hardware', 'Wichtig'),
(4, 'kuhkuhk', 'Hardware', 'HDMI'),
(5, 'wwwwwwww', 'Hardware', 'Kabel,Stifte'),
(6, 'efesfse', 'Hardware', 'Hardware,HDMI'),
(7, 'efsfsefsef', 'Hardware', 'Hardware'),
(8, 'gsegsegseg', 'Hardware', 'HDMI'),
(9, 'gesgsege', 'Hardware', 'Hardware'),
(10, 'fesfse', 'Hardware', 'Hardware'),
(11, 'hrdhdrhdr', 'Hardware', 'Hardware,Kabel'),
(12, 'uweser', 'Hardware', 'HDMI,Stifte'),
(13, 'hserhser', 'Hardware', 'HDMI,Stifte'),
(14, 'trhrthsrths', 'Hardware', 'Hardware'),
(15, 'erhaerhe', 'Hardware', 'Hardware'),
(16, 'hthfthtfth', 'Hardware', 'HDMI'),
(17, 'rdgdrgdrg', 'Hardware', 'Hardware'),
(18, 'rghrgsdg', 'Hardware', 'HDMI'),
(19, 'uuwseuw', 'Hardware', 'HDMI'),
(20, 'fsefse', 'Hardware', 'HDMI'),
(21, 'Neuer Artikel', 'Hardware', 'Kabel'),
(22, 'zkuuzk', 'Hardware', 'Hardware'),
(23, 'Maus', 'Hardware', 'Kabel'),
(24, '5zrz', 'Hardware', ''),
(25, 'dgr', 'Hardware', '');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `artikelliste`
--

CREATE TABLE `artikelliste` (
  `id` int(255) NOT NULL,
  `artikelid` int(255) NOT NULL,
  `regalid` int(15) NOT NULL,
  `number` int(255) NOT NULL,
  `minimum_number` int(255) NOT NULL,
  `lagerplatz` int(255) NOT NULL,
  `creator` varchar(255) NOT NULL,
  `change_by` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `time` varchar(255) NOT NULL,
  `deleted` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `artikelliste`
--

INSERT INTO `artikelliste` (`id`, `artikelid`, `regalid`, `number`, `minimum_number`, `lagerplatz`, `creator`, `change_by`, `date`, `time`, `deleted`) VALUES
(26, 1, 1, 5, 55, 13, 'wmacher', 'wmacher', '07.10.2020', '09:17', 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `kategorie`
--

CREATE TABLE `kategorie` (
  `kategorie` varchar(150) NOT NULL,
  `number` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `kategorie`
--

INSERT INTO `kategorie` (`kategorie`, `number`) VALUES
('Hardware', 3),
('Kabel', 1),
('Schreibwaren', 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `keywords`
--

CREATE TABLE `keywords` (
  `keywords` varchar(150) NOT NULL,
  `number` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `keywords`
--

INSERT INTO `keywords` (`keywords`, `number`) VALUES
('1. Lehrjahr', 0),
('efsfe', 0),
('fse', 0),
('gesgse', 0),
('Hardware', 1),
('HDMI', 0),
('Kabel', 2),
('Stifte', 1),
('tert', 0),
('weg', 0),
('Wichtig', 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `log`
--

CREATE TABLE `log` (
  `id` int(255) NOT NULL,
  `event` varchar(255) NOT NULL,
  `artikelnummer` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `keywords` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `time` varchar(255) NOT NULL,
  `creator` varchar(255) NOT NULL,
  `change_by` varchar(255) NOT NULL,
  `number` int(255) NOT NULL,
  `minimum_number` int(255) NOT NULL,
  `deleted` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `log`
--

INSERT INTO `log` (`id`, `event`, `artikelnummer`, `name`, `category`, `keywords`, `location`, `date`, `time`, `creator`, `change_by`, `number`, `minimum_number`, `deleted`) VALUES
(1, 'create', 1, 'Kugelschreiber', 'Schreibwaren', 'Stifte', 'Schreibtisch', '16.09.2020', '09:21', 'wmacher', 'wmacher', 0, 10, 0),
(2, 'create', 2, 'HDMI Kabel 2M', 'Kabel', 'Hardware,HDMI,Kabel', 'Schrank #214', '16.09.2020', '09:24', 'wmacher', 'wmacher', 23, 5, 0),
(3, 'create', 3, 'test', 'Hardware', 'Wichtig', 'Schrank #214', '16.09.2020', '09:40', 'wmacher', 'wmacher', 23, 234, 0),
(4, 'change', 3, 'test', 'Hardware', 'Wichtig', 'Schrank #214', '16.09.2020', '09:41', 'wmacher', 'wmacher', 22, 234, 0),
(5, 'create', 4, 'kuhkuhk', 'Hardware', 'HDMI', 'Schrank #214', '17.09.2020', '13:29', 'mmustermann', 'mmustermann', 678, 678, 0),
(6, 'create', 5, 'wwwwwwww', 'Hardware', 'Kabel,Stifte', 'Schrank #214', '17.09.2020', '13:31', 'mmustermann', 'mmustermann', 66, 345, 0),
(7, 'create', 6, 'efesfse', 'Hardware', 'Hardware,HDMI', 'Schrank #214', '17.09.2020', '13:37', 'mmustermann', 'mmustermann', 42, 23, 0),
(8, 'change', 6, 'efesfse', 'Hardware', 'Hardware,HDMI', 'Schrank #214', '17.09.2020', '13:38', 'mmustermann', 'mmustermann', 62, 23, 0),
(9, 'create', 7, 'efsfsefsef', 'Hardware', 'Hardware', 'Schrank #214', '17.09.2020', '13:38', 'mmustermann', 'mmustermann', 354, 345, 0),
(10, 'create', 8, 'gsegsegseg', 'Hardware', 'HDMI', 'Schrank #214', '17.09.2020', '13:39', 'mmustermann', 'mmustermann', 534, 345, 0),
(11, 'create', 9, 'gesgsege', 'Hardware', 'Hardware', 'Schrank #214', '17.09.2020', '13:41', 'mmustermann', 'mmustermann', 345, 345, 0),
(12, 'create', 10, 'fesfse', 'Hardware', 'Hardware', 'Schrank #214', '17.09.2020', '13:44', 'mmustermann', 'mmustermann', 534, 5345, 0),
(13, 'create', 11, 'hrdhdrhdr', 'Hardware', 'Hardware,Kabel', 'Schrank #214', '17.09.2020', '13:44', 'mmustermann', 'mmustermann', 34, 5345, 0),
(14, 'create', 12, 'uweser', 'Hardware', 'HDMI,Stifte', 'Schrank #214', '17.09.2020', '13:45', 'mmustermann', 'mmustermann', 435, 34534, 0),
(15, 'create', 13, 'hserhser', 'Hardware', 'HDMI,Stifte', 'Schrank #214', '17.09.2020', '13:46', 'mmustermann', 'mmustermann', 346, 3463, 0),
(16, 'create', 14, 'trhrthsrths', 'Hardware', 'Hardware', 'Schrank #214', '17.09.2020', '13:46', 'mmustermann', 'mmustermann', 456, 456, 0),
(17, 'create', 15, 'erhaerhe', 'Hardware', 'Hardware', 'Schrank #214', '17.09.2020', '13:47', 'mmustermann', 'mmustermann', 345, 345, 0),
(18, 'create', 16, 'hthfthtfth', 'Hardware', 'HDMI', 'Schrank #214', '17.09.2020', '13:48', 'mmustermann', 'mmustermann', 5756, 567, 0),
(19, 'create', 17, 'rdgdrgdrg', 'Hardware', 'Hardware', 'Schrank #214', '17.09.2020', '13:53', 'mmustermann', 'mmustermann', 345, 435, 0),
(20, 'create', 18, 'rghrgsdg', 'Hardware', 'HDMI', 'Schrank #214', '17.09.2020', '13:54', 'mmustermann', 'mmustermann', 345, 345, 0),
(21, 'create', 19, 'uuwseuw', 'Hardware', 'HDMI', 'Schrank #214', '17.09.2020', '13:55', 'mmustermann', 'mmustermann', 345, 345, 0),
(22, 'create', 20, 'fsefse', 'Hardware', 'HDMI', 'Schrank #214', '17.09.2020', '14:04', 'mmustermann', 'mmustermann', 345, 345, 0),
(23, 'create', 21, 'Neuer Artikel', 'Hardware', 'Kabel', 'Schrank #214', '17.09.2020', '14:06', 'mmustermann', 'mmustermann', 243, 432, 0),
(24, 'create', 22, 'zkuuzk', 'Hardware', 'Hardware', 'Schrank #214', '17.09.2020', '14:17', 'mmustermann', 'mmustermann', 675, 567, 0),
(25, 'delete', 4, 'kuhkuhk', 'Hardware', 'HDMI', 'Schrank #214', '17.09.2020', '14:20', 'mmustermann', 'mmustermann', 678, 678, 1),
(26, 'delete', 5, 'wwwwwwww', 'Hardware', 'Kabel,Stifte', 'Schrank #214', '17.09.2020', '14:20', 'mmustermann', 'mmustermann', 66, 345, 1),
(27, 'delete', 6, 'efesfse', 'Hardware', 'Hardware,HDMI', 'Schrank #214', '17.09.2020', '14:20', 'mmustermann', 'mmustermann', 62, 23, 1),
(28, 'delete', 7, 'efsfsefsef', 'Hardware', 'Hardware', 'Schrank #214', '17.09.2020', '14:20', 'mmustermann', 'mmustermann', 354, 345, 1),
(29, 'delete', 8, 'gsegsegseg', 'Hardware', 'HDMI', 'Schrank #214', '17.09.2020', '14:20', 'mmustermann', 'mmustermann', 534, 345, 1),
(30, 'delete', 9, 'gesgsege', 'Hardware', 'Hardware', 'Schrank #214', '17.09.2020', '14:20', 'mmustermann', 'mmustermann', 345, 345, 1),
(31, 'delete', 10, 'fesfse', 'Hardware', 'Hardware', 'Schrank #214', '17.09.2020', '14:20', 'mmustermann', 'mmustermann', 534, 5345, 1),
(32, 'delete', 11, 'hrdhdrhdr', 'Hardware', 'Hardware,Kabel', 'Schrank #214', '17.09.2020', '14:20', 'mmustermann', 'mmustermann', 34, 5345, 1),
(33, 'delete', 12, 'uweser', 'Hardware', 'HDMI,Stifte', 'Schrank #214', '17.09.2020', '14:20', 'mmustermann', 'mmustermann', 435, 34534, 1),
(34, 'delete', 13, 'hserhser', 'Hardware', 'HDMI,Stifte', 'Schrank #214', '17.09.2020', '14:20', 'mmustermann', 'mmustermann', 346, 3463, 1),
(35, 'delete', 14, 'trhrthsrths', 'Hardware', 'Hardware', 'Schrank #214', '17.09.2020', '14:20', 'mmustermann', 'mmustermann', 456, 456, 1),
(36, 'delete', 15, 'erhaerhe', 'Hardware', 'Hardware', 'Schrank #214', '17.09.2020', '14:20', 'mmustermann', 'mmustermann', 345, 345, 1),
(37, 'delete', 16, 'hthfthtfth', 'Hardware', 'HDMI', 'Schrank #214', '17.09.2020', '14:20', 'mmustermann', 'mmustermann', 5756, 567, 1),
(38, 'delete', 17, 'rdgdrgdrg', 'Hardware', 'Hardware', 'Schrank #214', '17.09.2020', '14:20', 'mmustermann', 'mmustermann', 345, 435, 1),
(39, 'delete', 18, 'rghrgsdg', 'Hardware', 'HDMI', 'Schrank #214', '17.09.2020', '14:20', 'mmustermann', 'mmustermann', 345, 345, 1),
(40, 'delete', 19, 'uuwseuw', 'Hardware', 'HDMI', 'Schrank #214', '17.09.2020', '14:20', 'mmustermann', 'mmustermann', 345, 345, 1),
(41, 'delete', 22, 'zkuuzk', 'Hardware', 'Hardware', 'Schrank #214', '17.09.2020', '14:20', 'mmustermann', 'mmustermann', 675, 567, 1),
(42, 'delete', 20, 'fsefse', 'Hardware', 'HDMI', 'Schrank #214', '17.09.2020', '14:20', 'mmustermann', 'mmustermann', 345, 345, 1),
(43, 'create', 23, 'Maus', 'Hardware', 'Kabel', 'Schrank #214', '17.09.2020', '14:26', 'wmacher', 'wmacher', 1, 5, 0),
(44, 'create', 24, '5zrz', 'Hardware', '', 'Schrank #214', '30.09.2020', '14:11', 'wmacher', 'wmacher', 23, 234, 0),
(45, 'delete', 24, '5zrz', 'Hardware', '', 'Schrank #214', '30.09.2020', '14:11', 'wmacher', 'wmacher', 23, 234, 1),
(46, 'create', 25, 'dgr', 'Hardware', '', 'Schrank #214', '30.09.2020', '14:21', 'wmacher', 'wmacher', 35, 0, 0),
(47, 'delete', 25, 'dgr', 'Hardware', '', 'Schrank #214', '30.09.2020', '14:21', 'wmacher', 'wmacher', 35, 0, 1),
(48, 'change', 2, 'HDMI Kabel 2M', 'Kabel', 'Hardware', 'Schrank #214', '01.10.2020', '07:51', 'wmacher', 'wmacher', 24, 5, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ort`
--

CREATE TABLE `ort` (
  `ort` varchar(150) NOT NULL,
  `number` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `ort`
--

INSERT INTO `ort` (`ort`, `number`) VALUES
('Schrank #214', 4),
('Schreibtisch', 1),
('test', 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `raum`
--

CREATE TABLE `raum` (
  `id` int(15) NOT NULL,
  `raumname` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `raum`
--

INSERT INTO `raum` (`id`, `raumname`) VALUES
(1, 'Keller'),
(2, 'Raum2'),
(3, 'Raum3');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `regal`
--

CREATE TABLE `regal` (
  `id` int(15) NOT NULL,
  `raumid` int(15) NOT NULL,
  `regalname` varchar(255) NOT NULL,
  `fachanzahl` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `regal`
--

INSERT INTO `regal` (`id`, `raumid`, `regalname`, `fachanzahl`) VALUES
(1, 1, 'Regal1', 35),
(4, 1, 'Regal2', 23),
(5, 2, 'Regal1', 42);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `artikel`
--
ALTER TABLE `artikel`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `artikelliste`
--
ALTER TABLE `artikelliste`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `regalid` (`regalid`),
  ADD UNIQUE KEY `artikelid` (`artikelid`);

--
-- Indizes für die Tabelle `kategorie`
--
ALTER TABLE `kategorie`
  ADD PRIMARY KEY (`kategorie`);

--
-- Indizes für die Tabelle `keywords`
--
ALTER TABLE `keywords`
  ADD PRIMARY KEY (`keywords`);

--
-- Indizes für die Tabelle `log`
--
ALTER TABLE `log`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `ort`
--
ALTER TABLE `ort`
  ADD PRIMARY KEY (`ort`);

--
-- Indizes für die Tabelle `raum`
--
ALTER TABLE `raum`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `regal`
--
ALTER TABLE `regal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `raumId` (`raumid`) USING BTREE;

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `artikel`
--
ALTER TABLE `artikel`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT für Tabelle `artikelliste`
--
ALTER TABLE `artikelliste`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT für Tabelle `log`
--
ALTER TABLE `log`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT für Tabelle `raum`
--
ALTER TABLE `raum`
  MODIFY `id` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `regal`
--
ALTER TABLE `regal`
  MODIFY `id` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `artikelliste`
--
ALTER TABLE `artikelliste`
  ADD CONSTRAINT `artikelliste_ibfk_1` FOREIGN KEY (`regalid`) REFERENCES `regal` (`id`),
  ADD CONSTRAINT `artikelliste_ibfk_2` FOREIGN KEY (`artikelid`) REFERENCES `artikel` (`id`);

--
-- Constraints der Tabelle `regal`
--
ALTER TABLE `regal`
  ADD CONSTRAINT `regal_ibfk_1` FOREIGN KEY (`raumid`) REFERENCES `raum` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
