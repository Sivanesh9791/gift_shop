import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Minus, Plus, Gift, ShoppingCart, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ReviewStars from './ReviewStars';

export default function QuickViewModal({ product, isOpen, onClose, onAddedToCart }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [giftWrap, setGiftWrap] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  if (!product) return null;

  const savings = product.compareAtPrice
    ? (product.compareAtPrice - product.price).toFixed(2)
    : null;

  function handleAdd() {
    addItem(product, qty, { giftWrap });
    onAddedToCart?.();
    onClose();
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        {/* Panel */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Close */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur shadow hover:bg-slate-100 transition-colors"
                >
                  <X size={18} className="text-slate-600" />
                </button>

                <div className="flex flex-col md:flex-row">
                  {/* Image column */}
                  <div className="md:w-1/2 bg-slate-50 flex flex-col">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.images[activeImg]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Thumbnails */}
                    {product.images.length > 1 && (
                      <div className="flex gap-2 p-3 overflow-x-auto">
                        {product.images.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveImg(i)}
                            className={`w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-colors ${
                              activeImg === i ? 'border-rose-500' : 'border-transparent hover:border-slate-300'
                            }`}
                          >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Info column */}
                  <div className="md:w-1/2 p-6 md:p-8 flex flex-col gap-4 overflow-y-auto max-h-[80vh] md:max-h-none">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      {product.isSale && <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-full">SALE</span>}
                      {product.isNew && <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">NEW</span>}
                      {product.isBestseller && <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">BESTSELLER</span>}
                    </div>

                    {/* Name */}
                    <Dialog.Title className="text-2xl font-bold text-slate-900 leading-tight">
                      {product.name}
                    </Dialog.Title>

                    <ReviewStars rating={product.rating} count={product.reviewCount} size={14} />

                    {/* Price */}
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-bold text-slate-900">₹{product.price}</span>
                      {product.compareAtPrice && (
                        <>
                          <span className="text-slate-400 line-through text-lg">₹{product.compareAtPrice}</span>
                          <span className="bg-rose-100 text-rose-700 text-sm font-bold px-2 py-0.5 rounded-full">
                            Save ₹{savings}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Short desc */}
                    <p className="text-slate-600 text-sm leading-relaxed">{product.shortDesc}</p>

                    {/* Free delivery */}
                    {product.freeDelivery && (
                      <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
                        <span>🚚</span> Free delivery in {product.deliveryDays} days
                      </div>
                    )}

                    {/* Qty picker */}
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-slate-700">Qty:</span>
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setQty(q => Math.max(1, q - 1))}
                          className="px-3 py-2 hover:bg-slate-100 transition-colors text-slate-600"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-4 py-2 font-semibold text-slate-900 min-w-[2.5rem] text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => setQty(q => q + 1)}
                          className="px-3 py-2 hover:bg-slate-100 transition-colors text-slate-600"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Gift wrap toggle */}
                    {product.giftWrappingAvailable && (
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div
                          onClick={() => setGiftWrap(v => !v)}
                          className={`relative w-11 h-6 rounded-full transition-colors ${giftWrap ? 'bg-rose-500' : 'bg-slate-200'}`}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${giftWrap ? 'translate-x-5' : ''}`} />
                        </div>
                        <span className="flex items-center gap-1.5 text-sm text-slate-700 group-hover:text-slate-900">
                          <Gift size={15} className="text-rose-500" />
                          Add gift wrapping <span className="text-slate-400">(+$3.99)</span>
                        </span>
                      </label>
                    )}

                    {/* CTA buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-2">
                      <button
                        onClick={handleAdd}
                        className="flex-grow flex items-center justify-center gap-2 bg-slate-900 text-white py-3 px-6 rounded-xl font-semibold hover:bg-rose-600 transition-colors active:scale-95"
                      >
                        <ShoppingCart size={18} />
                        Add to Cart
                      </button>
                      <Link
                        to={`/product/${product.slug}`}
                        onClick={onClose}
                        className="flex items-center justify-center gap-1.5 border border-slate-200 text-slate-700 py-3 px-5 rounded-xl font-medium hover:bg-slate-50 transition-colors text-sm"
                      >
                        Full Details <ExternalLink size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
