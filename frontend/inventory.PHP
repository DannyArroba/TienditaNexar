<?php
session_start();
include('../backend/db.php');

// Verificar si el usuario está logueado
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php"); // Si no está autenticado, redirige al login
    exit();
}

// Obtener productos desde la base de datos
$sql = "SELECT * FROM products";
$result = $conn->query($sql);

// Agregar producto
if (isset($_POST['add_product'])) {
    $name = $_POST['name'];
    $price = $_POST['price'];
    $category = $_POST['category']; // Categoria del producto
    $description = $_POST['description'];
    $image = $_FILES['image']['name'];

    // Subir la imagen
    $target = "../frontend/uploads/" . basename($image);
    if (move_uploaded_file($_FILES['image']['tmp_name'], $target)) {
        // La imagen se sube correctamente
    } else {
        echo "<script>Swal.fire('Error', 'Error al subir la imagen', 'error');</script>";
    }

    // Insertar producto en la base de datos
    $insert_sql = "INSERT INTO products (name, price, category, description, image) VALUES ('$name', '$price', '$category', '$description', '$image')";
    if ($conn->query($insert_sql) === TRUE) {
        echo "<script>Swal.fire('Éxito', 'Producto agregado exitosamente', 'success');</script>";
        header("Location: inventory.php"); // Redirigir después de agregar el producto
    } else {
        echo "<script>Swal.fire('Error', 'Error al agregar el producto', 'error');</script>";
    }
}

// Eliminar producto
if (isset($_GET['delete_id'])) {
    $delete_id = $_GET['delete_id'];
    $delete_sql = "DELETE FROM products WHERE id = '$delete_id'";
    if ($conn->query($delete_sql) === TRUE) {
        echo "<script>Swal.fire('Éxito', 'Producto eliminado correctamente', 'success');</script>";
        header("Location: inventory.php"); // Redirigir después de eliminar el producto
    } else {
        echo "<script>Swal.fire('Error', 'Error al eliminar el producto', 'error');</script>";
    }
}

// Editar producto
if (isset($_POST['edit_product'])) {
    $id = $_POST['id'];
    $name = $_POST['name'];
    $price = $_POST['price'];
    $category = $_POST['category'];
    $description = $_POST['description'];
    $image = $_FILES['image']['name'];

    // Subir la nueva imagen
    if ($image) {
        $target = "../frontend/uploads/" . basename($image);
        move_uploaded_file($_FILES['image']['tmp_name'], $target);
        $update_sql = "UPDATE products SET name='$name', price='$price', category='$category', description='$description', image='$image' WHERE id='$id'";
    } else {
        $update_sql = "UPDATE products SET name='$name', price='$price', category='$category', description='$description' WHERE id='$id'";
    }

    if ($conn->query($update_sql) === TRUE) {
        echo "<script>Swal.fire('Éxito', 'Producto actualizado correctamente', 'success');</script>";
        header("Location: inventory.php"); // Redirigir después de editar el producto
    } else {
        echo "<script>Swal.fire('Error', 'Error al actualizar el producto', 'error');</script>";
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventario - Tienda</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.0.2/dist/tailwind.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@10"></script>
</head>
<body class="bg-gray-100">

<!-- Header -->
<header class="bg-blue-600 p-4 text-white">
    <div class="container mx-auto flex justify-between items-center">
        <div class="flex space-x-4">
            <a href="index.php" class="text-xl font-bold">Mi Tienda</a>
            <a href="inventory.php" class="text-lg">Ver Inventario</a>
        </div>
        <div>
            <a href="logout.php" class="bg-red-600 px-4 py-2 rounded-lg text-white">Cerrar sesión</a>
        </div>
    </div>
</header>

<!-- Main content -->
<main class="container mx-auto p-8">
    <h2 class="text-3xl text-center mb-6 font-semibold">Inventario de Productos</h2>

    <!-- Botón para agregar un nuevo producto -->
    <div class="text-center mb-6">
        <button id="addProductBtn" class="bg-blue-600 text-white px-6 py-3 rounded-lg">Agregar Nuevo Producto</button>
    </div>

    <!-- Formulario para agregar producto (Inicialmente oculto) -->
    <div id="addProductForm" class="mb-8 p-6 bg-white shadow-lg rounded-lg hidden">
        <h3 class="text-2xl mb-4">Formulario de Agregar Producto</h3>
        <form action="inventory.php" method="POST" enctype="multipart/form-data">
            <div class="mb-4">
                <label for="name" class="block text-gray-700">Nombre del Producto</label>
                <input type="text" name="name" id="name" class="w-full p-3 mt-2 border rounded-lg" placeholder="Nombre del producto" required>
            </div>

            <div class="mb-4">
                <label for="price" class="block text-gray-700">Precio</label>
                <input type="number" name="price" id="price" class="w-full p-3 mt-2 border rounded-lg" placeholder="Precio" required>
            </div>

            <div class="mb-4">
                <label for="category" class="block text-gray-700">Categoría</label>
                <input type="text" name="category" id="category" class="w-full p-3 mt-2 border rounded-lg" placeholder="Categoría" required>
            </div>

            <div class="mb-4">
                <label for="description" class="block text-gray-700">Descripción</label>
                <textarea name="description" id="description" class="w-full p-3 mt-2 border rounded-lg" placeholder="Descripción del producto" required></textarea>
            </div>

            <div class="mb-4">
                <label for="image" class="block text-gray-700">Imagen del Producto</label>
                <input type="file" name="image" id="image" class="w-full p-3 mt-2 border rounded-lg">
            </div>

            <button type="submit" name="add_product" class="w-full p-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg">Agregar Producto</button>
        </form>
    </div>

    <!-- Lista de productos -->
    <h3 class="text-2xl mb-4">Productos en Inventario</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <?php while ($row = $result->fetch_assoc()) { ?>
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src="../frontend/uploads/<?php echo $row['image']; ?>" alt="<?php echo $row['name']; ?>" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="text-xl font-semibold text-gray-700"><?php echo $row['name']; ?></h3>
                    <p class="text-lg text-gray-500">$<?php echo $row['price']; ?></p>
                    <p class="text-sm text-gray-400"><?php echo $row['category']; ?></p>
                    <div class="mt-4 flex justify-between">
                        <!-- Botón Editar -->
                        <a href="edit-product.php?id=<?php echo $row['id']; ?>" class="bg-blue-500 text-white px-4 py-2 rounded-lg">Editar</a>

                        <!-- Botón Eliminar -->
                        <a href="?delete_id=<?php echo $row['id']; ?>" class="bg-red-600 text-white px-4 py-2 rounded-lg">Eliminar</a>
                    </div>
                </div>
            </div>
        <?php } ?>
    </div>
</main>

<script>
    // Mostrar/Ocultar el formulario de agregar producto
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductForm = document.getElementById('addProductForm');

    addProductBtn.addEventListener('click', () => {
        // Alternar la visibilidad del formulario
        addProductForm.classList.toggle('hidden');
    });
</script>

</body>
</html>
