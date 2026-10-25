import { formatCOP } from './formatters';

// Configuración centralizada de la tienda
export const STORE_CONFIG = {
  name: 'Desde el Extranjero Hacia Ti',
  whatsappNumber: '3128904421', // Número de WhatsApp para Colombia (sin +57)
  countryCode: '57',
  instagram: '@desdeelextranjerohaciati',
  email: 'contacto@desdeelextranjerohaciati.com',
  city: 'Bogotá / Medellín, Colombia',
  hubUSA: 'Miami Logistics Hub, Florida, USA'
};

/**
 * Genera el enlace de WhatsApp con el mensaje prellenado exacto:
 * "Hola, me interesa [nombre del producto] ([talla/color si aplica]) que vi en la tienda. Link: [URL del producto]"
 */
export const getWhatsAppProductLink = (product, selectedVariant = null, customUrl = null) => {
  if (!product) return `https://wa.me/${STORE_CONFIG.countryCode}${STORE_CONFIG.whatsappNumber}`;
  
  const prodName = product.nombre || product.name || 'este producto';
  const variantText = selectedVariant && selectedVariant !== 'Estándar' ? ` (${selectedVariant})` : '';
  const url = customUrl || (typeof window !== 'undefined' ? window.location.href : '');
  
  const message = `Hola, me interesa ${prodName}${variantText} que vi en la tienda. Link: ${url}`;

  return `https://wa.me/${STORE_CONFIG.countryCode}${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
};

/**
 * Genera el enlace para cotizar múltiples productos desde Favoritos / Wishlist
 */
export const getWhatsAppWishlistLink = (productsList) => {
  if (!productsList || productsList.length === 0) {
    return `https://wa.me/${STORE_CONFIG.countryCode}${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent('Hola, me comunico desde el catálogo de Desde el Extranjero Hacia Ti para consultar sobre importaciones de EE.UU.')}`;
  }

  const itemsText = productsList.map(p => `• ${p.nombre || p.name} (${formatCOP(p.precio || p.priceCOP)})`).join('\n');
  const message = `Hola, me interesa cotizar estas piezas que guardé en mis favoritos del catálogo:\n\n${itemsText}\n\n¿Tienen disponibilidad para coordinar el envío a Colombia?`;

  return `https://wa.me/${STORE_CONFIG.countryCode}${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
};
