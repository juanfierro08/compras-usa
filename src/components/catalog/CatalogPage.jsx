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
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

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

    // Precio máximo solo si hay más de 8 productos
    if (products.length > 8) {
      list = list.filter(p => {
        const price = p.precio || p.priceCOP || 0;
        return price <= maxPrice;
      });
    }

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
  // TODO: confirmar con el dueño
  const customOrderWhatsAppUrl = `https://wa.me/57${phone}?text=${encodeURIComponent('Hola, estuve revisando el catálogo y me gustaría cotizar una pieza específica de Estados Unidos que no veo publicada.')}`;

  const bannerImage = currentCategory?.image;
  const bannerGradient = currentCategory?.gradient || 'linear-gradient(135deg, #0F1B2D 0%, #070D17 100%)';

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      
      {/* 1. BANNER HORIZONTAL DE CATEGORÍA (~40vh en escritorio, ~28vh en celular) */}
      <div className="relative w-full h-[28vh] sm:h-[34vh] lg:h-[40vh] overflow-hidden flex items-center justify-center text-center px-4 sm:px-8 border-b border-[#B08D57]/30">
        {bannerImage ? (
          <>
            <img
              src={bannerImage}
              alt={currentCategory?.name || 'Catálogo'}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30" />
          </>
        ) : (
          <div 
            className="absolute inset-0"
            style={{ background: bannerGradient }}
          >
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FAF7F2_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        )}

        {/* Textos del Banner en Crema */}
        <div className="relative z-10 max-w-3xl space-y-2 sm:space-y-3">
          <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.26em] text-[#B08D57] uppercase block">
            {currentCategory ? 'Colección' : 'Catálogo Completo'}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#FAF7F2] font-normal tracking-tight">
            {currentCategory ? currentCategory.name : 'Piezas Importadas de EE.UU.'}
          </h1>
          {/* TODO: confirmar con el dueño */}
          <p className="text-xs sm:text-sm font-sans text-[#FAF7F2]/80 max-w-lg mx-auto leading-relaxed">
            {currentCategory ? (currentCategory.tagline || currentCategory.description) : 'Productos importados desde Estados Unidos con asesoría directa por WhatsApp.'}
          </p>

          {/* Aviso médico obligatorio si es categoría de salud */}
          {currentCategory?.isHealth && (
            <div className="pt-2">
              <span className="inline-block px-3 py-1 bg-black/40 backdrop-blur-sm border border-[#B08D57]/40 text-[10px] font-sans text-[#FAF7F2]/90">
                Aviso: Los productos de salud no sustituyen la consulta médica profesional.
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        
        {/* Navegación por Pestañas de Categoría */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-[#E5DFD7]">
          <button
            onClick={() => {
              setActiveCategory(null);
              setSelectedSubcategory('Todos');
            }}
            className={`text-xs font-sans tracking-[0.16em] uppercase py-2 px-3.5 transition-colors whitespace-nowrap ${
              activeCategory === null
                ? 'bg-[#0F1B2D] text-[#FAF7F2] font-semibold'
                : 'text-[#161616]/70 hover:text-[#0F1B2D]'
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
              className={`text-xs font-sans tracking-[0.16em] uppercase py-2 px-3.5 transition-colors whitespace-nowrap ${
                activeCategory === c.id
                  ? 'bg-[#0F1B2D] text-[#FAF7F2] font-semibold'
                  : 'text-[#161616]/70 hover:text-[#0F1B2D]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Chips Simples de Subcategoría */}
        {availableSubcategories.length > 1 && (
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-6">
            {availableSubcategories.map(sub => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-3 py-1 text-[11px] font-sans tracking-[0.12em] uppercase transition-colors whitespace-nowrap ${
                  selectedSubcategory === sub
                    ? 'border-b-2 border-[#0F1B2D] text-[#0F1B2D] font-bold'
                    : 'text-[#161616]/60 hover:text-[#0F1B2D]'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* Barra de Control: Botón Filtrar (abre panel colapsable) + Contador + Ordenar */}
        <div className="py-3 px-4 border-y border-[#E5DFD7] mb-10 flex items-center justify-between text-xs font-sans">
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className="flex items-center gap-2 uppercase tracking-[0.16em] text-[#0F1B2D] font-semibold hover:text-[#B08D57] transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#B08D57]" />
            <span>{isFilterPanelOpen ? 'Ocultar Filtros' : 'Filtrar'}</span>
          </button>

          <span className="text-[#161616]/60 tracking-wider">
            {filteredProducts.length} pieza{filteredProducts.length === 1 ? '' : 's'}
          </span>

          <div className="flex items-center gap-2">
            <span className="text-[#161616]/60 hidden sm:inline uppercase tracking-wider text-[11px]">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-0 text-xs font-sans uppercase tracking-wider text-[#0F1B2D] font-medium focus:outline-none cursor-pointer"
            >
              <option value="recientes">Más Recientes</option>
              <option value="precio-menor">Menor Precio</option>
              <option value="precio-mayor">Mayor Precio</option>
              <option value="alfabetico">Alfabético</option>
            </select>
          </div>
        </div>

        {/* PANEL COLAPSABLE DE FILTROS */}
        {isFilterPanelOpen && (
          <div className="p-6 mb-10 border border-[#E5DFD7] bg-[#F2EDE4]/50 animate-fadeIn space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD7]">
              <span className="text-xs font-sans tracking-[0.18em] uppercase font-bold text-[#0F1B2D]">
                Filtros Avanzados
              </span>
              <button
                onClick={resetFilters}
                className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#B08D57] hover:underline"
              >
                Restablecer Todo
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Marcas de Diseñador */}
              {availableBrands.length > 2 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-sans tracking-[0.18em] uppercase text-[#B08D57] block">
                    Marca / Diseñador
                  </span>
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-2">
                    {availableBrands.map(b => (
                      <button
                        key={b}
                        onClick={() => setSelectedBrand(b)}
                        className={`w-full text-left py-1 text-xs font-sans flex items-center justify-between ${
                          selectedBrand === b ? 'text-[#0F1B2D] font-bold' : 'text-[#161616]/70 hover:text-[#0F1B2D]'
                        }`}
                      >
                        <span>{b}</span>
                        {selectedBrand === b && <Check className="w-3 h-3 text-[#B08D57]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Rango de precio (solo si hay catálogo nutrido) */}
              {products.length > 8 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-sans tracking-[0.18em] uppercase text-[#B08D57] block">
                    Precio Máximo: {formatCOP(maxPrice)}
                  </span>
                  <input
                    type="range"
                    min="100000"
                    max="8000000"
                    step="50000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#0F1B2D]"
                  />
                </div>
              )}

              {/* Disponibilidad */}
              <div className="space-y-2 flex flex-col justify-center">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-[#0F1B2D]">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                    className="accent-[#0F1B2D] w-4 h-4"
                  />
                  <span>Solo piezas con disponibilidad inmediata</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* CUADRÍCULA DE PRODUCTOS (2 en celular, 3 en tablet, 4 en escritorio) */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* ESTADO VACÍO ELEGANTE ("PRÓXIMAMENTE") */
          <div className="p-12 sm:p-20 border border-[#E5DFD7] text-center bg-[#FAF7F2] space-y-4 max-w-2xl mx-auto my-8">
            <span className="text-[10px] font-sans tracking-[0.28em] text-[#B08D57] uppercase block">
              Próximamente
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#0F1B2D] font-normal">
              Nuevas piezas en camino desde Estados Unidos
            </h3>
            {/* TODO: confirmar con el dueño */}
            <p className="text-xs sm:text-sm font-sans text-[#161616]/65 max-w-md mx-auto leading-relaxed">
              Estamos preparando las piezas de esta colección. Si buscas una referencia en particular, escríbenos por WhatsApp y te la traemos bajo pedido.
            </p>
            <div className="pt-4">
              <a
                href={customOrderWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0F1B2D] hover:bg-[#16263D] text-[#FAF7F2] text-xs font-sans tracking-[0.18em] uppercase transition-all"
              >
                <MessageCircle className="w-4 h-4 text-[#B08D57]" />
                <span>Cotizar Pieza por WhatsApp</span>
              </a>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
