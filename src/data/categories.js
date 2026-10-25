// Definición inicial de las 5 categorías solicitadas por el negocio
// Nota: Las categorías y subcategorías pueden editarse o añadirse dinámicamente desde el panel de administrador y Firestore.

export const DEFAULT_CATEGORIES = [
  {
    id: 'ropa',
    name: 'Ropa & Calzado',
    slug: 'ropa',
    tagline: 'Piezas exclusivas y esenciales seleccionadas en EE.UU.',
    description: 'Prendas y calzado 100% originales adquiridos directamente en tiendas oficiales norteamericanas.',
    subcategories: ['Todos', 'Hombre', 'Mujer', 'Calzado', 'Accesorios', 'Bolsos', 'Gorras']
  },
  {
    id: 'tecnologia',
    name: 'Tecnología',
    slug: 'tecnologia',
    tagline: 'Dispositivos y gadgets de última generación',
    description: 'Equipos versión americana, homologados para operadores de Colombia y con garantía internacional.',
    subcategories: ['Todos', 'Celulares', 'Audífonos', 'Laptops', 'Smartwatches', 'Consolas', 'Accesorios']
  },
  {
    id: 'salud',
    name: 'Salud & Bienestar',
    slug: 'salud',
    tagline: 'Nutrición, suplementación y cuidado personal de grado farmacéutico',
    description: 'Fórmulas auténticas con certificación FDA importadas desde las principales farmacias de EE.UU.',
    isHealth: true,
    subcategories: ['Todos', 'Vitaminas', 'Suplementos', 'Cuidado Personal', 'Botiquín']
  },
  {
    id: 'perfumes-hombre',
    name: 'Lociones & Perfumes Hombre',
    slug: 'perfumes-hombre',
    tagline: 'Aromas icónicos y alta perfumería masculina',
    description: 'Concentraciones Eau de Parfum y Extractos legítimos con factura de procedencia en Nueva York y Miami.',
    subcategories: ['Todos', 'Nicho', 'Amaderados', 'Frescos & Cítricos', 'Orientales']
  },
  {
    id: 'perfumes-mujer',
    name: 'Lociones & Perfumes Mujer',
    slug: 'perfumes-mujer',
    tagline: 'Elegancia olfativa y fragancias de diseñador',
    description: 'Esencias importadas directamente en su empaque original de fábrica con precintos intactos.',
    subcategories: ['Todos', 'Florales', 'Dulces & Gourmand', 'Nicho & Exclusivos', 'Frescos']
  }
];
