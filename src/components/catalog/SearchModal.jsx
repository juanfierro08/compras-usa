import React, { useState, useMemo } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatCOP } from '../../utils/formatters';
import { Search, X, ArrowRight } from 'lucide-react';

export const SearchModal = () => {
  const { isSearchOpen, setIsSearchOpen, products, navigateTo } = useShop();
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter(p => {
      const name = (p.nombre || p.name || '').toLowerCase();
      const brand = (p.marca || p.brand || '').toLowerCase();
      const desc = (p.descripcion || p.description || '').toLowerCase();
      const sub = (p.subcategoria || p.subcategory || '').toLowerCase();
      return name.includes(q) || brand.includes(q) || desc.includes(q) || sub.includes(q);
    }).slice(0, 8);
  }, [query, products]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#161616]/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-[#FAF7F2] border border-[#E5DFD7] shadow-lifted overflow-hidden transition-luxury"
        onClick={e => e.stopPropagation()}
      >
        {/* Barra de Búsqueda */}
        <div className="relative flex items-center px-6 py-5 border-b border-[#E5DFD7]">
          <Search className="w-4 h-4 text-[#B08D57] mr-4 shrink-0 stroke-[1.5]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por artículo, diseñador o categoría..."
            className="w-full bg-transparent text-[#161616] placeholder:text-[#161616]/40 text-sm sm:text-base font-serif focus:outline-none"
            autoFocus
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-[#161616]/40 hover:text-[#161616] mr-3"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={() => setIsSearchOpen(false)}
            className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#161616]/60 hover:text-[#161616]"
          >
            Cerrar
          </button>
        </div>

        {/* Resultados */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          {!query.trim() ? (
            <div className="text-center py-8">
              <span className="text-[11px] font-sans tracking-[0.2em] text-[#B08D57] uppercase block mb-2">
                Catálogo de Importaciones
              </span>
              <p className="text-xs font-serif text-[#161616]/70 max-w-sm mx-auto">
                Escribe el nombre de la pieza o marca que buscas. Todos los productos son 100% originales con despacho directo a Colombia.
              </p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="space-y-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#8F6E38] font-sans pb-2 border-b border-[#E5DFD7]">
                {filteredProducts.length} resultado{filteredProducts.length > 1 ? 's' : ''} en el catálogo
              </div>
              {filteredProducts.map((p) => {
                const name = p.nombre || p.name;
                const brand = p.marca || p.brand;
                const price = p.precio || p.priceCOP;
                const images = p.imagenes || p.images || [];

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      navigateTo('product-detail', p);
                      setIsSearchOpen(false);
                      setQuery('');
                    }}
                    className="flex items-center justify-between p-3 hover:bg-[#F3EFE8] cursor-pointer border-b border-[#E5DFD7]/60 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      {images[0] ? (
                        <img 
                          src={images[0]} 
                          alt={name} 
                          className="w-12 h-16 object-cover bg-stone-200"
                        />
                      ) : (
                        <div className="w-12 h-16 bg-[#F3EFE8] border border-[#E5DFD7] flex items-center justify-center text-[10px] font-serif text-stone-400">
                          USA
                        </div>
                      )}
                      <div>
                        <div className="text-[10px] text-[#B08D57] uppercase tracking-[0.16em] font-sans">
                          {brand}
                        </div>
                        <div className="text-sm font-serif text-[#161616] group-hover:text-[#B08D57] transition-colors line-clamp-1">
                          {name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 pl-3">
                      <div className="text-sm font-serif font-medium text-[#161616]">
                        {formatCOP(price)}
                      </div>
                      <span className="text-[10px] text-[#B08D57] uppercase tracking-wider font-sans block">
                        Ver pieza ➔
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center space-y-2">
              <h4 className="font-serif text-base text-[#161616]">
                No encontramos resultados para "{query}"
              </h4>
              <p className="text-xs font-sans text-[#161616]/60 max-w-sm mx-auto">
                ¿Buscas una pieza específica en Estados Unidos? Escríbenos por WhatsApp y te la cotizamos e importamos bajo pedido.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
