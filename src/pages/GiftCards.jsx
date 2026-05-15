import { useState } from 'react';
import { ShoppingCart, Mail, Printer, Truck, Gift } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

const DENOMINATIONS = [10, 25, 50, 100, 150];

export default function GiftCards() {
  const { addItem } = useCart();
  
  const [amount, setAmount] = useState(50);
  const [isCustom, setIsCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  
  const [deliveryType, setDeliveryType] = useState('email');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');

  const activeAmount = isCustom ? (Number(customAmount) || 0) : amount;

  const handleAddToCart = () => {
    if (isCustom && (activeAmount < 5 || activeAmount > 500)) {
      toast.error('Custom amount must be between ₹5 and ₹500');
      return;
    }
    if (deliveryType === 'email' && (!recipientName || !recipientEmail)) {
      toast.error('Please enter recipient email details');
      return;
    }

    const giftCardProduct = {
      id: `gift-card-${Date.now()}`,
      name: `GIFTINY ${deliveryType === 'physical' ? 'Physical' : 'eGift'} Card`,
      price: activeAmount + (deliveryType === 'physical' ? 3.99 : 0),
      images: ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop'],
      isGiftCard: true,
      category: 'Gift Cards'
    };

    addItem(
      giftCardProduct, 
      1, 
      false, 
      'None', 
      message 
        ? `To: ${recipientName}. ${deliveryType === 'email' ? `Email: ${recipientEmail}` : ''}. Msg: ${message}` 
        : `To: ${recipientName}. ${deliveryType === 'email' ? `Email: ${recipientEmail}` : ''}`
    );
    toast.success('Gift card added to cart! 💳');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Hero */}
      <div className="bg-slate-900 text-white py-16 px-4 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1600&fit=crop')] bg-cover bg-center blend-overlay" />
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Give the Gift of Choice</h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto">They know what they want. Let them choose from hundreds of personalized gifts with a GIFTINY gift card.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Form Settings */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
          
          {/* Amount Selection */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4">1. Choose an Amount</h2>
            <div className="flex flex-wrap gap-3">
              {DENOMINATIONS.map(val => (
                <button
                  key={val}
                  onClick={() => { setIsCustom(false); setAmount(val); }}
                  className={`w-20 h-14 rounded-xl font-bold text-lg transition-all ${!isCustom && amount === val ? 'bg-rose-500 text-white shadow-md ring-2 ring-rose-200 ring-offset-2' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-rose-300 hover:bg-rose-50'}`}
                >
                  ${val}
                </button>
              ))}
              <div className={`relative flex-grow sm:flex-grow-0 min-w-[140px] h-14 rounded-xl border transition-all ${isCustom ? 'border-rose-500 ring-2 ring-rose-200 ring-offset-2 bg-white' : 'border-slate-200 bg-slate-50'}`}>
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">$</span>
                <input 
                  type="number"
                  placeholder="Custom"
                  min="5" max="500"
                  value={customAmount}
                  onClick={() => setIsCustom(true)}
                  onChange={e => { setIsCustom(true); setCustomAmount(e.target.value); }}
                  className="w-full h-full bg-transparent pl-8 pr-4 font-bold text-slate-900 outline-none text-lg rounded-xl"
                />
              </div>
            </div>
            {isCustom && (activeAmount < 5 || activeAmount > 500) && (
              <p className="text-rose-500 text-xs font-bold mt-2">Custom amount must be between $5 and $500.</p>
            )}
          </section>

          {/* Delivery Method */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4">2. Delivery Method</h2>
            <div className="space-y-3">
              <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${deliveryType === 'email' ? 'border-rose-500 bg-rose-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input type="radio" checked={deliveryType === 'email'} onChange={() => setDeliveryType('email')} className="text-rose-500 focus:ring-rose-500 w-4 h-4 cursor-pointer" />
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-rose-500 shadow-sm"><Mail size={18} /></div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">Email (Instant)</p>
                  <p className="text-sm text-slate-500">Sent immediately to their inbox</p>
                </div>
              </label>

              <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${deliveryType === 'print' ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input type="radio" checked={deliveryType === 'print'} onChange={() => setDeliveryType('print')} className="text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer" />
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-amber-500 shadow-sm"><Printer size={18} /></div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">Print at Home</p>
                  <p className="text-sm text-slate-500">We'll email you a PDF to print</p>
                </div>
              </label>

              <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${deliveryType === 'physical' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input type="radio" checked={deliveryType === 'physical'} onChange={() => setDeliveryType('physical')} className="text-blue-500 focus:ring-blue-500 w-4 h-4 cursor-pointer" />
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-sm"><Truck size={18} /></div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">Physical Card</p>
                  <p className="text-sm text-slate-500">Mailed in 3-5 days (+$3.99 shipping)</p>
                </div>
              </label>
            </div>
          </section>

          {/* Details */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">3. Personalize Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Recipient Name</label>
                <input 
                  type="text" 
                  maxLength={30}
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  placeholder="e.g. Sarah Smith"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>
              
              {deliveryType === 'email' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Recipient Email</label>
                  <input 
                    type="email"
                    value={recipientEmail}
                    onChange={e => setRecipientEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Write a Message (Optional)</label>
                <textarea 
                  rows={3}
                  maxLength={150}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Wishing you a wonderful birthday!"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-500 outline-none resize-none"
                ></textarea>
                <p className="text-xs text-slate-400 text-right mt-1">{message.length}/150 characters</p>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column: Sticky Preview */}
        <div className="lg:sticky lg:top-24 space-y-6">
          
          <h2 className="text-lg font-bold text-slate-900 font-serif mb-2">Live Preview</h2>
          
          {/* Card Visual Mockup */}
          <div className="aspect-[1.586/1] bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 rounded-2xl shadow-xl p-6 md:p-8 text-white relative overflow-hidden flex flex-col justify-between">
            {/* Shapes */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-20 -left-10 w-60 h-60 bg-amber-300 opacity-20 rounded-full blur-3xl"></div>
            
            <div className="flex justify-between items-start relative z-10">
              <span className="font-serif text-2xl md:text-3xl font-bold tracking-tight">GIFTINY</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md">Gift Card</span>
            </div>

            <div className="relative z-10 flex flex-col items-end">
              <span className="text-5xl md:text-6xl font-bold tracking-tighter drop-shadow-md">
                ${activeAmount || '0'}
              </span>
            </div>
          </div>

          {/* Email Preview Mockup */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-50/50">
            <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 text-sm flex items-center gap-2">
              <Gift size={16} /> Attached Message Note
            </h3>
            <p className="font-serif text-2xl text-slate-900 mb-2">
              To: {recipientName || <span className="text-slate-300 italic">Recipient Name</span>}
            </p>
            <p className="text-slate-600 leading-relaxed italic min-h-[3rem]">
              {message ? `"${message}"` : <span className="text-slate-300">Your custom message will appear here...</span>}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-slate-500 text-sm">Total Due:</p>
              <p className="text-2xl font-bold text-slate-900">
                ${(activeAmount + (deliveryType === 'physical' ? 3.99 : 0)).toFixed(2)}
              </p>
            </div>
            <button 
              onClick={handleAddToCart}
              className="w-full sm:w-auto bg-slate-900 text-white font-bold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 hover:bg-rose-600 shadow-md transition-colors active:scale-95"
            >
              Add to Cart <ShoppingCart size={18} />
            </button>
          </div>

          <div className="text-center p-4 bg-slate-100 rounded-xl mt-4">
            <p className="text-sm text-slate-600">Have a gift card? <br/> <span className="font-bold text-slate-900">Redeem it during checkout 🛒</span></p>
          </div>

        </div>

      </div>
    </div>
  );
}
