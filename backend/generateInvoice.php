<?php
require('../fpdf/fpdf.php'); // Asegúrate de tener la librería FPDF disponible

// Incluir la conexión a la base de datos
include('../backend/db.php');

// Verificar que el usuario esté autenticado
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: ../frontend/login.php"); // Si no está autenticado, redirige al login
    exit();
}

// Obtener los productos del carrito para generar la factura
$user_id = $_SESSION['user_id'];
$sql = "SELECT c.quantity, p.name, p.price 
        FROM carts c 
        JOIN products p ON c.product_id = p.id 
        WHERE c.user_id = '$user_id'";
$result = $conn->query($sql);

$total = 0;
$iva = 0;
$items = [];

// Calcular el total y obtener los detalles de los productos
while ($row = $result->fetch_assoc()) {
    $itemTotal = $row['quantity'] * $row['price'];
    $total += $itemTotal;
    $items[] = [
        'name' => $row['name'],
        'quantity' => $row['quantity'],
        'price' => $row['price'],
        'total' => $itemTotal
    ];
}

// Calcular el IVA (12% de la venta)
$iva = $total * 0.12;
$totalWithIva = $total + $iva;

// Generar el número de factura (puedes mejorar este sistema de numeración)
$invoiceNumber = 'INV-' . strtoupper(uniqid());

// Crear una instancia de FPDF
$pdf = new FPDF();
$pdf->AddPage();
$pdf->SetFont('Arial', 'B', 16);

// Título de la factura
$pdf->Cell(200, 10, "Factura de Compra", 0, 1, 'C');
$pdf->Ln(10);

// Detalles de la factura
$pdf->SetFont('Arial', '', 12);
$pdf->Cell(100, 10, "Fecha: " . date("Y-m-d"), 0, 1);
$pdf->Cell(100, 10, "Número de Factura: $invoiceNumber", 0, 1);

// Listar los productos
$pdf->Ln(10);
$pdf->Cell(90, 10, "Producto", 1, 0, 'C');
$pdf->Cell(30, 10, "Cantidad", 1, 0, 'C');
$pdf->Cell(30, 10, "Precio", 1, 0, 'C');
$pdf->Cell(30, 10, "Total", 1, 1, 'C');

// Mostrar los productos del carrito
foreach ($items as $item) {
    $pdf->Cell(90, 10, $item['name'], 1, 0, 'C');
    $pdf->Cell(30, 10, $item['quantity'], 1, 0, 'C');
    $pdf->Cell(30, 10, "$" . number_format($item['price'], 2), 1, 0, 'C');
    $pdf->Cell(30, 10, "$" . number_format($item['total'], 2), 1, 1, 'C');
}

// Resumen de la factura
$pdf->Ln(10);
$pdf->Cell(150, 10, "Subtotal: ", 0, 0, 'R');
$pdf->Cell(30, 10, "$" . number_format($total, 2), 0, 1, 'C');
$pdf->Cell(150, 10, "IVA (12%): ", 0, 0, 'R');
$pdf->Cell(30, 10, "$" . number_format($iva, 2), 0, 1, 'C');
$pdf->Cell(150, 10, "Total con IVA: ", 0, 0, 'R');
$pdf->Cell(30, 10, "$" . number_format($totalWithIva, 2), 0, 1, 'C');

// Guardar el PDF en el servidor
$pdf->Output('F', '../facturas/factura_' . $invoiceNumber . '.pdf');

// Mostrar un enlace para descargar la factura
echo "Factura generada correctamente. <a href='../facturas/factura_" . $invoiceNumber . ".pdf'>Descargar Factura</a>";
?>
