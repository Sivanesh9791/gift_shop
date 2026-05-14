import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import OccasionBanner from './components/OccasionBanner';
import BackToTop from './components/BackToTop';
import CookieConsent from './components/CookieConsent';
import ErrorBoundary from './components/ErrorBoundary';

import Home from './pages/Home';
import Shop from './pages/Shop';
import GiftFinder from './pages/GiftFinder';
import GiftCards from './pages/GiftCards';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import TrackOrder from './pages/TrackOrder';
import NotFound from './pages/NotFound';
import AdminApp from './admin/AdminApp';

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      <OccasionBanner />
      <Navbar />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#374151',
            border: '1px solid #fce7f3',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#f43f5e', secondary: '#fff' }
          }
        }}
      />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/gift-finder" element={<GiftFinder />} />
          <Route path="/gift-cards" element={<GiftCards />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
      <CookieConsent />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Admin Panel Route - completely separate from main site */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* Main Site Routes */}
        <Route
          path="/*"
          element={
            <CartProvider>
              <WishlistProvider>
                <AppContent />
              </WishlistProvider>
            </CartProvider>
          }
        />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
