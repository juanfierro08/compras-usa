import React from 'react';
import { useShop } from '../../context/ShopContext';
import { ArrowRight } from 'lucide-react';

export const CategoryBento = () => {
  const { categories, navigateTo } = useShop();

  return (
    <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-8">
      
      {/* Encabezado Editorial */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 pb-6 border-b border-[#E5DFD7] gap-4">
        <div>
          <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-1">
            Departamentos de Importación
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#161616] font-normal">
            Colecciones Curadas
          </h2>
        </div>
        <p className="text-xs font-serif text-[#161616]/60 max-w-xs sm:text-right">
          Cada pieza cuenta con comprobante de compra original y trámite aduanero DIAN garantizado.
        </p>
      </div>

      {/* Grid Editorial Asimétrico */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
        {categories.map((cat, idx) => {
          // Asimetría con ritmo visual: primera y segunda tarjeta ocupan anchos variados
          const colSpan = idx === 0 ? 'md:col-span-7' : idx === 1 ? 'md:col-span-5' : 'md:col-span-4';

          return (
            <div
              key={cat.id}
              onClick={() => navigateTo('catalog', cat.id)}
              className={`${colSpan} group border border-[#E5DFD7] p-8 sm:p-10 bg-[#FAF7F2] hover:border-[#161616] cursor-pointer transition-luxury flex flex-col justify-between min-h-[280px] sm:min-h-[320px]`}
            >
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#B08D57] block mb-3">
                  0{idx + 1}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#161616] font-normal group-hover:text-[#8F6E38] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs font-serif text-[#161616]/65 mt-2 leading-relaxed max-w-sm">
                  {cat.tagline || cat.description}
                </p>
              </div>

              <div className="pt-6 border-t border-[#E5DFD7]/60 flex items-center justify-between text-[11px] font-sans tracking-[0.16em] uppercase text-[#161616] group-hover:text-[#B08D57] transition-colors">
                <span>Ver Colección</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
