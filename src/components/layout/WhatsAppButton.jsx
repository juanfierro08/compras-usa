import React from 'react';
import { useShop } from '../../context/ShopContext';
import { STORE_CONFIG, getWhatsAppProductLink } from '../../utils/whatsapp';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton = () => {
  const { selectedProduct, currentView, whatsappNumber } = useShop();

  const phone = whatsappNumber || STORE_CONFIG.whatsappNumber;

  // TODO: confirmar con el dueño el mensaje predeterminado
  let whatsappUrl = `https://wa.me/57${phone}?text=${encodeURIComponent('Hola, me comunico desde el catálogo de Desde el Extranjero Hacia Ti para consultar sobre importaciones de EE.UU.')}`;

  if (currentView === 'product-detail' && selectedProduct) {
    whatsappUrl = getWhatsAppProductLink(selectedProduct);
  }

  return (
    <aside aria-label="Contacto por WhatsApp" className="fixed bottom-6 right-6 z-30">
      {/* Botón flotante pequeño y circular en Azul Noche con acento dorado */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-[#0F1B2D] hover:bg-[#16263D] text-[#FAF7F2] border border-[#B08D57] shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105"
        title="Escríbenos por WhatsApp"
      >
        <MessageCircle className="w-5 h-5 text-[#B08D57]" />
      </a>
    </aside>
  );
};
