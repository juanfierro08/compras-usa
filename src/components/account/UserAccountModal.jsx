import React from 'react';
import { useShop } from '../../context/ShopContext';
import { formatCOP } from '../../utils/formatters';
import { getWhatsAppProductLink, getWhatsAppWishlistLink, STORE_CONFIG } from '../../utils/whatsapp';
import { Heart, Trash2, ArrowLeft, MessageCircle, ArrowRight } from 'lucide-react';

export const UserAccountModal = () => {
  const { 
    wishlist, products, toggleWishlist, 
    navigateTo, whatsappNumber 
  } = useShop();

  // Filtrar productos reales de Firestore que están en favoritos
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));
  const wishlistWhatsAppUrl = getWhatsAppWishlistLink(wishlistProducts);

  return (
    <div className="py-12 sm:py-20 max-w-6xl mx-auto px-4 sm:px-8">
      
      {/* Botón Volver */}
      <button
        onClick={() => navigateTo('catalog')}
        className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.2em] uppercase text-[#161616]/60 hover:text-[#161616] mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al Catálogo</span>
      </button>

      {/* Encabezado Editorial */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#E5DFD7] mb-12 gap-4">
        <div>
          <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-1">
            Selección Personal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#161616] font-normal">
            Mis Piezas Guardadas ({wishlistProducts.length})
          </h1>
        </div>
        <p className="text-xs font-serif text-[#161616]/65 max-w-sm sm:text-right">
          Guarda las referencias que te interesen importar de Estados Unidos para cotizarlas juntas o por separado vía WhatsApp.
        </p>
      </div>

      {/* Contenido */}
      {wishlistProducts.length === 0 ? (
        <div className="py-20 border border-[#E5DFD7] bg-[#FAF7F2] text-center space-y-4">
          <Heart className="w-8 h-8 text-[#B08D57] stroke-[1.2] mx-auto" />
          <h2 className="font-serif text-2xl text-[#161616] font-normal">
            Tu lista de favoritos está vacía
          </h2>
          <p className="text-xs sm:text-sm font-serif text-[#161616]/65 max-w-md mx-auto leading-relaxed">
            Navega por las colecciones y pulsa el icono de corazón en cualquier pieza que te llame la atención. Quedará guardada aquí para que puedas pedirla en cualquier momento.
          </p>
          <div className="pt-4">
            <button
              onClick={() => navigateTo('catalog')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0F1B2D] text-[#FAF7F2] text-xs font-sans tracking-[0.2em] uppercase hover:bg-[#16263D] border border-[#B08D57]/30 transition-luxury"
            >
              <span>Explorar el Catálogo</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B08D57]" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Banner de Cotización Conjunta por WhatsApp */}
          <div className="border border-[#E5DFD7] p-6 sm:p-8 bg-[#F2EDE4]/50 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-sans tracking-[0.2em] text-[#B08D57] uppercase block">
                Cotización Múltiple
              </span>
              <h3 className="font-serif text-xl text-[#161616] font-normal">
                ¿Deseas cotizar toda tu selección de una vez?
              </h3>
              <p className="text-xs font-serif text-[#161616]/70 leading-relaxed">
                Envía las {wishlistProducts.length} referencias directamente a nuestro WhatsApp oficial para coordinar disponibilidad y flete consolidado.
              </p>
            </div>
            
            <a
              href={wishlistWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-8 py-3.5 bg-[#0F1B2D] text-[#FAF7F2] text-xs font-sans tracking-[0.2em] uppercase hover:bg-[#16263D] border border-[#B08D57]/30 transition-luxury flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#B08D57]" />
              <span>Cotizar Todo por WhatsApp</span>
            </a>
          </div>

          {/* Grilla de Piezas Favoritas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {wishlistProducts.map(p => {
              const itemWhatsAppUrl = getWhatsAppProductLink(p);
              const mainImg = p.imagenes?.[0] || p.images?.[0] || '';

              return (
                <div 
                  key={p.id}
                  className="border border-[#E5DFD7] bg-[#FAF7F2] p-5 flex flex-col justify-between group"
                >
                  <div>
                    {/* Imagen Vertical */}
                    <div className="relative aspect-[3/4] bg-[#F3EFE8] overflow-hidden mb-4 border border-[#E5DFD7]">
                      {mainImg ? (
                        <img 
                          src={mainImg} 
                          alt={p.nombre || p.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-serif text-[#161616]/40">
                          Sin imagen
                        </div>
                      )}
                      
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="absolute top-3 right-3 p-2 bg-[#FAF7F2]/90 hover:bg-[#161616] text-[#161616] hover:text-[#FAF7F2] border border-[#E5DFD7] transition-luxury"
                        title="Quitar de favoritos"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Metadata */}
                    <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#B08D57] block mb-1">
                      {p.marca || p.brand || 'Importado USA'}
                    </span>
                    <h3 className="font-serif text-lg text-[#161616] font-normal line-clamp-2">
                      {p.nombre || p.name}
                    </h3>
                    <div className="font-serif text-lg text-[#161616] mt-2">
                      {formatCOP(p.precio || p.precioCOP || p.priceCOP)}
                    </div>
                  </div>

                  {/* Botón WhatsApp */}
                  <div className="pt-4 mt-4 border-t border-[#E5DFD7]">
                    <a
                      href={itemWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-[#0F1B2D] text-[#FAF7F2] text-xs font-sans tracking-[0.16em] uppercase hover:bg-[#16263D] border border-[#B08D57]/30 transition-luxury flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#B08D57]" />
                      <span>Pedir por WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
