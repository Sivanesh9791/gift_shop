import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Wand2, Heart, ShoppingBag, Menu, X, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import CartDrawer from './CartDrawer';



export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const navigate = useNavigate();
  const { cartCount } = useCart();
  // Ensure we safely destructure from useWishlist in case it was modified or hasn't exported wishlistCount correctly
  const wishlistContext = useWishlist();
  const wishlistCount = wishlistContext?.wishlistCount || 0;

  // Handle scroll detection for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false); // Close mobile menu if searching from there
    }
  };

  return (
    <header className="w-full relative z-50">
      {/* LAYER 1: Announcement Bar */}
      <div className="bg-red-600 text-white py-2 text-center text-sm font-medium">
        🎁 Free personalisation on orders over ₹500 | Call +91 90030 74000
      </div>
      {/* LAYER 2: Main Navbar (Sticky) */}
      <div 
        className={`bg-white transition-all duration-300 ${
          isScrolled ? 'sticky top-0 shadow-md' : 'border-b border-[#F0F0F0]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2 -ml-2 text-gray-700 hover:text-red-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
              
              <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                <span className="text-3xl">🎁</span>
                <div className="flex flex-col leading-none">
                  <span style={{fontFamily: 'Playfair Display, serif'}}
                    className="text-2xl font-black tracking-widest text-red-600 uppercase">
                    TRESOR
                  </span>
                  <span style={{fontFamily: 'Playfair Display, serif'}}
                    className="text-sm font-bold tracking-widest text-[#888888] uppercase -mt-1">
                    GIFTS ✦
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Search Bar (Desktop) */}
            <div className="hidden lg:flex flex-1 justify-center mx-8">
              <form onSubmit={handleSearchSubmit} className="relative group w-64 focus-within:w-full max-w-2xl transition-all duration-500 ease-in-out">
                <input
                  type="text"
                  placeholder="Search gifts, occasions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                      setSearchQuery('');
                    }
                  }}
                  className="w-full bg-[#F8F8F8] border border-[#E8E8E8] rounded-full py-2.5 pl-12 pr-4 text-sm text-[#111111] placeholder-[#AAAAAA] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm focus:shadow-md transition-all duration-500 ease-in-out"
                />
                <Search 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AAAAAA] group-focus-within:text-red-600 transition-colors cursor-pointer" 
                  size={20} 
                  onClick={() => {
                    if (searchQuery.trim()) {
                      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                      setSearchQuery('');
                    }
                  }}
                />
                <button type="submit" className="hidden">Search</button>
              </form>
            </div>

            {/* Right: Icons Row */}
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
              {/* Gift Finder Link */}
              <Link 
                to="/gift-finder"
                className="hidden md:flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium transition-colors"
              >
                <div className="p-2 bg-red-50 rounded-full text-red-600">
                  <Wand2 size={20} />
                </div>
                <span>Gift Finder</span>
              </Link>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative p-2 text-[#555555] hover:text-red-600 transition-colors">
                <Heart size={24} />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 border-2 border-white rounded-full transform translate-x-1/4 -translate-y-1/4">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-[#555555] hover:text-red-600 transition-colors group"
                aria-label="Open Cart"
              >
                <div className="group-hover:scale-110 transition-transform">
                  <ShoppingBag size={24} />
                </div>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 border-2 border-white rounded-full transform translate-x-1/4 -translate-y-1/4">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
            
          </div>
        </div>
      </div>

      {/* LAYER 3: Category Mega-menu (Desktop Only) */}
      <div className="hidden lg:block bg-white border-t-2 border-t-red-600 border-b border-b-red-100 shadow-sm relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-between py-3">
            <li><Link to="/shop?category=photoGifts" className="text-sm font-medium tracking-wide transition-colors hover:text-red-600 text-gray-600">📸 Photo Gifts</Link></li>
            <li><Link to="/shop?category=personalisedItems" className="text-sm font-medium tracking-wide transition-colors hover:text-red-600 text-gray-600">🎨 Personalised Items</Link></li>
            <li><Link to="/shop?category=caricatureArt" className="text-sm font-medium tracking-wide transition-colors hover:text-red-600 text-gray-600">🖼️ Caricatures & Art</Link></li>
            <li><Link to="/shop?category=woodenCrafts" className="text-sm font-medium tracking-wide transition-colors hover:text-red-600 text-gray-600">🪵 Wooden Crafts</Link></li>
            <li><Link to="/shop?category=corporateGifts" className="text-sm font-medium tracking-wide transition-colors hover:text-red-600 text-gray-600">💼 Corporate Gifts</Link></li>
            <li><Link to="/shop?filter=Sale" className="text-sm tracking-wide transition-colors hover:text-red-700 text-red-600 font-semibold">🏷️ Sale</Link></li>
          </ul>
        </div>
      </div>

      {/* MOBILE: Slide-in Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Drawer Menu */}
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-xl flex flex-col items-start overflow-y-auto animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between w-full p-4 border-b border-red-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎁</span>
                <div className="flex flex-col leading-none">
                  <span style={{fontFamily: 'Playfair Display, serif'}}
                    className="text-lg font-black tracking-widest text-red-600 uppercase">
                    TRESOR GIFTS
                  </span>
                  <span className="text-xs font-bold tracking-widest text-gray-500 uppercase -mt-0.5">
                    The Customized Gift Store
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="w-full p-4 border-b border-red-50">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search gifts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                      setSearchQuery('');
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className="w-full bg-[#F8F8F8] border border-[#E8E8E8] rounded-xl py-3 pl-12 pr-4 text-sm text-[#111111] placeholder-[#AAAAAA] focus:outline-none focus:border-red-500"
                />
                <Search 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AAAAAA] cursor-pointer" 
                  size={20} 
                  onClick={() => {
                    if (searchQuery.trim()) {
                      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                      setSearchQuery('');
                      setIsMobileMenuOpen(false);
                    }
                  }}
                />
              </form>
            </div>

            {/* Mobile Gift Finder Link */}
            <Link 
              to="/gift-finder"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between w-full p-4 border-b border-red-50 hover:bg-red-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full text-red-600">
                  <Wand2 size={20} />
                </div>
                <span className="font-medium text-gray-800">Gift Finder Matchmaker</span>
              </div>
              <ChevronRight size={20} className="text-gray-400 group-hover:text-red-600" />
            </Link>

            {/* Mobile Categories */}
            <div className="w-full py-4">
              <h3 className="px-5 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Shop by Category</h3>
              <ul className="flex flex-col">
                <li><Link to="/shop?category=photoGifts" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between w-full px-5 py-3 hover:bg-red-50 transition-colors"><span className="text-base font-medium text-gray-700">📸 Photo Gifts</span></Link></li>
                <li><Link to="/shop?category=personalisedItems" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between w-full px-5 py-3 hover:bg-red-50 transition-colors"><span className="text-base font-medium text-gray-700">🎨 Personalised Items</span></Link></li>
                <li><Link to="/shop?category=caricatureArt" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between w-full px-5 py-3 hover:bg-red-50 transition-colors"><span className="text-base font-medium text-gray-700">🖼️ Caricatures & Art</span></Link></li>
                <li><Link to="/shop?category=woodenCrafts" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between w-full px-5 py-3 hover:bg-red-50 transition-colors"><span className="text-base font-medium text-gray-700">🪵 Wooden Crafts</span></Link></li>
                <li><Link to="/shop?category=corporateGifts" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between w-full px-5 py-3 hover:bg-red-50 transition-colors"><span className="text-base font-medium text-gray-700">💼 Corporate Gifts</span></Link></li>
                <li><Link to="/shop?filter=Sale" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between w-full px-5 py-3 hover:bg-red-50 transition-colors"><span className="text-base text-red-600 font-bold">🏷️ Sale</span></Link></li>
              </ul>
            </div>
            
            {/* Footer / Contact (Optional) */}
            <div className="mt-auto w-full p-6 bg-red-50 border-t border-red-100 pb-10">
              <p className="text-sm text-gray-500 font-medium mb-2">Need help?</p>
              <a href="mailto:info@tresorgifts.in" className="font-medium text-red-600 hover:underline block">info@tresorgifts.in</a>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
