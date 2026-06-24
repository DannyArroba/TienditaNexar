-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 24-06-2026 a las 06:49:42
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tienda`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `id_number` varchar(10) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `customers`
--

INSERT INTO `customers` (`id`, `name`, `id_number`, `email`, `phone`, `address`, `created_at`, `updated_at`) VALUES
(1, 'Andrea Carolina Zambrano Mena', '2201456783', 'andrea.zambrano@example.com', '0991842637', 'Av. Alejandro Labaka y Rio Coca, barrio Central, El Coca', '2026-06-22 06:33:36', '2026-06-22 06:33:49'),
(2, 'Luis Fernando Grefa Alvarado', '2202389413', 'luis.grefa@example.com', '0985274163', 'Calle Napo y Quito, barrio 30 de Abril, El Coca', '2026-06-22 06:33:36', '2026-06-22 06:33:36'),
(3, 'Maria Jose Shiguango Cerda', '2203527060', 'maria.shiguango@example.com', '0963184752', 'Av. 9 de Octubre y Eugenio Espejo, barrio Union Imbaburena, El Coca', '2026-06-22 06:33:36', '2026-06-22 06:33:49'),
(4, 'Carlos Andres Villacis Paredes', '2204673152', 'carlos.villacis@example.com', '0976421835', 'Calle Amazonas y Vicente Rocafuerte, barrio Paraiso Amazonico, El Coca', '2026-06-22 06:33:36', '2026-06-22 06:33:49'),
(5, 'Daniela Estefania Tanguila Gualinga', '2205718246', 'daniela.tanguila@example.com', '0957362148', 'Av. Camilo de Torrano y Rio Payamino, barrio Flor de Oriente, El Coca', '2026-06-22 06:33:36', '2026-06-22 06:33:49'),
(6, 'Jorge Eduardo Vargas Moreira', '2206842391', 'jorge.vargas@example.com', '0996257314', 'Calle Cuenca y Guayaquil, barrio Los Rosales, El Coca', '2026-06-22 06:33:36', '2026-06-22 06:33:36'),
(7, 'Paola Fernanda Aguinda Mamallacta', '2207931466', 'paola.aguinda@example.com', '0981735624', 'Av. Padre Miguel Gamboa y Rio Tiputini, barrio Con Hogar, El Coca', '2026-06-22 06:33:36', '2026-06-22 06:33:49'),
(9, 'Erick Diaz', '2250040850', 'erick@gmail.com', '0988776655', 'Coca', '2026-06-22 07:04:19', '2026-06-22 07:04:19');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventory_logs`
--

CREATE TABLE `inventory_logs` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `type` enum('sale','purchase') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `sale_id` int(11) DEFAULT NULL,
  `invoice_number` varchar(255) NOT NULL,
  `invoice_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `file_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `barcode` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `stock` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`id`, `name`, `barcode`, `price`, `category`, `stock`, `description`, `image`, `created_at`) VALUES
(5, 'Pollo', NULL, 13.91, 'Carnes Rojas', 21, 'Carne rojita', '1932d1225e35f0ad1708bb97.png', '2026-01-15 22:29:03'),
(6, 'Arroz', NULL, 23.20, 'Granos', 0, 'granos', 'imagen_2026-01-16_004122429.png', '2026-01-16 05:41:23'),
(7, 'chocolate', NULL, 0.50, 'dulces', 0, 'Dulces', 'c517e7aab06a17a0cbccb41c.png', '2026-04-01 22:39:35'),
(8, 'Coca-Cola 2.5L', NULL, 2.50, 'Bebidas', 67, 'Refresco de cola familiar', '620e767f925e901578b7f13e.png', '2026-05-07 05:41:53'),
(9, 'Agua Mineral 500ml', NULL, 0.50, 'Bebidas', 96, 'Agua sin gas', '847630c5a2709fa9c921a209.png', '2026-05-07 05:41:53'),
(10, 'Jugo de Naranja 1L', NULL, 1.20, 'Bebidas', 30, 'Jugo natural pasteurizado', 'catalog-jugo-naranja-1l.jpg', '2026-05-07 05:41:53'),
(11, 'Leche Entera 1L', NULL, 0.90, 'Lácteos', 40, 'Leche de vaca fortificada', 'catalog-leche-entera-1l.jpg', '2026-05-07 05:41:53'),
(12, 'Yogurt de Fresa 1kg', NULL, 1.80, 'Lácteos', 18, 'Yogurt cremoso con trozos', 'catalog-yogurt-fresa-1kg.jpg', '2026-05-07 05:41:53'),
(13, 'Queso Fresco 500g', NULL, 3.50, 'Lácteos', 15, 'Queso artesanal', 'catalog-queso-fresco-500g.jpg', '2026-05-07 05:41:53'),
(14, 'Arroz 5kg', NULL, 4.50, 'Abarrotes', 60, 'Arroz grano largo', 'catalog-arroz-5kg.jpg', '2026-05-07 05:41:53'),
(15, 'Aceite Girasol 1L', NULL, 2.10, 'Abarrotes', 35, 'Aceite vegetal refinado', 'catalog-aceite-girasol-1l.jpg', '2026-05-07 05:41:53'),
(16, 'Pan de Molde', NULL, 1.50, 'Panadería', 20, 'Pan blanco tajado', 'catalog-pan-de-molde.jpg', '2026-05-07 05:41:53'),
(17, 'Café Molido 250g', NULL, 3.20, 'Abarrotes', 25, 'Café de altura seleccionado', 'catalog-cafe-molido-250g.jpg', '2026-05-07 05:41:53'),
(18, 'Gomitas', NULL, 0.50, 'Gomitas S.A', 15, 'Gomitas', '2c44ea8647a8f84f699d5404.png', '2026-06-23 05:32:18'),
(19, 'Mayonesa', NULL, 1.00, 'Condimentos', 24, 'Mayonesa', '2b18b743c45112dd1cb8b386.png', '2026-06-23 05:37:19');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `purchases`
--

CREATE TABLE `purchases` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `purchase_type` enum('CONSUMIDOR_FINAL','FACTURA') NOT NULL DEFAULT 'CONSUMIDOR_FINAL',
  `customer_name` varchar(120) DEFAULT NULL,
  `customer_email` varchar(120) DEFAULT NULL,
  `customer_phone` varchar(50) DEFAULT NULL,
  `customer_address` varchar(200) DEFAULT NULL,
  `customer_idnumber` varchar(30) DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `iva` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `purchases`
--

INSERT INTO `purchases` (`id`, `user_id`, `customer_id`, `purchase_type`, `customer_name`, `customer_email`, `customer_phone`, `customer_address`, `customer_idnumber`, `subtotal`, `iva`, `total`, `created_at`) VALUES
(1, 1, NULL, 'CONSUMIDOR_FINAL', NULL, NULL, NULL, NULL, NULL, 70.00, 8.40, 78.40, '2026-01-15 23:35:12'),
(2, 1, NULL, 'FACTURA', 'a', 'a@2', 'a', 'a', 'a', 14.00, 1.68, 15.68, '2026-01-15 23:53:14'),
(3, 1, NULL, 'CONSUMIDOR_FINAL', NULL, NULL, NULL, NULL, NULL, 14.00, 1.68, 15.68, '2026-01-15 23:56:33'),
(4, 1, NULL, 'CONSUMIDOR_FINAL', NULL, NULL, NULL, NULL, NULL, 56.00, 6.72, 62.72, '2026-01-15 23:57:11'),
(5, 1, NULL, 'CONSUMIDOR_FINAL', NULL, NULL, NULL, NULL, NULL, 14.00, 1.68, 15.68, '2026-01-16 00:11:23'),
(6, 1, NULL, 'CONSUMIDOR_FINAL', NULL, NULL, NULL, NULL, NULL, 210.00, 25.20, 235.20, '2026-01-16 00:21:19'),
(7, 1, NULL, 'CONSUMIDOR_FINAL', NULL, NULL, NULL, NULL, NULL, 140.00, 16.80, 156.80, '2026-01-16 00:33:47'),
(8, 2, NULL, 'CONSUMIDOR_FINAL', NULL, NULL, NULL, NULL, NULL, 37.24, 4.47, 41.71, '2026-01-16 00:41:34'),
(9, 1, NULL, 'CONSUMIDOR_FINAL', NULL, NULL, NULL, NULL, NULL, 56.00, 6.72, 62.72, '2026-01-16 00:42:42'),
(10, 1, NULL, 'CONSUMIDOR_FINAL', NULL, NULL, NULL, NULL, NULL, 41.73, 5.01, 46.74, '2026-01-16 00:43:23'),
(12, 3, NULL, 'FACTURA', 'Melisa', 'meli@gmail.com', '098798674', 'centro', '2200272215', 58.09, 6.97, 65.06, '2026-01-17 20:41:00'),
(13, 4, NULL, 'CONSUMIDOR_FINAL', NULL, NULL, NULL, NULL, NULL, 13.91, 1.67, 15.58, '2026-04-01 17:52:44'),
(14, 4, NULL, 'FACTURA', 'mariana', 'mopositamariana@gmail.com', '0968', 'centro', '0202135463', 23.20, 2.78, 25.98, '2026-04-01 17:57:27'),
(15, 5, NULL, 'FACTURA', 'fumando', 'acadamia1110@gmail.com', '0968', 'centro', '5555555555', 37.11, 4.45, 41.56, '2026-05-07 00:08:17'),
(16, 5, NULL, 'CONSUMIDOR_FINAL', '', '', '', '', '', 2.50, 0.38, 2.88, '2026-05-07 01:21:02'),
(17, 5, NULL, 'CONSUMIDOR_FINAL', NULL, NULL, NULL, NULL, NULL, 2.50, 0.38, 2.88, '2026-05-07 01:24:29'),
(18, 5, NULL, 'CONSUMIDOR_FINAL', NULL, NULL, NULL, NULL, NULL, 2.50, 0.38, 2.88, '2026-05-07 01:28:29'),
(19, 5, NULL, 'CONSUMIDOR_FINAL', NULL, NULL, NULL, NULL, NULL, 13.91, 2.09, 16.00, '2026-05-07 01:32:29'),
(20, 5, NULL, 'CONSUMIDOR_FINAL', NULL, NULL, NULL, NULL, NULL, 2.50, 0.38, 2.88, '2026-05-07 01:32:36'),
(21, 5, NULL, 'CONSUMIDOR_FINAL', NULL, NULL, NULL, NULL, NULL, 2.50, 0.38, 2.88, '2026-05-07 01:35:03'),
(22, 5, NULL, 'CONSUMIDOR_FINAL', NULL, NULL, NULL, NULL, NULL, 0.50, 0.08, 0.58, '2026-05-07 01:36:15'),
(23, 5, NULL, 'FACTURA', 'Fernando Xavier Bravo Valladolid', 'fernandobravo6582@gmail.com', '0987168084', 'Ecuador, El Coca Orellana', 'e', 2.50, 0.38, 2.88, '2026-05-07 01:36:32'),
(24, 6, NULL, 'CONSUMIDOR_FINAL', NULL, NULL, NULL, NULL, NULL, 7.50, 1.13, 8.63, '2026-05-07 23:08:58'),
(25, 6, NULL, 'FACTURA', 'Fernando Xavier Bravo Valladolid', 'fernandobravo6582@gmail.com', '0987168084', 'Ecuador, El Coca Orellana', '343434', 14.41, 2.16, 16.57, '2026-05-07 23:09:35'),
(26, 5, NULL, 'CONSUMIDOR_FINAL', NULL, NULL, NULL, NULL, NULL, 3.00, 0.45, 3.45, '2026-05-08 00:21:27'),
(27, 5, NULL, 'CONSUMIDOR_FINAL', NULL, NULL, NULL, NULL, NULL, 10.50, 1.58, 12.08, '2026-05-08 12:04:14'),
(28, 5, NULL, 'FACTURA', 'cristhian', 'ajbskvdkvs343@ls.cpm343', '09934939434', '34343', '232323232323', 9.50, 1.43, 10.93, '2026-05-08 12:05:22'),
(29, 5, NULL, 'CONSUMIDOR_FINAL', NULL, NULL, NULL, NULL, NULL, 17.51, 2.63, 20.14, '2026-05-08 13:04:55'),
(30, 5, NULL, 'FACTURA', 'mariana', 'cualquiera@hotmail.com', '0365254155', 'las americas', '2014569878', 8.00, 1.20, 9.20, '2026-05-08 13:06:08'),
(32, 6, 9, 'FACTURA', 'Erick Diaz', 'erick@gmail.com', '0988776655', 'Coca', '2250040850', 17.91, 2.69, 20.60, '2026-06-22 02:04:19');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `purchase_items`
--

CREATE TABLE `purchase_items` (
  `id` int(11) NOT NULL,
  `purchase_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `product_name` varchar(150) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `line_total` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `purchase_items`
--

INSERT INTO `purchase_items` (`id`, `purchase_id`, `product_id`, `product_name`, `unit_price`, `quantity`, `line_total`) VALUES
(1, 1, 4, 'Helado', 21.00, 2, 42.00),
(2, 1, 5, 'Pollo', 14.00, 2, 28.00),
(3, 2, 5, 'Pollo', 14.00, 1, 14.00),
(4, 3, 5, 'Pollo', 14.00, 1, 14.00),
(5, 4, 4, 'Helado', 21.00, 2, 42.00),
(6, 4, 5, 'Pollo', 14.00, 1, 14.00),
(7, 5, 5, 'Pollo', 14.00, 1, 14.00),
(8, 6, 5, 'Pollo', 14.00, 6, 84.00),
(9, 6, 4, 'Helado', 21.00, 6, 126.00),
(10, 7, 5, 'Pollo', 14.00, 10, 140.00),
(11, 8, 5, 'Pollo', 14.04, 1, 14.04),
(12, 8, 6, 'Arroz', 23.20, 1, 23.20),
(13, 9, 5, 'Pollo', 14.04, 1, 14.04),
(14, 9, 4, 'Helado', 20.98, 2, 41.96),
(15, 10, 5, 'Pollo', 13.91, 3, 41.73),
(19, 12, 5, 'Pollo', 13.91, 1, 13.91),
(20, 12, 4, 'Helado', 20.98, 1, 20.98),
(21, 12, 6, 'Arroz', 23.20, 1, 23.20),
(22, 13, 5, 'Pollo', 13.91, 1, 13.91),
(23, 14, 6, 'Arroz', 23.20, 1, 23.20),
(24, 15, 5, 'Pollo', 13.91, 1, 13.91),
(25, 15, 6, 'Arroz', 23.20, 1, 23.20),
(26, 16, 8, 'Coca-Cola 2.5L', 2.50, 1, 2.50),
(27, 17, 8, 'Coca-Cola 2.5L', 2.50, 1, 2.50),
(28, 18, 8, 'Coca-Cola 2.5L', 2.50, 1, 2.50),
(29, 19, 5, 'Pollo', 13.91, 1, 13.91),
(30, 20, 8, 'Coca-Cola 2.5L', 2.50, 1, 2.50),
(31, 21, 8, 'Coca-Cola 2.5L', 2.50, 1, 2.50),
(32, 22, 9, 'Agua Mineral 500ml', 0.50, 1, 0.50),
(33, 23, 8, 'Coca-Cola 2.5L', 2.50, 1, 2.50),
(34, 24, 8, 'Coca-Cola 2.5L', 2.50, 3, 7.50),
(35, 25, 9, 'Agua Mineral 500ml', 0.50, 1, 0.50),
(36, 25, 5, 'Pollo', 13.91, 1, 13.91),
(37, 26, 8, 'Coca-Cola 2.5L', 2.50, 1, 2.50),
(38, 26, 9, 'Agua Mineral 500ml', 0.50, 1, 0.50),
(39, 27, 8, 'Coca-Cola 2.5L', 2.50, 4, 10.00),
(40, 27, 9, 'Agua Mineral 500ml', 0.50, 1, 0.50),
(41, 28, 9, 'Agua Mineral 500ml', 0.50, 1, 0.50),
(42, 28, 12, 'Yogurt de Fresa 1kg', 1.80, 5, 9.00),
(43, 29, 12, 'Yogurt de Fresa 1kg', 1.80, 2, 3.60),
(44, 29, 5, 'Pollo', 13.91, 1, 13.91),
(45, 30, 8, 'Coca-Cola 2.5L', 2.50, 3, 7.50),
(46, 30, 9, 'Agua Mineral 500ml', 0.50, 1, 0.50),
(48, 32, 5, 'Pollo', 13.91, 1, 13.91),
(49, 32, 8, 'Coca-Cola 2.5L', 2.50, 1, 2.50),
(50, 32, 9, 'Agua Mineral 500ml', 0.50, 3, 1.50);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  `iva` decimal(10,2) NOT NULL,
  `total_with_iva` decimal(10,2) NOT NULL,
  `sale_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sale_items`
--

CREATE TABLE `sale_items` (
  `id` int(11) NOT NULL,
  `sale_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `stock_purchases`
--

CREATE TABLE `stock_purchases` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `stock_purchase_items`
--

CREATE TABLE `stock_purchase_items` (
  `id` int(11) NOT NULL,
  `purchase_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `cost_price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','cashier') DEFAULT 'admin',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`, `created_at`) VALUES
(5, 'Cristhian@gmail.com', '$2y$10$FODnFmAjmjeI6fR63Pvtf.nPQFqgs5.ErQhAI.5jkmLa./lAbc4mW', 'admin', '2026-05-07 05:02:50'),
(6, 'Nexar@gmail.com', '$2y$10$FODnFmAjmjeI6fR63Pvtf.nPQFqgs5.ErQhAI.5jkmLa./lAbc4mW', '', '2026-05-07 05:50:49');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `unique_customer_id_number` (`id_number`);

--
-- Indices de la tabla `inventory_logs`
--
ALTER TABLE `inventory_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indices de la tabla `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoice_number` (`invoice_number`),
  ADD KEY `sale_id` (`sale_id`);

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `purchases`
--
ALTER TABLE `purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `created_at` (`created_at`),
  ADD KEY `idx_purchases_customer_id` (`customer_id`);

--
-- Indices de la tabla `purchase_items`
--
ALTER TABLE `purchase_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_id` (`purchase_id`);

--
-- Indices de la tabla `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `sale_items`
--
ALTER TABLE `sale_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_id` (`sale_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indices de la tabla `stock_purchases`
--
ALTER TABLE `stock_purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `stock_purchase_items`
--
ALTER TABLE `stock_purchase_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_id` (`purchase_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `inventory_logs`
--
ALTER TABLE `inventory_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `purchases`
--
ALTER TABLE `purchases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `purchase_items`
--
ALTER TABLE `purchase_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT de la tabla `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sale_items`
--
ALTER TABLE `sale_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `stock_purchases`
--
ALTER TABLE `stock_purchases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `stock_purchase_items`
--
ALTER TABLE `stock_purchase_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `inventory_logs`
--
ALTER TABLE `inventory_logs`
  ADD CONSTRAINT `inventory_logs_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Filtros para la tabla `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`);

--
-- Filtros para la tabla `purchases`
--
ALTER TABLE `purchases`
  ADD CONSTRAINT `fk_purchases_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `purchase_items`
--
ALTER TABLE `purchase_items`
  ADD CONSTRAINT `purchase_items_ibfk_1` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `sale_items`
--
ALTER TABLE `sale_items`
  ADD CONSTRAINT `sale_items_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`),
  ADD CONSTRAINT `sale_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Filtros para la tabla `stock_purchases`
--
ALTER TABLE `stock_purchases`
  ADD CONSTRAINT `stock_purchases_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `stock_purchase_items`
--
ALTER TABLE `stock_purchase_items`
  ADD CONSTRAINT `stock_purchase_items_ibfk_1` FOREIGN KEY (`purchase_id`) REFERENCES `stock_purchases` (`id`),
  ADD CONSTRAINT `stock_purchase_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
