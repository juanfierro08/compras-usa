import React from 'react';
import { useShop } from '../../context/ShopContext';
import { STORE_CONFIG } from '../../utils/whatsapp';
import { Home, Compass, Heart, MessageCircle } from 'lucide-react';

export const MobileNav = () => {
  const { currentView, navigateTo, wishlist, whatsappNumber } = useShop();

  const phone = whatsappNumber || STORE_CONFIG.whatsappNumber;
  const whatsappUrl = `https://wa.me/57${phone}?text=${encodeURIComponent('Hola, me comunico desde el catálogo de Desde el Extranjero Hacia Ti para consultar sobre importaciones de EE.UU.')}`;

  return (
    <nav aria-label="Navegación móvil" className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E5DFD7] px-2 py-2">
      <div className="flex items-center justify-around">
        <button
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center justify-center p-1.5 touch-target text-[10px] uppercase tracking-[0.12em] transition-colors ${
            currentView === 'home' ? 'text-[#161616] font-bold' : 'text-[#161616]/50'
          }`}
        >
          <Home className="w-4 h-4 stroke-[1.5] mb-1" />
          <span>Inicio</span>
        </button>

        <button
          onClick={() => navigateTo('catalog')}
          className={`flex flex-col items-center justify-center p-1.5 touch-target text-[10px] uppercase tracking-[0.12em] transition-colors ${
            currentView === 'catalog' ? 'text-[#161616] font-bold' : 'text-[#161616]/50'
          }`}
        >
          <Compass className="w-4 h-4 stroke-[1.5] mb-1" />
          <span>Catálogo</span>
        </button>

        <button
          onClick={() => navigateTo('account')}
          className={`relative flex flex-col items-center justify-center p-1.5 touch-target text-[10px] uppercase tracking-[0.12em] transition-colors ${
            currentView === 'account' ? 'text-[#161616] font-bold' : 'text-[#161616]/50'
          }`}
        >
          <Heart className="w-4 h-4 stroke-[1.5] mb-1" />
          {wishlist.length > 0 && (
            <span className="absolute top-1 right-3 w-3.5 h-3.5 rounded-full bg-[#161616] text-[#FAF7F2] text-[8px] font-mono flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
          <span>Favoritos</span>
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-1.5 touch-target text-[10px] uppercase tracking-[0.12em] text-[#B08D57] font-semibold"
        >
          <MessageCircle className="w-4 h-4 stroke-[1.5] mb-1" />
          <span>WhatsApp</span>
        </a>
      </div>
    </nav>
  );
};
