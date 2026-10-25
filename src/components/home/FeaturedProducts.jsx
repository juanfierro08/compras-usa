import React from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../catalog/ProductCard';
import { ArrowRight } from 'lucide-react';

export const FeaturedProducts = () => {
  const { products, navigateTo } = useShop();

  // Solo se muestra en el inicio si hay productos reales en Firestore
  if (!products || products.length === 0) {
    return null;
  }

  const featured = products.filter(p => p.destacado).slice(0, 8);
  const displayProducts = featured.length > 0 ? featured : products.slice(0, 8);

  return (
    <section className="py-24 sm:py-28 lg:py-32 bg-[#0F1B2D] text-[#FAF7F2] border-t border-[#B08D57]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Encabezado Editorial sobre Fondo Azul Noche */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 pb-6 border-b border-[#FAF7F2]/15 gap-4">
          <div>
            <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-1">
              Catálogo Disponible
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-normal">
              Piezas Destacadas
            </h2>
          </div>

          <button
            onClick={() => navigateTo('catalog')}
            className="text-xs font-sans tracking-[0.18em] uppercase text-[#B08D57] hover:text-[#FAF7F2] flex items-center gap-2 transition-colors self-start sm:self-auto"
          >
            <span>Ver Todo el Catálogo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Cuadrícula de 2 en móvil, 3 en tablet, 4 en desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {displayProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
