<?php
include('../backend/db.php');

// Comprobar si el formulario de registro fue enviado
if (isset($_POST['register'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    // Verificar si las contraseñas coinciden
    if ($password !== $confirm_password) {
        echo "<script>Swal.fire('Error', 'Las contraseñas no coinciden', 'error');</script>";
    } else {
        // Verificar si el correo ya está registrado
        $sql = "SELECT * FROM users WHERE email='$email'";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            echo "<script>Swal.fire('Error', 'El correo ya está registrado', 'error');</script>";
        } else {
            // Registrar el nuevo usuario
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            $sql = "INSERT INTO users (email, password) VALUES ('$email', '$hashed_password')";
            if ($conn->query($sql) === TRUE) {
                echo "<script>Swal.fire('Éxito', 'Registro exitoso', 'success');</script>";
                header("Location: login.php"); // Redirigir al login después de registrarse
            } else {
                echo "<script>Swal.fire('Error', 'Error al registrar el usuario', 'error');</script>";
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro - Tienda</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.0.2/dist/tailwind.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@10"></script>
</head>
<body class="bg-gray-200">

<div class="flex justify-center items-center h-screen">
    <div class="bg-white shadow-xl rounded-lg max-w-lg w-full p-8">
        <h2 class="text-2xl font-semibold text-center mb-6">Crear Cuenta</h2>
        <!-- Formulario de Registro -->
        <form action="register.php" method="POST" id="register-form">
            <div class="mb-4">
                <label for="email" class="block text-gray-700">Correo Electrónico</label>
                <input type="email" name="email" id="email" class="w-full p-3 mt-2 border rounded-lg" placeholder="Tu correo" required>
            </div>

            <div class="mb-4">
                <label for="password" class="block text-gray-700">Contraseña</label>
                <input type="password" name="password" id="password" class="w-full p-3 mt-2 border rounded-lg" placeholder="Tu contraseña" required>
            </div>

            <div class="mb-4">
                <label for="confirm_password" class="block text-gray-700">Confirmar Contraseña</label>
                <input type="password" name="confirm_password" id="confirm_password" class="w-full p-3 mt-2 border rounded-lg" placeholder="Confirma tu contraseña" required>
            </div>

            <button type="submit" name="register" class="w-full p-3 mt-4 bg-green-600 text-white font-semibold rounded-lg">Registrar</button>
        </form>

        <div class="mt-4 text-center">
            <p>¿Ya tienes cuenta? <a href="login.php" class="text-blue-600">Inicia sesión aquí</a></p>
        </div>
    </div>
</div>

</body>
</html>
