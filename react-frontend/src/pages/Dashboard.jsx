import React, { useState, useEffect } from 'react';
import { dashboardApi, transactionsApi } from '../api';
import { TrendingUp, Package, AlertTriangle, Clock, DollarSign, ArrowRight, Users as UsersIcon, Receipt, X, Calendar, CreditCard, ShoppingBag, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await dashboardApi.getStats();
      if (res.data.status === 'success') {
        setData(res.data);
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
    doc.text('LOCAL COMERCIAL TRES HERMANOS', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Sistema de Gestión Interna', 105, 28, { align: 'center' });
    
    doc.setDrawColor(200);
    doc.line(20, 35, 190, 35);

    // Purchase Info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`${purchase.purchase_type === 'FACTURA' ? 'COMPROBANTE DE VENTA' : 'NOTA DE VENTA'}`, 20, 45);
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

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 tracking-tighter">Panel Administrativo</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">Monitorea el rendimiento de tu supermercado en tiempo real.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex items-center gap-5 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-bl-[4rem] -z-0 transition-transform group-hover:scale-110 duration-500"></div>
          <div className="p-4 bg-green-600 text-white rounded-2xl relative z-10 shadow-lg shadow-green-100">
            <DollarSign className="h-6 w-6" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Ventas Hoy</p>
            <p className="text-2xl font-black text-gray-900 tracking-tighter">${parseFloat(data.stats.salesToday).toFixed(2)}</p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex items-center gap-5 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-[4rem] -z-0 transition-transform group-hover:scale-110 duration-500"></div>
          <div className="p-4 bg-blue-600 text-white rounded-2xl relative z-10 shadow-lg shadow-blue-100">
            <Package className="h-6 w-6" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Productos</p>
            <p className="text-2xl font-black text-gray-900 tracking-tighter">{data.stats.totalProducts}</p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex items-center gap-5 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-bl-[4rem] -z-0 transition-transform group-hover:scale-110 duration-500"></div>
          <div className="p-4 bg-red-500 text-white rounded-2xl relative z-10 shadow-lg shadow-red-100">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <Link to="/inventory" className="relative z-10 hover:opacity-80 transition-opacity text-left">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Bajo Stock</p>
            <p className="text-2xl font-black text-gray-900 tracking-tighter">{data.stats.lowStockCount}</p>
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sales */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col max-h-[500px]">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 shrink-0">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
              <Clock className="h-5 w-5 text-primary-600" />
              Últimas Transacciones
            </h2>
          </div>
          <div className="divide-y divide-gray-50 overflow-y-auto custom-scrollbar">
            {data.recentSales.map((sale) => (
              <div 
                key={sale.id} 
                onClick={() => fetchDetails(sale.id)}
                className="p-6 flex justify-between items-center hover:bg-gray-50/80 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-[10px] text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    #{sale.id}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-base tracking-tight">Orden de Venta</p>
                    <p className="text-[10px] text-gray-400 font-medium">{new Date(sale.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-primary-600 text-lg tracking-tighter">${parseFloat(sale.total).toFixed(2)}</p>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[8px] font-black uppercase rounded-lg tracking-widest">
                    {sale.purchase_type === 'FACTURA' ? 'Comprobante de venta' : 'Nota de venta'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Accesos Directos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Link to="/inventory" className="p-6 bg-primary-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(22,163,74,0.3)] flex flex-col justify-between h-44 group hover:scale-[1.02] transition-all duration-500 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <Package className="h-8 w-8 opacity-40 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <p className="font-black text-xl tracking-tight mb-1">Inventario</p>
                <p className="text-xs text-primary-100 font-medium">Control total de stock</p>
              </div>
            </Link>
            <Link to="/users" className="p-6 bg-gray-900 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col justify-between h-44 group hover:scale-[1.02] transition-all duration-500 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <UsersIcon className="h-8 w-8 opacity-40 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <p className="font-black text-xl tracking-tight mb-1">Personal</p>
                <p className="text-xs text-gray-400 font-medium">Gestionar equipo</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
                        <p className="text-xs font-black text-gray-900">
                          {details.purchase.purchase_type === 'FACTURA' ? 'Comprobante de venta' : 'Nota de venta'}
                        </p>
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

export default Dashboard;
