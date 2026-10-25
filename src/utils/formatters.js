// Utilidades de formato para Colombia

/**
 * Formatea un número a Pesos Colombianos con el formato $1.250.000
 */
export const formatCOP = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '$0';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
};

// Departamentos y ciudades principales de Colombia para estimación de fletes
export const COLOMBIAN_LOCATIONS = [
  {
    department: 'Bogotá D.C.',
    cities: ['Bogotá'],
    shippingCost: 14000,
    deliveryDays: '4 - 7 días hábiles'
  },
  {
    department: 'Antioquia',
    cities: ['Medellín', 'Envigado', 'Bello', 'Itagüí', 'Rionegro', 'Sabaneta'],
    shippingCost: 18000,
    deliveryDays: '5 - 8 días hábiles'
  },
  {
    department: 'Cundinamarca',
    cities: ['Chía', 'Soacha', 'Zipaquirá', 'Facatativá', 'Fusagasugá', 'Cajicá'],
    shippingCost: 16000,
    deliveryDays: '5 - 8 días hábiles'
  },
  {
    department: 'Valle del Cauca',
    cities: ['Cali', 'Palmira', 'Buga', 'Tuluá', 'Buenaventura'],
    shippingCost: 19000,
    deliveryDays: '5 - 8 días hábiles'
  },
  {
    department: 'Atlántico',
    cities: ['Barranquilla', 'Soledad', 'Puerto Colombia'],
    shippingCost: 20000,
    deliveryDays: '6 - 9 días hábiles'
  },
  {
    department: 'Santander',
    cities: ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta'],
    shippingCost: 20000,
    deliveryDays: '6 - 9 días hábiles'
  },
  {
    department: 'Bolívar',
    cities: ['Cartagena', 'Magangué', 'Turbaco'],
    shippingCost: 21000,
    deliveryDays: '6 - 9 días hábiles'
  },
  {
    department: 'Eje Cafetero (Risaralda / Caldas / Quindío)',
    cities: ['Pereira', 'Manizales', 'Armenia', 'Dosquebradas'],
    shippingCost: 19000,
    deliveryDays: '5 - 8 días hábiles'
  },
  {
    department: 'Tolima & Huila',
    cities: ['Ibagué', 'Neiva', 'Pitalito', 'Espinal'],
    shippingCost: 20000,
    deliveryDays: '6 - 9 días hábiles'
  },
  {
    department: 'Norte de Santander',
    cities: ['Cúcuta', 'Los Patios', 'Villa del Rosario'],
    shippingCost: 22000,
    deliveryDays: '6 - 9 días hábiles'
  },
  {
    department: 'Otros Departamentos de Colombia',
    cities: ['Pasto', 'Villavicencio', 'Montería', 'Santa Marta', 'Valledupar', 'Tunja', 'San Andrés'],
    shippingCost: 23000,
    deliveryDays: '6 - 10 días hábiles'
  }
];

export const FREE_SHIPPING_THRESHOLD = 300000;

export const calculateShipping = (priceCOP, departmentName) => {
  if (priceCOP >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }
  const dep = COLOMBIAN_LOCATIONS.find(d => d.department === departmentName);
  return dep ? dep.shippingCost : 18000;
};
