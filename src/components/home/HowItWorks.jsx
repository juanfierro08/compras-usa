import React from 'react';
import { useShop } from '../../context/ShopContext';
import { STORE_CONFIG } from '../../utils/whatsapp';
import { ArrowRight, MessageCircle } from 'lucide-react';

export const HowItWorks = () => {
  const { whatsappNumber } = useShop();

  const phone = whatsappNumber || STORE_CONFIG.whatsappNumber;
  const whatsappUrl = `https://wa.me/57${phone}?text=${encodeURIComponent('Hola, me comunico desde el catálogo de Desde el Extranjero Hacia Ti para consultar sobre importaciones de EE.UU.')}`;

  const steps = [
    {
      num: '01',
      title: 'Explora y Elige',
      desc: 'Revisa las colecciones de Estados Unidos en pesos colombianos (COP). Cada pieza cuenta con fotos detalladas y especificaciones de procedencia.'
    },
    {
      num: '02',
      title: 'Escríbenos por WhatsApp',
      desc: 'Pulsa el botón "Pedir por WhatsApp". Se abrirá un chat directo con el nombre del producto, talla o variante ya prellenados.'
    },
    {
      num: '03',
      title: 'Coordinamos y Recibes',
      desc: 'Confirmamos disponibilidad física en bodega Miami, coordinamos el medio de pago colombiano y te enviamos tu guía de rastreo aéreo (5 a 8 días hábiles).'
    }
  ];

  return (
    <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-8 border-t border-[#E5DFD7]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Lado Izquierdo: Titular */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block">
            Metodología de Compra
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#161616] font-normal leading-tight">
            Cómo Pedir a Través de WhatsApp
          </h2>
          <p className="text-xs sm:text-sm font-serif text-[#161616]/65 leading-relaxed">
            Sin registros engorrosos ni pasarelas de pago impersonales. La experiencia de compra es directa, cercana y con acompañamiento de un asesor en cada etapa.
          </p>

          <div className="pt-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#161616] text-xs font-sans tracking-[0.18em] uppercase hover:bg-[#161616] hover:text-[#FAF7F2] transition-luxury"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#B08D57]" />
              <span>Chatear con un Asesor</span>
            </a>
          </div>
        </div>

        {/* Lado Derecho: 3 Pasos con Líneas Finas */}
        <div className="lg:col-span-7 space-y-6">
          {steps.map((st, i) => (
            <div key={i} className="p-6 sm:p-8 border border-[#E5DFD7] bg-[#FAF7F2] flex items-start gap-6">
              <span className="font-mono text-2xl font-light text-[#B08D57] shrink-0">
                {st.num}
              </span>
              <div className="space-y-1">
                <h3 className="font-serif text-xl text-[#161616] font-normal">
                  {st.title}
                </h3>
                <p className="text-xs font-serif text-[#161616]/65 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
