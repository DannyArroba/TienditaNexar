<?php
session_start();
$origin = $_SERVER['HTTP_ORIGIN'] ?? 'http://localhost:5173';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

include('../db.php');

// Simple admin check - in a real app this would be more robust
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "No autenticado"]);
    exit();
}

$userRole = $_SESSION['role'] ?? '';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'add') {
        $name = $conn->real_escape_string($_POST['name']);
        $price = (float)$_POST['price'];
        $stock = (int)$_POST['stock'];
        $category = $conn->real_escape_string($_POST['category']);
        $description = $conn->real_escape_string($_POST['description']);
        
        $image = "";
        if (isset($_FILES['image'])) {
            $image = time() . "_" . $_FILES['image']['name'];
            $target = "../../frontend/uploads/" . $image;
            move_uploaded_file($_FILES['image']['tmp_name'], $target);
        }

        $sql = "INSERT INTO products (name, price, stock, category, description, image) VALUES ('$name', '$price', '$stock', '$category', '$description', '$image')";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["status" => "success", "message" => "Producto añadido"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
    } elseif ($action === 'update') {
        $id = (int)$_POST['id'];
        $name = $conn->real_escape_string($_POST['name']);
        $price = (float)$_POST['price'];
        $stock = (int)$_POST['stock'];
        $category = $conn->real_escape_string($_POST['category']);
        $description = $conn->real_escape_string($_POST['description']);

        $imageSql = "";
        if (isset($_FILES['image']) && $_FILES['image']['name'] != "") {
            $image = time() . "_" . $_FILES['image']['name'];
            $target = "../../frontend/uploads/" . $image;
            move_uploaded_file($_FILES['image']['tmp_name'], $target);
            $imageSql = ", image='$image'";
        }

        $sql = "UPDATE products SET name='$name', price='$price', stock='$stock', category='$category', description='$description' $imageSql WHERE id=$id";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["status" => "success", "message" => "Producto actualizado"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
    } elseif ($action === 'delete') {
        $id = (int)$_POST['id'];
        if ($conn->query("DELETE FROM products WHERE id=$id") === TRUE) {
            echo json_encode(["status" => "success", "message" => "Producto eliminado"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
    }
}
?>
