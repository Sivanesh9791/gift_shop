import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, HeartOff, ShoppingCart, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import products from '../data/products';

export default function Wishlist() {
  const { wishlistItems, toggleWishlist, wishlistCount } = useWishlist();
  const { addItem } = useCart();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    // Generate mock UUID link
    const mockId = Math.random().toString(36).substring(2, 10);
    navigator.clipboard.writeText(`https://gifthaven.shop/wishlist?id=${mockId}`);
    toast.success('Wishlist link copied!');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMoveToCart = (product) => {
    addItem(product);
    toggleWishlist(product); // Remove from wishlist
    toast.success('Moved to cart!');
  };

  // 4 random products for "People also saved"
  const recommended = useMemo(() => {
    // filter out items already in wishlist to avoid redundancy
    const available = products.filter(p => !wishlistItems.some(w => w.id === p.id));
    return available.sort(() => 0.5 - Math.random()).slice(0, 4);
  }, [wishlistItems]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">My Wishlist</h1>
            <p className="text-slate-500 mt-2">You have {wishlistCount} item{wishlistCount !== 1 ? 's' : ''} saved.</p>
          </div>
          {wishlistCount > 0 && (
            <button 
              onClick={handleShare}
              className="bg-white border border-slate-200 text-slate-700 font-bold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm"
            >
              <Share2 size={18} /> {copied ? 'Copied!' : 'Share Wishlist'}
            </button>
          )}
        </div>

        {wishlistCount === 0 ? (
          // Empty State
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-rose-50 text-rose-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="fill-rose-100" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-3">Your wishlist is empty 💝</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">Keep track of the perfect gifts for your loved ones (or yourself) by clicking the heart icon on any product.</p>
            <Link to="/shop" className="bg-rose-500 text-white font-bold py-3.5 px-8 rounded-xl inline-flex items-center gap-2 hover:bg-rose-600 shadow-md shadow-rose-200 transition-colors">
              Start adding gifts <ShoppingCart size={18} />
            </Link>
          </div>
        ) : (
          // Wishlist Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map(product => (
              <div key={product.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    {product.isSale && <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 uppercase rounded tracking-wider shadow-sm">Sale</span>}
                    {product.stock === 0 && <span className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 uppercase rounded tracking-wider shadow-sm">Out of Stock</span>}
                  </div>
                </div>

                <div className="p-5 flex-grow flex flex-col">
                  <Link to={`/product/${product.slug}`} className="flex-grow">
                    <p className="text-xs text-slate-400 font-bold tracking-wider uppercase mb-1">{product.category}</p>
                    <h3 className="font-bold text-slate-900 leading-snug line-clamp-2 hover:text-rose-500 transition-colors">{product.name}</h3>
                  </Link>
                  
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-bold text-slate-900">${product.price.toFixed(2)}</span>
                    {product.isSale && product.compareAtPrice && (
                      <span className="text-sm text-slate-400 line-through">${product.compareAtPrice.toFixed(2)}</span>
                    )}
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-2">
                    <button 
                      disabled={product.stock === 0}
                      onClick={() => handleMoveToCart(product)}
                      className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-rose-600 disabled:opacity-50 disabled:hover:bg-slate-900 transition-colors text-sm"
                    >
                      <ShoppingCart size={16} /> Move to Cart
                    </button>
                    <button 
                      onClick={() => toggleWishlist(product)}
                      className="w-full bg-slate-50 text-slate-600 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-rose-50 hover:text-rose-600 transition-colors text-sm border border-slate-200"
                    >
                      <HeartOff size={16} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* People Also Saved (Recommended) */}
        <div className="pt-16 border-t border-slate-200 mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-slate-900">People also saved</h2>
            <Link to="/shop" className="text-rose-500 font-semibold text-sm hover:text-rose-700">View more</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommended.map(product => (
              <div key={product.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden group">
                <Link to={`/product/${product.slug}`} className="block relative aspect-square bg-slate-100 overflow-hidden">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </Link>
                <div className="p-4">
                  <Link to={`/product/${product.slug}`} className="block font-bold text-slate-900 text-sm line-clamp-1 hover:text-rose-500 mb-1">
                    {product.name}
                  </Link>
                  <p className="font-bold text-slate-600 text-sm">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
