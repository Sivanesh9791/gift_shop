import { useState, useEffect } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Package, Truck, Calendar, ArrowRight, Share2, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const CONFETTI_COLORS = ['bg-rose-500', 'bg-emerald-500', 'bg-blue-500', 'bg-amber-400', 'bg-purple-500'];

const Confetti = () => {
  const [pieces, setPieces] = useState([]);
  
  useEffect(() => {
    // Generate 60 confetti pieces
    const newPieces = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + 'vw',
      delay: Math.random() * 2 + 's',
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: Math.random() * 8 + 6 + 'px', // 6px to 14px
      shape: Math.random() > 0.5 ? 'rounded-full' : 'rounded-sm'
    }));
    setPieces(newPieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      {pieces.map(p => (
        <div 
          key={p.id} 
          className={`absolute top-0 animate-confetti ${p.color} ${p.shape}`}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay
          }}
        />
      ))}
    </div>
  );
};

export default function OrderConfirmation() {
  const { state } = useLocation();
  const [copied, setCopied] = useState(false);

  // If no state exists (accessed directly), fake an order or redirect. We'll use a mocked fallback to satisfy the prompt if opened directly, but realistically it should redirect.
  // We'll redirect if completely missing.
  if (!state) {
    return <Navigate to="/" replace />;
  }

  const { orderId, items, total, deliveryData, deliveryMethod, isGift, email } = state;

  const dateStr = new Date();
  dateStr.setDate(dateStr.getDate() + (deliveryMethod === 'sameday' ? 0 : deliveryMethod === 'express' ? 2 : 5));
  const estimatedDate = dateStr.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const shareText = encodeURIComponent(`Just sent a gift from GIFTINY 🎁 Check it out!`);
  const shareUrl = encodeURIComponent(`https://giftiny.shop`);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://giftiny.shop`);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 relative">
      <Confetti />
      
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Block */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden text-center relative pt-16 pb-12 px-6">
          <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-check">
            <CheckCircle2 size={56} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4 tracking-tight">Order Confirmed! 🎉</h1>
          <p className="text-slate-600 text-lg mb-2">Thank you for your order, {deliveryData.fullName.split(' ')[0] || 'Friend'}.</p>
          <div className="inline-block bg-slate-100 text-slate-700 font-mono font-bold px-4 py-2 rounded-lg tracking-wider mb-4">
            Order #{orderId}
          </div>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            A confirmation email and your receipt have been sent to <span className="font-bold text-slate-700">{email}</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          <div className="space-y-8">
            {/* Timeline */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6 font-serif">What happens next?</h2>
              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute left-[21px] top-[24px] bottom-[24px] w-0.5 bg-slate-100" />
                
                <ul className="space-y-6 relative">
                  <li className="flex gap-4 items-start">
                    <div className="w-11 h-11 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 z-10 shadow-sm shadow-emerald-200">
                      <CheckCircle2 size={20} />
                    </div>
                    <div className="pt-2">
                      <p className="font-bold text-slate-900">Order Confirmed</p>
                      <p className="text-sm text-slate-500 mt-0.5">We've received your request.</p>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start opacity-75">
                    <div className="w-11 h-11 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0 z-10 border-2 border-white ring-1 ring-slate-200">
                      <Package size={20} />
                    </div>
                    <div className="pt-2">
                      <p className="font-bold text-slate-900">Being Packed</p>
                      <p className="text-sm text-slate-500 mt-0.5">Customizing and preparing items.</p>
                    </div>
                  </li>
                  {isGift && (
                    <li className="flex gap-4 items-start opacity-50">
                      <div className="w-11 h-11 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0 z-10 border-2 border-white ring-1 ring-slate-200">
                        <Gift size={20} />
                      </div>
                      <div className="pt-2">
                        <p className="font-bold text-slate-900">Gift Wrapped</p>
                        <p className="text-sm text-slate-500 mt-0.5">Adding wrapping and your card.</p>
                      </div>
                    </li>
                  )}
                  <li className="flex gap-4 items-start opacity-40">
                    <div className="w-11 h-11 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0 z-10 border-2 border-white ring-1 ring-slate-200">
                      <Truck size={20} />
                    </div>
                    <div className="pt-2">
                      <p className="font-bold text-slate-900">Out for Delivery</p>
                      <p className="text-sm text-slate-500 mt-0.5">Handed over to postal couriers.</p>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start opacity-30">
                    <div className="w-11 h-11 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0 z-10 border-2 border-white ring-1 ring-slate-200">
                      <Calendar size={20} />
                    </div>
                    <div className="pt-2">
                      <p className="font-bold text-slate-900">Delivered</p>
                      <p className="text-sm text-slate-500 mt-0.5">Arrived at the destination.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Gift Tag styling */}
            {isGift && items.some(i => i.giftMessage) && (
              <div className="bg-rose-50 p-6 md:p-8 rounded-3xl border border-rose-100 relative">
                <div className="absolute top-0 right-8 w-12 h-6 bg-slate-50 rounded-b-full shadow-sm"></div>
                <div className="w-4 h-4 bg-white rounded-full mx-auto -mt-2 shadow-inner border border-rose-200 mb-6 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-[1px] bg-amber-700/20 rotate-45 -z-10 w-[200px]" />
                </div>
                <h3 className="text-center font-serif font-bold text-rose-800 text-xl mb-4">Gift Message</h3>
                {items.filter(i => i.giftMessage).map((item, idx) => (
                  <div key={idx} className="mb-4 last:mb-0 text-center">
                    <p className="italic font-serif text-slate-700 text-lg leading-relaxed">"{item.giftMessage}"</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-rose-400 mt-2">— for {deliveryData.rFullName}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8">
            {/* Order Summary */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6 font-serif">Order Details</h2>
              <div className="space-y-4 mb-6">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <img src={item.product.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover bg-slate-50 border border-slate-100" />
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 text-sm line-clamp-1">{item.product.name}</p>
                      <p className="text-slate-500 text-xs">Qty: {item.qty}</p>
                      {item.giftWrap && <p className="text-amber-600 text-[10px] font-bold uppercase tracking-wider mt-1">🎁 {item.selectedWrapStyle}</p>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-100 bg-slate-50 -mx-6 md:-mx-8 px-6 md:px-8 pb-2">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-slate-500 font-medium">Estimated Delivery:</span>
                  <span className="font-bold text-slate-900">{estimatedDate}</span>
                </div>
                <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-200/60">
                  <span className="font-bold text-slate-700">Total Paid</span>
                  <span className="text-2xl font-bold text-slate-900">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Share / Actions */}
            <div className="space-y-4">
              <Link to="/track-order" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-rose-600 shadow-md transition-colors">
                Track Your Order <ArrowRight size={18} />
              </Link>
              <Link to="/shop" className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-xl flex justify-center hover:bg-slate-50 transition-colors">
                Continue Shopping
              </Link>
            </div>

            <div className="text-center pt-8">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Share the Love</p>
              <div className="flex justify-center gap-3">
                <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors">
                  <Share2 size={20} fill="currentColor" />
                </a>
                <a href={`https://wa.me/?text=${shareText}%20${shareUrl}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors">
                  <Share2 size={20} />
                </a>
                <button onClick={handleCopyLink} className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-800 hover:text-white transition-colors relative">
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
