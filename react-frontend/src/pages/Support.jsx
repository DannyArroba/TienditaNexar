import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MessageSquare, Globe, ArrowLeft, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Support = () => {
  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Teléfono",
      value: "+593 98 796 8974",
      desc: "Lunes a Viernes, 9am - 6pm",
      color: "bg-blue-500"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Correo Electrónico",
      value: "soporte3hermanos@gmail.com",
      desc: "Respuesta en menos de 24 horas",
      color: "bg-primary-600"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "WhatsApp Directo",
      value: "+593 98 796 8974",
      desc: "Soporte técnico inmediato",
      color: "bg-green-500"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Redes Sociales",
      value: "@3Hermanos",
      desc: "Síguenos para actualizaciones",
      color: "bg-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Decorativo */}
      <div className="bg-white border-b border-gray-100 py-12 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-600 font-black text-xs uppercase tracking-widest mb-6 hover:gap-3 transition-all">
            <ArrowLeft className="h-4 w-4" />
            Volver al Inicio
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
            Centro de <span className="text-primary-600">Soporte</span>
          </h1>
          <p className="text-gray-500 font-medium max-w-2xl text-lg">
            Estamos aquí para ayudarte a potenciar tu negocio. Si tienes dudas técnicas o necesitas asistencia personalizada, contáctanos.
          </p>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="max-w-7xl mx-auto px-4 py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactInfo.map((info, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 group"
            >
              <div className={`w-14 h-14 ${info.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                {info.icon}
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">{info.title}</h3>
              <p className="text-primary-700 font-bold text-sm mb-4">{info.value}</p>
              <p className="text-gray-400 text-xs font-medium leading-relaxed">
                {info.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Dedicated Support Section */}
        <div className="mt-20 bg-gray-900 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-primary-400 font-black text-xs uppercase tracking-[0.3em] mb-6">
                <Heart className="h-4 w-4 fill-current" />
                Compromiso Nexar
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
                ¿Buscas una solución <br />
                <span className="text-primary-400">a medida?</span>
              </h2>
              <p className="text-gray-400 font-medium text-lg mb-10 max-w-xl">
                Nuestro equipo de desarrollo está listo para implementar nuevas funcionalidades específicas para tu supermercado.
              </p>
              
            </div>
            <div className="flex-1 hidden md:block">
              <div className="grid grid-cols-2 gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="aspect-square bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-green-400 opacity-20"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-auto py-12 text-center">
        <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em]">
          Desarrollado con ❤️ por <span className="text-gray-900">Cristhian & Nexar</span>
        </p>
      </div>
    </div>
  );
};

export default Support;
