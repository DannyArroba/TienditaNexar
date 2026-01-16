// frontend/assets/alerts.js
// Requiere SweetAlert2 cargado antes (cdn)

window.Alerts = {
  toastSuccess(text) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: text,
      showConfirmButton: false,
      timer: 1700,
      timerProgressBar: true,
    });
  },

  toastError(text) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: text,
      showConfirmButton: false,
      timer: 2200,
      timerProgressBar: true,
    });
  },

  toastInfo(text) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "info",
      title: text,
      showConfirmButton: false,
      timer: 1800,
      timerProgressBar: true,
    });
  },

  modalSuccess(title, text = "") {
    Swal.fire({
      icon: "success",
      title,
      text,
      confirmButtonText: "OK",
      confirmButtonColor: "#2563eb",
    });
  },

  modalError(title, text = "") {
    Swal.fire({
      icon: "error",
      title,
      text,
      confirmButtonText: "Entendido",
      confirmButtonColor: "#dc2626",
    });
  },

  confirmCheckout(onConfirm) {
    Swal.fire({
      icon: "question",
      title: "¿Proceder con la compra?",
      text: "Serás enviado al checkout para confirmar los datos y finalizar.",
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) onConfirm();
    });
  },

  confirmDelete(text, onConfirm) {
    Swal.fire({
      icon: "warning",
      title: "¿Eliminar?",
      text: text || "Esta acción no se puede deshacer.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    }).then((res) => {
      if (res.isConfirmed) onConfirm();
    });
  },
};
