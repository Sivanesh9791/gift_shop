import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, Gift, ArrowRight, Heart, ChevronRight, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const SHIPPING_THRESHOLD = 40;
const WRAP_STYLES = ['Classic Red 🎀', 'Floral Pink 🌸', 'Elegant Gold ✨'];

const VALID_COUPONS = {
  'GIFTWRAP': { type: 'free_wrap', label: 'Free Gift Wrapping' },
  'SAVE10': { type: 'percent', value: 0.10, label: '10% Off' },
  'WELCOME15': { type: 'percent', value: 0.15, label: '15% Off' },
};

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQty, updateGiftOptions, cartTotal, giftWrapTotal, coupon, applyCoupon, clearCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [couponInput, setCouponInput] = useState('');

  // Free shipping progress
  const amountToFreeShipping = Math.max(0, SHIPPING_THRESHOLD - cartTotal);
  const progressPct = Math.min(100, (cartTotal / SHIPPING_THRESHOLD) * 100);

  // Totals calculations
  let orderDiscount = 0;
  let finalGiftWrapTotal = giftWrapTotal;
  
  if (coupon) {
    const cp = VALID_COUPONS[coupon];
    if (cp) {
      if (cp.type === 'free_wrap') {
        orderDiscount = giftWrapTotal;
        finalGiftWrapTotal = 0;
      } else if (cp.type === 'percent') {
        orderDiscount = (cartTotal + giftWrapTotal) * cp.value;
      }
    }
  }

  const deliveryAmount = cartTotal >= SHIPPING_THRESHOLD ? 0 : 5.99;
  const grandTotal = cartTotal + finalGiftWrapTotal + (cartTotal === 0 ? 0 : deliveryAmount) - orderDiscount;

  function handleCouponSubmit(e) {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    
    if (VALID_COUPONS[code]) {
      applyCoupon(code);
      toast.success(`Coupon ${code} applied!`);
      setCouponInput('');
    } else {
      toast.error('Invalid coupon code');
    }
  }

  function handleSaveForLater(item) {
    if (!isInWishlist(item.product.id)) {
      toggleWishlist(item.product);
    }
    removeItem(item.product.id);
    toast.success('Moved to Saved for Later');
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="w-24 h-24 bg-white shadow-sm border border-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={48} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Your cart is empty</h1>
        <p className="text-slate-500 mb-8 max-w-sm">
          Looks like you haven't added any gifts yet. Need some inspiration?
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link to="/shop" className="bg-slate-900 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-rose-600 transition-colors shadow-md active:scale-95">
            Continue Shopping
          </Link>
          <Link to="/gift-finder" className="bg-white border text-rose-600 border-rose-200 font-bold px-8 py-3.5 rounded-xl hover:bg-rose-50 transition-colors active:scale-95">
            Try Gift Matchmaker
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to="/" className="hover:text-rose-600 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="font-medium text-slate-800">Your Cart</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 font-serif">
          Your Cart <span className="text-slate-400 font-sans text-xl font-normal ml-2">({items.reduce((acc, curr) => acc + curr.qty, 0)} items)</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Cart Items */}
          <div className="w-full lg:w-2/3 space-y-6">

            {/* Free shipping banner */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-full ${amountToFreeShipping === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-500'}`}>
                  <Gift size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">
                    {amountToFreeShipping === 0 
                      ? "🎉 You've unlocked free shipping!" 
                      : `You're $${amountToFreeShipping.toFixed(2)} away from free shipping!`}
                  </p>
                  <p className="text-sm text-slate-500">Adds automatically at checkout when you reach $40.</p>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mt-1">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${amountToFreeShipping === 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Item List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-100">
              {items.map((item, idx) => (
                <div key={`${item.product.id}-${idx}`} className="p-6 flex flex-col sm:flex-row gap-6 group">
                  <Link to={`/product/${item.product.slug}`} className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden block">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </Link>

                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex justify-between items-start gap-4 mb-1">
                      <Link to={`/product/${item.product.slug}`} className="text-lg font-bold text-slate-900 hover:text-rose-600 transition-colors line-clamp-2 pr-4">
                        {item.product.name}
                      </Link>
                      <p className="font-bold text-slate-900 text-lg">₹{(item.product.price * item.qty).toFixed(2)}</p>
                    </div>

                    <p className="text-sm text-slate-500 mb-4">{item.product.category}</p>

                    {/* Inline Form / Options Edit */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 mb-4">
                      {/* Personalisation inline */}
                      {item.product.isPersonalisable && (
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Personalisation</label>
                          <input 
                            type="text" 
                            value={item.personalisationText}
                            onChange={(e) => updateGiftOptions(item.product.id, { personalisationText: e.target.value })}
                            placeholder="Add your message..." 
                            className="w-full text-sm py-2 px-3 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                            maxLength={100}
                          />
                        </div>
                      )}

                      {/* Gift Wrap Inline */}
                      <div className={item.product.isPersonalisable ? "" : "md:col-span-2"}>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gift Wrapping (+$3.99)</label>
                          <button
                            type="button"
                            onClick={() => updateGiftOptions(item.product.id, { giftWrap: !item.giftWrap })}
                            className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${item.giftWrap ? 'bg-rose-500' : 'bg-slate-300'}`}
                          >
                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.giftWrap ? 'translate-x-4' : ''}`} />
                          </button>
                        </div>
                        {item.giftWrap && (
                          <div className="space-y-3 animate-in fade-in slide-in-from-top-1">
                            <select 
                              className="w-full text-sm py-2 px-3 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                              value={item.selectedWrapStyle || WRAP_STYLES[0]}
                              onChange={(e) => updateGiftOptions(item.product.id, { selectedWrapStyle: e.target.value })}
                            >
                              {WRAP_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <input 
                              type="text"
                              value={item.giftMessage}
                              onChange={(e) => updateGiftOptions(item.product.id, { giftMessage: e.target.value })}
                              placeholder="Gift message (optional)"
                              className="w-full text-sm py-2 px-3 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                              maxLength={150}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-slate-200 rounded-xl h-11 bg-white">
                          <button onClick={() => updateQty(item.product.id, item.qty - 1)} className="px-4 text-slate-500 hover:text-slate-900 transition-colors h-full">
                            <Minus size={14} />
                          </button>
                          <span className="font-bold text-slate-900 w-8 text-center">{item.qty}</span>
                          <button onClick={() => updateQty(item.product.id, item.qty + 1)} className="px-4 text-slate-500 hover:text-slate-900 transition-colors h-full">
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="hidden sm:flex items-center gap-1.5 border-l border-slate-200 pl-4">
                          <button onClick={() => removeItem(item.product.id)} className="text-sm font-semibold text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1.5 p-2 rounded-lg hover:bg-rose-50">
                            <Trash2 size={16} /> Remove
                          </button>
                          <button onClick={() => handleSaveForLater(item)} className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5 p-2 rounded-lg hover:bg-slate-100">
                            <Heart size={16} /> Save for Later
                          </button>
                        </div>
                      </div>

                      {/* Mobile Actions */}
                      <div className="flex sm:hidden items-center gap-3 w-full border-t border-slate-100 pt-3 mt-1">
                        <button onClick={() => removeItem(item.product.id)} className="flex-1 text-sm font-semibold text-rose-600 p-2 text-center rounded-lg bg-rose-50">
                          Remove
                        </button>
                        <button onClick={() => handleSaveForLater(item)} className="flex-1 text-sm font-semibold text-slate-700 p-2 text-center rounded-lg bg-slate-100">
                          Save Later
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-start">
              <button onClick={() => { clearCart(); toast.success('Cart cleared'); }} className="text-slate-400 font-medium hover:text-rose-600 underline text-sm transition-colors">
                Clear entirely
              </button>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-[15px]">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">₹{cartTotal.toFixed(2)}</span>
                </div>
                {giftWrapTotal > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Gift Wrapping</span>
                    <span className="font-medium text-slate-900">+${giftWrapTotal.toFixed(2)}</span>
                  </div>
                )}
                {orderDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount {coupon ? `(${coupon})` : ''}</span>
                    <span>-${orderDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span>
                  {deliveryAmount === 0 ? (
                    <span className="font-bold text-emerald-600">FREE</span>
                  ) : (
                    <span className="font-medium text-slate-900">₹{deliveryAmount.toFixed(2)}</span>
                  )}
                </div>
              </div>

              {/* Coupon */}
              <div className="mb-6 pt-6 border-t border-slate-100">
                <form onSubmit={handleCouponSubmit} className="flex flex-col gap-2 relative">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Promo Code</label>
                  <div className="flex relative">
                    <input 
                      type="text" 
                      placeholder="e.g. SAVE10" 
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 uppercase"
                    />
                    <button type="submit" disabled={!couponInput.trim()} className="absolute right-2 top-2 bottom-2 bg-slate-900 text-white px-4 font-semibold text-xs rounded-lg disabled:opacity-50 hover:bg-rose-600 transition-colors">
                      Apply
                    </button>
                  </div>
                </form>
                {coupon && (
                  <div className="mt-3 bg-emerald-50 text-emerald-700 text-xs font-semibold px-4 py-2.5 rounded-lg border border-emerald-100 flex justify-between items-center">
                    <span>🏷️ {VALID_COUPONS[coupon].label} applied!</span>
                    <button onClick={() => applyCoupon(null)} className="hover:text-emerald-900"><X size={14}/></button>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-6">
                <div className="flex justify-between items-end mb-8">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <span className="text-3xl font-bold text-slate-900">₹{grandTotal.toFixed(2)}</span>
                </div>

                <div className="space-y-3">
                  <button onClick={() => navigate('/checkout')} className="w-full bg-rose-600 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-rose-700 transition-colors shadow-md shadow-rose-200 active:scale-[0.98] group">
                    Proceed to Checkout <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button onClick={() => navigate('/shop')} className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-50 transition-colors active:scale-[0.98]">
                    Continue Shopping
                  </button>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100">🔒</span>
                Secure encrypted checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
