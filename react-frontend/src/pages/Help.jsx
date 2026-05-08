import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, BookOpen, Search, Zap, Shield, ShoppingCart, Package, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Help = () => {
  const sections = [
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      title: "Ventas y POS",
      desc: "Aprende a realizar ventas rápidas, aplicar descuentos y generar tickets en PDF.",
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Gestión de Inventario",
      desc: "Cómo agregar productos, controlar el stock y organizar por categorías.",
      color: "text-primary-600",
      bg: "bg-primary-50"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Seguridad y Roles",
      desc: "Administración de usuarios, permisos de administrador y protección de datos.",
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Configuración Rápida",
      desc: "Personaliza tu sistema y optimiza el rendimiento de tu supermercado.",
      color: "text-orange-500",
      bg: "bg-orange-50"
    }
  ];

  const faqs = [
    {
      q: "¿Cómo genero una nota de venta?",
      a: "Al finalizar una compra en el módulo de ventas, haz clic en 'Confirmar'. El sistema generará automáticamente un PDF profesional."
    },
    {
      q: "¿Cómo recupero mi contraseña?",
      a: "Contacta con el administrador del sistema para restablecer tus credenciales de acceso desde el panel de Personal."
    },
    {
      q: "¿El sistema funciona sin internet?",
      a: "TienditaNexar está optimizado para funcionar en tu red local (XAMPP), asegurando disponibilidad total sin depender de conexión externa."
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Search Header */}
      <div className="bg-gray-950 py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary-600 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-600 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-400 font-black text-xs uppercase tracking-widest mb-8 hover:text-white transition-all">
            <ArrowLeft className="h-4 w-4" />
            Volver al Inicio
          </Link>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
            ¿Cómo podemos <br />
            <span className="bg-gradient-to-r from-primary-400 to-green-400 bg-clip-text text-transparent">ayudarte hoy?</span>
          </h1>
          
          <div className="relative mt-10">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
            <input 
              type="text" 
              placeholder="Busca guías, tutoriales o preguntas frecuentes..."
              className="w-full bg-white/10 border border-white/20 rounded-3xl py-6 pl-16 pr-8 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 backdrop-blur-xl transition-all font-medium"
            />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 py-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((section, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="p-8 rounded-[2.5rem] border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-2xl hover:border-transparent transition-all duration-500 group cursor-pointer"
            >
              <div className={`w-12 h-12 ${section.bg} ${section.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {section.icon}
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight">{section.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                {section.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-32 max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 bg-primary-100 text-primary-600 rounded-2xl">
              <HelpCircle className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Preguntas Frecuentes</h2>
              <p className="text-gray-500 font-medium">Respuestas rápidas a las dudas más comunes.</p>
            </div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm"
              >
                <h4 className="text-lg font-black text-gray-900 mb-2 tracking-tight">{faq.q}</h4>
                <p className="text-gray-600 text-sm leading-relaxed font-medium">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Support CTA */}
      <div className="bg-primary-50 py-16 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-primary-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-primary-200">
              <BookOpen className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">¿No encuentras lo que buscas?</h3>
              <p className="text-gray-600 font-medium">Nuestro equipo de soporte está disponible para guiarte.</p>
            </div>
          </div>
          <Link 
            to="/support"
            className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl active:scale-95"
          >
            Contactar Soporte
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Help;
