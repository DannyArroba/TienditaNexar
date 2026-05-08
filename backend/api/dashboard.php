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

$userRole = $_SESSION['role'] ?? '';

// Ventas totales hoy
$today = date('Y-m-d');
$resSales = $conn->query("SELECT SUM(total) as total FROM purchases WHERE DATE(created_at) = '$today'");
$salesToday = $resSales->fetch_assoc()['total'] ?? 0;

// Cantidad de productos con bajo stock (menos de 10)
$resLowStock = $conn->query("SELECT COUNT(*) as count FROM products WHERE stock < 10");
$lowStockCount = $resLowStock->fetch_assoc()['count'] ?? 0;

// Total productos
$resProducts = $conn->query("SELECT COUNT(*) as count FROM products");
$totalProducts = $resProducts->fetch_assoc()['count'] ?? 0;

// Últimas 5 ventas
$resRecentSales = $conn->query("SELECT * FROM purchases ORDER BY created_at DESC LIMIT 5");
$recentSales = [];
while ($row = $resRecentSales->fetch_assoc()) {
    $recentSales[] = $row;
}

echo json_encode([
    "status" => "success",
    "stats" => [
        "salesToday" => $salesToday,
        "lowStockCount" => $lowStockCount,
        "totalProducts" => $totalProducts
    ],
    "recentSales" => $recentSales
]);
?>
