import React from 'react';
import { useShop } from '../../context/ShopContext';
import { ArrowRight } from 'lucide-react';

export const CategoryBento = () => {
  const { categories, navigateTo } = useShop();

  return (
    <section className="py-24 sm:py-28 lg:py-32 max-w-7xl mx-auto px-4 sm:px-8 bg-[#FAF7F2]">
      
      {/* Encabezado Editorial con buen espacio */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 pb-6 border-b border-[#E5DFD7] gap-4">
        <div>
          <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-1">
            Catálogo Editorial
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0F1B2D] font-normal">
            Colecciones Curadas
          </h2>
        </div>
        {/* TODO: confirmar con el dueño */}
        <p className="text-xs font-serif text-[#161616]/65 max-w-xs sm:text-right">
          Piezas importadas desde Estados Unidos con asesoría directa por WhatsApp.
        </p>
      </div>

      {/* Grid Editorial Asimétrico con Fotos a Sangre Completa o Bloques de Color */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
        {categories.map((cat, idx) => {
          // Asimetría editorial: las dos primeras ocupan 7 y 5 columnas, las siguientes 4 columnas cada una
          const colSpan = idx === 0 ? 'md:col-span-7' : idx === 1 ? 'md:col-span-5' : 'md:col-span-4';
          const hasImage = Boolean(cat.image);
          const bgGradient = cat.gradient || 'linear-gradient(135deg, #0F1B2D 0%, #070D17 100%)';

          return (
            <div
              key={cat.id}
              onClick={() => navigateTo('catalog', cat.id)}
              className={`${colSpan} group relative overflow-hidden border border-[#E5DFD7] cursor-pointer min-h-[320px] sm:min-h-[380px] flex flex-col justify-end p-8 sm:p-10 transition-all duration-500 hover:border-[#0F1B2D] shadow-subtle hover:shadow-lifted`}
            >
              {/* CASO A: FOTO DE PORTADA A SANGRE COMPLETA (SI FUE SUBIDA EN /admin) */}
              {hasImage ? (
                <>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Overlay oscuro sutil para legibilidad editorial */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10 transition-opacity group-hover:opacity-90" />
                </>
              ) : (
                /* CASO B: BLOQUE DE COLOR ELEGANTE Y DISTINTO POR CATEGORÍA CON TEXTURA SUTIL */
                <div 
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-102"
                  style={{ background: bgGradient }}
                >
                  {/* Textura geométrica sutil (sin fotos engañosas) */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FAF7F2_1px,transparent_1px)] [background-size:20px_20px]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              )}

              {/* Contenido Editorial de la Tarjeta */}
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-[#B08D57] block">
                  0{idx + 1}
                </span>

                <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF7F2] font-normal leading-tight group-hover:text-[#D4AF37] transition-colors">
                  {cat.name}
                </h3>

                <p className="text-xs font-sans text-[#FAF7F2]/80 line-clamp-2 max-w-sm leading-relaxed">
                  {cat.tagline || cat.description}
                </p>

                <div className="pt-3 flex items-center gap-2 text-[11px] font-sans tracking-[0.18em] uppercase text-[#B08D57] group-hover:text-[#FAF7F2] transition-colors">
                  <span>Ver Colección</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
