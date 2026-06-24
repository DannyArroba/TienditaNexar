<?php
session_start();
$origin = $_SERVER['HTTP_ORIGIN'] ?? 'http://localhost:5173';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

include('../db.php');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "No autenticado"]);
    exit();
}

$action = $_GET['action'] ?? 'list';

if ($action === 'list') {
    $res = $conn->query("
        SELECT p.*, COALESCE(c.name, p.customer_name) AS display_customer_name
        FROM purchases p
        LEFT JOIN customers c ON c.id = p.customer_id
        ORDER BY p.created_at DESC
    ");
    $transactions = [];
    while ($row = $res->fetch_assoc()) {
        $transactions[] = $row;
    }
    echo json_encode(["status" => "success", "data" => $transactions]);
} elseif ($action === 'details') {
    $purchase_id = $_GET['id'] ?? 0;
    if (!$purchase_id) {
        echo json_encode(["status" => "error", "message" => "ID de compra no proporcionado"]);
        exit();
    }

    // Get items
    $resItems = $conn->prepare("SELECT pi.*, p.name as product_name, p.image 
                                FROM purchase_items pi 
                                JOIN products p ON pi.product_id = p.id 
                                WHERE pi.purchase_id = ?");
    $resItems->bind_param("i", $purchase_id);
    $resItems->execute();
    $result = $resItems->get_result();
    $items = [];
    while ($row = $result->fetch_assoc()) {
        $row['image_url'] = "http://localhost/TienditaNexar/frontend/uploads/" . $row['image'];
        $items[] = $row;
    }

    // Get purchase info
    $resPurchase = $conn->prepare("SELECT * FROM purchases WHERE id = ?");
    $resPurchase->bind_param("i", $purchase_id);
    $resPurchase->execute();
    $purchase = $resPurchase->get_result()->fetch_assoc();

    echo json_encode([
        "status" => "success", 
        "data" => [
            "purchase" => $purchase,
            "items" => $items
        ]
    ]);
}
?>
