<?php
include('db.php');

echo "Iniciando migración de base de datos para Supermercado 3 Hermanos...\n";

// 1. Agregar rol a usuarios
$sql = "ALTER TABLE users ADD COLUMN IF NOT EXISTS role ENUM('admin', 'trabajador') DEFAULT 'trabajador'";
if ($conn->query($sql)) echo "Columna 'role' verificada/agregada en 'users'.\n";

// 2. Crear tabla de clientes
$sql = "CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    id_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
if ($conn->query($sql)) echo "Tabla 'customers' verificada/creada.\n";

// 3. Crear tabla de compras (abastecimiento)
$sql = "CREATE TABLE IF NOT EXISTS stock_purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
)";
if ($conn->query($sql)) echo "Tabla 'stock_purchases' verificada/creada.\n";

$sql = "CREATE TABLE IF NOT EXISTS stock_purchase_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    purchase_id INT,
    product_id INT,
    quantity INT,
    cost_price DECIMAL(10,2),
    FOREIGN KEY (purchase_id) REFERENCES stock_purchases(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
)";
if ($conn->query($sql)) echo "Tabla 'stock_purchase_items' verificada/creada.\n";

// 4. Crear tabla de ventas (POS)
$sql = "CREATE TABLE IF NOT EXISTS purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    purchase_type ENUM('CONSUMIDOR_FINAL', 'FACTURA') DEFAULT 'CONSUMIDOR_FINAL',
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_address TEXT,
    customer_idnumber VARCHAR(20),
    subtotal DECIMAL(10,2),
    iva DECIMAL(10,2),
    total DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
)";
if ($conn->query($sql)) echo "Tabla 'purchases' verificada/creada.\n";

$sql = "CREATE TABLE IF NOT EXISTS purchase_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    purchase_id INT,
    product_id INT,
    product_name VARCHAR(255),
    unit_price DECIMAL(10,2),
    quantity INT,
    line_total DECIMAL(10,2),
    FOREIGN KEY (purchase_id) REFERENCES purchases(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
)";
if ($conn->query($sql)) echo "Tabla 'purchase_items' verificada/creada.\n";

// Asegurar que products tiene stock
$sql = "ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INT DEFAULT 0";
if ($conn->query($sql)) echo "Columna 'stock' verificada en 'products'.\n";

echo "Migración completada.\n";
?>
