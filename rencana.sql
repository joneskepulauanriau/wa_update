-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 19, 2025 at 01:39 AM
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
-- Database: `dbfkip_umrah`
--

-- --------------------------------------------------------

--
-- Table structure for table `rencana`
--

CREATE TABLE `rencana` (
  `id_rencana` int(11) NOT NULL,
  `id_kelas` int(11) NOT NULL,
  `tgl_kuliah` date NOT NULL,
  `jam_masuk` time NOT NULL,
  `jam_pulang` time NOT NULL,
  `pertemuan_ke` int(11) NOT NULL,
  `metode_perkuliahan` varchar(100) NOT NULL,
  `materi` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `rencana`
--

INSERT INTO `rencana` (`id_rencana`, `id_kelas`, `tgl_kuliah`, `jam_masuk`, `jam_pulang`, `pertemuan_ke`, `metode_perkuliahan`, `materi`) VALUES
(1, 2, '2025-02-24', '10:50:00', '12:10:00', 1, 'Tatap Muka', 'Kontrak Perkuliahan'),
(2, 3, '2025-02-25', '07:30:00', '09:10:00', 1, 'Tatap Muka', 'Kontrak Perkuliahan'),
(3, 2, '2025-03-03', '10:50:00', '12:10:00', 2, 'Tatap Muka', 'Administrasi dan manajemen kurikulum sekolah '),
(4, 3, '2025-03-04', '07:30:00', '09:10:00', 2, 'Tatap Muka', 'Administrasi dan manajemen kurikulum sekolah '),
(5, 2, '2025-03-10', '10:50:00', '12:10:00', 3, 'Tatap Muka', 'Administrasi dan manajemen kesiswaan di sekolah'),
(6, 3, '2025-03-11', '07:30:00', '09:10:00', 3, 'Tatap Muka', 'Administrasi dan manajemen kesiswaan di sekolah'),
(7, 2, '2025-03-17', '10:50:00', '12:10:00', 4, 'Tatap Muka', 'Permasalahan kesiswaan ditinjau dari berbagai sudut pandang, teori dan kajian. (Case Method)'),
(8, 3, '2025-03-18', '07:30:00', '09:10:00', 4, 'Tatap Muka', 'Permasalahan kesiswaan ditinjau dari berbagai sudut pandang, teori dan kajian. (Case Method)'),
(9, 2, '2025-03-24', '10:50:00', '12:10:00', 5, 'Tatap Muka', 'Administrasi dan manajemen sumber daya manusia (pendidik dan tenaga kependidikan)'),
(10, 3, '2025-03-25', '07:30:00', '09:10:00', 5, 'Tatap Muka', 'Administrasi dan manajemen sumber daya manusia (pendidik dan tenaga kependidikan)'),
(11, 2, '2025-04-14', '10:50:00', '12:10:00', 6, 'Online', 'Administrasi dan manajemen sumber daya manusia (pendidik dan tenaga kependidikan)'),
(12, 3, '2025-04-08', '07:30:00', '09:10:00', 6, 'Tatap Muka', 'Administrasi dan manajemen sumber daya manusia (pendidik dan tenaga kependidikan)'),
(13, 2, '2025-04-19', '09:00:00', '10:40:00', 7, 'Online', 'Administrasi dan manajemen hubungan masyarakat'),
(14, 3, '2025-04-15', '07:30:00', '09:10:00', 7, 'Tatap Muka', 'Administrasi dan manajemen hubungan masyarakat'),
(15, 2, '2025-04-21', '10:50:00', '12:10:00', 8, 'Tatap Muka', 'UTS'),
(16, 3, '2025-04-22', '07:30:00', '09:10:00', 8, 'Tatap Muka', 'UTS'),
(17, 2, '2025-04-28', '10:50:00', '12:10:00', 9, 'Tatap Muka', 'Adminisrasi dan manajemen sarana dan prasarana pendidikan'),
(18, 3, '2025-04-29', '07:30:00', '09:10:00', 9, 'Tatap Muka', 'Adminisrasi dan manajemen sarana dan prasarana pendidikan'),
(19, 2, '2025-05-05', '10:50:00', '12:10:00', 10, 'Tatap Muka', 'Administrasi dan manajemen keuangan sekolah'),
(20, 3, '2025-05-06', '07:30:00', '09:10:00', 10, 'Tatap Muka', 'Administrasi dan manajemen keuangan sekolah'),
(21, 2, '2025-05-12', '10:50:00', '12:10:00', 11, 'Tatap Muka', 'Ketatalaksanaan lembaga pendidikan'),
(22, 3, '2025-05-13', '07:30:00', '09:10:00', 11, 'Tatap Muka', 'Ketatalaksanaan lembaga pendidikan'),
(23, 2, '2025-05-19', '10:50:00', '12:10:00', 12, 'Tatap Muka', 'Kepemimpinan dan supervisi pendidikan'),
(24, 3, '2025-05-20', '07:30:00', '09:10:00', 12, 'Tatap Muka', 'Kepemimpinan dan supervisi pendidikan'),
(25, 2, '2025-05-26', '10:50:00', '12:10:00', 13, 'Tatap Muka', 'Observasi di sekolah (PJBL)'),
(26, 3, '2025-05-27', '07:30:00', '09:10:00', 13, 'Tatap Muka', 'Observasi di sekolah (PJBL)'),
(27, 2, '2025-06-02', '10:50:00', '12:10:00', 14, 'Tatap Muka', 'Menyusun data hasil observasi (PJBL)'),
(28, 3, '2025-06-03', '07:30:00', '09:10:00', 14, 'Tatap Muka', 'Menyusun data hasil observasi (PJBL)'),
(29, 2, '2025-06-14', '10:50:00', '12:10:00', 15, 'Online', 'Proyek pembuatan artikel/aplikasi AppSheet (PJBL)'),
(30, 3, '2025-06-10', '07:30:00', '09:10:00', 15, 'Tatap Muka', 'Proyek pembuatan artikel/aplikasi AppSheet (PJBL)'),
(31, 2, '2025-06-16', '10:50:00', '12:10:00', 16, 'Tatap Muka', 'UAS'),
(32, 3, '2025-06-17', '07:30:00', '09:10:00', 16, 'Tatap Muka', 'UAS');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `rencana`
--
ALTER TABLE `rencana`
  ADD PRIMARY KEY (`id_rencana`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `rencana`
--
ALTER TABLE `rencana`
  MODIFY `id_rencana` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
