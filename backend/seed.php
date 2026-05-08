<?php
include('db.php');

echo "Poblando base de datos con productos para Supermercado 3 Hermanos...\n";

$products = [
    ['Coca-Cola 2.5L', 2.50, 50, 'Bebidas', 'Refresco de cola familiar', 'cocacola.png'],
    ['Agua Mineral 500ml', 0.50, 100, 'Bebidas', 'Agua sin gas', 'agua.png'],
    ['Jugo de Naranja 1L', 1.20, 30, 'Bebidas', 'Jugo natural pasteurizado', 'jugo.png'],
    ['Leche Entera 1L', 0.90, 40, 'Lácteos', 'Leche de vaca fortificada', 'leche.png'],
    ['Yogurt de Fresa 1kg', 1.80, 25, 'Lácteos', 'Yogurt cremoso con trozos', 'yogurt.png'],
    ['Queso Fresco 500g', 3.50, 15, 'Lácteos', 'Queso artesanal', 'queso.png'],
    ['Arroz 5kg', 4.50, 60, 'Abarrotes', 'Arroz grano largo', 'arroz.png'],
    ['Aceite Girasol 1L', 2.10, 35, 'Abarrotes', 'Aceite vegetal refinado', 'aceite.png'],
    ['Pan de Molde', 1.50, 20, 'Panadería', 'Pan blanco tajado', 'pan.png'],
    ['Café Molido 250g', 3.20, 25, 'Abarrotes', 'Café de altura seleccionado', 'cafe.png']
];

foreach ($products as $p) {
    $name = $conn->real_escape_string($p[0]);
    $price = $p[1];
    $stock = $p[2];
    $cat = $conn->real_escape_string($p[3]);
    $desc = $conn->real_escape_string($p[4]);
    $img = $p[5];

    // Verificar si ya existe
    $check = $conn->query("SELECT id FROM products WHERE name = '$name'");
    if ($check->num_rows == 0) {
        $sql = "INSERT INTO products (name, price, stock, category, description, image) 
                VALUES ('$name', '$price', '$stock', '$cat', '$desc', '$img')";
        if ($conn->query($sql)) {
            echo "Producto agregado: $name\n";
        }
    } else {
        echo "Producto ya existe: $name\n";
    }
}

echo "Proceso de población completado.\n";
?>
