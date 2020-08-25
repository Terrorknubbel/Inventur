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

CREATE TABLE `artikel` (
  `id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `keywords` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*########################################################

Tabellenstruktur für Tabelle `artikelliste`
*/

CREATE TABLE `artikelliste` (
  `id` int(255) NOT NULL,
  `artikelid` int(255) NOT NULL,
  `number` int(255) NOT NULL,
  `minimum_number` int(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `creator` varchar(255) NOT NULL,
  `change_by` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `time` varchar(255) NOT NULL,
  `deleted` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*########################################################

Tabellenstruktur für Tabelle `kategorie`
*/

CREATE TABLE `kategorie` (
  `kategorie` varchar(150) NOT NULL,
  `number` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*########################################################

Tabellenstruktur für Tabelle `keywords`
*/

CREATE TABLE `keywords` (
  `keywords` varchar(150) NOT NULL,
  `number` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*########################################################

Tabellenstruktur für Tabelle `log`
*/

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

/*########################################################

Tabellenstruktur für Tabelle `ort`
*/

CREATE TABLE `ort` (
  `ort` varchar(150) NOT NULL,
  `number` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*########################################################

Indizes für die Tabelle `artikel`
*/
ALTER TABLE `artikel`
  ADD PRIMARY KEY (`id`);

/*
Indizes für die Tabelle `artikelliste`
*/
ALTER TABLE `artikelliste`
  ADD PRIMARY KEY (`id`);

/*
## Indizes für die Tabelle `kategorie`
*/
ALTER TABLE `kategorie`
  ADD PRIMARY KEY (`kategorie`);

/*
## Indizes für die Tabelle `keywords`
*/
ALTER TABLE `keywords`
  ADD PRIMARY KEY (`keywords`);

/*
## Indizes für die Tabelle `log`
*/
ALTER TABLE `log`
  ADD PRIMARY KEY (`id`);

/*
## Indizes für die Tabelle `ort`
*/
ALTER TABLE `ort`
  ADD PRIMARY KEY (`ort`);

/*
/*
## AUTO_INCREMENT für Tabelle `artikel`
*/
ALTER TABLE `artikel`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

/*
## AUTO_INCREMENT für Tabelle `artikelliste`
*/
ALTER TABLE `artikelliste`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

/*

## AUTO_INCREMENT für Tabelle `log`
*/
ALTER TABLE `log`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

