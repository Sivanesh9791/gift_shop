import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) setIsVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleManage = () => {
    localStorage.setItem('cookie_consent', 'managed');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white py-4 px-6 z-[60] shadow-[0_-4px_25px_rgba(0,0,0,0.1)] slide-in-from-bottom flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex-1 flex items-start sm:items-center gap-3 max-w-4xl text-sm leading-relaxed">
        <span className="text-2xl hidden sm:block">🍪</span>
        <p>
          We use cookies to improve your experience and personalise your gift recommendations. <br className="hidden md:block"/> 
          By continuing to use our site, you agree to our policies.
        </p>
      </div>
      <div className="flex gap-3 w-full md:w-auto shrink-0 mt-2 md:mt-0">
        <button 
          onClick={handleManage}
          className="flex-1 md:flex-none border border-white/30 text-white hover:bg-white/10 px-5 py-2.5 rounded-xl transition-colors text-sm font-semibold"
        >
          Manage Preferences
        </button>
        <button 
          onClick={handleAccept}
          className="flex-1 md:flex-none bg-rose-500 text-white hover:bg-rose-600 px-6 py-2.5 rounded-xl transition-colors shadow-lg text-sm font-bold"
        >
          Accept All
        </button>
      </div>
    </div>
  );
}
