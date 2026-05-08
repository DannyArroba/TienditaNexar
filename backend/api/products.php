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

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (isset($_GET['categories'])) {
        $sql = "SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category <> ''";
        $result = $conn->query($sql);
        $categories = [];
        while ($row = $result->fetch_assoc()) {
            $categories[] = $row['category'];
        }
        echo json_encode($categories);
    } else {
        $category = $_GET['category'] ?? 'todas';
        if ($category !== 'todas') {
            $safeCat = $conn->real_escape_string($category);
            $sql = "SELECT * FROM products WHERE category = '$safeCat'";
        } else {
            $sql = "SELECT * FROM products";
        }
        $result = $conn->query($sql);
        $products = [];
        while ($row = $result->fetch_assoc()) {
            $row['image_url'] = "http://localhost/TienditaNexar/frontend/uploads/" . $row['image'];
            $products[] = $row;
        }
        echo json_encode($products);
    }
}
?>
