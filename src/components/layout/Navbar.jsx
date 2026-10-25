import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { STORE_CONFIG } from '../../utils/whatsapp';
import { Search, Heart, Menu, X, ArrowRight, MessageCircle } from 'lucide-react';

export const Navbar = () => {
  const { 
    categories, wishlist, navigateTo, 
    setIsSearchOpen, whatsappNumber, isAdmin 
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const generalWhatsAppUrl = `https://wa.me/57${whatsappNumber || STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent('Hola, me comunico desde el catálogo de Desde el Extranjero Hacia Ti para consultar sobre importaciones de EE.UU.')}`;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E5DFD7] transition-luxury">
      
      {/* Top Banner Editorial Minimalista */}
      <div className="border-b border-[#E5DFD7]/60 py-2 px-4 text-center">
        <p className="text-[11px] font-sans tracking-[0.2em] text-[#161616]/70 uppercase">
          Importaciones Oficiales de Estados Unidos a Colombia · Pedidos y Asesoría por WhatsApp
        </p>
      </div>

      {/* Barra Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
        
        {/* Lado Izquierdo: Menú Desktop */}
        <nav className="hidden lg:flex items-center gap-8">
          <button
            onClick={() => navigateTo('home')}
            className="text-xs font-sans tracking-[0.16em] uppercase text-[#161616] hover:text-[#B08D57] transition-luxury"
          >
            Inicio
          </button>

          {/* Dropdown de Colecciones */}
          <div 
            className="relative"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button
              onClick={() => navigateTo('catalog')}
              className="text-xs font-sans tracking-[0.16em] uppercase text-[#161616] hover:text-[#B08D57] transition-luxury py-2 flex items-center gap-1"
            >
              Colecciones
            </button>

            {categoriesOpen && (
              <div className="absolute top-full left-0 w-72 bg-[#FAF7F2] border border-[#E5DFD7] p-4 shadow-lifted animate-fadeIn">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#8F6E38] font-semibold mb-3 pb-1 border-b border-[#E5DFD7]">
                  Categorías Importadas
                </div>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        navigateTo('catalog', cat.id);
                        setCategoriesOpen(false);
                      }}
                      className="w-full text-left py-2 px-2 hover:bg-[#F3EFE8] text-xs font-serif text-[#161616] hover:text-[#B08D57] transition-luxury flex items-center justify-between group"
                    >
                      <span>{cat.name}</span>
                      <ArrowRight className="w-3 h-3 text-[#B08D57] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => navigateTo('info', 'como-funciona')}
            className="text-xs font-sans tracking-[0.16em] uppercase text-[#161616] hover:text-[#B08D57] transition-luxury"
          >
            Cómo Pedir
          </button>

          <button
            onClick={() => navigateTo('info', 'sobre-nosotros')}
            className="text-xs font-sans tracking-[0.16em] uppercase text-[#161616] hover:text-[#B08D57] transition-luxury"
          >
            Nosotros
          </button>
        </nav>

        {/* Centro / Logo: Marca Tipográfica en Serif Editorial */}
        <div 
          onClick={() => navigateTo('home')}
          className="cursor-pointer text-center group"
        >
          <span className="font-serif text-xl sm:text-2xl md:text-3xl tracking-tight text-[#161616] font-normal block leading-tight">
            Desde el Extranjero Hacia Ti
          </span>
          <span className="text-[9px] sm:text-[10px] font-sans tracking-[0.28em] text-[#B08D57] uppercase block mt-0.5">
            Miami & Nueva York ➔ Colombia
          </span>
        </div>

        {/* Lado Derecho: Acciones Sutiles */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Búsqueda */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-[#161616] hover:text-[#B08D57] transition-colors touch-target flex items-center justify-center"
            title="Buscar en el catálogo"
            aria-label="Buscar"
          >
            <Search className="w-4 h-4 stroke-[1.5]" />
          </button>

          {/* Favoritos */}
          <button
            onClick={() => navigateTo('account')}
            className="relative p-2 text-[#161616] hover:text-[#B08D57] transition-colors touch-target flex items-center justify-center"
            title="Mis Favoritos"
            aria-label="Favoritos"
          >
            <Heart className="w-4 h-4 stroke-[1.5]" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#161616] text-[#FAF7F2] text-[9px] font-mono flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Botón WhatsApp Sobrio (Negro con texto champagne o filo dorado) */}
          <a
            href={generalWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 border border-[#161616] hover:bg-[#161616] text-[#161616] hover:text-[#FAF7F2] text-[11px] font-sans tracking-[0.16em] uppercase transition-luxury"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Pedir por WhatsApp</span>
          </a>

          {/* Enlace Admin Discreto */}
          <button
            onClick={() => navigateTo('admin')}
            className="hidden md:inline-block text-[10px] font-sans tracking-[0.18em] uppercase text-[#161616]/60 hover:text-[#161616] transition-colors"
          >
            {isAdmin ? 'Panel' : 'Admin'}
          </button>

          {/* Botón Móvil */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#161616] touch-target flex items-center justify-center"
            aria-label="Menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Menú Móvil Editorial */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-b border-[#E5DFD7] px-6 py-8 space-y-6 animate-fadeIn">
          <div className="space-y-4">
            <button
              onClick={() => {
                navigateTo('home');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left font-serif text-xl text-[#161616]"
            >
              Inicio
            </button>
            <button
              onClick={() => {
                navigateTo('catalog');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left font-serif text-xl text-[#161616]"
            >
              Ver Todo el Catálogo
            </button>
            <div className="pt-2 pl-3 border-l border-[#E5DFD7] space-y-2.5">
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    navigateTo('catalog', c.id);
                    setMobileMenuOpen(false);
                  }}
                  className="block text-xs font-sans tracking-[0.14em] uppercase text-[#161616]/80 hover:text-[#B08D57]"
                >
                  {c.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                navigateTo('info', 'como-funciona');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left font-serif text-xl text-[#161616]"
            >
              Cómo Pedir por WhatsApp
            </button>
            <button
              onClick={() => {
                navigateTo('info', 'sobre-nosotros');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left font-serif text-xl text-[#161616]"
            >
              Sobre Nosotros
            </button>
            <button
              onClick={() => {
                navigateTo('account');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left font-serif text-xl text-[#161616]"
            >
              Mis Favoritos ({wishlist.length})
            </button>
            <button
              onClick={() => {
                navigateTo('admin');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-xs font-sans tracking-[0.16em] uppercase text-[#B08D57] pt-2"
            >
              {isAdmin ? 'Acceder al Panel Admin' : 'Acceso Administrador'}
            </button>
          </div>

          <div className="pt-4 border-t border-[#E5DFD7]">
            <a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3.5 bg-[#161616] text-[#FAF7F2] text-center text-xs font-sans tracking-[0.18em] uppercase"
            >
              Escribir a WhatsApp Oficial
            </a>
          </div>
        </div>
      )}

    </header>
  );
};
