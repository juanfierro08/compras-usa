// Definición de las 5 categorías oficiales de la tienda
// Cada categoría tiene un color sobrio y elegante mientras no se haya subido su foto en /admin.
// Los textos han sido revisados con honestidad comercial:
// TODO: confirmar con el dueño detalles específicos de procedencia y tiempos.

export const DEFAULT_CATEGORIES = [
  {
    id: 'ropa',
    name: 'Ropa, Calzado & Bebé',
    slug: 'ropa',
    // TODO: confirmar con el dueño
    tagline: 'Moda, calzado y cosas de bebé importados de EE.UU.',
    description: 'Prendas exclusivas para hombre, mujer, calzado y artículos para bebé traídos directamente de EE.UU.',
    subcategories: ['Todos', 'Hombre', 'Mujer', 'Bebé', 'Calzado', 'Accesorios', 'Bolsos', 'Gorras'],
    color: '#0F1B2D', // Azul noche profundo
    colorBlock: 'from-[#0F1B2D] to-[#070D17]',
    gradient: 'linear-gradient(135deg, #0F1B2D 0%, #070D17 100%)',
    accentColor: '#B08D57',
    image: null
  },
  {
    id: 'tecnologia',
    name: 'Tecnología',
    slug: 'tecnologia',
    // TODO: confirmar con el dueño
    tagline: 'Dispositivos y accesorios importados',
    description: 'Equipos y gadgets traídos desde Estados Unidos con pedidos y asesoría por WhatsApp.',
    subcategories: ['Todos', 'Celulares', 'Audífonos', 'Laptops', 'Smartwatches', 'Consolas', 'Accesorios'],
    color: '#2A2D34', // Grafito
    colorBlock: 'from-[#2A2D34] to-[#181A1E]',
    gradient: 'linear-gradient(135deg, #2A2D34 0%, #181A1E 100%)',
    accentColor: '#B08D57',
    image: null
  },
  {
    id: 'salud',
    name: 'Salud & Bienestar',
    slug: 'salud',
    // TODO: confirmar con el dueño
    tagline: 'Vitaminas, suplementos y cuidado personal',
    description: 'Suplementación y cuidado personal traídos desde Estados Unidos.',
    isHealth: true,
    subcategories: ['Todos', 'Vitaminas', 'Suplementos', 'Cuidado Personal'],
    color: '#7C8F7A', // Verde salvia apagado
    colorBlock: 'from-[#7C8F7A] to-[#4F5E4E]',
    gradient: 'linear-gradient(135deg, #7C8F7A 0%, #4F5E4E 100%)',
    accentColor: '#B08D57',
    image: null
  },
  {
    id: 'perfumes-hombre',
    name: 'Lociones & Perfumes Hombre',
    slug: 'perfumes-hombre',
    // TODO: confirmar con el dueño
    tagline: 'Fragancias masculinas importadas',
    description: 'Perfumes y lociones para hombre traídos directamente de Estados Unidos.',
    subcategories: ['Todos', 'Amaderados', 'Frescos & Cítricos', 'Orientales', 'Nicho'],
    color: '#161616', // Negro carbón
    colorBlock: 'from-[#161616] to-[#0D0D0D]',
    gradient: 'linear-gradient(135deg, #161616 0%, #0D0D0D 100%)',
    accentColor: '#B08D57',
    image: null
  },
  {
    id: 'perfumes-mujer',
    name: 'Lociones & Perfumes Mujer',
    slug: 'perfumes-mujer',
    // TODO: confirmar con el dueño
    tagline: 'Fragancias femeninas importadas',
    description: 'Perfumes y lociones para mujer traídos directamente de Estados Unidos.',
    subcategories: ['Todos', 'Florales', 'Dulces', 'Frescos', 'Nicho'],
    color: '#5E2A35', // Burdeos
    colorBlock: 'from-[#5E2A35] to-[#3A141E]',
    gradient: 'linear-gradient(135deg, #5E2A35 0%, #3A141E 100%)',
    accentColor: '#B08D57',
    image: null
  }
];
