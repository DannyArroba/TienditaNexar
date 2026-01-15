<?php
session_start();
session_destroy(); // Eliminar todas las variables de sesión
header("Location: login.php"); // Redirigir al login
exit();
?>
