import React, { useState, useEffect } from 'react';
import { transactionsApi } from '../api';
import { Clock, Search, Eye, X, Receipt, ShoppingBag, User, Calendar, CreditCard, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await transactionsApi.getAll();
      if (res.data.status === 'success') {
        setTransactions(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetails = async (id) => {
    setLoadingDetails(true);
    setSelectedTransaction(id);
    try {
      const res = await transactionsApi.getDetails(id);
      if (res.data.status === 'success') {
        setDetails(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const downloadPDF = () => {
    if (!details) return;

    const doc = new jsPDF();
    const { purchase, items } = details;
    const date = new Date(purchase.created_at).toLocaleString();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(22, 163, 74); // primary-600
    doc.text('SUPERMERCADO 3 HERMANOS', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Sistema de Gestión Interna', 105, 28, { align: 'center' });
    
    doc.setDrawColor(200);
    doc.line(20, 35, 190, 35);

    // Purchase Info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`${purchase.purchase_type === 'FACTURA' ? 'FACTURA INTERNA' : 'NOTA DE VENTA'}`, 20, 45);
    doc.setFontSize(10);
    doc.text(`Nro. Comprobante: #000${purchase.id}`, 20, 52);
    doc.text(`Fecha: ${date}`, 20, 57);

    // Customer Info
    if (purchase.purchase_type === 'FACTURA' && purchase.customer_name) {
      doc.setFontSize(11);
      doc.text('DATOS DEL CLIENTE:', 20, 75);
      doc.setFontSize(10);
      doc.text(`Nombre: ${purchase.customer_name}`, 20, 82);
      doc.text(`ID/Cédula: ${purchase.customer_idnumber || 'N/A'}`, 20, 87);
      doc.text(`Dirección: ${purchase.customer_address || 'N/A'}`, 20, 92);
      doc.text(`Teléfono: ${purchase.customer_phone || 'N/A'}`, 20, 97);
    } else {
      doc.text('Cliente: CONSUMIDOR FINAL', 20, 75);
    }

    // Table
    const tableData = items.map(item => [
      item.product_name,
      item.quantity,
      `$${parseFloat(item.unit_price).toFixed(2)}`,
      `$${parseFloat(item.line_total).toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: (purchase.purchase_type === 'FACTURA' && purchase.customer_name) ? 105 : 85,
      head: [['Producto', 'Cant.', 'P. Unit', 'Subtotal']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [22, 163, 74] }
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(10);
    doc.text(`SUBTOTAL:`, 140, finalY);
    doc.text(`$${parseFloat(purchase.subtotal).toFixed(2)}`, 175, finalY, { align: 'right' });
    
    doc.text(`IVA (15%):`, 140, finalY + 7);
    doc.text(`$${parseFloat(purchase.iva).toFixed(2)}`, 175, finalY + 7, { align: 'right' });
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`TOTAL:`, 140, finalY + 16);
    doc.text(`$${parseFloat(purchase.total).toFixed(2)}`, 175, finalY + 16, { align: 'right' });

    // Footer
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(150);
    doc.text('Este documento es para control interno y no tiene validez tributaria ante el SRI.', 105, 280, { align: 'center' });

    doc.save(`Comprobante_3Hermanos_${purchase.id}.pdf`);
  };

  const filteredTransactions = transactions.filter(t => 
    t.id.toString().includes(search) || 
    t.purchase_type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tighter">Historial de Transacciones</h1>
          <p className="text-sm text-gray-500 font-medium">Consulta y detalla todas las ventas realizadas.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por ID o tipo..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium text-sm shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Fecha y Hora</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tipo</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-black text-gray-400 text-xs">#{t.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-sm">{new Date(t.created_at).toLocaleDateString()}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        t.purchase_type === 'FACTURA' 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'bg-green-50 text-green-600'
                      }`}>
                        {t.purchase_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-black text-gray-900 text-base tracking-tighter">${parseFloat(t.total).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => fetchDetails(t.id)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-600 text-white rounded-xl">
                    <Receipt className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">Detalles de Venta #{selectedTransaction}</h2>
                </div>
                <button 
                  onClick={() => { setSelectedTransaction(null); setDetails(null); }}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                {loadingDetails ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : details ? (
                  <div className="space-y-8">
                    {/* Header Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                          <Calendar className="h-3 w-3" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Fecha</span>
                        </div>
                        <p className="text-xs font-black text-gray-900">{new Date(details.purchase.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                          <Clock className="h-3 w-3" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Hora</span>
                        </div>
                        <p className="text-xs font-black text-gray-900">{new Date(details.purchase.created_at).toLocaleTimeString()}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                          <CreditCard className="h-3 w-3" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Tipo</span>
                        </div>
                        <p className="text-xs font-black text-gray-900">{details.purchase.purchase_type.replace('_', ' ')}</p>
                      </div>
                      <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100">
                        <div className="flex items-center gap-2 text-primary-400 mb-1">
                          <ShoppingBag className="h-3 w-3" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Total</span>
                        </div>
                        <p className="text-sm font-black text-primary-600">${parseFloat(details.purchase.total).toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Products List */}
                    <div>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <ShoppingBag className="h-3 w-3" />
                        Productos Adquiridos
                      </h3>
                      <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                              <th className="px-6 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">Producto</th>
                              <th className="px-6 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Cant.</th>
                              <th className="px-6 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Precio</th>
                              <th className="px-6 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {details.items.map((item, i) => (
                              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-gray-100 overflow-hidden border border-gray-100 flex-shrink-0">
                                      <img src={item.image_url} alt={item.product_name} className="h-full w-full object-cover" />
                                    </div>
                                    <span className="font-bold text-gray-900 text-xs">{item.product_name}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-3 text-center">
                                  <span className="font-black text-gray-900 text-xs">{item.quantity}</span>
                                </td>
                                <td className="px-6 py-3 text-right">
                                  <span className="font-bold text-gray-400 text-xs">${parseFloat(item.unit_price).toFixed(2)}</span>
                                </td>
                                <td className="px-6 py-3 text-right">
                                  <span className="font-black text-gray-900 text-xs">${parseFloat(item.line_total).toFixed(2)}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Footer Summary */}
                    <div className="flex justify-end pt-4">
                      <div className="w-full md:w-64 space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                          <span>Subtotal</span>
                          <span>${parseFloat(details.purchase.subtotal).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                          <span>IVA (15%)</span>
                          <span>${parseFloat(details.purchase.iva).toFixed(2)}</span>
                        </div>
                        <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                          <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Total</span>
                          <span className="text-2xl font-black text-primary-600 tracking-tighter">${parseFloat(details.purchase.total).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  onClick={downloadPDF}
                  className="bg-primary-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg active:scale-95 flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Descargar PDF
                </button>
                <button 
                  onClick={() => { setSelectedTransaction(null); setDetails(null); }}
                  className="bg-gray-900 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                >
                  Cerrar Detalles
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Transactions;
