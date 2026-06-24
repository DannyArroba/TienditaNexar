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

// 5. Create suppliers table
$sql = "CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    email VARCHAR(255),
    ruc VARCHAR(20),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
if ($conn->query($sql)) echo "Tabla 'suppliers' verificada/creada.\n";

// 6. Add supplier_id to products
$sql = "ALTER TABLE products ADD COLUMN IF NOT EXISTS supplier_id INT NULL AFTER id";
if ($conn->query($sql)) echo "Columna 'supplier_id' verificada en 'products'.\n";

// 7. Add cost_price to products
$sql = "ALTER TABLE products ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10,2) DEFAULT 0 AFTER price";
if ($conn->query($sql)) echo "Columna 'cost_price' verificada en 'products'.\n";

// Add foreign key for supplier_id
$sql = "SELECT COUNT(*) as cnt FROM information_schema.TABLE_CONSTRAINTS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'products' 
        AND CONSTRAINT_NAME = 'fk_products_supplier'";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
if ($row['cnt'] == 0) {
    $sql = "ALTER TABLE products 
            ADD INDEX idx_products_supplier_id (supplier_id),
            ADD CONSTRAINT fk_products_supplier 
            FOREIGN KEY (supplier_id) REFERENCES suppliers(id) 
            ON UPDATE CASCADE ON DELETE SET NULL";
    if ($conn->query($sql)) echo "Clave foránea 'fk_products_supplier' agregada.\n";
}

echo "Migración completada.\n";
?>
