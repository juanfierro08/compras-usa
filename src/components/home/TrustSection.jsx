import React from 'react';
import { ShieldCheck, Plane, CheckCircle2, Lock } from 'lucide-react';

export const TrustSection = () => {
  const pillars = [
    {
      title: 'Origen Verificado',
      desc: 'Adquirido en tiendas autorizadas de Miami y Nueva York. Cada artículo se entrega con comprobante de compra original.'
    },
    {
      title: 'Aduanas Gestionadas',
      desc: 'El valor en pesos colombianos es el precio final. Todos los aranceles y trámites de importación DIAN están 100% cubiertos.'
    },
    {
      title: 'Ruta Aérea 5-8 Días',
      desc: 'Despachos semanales desde nuestro hub de Miami hacia Bogotá El Dorado y entrega a tu domicilio en cualquier municipio de Colombia.'
    },
    {
      title: 'Garantía 30 Días',
      desc: 'Acompañamiento personalizado y garantía directa ante cualquier inconsistencia o golpe durante el transporte.'
    }
  ];

  return (
    <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-8 border-t border-[#E5DFD7]">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-1">
          Garantía y Legalidad
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#161616] font-normal">
          Por Qué Confiar en Nosotros
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {pillars.map((p, i) => (
          <div key={i} className="p-8 border border-[#E5DFD7] bg-[#FAF7F2] space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-[#B08D57]">
              0{i + 1}
            </span>
            <h3 className="font-serif text-xl text-[#161616] font-normal">
              {p.title}
            </h3>
            <p className="text-xs font-serif text-[#161616]/65 leading-relaxed">
              {p.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
