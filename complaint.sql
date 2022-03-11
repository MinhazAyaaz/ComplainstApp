-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 11, 2022 at 06:21 PM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 8.0.2

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
-- Table structure for table `complaint`
--

CREATE TABLE `complaint` (
  `complaintid` int(255) NOT NULL,
  `creationdate` date NOT NULL DEFAULT current_timestamp(),
  `status` varchar(20) NOT NULL,
  `title` varchar(1000) NOT NULL,
  `against` varchar(1000) NOT NULL,
  `category` varchar(100) NOT NULL,
  `body` varchar(9999) NOT NULL,
  `reviewer` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `complaint`
--

INSERT INTO `complaint` (`complaintid`, `creationdate`, `status`, `title`, `against`, `category`, `body`, `reviewer`) VALUES
(1, '2022-03-10', '', 'abc', '123', 'bullying', 'qwerty', 'meee'),
(2, '2022-03-10', '', 'Testing out a complaint', 'Parinda Rahman', 'bullying', 'She is like really freaking mean guys omg', 'the police'),
(3, '2022-03-10', '', '', 'Parinda Rahman', 'bullying', 'popopopopopo', 'idk'),
(4, '2022-03-10', '', 'TEST 2', 'Parinda Rahman', 'sanitation', 'dasdasda', 'the police'),
(5, '2022-03-10', '', 'asas', 'asasa', '', '', ''),
(6, '2022-03-10', '', 'asas', 'asasa', '', '', ''),
(7, '2022-03-10', '', '', '', 'sanitation', '', ''),
(8, '2022-03-10', '', 'idk im being bullied and attacked', 'Parinda Rahman', 'bullying', 'waaaah waaah amm big baby', 'the police'),
(9, '2022-03-10', '', 'idk im being bullied and attacked', '', 'bullying', '', ''),
(10, '2022-03-10', '', 'weqweqweqw', '', '', '', ''),
(11, '2022-03-10', '', 'sasasasas', '', '', '', ''),
(12, '2022-03-10', '', 'sdasdasdas1112333', '', '', '', ''),
(13, '2022-03-11', '', 'test 12', 'Parinda Rahman', 'bullying', 'sdasdasdasd', ''),
(14, '2022-03-11', '', 'testing another time', 'Parinda Rahman', 'bullying', 'qwerty123445', 'meee');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `complaint`
--
ALTER TABLE `complaint`
  ADD PRIMARY KEY (`complaintid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `complaint`
--
ALTER TABLE `complaint`
  MODIFY `complaintid` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
