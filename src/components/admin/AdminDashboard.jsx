import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatCOP } from '../../utils/formatters';
import { uploadToCloudinary, getOptimizedImageUrl } from '../../utils/cloudinary';
import { STORE_CONFIG } from '../../utils/whatsapp';
import { 
  Plus, Edit2, Trash2, Copy, LogOut, ArrowLeft, 
  Search, Upload, X, Check, Lock, Mail, MessageCircle, AlertCircle 
} from 'lucide-react';

export const AdminDashboard = () => {
  const { 
    adminUser, isAdmin, loginAdmin, logoutAdmin, resetAdminPassword,
    products, createProduct, editProduct, removeProduct, duplicateProduct,
    categories, whatsappNumber, updateWhatsAppNumber, navigateTo, showToast 
  } = useShop();

  // Estados de Auth
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Estados del Dashboard
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'whatsapp'
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

  // Login de Administrador
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
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
      showToast('Error al subir a Cloudinary: ' + err.message, 'error');
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

  // Guardado de Producto
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.precio) {
      showToast('El nombre y el precio en COP son obligatorios', 'info');
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
      // Error manejado en context
    }
  };

  // Configuración de WhatsApp
  const [tempPhone, setTempPhone] = useState(whatsappNumber || STORE_CONFIG.whatsappNumber);

  const handleSaveWhatsApp = (e) => {
    e.preventDefault();
    updateWhatsAppNumber(tempPhone);
    showToast('Número de WhatsApp actualizado a +57 ' + tempPhone, 'success');
  };

  // PANTALLA 1: LOGIN DE ADMINISTRADOR (Si no hay sesión iniciada)
  if (!isAdmin) {
    return (
      <div className="py-20 sm:py-32 max-w-md mx-auto px-4 sm:px-6">
        <div className="border border-[#E5DFD7] p-8 sm:p-10 bg-[#FAF7F2] shadow-lifted">
          
          <button
            onClick={() => navigateTo('home')}
            className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.16em] uppercase text-[#161616]/60 hover:text-[#161616] mb-8 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la Tienda</span>
          </button>

          <span className="text-[10px] font-sans tracking-[0.24em] text-[#B08D57] uppercase block mb-1">
            Área Restringida
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#161616] font-normal mb-2">
            Panel de Administración
          </h1>
          <p className="text-xs font-serif text-[#161616]/60 mb-6 leading-relaxed">
            Acceso exclusivo con credenciales de Firebase Authentication.
          </p>

          {authError && (
            <div className="p-3 mb-5 border border-rose-300 bg-rose-50/50 text-rose-800 text-xs font-sans">
              {authError}
            </div>
          )}

          {!isResettingPassword ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#161616]/70 block mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="admin@desdeelextranjerohaciati.com"
                  className="w-full p-3 bg-[#F3EFE8] border border-[#E5DFD7] text-xs font-sans text-[#161616] focus:outline-none focus:border-[#161616]"
                />
              </div>

              <div>
                <label className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#161616]/70 block mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 bg-[#F3EFE8] border border-[#E5DFD7] text-xs font-sans text-[#161616] focus:outline-none focus:border-[#161616]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="w-full py-3.5 bg-[#161616] text-[#FAF7F2] text-xs font-sans tracking-[0.2em] uppercase hover:bg-[#282828] transition-luxury disabled:opacity-60"
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
                <label className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#161616]/70 block mb-1">
                  Ingresa tu Correo
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="admin@correo.com"
                  className="w-full p-3 bg-[#F3EFE8] border border-[#E5DFD7] text-xs font-sans text-[#161616] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full py-3 bg-[#161616] text-[#FAF7F2] text-xs font-sans tracking-[0.18em] uppercase hover:bg-[#282828]"
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

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab(activeTab === 'products' ? 'whatsapp' : 'products')}
            className="px-4 py-2 border border-[#E5DFD7] text-xs font-sans tracking-[0.14em] uppercase text-[#161616] hover:border-[#161616]"
          >
            {activeTab === 'products' ? 'Línea WhatsApp' : 'Ver Productos'}
          </button>

          <button
            onClick={logoutAdmin}
            className="p-2 border border-[#E5DFD7] text-[#161616]/60 hover:text-rose-600 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PESTAÑA: CONFIGURAR WHATSAPP */}
      {activeTab === 'whatsapp' && (
        <div className="max-w-md mx-auto p-8 border border-[#E5DFD7] bg-[#FAF7F2] space-y-6 shadow-lifted">
          <div className="space-y-1">
            <span className="text-[10px] font-sans tracking-[0.2em] text-[#B08D57] uppercase block">
              Línea Directa de Pedidos
            </span>
            <h3 className="font-serif text-xl text-[#161616]">
              Número de WhatsApp para Colombia
            </h3>
            <p className="text-xs font-serif text-[#161616]/60">
              Todos los botones "Pedir por WhatsApp" abrirán conversación con este número.
            </p>
          </div>

          <form onSubmit={handleSaveWhatsApp} className="space-y-4">
            <div>
              <label className="text-[11px] font-sans tracking-[0.14em] uppercase text-[#161616]/70 block mb-1">
                Número de Celular (10 dígitos, sin +57)
              </label>
              <div className="flex items-center">
                <span className="p-3 bg-[#F3EFE8] border border-r-0 border-[#E5DFD7] text-xs font-mono text-[#161616]">
                  +57
                </span>
                <input
                  type="text"
                  required
                  value={tempPhone}
                  onChange={(e) => setTempPhone(e.target.value)}
                  className="w-full p-3 bg-[#F3EFE8] border border-[#E5DFD7] text-xs font-mono text-[#161616] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#161616] text-[#FAF7F2] text-xs font-sans tracking-[0.18em] uppercase hover:bg-[#282828]"
            >
              Guardar Número
            </button>
          </form>
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
                className="w-full pl-9 pr-3 py-2.5 bg-[#F3EFE8] border border-[#E5DFD7] text-xs font-sans text-[#161616] focus:outline-none focus:border-[#161616]"
              />
            </div>

            <button
              onClick={handleOpenCreate}
              className="px-6 py-3 bg-[#161616] text-[#FAF7F2] text-xs font-sans tracking-[0.18em] uppercase hover:bg-[#282828] flex items-center justify-center gap-2 shadow-lifted"
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
                                ? 'border-emerald-600/30 text-emerald-800 bg-emerald-50'
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
                    className="accent-[#161616] w-4 h-4"
                  />
                  <span>Producto Disponible</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-[#161616]">
                  <input
                    type="checkbox"
                    checked={formData.destacado}
                    onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
                    className="accent-[#161616] w-4 h-4"
                  />
                  <span>Destacar en Inicio</span>
                </label>
              </div>

              {/* Botones del Modal */}
              <div className="pt-6 border-t border-[#E5DFD7] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 border border-[#E5DFD7] text-xs font-sans tracking-[0.16em] uppercase text-[#161616]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploadingImages}
                  className="px-6 py-3 bg-[#161616] text-[#FAF7F2] text-xs font-sans tracking-[0.18em] uppercase hover:bg-[#282828] transition-luxury disabled:opacity-60"
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
