<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Carrito de Compras</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h2>Carrito de Compras</h2>

  <!-- El contenido de la tabla del carrito se genera desde PHP -->
  <?php include('cart.php'); ?>

  <button onclick="window.location.href='generateInvoice.php'">Generar Factura</button>
</body>
</html>
