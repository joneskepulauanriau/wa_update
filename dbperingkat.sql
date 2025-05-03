-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 03, 2025 at 04:07 AM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.2.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_gmp`
--

-- --------------------------------------------------------

--
-- Table structure for table `peringkat`
--

DROP TABLE IF EXISTS `peringkat`;
CREATE TABLE `peringkat` (
  `id_turnamen` varchar(6) NOT NULL,
  `id_pemain` varchar(7) NOT NULL,
  `total_poin` float DEFAULT NULL,
  `jumlah_turnamen` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 PACK_KEYS=0;

--
-- Dumping data for table `peringkat`
--

INSERT INTO `peringkat` (`id_turnamen`, `id_pemain`, `total_poin`, `jumlah_turnamen`) VALUES
('202501', '2023001', 350, 1),
('202501', '2023002', 50, 1),
('202501', '2023004', 183.333, 1),
('202501', '2023005', 625, 1),
('202501', '2023007', 100, 1),
('202501', '2023008', 416.667, 1),
('202501', '2023009', 316.667, 1),
('202501', '2023010', 300, 1),
('202501', '2023011', 225, 1),
('202501', '2023012', 500, 1),
('202501', '2023013', 75, 1),
('202501', '2023014', 900, 1),
('202501', '2023015', 133.333, 1),
('202501', '2023017', 50, 1),
('202502', '2023001', 400, 1),
('202502', '2023002', 50, 1),
('202502', '2023004', 275, 1),
('202502', '2023006', 750, 1),
('202502', '2023008', 350, 1),
('202502', '2023010', 75, 1),
('202502', '2023012', 250, 1),
('202502', '2023014', 900, 1),
('202502', '2023019', 75, 1),
('202503', '2023001', 300, 1),
('202503', '2023002', 75, 1),
('202503', '2023004', 516.667, 1),
('202503', '2023006', 675, 1),
('202503', '2023011', 250, 1),
('202503', '2023012', 450, 1),
('202503', '2023013', 116.667, 1),
('202503', '2023014', 900, 1),
('202503', '2023015', 250, 1),
('202503', '2023016', 225, 1),
('202503', '2023019', 83.3333, 1),
('202503', '2023020', 66.6667, 1),
('202503', '2023021', 16.6667, 1),
('202503', '2023022', 75, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `peringkat`
--
ALTER TABLE `peringkat`
  ADD KEY `idx_turnamen` (`id_turnamen`,`id_pemain`) USING BTREE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
