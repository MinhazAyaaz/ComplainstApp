-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 08, 2022 at 08:48 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nsucomplaints`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `nsuid` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `verified` varchar(255) DEFAULT NULL,
  `idscan` varchar(255) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`nsuid`, `name`, `email`, `password`, `verified`, `idscan`, `photo`, `status`, `role`, `createdAt`, `updatedAt`) VALUES
('1111111111', 'Minhaz', '1111111111@northsouth.edu', '$2a$08$zgjO68ea3JKaAUywn2JDK.xNm5K3s54NYPvYNWXvQeSeX8FUltLj2', 'true', 'https://firebasestorage.googleapis.com/v0/b/nsu-complaints-app.appspot.com/o/evidences%2F49710234_2022726414508040_2488946226775457792_o.jpg?alt=media&token=6ebd1c77-7cd3-4013-9105-b4b2837cfbf2', 'https://firebasestorage.googleapis.com/v0/b/nsu-complaints-app.appspot.com/o/evidences%2F49710234_2022726414508040_2488946226775457792_o.jpg?alt=media&token=6ebd1c77-7cd3-4013-9105-b4b2837cfbf2', 'activated', '1', '2022-05-08 17:05:41', '2022-05-08 17:05:41'),
('1931672642', 'Minhazul Abedin Ayaaz', 'minhazul.ayaaz@northsouth.edu', '', 'true', 'https://firebasestorage.googleapis.com/v0/b/nsu-complaints-app.appspot.com/o/evidences%2F49710234_2022726414508040_2488946226775457792_o.jpg?alt=media&token=6ebd1c77-7cd3-4013-9105-b4b2837cfbf2', 'https://firebasestorage.googleapis.com/v0/b/nsu-complaints-app.appspot.com/o/evidences%2F49710234_2022726414508040_2488946226775457792_o.jpg?alt=media&token=6ebd1c77-7cd3-4013-9105-b4b2837cfbf2', 'activated', '1', '2022-05-08 17:04:09', '2022-05-08 17:04:24'),
('2222222222', 'Abedin', '2222222222@northsouth.edu', '$2a$08$3p7.NUF5qBfv631jJZt54eiufU1znBVpmJqlY7rVuKUoI550yBE5G', 'true', 'https://firebasestorage.googleapis.com/v0/b/nsu-complaints-app.appspot.com/o/evidences%2F49710234_2022726414508040_2488946226775457792_o.jpg?alt=media&token=6ebd1c77-7cd3-4013-9105-b4b2837cfbf2', 'https://firebasestorage.googleapis.com/v0/b/nsu-complaints-app.appspot.com/o/evidences%2F49710234_2022726414508040_2488946226775457792_o.jpg?alt=media&token=6ebd1c77-7cd3-4013-9105-b4b2837cfbf2', 'activated', '2', '2022-05-08 17:06:00', '2022-05-08 17:06:00'),
('3333333333', 'Ayaaz', '3333333333@northsouth.edu', '$2a$08$u8cnSOv9/hOHGE53obym2OvqMM5VUJxdex.y4oqkkkmHKJCC5.OsG', 'true', 'https://firebasestorage.googleapis.com/v0/b/nsu-complaints-app.appspot.com/o/evidences%2F49710234_2022726414508040_2488946226775457792_o.jpg?alt=media&token=6ebd1c77-7cd3-4013-9105-b4b2837cfbf2', 'https://firebasestorage.googleapis.com/v0/b/nsu-complaints-app.appspot.com/o/evidences%2F49710234_2022726414508040_2488946226775457792_o.jpg?alt=media&token=6ebd1c77-7cd3-4013-9105-b4b2837cfbf2', 'activated', '2', '2022-05-08 17:06:39', '2022-05-08 17:06:39'),
('4444444444', 'Test', '4444444444@northsouth.edu', '$2a$08$S1jwoXOCgFesBIUy2UM2Wez6hV233vKniRFIMyzbSyBOBNghG9DHm', 'true', 'https://firebasestorage.googleapis.com/v0/b/nsu-complaints-app.appspot.com/o/evidences%2F49710234_2022726414508040_2488946226775457792_o.jpg?alt=media&token=6ebd1c77-7cd3-4013-9105-b4b2837cfbf2', 'https://firebasestorage.googleapis.com/v0/b/nsu-complaints-app.appspot.com/o/evidences%2F49710234_2022726414508040_2488946226775457792_o.jpg?alt=media&token=6ebd1c77-7cd3-4013-9105-b4b2837cfbf2', 'activated', '1', '2022-05-08 17:06:53', '2022-05-08 17:06:53');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`nsuid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
