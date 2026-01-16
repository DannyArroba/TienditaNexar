<?php
session_start();
include('../backend/db.php');
require('../fpdf/fpdf.php');

if (!isset($_SESSION['user_id'])) {
  header("Location: login.php");
  exit();
}

$user_id = (int)$_SESSION['user_id'];
$purchase_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($purchase_id <= 0) {
  die("ID inválido.");
}

// 1) Verificar que la compra sea del usuario
$q = $conn->query("SELECT * FROM purchases WHERE id = $purchase_id AND user_id = $user_id LIMIT 1");
if (!$q || $q->num_rows === 0) {
  die("Compra no encontrada o no autorizada.");
}
$p = $q->fetch_assoc();

// 2) Items
$items = [];
$qi = $conn->query("SELECT * FROM purchase_items WHERE purchase_id = $purchase_id");
if ($qi) {
  while ($it = $qi->fetch_assoc()) $items[] = $it;
}

function txt($s) {
  // FPDF no soporta UTF-8 directo si no usas fuentes unicode
  // Esto evita caracteres raros
  return iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $s ?? '');
}

$purchaseType = $p['purchase_type']; // CONSUMIDOR_FINAL | FACTURA
$typeLabel = ($purchaseType === 'FACTURA') ? 'Factura / Comprobante' : 'Consumidor final';
$fecha = $p['created_at'];
$subtotal = (float)$p['subtotal'];
$iva = (float)$p['iva'];
$total = (float)$p['total'];

// Datos empresa (ajústalos a tu gusto)
$businessName = "TIENDA 3 HERMANOS";
$businessAddress = "YANUNCOCHA Y BAÑOS";
$businessPhone = "Tel: 0983241223";
$businessEmail = "3hermanossan@gmail.com";

// Logo (opcional)
$logoPath = __DIR__ . "./assets/logo.png"; // frontend/assets/logo.png

// PDF
$pdf = new FPDF('P', 'mm', 'A4');
$pdf->AddPage();
$pdf->SetAutoPageBreak(true, 18);

// Encabezado con logo
if (file_exists($logoPath)) {
  $pdf->Image($logoPath, 10, 10, 28); // x,y,w
}

$pdf->SetFont('Arial', 'B', 14);
$pdf->SetXY(45, 12);
$pdf->Cell(0, 7, txt($businessName), 0, 1);

$pdf->SetFont('Arial', '', 10);
$pdf->SetX(45);
$pdf->Cell(0, 5, txt($businessAddress), 0, 1);
$pdf->SetX(45);
$pdf->Cell(0, 5, txt($businessPhone . " | " . $businessEmail), 0, 1);

$pdf->Ln(6);

// Caja info comprobante
$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(0, 7, txt("COMPROBANTE DE COMPRA"), 0, 1, 'C');

$pdf->Ln(2);

$pdf->SetFont('Arial', '', 10);
$pdf->Cell(95, 6, txt("Nro. Compra: #".$purchase_id), 0, 0, 'L');
$pdf->Cell(95, 6, txt("Fecha: ".$fecha), 0, 1, 'R');

$pdf->Cell(95, 6, txt("Tipo: ".$typeLabel), 0, 1, 'L');

$pdf->Ln(2);

// Datos cliente
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(0, 7, txt("Datos del cliente"), 0, 1);

$pdf->SetFont('Arial', '', 10);

if ($purchaseType === 'FACTURA') {
  $pdf->Cell(0, 5, txt("Nombre: ".$p['customer_name']), 0, 1);
  $pdf->Cell(0, 5, txt("Cédula/RUC: ".$p['customer_idnumber']), 0, 1);
  $pdf->Cell(0, 5, txt("Correo: ".$p['customer_email']), 0, 1);
  $pdf->Cell(0, 5, txt("Teléfono: ".$p['customer_phone']), 0, 1);
  $pdf->MultiCell(0, 5, txt("Dirección: ".$p['customer_address']), 0, 'L');
} else {
  $pdf->Cell(0, 5, txt("Consumidor final (sin datos)"), 0, 1);
}

$pdf->Ln(4);

// Tabla items
$pdf->SetFont('Arial', 'B', 10);
$pdf->SetFillColor(240, 240, 240);
$pdf->Cell(92, 8, txt("Producto"), 1, 0, 'L', true);
$pdf->Cell(20, 8, txt("Cant."), 1, 0, 'C', true);
$pdf->Cell(38, 8, txt("P. Unit"), 1, 0, 'R', true);
$pdf->Cell(40, 8, txt("Total"), 1, 1, 'R', true);

$pdf->SetFont('Arial', '', 10);

foreach ($items as $it) {
  $name = $it['product_name'];
  $qty = (int)$it['quantity'];
  $unit = (float)$it['unit_price'];
  $line = (float)$it['line_total'];

  // Para nombres largos: recorta suave
  $n = $name;
  if (mb_strlen($n) > 48) $n = mb_substr($n, 0, 48) . "...";

  $pdf->Cell(92, 8, txt($n), 1, 0, 'L');
  $pdf->Cell(20, 8, txt((string)$qty), 1, 0, 'C');
  $pdf->Cell(38, 8, txt("$".number_format($unit, 2)), 1, 0, 'R');
  $pdf->Cell(40, 8, txt("$".number_format($line, 2)), 1, 1, 'R');
}

$pdf->Ln(4);

// Totales
$pdf->SetFont('Arial', 'B', 10);
$pdf->Cell(150, 7, txt("Subtotal:"), 0, 0, 'R');
$pdf->SetFont('Arial', '', 10);
$pdf->Cell(40, 7, txt("$".number_format($subtotal, 2)), 0, 1, 'R');

$pdf->SetFont('Arial', 'B', 10);
$pdf->Cell(150, 7, txt("IVA (12%):"), 0, 0, 'R');
$pdf->SetFont('Arial', '', 10);
$pdf->Cell(40, 7, txt("$".number_format($iva, 2)), 0, 1, 'R');

$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(150, 8, txt("TOTAL:"), 0, 0, 'R');
$pdf->Cell(40, 8, txt("$".number_format($total, 2)), 0, 1, 'R');

$pdf->Ln(6);

// Leyenda legal / nota
$pdf->SetFont('Arial', 'I', 9);
$nota = "NOTA: Este documento es un comprobante de compra NO AUTORIZADO. "
      . "No constituye comprobante tributario autorizado por el SRI, "
      . "ya que el establecimiento no cuenta con respaldo/validación de facturación electrónica.";
$pdf->MultiCell(0, 5, txt($nota), 0, 'C');

$pdf->Ln(2);
$pdf->SetFont('Arial', '', 9);
$pdf->MultiCell(0, 5, txt("Gracias por su compra."), 0, 'C');

// Descargar
$filename = "comprobante_compra_".$purchase_id.".pdf";
$pdf->Output('D', $filename);
exit();
