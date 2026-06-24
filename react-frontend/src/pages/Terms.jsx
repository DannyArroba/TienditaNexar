import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, Scale, Info, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
  const sections = [
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Uso del Sistema",
      content: "Este software está diseñado exclusivamente para la gestión interna del Local Comercial Tres Hermanos. El acceso está restringido a personal autorizado."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Responsabilidad de Datos",
      content: "Cada usuario es responsable de la exactitud de los datos ingresados (ventas, stock, registros de personal). El sistema mantiene una auditoría completa de cada movimiento."
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: "Propiedad Intelectual",
      content: "TienditaNexar es el desarrollador y propietario de la plataforma. Queda prohibida la reproducción total o parcial del código sin consentimiento previo."
    },
    {
      icon: <Info className="h-6 w-6" />,
      title: "Actualizaciones",
      content: "El sistema puede recibir actualizaciones periódicas para mejorar la seguridad y funcionalidad. Se recomienda seguir las guías de uso proporcionadas."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-600 font-black text-xs uppercase tracking-widest mb-8 hover:gap-3 transition-all">
            <ArrowLeft className="h-4 w-4" />
            Volver al Inicio
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
            Términos y <span className="text-primary-600">Condiciones</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Lineamientos legales y de uso para el sistema de gestión interna.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-20 w-full">
        <div className="space-y-12">
          {sections.map((section, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="flex flex-col md:flex-row gap-8 items-start"
            >
              <div className="w-16 h-16 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center text-primary-600 flex-shrink-0">
                {section.icon}
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{section.title}</h3>
                <p className="text-gray-600 leading-relaxed font-medium text-lg">
                  {section.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-20 p-8 bg-primary-600 rounded-[2.5rem] text-white shadow-2xl shadow-primary-200">
          <p className="text-center font-bold text-sm uppercase tracking-widest">
            Última actualización: Mayo 2026 | Local Comercial Tres Hermanos
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto py-12 text-center border-t border-gray-100 bg-white">
        <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em]">
          © 2026 Cristhian & Nexar | Todos los derechos reservados
        </p>
      </div>
    </div>
  );
};

export default Terms;
