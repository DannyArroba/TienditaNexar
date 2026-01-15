<?php
session_start();
include('../backend/db.php');

// Si el usuario ya está logueado, redirigir a la página principal
if (isset($_SESSION['user_id'])) {
    header("Location: ../frontend/index.php");
    exit();
}

// Comprobar si el formulario de login fue enviado
if (isset($_POST['login'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM users WHERE email='$email'";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            header("Location: ../frontend/index.php"); // Redirigir a la página principal
        } else {
            // Mostrar alerta de error con icono de "X" roja
            echo "<script>
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Contraseña incorrecta',
                        footer: '<a href=\"#\">¿Olvidaste tu contraseña?</a>'
                    });
                  </script>";
        }
    } else {
        // Mostrar alerta de error con icono de "X" roja
        echo "<script>
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Usuario no encontrado',
                    footer: '<a href=\"#\">¿No tienes cuenta? Regístrate aquí</a>'
                });
              </script>";
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Tienda</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.0.2/dist/tailwind.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@10"></script>
</head>
<body class="bg-gray-200">

<div class="flex justify-between h-screen">
    <!-- Lado izquierdo: Formulario de Login -->
    <div class="w-1/2 flex justify-center items-center bg-white shadow-xl">
        <div class="w-full max-w-md p-8">
            <h2 class="text-2xl font-semibold text-center mb-6">Iniciar Sesión</h2>
            
            <!-- Formulario de Login -->
            <form action="login.php" method="POST" id="login-form">
                <div class="mb-4">
                    <label for="email" class="block text-gray-700">Correo Electrónico</label>
                    <input type="email" name="email" id="email" class="w-full p-3 mt-2 border rounded-lg" placeholder="Tu correo" required>
                </div>

                <div class="mb-4">
                    <label for="password" class="block text-gray-700">Contraseña</label>
                    <input type="password" name="password" id="password" class="w-full p-3 mt-2 border rounded-lg" placeholder="Tu contraseña" required>
                </div>

                <button type="submit" name="login" class="w-full p-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg">Iniciar Sesión</button>
            </form>

            <div class="mt-4 text-center">
                <p>¿No tienes cuenta? <a href="register.php" class="text-blue-600">Regístrate aquí</a></p>
            </div>
        </div>
    </div>

    <!-- Lado derecho: Imagen -->
    <div class="w-1/2 bg-cover bg-center" style="background-image: url('your-image-url.jpg');">
        <!-- La imagen se establece a través de la propiedad de fondo CSS -->
    </div>
</div>

</body>
</html>
