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
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a la Tienda</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.0.2/dist/tailwind.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@10"></script>
</head>
<body class="bg-gray-100">

<!-- Header con botones de navegación -->
<header class="bg-blue-600 p-4 text-white">
    <div class="container mx-auto flex justify-between items-center">
        <div class="flex space-x-4">
            <a href="index.php" class="text-xl font-bold">Mi Tienda</a>
            <a href="inventory.php" class="text-lg">Ver Inventario</a> <!-- Nuevo botón para ver inventario -->
        </div>
        <div>
            <a href="logout.php" class="bg-red-600 px-4 py-2 rounded-lg text-white">Cerrar sesión</a>
        </div>
    </div>
</header>

<!-- Main content -->
<main class="container mx-auto p-8">
    <!-- Botones en el centro de la pantalla -->
    <div class="flex justify-center space-x-4 mb-8">
        <button class="bg-blue-500 text-white px-6 py-3 rounded-lg">Administrar Productos</button>
        <button class="bg-green-500 text-white px-6 py-3 rounded-lg">Ver Pedidos</button>
    </div>

    <!-- Titulo -->
    <h2 class="text-3xl text-center mb-6 font-semibold">Productos Disponibles</h2>

    <!-- Filtro de categorías (puedes agregar un filtro aquí si es necesario) -->
    <div class="mb-8 text-center">
        <select class="p-3 rounded-lg border">
            <option value="">Filtrar por categoría</option>
            <option value="categoria1">Categoría 1</option>
            <option value="categoria2">Categoría 2</option>
        </select>
    </div>

    <!-- Productos -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <?php while ($row = $result->fetch_assoc()) { ?>
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src="../frontend/uploads/<?php echo $row['image']; ?>" alt="<?php echo $row['name']; ?>" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="text-xl font-semibold text-gray-700"><?php echo $row['name']; ?></h3>
                    <p class="text-lg text-gray-500">$<?php echo $row['price']; ?></p>
                    <div class="mt-4">
                        <a href="edit-product.php?id=<?php echo $row['id']; ?>" class="w-full bg-blue-500 text-white px-4 py-2 rounded-lg text-center">Editar Producto</a>
                    </div>
                </div>
            </div>
        <?php } ?>
    </div>
</main>

</body>
</html>
