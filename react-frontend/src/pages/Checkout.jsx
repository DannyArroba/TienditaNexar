import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { checkoutApi, customersApi } from '../api';
import { ShieldCheck, CheckCircle2, Loader2, ArrowLeft, XCircle, Search, UserCheck } from 'lucide-react';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchingCustomer, setSearchingCustomer] = useState(false);
  const [customerLookup, setCustomerLookup] = useState(null);
  
  const [formData, setFormData] = useState({
    purchase_type: 'CONSUMIDOR_FINAL',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    customer_idnumber: '',
  });

  const generatePDF = (purchaseId) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleString();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(22, 163, 74); // primary-600
    doc.text('LOCAL COMERCIAL TRES HERMANOS', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Sistema de Gestión Interna', 105, 28, { align: 'center' });
    
    doc.setDrawColor(200);
    doc.line(20, 35, 190, 35);

    // Purchase Info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`${formData.purchase_type === 'FACTURA' ? 'COMPROBANTE DE VENTA' : 'NOTA DE VENTA'}`, 20, 45);
    doc.setFontSize(10);
    doc.text(`Nro. Comprobante: #000${purchaseId}`, 20, 52);
    doc.text(`Fecha: ${date}`, 20, 57);
    doc.text(`Vendedor: ${user.email}`, 20, 62);

    // Customer Info
    if (formData.purchase_type === 'FACTURA') {
      doc.setFontSize(11);
      doc.text('DATOS DEL CLIENTE:', 20, 75);
      doc.setFontSize(10);
      doc.text(`Nombre: ${formData.customer_name}`, 20, 82);
      doc.text(`ID/Cédula: ${formData.customer_idnumber}`, 20, 87);
      doc.text(`Dirección: ${formData.customer_address}`, 20, 92);
      doc.text(`Teléfono: ${formData.customer_phone}`, 20, 97);
    } else {
      doc.text('Cliente: CONSUMIDOR FINAL', 20, 75);
    }

    // Table
    const tableData = cart.map(item => [
      item.name,
      item.quantity,
      `$${parseFloat(item.price).toFixed(2)}`,
      `$${(item.price * item.quantity).toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: formData.purchase_type === 'FACTURA' ? 105 : 85,
      head: [['Producto', 'Cant.', 'P. Unit', 'Subtotal']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [22, 163, 74] }
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    const subtotal = cartTotal;
    const iva = cartTotal * 0.15;
    const total = cartTotal * 1.15;

    doc.text(`SUBTOTAL:`, 140, finalY);
    doc.text(`$${subtotal.toFixed(2)}`, 175, finalY, { align: 'right' });
    
    doc.text(`IVA (15%):`, 140, finalY + 7);
    doc.text(`$${iva.toFixed(2)}`, 175, finalY + 7, { align: 'right' });
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`TOTAL:`, 140, finalY + 16);
    doc.text(`$${total.toFixed(2)}`, 175, finalY + 16, { align: 'right' });

    // Footer
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(150);
    doc.text('Este documento es para control interno y no tiene validez tributaria ante el SRI.', 105, 280, { align: 'center' });

    doc.save(`Comprobante_3Hermanos_${purchaseId}.pdf`);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md">
          <XCircle className="h-20 w-20 text-red-100 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tighter uppercase">Venta Vacía</h2>
          <p className="text-gray-500 mb-8 font-medium">No hay productos seleccionados para generar el comprobante.</p>
          <button 
            onClick={() => navigate('/sales')}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-primary-100"
          >
            VOLVER AL POS
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const value = ['customer_idnumber', 'customer_phone'].includes(e.target.name)
      ? e.target.value.replace(/\D/g, '').slice(0, 10)
      : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    if (e.target.name === 'customer_idnumber') {
      setCustomerLookup(null);
    }
  };

  const findCustomer = async () => {
    if (!/^22\d{8}$/.test(formData.customer_idnumber)) {
      setCustomerLookup({ found: false, message: 'Ingresa una cedula de 10 digitos que inicie con 22.' });
      return;
    }

    setSearchingCustomer(true);
    try {
      const response = await customersApi.findByIdNumber(formData.customer_idnumber);
      const customer = response.data.data;
      if (customer) {
        setFormData((current) => ({
          ...current,
          customer_name: customer.name || '',
          customer_email: customer.email || '',
          customer_phone: customer.phone || '',
          customer_address: customer.address || '',
        }));
        setCustomerLookup({ found: true, message: 'Cliente encontrado. Sus datos fueron completados.' });
      } else {
        setCustomerLookup({ found: false, message: 'Cliente nuevo. Completa sus datos y se guardara con esta venta.' });
      }
    } catch (error) {
      setCustomerLookup({ found: false, message: 'No se pudo consultar el cliente.' });
    } finally {
      setSearchingCustomer(false);
    }
  };

  const handleCancel = async () => {
    const result = await Swal.fire({
      title: '¿Cancelar venta?',
      text: "Se borrarán todos los productos seleccionados",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cancelar todo',
      cancelButtonText: 'No, continuar'
    });

    if (result.isConfirmed) {
      clearCart();
      navigate('/sales');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire('Error', 'Debes estar autenticado para vender', 'error');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      if (formData.purchase_type === 'FACTURA' && !/^22\d{8}$/.test(formData.customer_idnumber)) {
        Swal.fire('Cedula invalida', 'Debe iniciar con 22 y contener 10 digitos', 'error');
        return;
      }
      const res = await checkoutApi.process(formData);
      if (res.data.status === 'success') {
        // Generar PDF
        generatePDF(res.data.purchase_id);

        await Swal.fire({
          icon: 'success',
          title: '¡Venta Exitosa!',
          text: res.data.message || 'Se ha generado el comprobante PDF automáticamente.',
          confirmButtonColor: '#16a34a'
        });
        clearCart();
        navigate('/sales');
      } else {
        Swal.fire('Error', res.data.message || 'Error al procesar la compra', 'error');
      }
    } catch (err) {
      console.error("Error en checkout:", err);
      const errorMsg = err.response?.data?.message || err.message || 'Ocurrió un error inesperado en el servidor';
      Swal.fire('Error', errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulario */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Datos del Comprobante de Venta</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Comprobante</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, purchase_type: 'CONSUMIDOR_FINAL' });
                        setCustomerLookup(null);
                      }}
                      className={`py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                        formData.purchase_type === 'CONSUMIDOR_FINAL'
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                      }`}
                    >
                      Consumidor Final (Nota de Venta)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, purchase_type: 'FACTURA' })}
                      className={`py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                        formData.purchase_type === 'FACTURA'
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                      }`}
                    >
                      Comprobante de Venta
                    </button>
                  </div>
                </div>

                {formData.purchase_type === 'FACTURA' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Nombre Completo</label>
                        <input
                          type="text"
                          name="customer_name"
                          required
                          value={formData.customer_name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Cédula / RUC</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          name="customer_idnumber"
                          required
                          maxLength="10"
                          value={formData.customer_idnumber}
                          onChange={handleInputChange}
                          onBlur={() => formData.customer_idnumber.length === 10 && findCustomer()}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={findCustomer}
                          disabled={searchingCustomer}
                          className="mt-2 w-full py-2.5 bg-gray-900 hover:bg-primary-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                          {searchingCustomer ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                          Buscar cliente
                        </button>
                        {customerLookup && (
                          <div className={`mt-2 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                            customerLookup.found ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {customerLookup.found && <UserCheck className="h-4 w-4" />}
                            {customerLookup.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</label>
                      <input
                        type="email"
                        name="customer_email"
                        value={formData.customer_email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Teléfono</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        name="customer_phone"
                        required
                        maxLength="10"
                        value={formData.customer_phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Dirección</label>
                      <textarea
                        name="customer_address"
                        required
                        rows="3"
                        value={formData.customer_address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                      ></textarea>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-4 mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-100 disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                      <>
                        Confirmar Compra
                        <CheckCircle2 className="h-5 w-5" />
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <XCircle className="h-5 w-5" />
                    Cancelar Compra
                  </button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                <ShieldCheck className="h-6 w-6 text-primary-500 mb-2" />
                <span className="text-[10px] font-bold text-gray-400 uppercase">Seguridad</span>
                <span className="text-xs font-semibold">SSL Encriptado</span>
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-2xl">
              <h2 className="text-2xl font-bold mb-8">Resumen del Pedido</h2>
              
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-16 w-16 bg-white/10 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-gray-400 text-xs mt-1">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-6 space-y-4">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>IVA (15%)</span>
                  <span>${(cartTotal * 0.15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold pt-4 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-primary-400">${(cartTotal * 1.15).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
