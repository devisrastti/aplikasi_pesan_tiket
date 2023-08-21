-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 28 Jun 2023 pada 08.56
-- Versi server: 10.4.21-MariaDB
-- Versi PHP: 7.4.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_tiket`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `auth`
--

CREATE TABLE `auth` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `auth`
--

INSERT INTO `auth` (`id`, `uid`, `username`, `email`, `password`, `status`) VALUES
(9, 0, 'devi', 'devi@gmail.com', 'ketapang', 0),
(10, 0, 'genta', 'genta@gmail.com', 'genta1', 0),
(11, 0, 'ari', 'ari123@gmail.com', 'semarang01', 0),
(12, 0, 'Genta Arya', 'mgentaarya@gmail.com', 'genta456', 1),
(13, 0, 'gentaarya', 'mgentaarya@yahoo.com', 'genta123', 0),
(14, 0, 'arya', 'mgentaarya@gma.com', 'aaaaaaa', 0),
(15, 0, 'ikhwan fila', 'mrarifutama@gmail.com', 'kudaliar', 0),
(16, 0, 'afrizal', '111201911893@mhs.dinus.ac.id', 'genta456', NULL),
(17, 1, 'Customers Service', 'admin@admin.com', 'admin01', 1),
(18, 0, 'isan', '111201912285@mhs.dinus.ac.id', 'genta123', NULL),
(20, 0, 'tegar si anak punk', 'tegar3p@gmail.com', 'kimak', NULL),
(21, 0, 'arya', 'bungkarno@gmail.com', 'genta456', NULL),
(22, 0, 'Akun tester', 'tester@gmail.com', 'genta456', 0);

-- --------------------------------------------------------

--
-- Struktur dari tabel `jadwal`
--

CREATE TABLE `jadwal` (
  `id` int(11) NOT NULL,
  `kota_asal` varchar(255) NOT NULL,
  `kota_tujuan` varchar(255) NOT NULL,
  `hari` date NOT NULL,
  `jam` time NOT NULL,
  `harga` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `jadwal`
--

INSERT INTO `jadwal` (`id`, `kota_asal`, `kota_tujuan`, `hari`, `jam`, `harga`) VALUES
(1, 'ketapang', 'pontianak', '2023-06-28', '11:00:00', 50000),
(2, 'pontianak', 'ketapang', '2023-06-30', '12:00:00', 50000),
(3, 'pontianak', 'ketapang', '2023-08-31', '01:00:00', 50000);

-- --------------------------------------------------------

--
-- Struktur dari tabel `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `id_pengirim` int(11) NOT NULL,
  `id_penerima` int(11) DEFAULT NULL,
  `pesan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nama_pengirim` varchar(255) DEFAULT NULL,
  `nama_penerima` varchar(255) DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `message`
--

INSERT INTO `message` (`id`, `id_pengirim`, `id_penerima`, `pesan`, `nama_pengirim`, `nama_penerima`, `time`, `status`) VALUES
(297, 17, 12, 'hallo', 'Customers Service', 'Genta Arya', '2023-06-26 04:22:56', NULL),
(298, 12, 17, 'cara ngurus bebas perpus gimana ?', 'Genta Arya', 'Customers Service', '2023-06-26 04:23:36', NULL),
(299, 17, 12, 'bayar kak ', 'Customers Service', 'Genta Arya', '2023-06-26 04:24:10', NULL),
(300, 12, 17, 'gimana kak ?', 'Genta Arya', 'Customers Service', '2023-06-26 04:24:43', NULL),
(301, 17, 12, 'berikut tata caranya : ', 'Customers Service', 'Genta Arya', '2023-06-26 04:25:09', NULL),
(302, 17, 12, 'gini', 'Customers Service', 'Genta Arya', '2023-06-26 04:25:36', NULL),
(303, 12, 17, 'ya', 'Genta Arya', 'Customers Service', '2023-06-26 04:27:26', NULL),
(304, 17, 12, 'aa', 'Customers Service', 'Genta Arya', '2023-06-26 04:40:18', NULL),
(305, 12, 17, 'uy', 'Genta Arya', 'Customers Service', '2023-06-26 08:58:00', NULL),
(306, 12, 17, 'uy', 'Genta Arya', 'Customers Service', '2023-06-26 08:58:37', NULL),
(307, 12, 17, 'ya', 'Genta Arya', 'Customers Service', '2023-06-26 08:58:45', NULL),
(308, 12, 17, 'ya', 'Genta Arya', 'Customers Service', '2023-06-26 09:23:59', 0),
(309, 17, 12, 'test', 'Customers Service', 'Genta Arya', '2023-06-26 09:23:45', 0),
(310, 12, 17, 'tes', 'Genta Arya', 'Customers Service', '2023-06-26 09:23:59', 0),
(311, 17, 12, 'test', 'Customers Service', 'Genta Arya', '2023-06-26 09:23:45', 0),
(312, 12, 17, 'cek', 'Genta Arya', 'Customers Service', '2023-06-26 09:23:59', 0),
(313, 12, 17, 'test', 'Genta Arya', 'Customers Service', '2023-06-26 09:23:59', 0),
(314, 17, 12, 'test', 'Customers Service', 'Genta Arya', '2023-06-26 09:23:45', 0),
(315, 17, 12, 'testtst', 'Customers Service', 'Genta Arya', '2023-06-26 09:23:46', 0),
(316, 9, 17, 'oi', 'devi', 'Customers Service', '2023-06-26 14:44:38', 0),
(317, 12, 17, 'p', 'Genta Arya', 'Customers Service', '2023-06-26 09:30:27', 0),
(318, 12, 17, 'p', 'Genta Arya', 'Customers Service', '2023-06-26 09:30:27', 0),
(319, 17, 12, 'genta', 'Customers Service', 'Genta Arya', '2023-06-26 09:30:56', 0),
(320, 17, 12, 'ppp', 'Customers Service', 'Genta Arya', '2023-06-26 09:31:10', 0),
(321, 12, 17, 'uy', 'Genta Arya', 'Customers Service', '2023-06-26 09:31:26', 0),
(322, 12, 17, 'hallo', 'Genta Arya', 'Customers Service', '2023-06-26 09:43:45', 0),
(323, 17, 12, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 'Customers Service', 'Genta Arya', '2023-06-26 09:44:20', 0),
(324, 17, 12, 'wkwkkwkw', 'Customers Service', 'Genta Arya', '2023-06-26 09:50:55', 0),
(325, 12, 17, 'hahah', 'Genta Arya', 'Customers Service', '2023-06-26 10:01:21', 0),
(326, 17, 12, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 'Customers Service', 'Genta Arya', '2023-06-26 09:50:55', 0),
(327, 9, 17, 'hallo selamat malam', 'devi', 'Customers Service', '2023-06-26 14:45:02', 0),
(328, 17, 9, 'Selamat malam juga kak', 'Customers Service', 'devi', '2023-06-26 14:45:11', 0),
(329, 9, 17, 'oke', 'devi', 'Customers Service', '2023-06-26 21:48:20', 0),
(330, 9, 17, 'halo kak ', 'devi', 'Customers Service', '2023-06-26 21:48:20', 0),
(331, 9, 17, 'saya mau konfirmasi masalah pesanan saya ', 'devi', 'Customers Service', '2023-06-26 21:48:20', 0),
(332, 9, 17, 'apakah bisa dicancel kak ?', 'devi', 'Customers Service', '2023-06-26 21:48:20', 0),
(333, 17, 9, 'yaaa tidak bisa kak', 'Customers Service', 'devi', '2023-06-26 21:48:43', 0),
(334, 17, 9, 'ada yang bisa saya bantu ??', 'Customers Service', 'devi', '2023-06-26 21:49:09', 0),
(335, 22, 17, 'hallo', 'Akun tester', 'Customers Service', '2023-06-26 22:44:27', 1),
(336, 22, 17, 'bang', 'Akun tester', 'Customers Service', '2023-06-26 22:52:47', 1),
(337, 22, 17, 'hay', 'Akun tester', 'Customers Service', '2023-06-27 16:18:20', 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `pesanan`
--

CREATE TABLE `pesanan` (
  `id_pesanan` int(11) NOT NULL,
  `jadwal` date NOT NULL,
  `jam` time NOT NULL,
  `email` varchar(255) NOT NULL,
  `harga` int(100) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `no_telp` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `order_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `pesanan`
--

INSERT INTO `pesanan` (`id_pesanan`, `jadwal`, `jam`, `email`, `harga`, `nama`, `no_telp`, `status`, `order_id`) VALUES
(10, '2023-08-30', '01:00:00', 'mgentaarya@gmail.com', 50000, 'gentha', '985849', '0', 'ORDER_85556'),
(11, '2023-08-30', '01:00:00', 'mgentaarya@gmail.com', 50000, 'gentha', '985849', '0', 'ORDER_85556'),
(12, '2023-08-30', '01:00:00', 'mgentaarya@gmail.com', 50000, 'gentha', '985849', '0', 'ORDER_85556'),
(13, '2023-06-27', '10:00:00', 'mgentaarya@gmail.com', 50000, 'arya', '4838', '0', 'ORDER_85556'),
(14, '2023-06-27', '10:00:00', 'mgentaarya@gmail.com', 50000, 'arya', '4838', '0', 'ORDER_85556'),
(15, '2023-06-27', '10:00:00', 'mgentaarya@gmail.com', 50000, 'arya', '4838', '0', 'ORDER_85556'),
(16, '2023-08-30', '01:00:00', 'mgentaarya@gmail.com', 50000, 'hello', '0884', '0', 'ORDER_85556'),
(17, '2023-06-27', '10:00:00', 'mgentaarya@gmail.com', 50000, 'genta', '08584', '0', 'ORDER_85556'),
(18, '2023-06-29', '12:00:00', 'aa@gmail.com', 50000, 'genta', 'djjd', '1', ''),
(19, '2023-06-27', '10:00:00', 'mgentaarya@gmail.com', 50000, 'genta', '085154885', '0', 'ORDER_85556'),
(20, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 50000, 'genta', '0849794', '0', 'ORDER_85556'),
(21, '2023-06-27', '10:00:00', 'mgentaarya@gmail.com', 50000, 'test', '4048', '0', 'ORDER_85556'),
(22, '2023-08-30', '01:00:00', 'devi@gmail.com', 50000, 'devi', '08265959', '0', ''),
(23, '2023-06-27', '10:00:00', 'devi@gmail.com', 50000, 'devi', '0811223', '0', ''),
(24, '2023-06-27', '10:00:00', 'devi@gmail.com', 50000, 'devi', '05849', '0', ''),
(25, '2023-06-29', '12:00:00', 'devi@gmail.com', 50000, 'de i', '05959', '0', ''),
(26, '2023-06-27', '10:00:00', 'mgentaarya@gmail.com', 50000, 'Genta test', '089618601348', '0', 'ORDER_85556'),
(27, '2023-06-27', '10:00:00', 'tester@gmail.com', 50000, 'genta', '089165616', '0', ''),
(28, '2023-06-29', '12:00:00', 'tester@gmail.com', 250000, 'arya', '08956556', '0', ''),
(29, '2023-06-27', '10:00:00', 'tester@gmail.com', 50000, 'ganteng', '0868', '0', ''),
(30, '2023-06-27', '10:00:00', 'tester@gmail.com', 100000, 'arya', '08989', '0', ''),
(31, '2023-06-27', '10:00:00', 'tester@gmail.com', 150000, 'genta', '059595', '0', ''),
(32, '2023-06-27', '10:00:00', 'tester@gmail.com', 100000, 'genta', '0895656', '0', ''),
(33, '2023-06-27', '10:00:00', 'tester@gmail.com', 100000, 'genta', '0865656', '0', ''),
(34, '2023-06-27', '10:00:00', 'tester@gmail.com', 100000, 'genta', '8686', '0', ''),
(35, '2023-06-27', '10:00:00', 'tester@gmail.com', 250000, 'arya', '089565', '0', ''),
(36, '2023-06-27', '10:00:00', 'tester@gmail.com', 100000, 'genta', '0895656', '0', ''),
(37, '2023-06-27', '10:00:00', 'tester@gmail.com', 100000, 'genta', '0895656', '0', ''),
(38, '2023-06-27', '10:00:00', 'mgentaarya@gmail.com', 4, 'hHah', '676464', '0', 'ORDER_85556'),
(39, '2023-06-27', '10:00:00', 'mgentaarya@gmail.com', 4, 'hHah', '676464', '0', 'ORDER_85556'),
(40, '2023-06-27', '10:00:00', 'mgentaarya@gmail.com', 2, 'hahah', '868656', '0', 'ORDER_85556'),
(41, '2023-06-27', '10:00:00', 'mgentaarya@gmail.com', 2, 'hahah', '868656', '0', 'ORDER_85556'),
(42, '2023-06-27', '10:00:00', 'mgentaarya@gmail.com', 3, 'hahah', '6344646', '0', 'ORDER_85556'),
(43, '2023-06-27', '10:00:00', 'mgentaarya@gmail.com', 3, 'hahah', '6344646', '0', 'ORDER_85556'),
(44, '2023-06-27', '10:00:00', 'mgentaarya@gmail.com', 4, 'genga', '868646', '0', 'ORDER_85556'),
(45, '2023-06-27', '10:00:00', 'mgentaarya@gmail.com', 4, 'genga', '868646', '0', 'ORDER_85556'),
(46, '2023-06-27', '10:00:00', 'mgentaarya@gmail.com', 2, 'hahah', '686865', '0', 'ORDER_85556'),
(47, '2023-06-27', '10:00:00', 'devi@gmail.com', 150000, 'devi', '086568656', '0', 'ORDER_35963'),
(48, '2023-06-27', '10:00:00', 'devi@gmail.com', 150000, 'devi', '086568656', '0', 'ORDER_74347'),
(49, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 250000, 'arya', '08956562468', '0', 'ORDER_85556'),
(50, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 250000, 'arya', '08956562468', '0', 'ORDER_85556'),
(51, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 250000, 'Genta', '089618601348', '0', 'ORDER_85556'),
(52, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 250000, 'Genta', '089618601348', '0', 'ORDER_85556'),
(53, '2023-06-27', '10:00:00', 'mgentaarya@gmail.com', 100000, 'genta', '0895626', '0', 'ORDER_85556'),
(54, '2023-08-30', '01:00:00', 'mgentaarya@gmail.com', 250000, 'Arya', '08956526', '0', 'ORDER_85556'),
(55, '2023-08-30', '01:00:00', 'mgentaarya@gmail.com', 250000, 'Arya', '08956526', '0', 'ORDER_85556'),
(56, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 50000, 'codet', '0899654426842', '0', 'ORDER_85556'),
(57, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 50000, 'codet', '0899654426842', '0', 'ORDER_85556'),
(58, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 50000, 'lulubg', '089694843433', '0', 'ORDER_85556'),
(59, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 50000, 'lulubg', '089694843433', '0', 'ORDER_85556'),
(60, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 200000, 'genfa', '08686565', '0', 'ORDER_85556'),
(61, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 200000, 'genfa', '08686565', '0', 'ORDER_85556'),
(62, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 200000, 'genfa', '08686565', '0', 'ORDER_85556'),
(63, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 200000, 'genta', '0865626', '0', 'ORDER_85556'),
(64, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 200000, 'genta', '0865626', '0', 'ORDER_85556'),
(65, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 150000, 'Arya', '0895656', '0', 'ORDER_85556'),
(66, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 150000, 'Arya', '0895656', '0', 'ORDER_85556'),
(67, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 200000, 'Aryak', '089556', '0', 'ORDER_85556'),
(68, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 200000, 'arya', '08956265', '0', 'ORDER_85556'),
(69, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 250000, 'pamungkas', '059562626', '0', 'ORDER_85556'),
(70, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 250000, 'pamungkas', '059562626', '0', 'ORDER_85556'),
(71, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 150000, 'tester', '0686565', '0', 'ORDER_85556'),
(72, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 150000, 'tester', '0686565', '0', 'ORDER_85556'),
(73, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 250000, 'yoi', '059591617', '0', NULL),
(74, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 250000, 'yoi', '059591617', '0', 'ORDER_13201'),
(75, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 150000, 'p', '868656', '0', 'ORDER_67809'),
(76, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 100000, 'tester', '08989565', '0', 'ORDER_38171'),
(77, '2023-06-29', '12:00:00', 'mgentaarya@gmail.com', 250000, 'genta', '068686592', '0', 'ORDER_38151');

-- --------------------------------------------------------

--
-- Struktur dari tabel `token`
--

CREATE TABLE `token` (
  `id` int(11) NOT NULL,
  `token` varchar(11) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `token`
--

INSERT INTO `token` (`id`, `token`, `email`) VALUES
(1, '0', 'gentaakunpb2@gmail.com'),
(2, '0', 'gentaakunpb2@gmail.com'),
(3, 'dca860bba5', 'gentaakunpb2@gmail.com'),
(4, '7032c37478', 'gentaakunpb2@gmail.com'),
(10, '6178c280fa', 'gentaakunpb2@gmail.com'),
(22, 'c9c13001be', 'ari123@gmail.com'),
(23, '5cacbfbe90', 'ari123@gmail.com'),
(29, 'ce4bb784b7', 'mgentaarya@yahoo.com'),
(32, '53520bf9b8', 'genta@gmail.com'),
(38, '0ef28bc615', 'mrarifutama@gmail.com'),
(67, '5c7409bbcc', 'mrarifutama@gmail.com'),
(68, '8300c0b412', 'mrarifutama@gmail.com'),
(69, '72f994b4fe', 'mrarifutama@gmail.com'),
(70, '23ce37d8bd', 'mrarifutama@gmail.com'),
(71, 'b8877a9fcc', 'mrarifutama@gmail.com'),
(72, 'e7096675e4', 'mrarifutama@gmail.com'),
(73, 'ff8c0b2fc1', 'mrarifutama@gmail.com'),
(74, '9b5c1a6ca2', 'mrarifutama@gmail.com'),
(75, '79f81706b5', 'mrarifutama@gmail.com'),
(76, '5eb9083649', 'mrarifutama@gmail.com'),
(77, '0f03d2c177', 'mrarifutama@gmail.com'),
(78, '0109d53bce', 'mrarifutama@gmail.com'),
(79, 'ee627c314b', 'mrarifutama@gmail.com'),
(80, 'd9055391e9', 'mrarifutama@gmail.com'),
(81, '9972388818', 'mrarifutama@gmail.com'),
(82, 'd22498ac9c', 'mrarifutama@gmail.com'),
(83, '10b66820dc', 'mrarifutama@gmail.com');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `auth`
--
ALTER TABLE `auth`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `jadwal`
--
ALTER TABLE `jadwal`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `pesanan`
--
ALTER TABLE `pesanan`
  ADD PRIMARY KEY (`id_pesanan`);

--
-- Indeks untuk tabel `token`
--
ALTER TABLE `token`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `auth`
--
ALTER TABLE `auth`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT untuk tabel `jadwal`
--
ALTER TABLE `jadwal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=338;

--
-- AUTO_INCREMENT untuk tabel `pesanan`
--
ALTER TABLE `pesanan`
  MODIFY `id_pesanan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT untuk tabel `token`
--
ALTER TABLE `token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
