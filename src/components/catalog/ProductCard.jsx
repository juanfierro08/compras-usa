import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatCOP } from '../../utils/formatters';
import { getWhatsAppProductLink } from '../../utils/whatsapp';
import { getOptimizedImageUrl } from '../../utils/cloudinary';
import { Heart, MessageCircle } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { navigateTo, toggleWishlist, isInWishlist } = useShop();
  const [isHovered, setIsHovered] = useState(false);

  const isSaved = isInWishlist(product.id);

  const name = product.nombre || product.name || 'Pieza Exclusiva';
  const brand = product.marca || product.brand || 'Importado USA';
  const price = product.precio || product.priceCOP || 0;
  const images = product.imagenes || product.images || [];
  const mainImage = images[0] ? getOptimizedImageUrl(images[0], 600) : null;
  const secondImage = images[1] ? getOptimizedImageUrl(images[1], 600) : null;
  const isAvailable = product.disponible !== false;

  const defaultVariant = (product.variantes && product.variantes[0]) || (product.sizes && product.sizes[0]) || null;
  const whatsappUrl = getWhatsAppProductLink(product, defaultVariant);

  return (
    <div 
      className="group relative flex flex-col justify-between bg-[#FAF7F2] border border-[#E5DFD7] p-3 transition-luxury hover:border-[#161616]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Botón Favoritos Discreto */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className="absolute top-5 right-5 z-10 p-2 bg-[#FAF7F2]/80 backdrop-blur-sm text-[#161616] hover:text-[#B08D57] transition-colors"
        aria-label="Guardar en favoritos"
      >
        <Heart className={`w-4 h-4 stroke-[1.5] ${isSaved ? 'fill-[#161616] text-[#161616]' : ''}`} />
      </button>

      {/* Imagen Vertical (3:4) con cambio a segunda foto en Hover */}
      <div 
        onClick={() => navigateTo('product-detail', product)}
        className="relative w-full aspect-product overflow-hidden bg-[#F3EFE8] cursor-pointer"
      >
        {mainImage ? (
          <>
            <img
              src={mainImage}
              alt={name}
              className={`w-full h-full object-cover transition-opacity duration-700 ease-out ${
                isHovered && secondImage ? 'opacity-0' : 'opacity-100'
              }`}
              loading="lazy"
            />
            {secondImage && (
              <img
                src={secondImage}
                alt={`${name} vista secundaria`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                loading="lazy"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center border border-dashed border-[#D3CAC0]">
            <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#B08D57] mb-1">USA Original</span>
            <span className="font-serif text-sm text-[#161616]/60">{name}</span>
          </div>
        )}

        {/* Indicador de Disponibilidad */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-[#FAF7F2]/85 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-[10px] font-sans tracking-[0.24em] uppercase text-[#161616] border border-[#161616] px-3 py-1">
              Agotado Temporalmente
            </span>
          </div>
        )}
      </div>

      {/* Información del Producto */}
      <div className="pt-4 pb-2 flex flex-col flex-1 justify-between">
        <div onClick={() => navigateTo('product-detail', product)} className="cursor-pointer">
          <div className="text-[10px] font-sans tracking-[0.2em] text-[#B08D57] uppercase mb-1">
            {brand}
          </div>
          <h3 className="font-serif text-base sm:text-lg text-[#161616] line-clamp-1 leading-snug group-hover:text-[#8F6E38] transition-colors">
            {name}
          </h3>
        </div>

        {/* Precio en COP y Botón WhatsApp Sobrio */}
        <div className="mt-3 pt-3 border-t border-[#E5DFD7] flex items-center justify-between gap-3">
          <div className="font-serif text-sm sm:text-base font-medium text-[#161616]">
            {formatCOP(price)}
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#161616] text-[#161616] hover:bg-[#161616] hover:text-[#FAF7F2] text-[10px] font-sans tracking-[0.16em] uppercase transition-luxury"
            title="Pedir por WhatsApp"
          >
            <MessageCircle className="w-3 h-3 text-[#B08D57]" />
            <span className="hidden sm:inline">Pedir</span>
          </a>
        </div>
      </div>
    </div>
  );
};
