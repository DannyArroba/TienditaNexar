import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../api';
import { TrendingUp, Package, AlertTriangle, Clock, DollarSign, ArrowRight, Users as UsersIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Administrativo</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
          <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
            <DollarSign className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Ventas Hoy</p>
            <p className="text-3xl font-black text-gray-900">${parseFloat(data.stats.salesToday).toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <Package className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Productos</p>
            <p className="text-3xl font-black text-gray-900">{data.stats.totalProducts}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <Link to="/inventory" className="hover:opacity-80 transition-opacity text-left">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Bajo Stock</p>
            <p className="text-3xl font-black text-gray-900">{data.stats.lowStockCount}</p>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sales */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary-600" />
              Ventas Recientes
            </h2>
            <Link to="/reports" className="text-primary-600 text-sm font-bold hover:underline">Ver todo</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {data.recentSales.map((sale) => (
              <div key={sale.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-bold text-gray-900">Orden #{sale.id}</p>
                  <p className="text-xs text-gray-400">{new Date(sale.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-primary-600">${parseFloat(sale.total).toFixed(2)}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{sale.purchase_type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Accesos Rápidos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/inventory" className="p-6 bg-primary-600 text-white rounded-3xl shadow-lg shadow-primary-100 flex flex-col justify-between h-40 group hover:scale-[1.02] transition-all">
              <Package className="h-8 w-8 opacity-50 group-hover:opacity-100 transition-opacity" />
              <div>
                <p className="font-bold text-lg">Inventario</p>
                <p className="text-sm text-primary-100">Gestionar productos y stock</p>
              </div>
            </Link>
            <Link to="/users" className="p-6 bg-gray-900 text-white rounded-3xl shadow-lg shadow-gray-100 flex flex-col justify-between h-40 group hover:scale-[1.02] transition-all">
              <UsersIcon className="h-8 w-8 opacity-50 group-hover:opacity-100 transition-opacity" />
              <div>
                <p className="font-bold text-lg">Personal</p>
                <p className="text-sm text-gray-400">Administrar trabajadores</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
