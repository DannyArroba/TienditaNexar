<?php
$host = 'localhost:3309'; // Cambia esto si tu base de datos está en otro servidor
$user = 'root';      // Usuario de la base de datos
$password = '';      // Contraseña de la base de datos
$dbname = 'tienda';  // Nombre de la base de datos

// Crear conexión
$conn = new mysqli($host, $user, $password, $dbname);

// Verificar si la conexión fue exitosa
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>
