-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 28, 2025 at 08:53 AM
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
-- Table structure for table `dosen`
--

CREATE TABLE `dosen` (
  `id_dosen` varchar(20) NOT NULL,
  `nama_dosen` varchar(100) NOT NULL,
  `tempat_lahir` varchar(100) NOT NULL,
  `tgl_lahir` date NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `jurnal`
--

CREATE TABLE `jurnal` (
  `id_jurnal` int(11) NOT NULL,
  `id_kelas` int(11) NOT NULL,
  `nim` varchar(20) NOT NULL,
  `tgl_kuliah` date NOT NULL,
  `jam_masuk` time NOT NULL,
  `jam_pulang` time NOT NULL,
  `jenis_jurnal` varchar(100) DEFAULT NULL,
  `metode_ajar` varchar(100) DEFAULT NULL,
  `topik_pembahasan` text,
  `tautan_pertemuan` varchar(100) DEFAULT NULL,
  `tautan_penyimpanan` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `kelas`
--

CREATE TABLE `kelas` (
  `id_kelas` int(11) NOT NULL,
  `kode_matakuliah` varchar(10) NOT NULL,
  `dosen_ketua` varchar(100) NOT NULL,
  `dosen_anggota` varchar(100) DEFAULT NULL,
  `kelas` varchar(10) NOT NULL,
  `kode_prodi` varchar(4) NOT NULL,
  `tahun_ajaran` varchar(9) NOT NULL,
  `semester` int(11) NOT NULL,
  `ruang` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `kelas`
--

INSERT INTO `kelas` (`id_kelas`, `kode_matakuliah`, `dosen_ketua`, `dosen_anggota`, `kelas`, `kode_prodi`, `tahun_ajaran`, `semester`, `ruang`) VALUES
(1, 'FKP12001', 'Dr. Dra. Nevrita, M.Pd, M.Si ', 'Dr. Ir. Muhammad Yunus, M.M.', 'K1-2022', 'PB', '2024/2025', 5, '4'),
(2, 'FKP12001', 'Dr. Drs. Encik Abdul Hajar, M.M.', 'Dr. Ir. Muhammad Yunus, M.M.', 'K1-2022', 'PBI', '2024/2025', 6, '8'),
(3, 'FKP12001', 'Dr. Drs. Encik Abdul Hajar, M.M.', 'Dr. Ir. Muhammad Yunus, M.M.', 'K2-2022', 'PBI', '2024/2025', 6, '8');

-- --------------------------------------------------------

--
-- Table structure for table `mahasiswa`
--

CREATE TABLE `mahasiswa` (
  `nim` varchar(20) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `tempat_lahir` varchar(20) NOT NULL,
  `tgl_lahir` date NOT NULL,
  `jenis_kelamin` varchar(1) NOT NULL,
  `kode_prodi` varchar(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `mahasiswa`
--

INSERT INTO `mahasiswa` (`nim`, `nama`, `tempat_lahir`, `tgl_lahir`, `jenis_kelamin`, `kode_prodi`) VALUES
('2022100007', 'Muhammad Yunus', 'Teluk Dalam', '2025-03-04', 'L', 'PBI'),
('2103030033', 'Shelvia Umi Fathorikhah', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030001', 'Alfamela Putri', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030002', 'Mahrani', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030004', 'Nina Irawan', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030005', 'Natasha Putri', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030006', 'Muhammad Zulfa', 'Tanjungpinang', '0000-00-00', 'L', 'PB'),
('2203030008', 'Putri Jaya', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030012', 'Jesica Maulina', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030014', 'Nabila Andini', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030019', 'Riska Rahmalia', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030020', 'Irma Ariyanti', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030027', 'Cinta Radila Putri', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030029', 'Kiki Afriana Ningsih', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030031', 'Putri Hasdari', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030034', 'Ramean Chrisnawaty Nainggolan', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030036', 'Agatha Sesilia Pardosi', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030037', 'Nurul Azmi', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030041', 'Sahnan Aliandi', 'Tanjungpinang', '0000-00-00', 'L', 'PB'),
('2203030042', 'Chairunnisa Aulia', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030045', 'Kharisma Febriana', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030046', 'Marla Nur Amelia', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030047', 'Dwi Apprela Angraini', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030048', 'Jelaine Yuli Nesia Sinaga', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030050', 'Runyati', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030051', 'Ly Yeni Samosir', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030053', 'Sarah Deriska Pranita', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030054', 'Amirah Putri Salsabila', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030055', 'Andhari Tasya Dwilawati', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030057', 'Auliya Rahma', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030059', 'Keysa Puspita Sari', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030061', 'Gustina Rahma Yeni Putri Santika', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203030064', 'Anggun Larasati', 'Tanjungpinang', '0000-00-00', 'P', 'PB'),
('2203050001', 'Rara Cahya Aprilya', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050002', 'Sufy Rizky', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050003', 'Nitia Oktavilady', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050004', 'Rani Sofia Ersaprianti', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050005', 'Melisa Hazana', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050006', 'Wahyudi', 'Tanjungpinang', '0000-00-00', 'L', 'PBI'),
('2203050007', 'Shafiah Faridah Zahrah', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050008', 'Wawan Ramdani', 'Tanjungpinang', '0000-00-00', 'L', 'PBI'),
('2203050009', 'Siti Faradilla Putri', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050010', 'Nurul Ain', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050011', 'Hermalia', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050012', 'Apriyadi', 'Tanjungpinang', '0000-00-00', 'L', 'PBI'),
('2203050013', 'Rere Melvina', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050014', 'Abegail Katharina Wong', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050015', 'Vebiyola Sihombing', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050017', 'M. Dany Al Juniansyah', 'Tanjungpinang', '0000-00-00', 'L', 'PBI'),
('2203050018', 'Disti Apriani', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050019', 'Afri Astarina', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050020', 'Raden Roro Priscylla Dwi Cahyani', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050021', 'Tasya Alkhaira', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050022', 'Grace Angela Marbun', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050023', 'Abrar Octavirandra Anjaru', 'Tanjungpinang', '0000-00-00', 'L', 'PBI'),
('2203050025', 'E. Nur Putri Wulandari', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050026', 'Vopy Ulitia Putry', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050027', 'Risky Aditya', 'Tanjungpinang', '0000-00-00', 'L', 'PBI'),
('2203050028', 'Yola Ade Safitri', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050030', 'Nadia Pega', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050031', 'Delvina Dea Anisa', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050032', 'Riyan Gaga Siregar', 'Tanjungpinang', '0000-00-00', 'L', 'PBI'),
('2203050033', 'Anggi Octa Hendriawan', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050034', 'M. Arsy', 'Tanjungpinang', '0000-00-00', 'L', 'PBI'),
('2203050035', 'Zidan Dwi Khalfani Kareem', 'Tanjungpinang', '0000-00-00', 'L', 'PBI'),
('2203050036', 'Keti', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050037', 'Eki Pauziansah', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050038', 'Elvitriana', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050039', 'Sarah Stefani Simbolon', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050040', 'Dhipo Dzaki Aryuda', 'Tanjungpinang', '0000-00-00', 'L', 'PBI'),
('2203050041', 'Elina Bayusri', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050042', 'Tiara Aprillia Wulandari', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050043', 'Nesha Anggraini Panjaitan', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050044', 'Fitri Noviyanti', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050045', 'Seri Jelita', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050046', 'Ahmad Hidayat', 'Tanjungpinang', '0000-00-00', 'L', 'PBI'),
('2203050047', 'Dinda Widianda', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050049', 'M. Gazza Agryan', 'Tanjungpinang', '0000-00-00', 'L', 'PBI'),
('2203050050', 'Siti Mayang Haniffah', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050051', 'Nadia Ardiyanti', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050052', 'Sofia Allamanda', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050053', 'Ryanto Sirait', 'Tanjungpinang', '0000-00-00', 'L', 'PBI'),
('2203050054', 'Nurfadilah', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050055', 'Chindy Marselina', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050056', 'Nurul Atiqah Rizwana', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050057', 'Wulandari', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050058', 'Rendi Dwi Hadi Kusuma', 'Tanjungpinang', '0000-00-00', 'L', 'PBI'),
('2203050059', 'Ayona Dwi Sefiani', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050060', 'Abdu Rahmansah', 'Tanjungpinang', '0000-00-00', 'L', 'PBI'),
('2203050062', 'Andri', 'Tanjungpinang', '0000-00-00', 'L', 'PBI'),
('2203050063', 'Sherly Angelina', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050064', 'Femiliana Agnes', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050065', 'Zul Akmal Mursyam', 'Tanjungpinang', '0000-00-00', 'L', 'PBI'),
('2203050066', 'Glorya Serepuli Sihite', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050067', 'Tiara Agustin', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050068', 'Santo Andika Jaya Sinaga', 'Tanjungpinang', '0000-00-00', 'L', 'PBI'),
('2203050069', 'Fristy Nur Rahmadani', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050070', 'Rifa Aprilisa', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050071', 'Andika Eka Putra', 'Tanjungpinang', '0000-00-00', 'L', 'PBI'),
('2203050072', 'Dea Aisyah Wulandari', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050073', 'Yasmin Amalia Alif', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050074', 'Farhan Adyatma Zachary', 'Tanjungpinang', '0000-00-00', 'L', 'PBI'),
('2203050075', 'Ayattullah Muhaddis Azim', 'Tanjungpinang', '0000-00-00', 'L', 'PBI'),
('2203050076', 'Rike Meyla Eka Saputri', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050077', 'Bianca Naluri Firmansyah', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050078', 'Nawa Gigantika Halim', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050079', 'Siti Mutmainah', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050081', 'Enjelita', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050082', 'Intan Mesara', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050083', 'Fauzan Abdul Hakim', 'Tanjungpinang', '0000-00-00', 'L', 'PBI'),
('2203050084', 'Renalda Pratiwi', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050085', 'Sandia Fatika', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050086', 'Melany Apriyanti', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050087', 'Elpira Rosa Pratiwi', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050088', 'Chemilia Azra Putri', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050091', 'Timoti Meilando', 'Tanjungpinang', '0000-00-00', 'P', 'PBI'),
('2203050092', 'Andri Wijaya Ginting', 'Tanjungpinang', '0000-00-00', 'L', 'PBI'),
('2203050093', 'Dinda Pritaputri Ramadhan', 'Tanjungpinang', '0000-00-00', 'P', 'PBI');

-- --------------------------------------------------------

--
-- Table structure for table `matakuliah`
--

CREATE TABLE `matakuliah` (
  `kode_matakuliah` varchar(10) NOT NULL,
  `nama_matakuliah` varchar(100) NOT NULL,
  `sks` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `matakuliah`
--

INSERT INTO `matakuliah` (`kode_matakuliah`, `nama_matakuliah`, `sks`) VALUES
('FKP12001', 'Administrasi dan Manajemen Sekolah', 2);

-- --------------------------------------------------------

--
-- Table structure for table `mhskelas`
--

CREATE TABLE `mhskelas` (
  `nim` varchar(20) NOT NULL,
  `id_kelas` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `mhskelas`
--

INSERT INTO `mhskelas` (`nim`, `id_kelas`) VALUES
('2022100007', 2),
('2203050001', 2),
('2203050002', 2),
('2203050003', 2),
('2203050004', 3),
('2203050005', 2),
('2203050006', 3),
('2203050007', 3),
('2203050008', 2),
('2203050009', 3),
('2203050010', 3),
('2203050011', 2),
('2203050012', 2),
('2203050013', 2),
('2203050014', 3),
('2203050015', 3),
('2203050017', 3),
('2203050018', 2),
('2203050019', 2),
('2203050020', 2),
('2203050021', 2),
('2203050022', 2),
('2203050023', 2),
('2203050025', 3),
('2203050026', 3),
('2203050027', 2),
('2203050028', 3),
('2203050030', 2),
('2203050031', 3),
('2203050032', 3),
('2203050033', 3),
('2203050034', 2),
('2203050035', 3),
('2203050036', 2),
('2203050037', 2),
('2203050038', 2),
('2203050039', 3),
('2203050040', 3),
('2203050041', 2),
('2203050042', 2),
('2203050043', 3),
('2203050044', 2),
('2203050045', 2),
('2203050046', 3),
('2203050047', 2),
('2203050049', 3),
('2203050050', 3),
('2203050051', 3),
('2203050052', 3),
('2203050053', 3),
('2203050054', 2),
('2203050055', 2),
('2203050056', 2),
('2203050057', 2),
('2203050058', 3),
('2203050059', 2),
('2203050060', 2),
('2203050062', 2),
('2203050063', 3),
('2203050064', 3),
('2203050065', 3),
('2203050066', 3),
('2203050067', 3),
('2203050068', 3),
('2203050069', 3),
('2203050070', 3),
('2203050071', 3),
('2203050072', 3),
('2203050073', 3),
('2203050074', 2),
('2203050075', 2),
('2203050076', 2),
('2203050077', 2),
('2203050078', 3),
('2203050079', 3),
('2203050081', 3),
('2203050082', 3),
('2203050083', 2),
('2203050084', 3),
('2203050085', 2),
('2203050086', 3),
('2203050087', 2),
('2203050088', 2),
('2203050091', 2),
('2203050092', 2),
('2203050093', 3);

-- --------------------------------------------------------

--
-- Table structure for table `nilai`
--

CREATE TABLE `nilai` (
  `nim` varchar(20) NOT NULL,
  `id_kelas` int(11) NOT NULL,
  `makalah` int(11) NOT NULL,
  `kehadiran` int(11) NOT NULL,
  `diskusi` int(11) NOT NULL,
  `uts` int(11) NOT NULL,
  `uas` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `pengguna`
--

CREATE TABLE `pengguna` (
  `no_hp` varchar(20) NOT NULL,
  `nim` varchar(20) NOT NULL,
  `nama_wa` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `alamat` varchar(100) NOT NULL,
  `jenis_pengguna` int(11) DEFAULT '2'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `pengguna`
--

INSERT INTO `pengguna` (`no_hp`, `nim`, `nama_wa`, `email`, `alamat`, `jenis_pengguna`) VALUES
('622147450579', '2203050093', 'Dinda Pritaputri Ramadhan', '2203050093@student.umrah.ac.id', 'Jalan Sulaiman Abdullah, Lorong Skip 2.', 2),
('623167985655', '2203050057', 'Wulandari', '2203050057@student.umrah.ac.id', 'Jl Hang Kasturi Kp Sidojadi Km 11 Tanjungpinang, Rt 2 Rw 9', 2),
('627720945564', '2203050073', 'Yasmin Amalia Alif', '2203050073@student.umrah.ac.id', 'Jl.Engku Putri.', 2),
('6281214955555', '2022100007', 'Muhammad Yunus', 'joneskepri@cmail.my.id', 'Jln. Bayangkara', 2),
('6281243728039', '2203050092', 'Andri Wijaya Ginting', '2203050092@student.umrah.ac.id', 'Tanjung Unggat, Bukit Bestari', 2),
('6281266701829', '2203050067', 'Tiara Agustin', '2203050067@student.umrah.ac.id', 'Tanjungpinang?, Batu Ix, Perumahan Mekar Asri.Blok C-19', 2),
('6281266841609', '2203050040', 'Dhipo Dzaki Aryuda', 'dhipodeez@gmail.com', 'Jl.R.H.Fisabilillah Komp. Griya Permata Kharisma I B-4', 2),
('6281270630713', '2203050006', 'Wahyudi', '2203050006@student.umrah.ac.id', 'Jln.Ganet, Gg. Dirgantara', 2),
('6281275878616', '2203050051', 'Nadia Ardiyanti', 'nadiaardiyanti26@gmail.com', 'Seijang, Jalan Galang', 2),
('6281336205734', '2203050054', 'Nurfadilah', '2203050054@student.umrah.ac.id', 'Perumahan Bumi Air Raja, Tanjungpinang Timur, Blok G262', 2),
('6281340675334', '2203050049', 'M. Gazza Agryan', '2203050049@student.umrah.ac.id', 'Jl. Sultan Machmud', 2),
('6281344903608', '2203050011', 'Hermalia', '2203050011@student.umrah.ac.id', 'Jalan Nusantara Km 14 Kampung Tertomulyo', 2),
('6281354082226', '2203050032', 'Riyan Gaga Siregar', '2203050032@student.umrah.ac.id', 'Krabat,Km.54,Sri Bintan, Kecamatan Teluk Sebong, Kabupaten Bintan', 2),
('6281365224101', '2203050004', 'Rani Sofia Ersaprianti', '2203050004@student.umrah.ac.id', 'Kp. Harapan Iv', 2),
('6281372096371', '2203050043', 'Nesha Anggraini Panjaitan', 'neshaanggraini20@gmail.com', 'Jl. Kartika No 4', 2),
('6281372324541', '2203050009', 'Siti Faradilla Putri', 'faradillaputri104@gmail.com', 'Jl. Bali, Tanjungpinang Barat', 2),
('6281372383647', '2203050065', 'Zul Akmal Mursyam', '2203050065@student.umrah.ac.id', 'Jl. Hang Lekir,Perumahan Cluster Hang Lekir Residence Blok C No 12', 2),
('6281802034764', '2203050070', 'Rifa Aprilisa', '2203050070@student.umrah.ac.id', 'Jl.Bt Naga (Bt 8 Atas)', 2),
('6282147450579', '2203050093', 'Dinda Pritaputri Ramadhan', '2203050093@student.umrah.ac.id', 'Jalan Sulaiman Abdullah, lorong skip 2,no 39', 2),
('6282162777765', '2203050033', 'Anggi Octa Hendriawan', '2203050033@student.umrah.ac.id', 'Pantai Impian Blok C No 96', 2),
('6282174687821', '2203050037', 'Eki Pauziansah', '2203050037@student.umrah.ac.id', 'Jalan Batu Naga, Km 8', 2),
('6282218216779', '2203050084', 'Renalda Pratiwi', 'pratiwirenalda@gmail.com', 'perumahan bumi indah, jl flamboyan, blok d no 30', 2),
('6282256286482', '2203050047', 'Dinda Widianda', '2203050046@student.umrah.ac.id', 'Batu 8 Perumahan Mekar Asri', 2),
('6282258561199', '2203050035', 'Zidan Dwi Khalfani Kareem', '2203050035@student.umrah.ac.id', 'Jl. Pramuka Lr. Belitung No.21', 2),
('6282283460281', '2203050062', 'Andri', '2203050062@student.umrah.ac.id', 'Batu 8 Atas', 2),
('6282284326518', '2203050008', 'Wawan Ramdani', 'ramdaniwawan358@gmail.com', 'Jalan Peramuka Lorong Timur No 13', 2),
('6282284657369', '2203050068', 'Santo Andika Jaya Sinaga', 'santoandikajayasinaga3211@gmail.com', 'Jl. Sultan Machmud, Tanjung Unggat', 2),
('6282284669961', '2203050072', 'Dea Aisyah Wulandari', '2203050072@student.umrah.ac.id', 'Bt 8, jalan transito gang sukajaya 6, Tanjungpinang', 2),
('6282285187737', '2203050044', 'Fitri Noviyanti', '2203050044@student.umrah.ac.id', 'Seijang, Jl Durian.', 2),
('6282286644120', '2203050022', 'Grace Angela Marbun', '2203050022@student.umrah.ac.id', 'Batu 4', 2),
('6282287922580', '2203050084', 'Renalda Pratiwi', 'pratiwirenalda@gmail.com', 'Perumahan Bumi Indah,Batu 10', 2),
('6282288204390', '2203050034', 'M. Arsy', '2203050034@student.umrah.ac.id', 'Batu 10', 2),
('6282288213783', '2203050041', 'Elina Bayusri', '2203050041@student.umrah.ac.id', 'Jl. Sidorejo Km 5', 2),
('6282294685452', '2203050045', 'Seri Jelita', '2203050045@student.umrah.ac.id', 'Perumahan Kenangan Jaya 6', 2),
('6282375485806', '2203050012', 'Apriyadi', 'apriyadiy446@gmail.com', 'Jalan Pramuka Lorong Timur', 2),
('6282385096058', '2203050039', 'Sarah Stefani Simbolon', '2203050039@student.umrah.ac.id', 'Perumahan Harapan Indah Blok J-3, Km 9', 2),
('6282392604580', '2203050077', 'Bianca Naluri Firmansyah', '2203050077@student.umrah.ac.id', 'Kijang Kencana 1 C 18', 2),
('6283114394977', '2203050064', 'Femiliana Agnes', 'femiliana21@gmail.com', 'Jl.transito km 8 perum BHI blok A no 1', 2),
('6283121751720', '2203050010', 'Nurul Ain', 'ainnurulain111@gmail.com', 'Jalan Arjuna, Gang Mayangsari II', 2),
('6283125524976', '2203050074', 'Farhan Adyatma Zachary', '2203050074@student.umrah.ac.id', 'Jalan Soekarno Hatta Gg. Tenggayun No. 48', 2),
('6283147454080', '2203050038', 'Elvitriana', 'pipielvitriana@gmail.com', 'Perumahan Permata Sungai Carang', 2),
('6283161028577', '2203050058', 'Rendi Dwi Hadi Kusuma', '2203050058@student.umrah.ac.id', 'Jl. Adi Sucipto. Km 11', 2),
('6283161591961', '2203050075', 'Ayattullah Muhaddis Azim', '2203050075@student.umrah.ac.id', 'Jalan Pramuka, Lorong Pulau Raja 3', 2),
('6283164410122', '2203050020', 'Raden Roro Priscylla Dwi Cahyani', '2203050020@student.umrah.ac.id', 'Jl.Durian Gang Durian 1 No.64', 2),
('6283167985655', '2203050057', 'Wulandari', '2203050057@student.umrah.ac.id', 'Jl hang kasturi kp sidojadi', 2),
('6283168917531', '2203050030', 'Nadia Pega', '2203050030@student.umrah.ac.id', 'Jl. Sei Serai, Tanjungpinang', 2),
('6283179932254', '2203050013', 'Rere Melvina', '2203050013@student.umrah.ac.id', 'Jl. Wisata Bahari, Kawal, Bintan', 2),
('6283183399772', '2203050082', 'Intan Mesara', '2203050082@student.umrah.ac.id', 'Perum.kijang kencana iv blok f.9', 2),
('6283183439290', '2203050078', 'Nawa Gigantika Halim', 'nawagigantika08@gmail.com', 'Jl Puskesmas', 2),
('6283183535474', '2203050031', 'Delvina Dea Anisa', 'ddlvn1104@gmail.com', 'Jl.Jaya Kelana Sei Timun', 2),
('6283184535412', '2203050050', 'Siti Mayang Haniffah', '2203050050@student.umrah.ac.id', 'Tanjungpinang, kp.bugis', 2),
('62831845354123', '2203050050', 'Siti Mayang Haniffah', '2203050050@student.umrah.ac.id', 'Tanjungpinang, Kp.Bugis', 2),
('6283188629587', '2203050018', 'Disti Apriani', '2203050018@student.umrah.ac.id', 'Sungai Terusan', 2),
('6283869315354', '2203050002', 'Sufy Rizky', 'ssufyrizky@gmail.com', 'Kampung Bugis Rt 01, Rw 01, Kelurahan Kampung Bugis, Kecamatan Tanjungpinang Kota.', 2),
('6285182064249', '2203050091', 'Timoti Meilando', '2203050091@student.umrah.ac.id', 'Jalan Ganet Hangtuah Blok E 27', 2),
('6285182456739', '2203050017', 'M.Dany Al Juniansyah', '2203050017@student.umrah.ac.id', 'Tanjung Pinang Perumah Citra Pelita 8', 2),
('6285265223354', '2203050060', 'Abdu Rahmansah', '2203050060@student.umrah.ac.id', 'Jl. Abdul Rahman, Kampung Bugis', 2),
('6285664087741', '2203050071', 'Andika Eka Putra', '2203050071@student.umrah.ac.id', 'Jl. Kartika, Gang Mayang Sari No7, Kecamatan Bukit Bestari, Kota Tanjung Pinang', 2),
('6285668273032', '2203050003', 'Nitia Oktavilady', '2203050003@student.umrah.ac.id', 'Jl.Sidorejo Km5', 2),
('6285761340572', '2203050079', 'Siti Mutmainah', '2203050079@student.umrah.ac.id', 'Kampung Bumi Indah Jln Sumber Karya, Gesek, Toapaya Asri, Bintan', 2),
('6285766010357', '2203050059', 'Ayona Dwi Sefiani', '2203050059@student.umrah.ac.id', 'Jl. Kp Sei Carang Km.14 Arah Uban', 2),
('6285767304181', '2203050036', 'Keti', '2203050036@student.umrah.ac.id', 'Jl.Pemuda No.17', 2),
('6285787785399', '2203050055', 'Chindy Marselina', '2203050055@student.umrah.ac.id', 'Jl. Dua Saudara No 28', 2),
('6285831505866', '2203050023', 'Abrar Octavirandra Anjaru', '2203050023@student.umrah.ac.id', 'Perumahan Griya Hangtuah Permai Blok K No 20 Rt 3 Rw 5', 2),
('6285833654330', '2203050007', 'Shafiah Faridah Zahrah', '2203050007@student.umrah.ac.id', 'Korindo', 2),
('6285837548098', '2203050014', 'Abegail Katharina Wong', '2203050014@student.umrah.ac.id', 'Lorong sumatera no 3', 2),
('6285837583978', '2203050010', 'Nurul Ain', '2203050010@student.umrah.ac.id', 'Jalan Arjuna, Gang Mayangsari Ii', 2),
('6285837584154', '2203050028', 'Yola Ade Safitri', 'yolaadesafitri@gmail.com', 'Melayu Kota Piring', 2),
('6285855503202', '2203050081', 'Enjelita', '2203050081@student.umrah.ac.id', 'Belakang suryadi, jalan citra kos kuning', 2),
('6285875233713', '2203050021', 'Tasya Alkhaira', '2203050021@student.umrah.ac.id', 'Jl.Sidorejo Km5', 2),
('6285879716414', '2203050056', 'Nurul Atiqah Rizwana', '2203050056@student.umrah.ac.id', 'Jl. Dua Saudara No.28', 2),
('6285941268195', '2203050085', 'Sandia Fatika', 'sandiafatika0@gmail.com', 'Jalan Ganet', 2),
('6285941568195', '2203050085', 'Sandia Fatika', 'sandiafatika0@gmail.com', 'Jalan Ganet', 2),
('6287720945564', '2203050073', 'Yasmin Amalia Alif', '2203050073@student.umrah.ac.id', 'Jalan engku putri', 2),
('6288271955690', '2203050005', 'Melisa Hazana', '2203050005@student.umrah.ac.id', 'Jl.Gatot Subroto Km 5', 2),
('6288708278853', '2203050026', 'Vopy Ulitia Putry', 'vopyulitiaputry@gmail.com', 'Ganet, Perumahan Bambu Kuning, Jl Dirgantara', 2),
('62895603631993', '2203050063', 'Sherly Angelina', 'sherlyangelina804@gmail.com', 'Jln. Arjuna No 1, Km.4 Tanjung Ayun Sakti, Bukit Bestari', 2),
('62895603787249', '2203050069', 'Fristy Nur Rahmadani', 'fristyndp7@gmail.com', 'Jl Pramuka', 2),
('62895709142525', '2203050015', 'Vebiyola Sihombing', '2203050015@student.umrah.ac.id', 'Jl.Sukamulya No 8', 2),
('6289601542669', '2203050001', 'Rara Cahya Aprilya', '2203050001@student.umrah.ac.id', 'Batu 8 Perum Indonusa Lestari', 2),
('6289621481062', '2203050042', 'Tiara Aprillia Wulandari', '2203050042@student.umrah.ac.id', 'Perumahan Kijang Kencana 1 Blok B No 16', 2),
('6289638653422', '2203050046', 'Ahmad Hidayat', '2203050046@student.umrah.ac.id', 'Jalan Kuantan Graha Kuantan Asri Blok E1 No. 7', 2),
('6289653573074', '2203050066', 'Glorya Serepuli Sihite', '22030500666@student.umrah.ac.id', 'Batu 4, Jln. Pramuka No 10 Blok C', 2),
('6289654301807', '2203050076', 'Rike Meyla Eka Saputri', '2203050076@student.umrah.ac.id', 'Jln Taman Siswa, Perum. Kenangan Semoga Jaya 3, Blok C No 26, Km 13, Tanjungpinang', 2),
('628982113574', '2203050019', 'Afri Asta Rina', '2203050019@student.umrah.ac.id', 'Jln. Menur', 2),
('628984058419', '2203050052', 'Sofia Allamanda', '2203050052@student.umrah.ac.id', 'Jalan Usman Harun No.22', 2);

-- --------------------------------------------------------

--
-- Table structure for table `presensi`
--

CREATE TABLE `presensi` (
  `id_presensi` int(11) NOT NULL,
  `nim` varchar(20) NOT NULL,
  `id_rencana` int(11) NOT NULL,
  `jam_presensi` datetime NOT NULL,
  `keterangan` varchar(100) NOT NULL,
  `hadir` int(11) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `presensi`
--

INSERT INTO `presensi` (`id_presensi`, `nim`, `id_rencana`, `jam_presensi`, `keterangan`, `hadir`) VALUES
(1, '2203050001', 1, '2025-02-24 10:50:08', '', 1),
(2, '2203050002', 1, '2025-02-24 10:50:08', '', 1),
(3, '2203050005', 1, '2025-02-24 10:50:08', '', 1),
(4, '2203050008', 1, '2025-02-24 10:50:08', '', 1),
(5, '2203050011', 1, '2025-02-24 10:50:08', '', 1),
(6, '2203050012', 1, '2025-02-24 10:50:08', '', 1),
(7, '2203050013', 1, '2025-02-24 10:50:08', '', 1),
(8, '2203050018', 1, '2025-02-24 10:50:08', '', 1),
(9, '2203050019', 1, '2025-02-24 10:50:08', '', 1),
(10, '2203050020', 1, '2025-02-24 10:50:08', '', 1),
(11, '2203050021', 1, '2025-02-24 10:50:08', '', 1),
(12, '2203050022', 1, '2025-02-24 10:50:08', '', 1),
(13, '2203050023', 1, '2025-02-24 10:50:08', '', 1),
(14, '2203050030', 1, '2025-02-24 10:50:08', '', 1),
(15, '2203050034', 1, '2025-02-24 10:50:08', '', 1),
(16, '2203050036', 1, '2025-02-24 10:50:08', '', 1),
(17, '2203050037', 1, '2025-02-24 10:50:08', '', 1),
(18, '2203050042', 1, '2025-02-24 10:50:08', '', 1),
(19, '2203050044', 1, '2025-02-24 10:50:08', '', 1),
(20, '2203050045', 1, '2025-02-24 10:50:08', '', 1),
(21, '2203050047', 1, '2025-02-24 10:50:08', '', 1),
(22, '2203050054', 1, '2025-02-24 10:50:08', '', 1),
(23, '2203050055', 1, '2025-02-24 10:50:08', '', 1),
(24, '2203050056', 1, '2025-02-24 10:50:08', '', 1),
(25, '2203050057', 1, '2025-02-24 10:50:08', '', 1),
(26, '2203050059', 1, '2025-02-24 10:50:08', '', 1),
(27, '2203050060', 1, '2025-02-24 10:50:08', '', 1),
(28, '2203050062', 1, '2025-02-24 10:50:08', '', 1),
(29, '2203050074', 1, '2025-02-24 10:50:08', '', 1),
(30, '2203050075', 1, '2025-02-24 10:50:08', '', 1),
(31, '2203050076', 1, '2025-02-24 10:50:08', '', 1),
(32, '2203050077', 1, '2025-02-24 10:50:08', '', 1),
(33, '2203050091', 1, '2025-02-24 10:50:08', '', 1),
(34, '2203050092', 1, '2025-02-24 10:50:08', '', 1),
(35, '2203050004', 2, '2025-02-25 07:41:18', '', 1),
(36, '2203050006', 2, '2025-02-25 07:41:18', '', 1),
(37, '2203050007', 2, '2025-02-25 07:41:18', '', 1),
(38, '2203050010', 2, '2025-02-25 07:45:18', '', 1),
(39, '2203050015', 2, '2025-02-25 07:45:18', '', 1),
(40, '2203050017', 2, '2025-02-25 07:45:18', '', 1),
(41, '2203050026', 2, '2025-02-25 07:40:18', '', 1),
(42, '2203050032', 2, '2025-02-25 07:40:18', '', 1),
(43, '2203050033', 2, '2025-02-25 07:40:18', '', 1),
(44, '2203050039', 2, '2025-02-25 07:45:18', '', 1),
(45, '2203050040', 2, '2025-02-25 07:45:18', '', 1),
(46, '2203050043', 2, '2025-02-25 07:45:18', '', 1),
(47, '2203050046', 2, '2025-02-25 07:45:18', '', 1),
(48, '2203050049', 2, '2025-02-25 07:45:18', '', 1),
(49, '2203050050', 2, '2025-02-25 07:45:18', '', 1),
(50, '2203050052', 2, '2025-02-25 07:40:18', '', 1),
(51, '2203050058', 2, '2025-02-25 07:40:18', '', 1),
(52, '2203050063', 2, '2025-02-25 07:40:18', '', 1),
(53, '2203050065', 2, '2025-02-25 07:45:18', '', 1),
(54, '2203050066', 2, '2025-02-25 07:45:18', '', 1),
(55, '2203050067', 2, '2025-02-25 07:45:18', '', 1),
(56, '2203050068', 2, '2025-02-25 07:45:18', '', 1),
(57, '2203050070', 2, '2025-02-25 07:40:18', '', 1),
(58, '2203050071', 2, '2025-02-25 07:40:18', '', 1),
(59, '2203050073', 2, '2025-02-25 07:45:18', '', 1),
(60, '2203050078', 2, '2025-02-25 07:45:18', '', 1),
(61, '2203050079', 2, '2025-02-25 07:45:18', '', 1),
(62, '2203050093', 2, '2025-02-25 07:45:18', '', 1),
(63, '2203050001', 3, '2025-03-03 10:35:00', '', 1),
(64, '2203050002', 3, '2025-03-03 10:35:00', '', 1),
(65, '2203050003', 3, '2025-03-03 10:35:00', '', 1),
(66, '2203050005', 3, '2025-03-03 10:35:00', '', 1),
(67, '2203050008', 3, '2025-03-03 10:35:00', '', 1),
(68, '2203050011', 3, '2025-03-03 10:35:00', '', 1),
(69, '2203050012', 3, '2025-03-03 10:35:00', '', 1),
(70, '2203050013', 3, '2025-03-03 10:35:00', '', 1),
(71, '2203050018', 3, '2025-03-03 10:35:00', '', 1),
(72, '2203050019', 3, '2025-03-03 10:35:00', '', 1),
(73, '2203050020', 3, '2025-03-03 10:35:00', '', 1),
(74, '2203050021', 3, '2025-03-03 10:35:00', '', 1),
(75, '2203050022', 3, '2025-03-03 10:35:00', '', 1),
(76, '2203050023', 3, '2025-03-03 10:35:00', '', 1),
(77, '2203050030', 3, '2025-03-03 10:35:00', '', 1),
(78, '2203050036', 3, '2025-03-03 10:36:01', '', 1),
(79, '2203050037', 3, '2025-03-03 10:36:01', '', 1),
(80, '2203050038', 3, '2025-03-03 10:36:01', '', 1),
(81, '2203050041', 3, '2025-03-03 10:36:01', '', 1),
(82, '2203050042', 3, '2025-03-03 10:36:01', '', 1),
(83, '2203050044', 3, '2025-03-03 10:36:01', '', 1),
(84, '2203050045', 3, '2025-03-03 10:36:01', '', 1),
(85, '2203050047', 3, '2025-03-03 10:36:01', '', 1),
(86, '2203050054', 3, '2025-03-03 10:36:01', '', 1),
(87, '2203050055', 3, '2025-03-03 10:36:01', '', 1),
(88, '2203050056', 3, '2025-03-03 10:36:01', '', 1),
(89, '2203050057', 3, '2025-03-03 10:36:01', '', 1),
(90, '2203050059', 3, '2025-03-03 10:36:01', '', 1),
(91, '2203050060', 3, '2025-03-03 10:36:01', '', 1),
(92, '2203050062', 3, '2025-03-03 10:36:01', '', 1),
(93, '2203050074', 3, '2025-03-03 10:36:01', '', 1),
(94, '2203050075', 3, '2025-03-03 10:36:01', '', 1),
(95, '2203050076', 3, '2025-03-03 10:36:01', '', 1),
(96, '2203050077', 3, '2025-03-03 10:36:01', '', 1),
(97, '2203050085', 3, '2025-03-03 10:36:01', '', 1),
(98, '2203050091', 3, '2025-03-03 10:35:00', '', 1),
(99, '2203050092', 3, '2025-03-03 10:35:00', '', 1),
(100, '2203050006', 4, '2025-03-04 07:50:10', '', 1),
(101, '2203050007', 4, '2025-03-04 07:50:10', '', 1),
(102, '2203050009', 4, '2025-03-04 07:50:10', '', 1),
(103, '2203050010', 4, '2025-03-04 07:50:10', '', 1),
(104, '2203050014', 4, '2025-03-04 07:50:10', '', 1),
(105, '2203050015', 4, '2025-03-04 07:50:10', '', 1),
(106, '2203050017', 4, '2025-03-04 07:50:10', '', 1),
(107, '2203050026', 4, '2025-03-04 07:40:20', '', 1),
(108, '2203050031', 4, '2025-03-04 07:40:20', '', 1),
(109, '2203050032', 4, '2025-03-04 07:40:20', '', 1),
(110, '2203050035', 4, '2025-03-04 08:20:20', '', 1),
(111, '2203050039', 4, '2025-03-04 08:20:20', '', 1),
(112, '2203050043', 4, '2025-03-04 08:20:20', '', 1),
(113, '2203050046', 4, '2025-03-04 08:20:20', '', 1),
(114, '2203050049', 4, '2025-03-04 08:20:20', '', 1),
(115, '2203050050', 4, '2025-03-04 08:20:20', '', 1),
(116, '2203050051', 4, '2025-03-04 08:20:20', '', 1),
(117, '2203050052', 4, '2025-03-04 08:20:20', '', 1),
(118, '2203050058', 4, '2025-03-04 07:59:00', '', 1),
(119, '2203050063', 4, '2025-03-04 07:59:00', '', 1),
(120, '2203050064', 4, '2025-03-04 07:59:00', '', 1),
(121, '2203050065', 4, '2025-03-04 07:59:00', '', 1),
(122, '2203050066', 4, '2025-03-04 07:59:00', '', 1),
(123, '2203050067', 4, '2025-03-04 07:59:00', '', 1),
(124, '2203050068', 4, '2025-03-04 07:59:00', '', 1),
(125, '2203050069', 4, '2025-03-04 07:59:00', '', 1),
(126, '2203050071', 4, '2025-03-04 08:10:30', '', 1),
(127, '2203050072', 4, '2025-03-04 08:10:30', '', 1),
(128, '2203050073', 4, '2025-03-04 08:10:30', '', 1),
(129, '2203050079', 4, '2025-03-04 08:20:23', '', 1),
(130, '2203050081', 4, '2025-03-04 08:20:23', '', 1),
(131, '2203050093', 4, '2025-03-04 08:10:30', '', 1),
(132, '2203050001', 5, '2025-03-10 11:37:08', '', 1),
(133, '2203050002', 5, '2025-03-10 11:35:55', '', 1),
(134, '2203050003', 5, '2025-03-10 11:36:56', '', 1),
(135, '2203050005', 5, '2025-03-10 11:37:14', '', 1),
(136, '2203050008', 5, '2025-03-10 11:34:50', '', 1),
(137, '2203050011', 5, '2025-03-10 11:32:45', '', 1),
(138, '2203050012', 5, '2025-03-10 11:38:01', '', 1),
(139, '2203050013', 5, '2025-03-10 11:34:27', '', 1),
(140, '2203050018', 5, '2025-03-10 11:36:25', '', 1),
(141, '2203050019', 5, '2025-03-10 11:34:37', '', 1),
(142, '2203050020', 5, '2025-03-10 11:35:56', '', 1),
(143, '2203050021', 5, '2025-03-10 11:34:29', '', 1),
(144, '2203050022', 5, '2025-03-10 11:31:34', '', 1),
(145, '2203050023', 5, '2025-03-10 11:36:34', '', 1),
(146, '2203050030', 5, '2025-03-10 11:33:25', '', 1),
(147, '2203050034', 5, '2025-03-10 11:33:41', '', 1),
(148, '2203050036', 5, '2025-03-10 11:34:37', '', 1),
(149, '2203050037', 5, '2025-03-10 11:37:00', '', 1),
(150, '2203050038', 5, '2025-03-10 11:33:06', '', 1),
(151, '2203050041', 5, '2025-03-10 11:32:45', '', 1),
(152, '2203050042', 5, '2025-03-10 11:34:00', '', 1),
(153, '2203050044', 5, '2025-03-10 11:34:37', '', 1),
(154, '2203050045', 5, '2025-03-10 11:38:25', '', 1),
(155, '2203050047', 5, '2025-03-10 11:35:59', '', 1),
(156, '2203050054', 5, '2025-03-10 11:34:33', '', 1),
(157, '2203050055', 5, '2025-03-10 11:32:55', '', 1),
(158, '2203050056', 5, '2025-03-10 11:34:17', '', 1),
(159, '2203050057', 5, '2025-03-10 11:34:44', '', 1),
(160, '2203050059', 5, '2025-03-10 11:36:25', '', 1),
(161, '2203050060', 5, '2025-03-10 11:37:08', '', 1),
(162, '2203050074', 5, '2025-03-10 11:37:39', '', 1),
(163, '2203050075', 5, '2025-03-10 11:34:43', '', 1),
(164, '2203050076', 5, '2025-03-10 11:32:55', '', 1),
(165, '2203050077', 5, '2025-03-10 11:32:17', '', 1),
(166, '2203050085', 5, '2025-03-10 11:33:59', '', 1),
(167, '2203050091', 5, '2025-03-10 11:37:46', '', 1),
(168, '2203050092', 5, '2025-03-10 11:34:26', '', 1),
(169, '2203050062', 7, '2025-03-17 10:51:58', '', 1),
(170, '2203050013', 7, '2025-03-17 10:52:15', '', 1),
(171, '2203050091', 7, '2025-03-17 10:53:01', '', 1),
(172, '2203050005', 7, '2025-03-17 10:53:39', '', 1),
(173, '2203050047', 7, '2025-03-17 10:53:53', '', 1),
(174, '2203050054', 7, '2025-03-17 10:54:02', '', 1),
(175, '2203050076', 7, '2025-03-17 10:54:04', '', 1),
(176, '2203050020', 7, '2025-03-17 10:54:19', '', 1),
(177, '2203050038', 7, '2025-03-17 10:54:46', '', 1),
(178, '2203050037', 7, '2025-03-17 10:54:52', '', 1),
(179, '2203050044', 7, '2025-03-17 10:54:54', '', 1),
(180, '2203050002', 7, '2025-03-17 10:55:02', '', 1),
(181, '2203050022', 7, '2025-03-17 10:55:03', '', 1),
(182, '2203050012', 7, '2025-03-17 10:55:06', '', 1),
(183, '2203050019', 7, '2025-03-17 10:55:07', '', 1),
(184, '2203050011', 7, '2025-03-17 10:55:15', '', 1),
(185, '2203050018', 7, '2025-03-17 10:55:17', '', 1),
(186, '2203050057', 7, '2025-03-17 10:55:28', '', 1),
(187, '2203050059', 7, '2025-03-17 10:55:30', '', 1),
(188, '2203050042', 7, '2025-03-17 10:55:36', '', 1),
(189, '2203050056', 7, '2025-03-17 10:56:05', '', 1),
(190, '2203050030', 7, '2025-03-17 10:56:13', '', 1),
(191, '2203050021', 7, '2025-03-17 10:56:22', '', 1),
(192, '2203050055', 7, '2025-03-17 10:56:31', '', 1),
(193, '2203050003', 7, '2025-03-17 10:56:44', '', 1),
(194, '2203050074', 7, '2025-03-17 10:56:56', '', 1),
(195, '2203050045', 7, '2025-03-17 10:57:10', '', 1),
(196, '2203050041', 7, '2025-03-17 10:59:20', '', 1),
(197, '2203050023', 7, '2025-03-17 11:00:00', '', 1),
(198, '2203050001', 7, '2025-03-17 11:17:02', '', 1),
(199, '2203050085', 7, '2025-03-17 11:17:24', '', 1),
(200, '2203050092', 7, '2025-03-17 11:23:25', '', 1),
(201, '2203050015', 8, '2025-03-18 08:03:37', '', 1),
(202, '2203050039', 8, '2025-03-18 08:04:07', '', 1),
(203, '2203050049', 8, '2025-03-18 08:06:52', '', 1),
(204, '2203050032', 8, '2025-03-18 08:07:16', '', 1),
(205, '2203050093', 8, '2025-03-18 08:08:10', '', 1),
(206, '2203050033', 8, '2025-03-18 08:08:38', '', 1),
(207, '2203050051', 8, '2025-03-18 08:08:40', '', 1),
(208, '2203050066', 8, '2025-03-18 08:08:40', '', 1),
(209, '2203050070', 8, '2025-03-18 08:08:46', '', 1),
(210, '2203050079', 8, '2025-03-18 08:08:50', '', 1),
(211, '2203050007', 8, '2025-03-18 08:08:57', '', 1),
(212, '2203050046', 8, '2025-03-18 08:09:13', '', 1),
(213, '2203050052', 8, '2025-03-18 08:09:14', '', 1),
(214, '2203050063', 8, '2025-03-18 08:09:16', '', 1),
(215, '2203050043', 8, '2025-03-18 08:09:17', '', 1),
(216, '2203050058', 8, '2025-03-18 08:09:38', '', 1),
(217, '2203050067', 8, '2025-03-18 08:09:43', '', 1),
(218, '2203050069', 8, '2025-03-18 08:09:45', '', 1),
(219, '2203050010', 8, '2025-03-18 08:10:23', '', 1),
(220, '2203050026', 8, '2025-03-18 08:10:50', '', 1),
(221, '2203050004', 8, '2025-03-18 08:11:31', '', 1),
(222, '2203050081', 8, '2025-03-18 08:11:37', '', 1),
(223, '2203050035', 8, '2025-03-18 08:11:43', '', 1),
(224, '2203050084', 8, '2025-03-18 08:12:14', '', 1),
(225, '2203050064', 8, '2025-03-18 08:12:17', '', 1),
(226, '2203050073', 8, '2025-03-18 08:13:58', '', 1),
(227, '2203050006', 8, '2025-03-18 08:19:09', '', 1),
(228, '2203050040', 8, '2025-03-18 09:19:09', '', 1),
(229, '2203050008', 9, '2025-03-24 10:50:19', '', 1),
(230, '2203050045', 9, '2025-03-24 10:50:46', '', 1),
(231, '2203050019', 9, '2025-03-24 10:51:32', '', 1),
(232, '2203050056', 9, '2025-03-24 10:51:32', '', 1),
(233, '2203050041', 9, '2025-03-24 10:51:38', '', 1),
(234, '2203050003', 9, '2025-03-24 10:51:50', '', 1),
(235, '2203050030', 9, '2025-03-24 10:51:52', '', 1),
(236, '2203050047', 9, '2025-03-24 10:52:07', '', 1),
(237, '2203050076', 9, '2025-03-24 10:52:08', '', 1),
(238, '2203050054', 9, '2025-03-24 10:52:20', '', 1),
(239, '2203050021', 9, '2025-03-24 10:52:31', '', 1),
(240, '2203050020', 9, '2025-03-24 10:53:09', '', 1),
(241, '2203050042', 9, '2025-03-24 10:53:40', '', 1),
(242, '2203050005', 9, '2025-03-24 10:54:12', '', 1),
(243, '2203050001', 9, '2025-03-24 10:54:54', '', 1),
(244, '2203050062', 9, '2025-03-24 10:55:36', '', 1),
(245, '2203050057', 9, '2025-03-24 10:55:57', '', 1),
(246, '2203050013', 9, '2025-03-24 10:56:05', '', 1),
(247, '2203050059', 9, '2025-03-24 10:56:06', '', 1),
(248, '2203050018', 9, '2025-03-24 10:56:43', '', 1),
(249, '2203050002', 9, '2025-03-24 10:58:15', '', 1),
(250, '2203050077', 9, '2025-03-24 11:12:55', '', 1),
(251, '2203050055', 9, '2025-03-24 11:26:34', '', 1),
(252, '2203050036', 9, '2025-03-24 11:27:40', '', 1),
(253, '2203050044', 9, '2025-03-24 11:27:52', '', 1),
(254, '2203050022', 9, '2025-03-24 11:28:21', '', 1),
(255, '2203050023', 9, '2025-03-24 11:28:56', '', 1),
(256, '2203050038', 9, '2025-03-24 11:29:04', '', 1),
(257, '2203050075', 9, '2025-03-24 11:29:05', '', 1),
(258, '2203050060', 9, '2025-03-24 11:29:32', '', 1),
(259, '2203050091', 9, '2025-03-24 11:29:36', '', 1),
(260, '2203050074', 9, '2025-03-24 11:30:13', '', 1),
(261, '2203050092', 9, '2025-03-24 11:30:27', '', 1),
(262, '2203050034', 9, '2025-03-24 12:00:44', '', 1),
(263, '2203050015', 10, '2025-03-25 08:11:52', '', 1),
(264, '2203050006', 10, '2025-03-25 08:12:01', '', 1),
(265, '2203050039', 10, '2025-03-25 08:12:14', '', 1),
(266, '2203050073', 10, '2025-03-25 08:12:18', '', 1),
(267, '2203050079', 10, '2025-03-25 08:12:44', '', 1),
(268, '2203050033', 10, '2025-03-25 08:12:45', '', 1),
(269, '2203050046', 10, '2025-03-25 08:13:03', '', 1),
(270, '2203050084', 10, '2025-03-25 08:13:17', '', 1),
(271, '2203050026', 10, '2025-03-25 08:13:26', '', 1),
(272, '2203050066', 10, '2025-03-25 08:13:30', '', 1),
(273, '2203050063', 10, '2025-03-25 08:13:43', '', 1),
(274, '2203050058', 10, '2025-03-25 08:14:59', '', 1),
(275, '2203050069', 10, '2025-03-25 08:15:38', '', 1),
(276, '2203050093', 10, '2025-03-25 08:15:46', '', 1),
(277, '2203050010', 10, '2025-03-25 08:17:08', '', 1),
(278, '2203050078', 10, '2025-03-25 08:18:09', '', 1),
(279, '2203050007', 10, '2025-03-25 08:19:19', '', 1),
(280, '2203050070', 10, '2025-03-25 08:20:36', '', 1),
(281, '2203050068', 10, '2025-03-25 08:22:19', '', 1),
(282, '2203050072', 10, '2025-03-25 08:23:46', '', 1),
(283, '2203050031', 10, '2025-03-25 08:34:11', '', 1),
(284, '2203050071', 10, '2025-03-25 08:34:26', '', 1),
(285, '2203050009', 10, '2025-03-25 08:35:38', '', 1),
(286, '2203050004', 10, '2025-03-25 08:36:59', '', 1),
(287, '2203050081', 10, '2025-03-25 08:37:39', '', 1),
(288, '2203050043', 10, '2025-03-25 08:38:08', '', 1),
(289, '2203050014', 10, '2025-03-25 08:40:33', '', 1),
(290, '2203050052', 10, '2025-03-25 08:42:08', '', 1),
(291, '2203050051', 10, '2025-03-25 08:43:07', '', 1),
(292, '2203050035', 10, '2025-03-25 08:45:15', '', 1),
(293, '2203050050', 10, '2025-03-25 08:51:25', '', 1),
(294, '2203050067', 10, '2025-03-25 08:57:24', '', 1),
(295, '2203050049', 10, '2025-03-25 08:58:49', '', 1),
(296, '2203050032', 10, '2025-03-25 09:01:43', '', 1),
(297, '2203050082', 10, '2025-03-25 09:03:08', '', 1),
(299, '2203050065', 10, '2025-03-25 08:20:00', ' ', 1),
(301, '2203050028', 10, '2025-03-25 08:55:00', ' ', 1),
(302, '2203050009', 6, '2025-02-23 08:20:08', '', 1),
(303, '2203050007', 6, '2025-02-23 08:50:00', '', 1),
(304, '2203050015', 6, '2025-02-23 08:51:00', '', 1),
(305, '2203050026', 6, '2025-02-23 08:50:10', '', 1),
(306, '2203050028', 6, '2025-02-23 08:20:50', '', 1),
(307, '2203050031', 6, '2025-02-23 08:51:18', '', 1),
(308, '2203050032', 6, '2025-02-23 08:50:00', '', 1),
(309, '2203050039', 6, '2025-02-23 08:52:00', '', 1),
(310, '2203050043', 6, '2025-02-23 08:52:01', '', 1),
(311, '2203050046', 6, '2025-02-23 08:52:08', '', 1),
(312, '2203050049', 6, '2025-02-23 08:52:10', '', 1),
(313, '2203050051', 6, '2025-02-23 08:23:08', '', 1),
(314, '2203050052', 6, '2025-02-23 08:53:00', '', 1),
(315, '2203050058', 6, '2025-02-23 08:53:30', '', 1),
(316, '2203050063', 6, '2025-02-23 08:44:00', '', 1),
(317, '2203050064', 6, '2025-02-23 08:30:00', '', 1),
(318, '2203050065', 6, '2025-02-23 08:30:01', '', 1),
(319, '2203050066', 6, '2025-02-23 08:30:08', '', 1),
(320, '2203050067', 6, '2025-02-23 08:30:15', '', 1),
(321, '2203050068', 6, '2025-02-23 08:30:40', '', 1),
(322, '2203050069', 6, '2025-02-23 08:32:00', '', 1),
(323, '2203050070', 6, '2025-02-23 08:32:40', '', 1),
(324, '2203050071', 6, '2025-02-23 08:54:00', '', 1),
(325, '2203050073', 6, '2025-02-23 08:50:00', '', 1),
(326, '2203050079', 6, '2025-02-23 08:54:00', '', 1),
(327, '2203050081', 6, '2025-02-23 08:40:00', '', 1),
(328, '2203050084', 6, '2025-02-23 08:45:00', '', 1),
(329, '2203050093', 6, '2025-02-23 08:51:08', '', 1),
(330, '2203050050', 6, '2025-02-23 08:50:00', '', 1),
(331, '2203050014', 6, '2025-02-23 09:00:00', '', 1),
(332, '2203050072', 6, '2025-02-23 09:08:00', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `prodi`
--

CREATE TABLE `prodi` (
  `kode_prodi` varchar(4) NOT NULL,
  `nama_prodi` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `prodi`
--

INSERT INTO `prodi` (`kode_prodi`, `nama_prodi`) VALUES
('PB', 'Pendidikan Biologi'),
('PBI', 'Pendidikan Bahasa Inggris'),
('PBSI', 'Pendidikan Bahasa dan Sastra Indonesia'),
('PK', 'Pendidikan Kimia'),
('PM', 'Pendidikan Matematika');

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
(11, 2, '2025-03-31', '10:50:00', '12:10:00', 6, 'Tatap Muka', 'Administrasi dan manajemen sumber daya manusia (pendidik dan tenaga kependidikan)'),
(12, 3, '2025-04-01', '07:30:00', '09:10:00', 6, 'Tatap Muka', 'Administrasi dan manajemen sumber daya manusia (pendidik dan tenaga kependidikan)'),
(13, 2, '2025-04-07', '10:50:00', '12:10:00', 7, 'Tatap Muka', 'Administrasi dan manajemen hubungan masyarakat'),
(14, 3, '2025-04-08', '07:30:00', '09:10:00', 7, 'Tatap Muka', 'Administrasi dan manajemen hubungan masyarakat'),
(15, 2, '2025-04-14', '10:50:00', '12:10:00', 8, 'Tatap Muka', 'UTS'),
(16, 3, '2025-04-15', '07:30:00', '09:10:00', 8, 'Tatap Muka', 'UTS'),
(17, 2, '2025-04-21', '10:50:00', '12:10:00', 9, 'Tatap Muka', 'Adminisrasi dan manajemen sarana dan prasarana pendidikan'),
(18, 3, '2025-04-22', '07:30:00', '09:10:00', 9, 'Tatap Muka', 'Adminisrasi dan manajemen sarana dan prasarana pendidikan'),
(19, 2, '2025-04-28', '10:50:00', '12:10:00', 10, 'Tatap Muka', 'Administrasi dan manajemen keuangan sekolah'),
(20, 3, '2025-04-29', '07:30:00', '09:10:00', 10, 'Tatap Muka', 'Administrasi dan manajemen keuangan sekolah'),
(21, 2, '2025-05-05', '10:50:00', '12:10:00', 11, 'Tatap Muka', 'Ketatalaksanaan lembaga pendidikan'),
(22, 3, '2025-05-06', '07:30:00', '09:10:00', 11, 'Tatap Muka', 'Ketatalaksanaan lembaga pendidikan'),
(23, 2, '2025-05-12', '10:50:00', '12:10:00', 12, 'Tatap Muka', 'Kepemimpinan dan supervisi pendidikan'),
(24, 3, '2025-05-13', '07:30:00', '09:10:00', 12, 'Tatap Muka', 'Kepemimpinan dan supervisi pendidikan'),
(25, 2, '2025-05-19', '10:50:00', '12:10:00', 13, 'Tatap Muka', 'Observasi di sekolah (PJBL)'),
(26, 3, '2025-05-20', '07:30:00', '09:10:00', 13, 'Tatap Muka', 'Observasi di sekolah (PJBL)'),
(27, 2, '2025-05-26', '10:50:00', '12:10:00', 14, 'Tatap Muka', 'Menyusun data hasil observasi (PJBL)'),
(28, 3, '2025-05-27', '07:30:00', '09:10:00', 14, 'Tatap Muka', 'Menyusun data hasil observasi (PJBL)'),
(29, 2, '2025-06-02', '10:50:00', '12:10:00', 15, 'Tatap Muka', 'Proyek pembuatan artikel/aplikasi AppSheet (PJBL)'),
(30, 3, '2025-06-03', '07:30:00', '09:10:00', 15, 'Tatap Muka', 'Proyek pembuatan artikel/aplikasi AppSheet (PJBL)'),
(31, 2, '2025-06-09', '10:50:00', '12:10:00', 16, 'Tatap Muka', 'UAS'),
(32, 3, '2025-06-10', '07:30:00', '09:10:00', 16, 'Tatap Muka', 'UAS');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dosen`
--
ALTER TABLE `dosen`
  ADD PRIMARY KEY (`id_dosen`);

--
-- Indexes for table `jurnal`
--
ALTER TABLE `jurnal`
  ADD PRIMARY KEY (`id_jurnal`);

--
-- Indexes for table `kelas`
--
ALTER TABLE `kelas`
  ADD PRIMARY KEY (`id_kelas`);

--
-- Indexes for table `mahasiswa`
--
ALTER TABLE `mahasiswa`
  ADD PRIMARY KEY (`nim`);

--
-- Indexes for table `matakuliah`
--
ALTER TABLE `matakuliah`
  ADD PRIMARY KEY (`kode_matakuliah`);

--
-- Indexes for table `mhskelas`
--
ALTER TABLE `mhskelas`
  ADD PRIMARY KEY (`nim`,`id_kelas`);

--
-- Indexes for table `nilai`
--
ALTER TABLE `nilai`
  ADD KEY `nim` (`nim`,`id_kelas`);

--
-- Indexes for table `pengguna`
--
ALTER TABLE `pengguna`
  ADD PRIMARY KEY (`no_hp`);

--
-- Indexes for table `presensi`
--
ALTER TABLE `presensi`
  ADD PRIMARY KEY (`id_presensi`),
  ADD KEY `idxPresensi` (`nim`,`id_rencana`) USING BTREE;

--
-- Indexes for table `prodi`
--
ALTER TABLE `prodi`
  ADD PRIMARY KEY (`kode_prodi`);

--
-- Indexes for table `rencana`
--
ALTER TABLE `rencana`
  ADD PRIMARY KEY (`id_rencana`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `jurnal`
--
ALTER TABLE `jurnal`
  MODIFY `id_jurnal` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kelas`
--
ALTER TABLE `kelas`
  MODIFY `id_kelas` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `presensi`
--
ALTER TABLE `presensi`
  MODIFY `id_presensi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=333;

--
-- AUTO_INCREMENT for table `rencana`
--
ALTER TABLE `rencana`
  MODIFY `id_rencana` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
