import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Disclosure, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import {
  ChevronRight, ChevronDown, Star, Truck, CheckCircle,
  Gift, Heart, ShoppingCart, Pencil, Minus, Plus, ArrowLeft
} from 'lucide-react';
import productsData from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import ReviewStars from '../components/ReviewStars';

/* ──────────────────────────────────────────────────────────
   HELPERS
────────────────────────────────────────────────────────── */
const WRAP_STYLES = ['Classic Red 🎀', 'Floral Pink 🌸', 'Elegant Gold ✨'];

const MOCK_REVIEWS = [
  {
    id: 1, name: 'Sarah M.', date: 'Apr 28, 2026', rating: 5,
    text: 'Absolutely beautiful product! Arrived perfectly packaged and looks exactly as described. My mum loved it.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg', verified: true,
  },
  {
    id: 2, name: 'James K.', date: 'Apr 14, 2026', rating: 4,
    text: 'Great quality and fast delivery. Would have loved a slightly larger size option but overall very happy.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg', verified: true,
  },
  {
    id: 3, name: 'Emma R.', date: 'Mar 31, 2026', rating: 5,
    text: 'Ordered with personalisation and it turned out stunning. The recipient was totally surprised. Highly recommend!',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg', verified: false,
  },
];

const RATING_DIST = { 5: 65, 4: 20, 3: 10, 2: 3, 1: 2 }; // percentages

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

/* ──────────────────────────────────────────────────────────
   TOGGLE SWITCH
────────────────────────────────────────────────────────── */
function Toggle({ value, onChange, label, sub }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {sub && <p className="text-xs text-slate-500">{sub}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${value ? 'bg-rose-500' : 'bg-slate-200'}`}
      >
        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-6' : ''}`} />
      </button>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   ACCORDION PANEL
────────────────────────────────────────────────────────── */
function AccordionPanel({ title, children, defaultOpen = false }) {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <div className="border-b border-slate-100">
          <Disclosure.Button className="flex w-full items-center justify-between py-4 text-left font-semibold text-slate-800 hover:text-rose-600 transition-colors">
            {title}
            <ChevronDown size={16} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </Disclosure.Button>
          <Transition
            enter="transition duration-150 ease-out"
            enterFrom="opacity-0 -translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition duration-100 ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-1"
          >
            <Disclosure.Panel className="pb-4 text-sm text-slate-600 leading-relaxed space-y-2">
              {children}
            </Disclosure.Panel>
          </Transition>
        </div>
      )}
    </Disclosure>
  );
}

/* ──────────────────────────────────────────────────────────
   MAIN PAGE
────────────────────────────────────────────────────────── */
export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const product = productsData.find(p => p.slug === slug);

  useEffect(() => {
    if (product) document.title = `${product.name} | GiftHaven`;
  }, [product]);

  /* ── State ── */
  const [selectedImage, setSelectedImage]             = useState(0);
  const [qty,           setQty]                       = useState(1);
  const [giftWrap,      setGiftWrap]                  = useState(false);
  const [wrapStyle,     setWrapStyle]                 = useState(WRAP_STYLES[0]);
  const [giftMessage,   setGiftMessage]               = useState('');
  const [personText,    setPersonText]                = useState('');

  /* smooth image crossfade */
  const [imgVisible, setImgVisible] = useState(true);
  function switchImage(idx) {
    setImgVisible(false);
    setTimeout(() => { setSelectedImage(idx); setImgVisible(true); }, 150);
  }

  /* ── Not found ── */
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="text-6xl mb-2">🎁</div>
        <h1 className="text-2xl font-bold text-slate-900">Product not found</h1>
        <p className="text-slate-500">We couldn't find the gift you're looking for.</p>
        <button onClick={() => navigate('/shop')}
          className="flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-rose-700 transition-colors">
          <ArrowLeft size={16} /> Back to Shop
        </button>
      </div>
    );
  }

  const wishlisted   = isInWishlist(product.id);
  const savings      = product.compareAtPrice ? (product.compareAtPrice - product.price).toFixed(2) : null;
  const today        = new Date();
  const deliveryFrom = addDays(today, product.deliveryDays);
  const deliveryTo   = addDays(today, product.deliveryDays + 2);

  /* related products: same category, excluding self, max 4 */
  const related = productsData
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  /* frequently bought: 2 random from different categories */
  const bundleItems = productsData
    .filter(p => p.category !== product.category && p.id !== product.id)
    .slice(0, 2);
  const bundleTotal = (product.price + bundleItems.reduce((s, p) => s + p.price, 0)).toFixed(2);

  /* ── Actions ── */
  function handleAddToCart() {
    addItem(product, qty, {
      giftWrap,
      giftMessage: giftWrap ? giftMessage : '',
      personalisationText: personText,
      selectedWrapStyle: giftWrap ? wrapStyle : '',
    });
    toast.success(`${product.name} added to cart! 🎁`, { duration: 2500 });
  }

  function handleWishlist() {
    toggleWishlist(product);
    toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist! ❤️',
      { icon: wishlisted ? '💔' : '❤️', duration: 2000 });
  }

  function handleAddAll() {
    [product, ...bundleItems].forEach(p => addItem(p, 1));
    toast.success('Bundle added to cart! 🎁', { duration: 2500 });
  }

  /* ──────────────────────────────────────────────────────
     RENDER
  ────────────────────────────────────────────────────── */
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ══════════════════════════════════════
            PRODUCT MAIN — two columns
        ══════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* ── LEFT: Image gallery ── */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl shadow-sm p-4">
              {/* Main image */}
              <div className="relative rounded-xl overflow-hidden aspect-square w-full mb-4 bg-slate-100">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-opacity duration-150 ${imgVisible ? 'opacity-100' : 'opacity-0'}`}
                />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {product.isSale && <span className="bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">SALE</span>}
                  {product.isNew && <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">NEW</span>}
                  {product.isPersonalisable && <span className="bg-violet-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">PERSONALISED</span>}
                </div>
              </div>
              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => switchImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all
                      ${selectedImage === i ? 'border-rose-500 shadow-md' : 'border-transparent hover:border-slate-300'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Product info ── */}
          <div className="flex flex-col">

            {/* S1 — Breadcrumb + Title */}
            <div className="border-b border-slate-100 pb-6 mb-6">
              <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-3 flex-wrap">
                <Link to="/" className="hover:text-rose-500 transition-colors">Home</Link>
                <ChevronRight size={13} />
                <Link to={`/shop?category=${product.category}`} className="hover:text-rose-500 transition-colors capitalize">
                  {product.category}
                </Link>
                <ChevronRight size={13} />
                <span className="text-slate-600 truncate">{product.name}</span>
              </nav>

              <h1 className="text-3xl font-bold font-serif text-slate-900 leading-tight mb-3">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="text-xs bg-rose-100 text-rose-600 px-3 py-1 rounded-full font-medium capitalize">
                  {product.category}
                </span>
                {product.isBestseller && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">
                    🏆 Bestseller
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <ReviewStars rating={product.rating} count={product.reviewCount} size={15} />
              </div>
            </div>

            {/* S2 — Price */}
            <div className="border-b border-slate-100 pb-6 mb-6">
              <div className="flex items-center flex-wrap gap-3">
                <span className="text-3xl font-bold text-rose-600">${product.price}</span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-xl text-slate-400 line-through">${product.compareAtPrice}</span>
                    <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full">
                      Save ${savings}
                    </span>
                  </>
                )}
              </div>
              {product.freeDelivery && (
                <p className="text-emerald-600 text-sm font-medium mt-2 flex items-center gap-1.5">
                  <Truck size={14} /> Free delivery included
                </p>
              )}
            </div>

            {/* S3 — Personalisation */}
            {product.isPersonalisable && (
              <div className="border-b border-slate-100 pb-6 mb-6">
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                    ✏️ Personalise this gift
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">{product.personalisationNote}</p>
                  <textarea
                    rows={3}
                    maxLength={100}
                    value={personText}
                    onChange={e => setPersonText(e.target.value)}
                    placeholder="Enter your personalisation message…"
                    className="w-full border border-rose-200 rounded-lg p-3 text-sm resize-none
                      focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white placeholder:text-slate-400"
                  />
                  <p className="text-xs text-slate-400 text-right mt-1">{personText.length}/100</p>
                </div>
              </div>
            )}

            {/* S4 — Gift Wrapping */}
            <div className="border-b border-slate-100 pb-6 mb-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <Toggle
                  value={giftWrap}
                  onChange={setGiftWrap}
                  label="Add gift wrapping"
                  sub="+$3.99 — beautifully wrapped & ready to give"
                />
                {giftWrap && (
                  <div className="mt-4 space-y-3">
                    {/* Wrap style */}
                    <div>
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-2">Wrap Style</p>
                      <div className="flex gap-2 flex-wrap">
                        {WRAP_STYLES.map(style => (
                          <button key={style} onClick={() => setWrapStyle(style)}
                            className={`text-xs px-3 py-1.5 rounded-full border-2 font-medium transition-all
                              ${wrapStyle === style
                                ? 'border-rose-500 bg-rose-50 text-rose-700'
                                : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Gift message */}
                    <div>
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-2">Gift Message</p>
                      <textarea
                        rows={2}
                        maxLength={150}
                        value={giftMessage}
                        onChange={e => setGiftMessage(e.target.value)}
                        placeholder="Write a personal message for the card…"
                        className="w-full border border-amber-300 rounded-lg p-3 text-sm resize-none
                          focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white placeholder:text-slate-400"
                      />
                      <p className="text-xs text-slate-400 text-right mt-0.5">{giftMessage.length}/150</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* S5 — Delivery */}
            <div className="border-b border-slate-100 pb-6 mb-6 space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <Truck size={16} className="text-slate-400 flex-shrink-0" />
                <span>Estimated delivery: <strong className="text-slate-800">{deliveryFrom} – {deliveryTo}</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                {product.inStock
                  ? <span>In Stock — only <strong className="text-slate-800">{product.stockCount} left!</strong></span>
                  : <span className="text-rose-600 font-medium">Out of Stock</span>
                }
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <Gift size={16} className="text-amber-400 flex-shrink-0" />
                <span>Free delivery on orders over <strong className="text-slate-800">$40</strong></span>
              </div>
            </div>

            {/* S6 — Qty + Add to Cart */}
            <div className="border-b border-slate-100 pb-6 mb-6">
              <div className="flex items-center gap-4">
                {/* Qty picker */}
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="px-4 py-3 text-slate-600 hover:bg-slate-50 transition-colors active:bg-slate-100">
                    <Minus size={15} />
                  </button>
                  <span className="px-4 py-3 font-bold text-slate-900 min-w-[2.5rem] text-center">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)}
                    className="px-4 py-3 text-slate-600 hover:bg-slate-50 transition-colors active:bg-slate-100">
                    <Plus size={15} />
                  </button>
                </div>
                {/* Add to cart */}
                <button onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 flex items-center justify-center gap-2 bg-rose-500 text-white
                    rounded-xl py-3 font-bold text-base hover:bg-rose-600 transition-colors
                    active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-rose-200">
                  <ShoppingCart size={18} />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
              {/* Wishlist */}
              <button onClick={handleWishlist}
                className={`w-full mt-3 flex items-center justify-center gap-2 border-2 rounded-xl py-2.5
                  font-semibold text-sm transition-all active:scale-[0.98]
                  ${wishlisted
                    ? 'border-rose-500 bg-rose-50 text-rose-600'
                    : 'border-slate-200 text-slate-600 hover:border-rose-300 hover:text-rose-500'}`}>
                <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
                {wishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* S7 — Accordion */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <AccordionPanel title="Product Description" defaultOpen>
                <p>{product.description}</p>
              </AccordionPanel>

              <AccordionPanel title="Dimensions & Care">
                <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                  <li>Weight: {product.weight}</li>
                  <li>Carefully inspected and quality-assured before shipping</li>
                  <li>Handle with care — fragile or delicate items inside</li>
                  <li>Clean with a soft, dry cloth. Avoid direct sunlight.</li>
                </ul>
              </AccordionPanel>

              <AccordionPanel title="Delivery & Returns">
                <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                  <li>Free standard delivery on all orders over $40</li>
                  <li>Express delivery available at checkout</li>
                  <li>30-day hassle-free returns — no questions asked</li>
                  <li>Return shipping is free for all UK orders</li>
                </ul>
              </AccordionPanel>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            REVIEWS
        ══════════════════════════════════════ */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Rating summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center text-center">
              <span className="text-6xl font-extrabold text-slate-900 leading-none">{product.rating}</span>
              <ReviewStars rating={product.rating} size={20} className="my-3" />
              <p className="text-slate-500 text-sm mb-6">Based on {product.reviewCount} reviews</p>
              {/* Rating bars */}
              <div className="w-full space-y-2">
                {[5, 4, 3, 2, 1].map(star => (
                  <div key={star} className="flex items-center gap-2 text-sm">
                    <span className="w-4 text-right text-slate-500">{star}</span>
                    <Star size={12} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                    <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full transition-all"
                        style={{ width: `${RATING_DIST[star] || 0}%` }} />
                    </div>
                    <span className="w-8 text-left text-slate-400">{RATING_DIST[star]}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review cards */}
            <div className="md:col-span-2 space-y-4">
              {MOCK_REVIEWS.map(review => (
                <div key={review.id} className="bg-white rounded-2xl shadow-sm p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <img src={review.avatar} alt={review.name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <span className="font-semibold text-slate-900">{review.name}</span>
                        <span className="text-xs text-slate-400">{review.date}</span>
                      </div>
                      <ReviewStars rating={review.rating} size={13} className="mt-0.5" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{review.text}</p>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 mt-3 text-xs text-emerald-700
                      bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium">
                      <CheckCircle size={11} /> Verified Purchase
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            YOU MAY ALSO LIKE
        ══════════════════════════════════════ */}
        {related.length > 0 && (
          <section className="mt-20">
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">You May Also Like</h2>
              <Link to={`/shop?category=${product.category}`}
                className="text-rose-600 text-sm font-semibold hover:text-rose-700 flex items-center gap-1">
                See all <ChevronRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} viewMode="grid" />)}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════
            FREQUENTLY BOUGHT TOGETHER
        ══════════════════════════════════════ */}
        {bundleItems.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Frequently Bought Together</h2>
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {[product, ...bundleItems].map((p, i) => (
                  <div key={p.id} className="flex items-center gap-4">
                    {i > 0 && <span className="text-2xl text-slate-300 font-light">+</span>}
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs text-slate-600 font-medium text-center w-24 line-clamp-2">{p.name}</p>
                      <p className="text-xs font-bold text-slate-900">${p.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-slate-500 text-sm">Total for all 3 items</p>
                  <p className="text-2xl font-bold text-slate-900">${bundleTotal}</p>
                </div>
                <button onClick={handleAddAll}
                  className="flex items-center justify-center gap-2 bg-rose-500 text-white
                    px-8 py-3 rounded-xl font-bold hover:bg-rose-600 transition-colors
                    active:scale-[0.98] shadow-md shadow-rose-200 sm:ml-auto">
                  <ShoppingCart size={18} /> Add All to Cart
                </button>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
