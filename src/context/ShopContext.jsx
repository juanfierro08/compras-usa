import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection, onSnapshot, doc, addDoc, updateDoc,
  deleteDoc, query, orderBy, serverTimestamp, setDoc, getDoc
} from 'firebase/firestore';
import {
  onAuthStateChanged, signInWithEmailAndPassword,
  signOut, sendPasswordResetEmail,
  setPersistence, browserLocalPersistence
} from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { DEFAULT_CATEGORIES } from '../data/categories';
import { STORE_CONFIG } from '../utils/whatsapp';

// Duración de la sesión de administrador: 1 hora oficial (60 * 60 * 1000 ms)
export const SESSION_DURATION_MS = 60 * 60 * 1000;

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // 1. Estado de Autenticación de Administrador (Firebase Auth)
  const [adminUser, setAdminUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState('');

  // Persistencia de sesión en navegador (browserLocalPersistence)
  useEffect(() => {
    if (auth) {
      setPersistence(auth, browserLocalPersistence).catch((err) => {
        console.warn('Error configurando persistencia de Firebase:', err);
      });
    }
  }, []);

  // Función para verificar si la sesión expiró según "adminLoginAt"
  const checkSessionExpiration = async () => {
    if (!auth.currentUser && !adminUser) return false;
    const loginAtStr = localStorage.getItem('adminLoginAt');
    const loginAt = loginAtStr ? parseInt(loginAtStr, 10) : null;
    const now = Date.now();

    // Solo expira si ya había un timestamp y ya transcurrió la duración límite
    if (loginAt && !isNaN(loginAt) && (now - loginAt) >= SESSION_DURATION_MS) {
      console.warn(`[ShopContext] Sesión expirada: transcurrieron ${now - loginAt}ms >= límite ${SESSION_DURATION_MS}ms`);
      await logoutAdmin(true);
      return true;
    }

    // Si está autenticado pero no tenía timestamp, inicializarlo ahora
    if (!loginAt || isNaN(loginAt)) {
      localStorage.setItem('adminLoginAt', now.toString());
    }

    return false;
  };

  // Temporizador activo en segundo plano: revisa cada 1 segundo para expulsión exacta al cumplirse el tiempo
  useEffect(() => {
    if (!adminUser) return;

    checkSessionExpiration();

    const timer = setInterval(() => {
      checkSessionExpiration();
    }, 1000);

    return () => clearInterval(timer);
  }, [adminUser, SESSION_DURATION_MS]);

  // Observador de estado de autenticación (onAuthStateChanged)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const loginAtStr = localStorage.getItem('adminLoginAt');
        const loginAt = loginAtStr ? parseInt(loginAtStr, 10) : null;
        const now = Date.now();

        // Solo cerrar sesión si existe un timestamp y ya transcurrió la duración límite
        if (loginAt && !isNaN(loginAt) && (now - loginAt) >= SESSION_DURATION_MS) {
          localStorage.removeItem('adminLoginAt');
          await signOut(auth);
          setAdminUser(null);
          setSessionExpiredMessage('Tu sesión expiró. Inicia sesión de nuevo.');
          setAuthLoading(false);
          return;
        }

        // Si es una sesión válida recién iniciada, asegurar el timestamp
        if (!loginAt || isNaN(loginAt)) {
          localStorage.setItem('adminLoginAt', now.toString());
        }

        setAdminUser(user);
        setSessionExpiredMessage('');
      } else {
        setAdminUser(null);
        localStorage.removeItem('adminLoginAt');
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [SESSION_DURATION_MS]);

  // Detector de visibilidad (al volver de segundo plano o reposo)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && (auth.currentUser || adminUser)) {
        checkSessionExpiration();
      }
    };
    const handleFocus = () => {
      if (auth.currentUser || adminUser) {
        checkSessionExpiration();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleFocus);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleFocus);
    };
  }, [adminUser, SESSION_DURATION_MS]);

  const loginAdmin = async (email, password) => {
    try {
      await setPersistence(auth, browserLocalPersistence);
    } catch (pErr) {
      console.warn('Persistencia browserLocalPersistence advertencia:', pErr);
    }
    const now = Date.now();
    localStorage.setItem('adminLoginAt', now.toString());
    setSessionExpiredMessage('');
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('adminLoginAt', Date.now().toString());
      setAdminUser(result.user);
      return result;
    } catch (err) {
      localStorage.removeItem('adminLoginAt');
      throw err;
    }
  };

  const logoutAdmin = async (isExpired = false) => {
    try {
      localStorage.removeItem('adminLoginAt');
      await signOut(auth);
      setAdminUser(null);
      if (isExpired) {
        setSessionExpiredMessage('Tu sesión expiró. Inicia sesión de nuevo.');
        showToast('Tu sesión expiró. Inicia sesión de nuevo.', 'error');
      } else {
        setSessionExpiredMessage('');
        showToast('Sesión de administrador cerrada', 'info');
      }
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  const resetAdminPassword = async (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // 2. Productos leídos ÚNICAMENTE de Firebase Firestore
  // Si la colección está vacía, no hay datos falsos.
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    try {
      const q = collection(db, 'productos');
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const loaded = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Ordenar por fecha reciente si está disponible
        loaded.sort((a, b) => {
          if (b.fechaCreacion && a.fechaCreacion) {
            return (b.fechaCreacion?.seconds || 0) - (a.fechaCreacion?.seconds || 0);
          }
          return 0;
        });
        setProducts(loaded);
        setProductsLoading(false);
      }, (error) => {
        console.warn('Error leyendo Firestore productos:', error);
        setProductsLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore no inicializado o sin conexión:', err);
      setProductsLoading(false);
    }
  }, []);

  // 3. Categorías leídas de Firestore (fusionadas con DEFAULT_CATEGORIES para preservar estilos)
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    try {
      const q = collection(db, 'categorias');
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const firestoreCats = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          const merged = DEFAULT_CATEGORIES.map(def => {
            const found = firestoreCats.find(c => c.id === def.id);
            return found ? { ...def, ...found } : def;
          });
          firestoreCats.forEach(fc => {
            if (!merged.some(m => m.id === fc.id)) {
              merged.push(fc);
            }
          });
          setCategories(merged);
        } else {
          setCategories(DEFAULT_CATEGORIES);
        }
      }, (error) => {
        console.warn('Leyendo categorías locales por omisión:', error);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Error en colección categorías:', err);
    }
  }, []);

  const updateCategory = async (categoryId, categoryData) => {
    try {
      await setDoc(doc(db, 'categorias', categoryId), {
        ...categoryData,
        ultimaActualizacion: serverTimestamp()
      }, { merge: true });
      showToast('Categoría actualizada con éxito', 'success');
    } catch (err) {
      console.error('Error actualizando categoría:', err);
      showToast('Error al actualizar categoría: ' + err.message, 'error');
      throw err;
    }
  };

  // 4. Configuración de Tienda (Hero Image y WhatsApp para Colombia)
  const [whatsappNumber, setWhatsappNumber] = useState(STORE_CONFIG.whatsappNumber);
  const [storeConfig, setStoreConfig] = useState({
    whatsappNumber: STORE_CONFIG.whatsappNumber,
    heroImage: null,
    heroTitle: 'Productos Originales de Estados Unidos',
    heroTagline: 'Importados a Colombia',
    heroSubtitle: 'Pedidos y asesoría personalizada directa por WhatsApp.'
  });

  useEffect(() => {
    try {
      const configDoc = doc(db, 'configuracion', 'tienda');
      const unsubscribe = onSnapshot(configDoc, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setStoreConfig(prev => ({ ...prev, ...data }));
          if (data.whatsappNumber) {
            setWhatsappNumber(data.whatsappNumber);
            STORE_CONFIG.whatsappNumber = data.whatsappNumber;
          }
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Configuración local por omisión:', err);
    }
  }, []);

  const updateStoreConfig = async (newConfig) => {
    try {
      await setDoc(doc(db, 'configuracion', 'tienda'), {
        ...newConfig,
        ultimaActualizacion: serverTimestamp()
      }, { merge: true });
      showToast('Configuración de tienda guardada', 'success');
    } catch (err) {
      console.error('Error guardando configuración:', err);
      showToast('Error: ' + err.message, 'error');
    }
  };

  const updateWhatsAppNumber = async (newNumber) => {
    const clean = newNumber.replace(/\D/g, '');
    setWhatsappNumber(clean);
    STORE_CONFIG.whatsappNumber = clean;
    await updateStoreConfig({ whatsappNumber: clean });
  };

  // 5. Lista de Deseos / Favoritos (Guardada en LocalStorage del cliente)
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('compras_usa_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('compras_usa_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Eliminado de tus favoritos', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Guardado en tus favoritos', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  // 6. Navegación del Catálogo
  // views: 'home' | 'catalog' | 'product-detail' | 'tracking' | 'account' | 'admin' | 'info'
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin/')) return 'admin';
      if (path === '/catalog' || path.startsWith('/catalog/')) return 'catalog';
    }
    return 'home';
  });
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [infoPageId, setInfoPageId] = useState('sobre-nosotros');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.toLowerCase();
        if (path === '/admin' || path.startsWith('/admin/')) {
          setCurrentView('admin');
        } else if (path === '/catalog' || path.startsWith('/catalog/')) {
          setCurrentView('catalog');
        } else {
          setCurrentView('home');
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view, payload = null) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
    if (typeof window !== 'undefined' && window.history) {
      const targetPath = view === 'home' ? '/' : `/${view}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ view, payload }, '', targetPath);
      }
    }
    if (view === 'catalog') {
      setActiveCategory(payload || null);
    } else if (view === 'product-detail') {
      setSelectedProduct(payload);
    } else if (view === 'info') {
      setInfoPageId(payload || 'sobre-nosotros');
    }
  };

  // 7. Notificaciones Toast Elegantes
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // 8. Operaciones CRUD de Productos en Firestore (Solo para Administradores)
  const createProduct = async (productData) => {
    try {
      const docRef = await addDoc(collection(db, 'productos'), {
        ...productData,
        fechaCreacion: serverTimestamp(),
        creadoPor: adminUser?.email || 'admin'
      });
      showToast('Producto añadido al catálogo de Firestore', 'success');
      return docRef.id;
    } catch (err) {
      console.error('Error creando producto:', err);
      showToast('Error al guardar en Firestore: ' + err.message, 'error');
      throw err;
    }
  };

  const editProduct = async (productId, productData) => {
    try {
      const productRef = doc(db, 'productos', productId);
      await updateDoc(productRef, {
        ...productData,
        fechaActualizacion: serverTimestamp()
      });
      showToast('Producto actualizado correctamente', 'success');
    } catch (err) {
      console.error('Error actualizando producto:', err);
      showToast('Error al actualizar en Firestore: ' + err.message, 'error');
      throw err;
    }
  };

  const removeProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, 'productos', productId));
      showToast('Producto eliminado del catálogo', 'info');
    } catch (err) {
      console.error('Error eliminando producto:', err);
      showToast('Error al eliminar en Firestore: ' + err.message, 'error');
      throw err;
    }
  };

  const duplicateProduct = async (product) => {
    try {
      const { id, fechaCreacion, fechaActualizacion, ...rest } = product;
      await addDoc(collection(db, 'productos'), {
        ...rest,
        nombre: `${product.nombre || product.name} (Copia)`,
        fechaCreacion: serverTimestamp(),
        creadoPor: adminUser?.email || 'admin'
      });
      showToast('Producto duplicado en Firestore', 'success');
    } catch (err) {
      console.error('Error duplicando producto:', err);
      showToast('Error al duplicar: ' + err.message, 'error');
    }
  };

  return (
    <ShopContext.Provider
      value={{
        // Auth
        adminUser,
        authLoading,
        isAdmin: !!adminUser,
        loginAdmin,
        logoutAdmin,
        resetAdminPassword,
        checkSessionExpiration,
        sessionExpiredMessage,
        setSessionExpiredMessage,
        SESSION_DURATION_MS,

        // Productos de Firestore
        products,
        productsLoading,
        createProduct,
        editProduct,
        removeProduct,
        duplicateProduct,

        // Categorías
        categories,
        updateCategory,

        // Configuración
        whatsappNumber,
        updateWhatsAppNumber,
        storeConfig,
        updateStoreConfig,

        // Favoritos
        wishlist,
        toggleWishlist,
        isInWishlist,

        // Navegación
        currentView,
        navigateTo,
        activeCategory,
        setActiveCategory,
        selectedProduct,
        setSelectedProduct,
        infoPageId,
        setInfoPageId,
        isSearchOpen,
        setIsSearchOpen,

        // Toast
        toast,
        showToast
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop debe ser usado dentro de ShopProvider');
  }
  return context;
};
