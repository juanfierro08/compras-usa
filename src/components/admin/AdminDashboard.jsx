import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatCOP } from '../../utils/formatters';
import { uploadToCloudinary, getOptimizedImageUrl } from '../../utils/cloudinary';
import { STORE_CONFIG } from '../../utils/whatsapp';
import { 
  Plus, Edit2, Trash2, Copy, LogOut, ArrowLeft, 
  Search, Upload, X, Check, Lock, Mail, MessageCircle, AlertCircle,
  Image as ImageIcon, Layers, Sparkles, RefreshCw
} from 'lucide-react';

export const AdminDashboard = () => {
  const { 
    adminUser, isAdmin, loginAdmin, logoutAdmin, resetAdminPassword,
    checkSessionExpiration, sessionExpiredMessage, setSessionExpiredMessage, SESSION_DURATION_MS,
    products, createProduct, editProduct, removeProduct, duplicateProduct,
    categories, updateCategory, whatsappNumber, updateWhatsAppNumber,
    storeConfig, updateStoreConfig, navigateTo, showToast 
  } = useShop();

  // Estados de Auth
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Estados del Dashboard: 'products' | 'categories' | 'store'
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Estados del Formulario de Producto (Optimizado para móvil)
  const [formData, setFormData] = useState({
    nombre: '',
    marca: '',
    categoria: 'ropa',
    subcategoria: 'Hombre',
    precio: '',
    precioOriginal: '',
    descripcion: '',
    variantesText: '', // Ingreso por comas: S, M, L o 50ml, 100ml
    disponible: true,
    destacado: false,
    imagenes: []
  });

  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  // Verificación de variables de entorno de Cloudinary
  const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const cloudinaryUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const missingCloudinaryEnv = [];
  if (!cloudinaryCloudName || !cloudinaryCloudName.trim()) missingCloudinaryEnv.push('VITE_CLOUDINARY_CLOUD_NAME');
  if (!cloudinaryUploadPreset || !cloudinaryUploadPreset.trim()) missingCloudinaryEnv.push('VITE_CLOUDINARY_UPLOAD_PRESET');

  // 5 y 6. Verificación de sesión al montar el panel
  useEffect(() => {
    if (!isAdmin) return;
    checkSessionExpiration();
  }, [isAdmin, SESSION_DURATION_MS]);

  // Cierre manual de sesión: limpia memoria y localStorage
  const handleManualLogout = async () => {
    setFormData({
      nombre: '',
      marca: '',
      categoria: categories[0]?.id || 'ropa',
      subcategoria: 'General',
      precio: '',
      precioOriginal: '',
      descripcion: '',
      variantesText: '',
      disponible: true,
      destacado: false,
      imagenes: []
    });
    setEditingProduct(null);
    setIsModalOpen(false);
    setAuthEmail('');
    setAuthPassword('');
    setAuthError('');
    await logoutAdmin(false);
  };

  // Login de Administrador
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setSessionExpiredMessage('');
    setAuthSubmitting(true);
    try {
      await loginAdmin(authEmail.trim(), authPassword);
      showToast('Sesión de administrador iniciada', 'success');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setAuthError('Correo o contraseña incorrectos.');
      } else {
        setAuthError(err.message || 'Error al iniciar sesión.');
      }
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!authEmail) {
      setAuthError('Ingresa tu correo para enviarte el enlace de recuperación.');
      return;
    }
    setAuthSubmitting(true);
    try {
      await resetAdminPassword(authEmail.trim());
      showToast('Enlace de recuperación enviado a tu correo.', 'success');
      setIsResettingPassword(false);
    } catch (err) {
      setAuthError(err.message || 'Error al enviar enlace.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Apertura de Modal para Crear / Editar
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setUploadError('');
    setFormData({
      nombre: '',
      marca: '',
      categoria: categories[0]?.id || 'ropa',
      subcategoria: 'General',
      precio: '',
      precioOriginal: '',
      descripcion: '',
      variantesText: '',
      disponible: true,
      destacado: false,
      imagenes: []
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setUploadError('');
    const variants = p.variantes || p.sizes || [];
    setFormData({
      nombre: p.nombre || p.name || '',
      marca: p.marca || p.brand || '',
      categoria: p.categoria || p.category || 'ropa',
      subcategoria: p.subcategoria || p.subcategory || 'General',
      precio: p.precio || p.priceCOP || '',
      precioOriginal: p.precioOriginal || p.originalPriceCOP || '',
      descripcion: p.descripcion || p.description || '',
      variantesText: variants.join(', '),
      disponible: p.disponible !== false,
      destacado: !!p.destacado,
      imagenes: p.imagenes || p.images || []
    });
    setIsModalOpen(true);
  };

  // Subida múltiple de fotos a Cloudinary desde el navegador con compresión en canvas
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImages(true);
    setUploadProgress(10);
    setUploadError('');

    try {
      const uploadedUrls = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await uploadToCloudinary(file, (percent) => {
          setUploadProgress(Math.round(((i + percent / 100) / files.length) * 100));
        });
        uploadedUrls.push(url);
      }

      setFormData(prev => ({
        ...prev,
        imagenes: [...prev.imagenes, ...uploadedUrls]
      }));
      showToast(`${uploadedUrls.length} imagen(es) subida(s) exitosamente`, 'success');
    } catch (err) {
      console.error(err);
      setUploadError(err.message);
      showToast(err.message, 'error');
    } finally {
      setUploadingImages(false);
      setUploadProgress(0);
      e.target.value = null;
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleMoveImage = (fromIndex, toIndex) => {
    setFormData(prev => {
      const updated = [...prev.imagenes];
      const item = updated.splice(fromIndex, 1)[0];
      updated.splice(toIndex, 0, item);
      return { ...prev, imagenes: updated };
    });
  };

  // Guardado de Producto (con protección total contra pérdida de datos por expiración)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.precio) {
      showToast('El nombre y el precio en COP son obligatorios', 'info');
      return;
    }

    // 7. Si hay un guardado de producto en curso cuando expira, no perder datos
    const expired = await checkSessionExpiration();
    if (expired) {
      showToast('Tu sesión expiró. Inicia sesión de nuevo para guardar.', 'error');
      // No cerramos el modal ni borramos formData
      return;
    }

    const variantesArray = formData.variantesText
      ? formData.variantesText.split(',').map(v => v.trim()).filter(Boolean)
      : [];

    const productPayload = {
      nombre: formData.nombre.trim(),
      marca: formData.marca.trim(),
      categoria: formData.categoria,
      subcategoria: formData.subcategoria.trim(),
      precio: Number(formData.precio),
      precioOriginal: formData.precioOriginal ? Number(formData.precioOriginal) : null,
      descripcion: formData.descripcion.trim(),
      variantes: variantesArray,
      disponible: formData.disponible,
      destacado: formData.destacado,
      imagenes: formData.imagenes
    };

    try {
      if (editingProduct) {
        await editProduct(editingProduct.id, productPayload);
      } else {
        await createProduct(productPayload);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error al guardar producto:', err);
      if (err.code === 'permission-denied') {
        await logoutAdmin(true);
        showToast('Tu sesión expiró. Inicia sesión de nuevo para guardar tus cambios.', 'error');
      } else {
        showToast('Error al guardar producto: ' + err.message, 'error');
      }
      // Nota: No cerramos el modal ni limpiamos formData para evitar pérdida de datos
    }
  };

  // Configuración de WhatsApp
  const [tempPhone, setTempPhone] = useState(whatsappNumber || STORE_CONFIG.whatsappNumber);

  const handleSaveWhatsApp = (e) => {
    e.preventDefault();
    updateWhatsAppNumber(tempPhone);
    showToast('Número de WhatsApp actualizado a +57 ' + tempPhone, 'success');
  };

  // Gestión de Fotos de Portada de Categorías (Colección "categorias" en Firestore)
  const [uploadingCategory, setUploadingCategory] = useState(null);
  const [categoryUploadProgress, setCategoryUploadProgress] = useState(0);

  const handleCategoryPhotoUpload = async (categoryId, file) => {
    if (!file) return;
    setUploadingCategory(categoryId);
    setCategoryUploadProgress(10);
    try {
      const url = await uploadToCloudinary(file, (pct) => setCategoryUploadProgress(pct));
      await updateCategory(categoryId, { image: url });
      showToast('Foto de portada de categoría actualizada', 'success');
    } catch (err) {
      showToast('Error al subir foto: ' + err.message, 'error');
    } finally {
      setUploadingCategory(null);
      setCategoryUploadProgress(0);
    }
  };

  const handleRemoveCategoryPhoto = async (categoryId) => {
    if (confirm('¿Quitar la foto de portada de esta categoría? Se volverá a mostrar el bloque de color elegante.')) {
      try {
        await updateCategory(categoryId, { image: null });
        showToast('Foto de categoría retirada', 'info');
      } catch (err) {
        showToast('Error: ' + err.message, 'error');
      }
    }
  };

  // Gestión de Portada Hero (Colección "configuracion/tienda" en Firestore)
  const [uploadingHero, setUploadingHero] = useState(false);
  const [heroUploadProgress, setHeroUploadProgress] = useState(0);
  const [heroTitle, setHeroTitle] = useState(storeConfig?.heroTitle || 'Productos Originales de Estados Unidos');
  const [heroTagline, setHeroTagline] = useState(storeConfig?.heroTagline || 'Importados a Colombia');
  const [heroSubtitle, setHeroSubtitle] = useState(storeConfig?.heroSubtitle || 'Pedidos y asesoría personalizada directa por WhatsApp.');

  const handleHeroPhotoUpload = async (file) => {
    if (!file) return;
    setUploadingHero(true);
    setHeroUploadProgress(10);
    try {
      const url = await uploadToCloudinary(file, (pct) => setHeroUploadProgress(pct));
      await updateStoreConfig({ heroImage: url });
      showToast('Foto de portada Hero actualizada con éxito', 'success');
    } catch (err) {
      showToast('Error al subir foto de portada: ' + err.message, 'error');
    } finally {
      setUploadingHero(false);
      setHeroUploadProgress(0);
    }
  };

  const handleRemoveHeroPhoto = async () => {
    if (confirm('¿Quitar la foto de portada del Hero y volver al fondo Azul Noche (#0F1B2D)?')) {
      try {
        await updateStoreConfig({ heroImage: null });
        showToast('Foto de portada retirada', 'info');
      } catch (err) {
        showToast('Error: ' + err.message, 'error');
      }
    }
  };

  const handleSaveStoreTexts = async (e) => {
    e.preventDefault();
    await updateStoreConfig({
      heroTitle: heroTitle.trim(),
      heroTagline: heroTagline.trim(),
      heroSubtitle: heroSubtitle.trim()
    });
  };

  // PANTALLA 1: LOGIN DE ADMINISTRADOR (Si no hay sesión iniciada)
  if (!isAdmin) {
    return (
      <div className="py-20 sm:py-32 max-w-md mx-auto px-4 sm:px-6">
        <div className="border border-[#0F1B2D]/20 bg-[#FAF7F2] shadow-lifted relative overflow-hidden">
          <div className="h-1.5 bg-[#0F1B2D] w-full" />
          
          <div className="p-8 sm:p-10">
            <button
              onClick={() => navigateTo('home')}
              className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.16em] uppercase text-[#0F1B2D]/70 hover:text-[#0F1B2D] mb-8 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#B08D57]" />
              <span>Volver a la Tienda</span>
            </button>

            <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-1">
              Área Restringida
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#0F1B2D] font-normal mb-2">
              Panel de Administración
            </h1>
            <p className="text-xs font-serif text-[#161616]/65 mb-6 leading-relaxed">
              Acceso seguro con credenciales de Firebase Authentication.
            </p>

            {(sessionExpiredMessage || authError) && (
              <div className="p-3.5 mb-5 border border-amber-400 bg-amber-50/90 text-amber-900 text-xs font-serif flex items-start gap-2.5 shadow-sm">
                <AlertCircle className="w-4 h-4 text-[#B08D57] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-medium text-[#0F1B2D]">
                    {sessionExpiredMessage || authError}
                  </div>
                  {sessionExpiredMessage && (
                    <div className="text-[11px] text-[#161616]/75">
                      Por seguridad, la sesión expira exactamente 1 hora después de haber iniciado sesión.
                    </div>
                  )}
                </div>
              </div>
            )}

            {isModalOpen && formData.nombre && (
              <div className="p-3 mb-5 border border-[#B08D57]/40 bg-[#F3EFE8] text-[#0F1B2D] text-xs font-serif shadow-subtle flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#B08D57] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#0F1B2D]">Borrador conservado:</span> Estás editando "{formData.nombre}". Inicia sesión de nuevo para guardar tus cambios sin perder información.
                </div>
              </div>
            )}

            {!isResettingPassword ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#0F1B2D]/80 block mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="admin@desdeelextranjerohaciati.com"
                    className="w-full p-3 bg-[#F3EFE8] border border-[#E5DFD7] text-xs font-sans text-[#161616] focus:outline-none focus:border-[#0F1B2D]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#0F1B2D]/80 block mb-1">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-3 bg-[#F3EFE8] border border-[#E5DFD7] text-xs font-sans text-[#161616] focus:outline-none focus:border-[#0F1B2D]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={authSubmitting}
                    className="w-full py-3.5 bg-[#0F1B2D] text-[#FAF7F2] text-xs font-sans tracking-[0.2em] uppercase hover:bg-[#16263D] border border-[#B08D57]/30 transition-luxury disabled:opacity-60 shadow-lifted"
                  >
                    {authSubmitting ? 'Verificando...' : 'Entrar al Panel'}
                  </button>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setIsResettingPassword(true)}
                    className="text-[11px] font-sans text-[#B08D57] hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#0F1B2D]/80 block mb-1">
                    Ingresa tu Correo
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="admin@correo.com"
                    className="w-full p-3 bg-[#F3EFE8] border border-[#E5DFD7] text-xs font-sans text-[#161616] focus:outline-none focus:border-[#0F1B2D]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="w-full py-3 bg-[#0F1B2D] text-[#FAF7F2] text-xs font-sans tracking-[0.18em] uppercase hover:bg-[#16263D] border border-[#B08D57]/30"
                >
                  Enviar Enlace de Restablecimiento
                </button>

                <button
                  type="button"
                  onClick={() => setIsResettingPassword(false)}
                  className="w-full py-2 text-[11px] font-sans text-[#161616]/60 hover:text-[#161616]"
                >
                  Volver al Inicio de Sesión
                </button>
              </form>
            )}

          </div>
        </div>
      </div>
    );
  }

  // PANTALLA 2: PANEL DE ADMINISTRADOR AUTENTICADO
  const filteredProducts = products.filter(p => {
    const q = searchTerm.toLowerCase();
    const name = (p.nombre || p.name || '').toLowerCase();
    const brand = (p.marca || p.brand || '').toLowerCase();
    const cat = (p.categoria || p.category || '').toLowerCase();
    return name.includes(q) || brand.includes(q) || cat.includes(q);
  });

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-8">
      
      {/* Cabecera del Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E5DFD7] mb-8 gap-4">
        <div>
          <button
            onClick={() => navigateTo('home')}
            className="inline-flex items-center gap-1.5 text-xs font-sans tracking-[0.16em] uppercase text-[#161616]/60 hover:text-[#161616] mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ver Catálogo Público</span>
          </button>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#161616]">
            Gestión del Catálogo
          </h1>
          <span className="text-[11px] font-sans text-[#B08D57]">
            Sesión: {adminUser?.email}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 border text-xs font-sans tracking-[0.14em] uppercase transition-luxury ${
              activeTab === 'products'
                ? 'bg-[#0F1B2D] text-[#FAF7F2] border-[#0F1B2D] shadow-sm'
                : 'bg-[#FAF7F2] text-[#161616] border-[#E5DFD7] hover:border-[#0F1B2D]'
            }`}
          >
            Productos ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 border text-xs font-sans tracking-[0.14em] uppercase transition-luxury ${
              activeTab === 'categories'
                ? 'bg-[#0F1B2D] text-[#FAF7F2] border-[#0F1B2D] shadow-sm'
                : 'bg-[#FAF7F2] text-[#161616] border-[#E5DFD7] hover:border-[#0F1B2D]'
            }`}
          >
            Categorías ({categories.length})
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={`px-4 py-2 border text-xs font-sans tracking-[0.14em] uppercase transition-luxury ${
              activeTab === 'store'
                ? 'bg-[#0F1B2D] text-[#FAF7F2] border-[#0F1B2D] shadow-sm'
                : 'bg-[#FAF7F2] text-[#161616] border-[#E5DFD7] hover:border-[#0F1B2D]'
            }`}
          >
            Tienda & Hero
          </button>

          <button
            onClick={handleManualLogout}
            className="p-2 border border-[#E5DFD7] text-[#161616]/60 hover:text-rose-600 transition-colors ml-1"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PESTAÑA: CATEGORÍAS & FOTOS DE PORTADA */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="border border-[#0F1B2D]/20 p-6 sm:p-8 bg-[#FAF7F2] shadow-sm">
            <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-1">
              Colecciones Curadas
            </span>
            <h2 className="font-serif text-2xl text-[#0F1B2D] font-normal mb-2">
              Portadas de Categorías
            </h2>
            <p className="text-xs font-serif text-[#161616]/70 max-w-2xl leading-relaxed">
              Sube o cambia la fotografía de portada de cada categoría. Se guarda directamente en la colección <code className="bg-[#F3EFE8] px-1 py-0.5 border border-[#E5DFD7] text-[11px] font-mono text-[#0F1B2D]">categorias</code> de Firestore y se sincroniza en tiempo real en la tienda. Sin foto, se muestra el bloque de color exclusivo con textura sutil.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const isUploading = uploadingCategory === cat.id;
              const hasCustomPhoto = !!cat.image;

              return (
                <div key={cat.id} className="border border-[#E5DFD7] bg-[#FAF7F2] flex flex-col justify-between overflow-hidden shadow-sm">
                  {/* Vista previa de la portada */}
                  <div className="relative h-48 w-full overflow-hidden bg-stone-900">
                    {hasCustomPhoto ? (
                      <>
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <span className="absolute top-3 right-3 bg-[#0F1B2D]/90 text-[#FAF7F2] text-[9px] uppercase tracking-wider px-2 py-0.5 border border-[#B08D57]/40">
                          Foto Activa
                        </span>
                      </>
                    ) : (
                      <div 
                        className="w-full h-full relative p-4 flex flex-col justify-between text-[#FAF7F2]"
                        style={{
                          background: cat.gradient || cat.colorBlock || 'linear-gradient(135deg, #0F1B2D 0%, #070D17 100%)'
                        }}
                      >
                        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
                          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)',
                          backgroundSize: '16px 16px'
                        }} />
                        <span className="relative z-10 self-start text-[9px] uppercase tracking-widest text-[#B08D57] bg-black/40 px-2 py-0.5 border border-[#B08D57]/30">
                          Bloque de Color Elegante
                        </span>
                        <div className="relative z-10">
                          <span className="text-[10px] text-[#FAF7F2]/60 uppercase tracking-widest block font-sans">
                            Sin foto cargada
                          </span>
                          <h4 className="font-serif text-lg text-[#FAF7F2]">{cat.name}</h4>
                        </div>
                      </div>
                    )}

                    {hasCustomPhoto && (
                      <div className="absolute bottom-3 left-3 right-3 text-[#FAF7F2]">
                        <span className="text-[10px] text-[#B08D57] uppercase tracking-widest block font-sans">
                          {cat.tagline || 'Colección Original'}
                        </span>
                        <h4 className="font-serif text-lg text-[#FAF7F2]">{cat.name}</h4>
                      </div>
                    )}
                  </div>

                  {/* Acciones de Foto */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-serif text-sm font-medium text-[#0F1B2D]">{cat.name}</span>
                        <span className="text-[10px] font-mono text-[#B08D57]">{cat.id}</span>
                      </div>
                      <p className="text-[11px] font-serif text-[#161616]/65 line-clamp-2">
                        {cat.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {cat.subcategories?.map(sub => (
                          <span key={sub} className="text-[9px] font-sans px-1.5 py-0.5 bg-[#F3EFE8] text-[#161616]/70 border border-[#E5DFD7]">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Botón de Subida */}
                    <div className="pt-3 border-t border-[#E5DFD7] space-y-2">
                      <label className={`w-full py-2.5 px-4 text-xs font-sans tracking-[0.14em] uppercase transition-luxury cursor-pointer flex items-center justify-center gap-2 text-center ${
                        isUploading 
                          ? 'bg-[#0F1B2D]/40 text-[#FAF7F2] pointer-events-none' 
                          : 'bg-[#0F1B2D] text-[#FAF7F2] hover:bg-[#16263D] border border-[#B08D57]/30'
                      }`}>
                        <Upload className="w-3.5 h-3.5 text-[#B08D57]" />
                        <span>
                          {isUploading 
                            ? `Subiendo a Cloudinary (${categoryUploadProgress}%)...` 
                            : (hasCustomPhoto ? 'Cambiar Foto de Portada' : 'Subir Foto de Portada')}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploading}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleCategoryPhotoUpload(cat.id, file);
                            e.target.value = null;
                          }}
                        />
                      </label>

                      {hasCustomPhoto && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCategoryPhoto(cat.id)}
                          className="w-full py-2 text-[10px] font-sans tracking-[0.14em] uppercase text-rose-700 hover:text-rose-900 hover:bg-rose-50 border border-rose-200/60 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Quitar Foto (Restaurar Color)</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PESTAÑA: TIENDA & HERO BANNER */}
      {activeTab === 'store' && (
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Portada Hero Principal */}
          <div className="border border-[#0F1B2D]/20 p-6 sm:p-8 bg-[#FAF7F2] shadow-lifted space-y-6">
            <div>
              <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-1">
                Portada Principal
              </span>
              <h3 className="font-serif text-2xl text-[#0F1B2D] font-normal">
                Imagen de Fondo del Hero
              </h3>
              <p className="text-xs font-serif text-[#161616]/65 mt-1 leading-relaxed">
                Sube una fotografía de portada para el hero del inicio. Se almacena en Cloudinary y en la colección <code className="bg-[#F3EFE8] px-1 py-0.5 border border-[#E5DFD7] text-[11px] font-mono text-[#0F1B2D]">configuracion/tienda</code> de Firestore. Si no hay imagen, se muestra el bloque sólido Azul Noche (#0F1B2D).
              </p>
            </div>

            {/* Preview del Hero */}
            <div className="relative h-56 w-full overflow-hidden border border-[#0F1B2D]/20">
              {storeConfig?.heroImage ? (
                <>
                  <img 
                    src={storeConfig.heroImage} 
                    alt="Hero Preview" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0F1B2D]/90 via-[#0F1B2D]/70 to-[#0F1B2D]/40" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-[#FAF7F2]">
                    <span className="text-[10px] uppercase tracking-widest text-[#B08D57] block mb-1 font-sans">
                      {heroTagline}
                    </span>
                    <h4 className="font-serif text-xl sm:text-2xl text-[#FAF7F2]">
                      {heroTitle}
                    </h4>
                  </div>
                  <span className="absolute top-3 right-3 bg-[#0F1B2D]/90 text-[#FAF7F2] text-[9px] uppercase tracking-wider px-2 py-0.5 border border-[#B08D57]/40">
                    Foto Hero Activa
                  </span>
                </>
              ) : (
                <div className="w-full h-full bg-[#0F1B2D] p-6 flex flex-col justify-end text-[#FAF7F2] relative">
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)',
                    backgroundSize: '20px 20px'
                  }} />
                  <span className="relative z-10 text-[9px] uppercase tracking-widest text-[#B08D57] bg-black/40 self-start px-2 py-0.5 border border-[#B08D57]/30 mb-auto">
                    Bloque Azul Noche (#0F1B2D) Activo
                  </span>
                  <div className="relative z-10">
                    <span className="text-[10px] uppercase tracking-widest text-[#B08D57] block mb-1 font-sans">
                      {heroTagline}
                    </span>
                    <h4 className="font-serif text-xl sm:text-2xl text-[#FAF7F2]">
                      {heroTitle}
                    </h4>
                  </div>
                </div>
              )}
            </div>

            {/* Controles de Subida Hero */}
            <div className="flex flex-col sm:flex-row gap-3">
              <label className={`flex-1 py-3 px-4 text-xs font-sans tracking-[0.16em] uppercase transition-luxury cursor-pointer flex items-center justify-center gap-2 text-center ${
                uploadingHero
                  ? 'bg-[#0F1B2D]/40 text-[#FAF7F2] pointer-events-none'
                  : 'bg-[#0F1B2D] text-[#FAF7F2] hover:bg-[#16263D] border border-[#B08D57]/30 shadow-lifted'
              }`}>
                <Upload className="w-3.5 h-3.5 text-[#B08D57]" />
                <span>
                  {uploadingHero
                    ? `Subiendo a Cloudinary (${heroUploadProgress}%)...`
                    : (storeConfig?.heroImage ? 'Cambiar Foto del Hero' : 'Subir Foto de Portada Hero')}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingHero}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleHeroPhotoUpload(file);
                    e.target.value = null;
                  }}
                />
              </label>

              {storeConfig?.heroImage && (
                <button
                  type="button"
                  onClick={handleRemoveHeroPhoto}
                  className="py-3 px-5 text-xs font-sans tracking-[0.16em] uppercase text-rose-700 hover:text-rose-900 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Quitar Foto</span>
                </button>
              )}
            </div>
          </div>

          {/* Textos del Hero */}
          <div className="border border-[#0F1B2D]/20 p-6 sm:p-8 bg-[#FAF7F2] shadow-lifted space-y-4">
            <div>
              <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-1">
                Mensajes Editoriales
              </span>
              <h3 className="font-serif text-xl text-[#0F1B2D] font-normal">
                Textos de la Portada Principal
              </h3>
              <p className="text-xs font-serif text-[#161616]/65 leading-relaxed">
                Mensajes claros y directos sobre importaciones desde Estados Unidos a Colombia.
              </p>
            </div>

            <form onSubmit={handleSaveStoreTexts} className="space-y-4 pt-2">
              <div>
                <label className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#0F1B2D]/80 block mb-1">
                  Etiqueta Superior
                </label>
                <input
                  type="text"
                  value={heroTagline}
                  onChange={(e) => setHeroTagline(e.target.value)}
                  className="w-full p-3 bg-[#F3EFE8] border border-[#E5DFD7] text-xs font-sans text-[#161616] focus:outline-none focus:border-[#0F1B2D]"
                />
              </div>

              <div>
                <label className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#0F1B2D]/80 block mb-1">
                  Título Principal (Serif)
                </label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full p-3 bg-[#F3EFE8] border border-[#E5DFD7] text-xs font-serif text-[#161616] focus:outline-none focus:border-[#0F1B2D]"
                />
              </div>

              <div>
                <label className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#0F1B2D]/80 block mb-1">
                  Subtítulo Descriptivo
                </label>
                <textarea
                  rows="2"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="w-full p-3 bg-[#F3EFE8] border border-[#E5DFD7] text-xs font-serif text-[#161616] focus:outline-none focus:border-[#0F1B2D]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0F1B2D] text-[#FAF7F2] text-xs font-sans tracking-[0.18em] uppercase hover:bg-[#16263D] border border-[#B08D57]/30 transition-luxury"
              >
                Guardar Textos
              </button>
            </form>
          </div>

          {/* Línea WhatsApp */}
          <div className="border border-[#0F1B2D]/20 p-6 sm:p-8 bg-[#FAF7F2] shadow-lifted space-y-4">
            <div>
              <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-1">
                Línea Directa de Pedidos
              </span>
              <h3 className="font-serif text-xl text-[#0F1B2D] font-normal">
                Número de WhatsApp para Colombia
              </h3>
              <p className="text-xs font-serif text-[#161616]/65 leading-relaxed">
                Todos los botones "Pedir por WhatsApp" abrirán conversación directamente con esta línea.
              </p>
            </div>

            <form onSubmit={handleSaveWhatsApp} className="space-y-4 pt-2">
              <div>
                <label className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#0F1B2D]/80 block mb-1">
                  Número de Celular (10 dígitos, sin +57)
                </label>
                <div className="flex items-center">
                  <span className="p-3 bg-[#F3EFE8] border border-r-0 border-[#E5DFD7] text-xs font-mono text-[#0F1B2D] font-bold">
                    +57
                  </span>
                  <input
                    type="text"
                    required
                    value={tempPhone}
                    onChange={(e) => setTempPhone(e.target.value)}
                    className="w-full p-3 bg-[#F3EFE8] border border-[#E5DFD7] text-xs font-mono text-[#161616] focus:outline-none focus:border-[#0F1B2D]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0F1B2D] text-[#FAF7F2] text-xs font-sans tracking-[0.18em] uppercase hover:bg-[#16263D] border border-[#B08D57]/30 transition-luxury"
              >
                Guardar Número de WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PESTAÑA: PRODUCTOS */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          
          {/* Controles de la Tabla */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-[#B08D57] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, diseñador o categoría..."
                className="w-full pl-9 pr-3 py-2.5 bg-[#F3EFE8] border border-[#E5DFD7] text-xs font-sans text-[#161616] focus:outline-none focus:border-[#0F1B2D]"
              />
            </div>

            <button
              onClick={handleOpenCreate}
              className="px-6 py-3 bg-[#0F1B2D] text-[#FAF7F2] text-xs font-sans tracking-[0.18em] uppercase hover:bg-[#16263D] border border-[#B08D57]/30 flex items-center justify-center gap-2 shadow-lifted"
            >
              <Plus className="w-3.5 h-3.5 text-[#B08D57]" />
              <span>Nuevo Producto</span>
            </button>
          </div>

          {/* Tabla de Productos de Firestore */}
          <div className="border border-[#E5DFD7] overflow-hidden bg-[#FAF7F2]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#F3EFE8] text-[#161616]/70 uppercase tracking-[0.14em] text-[10px] border-b border-[#E5DFD7]">
                  <tr>
                    <th className="p-4">Pieza</th>
                    <th className="p-4">Colección</th>
                    <th className="p-4">Precio (COP)</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DFD7]">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(p => {
                      const name = p.nombre || p.name;
                      const brand = p.marca || p.brand;
                      const price = p.precio || p.priceCOP;
                      const images = p.imagenes || p.images || [];

                      return (
                        <tr key={p.id} className="hover:bg-[#F3EFE8]/50 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            {images[0] ? (
                              <img src={getOptimizedImageUrl(images[0], 120)} alt="" className="w-10 h-14 object-cover bg-stone-200 shrink-0" />
                            ) : (
                              <div className="w-10 h-14 bg-stone-200 shrink-0 flex items-center justify-center text-[9px] font-serif">
                                USA
                              </div>
                            )}
                            <div>
                              <div className="font-serif text-sm text-[#161616] font-medium">{name}</div>
                              <div className="text-[10px] text-[#B08D57] uppercase tracking-wider">{brand}</div>
                            </div>
                          </td>
                          <td className="p-4 text-[#161616]/70 font-serif">
                            {p.categoria || p.category} ({p.subcategoria || p.subcategory || 'General'})
                          </td>
                          <td className="p-4 font-serif font-medium text-[#161616]">
                            {formatCOP(price)}
                          </td>
                          <td className="p-4">
                            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 border ${
                              p.disponible !== false
                                ? 'border-[#B08D57]/40 text-[#0F1B2D] bg-[#F3EFE8]'
                                : 'border-stone-400 text-stone-600 bg-stone-100'
                            }`}>
                              {p.disponible !== false ? 'Disponible' : 'Agotado'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEdit(p)}
                                className="p-1.5 border border-[#E5DFD7] text-[#161616] hover:bg-[#161616] hover:text-[#FAF7F2] transition-colors"
                                title="Editar"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => duplicateProduct(p)}
                                className="p-1.5 border border-[#E5DFD7] text-[#161616] hover:bg-[#161616] hover:text-[#FAF7F2] transition-colors"
                                title="Duplicar"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`¿Eliminar ${name} del catálogo?`)) removeProduct(p.id);
                                }}
                                className="p-1.5 border border-[#E5DFD7] text-[#161616] hover:bg-rose-600 hover:text-white transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-xs font-serif text-[#161616]/60">
                        {products.length === 0
                          ? 'No hay productos en Firestore todavía. Pulsa "Nuevo Producto" para agregar el primero.'
                          : 'No se encontraron productos con la búsqueda.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAR / EDITAR PRODUCTO (Rápido y Mobile-First) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#161616]/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#FAF7F2] border border-[#E5DFD7] p-6 sm:p-8 shadow-lifted my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD7] mb-6">
              <h3 className="font-serif text-xl sm:text-2xl text-[#161616]">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto Importado de EE.UU.'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-[#161616]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              
              {/* Nombre */}
              <div>
                <label className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#161616]/70 block mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej. Tom Ford Oud Wood Eau de Parfum 50ml"
                  className="w-full p-3 bg-[#F3EFE8] border border-[#E5DFD7] text-xs font-sans text-[#161616] focus:outline-none"
                />
              </div>

              {/* Marca y Categoría */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#161616]/70 block mb-1">
                    Marca o Diseñador *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.marca}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    placeholder="Ej. Apple / Nike / Creed"
                    className="w-full p-3 bg-[#F3EFE8] border border-[#E5DFD7] text-xs font-sans text-[#161616] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#161616]/70 block mb-1">
                    Categoría *
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full p-3 bg-[#F3EFE8] border border-[#E5DFD7] text-xs font-sans text-[#161616] focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subcategoría y Precios */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#161616]/70 block mb-1">
                    Subcategoría
                  </label>
                  <input
                    type="text"
                    value={formData.subcategoria}
                    onChange={(e) => setFormData({ ...formData, subcategoria: e.target.value })}
                    placeholder="Ej. Calzado / Nicho"
                    className="w-full p-3 bg-[#F3EFE8] border border-[#E5DFD7] text-xs font-sans text-[#161616] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#161616]/70 block mb-1">
                    Precio en COP *
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    required
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    placeholder="1250000"
                    className="w-full p-3 bg-[#F3EFE8] border border-[#E5DFD7] text-xs font-mono text-[#161616] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#161616]/70 block mb-1">
                    Precio Tachado (Opcional)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={formData.precioOriginal}
                    onChange={(e) => setFormData({ ...formData, precioOriginal: e.target.value })}
                    placeholder="1450000"
                    className="w-full p-3 bg-[#F3EFE8] border border-[#E5DFD7] text-xs font-mono text-[#161616] focus:outline-none"
                  />
                </div>
              </div>

              {/* Variantes */}
              <div>
                <label className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#161616]/70 block mb-1">
                  Variantes o Tallas (Separadas por comas)
                </label>
                <input
                  type="text"
                  value={formData.variantesText}
                  onChange={(e) => setFormData({ ...formData, variantesText: e.target.value })}
                  placeholder="Ej. US 8, US 9, US 10 o 50ml, 100ml o 256GB, 512GB"
                  className="w-full p-3 bg-[#F3EFE8] border border-[#E5DFD7] text-xs font-sans text-[#161616] focus:outline-none"
                />
              </div>

              {/* Subida Múltiple de Fotos a Cloudinary */}
              <div className="space-y-3 pt-2 border-t border-[#E5DFD7]">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#161616]/70 block">
                    Fotografías del Producto (Cloudinary)
                  </label>
                  <span className="text-[10px] text-[#B08D57]">
                    {formData.imagenes.length} imagen(es)
                  </span>
                </div>

                {/* Aviso claro si faltan variables de entorno */}
                {missingCloudinaryEnv.length > 0 && (
                  <div className="p-3.5 border border-amber-300 bg-amber-50 text-amber-900 text-xs font-sans space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-950">
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>Configuración de Cloudinary incompleta</span>
                    </div>
                    <p>
                      Para habilitar la subida de fotos, debes definir en tu archivo <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">.env.local</code>:
                    </p>
                    <ul className="list-disc pl-5 font-mono text-[11px] space-y-0.5">
                      {missingCloudinaryEnv.map(envVar => (
                        <li key={envVar}>{envVar}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Banner de error detallado en pantalla al subir */}
                {uploadError && (
                  <div className="p-3.5 border border-rose-300 bg-rose-50 text-rose-900 text-xs font-sans space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-rose-950">
                      <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                      <span>Error al subir imagen a Cloudinary</span>
                    </div>
                    <p className="leading-relaxed">{uploadError}</p>
                  </div>
                )}

                {/* Botón de Selección de Archivos con Compresión */}
                <div className="relative border border-dashed border-[#B08D57] p-5 text-center bg-[#F3EFE8]/50">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImages}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <Upload className="w-5 h-5 text-[#B08D57]" />
                    <span className="text-xs font-sans uppercase tracking-wider text-[#161616]">
                      {uploadingImages ? `Subiendo a Cloudinary (${uploadProgress}%)...` : 'Toca para seleccionar fotos desde tu celular o PC'}
                    </span>
                    <span className="text-[10px] text-[#161616]/50">
                      Se comprimen automáticamente antes de subir para ahorrar datos.
                    </span>
                  </div>
                </div>

                {/* Previsualización y Reordenamiento de Fotos */}
                {formData.imagenes.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                    {formData.imagenes.map((url, idx) => (
                      <div key={idx} className="relative group aspect-product bg-stone-200 border border-[#E5DFD7] overflow-hidden">
                        <img src={getOptimizedImageUrl(url, 200)} alt="" className="w-full h-full object-cover" />
                        <div className="absolute top-1 right-1 flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1 bg-[#161616] text-[#FAF7F2] text-[10px]"
                            title="Quitar"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-[#161616] text-[#FAF7F2] text-[8px] uppercase tracking-wider px-1">
                            Principal
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#161616]/70 block mb-1">
                  Descripción Detallada
                </label>
                <textarea
                  rows="3"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Detalles sobre materiales, origen de compra en EE.UU., garantía..."
                  className="w-full p-3 bg-[#F3EFE8] border border-[#E5DFD7] text-xs font-sans text-[#161616] focus:outline-none"
                ></textarea>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-[#161616]">
                  <input
                    type="checkbox"
                    checked={formData.disponible}
                    onChange={(e) => setFormData({ ...formData, disponible: e.target.checked })}
                    className="accent-[#0F1B2D] w-4 h-4"
                  />
                  <span>Producto Disponible</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-[#161616]">
                  <input
                    type="checkbox"
                    checked={formData.destacado}
                    onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
                    className="accent-[#0F1B2D] w-4 h-4"
                  />
                  <span>Destacar en Inicio</span>
                </label>
              </div>

              {/* Botones del Modal */}
              <div className="pt-6 border-t border-[#E5DFD7] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 border border-[#E5DFD7] text-xs font-sans tracking-[0.16em] uppercase text-[#161616] hover:border-[#0F1B2D]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploadingImages}
                  className="px-6 py-3 bg-[#0F1B2D] text-[#FAF7F2] text-xs font-sans tracking-[0.18em] uppercase hover:bg-[#16263D] border border-[#B08D57]/30 transition-luxury disabled:opacity-60 shadow-lifted"
                >
                  Guardar en Firestore
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
