import React from 'react';
import { useShop } from '../../context/ShopContext';
import { STORE_CONFIG, getWhatsAppProductLink } from '../../utils/whatsapp';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton = () => {
  const { selectedProduct, currentView, whatsappNumber } = useShop();

  const phone = whatsappNumber || STORE_CONFIG.whatsappNumber;

  let whatsappUrl = `https://wa.me/57${phone}?text=${encodeURIComponent('Hola, me comunico desde el catálogo de Desde el Extranjero Hacia Ti para consultar sobre importaciones de EE.UU.')}`;

  if (currentView === 'product-detail' && selectedProduct) {
    whatsappUrl = getWhatsAppProductLink(selectedProduct);
  }

  return (
    <aside aria-label="Asistencia de compras" className="fixed bottom-6 right-6 z-30">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 px-4 py-3 bg-[#161616] hover:bg-[#222222] text-[#FAF7F2] border border-[#B08D57]/60 shadow-lifted transition-luxury"
        title="Consultar por WhatsApp"
      >
        <MessageCircle className="w-4 h-4 text-[#B08D57]" />
        <span className="hidden sm:inline text-[11px] font-sans tracking-[0.16em] uppercase font-medium">
          Asesoría WhatsApp
        </span>
      </a>
    </aside>
  );
};
