import { useState, useEffect } from 'react';
import { Search, Package, MapPin, Truck, CheckCircle2, ChevronRight } from 'lucide-react';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fake countdown for delivery
  const [timeLeft, setTimeLeft] = useState({ hours: 48, minutes: 12, seconds: 59 });

  useEffect(() => {
    if (!isTracking) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            hours = Math.max(0, hours - 1);
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTracking]);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setIsLoading(true);
    // Mock network request
    setTimeout(() => {
      setIsLoading(false);
      setIsTracking(true);
    }, 800);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header / Input Form */}
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-200 text-center">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Track Your Gift</h1>
          <p className="text-slate-500 max-w-md mx-auto mb-8">Enter your tracking number or Order ID below to see exactly where your package is.</p>
          
          <form onSubmit={handleTrackSubmit} className="max-w-lg mx-auto relative flex">
            <input 
              type="text" 
              placeholder="e.g. GH-123456" 
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              className="w-full border border-slate-300 rounded-full pl-6 pr-32 py-4 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-lg shadow-sm"
            />
            <button 
              type="submit" 
              disabled={isLoading || !orderId.trim()}
              className="absolute right-2 top-2 bottom-2 bg-slate-900 text-white px-6 rounded-full font-bold hover:bg-rose-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Track <Search size={16} /></>
              )}
            </button>
          </form>
        </div>

        {/* Tracking Results */}
        {isTracking && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block bg-slate-100 text-slate-700 font-mono font-bold px-3 py-1 rounded mb-4 text-sm">
                  Tracking #: {orderId.includes('-') ? orderId.toUpperCase() : `GH-${orderId.toUpperCase()}`}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Arriving in {timeLeft.hours} days</h2>
                <div className="flex gap-4 mb-6">
                  <div className="text-center">
                    <span className="block text-3xl font-bold text-rose-500 font-mono">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Hours</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-300">:</div>
                  <div className="text-center">
                    <span className="block text-3xl font-bold text-rose-500 font-mono">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Mins</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-300">:</div>
                  <div className="text-center">
                    <span className="block text-3xl font-bold text-rose-500 font-mono">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Secs</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full w-[65%] rounded-full relative">
                    <div className="absolute inset-0 bg-white/20" style={{ backgroundSize: '1rem 1rem', backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)' }} />
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="h-64 bg-slate-100 rounded-2xl border border-slate-200 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
                
                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg flex items-center gap-3 relative z-10 animate-bounce">
                  <div className="w-10 h-10 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm ring-2 ring-rose-500">
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">📍 On the way!</p>
                    <p className="text-xs text-slate-500">Last scanned: Sort Facility</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-8 font-serif text-xl border-b border-slate-100 pb-4">Shipping History</h3>
              
              <div className="relative">
                <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100"></div>
                <div className="absolute left-[19px] top-4 h-[50%] w-0.5 bg-rose-500"></div>

                <div className="space-y-8 relative">
                  {/* Status 1 */}
                  <div className="flex gap-6 items-start opacity-30">
                    <div className="w-10 h-10 rounded-full bg-slate-100 outline outline-4 outline-white text-slate-400 flex items-center justify-center z-10 shrink-0">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Delivered</p>
                      <p className="text-sm text-slate-500 mt-1">Pending delivery</p>
                    </div>
                  </div>

                  {/* Status 2 */}
                  <div className="flex gap-6 items-start opacity-30">
                    <div className="w-10 h-10 rounded-full bg-slate-100 outline outline-4 outline-white text-slate-400 flex items-center justify-center z-10 shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Out for Delivery</p>
                      <p className="text-sm text-slate-500 mt-1">Pending courier assignment</p>
                    </div>
                  </div>

                  {/* Status 3 - CURRENT */}
                  <div className="flex gap-6 items-start">
                    <div className="w-10 h-10 rounded-full bg-rose-500 outline outline-4 outline-white text-white flex items-center justify-center z-10 shrink-0 shadow-lg shadow-rose-200 ring-4 ring-rose-50 relative">
                      <div className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-50"></div>
                      <Truck size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-rose-600">In Transit - Sort Facility</p>
                      <p className="text-sm text-slate-500 mt-1">Your package has departed the regional sort facility.</p>
                      <p className="text-xs font-semibold text-slate-400 mt-2">Today, 08:24 AM</p>
                    </div>
                  </div>

                  {/* Status 4 */}
                  <div className="flex gap-6 items-start">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 outline outline-4 outline-white text-white flex items-center justify-center z-10 shrink-0 shadow-sm">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Package Picked Up</p>
                      <p className="text-sm text-slate-500 mt-1">Courier has received your package.</p>
                      <p className="text-xs font-semibold text-slate-400 mt-2">Yesterday, 04:15 PM</p>
                    </div>
                  </div>

                   {/* Status 5 */}
                   <div className="flex gap-6 items-start">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 outline outline-4 outline-white text-white flex items-center justify-center z-10 shrink-0 shadow-sm">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Order Placed & Confirmed</p>
                      <p className="text-sm text-slate-500 mt-1">We've received your order and are preparing the items.</p>
                      <p className="text-xs font-semibold text-slate-400 mt-2">Yesterday, 09:30 AM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
