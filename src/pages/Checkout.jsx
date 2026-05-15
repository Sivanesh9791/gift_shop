import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, ChevronRight, Lock, Gift, Truck, CreditCard, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Australia', 'New Zealand'];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, cartTotal, giftWrapTotal, coupon, applyCoupon, clearCart } = useCart();
  
  const [step, setStep] = useState(1); // 1 = Delivery, 2 = Payment, 3 = Review
  
  // -- STEP 1 STATE --
  const [isGift, setIsGift] = useState(false);
  const [giftReceipt, setGiftReceipt] = useState(true);
  const [deliveryData, setDeliveryData] = useState({
    fullName: '', email: '', phone: '',
    address1: '', address2: '', city: '', state: '', postcode: '', country: 'United States',
    rFullName: '', rAddress1: '', rAddress2: '', rCity: '', rState: '', rPostcode: '', rCountry: 'United States'
  });
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryError, setDeliveryError] = useState('');

  // -- STEP 2 STATE --
  const [paymentData, setPaymentData] = useState({
    cardNumber: '', expiry: '', cvv: '', nameOnCard: ''
  });
  const [paymentError, setPaymentError] = useState('');
  const [promoCode, setPromoCode] = useState('');

  // Cart redirects if empty
  useEffect(() => {
    if (items.length === 0 && step === 1) {
      toast('Your cart is empty', { icon: '🛒' });
      navigate('/shop');
    }
  }, [items, navigate, step]);

  // Pricing setup
  const SHIPPING_THRESHOLD = 40;
  let orderDiscount = 0;
  let finalGiftWrapTotal = giftWrapTotal;
  
  if (coupon === 'GIFTWRAP') {
    orderDiscount = giftWrapTotal;
    finalGiftWrapTotal = 0;
  } else if (coupon === 'SAVE10') {
    orderDiscount = (cartTotal + giftWrapTotal) * 0.10;
  } else if (coupon === 'WELCOME15') {
    orderDiscount = (cartTotal + giftWrapTotal) * 0.15;
  }

  // Calculate delivery cost
  let deliveryCost = 0;
  if (deliveryMethod === 'express') deliveryCost = 9.99;
  else if (deliveryMethod === 'sameday') deliveryCost = 19.99;
  else deliveryCost = cartTotal >= SHIPPING_THRESHOLD ? 0 : 4.99; // Standard

  const grandTotal = cartTotal + finalGiftWrapTotal + deliveryCost - orderDiscount;

  // Handlers
  const handleInputChange = (e, setter) => {
    setter(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDeliverySubmit = (e) => {
    e.preventDefault();
    setDeliveryError('');
    if (!deliveryData.fullName || !deliveryData.email || !deliveryData.address1 || !deliveryData.city || !deliveryData.postcode) {
      setDeliveryError('Please fill in all required fields.');
      return;
    }
    if (isGift && (!deliveryData.rFullName || !deliveryData.rAddress1 || !deliveryData.rCity || !deliveryData.rPostcode)) {
      setDeliveryError('Please fill in required recipient details.');
      return;
    }
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setPaymentError('');
    if (!paymentData.cardNumber || !paymentData.expiry || !paymentData.cvv || !paymentData.nameOnCard) {
      setPaymentError('Please fill in all payment fields.');
      return;
    }
    // Simple basic validation
    if (paymentData.cardNumber.replace(/\s+/g, '').length < 15) {
      setPaymentError('Invalid card number.');
      return;
    }
    setStep(3);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = () => {
    // Generate mock order data
    const orderData = {
      orderId: 'GT' + Math.floor(100000 + Math.random() * 900000),
      items: items,
      total: grandTotal,
      deliveryData,
      deliveryMethod,
      isGift,
      email: deliveryData.email
    };
    
    clearCart();
    // Navigate with state
    navigate('/order-confirmation', { state: orderData });
    window.scrollTo(0, 0);
  };

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (['GIFTWRAP', 'SAVE10', 'WELCOME15'].includes(code)) {
      applyCoupon(code);
      toast.success('Promo code applied!');
      setPromoCode('');
    } else {
      toast.error('Invalid promo code');
    }
  };

  // Card Type Detection
  const getCardIcon = () => {
    const num = paymentData.cardNumber.replace(/\s+/g, '');
    if (num.startsWith('4')) return 'VISA'; // very naive
    if (num.startsWith('5')) return 'MC';
    return null;
  };

  // Build Date Options (Today + max delivery days to +7 days)
  const maxDeliveryDays = items.length > 0 ? Math.max(...items.map(i => i.product.deliveryDays || 3)) : 3;
  const dateOptions = [];
  for (let i = maxDeliveryDays; i <= maxDeliveryDays + 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dateOptions.push(date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
  }

  // Get active form state
  const d = deliveryData;

  const steps = [
    { num: 1, label: 'Delivery Details' },
    { num: 2, label: 'Payment' },
    { num: 3, label: 'Review' }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <Link to="/" className="font-serif text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-pink-500">
            GIFTINY 🎁
          </Link>
          <div className="flex items-center gap-2 text-sm font-medium">
            {steps.map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                  step > s.num ? 'bg-emerald-500 text-white' : 
                  step === s.num ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {step > s.num ? <Check size={12} /> : s.num}
                </div>
                <span className={`ml-2 ${step === s.num ? 'text-slate-900' : 'text-slate-500'}`}>{s.label}</span>
                {idx < steps.length - 1 && <ChevronRight size={16} className="mx-2 text-slate-300" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-8 items-start">
        {/* LEFT COLUMN: WIZARD */}
        <div className="w-full lg:w-2/3 space-y-6">
          
          {/* STEP 1: DELIVERY */}
          {step === 1 && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Truck className="text-rose-500" /> Delivery Details</h2>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
                <div>
                  <p className="font-bold text-slate-900">Sending as a gift?</p>
                  <p className="text-xs text-slate-500 mt-0.5">Send directly to the recipient instead of yourself</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsGift(!isGift)}
                  className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${isGift ? 'bg-rose-500' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isGift ? 'translate-x-6' : ''}`} />
                </button>
              </div>

              {deliveryError && (
                <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg flex flex-row items-center gap-2">
                  <AlertCircle size={16} /> {deliveryError}
                </div>
              )}

              <form onSubmit={handleDeliverySubmit}>
                {/* Billing/Your Details */}
                <h3 className="font-semibold text-slate-800 mb-4">{isGift ? 'Your Details (Sender)' : 'Delivery Address'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                    <input type="text" name="fullName" value={d.fullName} onChange={e => handleInputChange(e, setDeliveryData)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-shadow" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                    <input type="email" name="email" value={d.email} onChange={e => handleInputChange(e, setDeliveryData)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-shadow" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input type="tel" name="phone" value={d.phone} onChange={e => handleInputChange(e, setDeliveryData)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-shadow" />
                  </div>
                  
                  {!isGift && (
                    <>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 1 *</label>
                        <input type="text" name="address1" value={d.address1} onChange={e => handleInputChange(e, setDeliveryData)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-shadow" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 2 (Optional)</label>
                        <input type="text" name="address2" value={d.address2} onChange={e => handleInputChange(e, setDeliveryData)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-shadow" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
                        <input type="text" name="city" value={d.city} onChange={e => handleInputChange(e, setDeliveryData)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-shadow" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">State/Province</label>
                          <input type="text" name="state" value={d.state} onChange={e => handleInputChange(e, setDeliveryData)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-shadow" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Postcode / ZIP *</label>
                          <input type="text" name="postcode" value={d.postcode} onChange={e => handleInputChange(e, setDeliveryData)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-shadow" />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Country *</label>
                        <select name="country" value={d.country} onChange={e => handleInputChange(e, setDeliveryData)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-shadow appearance-none">
                          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </>
                  )}
                </div>

                {isGift && (
                  <div className="mt-8 pt-6 border-t border-slate-200 animate-in slide-in-from-top-4 fade-in">
                    <h3 className="font-semibold text-slate-800 mb-1">Recipient's Details</h3>
                    <p className="text-sm text-slate-500 mb-4">Where should we send the gift?</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Recipient's Full Name *</label>
                        <input type="text" name="rFullName" value={d.rFullName} onChange={e => handleInputChange(e, setDeliveryData)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-shadow" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 1 *</label>
                        <input type="text" name="rAddress1" value={d.rAddress1} onChange={e => handleInputChange(e, setDeliveryData)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-shadow" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 2 (Optional)</label>
                        <input type="text" name="rAddress2" value={d.rAddress2} onChange={e => handleInputChange(e, setDeliveryData)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-shadow" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
                        <input type="text" name="rCity" value={d.rCity} onChange={e => handleInputChange(e, setDeliveryData)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-shadow" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                          <input type="text" name="rState" value={d.rState} onChange={e => handleInputChange(e, setDeliveryData)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-shadow" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Postcode *</label>
                          <input type="text" name="rPostcode" value={d.rPostcode} onChange={e => handleInputChange(e, setDeliveryData)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-shadow" />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Country *</label>
                        <select name="rCountry" value={d.rCountry} onChange={e => handleInputChange(e, setDeliveryData)} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-shadow appearance-none">
                          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>

                    <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <div className="relative flex items-center">
                        <input type="checkbox" checked={giftReceipt} onChange={e => setGiftReceipt(e.target.checked)} className="peer w-5 h-5 rounded border-slate-300 text-rose-500 focus:ring-rose-500 cursor-pointer" />
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-slate-900 block">Include gift receipt</span>
                        <span className="text-sm text-slate-500">Hides prices on the packing slip.</span>
                      </div>
                    </label>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-200">
                  <h3 className="font-semibold text-slate-800 mb-4">Delivery Method</h3>
                  
                  <div className="space-y-3">
                    <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${deliveryMethod === 'standard' ? 'border-rose-500 bg-rose-50' : 'border-slate-200 hover:border-slate-300'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="deliveryMethod" value="standard" checked={deliveryMethod === 'standard'} onChange={() => setDeliveryMethod('standard')} className="w-4 h-4 text-rose-600 focus:ring-rose-500 border-gray-300" />
                        <div>
                          <p className="font-semibold text-slate-900">Standard Delivery</p>
                          <p className="text-sm text-slate-500">3-5 business days</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">{cartTotal >= SHIPPING_THRESHOLD ? 'FREE' : '$4.99'}</span>
                    </label>

                    <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${deliveryMethod === 'express' ? 'border-rose-500 bg-rose-50' : 'border-slate-200 hover:border-slate-300'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="deliveryMethod" value="express" checked={deliveryMethod === 'express'} onChange={() => setDeliveryMethod('express')} className="w-4 h-4 text-rose-600 focus:ring-rose-500 border-gray-300" />
                        <div>
                          <p className="font-semibold text-slate-900">Express Delivery</p>
                          <p className="text-sm text-slate-500">1-2 business days</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">$9.99</span>
                    </label>
                    
                    <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${deliveryMethod === 'sameday' ? 'border-rose-500 bg-rose-50' : 'border-slate-200 hover:border-slate-300'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="deliveryMethod" value="sameday" checked={deliveryMethod === 'sameday'} onChange={() => setDeliveryMethod('sameday')} className="w-4 h-4 text-rose-600 focus:ring-rose-500 border-gray-300" />
                        <div>
                          <p className="font-semibold text-slate-900 flex items-center gap-2">Same Day Delivery <span className="bg-slate-900 text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">Fastest</span></p>
                          <p className="text-sm text-slate-500">Delivered today (Order before 2 PM)</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">$19.99</span>
                    </label>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200">
                  <h3 className="font-semibold text-slate-800 mb-1">Choose Delivery Date (Optional)</h3>
                  <p className="text-sm text-slate-500 mb-4">Want it delivered on a specific day?</p>
                  <select 
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                    value={deliveryDate}
                    onChange={e => setDeliveryDate(e.target.value)}
                  >
                    <option value="">Earliest possible (Based on selected method)</option>
                    {dateOptions.map(date => (
                      <option key={date} value={date}>{date}</option>
                    ))}
                  </select>
                </div>

                <div className="mt-8 flex justify-end">
                  <button type="submit" className="bg-rose-600 text-white font-bold py-3.5 px-8 rounded-xl flex items-center gap-2 hover:bg-rose-700 shadow-lg shadow-rose-200 transition-colors active:scale-95 group">
                    Continue to Payment <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: PAYMENT */}
          {step === 2 && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-between">
                <span className="flex items-center gap-2"><CreditCard className="text-rose-500" /> Payment Details</span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                  <Lock size={12} /> Pay securely with SSL
                </span>
              </h2>

              {paymentError && (
                <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg flex flex-row items-center gap-2">
                  <AlertCircle size={16} /> {paymentError}
                </div>
              )}

              <form onSubmit={handlePaymentSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="cardNumber" 
                        placeholder="0000 0000 0000 0000"
                        maxLength="19"
                        value={paymentData.cardNumber}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
                          setPaymentData(p => ({ ...p, cardNumber: val }));
                        }}
                        className="w-full border border-slate-300 rounded-lg pl-4 pr-12 py-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none font-mono tracking-wider transition-shadow" 
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                        {getCardIcon() === 'VISA' && <div className="w-8 h-5 bg-blue-600 rounded text-white text-[8px] flex items-center justify-center font-bold px-1 italic">VISA</div>}
                        {getCardIcon() === 'MC' && <div className="w-8 h-5 bg-slate-800 rounded flex items-center justify-center relative"><div className="w-3 h-3 bg-red-500 rounded-full opacity-80 mix-blend-screen absolute -translate-x-1"></div><div className="w-3 h-3 bg-yellow-400 rounded-full opacity-80 mix-blend-screen absolute translate-x-1"></div></div>}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                      <input 
                        type="text" 
                        name="expiry" 
                        placeholder="MM/YY" 
                        maxLength="5"
                        value={paymentData.expiry}
                        onChange={e => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
                          setPaymentData(p => ({ ...p, expiry: val }));
                        }}
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none font-mono transition-shadow" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
                      <input 
                        type="password" 
                        name="cvv" 
                        placeholder="123" 
                        maxLength="4"
                        value={paymentData.cvv}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '');
                          setPaymentData(p => ({ ...p, cvv: val }));
                        }}
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none font-mono transition-shadow" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name on Card</label>
                    <input 
                      type="text" 
                      name="nameOnCard" 
                      placeholder="Jane Doe"
                      value={paymentData.nameOnCard}
                      onChange={e => handleInputChange(e, setPaymentData)}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-shadow" 
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-between items-center">
                  <button type="button" onClick={() => setStep(1)} className="text-slate-500 font-semibold hover:text-slate-900 transition-colors">
                    ← Back
                  </button>
                  <button type="submit" className="bg-rose-600 text-white font-bold py-3.5 px-8 rounded-xl flex items-center gap-2 hover:bg-rose-700 shadow-lg shadow-rose-200 transition-colors active:scale-95 group">
                    Review Order <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: REVIEW */}
          {step === 3 && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Check className="text-rose-500" /> Review & Confirm</h2>
              
              <div className="space-y-6">
                
                {/* 1. Items */}
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <h3 className="font-semibold text-slate-800">Order Items</h3>
                    <Link to="/cart" className="text-xs font-semibold text-rose-500 hover:text-rose-700 underline">Edit Cart</Link>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl divide-y divide-slate-100">
                    {items.map(item => (
                      <div key={item.product.id} className="p-4 flex gap-4">
                        <img src={item.product.images[0]} alt="" className="w-16 h-16 rounded-lg object-cover bg-white border border-slate-100" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 text-sm line-clamp-1">{item.product.name}</p>
                          <div className="text-slate-500 text-xs mt-1 space-y-1">
                            <p>Qty: {item.qty} × ${(item.product.price).toFixed(2)}</p>
                            {item.giftWrap && <p className="text-amber-600 font-medium">🎁 Wrap: {item.selectedWrapStyle} (+$3.99)</p>}
                            {item.personalisationText && <p>✍️ Custom: "{item.personalisationText}"</p>}
                          </div>
                        </div>
                        <p className="font-bold text-slate-900 text-sm">${(item.product.price * item.qty).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Delivery Info */}
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <h3 className="font-semibold text-slate-800">Delivery Information</h3>
                    <button onClick={() => setStep(1)} className="text-xs font-semibold text-rose-500 hover:text-rose-700 underline">Edit</button>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">To</p>
                        <p className="font-medium text-slate-900">{isGift ? deliveryData.rFullName : deliveryData.fullName}</p>
                        <p>{isGift ? deliveryData.rAddress1 : deliveryData.address1}</p>
                        <p>{isGift ? deliveryData.rCity : deliveryData.city}, {isGift ? deliveryData.rPostcode : deliveryData.postcode}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Method</p>
                        <p className="font-medium text-slate-900 capitalize">{deliveryMethod} Delivery</p>
                        {deliveryDate && <p className="text-slate-500 mt-1 flex items-center gap-1">Requested: {deliveryDate}</p>}
                        {isGift && giftReceipt && <p className="text-emerald-600 font-semibold mt-1">✓ Gift Receipt included</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Payment Info */}
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <h3 className="font-semibold text-slate-800">Payment details</h3>
                    <button onClick={() => setStep(2)} className="text-xs font-semibold text-rose-500 hover:text-rose-700 underline">Edit</button>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 flex items-center gap-3">
                    <CreditCard size={20} className="text-slate-400" />
                    <p className="font-medium">Card ending in •••• {paymentData.cardNumber.slice(-4)}</p>
                  </div>
                </div>

              </div>

              <div className="mt-8 flex justify-between items-center pt-6 border-t border-slate-200">
                <button type="button" onClick={() => setStep(2)} className="text-slate-500 font-semibold hover:text-slate-900 transition-colors">
                  ← Back
                </button>
                <button onClick={handlePlaceOrder} className="bg-gradient-to-r from-rose-600 to-pink-500 text-white font-bold py-4 px-10 rounded-xl text-lg hover:from-rose-700 hover:to-pink-600 shadow-xl shadow-rose-300 transition-all active:scale-95">
                  Confirm & Place Order
                </button>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: SUMMARY */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h3>

            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-medium text-slate-900">${cartTotal.toFixed(2)}</span>
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
              <div className="flex justify-between text-slate-600 pb-4 border-b border-slate-100">
                <span>Delivery</span>
                <span className="font-medium text-slate-900">{deliveryCost === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `$${deliveryCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between items-end pt-2">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-3xl font-bold text-slate-900">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo code allowed in step 1 and 2 */}
            {step < 3 && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <form onSubmit={handlePromoSubmit} className="flex relative">
                  <input 
                    type="text" 
                    placeholder="Enter Promo Code" 
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 uppercase"
                  />
                  <button type="submit" disabled={!promoCode.trim()} className="absolute right-2 top-2 bottom-2 bg-slate-900 text-white px-4 font-semibold text-xs rounded-lg disabled:opacity-50 hover:bg-rose-600 transition-colors">
                    Apply
                  </button>
                </form>
                {coupon && (
                  <div className="mt-3 bg-emerald-50 text-emerald-700 text-xs font-semibold px-4 py-2.5 rounded-lg border border-emerald-100">
                    ✓ Code applied successfully
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">
              <Lock size={14} /> Secure 256-bit SSL encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
