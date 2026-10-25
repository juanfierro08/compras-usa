# Desde el Extranjero Hacia Ti — Catálogo Web Editorial

Catálogo web editorial y boutique para importación de productos 100% auténticos desde Estados Unidos (Miami & Nueva York) hacia Colombia con atención y pedidos directos vía WhatsApp.

## Características Principales

- **Arquitectura de Catálogo Directo:** Sin carritos de compra ni pasarelas impersonales. Cada producto cuenta con un botón "Me interesa / Pedir por WhatsApp" con mensaje prellenado automático:
  > *"Hola, me interesa [nombre del producto] ([talla/color]) que vi en la tienda. Link: [URL]"*
- **Moneda:** Precios en pesos colombianos (COP) formateados `$1.250.000` con aranceles e impuestos DIAN incluidos.
- **5 Categorías Principales:** Ropa & Calzado, Tecnología, Salud & Bienestar (con aviso médico obligatorio), Lociones & Perfumes Hombre, y Lociones & Perfumes Mujer.
- **Estética Quiet Luxury:** Paleta crema cálido (`#FAF7F2`), carbón (`#161616`), detalles en oro champán (`#B08D57`), líneas finas y tipografía editorial serif (*Playfair Display*, *Cormorant Garamond*) combinada con sans-serif (*Inter*).
- **Backend Serverless Gratuito:**
  - **Firebase Authentication:** Acceso seguro al panel de administración `/admin`.
  - **Firebase Firestore:** Catálogo reactivo en tiempo real sin costos de base de datos.
  - **Cloudinary:** Subida de imágenes desde el navegador con compresión en canvas previa (máx. 1600px en WebP) y transformaciones dinámicas de entrega rápida.
- **Panel de Administrador (`/admin`):** Gestión de productos, subida múltiple de fotos, duplicación, marcas de agotado/destacado y ajuste de número de WhatsApp.
- **100% Responsive:** Diseñado con enfoque mobile-first (320px hasta ultrawide), zonas táctiles >= 44px y cero desbordamiento horizontal.

## Variables de Entorno

Crea un archivo `.env.local` basado en `.env.example`:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id

VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=tu_upload_preset_unsigned
```

## Instalación y Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

## Despliegue en Vercel

El proyecto incluye el archivo `vercel.json` para manejo de rutas de SPA. Solo importa el repositorio en Vercel y añade las variables de entorno de Firebase y Cloudinary.
