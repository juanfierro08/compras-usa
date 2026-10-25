import React from 'react';
import { useShop } from '../../context/ShopContext';
import { ArrowRight, MessageCircle } from 'lucide-react';

export const HeroBanner = () => {
  const { navigateTo, storeConfig } = useShop();

  const heroImage = storeConfig?.heroImage;
  // TODO: confirmar con el dueño
  const heroTagline = storeConfig?.heroTagline || 'Importaciones de Estados Unidos ➔ Colombia';
  const heroTitle = storeConfig?.heroTitle || 'Productos originales traídos directamente a tu puerta.';
  const heroSubtitle = storeConfig?.heroSubtitle || 'Tecnología, fragancias, moda y bienestar importados desde EE.UU. Atención personalizada y pedidos directos por WhatsApp.';

  return (
    <section className="relative overflow-hidden bg-[#0F1B2D] text-[#FAF7F2] py-20 sm:py-28 lg:py-36 border-b border-[#B08D57]/30">
      
      {/* Imagen de fondo opcional (si el administrador la sube desde /admin) */}
      {heroImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Desde el Extranjero Hacia Ti"
            className="w-full h-full object-cover object-center opacity-30 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F1B2D] via-[#0F1B2D]/90 to-[#0F1B2D]/70" />
        </div>
      )}

      {/* Textura sutil y elegante de fondo cuando no hay foto */}
      {!heroImage && (
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#B08D57_1px,transparent_1px)] [background-size:24px_24px]" />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="max-w-3xl space-y-6 sm:space-y-8">
          
          <div className="inline-block">
            <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.26em] text-[#B08D57] uppercase block pb-1 border-b border-[#B08D57]/40">
              {heroTagline}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#FAF7F2] font-normal tracking-tight leading-[1.1]">
            {heroTitle}
          </h1>

          <p className="text-sm sm:text-base font-sans text-[#FAF7F2]/80 max-w-xl leading-relaxed">
            {heroSubtitle}
          </p>

          {/* UN SOLO BOTÓN ELEGANTE */}
          <div className="pt-2">
            <button
              onClick={() => navigateTo('catalog')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#B08D57] hover:bg-[#8E6E38] text-[#0F1B2D] font-semibold text-xs font-sans tracking-[0.22em] uppercase transition-all duration-300 shadow-lifted group"
            >
              <span>Explorar Catálogo</span>
              <ArrowRight className="w-4 h-4 text-[#0F1B2D] group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>

          {/* Sellos Editoriales de Confianza Honestos */}
          <div className="pt-8 border-t border-[#FAF7F2]/15 grid grid-cols-3 gap-6 text-[11px] font-sans">
            <div>
              {/* TODO: confirmar con el dueño */}
              <span className="block font-serif text-base sm:text-lg text-[#FAF7F2]">100% Original</span>
              <span className="text-[#FAF7F2]/60 text-[10px] tracking-wider uppercase">Importado de EE.UU.</span>
            </div>
            <div>
              {/* TODO: confirmar con el dueño */}
              <span className="block font-serif text-base sm:text-lg text-[#FAF7F2]">Atención Directa</span>
              <span className="text-[#FAF7F2]/60 text-[10px] tracking-wider uppercase">Vía WhatsApp</span>
            </div>
            <div>
              {/* TODO: confirmar con el dueño */}
              <span className="block font-serif text-base sm:text-lg text-[#B08D57]">Pesos COP</span>
              <span className="text-[#FAF7F2]/60 text-[10px] tracking-wider uppercase">Sin Cambios de Moneda</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
