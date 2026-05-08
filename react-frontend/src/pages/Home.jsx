import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ShieldCheck, LayoutDashboard, Package, Users as UsersIcon, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center bg-gradient-to-b from-primary-50 to-white">
        <div className="mb-8 flex justify-center">
          <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-black tracking-widest animate-bounce">
            SISTEMA INTERNO
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tighter">
          Supermercado <br />
          <span className="text-primary-600">3 Hermanos</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-12 leading-relaxed font-medium">
          Plataforma integral de gestión de ventas y administración de personal.
        </p>
        <div className="flex flex-col sm:flex-row gap-6">
          <Link
            to="/inventory"
            className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-primary-200 flex items-center justify-center gap-3 active:scale-95"
          >
            Vender / Inventario
            <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </section>

      {/* Modules Preview */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { 
              icon: <LayoutDashboard className="h-8 w-8" />, 
              title: 'Dashboard', 
              desc: 'Visualiza indicadores de ventas y stock en tiempo real.' 
            },
            { 
              icon: <Package className="h-8 w-8" />, 
              title: 'Inventario', 
              desc: 'Control total de productos, categorías y abastecimiento.' 
            },
            { 
              icon: <UsersIcon className="h-8 w-8" />, 
              title: 'Personal', 
              desc: 'Gestión de usuarios y roles (Admin/Trabajador).' 
            },
            { 
              icon: <ShieldCheck className="h-8 w-8" />, 
              title: 'Seguridad', 
              desc: 'Acceso restringido y auditoría de movimientos internos.' 
            },
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="p-4 bg-primary-50 text-primary-600 rounded-2xl w-fit mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="bg-primary-600 text-white px-2 py-0.5 rounded-lg font-black text-xl">3</span>
            <span className="text-gray-900 font-black text-xl uppercase tracking-tighter">Hermanos</span>
          </div>
          <p className="text-gray-400 text-sm font-medium">
            © 2026 Supermercado 3 Hermanos | Panel de Gestión Interna.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
