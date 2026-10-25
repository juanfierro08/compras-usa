import React, { useState, useMemo } from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from './ProductCard';
import { formatCOP } from '../../utils/formatters';
import { STORE_CONFIG } from '../../utils/whatsapp';
import { SlidersHorizontal, Check, AlertCircle, MessageCircle, X } from 'lucide-react';

export const CatalogPage = () => {
  const { products, categories, activeCategory, setActiveCategory, whatsappNumber } = useShop();

  const currentCategory = categories.find(c => c.id === activeCategory);

  // Filtros
  const [selectedSubcategory, setSelectedSubcategory] = useState('Todos');
  const [selectedBrand, setSelectedBrand] = useState('Todas');
  const [maxPrice, setMaxPrice] = useState(8000000);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState('recientes');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Marcas presentes en los productos reales
  const availableBrands = useMemo(() => {
    let base = products;
    if (activeCategory) {
      base = base.filter(p => (p.categoria || p.category) === activeCategory);
    }
    const brands = new Set(base.map(p => p.marca || p.brand).filter(Boolean));
    return ['Todas', ...Array.from(brands)];
  }, [products, activeCategory]);

  // Subcategorías
  const availableSubcategories = useMemo(() => {
    if (currentCategory && currentCategory.subcategories) {
      return currentCategory.subcategories;
    }
    return ['Todos'];
  }, [currentCategory]);

  // Filtrado y Ordenamiento
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Categoría principal
    if (activeCategory) {
      list = list.filter(p => (p.categoria || p.category) === activeCategory);
    }

    // Subcategoría
    if (selectedSubcategory !== 'Todos') {
      list = list.filter(p => (p.subcategoria || p.subcategory) === selectedSubcategory);
    }

    // Marca
    if (selectedBrand !== 'Todas') {
      list = list.filter(p => (p.marca || p.brand) === selectedBrand);
    }

    // Precio máximo en COP
    list = list.filter(p => {
      const price = p.precio || p.priceCOP || 0;
      return price <= maxPrice;
    });

    // Disponibilidad
    if (onlyAvailable) {
      list = list.filter(p => p.disponible !== false);
    }

    // Orden
    switch (sortBy) {
      case 'precio-menor':
        list.sort((a, b) => (a.precio || a.priceCOP || 0) - (b.precio || b.priceCOP || 0));
        break;
      case 'precio-mayor':
        list.sort((a, b) => (b.precio || b.priceCOP || 0) - (a.precio || a.priceCOP || 0));
        break;
      case 'alfabetico':
        list.sort((a, b) => (a.nombre || a.name || '').localeCompare(b.nombre || b.name || ''));
        break;
      case 'recientes':
      default:
        // Orden natural de Firestore (recientes primero)
        break;
    }

    return list;
  }, [products, activeCategory, selectedSubcategory, selectedBrand, maxPrice, onlyAvailable, sortBy]);

  const resetFilters = () => {
    setSelectedSubcategory('Todos');
    setSelectedBrand('Todas');
    setMaxPrice(8000000);
    setOnlyAvailable(false);
    setSortBy('recientes');
  };

  const phone = whatsappNumber || STORE_CONFIG.whatsappNumber;
  const customOrderWhatsAppUrl = `https://wa.me/57${phone}?text=${encodeURIComponent('Hola, estuve revisando el catálogo y me gustaría cotizar una pieza específica de Estados Unidos que no veo publicada.')}`;

  return (
    <div className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-8">
      
      {/* Navegación por Pestañas de Colecciones */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 border-b border-[#E5DFD7]">
        <button
          onClick={() => {
            setActiveCategory(null);
            setSelectedSubcategory('Todos');
          }}
          className={`text-xs font-sans tracking-[0.18em] uppercase py-2 px-3 transition-colors whitespace-nowrap ${
            activeCategory === null
              ? 'border-b-2 border-[#161616] text-[#161616] font-semibold'
              : 'text-[#161616]/60 hover:text-[#161616]'
          }`}
        >
          Todo ({products.length})
        </button>

        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setActiveCategory(c.id);
              setSelectedSubcategory('Todos');
            }}
            className={`text-xs font-sans tracking-[0.18em] uppercase py-2 px-3 transition-colors whitespace-nowrap ${
              activeCategory === c.id
                ? 'border-b-2 border-[#161616] text-[#161616] font-semibold'
                : 'text-[#161616]/60 hover:text-[#161616]'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Encabezado Editorial de Categoría */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-2">
          {currentCategory ? 'Colección de Temporada' : 'Catálogo Completo de Importación'}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#161616] font-normal leading-tight">
          {currentCategory ? currentCategory.name : 'Piezas Originales de EE.UU.'}
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#161616]/65 mt-3 leading-relaxed">
          {currentCategory ? currentCategory.description : 'Selección curada en tiendas oficiales de Miami y Nueva York con entrega garantizada en Colombia.'}
        </p>

        {/* Aviso visible de Salud si la categoría es salud */}
        {currentCategory?.isHealth && (
          <div className="mt-4 p-4 border border-[#B08D57]/40 bg-[#FAF7F2] text-left text-xs font-sans text-[#161616]/80 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-[#B08D57] shrink-0 mt-0.5" />
            <span>
              <strong>Aviso legal obligatorio:</strong> Los suplementos, vitaminas y productos de bienestar importados son de venta libre pero no sustituyen el diagnóstico, prescripción médica o tratamiento de un profesional de la salud.
            </span>
          </div>
        )}
      </div>

      {/* Selector de Subcategorías */}
      {availableSubcategories.length > 1 && (
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8">
          {availableSubcategories.map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubcategory(sub)}
              className={`px-3 py-1.5 text-xs font-sans tracking-[0.12em] uppercase transition-colors whitespace-nowrap ${
                selectedSubcategory === sub
                  ? 'bg-[#161616] text-[#FAF7F2]'
                  : 'bg-transparent text-[#161616]/70 hover:text-[#161616]'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Barra de Control (Filtros en móvil y Orden en desktop) */}
      <div className="py-3 px-4 border-y border-[#E5DFD7] mb-10 flex items-center justify-between text-xs font-sans">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden flex items-center gap-2 uppercase tracking-[0.16em] text-[#161616]"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#B08D57]" />
          <span>Filtros</span>
        </button>

        <span className="text-[#161616]/60 tracking-wider">
          {filteredProducts.length} pieza{filteredProducts.length === 1 ? '' : 's'} disponible{filteredProducts.length === 1 ? '' : 's'}
        </span>

        <div className="flex items-center gap-2">
          <span className="text-[#161616]/60 hidden sm:inline uppercase tracking-wider text-[11px]">Ordenar:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border-0 text-xs font-sans uppercase tracking-wider text-[#161616] focus:outline-none cursor-pointer"
          >
            <option value="recientes">Más Recientes</option>
            <option value="precio-menor">Menor Precio</option>
            <option value="precio-mayor">Mayor Precio</option>
            <option value="alfabetico">Alfabético</option>
          </select>
        </div>
      </div>

      {/* Layout Principal: Barra Lateral + Cuadrícula */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* BARRA LATERAL DE FILTROS (Desktop) */}
        <aside className="hidden lg:block space-y-8">
          <div className="pb-4 border-b border-[#E5DFD7] flex items-center justify-between">
            <span className="text-xs font-sans tracking-[0.2em] uppercase text-[#161616] font-semibold">
              Filtrar
            </span>
            <button
              onClick={resetFilters}
              className="text-[10px] font-sans tracking-[0.16em] uppercase text-[#B08D57] hover:underline"
            >
              Restablecer
            </button>
          </div>

          {/* Rango de Precio en COP */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-[#161616]/60">Precio Máximo:</span>
              <span className="font-serif font-medium text-[#161616]">{formatCOP(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="100000"
              max="8000000"
              step="50000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#161616] cursor-pointer"
            />
          </div>

          {/* Marcas de Diseñador */}
          {availableBrands.length > 2 && (
            <div className="space-y-2">
              <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#B08D57] block mb-2">
                Diseñador / Marca
              </span>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {availableBrands.map(b => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`w-full text-left py-1 text-xs font-serif flex items-center justify-between ${
                      selectedBrand === b ? 'text-[#161616] font-bold' : 'text-[#161616]/65 hover:text-[#161616]'
                    }`}
                  >
                    <span>{b}</span>
                    {selectedBrand === b && <Check className="w-3 h-3 text-[#B08D57]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Disponibilidad */}
          <div className="pt-4 border-t border-[#E5DFD7]">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-[#161616]/80">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="accent-[#161616] w-3.5 h-3.5"
              />
              <span>Solo piezas en stock</span>
            </label>
          </div>
        </aside>

        {/* CUADRÍCULA DE PRODUCTOS O ESTADO VACÍO ELEGANTE */}
        <div className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* ESTADO VACÍO ELEGANTE ("PRÓXIMAMENTE") */
            <div className="p-12 sm:p-16 border border-[#E5DFD7] text-center bg-[#FAF7F2] space-y-4">
              <span className="text-[10px] font-sans tracking-[0.28em] text-[#B08D57] uppercase block">
                Próximamente
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#161616] font-normal max-w-md mx-auto">
                Nuevas piezas en camino desde Estados Unidos
              </h3>
              <p className="text-xs font-serif text-[#161616]/60 max-w-sm mx-auto leading-relaxed">
                Estamos preparando el inventario para esta colección. Si buscas un producto en particular, te lo cotizamos y traemos bajo pedido.
              </p>
              <div className="pt-4">
                <a
                  href={customOrderWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[#161616] bg-[#161616] text-[#FAF7F2] hover:bg-transparent hover:text-[#161616] text-xs font-sans tracking-[0.18em] uppercase transition-luxury"
                >
                  <MessageCircle className="w-4 h-4 text-[#B08D57]" />
                  <span>Cotizar Pieza por WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* DRAWER MÓVIL DE FILTROS */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-[#161616]/60 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-full max-w-xs bg-[#FAF7F2] h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between border-l border-[#E5DFD7]">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD7]">
                <span className="text-xs font-sans tracking-[0.2em] uppercase font-bold text-[#161616]">
                  Filtros
                </span>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1 text-[#161616]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Rango de precio */}
              <div className="space-y-2">
                <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#B08D57] block">
                  Precio Máximo: {formatCOP(maxPrice)}
                </span>
                <input
                  type="range"
                  min="100000"
                  max="8000000"
                  step="50000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#161616]"
                />
              </div>

              {/* Marcas */}
              {availableBrands.length > 2 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#B08D57] block mb-2">
                    Diseñador
                  </span>
                  {availableBrands.map(b => (
                    <button
                      key={b}
                      onClick={() => setSelectedBrand(b)}
                      className={`w-full text-left py-1 text-xs font-serif flex items-center justify-between ${
                        selectedBrand === b ? 'text-[#161616] font-bold' : 'text-[#161616]/60'
                      }`}
                    >
                      <span>{b}</span>
                      {selectedBrand === b && <Check className="w-3 h-3 text-[#B08D57]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#E5DFD7] space-y-2">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 bg-[#161616] text-[#FAF7F2] text-xs font-sans tracking-[0.18em] uppercase"
              >
                Ver Resultados ({filteredProducts.length})
              </button>
              <button
                onClick={resetFilters}
                className="w-full py-2.5 border border-[#E5DFD7] text-xs font-sans tracking-[0.14em] uppercase text-[#161616]/70"
              >
                Restablecer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
