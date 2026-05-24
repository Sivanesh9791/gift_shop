import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

export default function OccasionBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [bannerConfig, setBannerConfig] = useState(null);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('occasion_banner_dismissed') === 'true';
    if (isDismissed) return;

    const today = new Date();
    const month = today.getMonth() + 1; // 1-12
    const day = today.getDate();

    let config = null;

    // Feb 1-14: Valentine's
    if (month === 2 && day >= 1 && day <= 14) {
      config = {
        bg: 'from-pink-500 to-rose-500',
        text: '💝 Valentine\'s Day Gifts — Celebrate Love Indian Style',
        btnText: 'Shop Valentine\'s Gifts',
        link: '/shop?occasion=valentines'
      };
    } 
    // Oct 1-31: Diwali
    else if (month === 10) {
      config = {
        bg: 'from-orange-500 to-amber-500',
        text: '🪔 Diwali Special Gifts — Light Up Someone\'s Day',
        btnText: 'Shop Diwali Gifts',
        link: '/shop?occasion=diwali'
      };
    }
    // Dec 1-25: Christmas
    else if (month === 12 && day <= 25) {
      config = {
        bg: 'from-red-600 to-emerald-600',
        text: '🎄 Christmas & New Year Gifts — Spread the Joy',
        btnText: 'Shop Christmas Gifts',
        link: '/shop?occasion=christmas'
      };
    }
    // May 1-31: Mother's Day
    else if (month === 5) {
      config = {
        bg: 'from-pink-400 to-purple-500',
        text: '💐 Mother\'s Day — Celebrate Amma with Love'
      };
    }
    // Jun 1-21: Father's Day
    else if (month === 6 && day <= 21) {
      config = {
        bg: 'from-blue-500 to-indigo-600',
        text: '👔 Father\'s Day — Gift Your Hero',
        btnText: 'Shop Father\'s Day',
        link: '/shop?occasion=fathers-day'
      };
    }
    // Default
    else {
      config = {
        bg: 'from-purple-500 to-pink-500',
        text: '🎁 Free personalisation on orders over ₹500 | Use code CLASSYPIK',
        btnText: 'Shop Now',
        link: '/shop'
      };
    }

    setBannerConfig(config);
    setIsVisible(true);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('occasion_banner_dismissed', 'true');
  };

  if (!isVisible || !bannerConfig) return null;

  return (
    <div className={`w-full py-3 text-white text-center text-sm font-semibold relative bg-gradient-to-r ${bannerConfig.bg}`}>
      <div className="max-w-6xl mx-auto px-10 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <span>{bannerConfig.text}</span>
      
      </div>
      <button 
        onClick={handleDismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}
