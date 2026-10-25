import React from 'react';
import { useShop } from '../../context/ShopContext';
import { ArrowRight } from 'lucide-react';

export const HeroBanner = () => {
  const { navigateTo } = useShop();

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32 border-b border-[#E5DFD7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Lado Izquierdo: Titular Editorial y Llamado de un solo botón */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            <div className="inline-block">
              <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.26em] text-[#B08D57] uppercase block pb-1 border-b border-[#B08D57]/40">
                Miami & Nueva York ➔ Colombia
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#161616] font-normal tracking-tight leading-[1.08]">
              La exclusividad de lo auténtico, directo a tu puerta.
            </h1>

            <p className="text-sm sm:text-base font-serif text-[#161616]/70 max-w-lg leading-relaxed">
              Curaduría de tecnología, fragancias de nicho, moda y bienestar importados directamente desde tiendas oficiales de Estados Unidos. Atención personalizada y pedidos directos a través de WhatsApp.
            </p>

            {/* UN SOLO BOTÓN ELEGANTE (Sin dos botones ni textos genéricos) */}
            <div className="pt-2">
              <button
                onClick={() => navigateTo('catalog')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#161616] text-[#FAF7F2] text-xs font-sans tracking-[0.22em] uppercase hover:bg-[#282828] transition-luxury shadow-lifted group"
              >
                <span>Explorar Catálogo</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B08D57] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Sellos Editoriales de Confianza */}
            <div className="pt-8 border-t border-[#E5DFD7] grid grid-cols-3 gap-6 text-[11px] font-sans">
              <div>
                <span className="block font-serif text-base text-[#161616]">100% Original</span>
                <span className="text-[#161616]/60 text-[10px] tracking-wider uppercase">Con Factura USA</span>
              </div>
              <div>
                <span className="block font-serif text-base text-[#161616]">5 - 8 Días</span>
                <span className="text-[#161616]/60 text-[10px] tracking-wider uppercase">Vía Aérea a Colombia</span>
              </div>
              <div>
                <span className="block font-serif text-base text-[#B08D57]">Pesos COP</span>
                <span className="text-[#161616]/60 text-[10px] tracking-wider uppercase">Cero Sorpresas DIAN</span>
              </div>
            </div>

          </div>

          {/* Lado Derecho: Composición Editorial Asimétrica con Textura Neutra */}
          <div className="lg:col-span-5 relative">
            <div className="relative border border-[#E5DFD7] p-4 bg-[#FAF7F2] shadow-lifted">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#F3EFE8]">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80"
                  alt="Importaciones de moda y lifestyle desde Estados Unidos"
                  className="w-full h-full object-cover grayscale contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-[#FAF7F2]/10 mix-blend-multiply"></div>
              </div>

              {/* Pie de Foto Editorial */}
              <div className="mt-3 flex items-center justify-between text-[10px] font-sans tracking-[0.2em] text-[#161616]/60 uppercase">
                <span>Edición 2026</span>
                <span>Despachos Semanales</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
