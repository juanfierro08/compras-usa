import React from 'react';
import { useShop } from '../../context/ShopContext';
import { STORE_CONFIG } from '../../utils/whatsapp';
import { MessageCircle } from 'lucide-react';

export const Footer = () => {
  const { categories, navigateTo, whatsappNumber } = useShop();

  const phone = whatsappNumber || STORE_CONFIG.whatsappNumber;
  const whatsappUrl = `https://wa.me/57${phone}?text=${encodeURIComponent('Hola, me comunico desde el catálogo de Desde el Extranjero Hacia Ti para consultar sobre importaciones de EE.UU.')}`;

  return (
    <footer className="w-full bg-[#161616] text-[#FAF7F2] border-t border-[#262626] pt-16 sm:pt-20 pb-12 transition-luxury">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Cabecera Editorial del Footer */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-12 pb-14 border-b border-[#262626]">
          
          <div className="md:col-span-5 space-y-4">
            <span className="font-serif text-2xl sm:text-3xl tracking-tight text-[#FAF7F2] block">
              Desde el Extranjero Hacia Ti
            </span>
            <p className="text-xs font-sans text-[#FAF7F2]/60 leading-relaxed max-w-sm">
              Catálogo de piezas originales importadas desde Estados Unidos para el público en Colombia. Gestión personalizada sin pasarelas ni intermediarios: compras directo a través de nuestra línea de WhatsApp.
            </p>
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#B08D57] text-[#FAF7F2] hover:bg-[#B08D57] hover:text-[#161616] text-[11px] font-sans tracking-[0.18em] uppercase transition-luxury"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#B08D57]" />
                <span>+57 {phone}</span>
              </a>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-3">
              Colecciones
            </span>
            <ul className="space-y-2 text-xs font-serif text-[#FAF7F2]/75">
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => navigateTo('catalog', c.id)}
                    className="hover:text-[#FAF7F2] transition-colors text-left"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-3">
              Información & Confianza
            </span>
            <ul className="space-y-2 text-xs font-sans tracking-[0.05em] text-[#FAF7F2]/70">
              <li>
                <button
                  onClick={() => navigateTo('info', 'como-funciona')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Cómo Funciona la Importación
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('info', 'sobre-nosotros')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Sobre Nosotros & Origen Miami
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('info', 'envios')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Tiempos de Vuelo y Entrega en Colombia
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('info', 'garantias')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Garantía y Autenticidad
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('info', 'contacto')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Contacto Directo
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Línea Inferior de Derechos y Advertencia Legal de Salud */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-sans text-[#FAF7F2]/50">
          <div>
            © 2026 Desde el Extranjero Hacia Ti. Precios en Pesos Colombianos (COP).
          </div>
          <div className="text-center sm:text-right max-w-md">
            Aviso legal: Los productos de salud y suplementos importados no sustituyen la consulta médica profesional.
          </div>
        </div>

      </div>
    </footer>
  );
};
