import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Pencil, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ReviewStars from './ReviewStars';
import WishlistBtn from './WishlistBtn';
import QuickViewModal from './QuickViewModal';

/* ─── Tiny inline toast ─── */
function Toast({ message, visible }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-2
        bg-slate-900 text-white text-sm font-medium px-5 py-3 rounded-full shadow-2xl
        transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
    >
      {message}
    </div>
  );
}

/* ─── Badge config (priority order) ─── */
const BADGE_PRIORITY = [
  { key: 'isSale',          label: 'SALE',        classes: 'bg-red-500 text-white' },
  { key: 'isBestseller',    label: 'BESTSELLER',  classes: 'bg-amber-400 text-white' },
  { key: 'isNew',           label: 'NEW',         classes: 'bg-green-500 text-white' },
  { key: 'isPersonalisable',label: 'PERSONALISED',classes: 'bg-purple-500 text-white' },
];

/** Returns at most 2 badges: SALE first, then one other. */
function getBadges(product) {
  return BADGE_PRIORITY.filter(b => product[b.key]).slice(0, 2);
}

/* ═══════════════════════════════════════════════════════════
   GRID CARD
═══════════════════════════════════════════════════════════ */
function GridCard({ product }) {
  const { addItem } = useCart();
  const [hovered, setHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const hasSecondImage = product.images?.length > 1;
  const savings = product.isSale && product.compareAtPrice
    ? (product.compareAtPrice - product.price).toFixed(2)
    : null;

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }, []);

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    showToast('Added to cart! 🎁');
  }

  return (
    <>
      <div
        className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Image container ── */}
        <Link to={`/product/${product.slug}`} className="relative block overflow-hidden bg-slate-100" style={{ aspectRatio: '4/3' }}>
          {/* Primary image */}
          <img
            src={product.images[0]}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
              hovered && hasSecondImage ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            }`}
          />
          {/* Secondary image crossfade */}
          {hasSecondImage && (
            <img
              src={product.images[1]}
              alt={product.name}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            />
          )}

          {/* Top-left badges — max 2, stacked vertically */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {getBadges(product).map(({ key, label, classes }) => (
              <span key={key} className={`${classes} text-xs font-bold px-2 py-1 rounded-full`}>
                {label}
              </span>
            ))}
          </div>

          {/* Top-right wishlist */}
          <div className="absolute top-3 right-3 z-10">
            <WishlistBtn product={product} />
          </div>

          {/* Bottom overlay — Quick View */}
          <div className={`absolute inset-x-0 bottom-0 p-3 flex justify-center transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuickViewOpen(true); }}
              className="flex items-center gap-2 bg-white/95 backdrop-blur text-slate-900 text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg hover:bg-slate-900 hover:text-white transition-colors"
            >
              <Eye size={15} />
              Quick View
            </button>
          </div>
        </Link>

        {/* ── Card body ── */}
        <div className="flex flex-col flex-grow p-5">
          {/* Category */}
          <span className="text-xs text-slate-400 uppercase tracking-widest mb-1.5 font-medium">
            {product.category}
          </span>

          {/* Name */}
          <Link to={`/product/${product.slug}`} className="flex-grow mb-2">
            <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 hover:text-rose-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Review stars */}
          <ReviewStars rating={product.rating} count={product.reviewCount} size={13} className="mb-3" />

          {/* Price row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xl font-bold text-slate-900">${product.price}</span>
            {product.isSale && product.compareAtPrice && (
              <>
                <span className="text-sm text-slate-400 line-through">${product.compareAtPrice}</span>
                <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  Save ${savings}
                </span>
              </>
            )}
          </div>

          {/* Free delivery */}
          {product.freeDelivery && (
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium mb-3">
              <Truck size={12} />
              Free delivery
            </div>
          )}

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-rose-600 transition-colors active:scale-[0.98] mb-2"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>

          {/* Personalise link */}
          {product.isPersonalisable && (
            <Link
              to={`/product/${product.slug}?personalise=true`}
              className="flex items-center justify-center gap-1.5 text-violet-600 text-xs font-medium hover:text-violet-700 transition-colors py-1"
            >
              <Pencil size={12} />
              Personalise this gift
            </Link>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        onAddedToCart={() => showToast('Added to cart! 🎁')}
      />

      {/* Toast */}
      <Toast message={toastMsg} visible={toastVisible} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   LIST CARD (compact horizontal layout)
═══════════════════════════════════════════════════════════ */
function ListCard({ product }) {
  const { addItem } = useCart();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const savings = product.isSale && product.compareAtPrice
    ? (product.compareAtPrice - product.price).toFixed(2)
    : null;

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setToastMsg('Added to cart! 🎁');
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }

  return (
    <>
      <div className="flex gap-4 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
        {/* Image */}
        <Link to={`/product/${product.slug}`} className="relative w-40 h-40 flex-shrink-0 overflow-hidden bg-slate-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {getBadges(product).map(({ key, label, classes }) => (
              <span key={key} className={`${classes} text-[9px] font-bold px-2 py-0.5 rounded-full`}>{label}</span>
            ))}
          </div>
        </Link>

        {/* Body */}
        <div className="flex flex-col justify-center py-4 pr-4 flex-grow min-w-0 gap-2">
          <span className="text-xs text-slate-400 uppercase tracking-widest font-medium">{product.category}</span>

          <Link to={`/product/${product.slug}`}>
            <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-rose-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <ReviewStars rating={product.rating} count={product.reviewCount} size={12} />

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-lg text-slate-900">${product.price}</span>
            {product.isSale && product.compareAtPrice && (
              <>
                <span className="text-sm text-slate-400 line-through">${product.compareAtPrice}</span>
                <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-0.5 rounded-full">Save ${savings}</span>
              </>
            )}
            {product.freeDelivery && (
              <span className="text-emerald-600 text-xs font-medium flex items-center gap-1">
                <Truck size={11} /> Free delivery
              </span>
            )}
          </div>
        </div>

        {/* Actions column */}
        <div className="flex flex-col justify-center gap-2 pr-4 flex-shrink-0">
          <WishlistBtn product={product} />
          <button
            onClick={(e) => { e.preventDefault(); setQuickViewOpen(true); }}
            className="p-2 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors"
            title="Quick View"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={handleAddToCart}
            className="p-2 rounded-full bg-slate-900 text-white hover:bg-rose-600 transition-colors active:scale-95"
            title="Add to Cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>

      <QuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        onAddedToCart={() => { setToastMsg('Added to cart! 🎁'); setToastVisible(true); setTimeout(() => setToastVisible(false), 2500); }}
      />
      <Toast message={toastMsg} visible={toastVisible} />
    </>
  );
}

/* ─── Main export ─── */
export default function ProductCard({ product, viewMode = 'grid' }) {
  if (!product) return null;
  return viewMode === 'list'
    ? <ListCard product={product} />
    : <GridCard product={product} />;
}
