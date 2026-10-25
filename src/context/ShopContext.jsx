import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, onSnapshot, doc, addDoc, updateDoc, 
  deleteDoc, query, orderBy, serverTimestamp, setDoc, getDoc 
} from 'firebase/firestore';
import { 
  onAuthStateChanged, signInWithEmailAndPassword, 
  signOut, sendPasswordResetEmail 
} from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { DEFAULT_CATEGORIES } from '../data/categories';
import { STORE_CONFIG } from '../utils/whatsapp';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // 1. Estado de Autenticación de Administrador (Firebase Auth)
  const [adminUser, setAdminUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginAdmin = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logoutAdmin = async () => {
    return signOut(auth);
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

  // 3. Categorías leídas de Firestore (con fallback a las 5 categorías oficiales si está vacía)
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    try {
      const q = collection(db, 'categorias');
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const loaded = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setCategories(loaded);
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

  // 4. Configuración de Tienda (Número de WhatsApp para Colombia)
  const [whatsappNumber, setWhatsappNumber] = useState(STORE_CONFIG.whatsappNumber);

  useEffect(() => {
    try {
      const configDoc = doc(db, 'configuracion', 'tienda');
      const unsubscribe = onSnapshot(configDoc, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.whatsappNumber) {
            setWhatsappNumber(data.whatsappNumber);
            STORE_CONFIG.whatsappNumber = data.whatsappNumber;
          }
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Configuración local WhatsApp por omisión:', err);
    }
  }, []);

  const updateWhatsAppNumber = async (newNumber) => {
    const clean = newNumber.replace(/\D/g, '');
    setWhatsappNumber(clean);
    STORE_CONFIG.whatsappNumber = clean;
    try {
      await setDoc(doc(db, 'configuracion', 'tienda'), {
        whatsappNumber: clean,
        ultimaActualizacion: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('Guardado local de WhatsApp:', err);
    }
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
  const [currentView, setCurrentView] = useState('home');
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [infoPageId, setInfoPageId] = useState('sobre-nosotros');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigateTo = (view, payload = null) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
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

        // Productos de Firestore
        products,
        productsLoading,
        createProduct,
        editProduct,
        removeProduct,
        duplicateProduct,

        // Categorías
        categories,

        // Configuración
        whatsappNumber,
        updateWhatsAppNumber,

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
