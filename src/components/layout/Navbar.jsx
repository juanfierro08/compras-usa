import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { STORE_CONFIG } from '../../utils/whatsapp';
import { Search, Heart, Menu, X, MessageCircle, Lock } from 'lucide-react';

export const Navbar = () => {
  const { 
    wishlist, navigateTo, 
    setIsSearchOpen, whatsappNumber 
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const phone = whatsappNumber || STORE_CONFIG.whatsappNumber;
  // TODO: confirmar con el dueño el mensaje predeterminado de consulta general
  const generalWhatsAppUrl = `https://wa.me/57${phone}?text=${encodeURIComponent('Hola, me comunico desde el catálogo de Desde el Extranjero Hacia Ti para consultar sobre importaciones de EE.UU.')}`;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E5DFD7] transition-all">
      
      {/* Línea superior discreta */}
      <div className="border-b border-[#E5DFD7]/50 py-1.5 px-4 text-center">
        {/* TODO: confirmar con el dueño */}
        <p className="text-[10px] font-sans tracking-[0.22em] text-[#161616]/65 uppercase">
          Productos importados desde Estados Unidos · Pedidos y asesoría por WhatsApp
        </p>
      </div>

      {/* Barra Principal: Logo + Enlaces + Búsqueda + Favoritos + WhatsApp + Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between">
        
        {/* Logo: Tipografía Serif Editorial */}
        <div 
          onClick={() => navigateTo('home')}
          className="cursor-pointer group flex flex-col"
        >
          <span className="font-serif text-xl sm:text-2xl md:text-[26px] tracking-tight text-[#0F1B2D] font-normal leading-tight">
            Desde el Extranjero Hacia Ti
          </span>
          <span className="text-[9px] font-sans tracking-[0.28em] text-[#B08D57] uppercase mt-0.5">
            Importaciones USA ➔ Colombia
          </span>
        </div>

        {/* 4 Enlaces Principales (Desktop) */}
        <nav className="hidden lg:flex items-center gap-8">
          <button
            onClick={() => navigateTo('home')}
            className="text-xs font-sans tracking-[0.16em] uppercase text-[#161616] hover:text-[#B08D57] transition-colors"
          >
            Inicio
          </button>

          <button
            onClick={() => navigateTo('catalog')}
            className="text-xs font-sans tracking-[0.16em] uppercase text-[#161616] hover:text-[#B08D57] transition-colors"
          >
            Colecciones
          </button>

          <button
            onClick={() => navigateTo('info', 'como-funciona')}
            className="text-xs font-sans tracking-[0.16em] uppercase text-[#161616] hover:text-[#B08D57] transition-colors"
          >
            Cómo Pedir
          </button>

          <button
            onClick={() => navigateTo('info', 'sobre-nosotros')}
            className="text-xs font-sans tracking-[0.16em] uppercase text-[#161616] hover:text-[#B08D57] transition-colors"
          >
            Nosotros
          </button>
        </nav>

        {/* Acciones: Búsqueda + Favoritos + WhatsApp + Panel */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Búsqueda */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-[#0F1B2D] hover:text-[#B08D57] transition-colors touch-target flex items-center justify-center"
            title="Buscar en el catálogo"
            aria-label="Buscar"
          >
            <Search className="w-4 h-4 stroke-[1.5]" />
          </button>

          {/* Favoritos */}
          <button
            onClick={() => navigateTo('account')}
            className="relative p-2 text-[#0F1B2D] hover:text-[#B08D57] transition-colors touch-target flex items-center justify-center"
            title="Mis Favoritos"
            aria-label="Favoritos"
          >
            <Heart className="w-4 h-4 stroke-[1.5]" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#0F1B2D] text-[#FAF7F2] text-[9px] font-mono flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Botón WhatsApp en Azul Noche */}
          <a
            href={generalWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 bg-[#0F1B2D] hover:bg-[#16263D] text-[#FAF7F2] border border-[#B08D57]/40 text-[11px] font-sans tracking-[0.16em] uppercase transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#B08D57]" />
            <span>Pedir por WhatsApp</span>
          </a>

          {/* Enlace discreto a Panel de Administración */}
          <button
            onClick={() => navigateTo('admin')}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#E5DFD7] hover:border-[#0F1B2D] bg-[#FAF7F2] text-[11px] font-sans tracking-[0.14em] uppercase text-[#0F1B2D]/80 hover:text-[#0F1B2D] transition-colors"
            title="Acceso al Panel de Administración"
          >
            <Lock className="w-3 h-3 text-[#B08D57]" />
            <span>Panel</span>
          </button>

          {/* Botón Menú Móvil */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#0F1B2D] touch-target flex items-center justify-center"
            aria-label="Menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Menú Móvil con los Enlaces, WhatsApp y Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-b border-[#E5DFD7] px-6 py-6 space-y-4 animate-fadeIn">
          <button
            onClick={() => {
              navigateTo('home');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left font-serif text-lg text-[#0F1B2D]"
          >
            Inicio
          </button>

          <button
            onClick={() => {
              navigateTo('catalog');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left font-serif text-lg text-[#0F1B2D]"
          >
            Colecciones
          </button>

          <button
            onClick={() => {
              navigateTo('info', 'como-funciona');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left font-serif text-lg text-[#0F1B2D]"
          >
            Cómo Pedir
          </button>

          <button
            onClick={() => {
              navigateTo('info', 'sobre-nosotros');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left font-serif text-lg text-[#0F1B2D]"
          >
            Nosotros
          </button>

          <button
            onClick={() => {
              navigateTo('account');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left font-serif text-lg text-[#0F1B2D]"
          >
            Mis Favoritos ({wishlist.length})
          </button>

          {/* Acceso a Panel en Móvil */}
          <button
            onClick={() => {
              navigateTo('admin');
              setMobileMenuOpen(false);
            }}
            className="flex items-center justify-between w-full text-left font-serif text-base text-[#0F1B2D] pt-2 border-t border-[#E5DFD7]/70"
          >
            <span>Panel de Administración</span>
            <Lock className="w-4 h-4 text-[#B08D57]" />
          </button>

          <div className="pt-2 border-t border-[#E5DFD7]">
            <a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-[#0F1B2D] text-[#FAF7F2] text-center text-xs font-sans tracking-[0.18em] uppercase border border-[#B08D57]/30"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      )}

    </header>
  );
};
