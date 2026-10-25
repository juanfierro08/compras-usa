import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { WhatsAppButton } from './components/layout/WhatsAppButton';
import { SearchModal } from './components/catalog/SearchModal';

// Secciones de Portada Editorial (Inicio)
import { HeroBanner } from './components/home/HeroBanner';
import { CategoryBento } from './components/home/CategoryBento';
import { FeaturedProducts } from './components/home/FeaturedProducts';
import { HowItWorks } from './components/home/HowItWorks';
import { TrustSection } from './components/home/TrustSection';
import { FAQSection } from './components/home/FAQSection';

// Vistas Principales del Catálogo
import { CatalogPage } from './components/catalog/CatalogPage';
import { ProductDetailPage } from './components/product/ProductDetailPage';
import { UserAccountModal } from './components/account/UserAccountModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { InfoPages } from './components/info/InfoPages';

import { Check, AlertTriangle, Info } from 'lucide-react';

const ToastNotification = () => {
  const { toast } = useShop();
  if (!toast) return null;

  return (
    <div className="fixed top-24 right-4 sm:right-8 z-50 max-w-sm animate-fadeIn">
      <div className="p-4 bg-[#FAF7F2] text-[#161616] border border-[#E5DFD7] shadow-lifted flex items-center gap-3">
        {toast.type === 'success' ? (
          <Check className="w-4 h-4 text-[#B08D57] shrink-0" />
        ) : toast.type === 'error' ? (
          <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
        ) : (
          <Info className="w-4 h-4 text-[#161616] shrink-0" />
        )}
        <span className="text-xs font-serif leading-snug">{toast.message}</span>
      </div>
    </div>
  );
};

const MainContent = () => {
  const { currentView } = useShop();

  return (
    <main className="min-h-screen">
      {currentView === 'home' && (
        <>
          <HeroBanner />
          <CategoryBento />
          <FeaturedProducts />
          <HowItWorks />
          <TrustSection />
          <FAQSection />
        </>
      )}

      {currentView === 'catalog' && <CatalogPage />}
      {currentView === 'product-detail' && <ProductDetailPage />}
      {currentView === 'account' && <UserAccountModal />}
      {currentView === 'admin' && <AdminDashboard />}
      {currentView === 'info' && <InfoPages />}
    </main>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#161616] selection:bg-[#161616] selection:text-[#FAF7F2] font-sans antialiased">
        <Navbar />
        <MainContent />
        <Footer />

        {/* Componentes Flotantes y Modales */}
        <SearchModal />
        <WhatsAppButton />
        <MobileNav />
        <ToastNotification />
      </div>
    </ShopProvider>
  );
}
