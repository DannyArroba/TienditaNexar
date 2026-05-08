import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ShieldCheck, LayoutDashboard, Package, Users as UsersIcon, ArrowRight, ShoppingBag, TrendingUp, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { dashboardApi } from '../api';

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalSales: 0, totalProducts: 0, totalUsers: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await dashboardApi.getPublicStats();
      if (res.data.status === 'success') {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Error al cargar stats:", err);
    }
  };

  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section with 4K Video Background - Altura Reducida */}
      <section className="relative min-h-[75vh] flex flex-col items-center justify-center px-4 py-12 text-center overflow-hidden">
        {/* Ultra HD Supermarket Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.1] saturate-[1.2]"
            poster="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=80"
          >
            <source 
              src="/vid11.mp4" 
              type="video/mp4" 
            />
            Tu navegador no soporta videos.
          </video>
          {/* Capas de oscuridad y degradado premium */}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60"></div>
          <div className="absolute inset-0 backdrop-blur-[2px]"></div>
        </div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-tight"
        >
          Supermercado <br />
          <span className="bg-gradient-to-r from-primary-400 to-green-400 bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]">3 Hermanos</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-10 text-lg text-gray-200 max-w-2xl mb-12 leading-relaxed font-bold drop-shadow-md"
        >
          Potencia tu negocio con nuestra plataforma integral. Control de inventario inteligente, ventas rápidas y administración eficiente de personal en un solo lugar.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative z-10 flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/login"
            className="bg-primary-700 hover:bg-primary-800 text-white px-10 py-4 rounded-2xl font-black text-base transition-all shadow-[0_20px_50px_rgba(21,128,61,0.4)] flex items-center justify-center gap-3 active:scale-95 group"
          >
            Acceso Personal
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-white/30 shadow-sm flex items-center justify-center text-[8px] font-black text-white ${['bg-blue-500/80', 'bg-green-500/80', 'bg-purple-500/80', 'bg-orange-500/80'][i-1]}`}>
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <span className="text-xs font-black text-white tracking-tight">+{stats.totalUsers} Trabajadores activos</span>
          </div>
        </motion.div>

        {/* Stats Integradas dentro del Video */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="relative z-10 mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl"
        >
          {[
            { label: 'Ventas Totales', value: stats.totalSales, icon: <TrendingUp className="h-4 w-4 text-primary-400" /> },
            { label: 'Productos en Catálogo', value: stats.totalProducts, icon: <ShoppingBag className="h-4 w-4 text-primary-400" /> },
            { label: 'Usuarios Registrados', value: stats.totalUsers, icon: <UsersIcon className="h-4 w-4 text-primary-400" /> },
          ].map((stat, i) => (
            <div key={i} className="flex items-center justify-center gap-3 py-3 px-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl hover:bg-white/10 transition-all group">
              <div className="p-2 bg-primary-600/20 rounded-xl group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="text-left">
                <p className="text-2xl font-black text-white leading-none tracking-tighter">{stat.value}</p>
                <p className="text-gray-400 text-[8px] font-black uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Modules Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-3">Módulos Inteligentes</h2>
            <p className="text-base text-gray-500 font-medium">Todo lo que necesitas para una administración moderna</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { 
                icon: <LayoutDashboard className="h-6 w-6" />, 
                title: 'Dashboard', 
                color: 'bg-blue-500',
                desc: 'Indicadores clave y analítica en tiempo real para decisiones rápidas.' 
              },
              { 
                icon: <Package className="h-6 w-6" />, 
                title: 'Inventario', 
                color: 'bg-primary-600',
                desc: 'Gestión granular de stock, categorías y alertas de reabastecimiento.' 
              },
              { 
                icon: <UsersIcon className="h-6 w-6" />, 
                title: 'Personal', 
                color: 'bg-purple-600',
                desc: 'Control de accesos y administración de roles para tu equipo.' 
              },
              { 
                icon: <ShieldCheck className="h-6 w-6" />, 
                title: 'Seguridad', 
                color: 'bg-orange-500',
                desc: 'Protección de datos y auditoría completa de cada movimiento.' 
              },
            ].map((item, i) => (
              <motion.div 
                whileHover={{ y: -5 }}
                key={i} 
                className="bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group"
              >
                <div className={`p-4 ${item.color} text-white rounded-2xl w-fit mb-6 shadow-lg transition-transform group-hover:scale-110 duration-500`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Compacto */}
      <footer className="py-6 bg-gray-950 text-white relative overflow-hidden">
        {/* Decorative elements for footer */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-[0_0_20px_rgba(22,163,74,0.2)]">3</div>
              <div>
                <span className="text-white font-black text-xl uppercase tracking-tighter block leading-none">Hermanos</span>
                <span className="text-gray-500 text-[8px] font-black uppercase tracking-[0.3em]">Supermercado</span>
              </div>
            </div>

            {/* Links Compactos */}
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              <Link to="/terms" className="hover:text-primary-400 transition-all">Términos</Link>
            </div>

            {/* Copyright Compacto */}
            <div className="flex flex-col items-center md:items-end gap-1">
              <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.1em]">
                © 2026 | Sistema Interno
              </p>
              <span className="text-[8px] font-bold text-gray-600 uppercase">
                Powered by TienditaNexar
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
