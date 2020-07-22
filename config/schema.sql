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


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

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
  `id` int(255) NOT NULL,
  `kategorie` varchar(255) NOT NULL,
  `number` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*########################################################

Tabellenstruktur für Tabelle `keywords`
*/

CREATE TABLE `keywords` (
  `id` int(255) NOT NULL,
  `keywords` varchar(255) NOT NULL,
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
  `id` int(255) NOT NULL,
  `ort` varchar(255) NOT NULL,
  `number` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*########################################################

Tabellenstruktur für Tabelle `user`
*/

CREATE TABLE `user` (
  `id` int(255) NOT NULL,
  `username` varchar(255) CHARACTER SET latin1 NOT NULL,
  `password` varchar(255) NOT NULL,
  `e-mail` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*
Indizes der exportierten Tabellen
*/

/*
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
  ADD PRIMARY KEY (`id`);

/*
## Indizes für die Tabelle `keywords`
*/
ALTER TABLE `keywords`
  ADD PRIMARY KEY (`id`);

/*
## Indizes für die Tabelle `log`
*/
ALTER TABLE `log`
  ADD PRIMARY KEY (`id`);

/*
## Indizes für die Tabelle `ort`
*/
ALTER TABLE `ort`
  ADD PRIMARY KEY (`id`);

/*
## Indizes für die Tabelle `user`
*/
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

/*
## AUTO_INCREMENT für exportierte Tabellen
*/

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
## AUTO_INCREMENT für Tabelle `kategorie`
*/
ALTER TABLE `kategorie`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

/*
## AUTO_INCREMENT für Tabelle `keywords`
*/
ALTER TABLE `keywords`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

/*
## AUTO_INCREMENT für Tabelle `log`
*/
ALTER TABLE `log`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

/*
## AUTO_INCREMENT für Tabelle `ort`
*/
ALTER TABLE `ort`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

/*
## AUTO_INCREMENT für Tabelle `user`
*/
ALTER TABLE `user`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
