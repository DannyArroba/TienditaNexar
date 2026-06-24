<?php
session_start();
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$origin = $_SERVER['HTTP_ORIGIN'] ?? 'http://localhost:5173';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

include('../db.php');

function respond($status, $message, $extra = []) {
    echo json_encode(array_merge([
        "status" => $status,
        "message" => $message
    ], $extra));
    exit();
}

if (!isset($_SESSION['user_id'])) {
    respond("error", "Sesion expirada. Inicia sesion nuevamente.");
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond("error", "Metodo no permitido");
}

$data = json_decode(file_get_contents("php://input"), true) ?? [];
$userId = (int)$_SESSION['user_id'];
$purchaseType = $data['purchase_type'] ?? 'CONSUMIDOR_FINAL';

$customerName = trim($data['customer_name'] ?? '');
$customerEmail = trim($data['customer_email'] ?? '');
$customerPhone = trim($data['customer_phone'] ?? '');
$customerAddress = trim($data['customer_address'] ?? '');
$customerIdNumber = trim($data['customer_idnumber'] ?? '');

if (!isset($_SESSION['cart']) || count($_SESSION['cart']) === 0) {
    respond("error", "El carrito esta vacio.");
}

$subtotal = 0;
foreach ($_SESSION['cart'] as $item) {
    $subtotal += (float)$item['price'] * (int)$item['quantity'];
}
$iva = $subtotal * 0.15;
$total = $subtotal + $iva;

$conn->begin_transaction();

try {
    $customerId = null;

    if ($purchaseType === 'FACTURA') {
        if (!preg_match('/^22\d{8}$/', $customerIdNumber)) {
            throw new Exception("La cedula debe iniciar con 22 y contener 10 digitos.");
        }
        if (!preg_match('/^09\d{8}$/', $customerPhone)) {
            throw new Exception("El celular debe iniciar con 09 y contener 10 digitos.");
        }
        if ($customerName === '' || $customerAddress === '') {
            throw new Exception("Nombre y direccion del cliente son obligatorios.");
        }
        if ($customerEmail !== '' && !filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
            throw new Exception("El correo electronico no es valido.");
        }

        $findCustomer = $conn->prepare("SELECT id FROM customers WHERE id_number = ?");
        $findCustomer->bind_param("s", $customerIdNumber);
        $findCustomer->execute();
        $existingCustomer = $findCustomer->get_result()->fetch_assoc();
        $findCustomer->close();

        if ($existingCustomer) {
            $customerId = (int)$existingCustomer['id'];
            $updateCustomer = $conn->prepare("
                UPDATE customers
                SET name = ?, email = NULLIF(?, ''), phone = ?, address = ?
                WHERE id = ?
            ");
            $updateCustomer->bind_param(
                "ssssi",
                $customerName,
                $customerEmail,
                $customerPhone,
                $customerAddress,
                $customerId
            );
            $updateCustomer->execute();
            $updateCustomer->close();
        } else {
            $insertCustomer = $conn->prepare("
                INSERT INTO customers (name, id_number, email, phone, address)
                VALUES (?, ?, NULLIF(?, ''), ?, ?)
            ");
            $insertCustomer->bind_param(
                "sssss",
                $customerName,
                $customerIdNumber,
                $customerEmail,
                $customerPhone,
                $customerAddress
            );
            $insertCustomer->execute();
            $customerId = $insertCustomer->insert_id;
            $insertCustomer->close();
        }
    } else {
        $customerName = null;
        $customerEmail = null;
        $customerPhone = null;
        $customerAddress = null;
        $customerIdNumber = null;
    }

    $purchaseStmt = $conn->prepare("
        INSERT INTO purchases
        (user_id, customer_id, purchase_type, customer_name, customer_email,
         customer_phone, customer_address, customer_idnumber, subtotal, iva, total)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $purchaseStmt->bind_param(
        "iissssssddd",
        $userId,
        $customerId,
        $purchaseType,
        $customerName,
        $customerEmail,
        $customerPhone,
        $customerAddress,
        $customerIdNumber,
        $subtotal,
        $iva,
        $total
    );
    $purchaseStmt->execute();
    $purchaseId = $purchaseStmt->insert_id;
    $purchaseStmt->close();

    $itemStmt = $conn->prepare("
        INSERT INTO purchase_items
        (purchase_id, product_id, product_name, unit_price, quantity, line_total)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stockStmt = $conn->prepare("
        UPDATE products
        SET stock = stock - ?
        WHERE id = ? AND stock >= ?
    ");

    foreach ($_SESSION['cart'] as $item) {
        $productId = (int)$item['id'];
        $productName = $item['name'];
        $unitPrice = (float)$item['price'];
        $quantity = (int)$item['quantity'];
        $lineTotal = $unitPrice * $quantity;

        $stockStmt->bind_param("iii", $quantity, $productId, $quantity);
        $stockStmt->execute();
        if ($stockStmt->affected_rows !== 1) {
            throw new Exception("Stock insuficiente para " . $productName);
        }

        $itemStmt->bind_param(
            "iisdid",
            $purchaseId,
            $productId,
            $productName,
            $unitPrice,
            $quantity,
            $lineTotal
        );
        $itemStmt->execute();
    }

    $itemStmt->close();
    $stockStmt->close();
    $conn->commit();
    $_SESSION['cart'] = [];

    respond("success", "Venta registrada con exito", [
        "purchase_id" => $purchaseId,
        "customer_id" => $customerId
    ]);
} catch (Throwable $error) {
    $conn->rollback();
    respond("error", "No se pudo registrar la venta: " . $error->getMessage());
}
?>
