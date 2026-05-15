import { useState, useMemo } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Trash2, Minus, Plus, ShoppingBag, Gift, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import productsData from '../data/products';
import GiftWrapModal from './GiftWrapModal';

const SHIPPING_THRESHOLD = 40;

const VALID_COUPONS = {
  'GIFTWRAP': { type: 'free_wrap', label: 'Free Gift Wrapping' },
  'SAVE10': { type: 'percent', value: 0.10, label: '10% Off' },
  'WELCOME15': { type: 'percent', value: 0.15, label: '15% Off' },
};

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, updateQty, cartTotal, giftWrapTotal, coupon, applyCoupon, addItem } = useCart();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  // Free shipping progress
  const amountToFreeShipping = Math.max(0, SHIPPING_THRESHOLD - cartTotal);
  const progressPct = Math.min(100, (cartTotal / SHIPPING_THRESHOLD) * 100);

  // You might also like (under $20, max 3)
  const suggested = useMemo(() => {
    const inCartIds = items.map(i => i.product.id);
    return productsData
      .filter(p => !inCartIds.includes(p.id) && p.price <= 30)
      .slice(0, 3);
  }, [items]);

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

  function handleAddSuggested(product) {
    addItem(product, 1);
    toast.success(`${product.name} added!`);
  }

  return (
    <>
      <Transition show={open} as="div">
        <Dialog as="div" className="relative z-[100]" onClose={onClose}>
          {/* Backdrop */}
          <Transition.Child
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
                <Transition.Child
                  enter="transform transition ease-in-out duration-400 sm:duration-500"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-400 sm:duration-500"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-full sm:w-96 max-w-full h-full flex flex-col bg-slate-50 shadow-2xl sm:rounded-l-2xl border-l border-slate-200 overflow-hidden">
                    
                    {/* Header */}
                    <div className="bg-white px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0 sticky top-0 z-10">
                      <Dialog.Title className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <ShoppingBag size={22} className="text-rose-500" /> 
                        Your Cart 
                        <span className="bg-slate-100 text-slate-600 text-sm py-0.5 px-2.5 rounded-full">
                          {items.reduce((s,i)=>s+i.qty, 0)}
                        </span>
                      </Dialog.Title>
                      <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition-all flex-shrink-0 ml-2">
                        <X size={20} />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-white px-5 py-4 border-b border-slate-100 shadow-sm z-10 flex-shrink-0">
                      <div className="flex justify-between items-end mb-2">
                        <p className="text-sm font-semibold text-slate-700">
                          {amountToFreeShipping === 0 
                            ? <span className="text-emerald-600 flex items-center gap-1.5 font-bold"><Gift size={16}/> 🎉 You've unlocked free shipping!</span> 
                            : `You're ₹${amountToFreeShipping.toFixed(2)} away from free shipping!`}
                        </p>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 rounded-full ${amountToFreeShipping === 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto overscroll-contain">
                      {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full px-5 text-center pb-20">
                          <div className="w-24 h-24 bg-rose-50 text-rose-300 rounded-full flex items-center justify-center mb-4">
                            <ShoppingBag size={40} />
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 mb-2">Your cart is empty</h3>
                          <p className="text-slate-500 text-sm mb-6 max-w-[250px]">Looks like you haven't added any gifts yet.</p>
                          <button onClick={() => { onClose(); navigate('/shop'); }} className="bg-slate-900 text-white font-semibold px-8 py-3 rounded-full hover:bg-rose-600 transition-colors shadow-md active:scale-95">
                            Start Shopping
                          </button>
                        </div>
                      ) : (
                        <div className="p-5 space-y-4">
                          {/* Cart Items */}
                          {items.map((item, idx) => (
                            <div key={`${item.product.id}-${idx}`} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4">
                              <img src={item.product.images[0]} alt={item.product.name} className="w-[72px] h-[72px] rounded-xl object-cover bg-slate-50" />
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                  <Link to={`/product/${item.product.slug}`} onClick={onClose} className="font-semibold text-slate-900 hover:text-rose-600 line-clamp-2 text-sm leading-tight pr-2">
                                    {item.product.name}
                                  </Link>
                                  <button onClick={() => removeItem(item.product.id)} className="text-slate-300 hover:text-rose-500 transition-colors flex-shrink-0">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                                
                                {item.giftWrap && (
                                  <div className="mt-1.5">
                                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full border border-amber-100 mb-1">
                                      <Gift size={10} /> {item.selectedWrapStyle} (+$3.99)
                                    </span>
                                    {item.giftMessage && (
                                      <p className="text-xs text-slate-500 italic line-clamp-1 break-words">"{item.giftMessage}"</p>
                                    )}
                                  </div>
                                )}

                                {item.personalisationText && (
                                  <p className="text-xs text-slate-500 mt-1 line-clamp-1 border-l-2 border-slate-200 pl-2">
                                    <span className="font-medium text-slate-600">Note:</span> {item.personalisationText}
                                  </p>
                                )}

                                <div className="flex items-center justify-between mt-3">
                                  <div className="flex items-center border border-slate-200 rounded-lg h-7">
                                    <button onClick={() => updateQty(item.product.id, item.qty - 1)} className="px-2 text-slate-500 hover:bg-slate-50 h-full flex items-center justify-center transition-colors">
                                      <Minus size={12} />
                                    </button>
                                    <span className="px-2 text-xs font-bold text-slate-900 w-6 text-center">{item.qty}</span>
                                    <button onClick={() => updateQty(item.product.id, item.qty + 1)} className="px-2 text-slate-500 hover:bg-slate-50 h-full flex items-center justify-center transition-colors">
                                      <Plus size={12} />
                                    </button>
                                  </div>
                                  <p className="font-bold text-slate-900 text-sm">₹{(item.product.price * item.qty).toFixed(2)}</p>
                                </div>

                                <button onClick={() => setEditingItem(item)} className="text-[11px] font-semibold text-rose-500 hover:text-rose-700 mt-2 underline underline-offset-2">
                                  Edit gift options
                                </button>
                              </div>
                            </div>
                          ))}

                          {/* You Might Also Like */}
                          {suggested.length > 0 && (
                            <div className="pt-4 pb-2">
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">You might also like</h4>
                              <div className="flex gap-3 overflow-x-auto pb-4 snap-x -mx-5 px-5 no-scrollbar">
                                {suggested.map(prod => (
                                  <div key={prod.id} className="bg-white border border-slate-100 rounded-xl p-3 w-[150px] flex-shrink-0 snap-center shadow-sm">
                                    <div className="w-full aspect-square bg-slate-50 rounded-lg mb-2 overflow-hidden">
                                      <img src={prod.images[0]} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <h5 className="font-medium text-slate-800 text-xs line-clamp-1 mb-1">{prod.name}</h5>
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-slate-900 text-sm">₹{prod.price}</span>
                                      <button onClick={() => handleAddSuggested(prod)} className="bg-slate-100 text-slate-700 hover:bg-rose-500 hover:text-white p-1.5 rounded-md transition-colors">
                                        <Plus size={14} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Coupon Code */}
                          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                            <form onSubmit={handleCouponSubmit} className="flex gap-2">
                              <input 
                                type="text" 
                                placeholder="Promo code (e.g. SAVE10)" 
                                value={couponInput}
                                onChange={e => setCouponInput(e.target.value)}
                                className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 uppercase"
                              />
                              <button type="submit" disabled={!couponInput.trim()} className="bg-slate-900 text-white px-4 py-2 font-semibold text-sm rounded-xl disabled:opacity-50 hover:bg-rose-600 transition-colors">
                                Apply
                              </button>
                            </form>
                            {coupon && (
                              <div className="mt-3 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-2 rounded-lg border border-emerald-100 flex justify-between items-center">
                                <span>🏷️ {VALID_COUPONS[coupon].label} applied!</span>
                                <button onClick={() => applyCoupon(null)} className="hover:text-emerald-900"><X size={14}/></button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer - Summary & Actions */}
                    {items.length > 0 && (
                      <div className="bg-white border-t border-slate-100 p-5 flex-shrink-0 sticky bottom-0 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                        <div className="space-y-2 mb-4 text-sm">
                          <div className="flex justify-between text-slate-600">
                            <span>Subtotal</span>
                            <span className="font-medium text-slate-900">₹{cartTotal.toFixed(2)}</span>
                          </div>
                          {giftWrapTotal > 0 && (
                            <div className="flex justify-between text-slate-600">
                              <span>Gift Wrapping</span>
                              <span className="font-medium text-slate-900">₹{giftWrapTotal.toFixed(2)}</span>
                            </div>
                          )}
                          {orderDiscount > 0 && (
                            <div className="flex justify-between text-emerald-600 font-medium">
                              <span>Discount {coupon ? `(${coupon})` : ''}</span>
                              <span>-₹{orderDiscount.toFixed(2)}</span>
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
                          <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between items-end">
                            <span className="font-bold text-slate-900">Total</span>
                            <span className="text-2xl font-bold text-slate-900">₹{grandTotal.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-5">
                          <button onClick={() => { onClose(); navigate('/cart'); }} className="col-span-1 border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-colors">
                            View Cart
                          </button>
                          <button onClick={() => { onClose(); navigate('/checkout'); }} className="col-span-1 bg-rose-600 text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 hover:bg-rose-700 shadow-md shadow-rose-200 transition-colors active:scale-95 group">
                            Checkout <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>

      <GiftWrapModal 
        open={!!editingItem} 
        onClose={() => setEditingItem(null)} 
        item={editingItem} 
      />
    </>
  );
}
