<?php
// header.php (partial)
// Requiere: session iniciada ANTES en cada página
// Variables opcionales:
// $pageTitle (string) - para mostrar un subtítulo pequeño si quieres
// $backUrl (string|null) - si es null, no muestra botón volver
// $backText (string) - texto del botón volver
if (!isset($pageTitle)) $pageTitle = "";
if (!isset($backUrl)) $backUrl = null;
if (!isset($backText)) $backText = "Volver";

$logoUrl = "assets/logo.png"; // pon tu logo aquí: frontend/assets/logo.png
$hasLogo = file_exists(__DIR__ . "/../assets/logo.png");
?>

<header class="bg-blue-700 text-white shadow">
  <div class="container mx-auto px-4 py-3">
    <div class="flex items-center justify-between gap-3">

      <!-- Izquierda: Logo + Nombre -->
      <a href="index.php" class="flex items-center gap-3 min-w-0">
        <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
          <?php if ($hasLogo): ?>
            <img src="<?php echo $logoUrl; ?>" alt="Logo" class="w-full h-full object-cover">
          <?php else: ?>
            <span class="text-xs text-white/80 font-bold">LOGO</span>
          <?php endif; ?>
        </div>

        <div class="min-w-0">
          <div class="text-lg sm:text-xl font-extrabold leading-tight truncate">
            TIENDA 3 HERMANOS
          </div>
          <?php if ($pageTitle !== ""): ?>
            <div class="text-xs sm:text-sm text-white/80 truncate">
              <?php echo htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8'); ?>
            </div>
          <?php endif; ?>
        </div>
      </a>

      <!-- Derecha: Volver + Cerrar sesión -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <?php if (!empty($backUrl)): ?>
          <a href="<?php echo htmlspecialchars($backUrl, ENT_QUOTES, 'UTF-8'); ?>"
             class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm font-semibold transition">
            <span class="text-base">←</span>
            <span class="hidden sm:inline"><?php echo htmlspecialchars($backText, ENT_QUOTES, 'UTF-8'); ?></span>
          </a>
        <?php endif; ?>

        <a href="logout.php"
           class="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-sm font-semibold transition">
          <span class="text-base">⎋</span>
          <span class="hidden sm:inline">Cerrar sesión</span>
        </a>
      </div>

    </div>
  </div>
</header>
