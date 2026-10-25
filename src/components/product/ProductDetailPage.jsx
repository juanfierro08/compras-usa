import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../catalog/ProductCard';
import { formatCOP, COLOMBIAN_LOCATIONS, calculateShipping } from '../../utils/formatters';
import { getWhatsAppProductLink } from '../../utils/whatsapp';
import { getOptimizedImageUrl } from '../../utils/cloudinary';
import { 
  Heart, ArrowLeft, Check, Copy, AlertCircle, 
  MessageCircle, Plane 
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { 
    selectedProduct, products, toggleWishlist, 
    isInWishlist, navigateTo, showToast 
  } = useShop();

  if (!selectedProduct) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4 bg-[#FAF7F2]">
        <h2 className="font-serif text-2xl text-[#0F1B2D] mb-4">Ningún artículo seleccionado</h2>
        <button
          onClick={() => navigateTo('catalog')}
          className="px-6 py-3 bg-[#0F1B2D] text-[#FAF7F2] text-xs font-sans tracking-[0.18em] uppercase hover:bg-[#16263D] transition-all"
        >
          Volver al Catálogo
        </button>
      </div>
    );
  }

  const p = selectedProduct;
  const isSaved = isInWishlist(p.id);

  const name = p.nombre || p.name || 'Pieza Importada';
  const brand = p.marca || p.brand || 'Importado USA';
  const price = p.precio || p.priceCOP || 0;
  const description = p.descripcion || p.description || '';
  const variants = p.variantes || p.sizes || [];
  const images = (p.imagenes && p.imagenes.length > 0) ? p.imagenes : (p.images || []);
  const categoryId = p.categoria || p.category;

  const [selectedImage, setSelectedImage] = useState(images[0] || null);
  const [selectedVariant, setSelectedVariant] = useState(variants[0] || null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Estimación de entrega por departamento
  const [selectedDepartment, setSelectedDepartment] = useState('Bogotá D.C.');
  const departmentInfo = COLOMBIAN_LOCATIONS.find(d => d.department === selectedDepartment) || COLOMBIAN_LOCATIONS[0];
  const shippingCost = calculateShipping(price, selectedDepartment);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    showToast('Enlace de la pieza copiado al portapapeles', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // WhatsApp Link con formato exacto:
  // "Hola, me interesa [nombre del producto] ([talla/color si aplica]) que vi en la tienda. Link: [URL del producto]"
  const whatsappUrl = getWhatsAppProductLink(p, selectedVariant);

  // Productos relacionados de la misma categoría en Firestore
  const relatedProducts = products
    .filter(item => (item.categoria || item.category) === categoryId && item.id !== p.id)
    .slice(0, 4);

  return (
    <div className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-8 bg-[#FAF7F2]">
      
      {/* Botón Volver y Compartir */}
      <div className="mb-8 flex items-center justify-between pb-4 border-b border-[#E5DFD7]">
        <button
          onClick={() => navigateTo('catalog', categoryId)}
          className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.16em] uppercase text-[#0F1B2D] hover:text-[#B08D57] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Catálogo / {brand}</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="p-2 border border-[#E5DFD7] text-xs font-sans tracking-[0.14em] uppercase text-[#0F1B2D] hover:text-[#B08D57] flex items-center gap-1.5 transition-colors"
            title="Copiar enlace"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-[#B08D57]" /> : <Copy className="w-3.5 h-3.5 text-[#0F1B2D]" />}
            <span className="hidden sm:inline">Copiar Enlace</span>
          </button>
        </div>
      </div>

      {/* Grid Principal del Producto */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        
        {/* COLUMNA IZQUIERDA: Galería Vertical 3:4 */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Foto Principal */}
          <div className="relative aspect-product w-full overflow-hidden bg-[#F3EFE8] border border-[#E5DFD7]">
            {selectedImage ? (
              <img
                src={getOptimizedImageUrl(selectedImage, 1200)}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-serif text-[#161616]/40">
                Sin fotografía
              </div>
            )}

            {/* Botón Favoritos */}
            <button
              onClick={() => toggleWishlist(p.id)}
              className="absolute top-4 right-4 p-3 bg-[#FAF7F2]/90 backdrop-blur-sm text-[#0F1B2D] hover:text-[#B08D57] transition-colors border border-[#E5DFD7]"
              aria-label="Guardar en favoritos"
            >
              <Heart className={`w-4 h-4 stroke-[1.5] ${isSaved ? 'fill-[#0F1B2D] text-[#0F1B2D]' : ''}`} />
            </button>
          </div>

          {/* Miniaturas de Fotos */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-24 overflow-hidden border transition-all shrink-0 ${
                    selectedImage === img ? 'border-[#0F1B2D] scale-102' : 'border-[#E5DFD7] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={getOptimizedImageUrl(img, 300)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: Ficha de Información y Pedido WhatsApp */}
        <div className="lg:col-span-5 space-y-6">
          
          <div>
            {/* TODO: confirmar con el dueño */}
            <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-1">
              {brand} · Producto Importado de EE.UU.
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#0F1B2D] font-normal leading-tight">
              {name}
            </h1>
          </div>

          {/* Precio en Pesos Colombianos */}
          <div className="py-4 border-y border-[#E5DFD7]">
            <div className="font-serif text-2xl sm:text-3xl text-[#161616] font-normal">
              {formatCOP(price)}
            </div>
            {/* TODO: confirmar con el dueño */}
            <span className="text-[11px] font-sans tracking-[0.08em] text-[#161616]/70 mt-1 block">
              Precio en pesos colombianos (COP). Pedidos y asesoría directa por WhatsApp.
            </span>
          </div>

          {/* Selector de Variantes (Talla / Color / Presentación) */}
          {variants.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-sans tracking-[0.2em] text-[#0F1B2D] uppercase font-bold block">
                Seleccionar Opción / Talla:
              </span>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3.5 py-2 text-xs font-sans tracking-[0.12em] uppercase border transition-colors ${
                      selectedVariant === v
                        ? 'border-[#0F1B2D] bg-[#0F1B2D] text-[#FAF7F2]'
                        : 'border-[#E5DFD7] text-[#161616]/75 hover:border-[#0F1B2D]'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* BOTÓN PRINCIPAL: ME INTERESA / PEDIR POR WHATSAPP EN AZUL NOCHE */}
          <div className="pt-2 space-y-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 bg-[#0F1B2D] hover:bg-[#16263D] text-[#FAF7F2] border border-[#B08D57]/40 text-xs font-sans tracking-[0.22em] uppercase flex items-center justify-center gap-3 transition-all duration-300 shadow-lifted"
            >
              <MessageCircle className="w-4 h-4 text-[#B08D57]" />
              <span>Me interesa / Pedir por WhatsApp</span>
            </a>
            <p className="text-[10px] font-sans text-center text-[#161616]/65 tracking-wider">
              Abre una conversación en WhatsApp con el nombre de la pieza y la opción elegida ya listos.
            </p>
          </div>

          {/* Calculadora de Entrega por Departamento */}
          <div className="p-4 border border-[#E5DFD7] bg-[#F2EDE4]/40 space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-sans tracking-[0.2em] uppercase text-[#B08D57] font-semibold">
              <Plane className="w-3.5 h-3.5" />
              {/* TODO: confirmar con el dueño */}
              <span>Estimación de Entrega en Colombia</span>
            </div>
            
            <div>
              <label className="text-[11px] font-sans text-[#161616]/70 block mb-1">
                Calcular según tu departamento:
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full p-2 bg-[#FAF7F2] border border-[#E5DFD7] text-xs font-sans text-[#0F1B2D] focus:outline-none"
              >
                {COLOMBIAN_LOCATIONS.map(d => (
                  <option key={d.department} value={d.department}>{d.department}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between text-xs font-sans pt-1 border-t border-[#E5DFD7]/60">
              <span className="text-[#161616]/70">Flete estimado:</span>
              <span className="font-serif font-medium text-[#161616]">
                {shippingCost === 0 ? 'Envío Gratis (supera $300.000 COP)' : formatCOP(shippingCost)}
              </span>
            </div>
            {/* TODO: confirmar con el dueño */}
            <div className="text-[10px] font-sans text-[#161616]/65">
              Tiempo estimado de entrega: <strong>{departmentInfo.deliveryDays}</strong>
            </div>
          </div>

          {/* Aviso Legal de Salud si aplica */}
          {categoryId === 'salud' && (
            <div className="p-4 border border-[#B08D57]/40 bg-[#FAF7F2] text-xs font-sans text-[#161616]/85 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-[#B08D57] shrink-0 mt-0.5" />
              <span>
                <strong>Aviso de salud importante:</strong> Los suplementos y vitaminas importados no sustituyen el diagnóstico, prescripción médica o tratamiento de un profesional de la salud.
              </span>
            </div>
          )}

          {/* Descripción del Producto */}
          {description && (
            <div className="pt-4 border-t border-[#E5DFD7] space-y-2">
              <span className="text-[10px] font-sans tracking-[0.2em] text-[#B08D57] uppercase block font-semibold">
                Detalles del Artículo
              </span>
              <div className="text-xs sm:text-sm font-sans text-[#161616]/75 leading-relaxed whitespace-pre-line">
                {description}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Piezas Relacionadas */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-10 border-t border-[#E5DFD7]">
          <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-2 text-center">
            Colección Relacionada
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-center text-[#0F1B2D] mb-8 font-normal">
            Otras Piezas que te Pueden Interesar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {relatedProducts.map(rel => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
