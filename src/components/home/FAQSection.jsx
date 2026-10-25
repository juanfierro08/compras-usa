import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: '¿Cómo garantizan que las piezas son 100% originales?',
      a: 'Compramos directamente en tiendas oficiales e insignias de Estados Unidos (Apple, Sephora, Macy\'s, Foot Locker, Nike). Cada paquete incluye copia del comprobante de origen norteamericano.'
    },
    {
      q: '¿Cuánto tiempo tarda en llegar mi pedido a Colombia?',
      a: 'El tiempo promedio de entrega es de 5 a 8 días hábiles para ciudades principales (Bogotá, Medellín, Cali, Barranquilla, Bucaramanga) y 6 a 10 días para el resto de municipios. Tu paquete viaja en vuelo de carga internacional Miami ➔ Bogotá El Dorado.'
    },
    {
      q: '¿Debo pagar aranceles o impuestos adicionales al recibir?',
      a: 'No. El precio cotizado en pesos colombianos (COP) es el valor final. La importación legal ante la DIAN, fletes aéreos y aranceles ya están completamente gestionados por nosotros.'
    },
    {
      q: '¿Cómo coordino el pago si no hay carrito en la web?',
      a: 'La web funciona como un catálogo editorial exclusivo. Al pulsar "Pedir por WhatsApp", se abre una conversación directa con un asesor. Acordamos el medio de pago que prefieras (Transferencia Bancolombia, Nequi, Daviplata o PSE) y coordinamos el despacho.'
    },
    {
      q: 'Aviso sobre productos de salud y bienestar',
      a: 'Todos los suplementos y vitaminas importados cuentan con sello de calidad y registro en Estados Unidos. Sin embargo, no sustituyen la consulta médica profesional. Consulte a su médico antes de iniciar cualquier suplementación.'
    }
  ];

  return (
    <section className="py-20 sm:py-28 max-w-4xl mx-auto px-4 sm:px-8 border-t border-[#E5DFD7]">
      <div className="text-center mb-14">
        <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-1">
          Preguntas Habituales
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#161616] font-normal">
          Dudas Frecuentes
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={i} className="border border-[#E5DFD7] bg-[#FAF7F2]">
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 font-serif text-lg text-[#161616] hover:text-[#8F6E38] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#B08D57] transition-transform duration-300 shrink-0 ${
                  isOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-1 text-xs sm:text-sm font-serif text-[#161616]/70 leading-relaxed border-t border-[#E5DFD7]/60 animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
