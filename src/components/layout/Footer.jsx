import React from 'react';
import { useShop } from '../../context/ShopContext';
import { STORE_CONFIG } from '../../utils/whatsapp';
import { MessageCircle } from 'lucide-react';

export const Footer = () => {
  const { categories, navigateTo, whatsappNumber } = useShop();

  const phone = whatsappNumber || STORE_CONFIG.whatsappNumber;
  // TODO: confirmar con el dueño
  const whatsappUrl = `https://wa.me/57${phone}?text=${encodeURIComponent('Hola, me comunico desde el catálogo de Desde el Extranjero Hacia Ti para consultar sobre importaciones de EE.UU.')}`;

  return (
    <footer className="w-full bg-[#0F1B2D] text-[#FAF7F2] border-t border-[#B08D57]/30 pt-16 sm:pt-20 pb-12 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Cabecera Editorial del Footer */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-12 pb-14 border-b border-[#FAF7F2]/10">
          
          <div className="md:col-span-5 space-y-4">
            <span className="font-serif text-2xl sm:text-3xl tracking-tight text-[#FAF7F2] block">
              Desde el Extranjero Hacia Ti
            </span>
            {/* TODO: confirmar con el dueño */}
            <p className="text-xs font-sans text-[#FAF7F2]/75 leading-relaxed max-w-sm">
              Catálogo de productos originales importados desde Estados Unidos a Colombia. Pedidos y asesoría personalizada directa por WhatsApp.
            </p>
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-[#B08D57] text-[#FAF7F2] hover:bg-[#B08D57] hover:text-[#0F1B2D] text-[11px] font-sans tracking-[0.18em] uppercase transition-all"
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
            <ul className="space-y-2 text-xs font-serif text-[#FAF7F2]/80">
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => navigateTo('catalog', c.id)}
                    className="hover:text-[#B08D57] transition-colors text-left"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-3">
              Información
            </span>
            <ul className="space-y-2 text-xs font-sans tracking-[0.05em] text-[#FAF7F2]/80">
              <li>
                <button
                  onClick={() => navigateTo('info', 'como-funciona')}
                  className="hover:text-[#B08D57] transition-colors"
                >
                  Cómo Funciona el Catálogo
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('info', 'sobre-nosotros')}
                  className="hover:text-[#B08D57] transition-colors"
                >
                  Sobre Nosotros
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('info', 'envios')}
                  className="hover:text-[#B08D57] transition-colors"
                >
                  Envíos y Tiempos de Entrega
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('info', 'devoluciones')}
                  className="hover:text-[#B08D57] transition-colors"
                >
                  Garantías y Devoluciones
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('info', 'contacto')}
                  className="hover:text-[#B08D57] transition-colors"
                >
                  Contacto Directo
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Línea Inferior de Derechos y Advertencia Legal de Salud */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-sans text-[#FAF7F2]/60">
          <div>
            © 2026 Desde el Extranjero Hacia Ti. Precios en Pesos Colombianos (COP).
          </div>
          <div className="text-center sm:text-right max-w-md">
            Aviso de salud: Los suplementos y vitaminas importados no sustituyen la consulta médica profesional.
          </div>
        </div>

      </div>
    </footer>
  );
};
