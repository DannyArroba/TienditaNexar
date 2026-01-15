<?php
include('../backend/db.php');

// Crear producto
if (isset($_POST['add_product'])) {
    $name = $_POST['name'];
    $price = $_POST['price'];
    $stock = $_POST['stock'];
    $description = $_POST['description'];
    $image = $_FILES['image']['name'];

    $target = "../frontend/uploads/" . basename($image);
    move_uploaded_file($_FILES['image']['tmp_name'], $target);

    $sql = "INSERT INTO products (name, price, stock, description, image) VALUES ('$name', '$price', '$stock', '$description', '$image')";
    if ($conn->query($sql) === TRUE) {
        echo "Producto añadido exitosamente";
    } else {
        echo "Error: " . $conn->error;
    }
}

// Obtener productos
$sql = "SELECT * FROM products";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventario</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h2>Gestión de Productos</h2>
    <form method="POST" enctype="multipart/form-data">
        <input type="text" name="name" placeholder="Nombre del producto" required>
        <input type="number" name="price" placeholder="Precio" required>
        <input type="number" name="stock" placeholder="Cantidad en stock" required>
        <textarea name="description" placeholder="Descripción" required></textarea>
        <input type="file" name="image" required>
        <button type="submit" name="add_product">Agregar Producto</button>
    </form>

    <h3>Lista de Productos</h3>
    <div class="product-list">
        <?php while ($row = $result->fetch_assoc()) { ?>
        <div class="product-item">
            <img src="uploads/<?php echo $row['image']; ?>" width="100" height="100">
            <h4><?php echo $row['name']; ?></h4>
            <p>Precio: $<?php echo $row['price']; ?></p>
            <p>Stock: <?php echo $row['stock']; ?></p>
            <a href="edit-product.php?id=<?php echo $row['id']; ?>">Editar</a>
            <a href="delete-product.php?id=<?php echo $row['id']; ?>">Eliminar</a>
        </div>
        <?php } ?>
    </div>
</body>
</html>
