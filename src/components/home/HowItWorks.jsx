import React from 'react';
import { useShop } from '../../context/ShopContext';
import { STORE_CONFIG } from '../../utils/whatsapp';
import { MessageCircle, ArrowRight } from 'lucide-react';

export const HowItWorks = () => {
  const { whatsappNumber } = useShop();

  const phone = whatsappNumber || STORE_CONFIG.whatsappNumber;
  // TODO: confirmar con el dueño
  const whatsappUrl = `https://wa.me/57${phone}?text=${encodeURIComponent('Hola, me comunico desde el catálogo de Desde el Extranjero Hacia Ti para consultar sobre importaciones de EE.UU.')}`;

  const steps = [
    {
      num: '01',
      title: 'Explora y Elige',
      // TODO: confirmar con el dueño
      desc: 'Revisa las piezas disponibles en el catálogo en pesos colombianos (COP). Cada artículo incluye fotos, descripción y variantes.'
    },
    {
      num: '02',
      title: 'Escríbenos por WhatsApp',
      // TODO: confirmar con el dueño
      desc: 'Al pulsar "Pedir por WhatsApp", se abre un chat directo con el nombre de la pieza y la opción elegida ya listos para enviar.'
    },
    {
      num: '03',
      title: 'Coordinamos y Recibes',
      // TODO: confirmar con el dueño
      desc: 'Confirmamos disponibilidad, acordamos el medio de pago en Colombia y coordinamos el despacho directo a tu dirección.'
    }
  ];

  return (
    <section className="py-24 sm:py-28 lg:py-32 bg-[#FAF7F2] border-t border-[#E5DFD7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Lado Izquierdo: Titular y Explicación */}
          <div className="lg:col-span-5 space-y-5">
            <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block">
              Proceso Simple
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#0F1B2D] font-normal leading-tight">
              Cómo Pedir a Través de WhatsApp
            </h2>
            {/* TODO: confirmar con el dueño */}
            <p className="text-xs sm:text-sm font-sans text-[#161616]/70 leading-relaxed">
              Sin pasarelas complicadas ni formularios extensos. El contacto es directo y transparente desde el primer mensaje.
            </p>

            <div className="pt-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#0F1B2D] hover:bg-[#16263D] text-[#FAF7F2] border border-[#B08D57]/40 text-xs font-sans tracking-[0.18em] uppercase transition-all shadow-subtle"
              >
                <MessageCircle className="w-4 h-4 text-[#B08D57]" />
                <span>Hablar con un Asesor</span>
              </a>
            </div>
          </div>

          {/* Lado Derecho: 3 Pasos en Tarjetas de Azul Noche con Acentos Dorados */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            {steps.map((st, i) => (
              <div 
                key={i} 
                className="p-6 sm:p-8 bg-[#0F1B2D] text-[#FAF7F2] border border-[#B08D57]/20 flex items-start gap-6 shadow-subtle"
              >
                <span className="font-mono text-2xl sm:text-3xl font-light text-[#B08D57] shrink-0">
                  {st.num}
                </span>
                <div className="space-y-1.5">
                  <h3 className="font-serif text-xl sm:text-2xl text-[#FAF7F2] font-normal">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-sans text-[#FAF7F2]/75 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
