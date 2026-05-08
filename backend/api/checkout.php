<?php
session_start();
// Habilitar reporte de errores de MySQLi para lanzar excepciones
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

// Configuración de CORS para permitir credenciales (sesiones)
$origin = $_SERVER['HTTP_ORIGIN'] ?? 'http://localhost:5173';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Manejo de peticiones OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

include('../db.php');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Sesión expirada. Por favor, inicia sesión de nuevo."]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);

if ($method === 'POST') {
    $user_id = (int)$_SESSION['user_id'];
    $purchase_type = $data['purchase_type'] ?? 'CONSUMIDOR_FINAL';
    
    // Asegurar que los campos opcionales sean NULL si están vacíos
    $customer_name = !empty($data['customer_name']) ? $data['customer_name'] : null;
    $customer_email = !empty($data['customer_email']) ? $data['customer_email'] : null;
    $customer_phone = !empty($data['customer_phone']) ? $data['customer_phone'] : null;
    $customer_address = !empty($data['customer_address']) ? $data['customer_address'] : null;
    $customer_idnumber = !empty($data['customer_idnumber']) ? $data['customer_idnumber'] : null;

    if (!isset($_SESSION['cart']) || count($_SESSION['cart']) === 0) {
        echo json_encode(["status" => "error", "message" => "El carrito está vacío."]);
        exit();
    }

    $subtotal = 0;
    foreach ($_SESSION['cart'] as $item) {
        $subtotal += (float)$item['price'] * (int)$item['quantity'];
    }
    $iva = $subtotal * 0.15;
    $total = $subtotal + $iva;

    $conn->begin_transaction();
    try {
        // 1. Insertar la compra principal
        $stmt = $conn->prepare("
            INSERT INTO purchases 
            (user_id, purchase_type, customer_name, customer_email, customer_phone, customer_address, customer_idnumber, subtotal, iva, total) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->bind_param("issssssddd", 
            $user_id, 
            $purchase_type, 
            $customer_name, 
            $customer_email, 
            $customer_phone, 
            $customer_address, 
            $customer_idnumber, 
            $subtotal, 
            $iva, 
            $total
        );
        
        $stmt->execute();
        $purchase_id = $stmt->insert_id;
        $stmt->close();

        // 2. Insertar los items de la compra
        $stmtItem = $conn->prepare("
            INSERT INTO purchase_items (purchase_id, product_id, product_name, unit_price, quantity, line_total) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");

        foreach ($_SESSION['cart'] as $item) {
            $pid = (int)$item['id'];
            $pname = $item['name'];
            $uprice = (float)$item['price'];
            $qty = (int)$item['quantity'];
            $line = $uprice * $qty;

            $stmtItem->bind_param("iisdid", $purchase_id, $pid, $pname, $uprice, $qty, $line);
            $stmtItem->execute();

            // 3. Descontar stock (opcionalmente podrías verificar si hay suficiente stock aquí)
            $conn->query("UPDATE products SET stock = stock - $qty WHERE id = $pid");
        }
        $stmtItem->close();

        $conn->commit();
        
        // Limpiar carrito después de una compra exitosa
        $_SESSION['cart'] = [];
        
        echo json_encode([
            "status" => "success", 
            "message" => "¡Venta registrada con éxito!", 
            "purchase_id" => $purchase_id
        ]);

    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode([
            "status" => "error", 
            "message" => "Error en la base de datos: " . $e->getMessage()
        ]);
    } catch (Throwable $t) {
        $conn->rollback();
        echo json_encode([
            "status" => "error", 
            "message" => "Error inesperado del sistema: " . $t->getMessage()
        ]);
    }
}
?>
