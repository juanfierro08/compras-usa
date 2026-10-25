import React from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../catalog/ProductCard';
import { STORE_CONFIG } from '../../utils/whatsapp';
import { ArrowRight, MessageCircle } from 'lucide-react';

export const FeaturedProducts = () => {
  const { products, navigateTo, whatsappNumber } = useShop();

  const phone = whatsappNumber || STORE_CONFIG.whatsappNumber;
  const whatsappUrl = `https://wa.me/57${phone}?text=${encodeURIComponent('Hola, me comunico desde el catálogo de Desde el Extranjero Hacia Ti para consultar sobre importaciones de EE.UU.')}`;

  return (
    <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-8 border-t border-[#E5DFD7]">
      
      {/* Encabezado Editorial */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-6 border-b border-[#E5DFD7] gap-4">
        <div>
          <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-1">
            Recién Llegados de Miami
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#161616] font-normal">
            Piezas Destacadas
          </h2>
        </div>

        {products.length > 0 && (
          <button
            onClick={() => navigateTo('catalog')}
            className="text-xs font-sans tracking-[0.18em] uppercase text-[#161616] hover:text-[#B08D57] flex items-center gap-2 transition-colors self-start sm:self-auto"
          >
            <span>Ver Todo el Catálogo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Cuadrícula de Productos Reales de Firestore o Estado Vacío Elegante */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.slice(0, 8).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* ESTADO VACÍO ELEGANTE ("PRÓXIMAMENTE") */
        <div className="p-12 sm:p-20 border border-[#E5DFD7] bg-[#FAF7F2] text-center space-y-4">
          <span className="text-[10px] font-sans tracking-[0.28em] text-[#B08D57] uppercase block">
            Próximamente
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#161616] font-normal max-w-md mx-auto">
            Nuevas piezas en camino desde Estados Unidos
          </h3>
          <p className="text-xs sm:text-sm font-serif text-[#161616]/65 max-w-md mx-auto leading-relaxed">
            Nuestro equipo en Miami y Nueva York se encuentra seleccionando las piezas de la próxima entrega a Colombia. Si buscas una referencia específica, escríbenos por WhatsApp y te la traemos bajo pedido.
          </p>
          <div className="pt-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#161616] text-[#FAF7F2] text-xs font-sans tracking-[0.2em] uppercase hover:bg-[#282828] transition-luxury"
            >
              <MessageCircle className="w-4 h-4 text-[#B08D57]" />
              <span>Cotizar Pieza por WhatsApp</span>
            </a>
          </div>
        </div>
      )}

    </section>
  );
};
