import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products as productsData } from '../data/products';

const HOME_CATEGORIES = [
  { icon: '📸', label: 'Photo Gifts',        link: '/shop?category=photoGifts' },
  { icon: '🎨', label: 'Personalised Items',  link: '/shop?category=personalisedItems' },
  { icon: '🖼️', label: 'Caricatures & Art',  link: '/shop?category=caricatureArt' },
  { icon: '🪵', label: 'Wooden Crafts',       link: '/shop?category=woodenCrafts' },
  { icon: '💼', label: 'Corporate Gifts',     link: '/shop?category=corporateGifts' },
  { icon: '💎', label: '3D Crystals',         link: '/shop?category=personalisedItems' },
  { icon: '📱', label: 'Phone Cases',         link: '/shop?category=personalisedItems' },
  { icon: '🏆', label: 'Trophies',            link: '/shop?category=corporateGifts' },
];

const TRUST_BADGES = [
  { icon: '🎨', label: '100% Customized' },
  { icon: '📸', label: 'Photo to Gift in 24hrs' },
  { icon: '🚚', label: 'Chennai & Pan-India Delivery' },
  { icon: '🧾', label: 'GST Invoice Available' },
  { icon: '⭐', label: '10,000+ Happy Customers' },
];

export default function Home() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    document.title = 'TRESOR GIFTS 🎁 — The Customized Gift Store';
    const targetTime = new Date().getTime() + 24 * 60 * 60 * 1000;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetTime - now;
      if (diff <= 0) { setTimeLeft('00:00:00'); clearInterval(interval); return; }
      const h = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
      const m = Math.floor((diff % (1000*60*60)) / (1000*60));
      const s = Math.floor((diff % (1000*60)) / 1000);
      setTimeLeft(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const bestsellers = productsData.filter(p => p.isBestseller).sort((a,b) => (b.rating||0)-(a.rating||0)).slice(0,12);
  const newArrivals = productsData.filter(p => p.isNew).slice(0,8);

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-white">

      {/* ── 1. HERO SECTION ── */}
      <section className="relative w-full bg-white border-b-4 border-red-600 py-20 px-4 sm:px-6 md:py-32 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* subtle pattern overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-5">
          <div className="absolute top-0 left-0 w-full h-full"
            style={{backgroundImage: 'radial-gradient(circle at 20% 50%, #DC2626 1px, transparent 1px), radial-gradient(circle at 80% 80%, #DC2626 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
        </div>

        {/* floating badge */}
        <div className="absolute top-10 right-10 md:right-20 bg-red-50 rounded-full px-5 py-2 animate-bounce cursor-default select-none hidden sm:flex items-center gap-2 z-10 border border-red-200">
          <span className="text-xl">⭐</span>
          <span className="font-semibold text-red-600 text-sm">10,000+ Happy Customers</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-[#111111] mb-6 max-w-4xl leading-tight z-10 px-4 drop-shadow-sm">
          Customized Gifts That <span className="text-red-600">Tell Your Story ✦</span>
        </h1>
        <p className="text-lg md:text-xl text-[#666666] mb-10 max-w-2xl z-10 font-medium">
          Photo gifts, personalised items, caricatures, wooden crafts and corporate gifts.
          Every gift made uniquely yours.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto z-10">
          <Link to="/shop" className="bg-red-600 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl hover:bg-red-700 hover:scale-105 transition-all text-center tracking-wide">
            Shop Now
          </Link>
          <Link to="/shop?category=caricatureArt" className="bg-white border-2 border-red-600 text-red-600 font-bold py-4 px-10 rounded-full hover:bg-red-50 transition-all text-center tracking-wide">
            Explore Caricatures
          </Link>
        </div>
      </section>

      {/* ── 2. CATEGORIES GRID ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">Shop by Category</h2>
          <p className="text-gray-500 mt-2 font-medium">Find the perfect customised gift</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {HOME_CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              to={cat.link}
              className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl
                bg-white hover:bg-red-600 border border-red-100 hover:border-red-600
                transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-sm"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
              <span className="text-sm font-bold text-gray-800 group-hover:text-white text-center leading-tight">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 3. FLASH SALE COUNTDOWN ── */}
      <section className="w-full py-8 bg-gray-900 border-y-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
          <h3 className="text-xl md:text-3xl font-black text-white flex items-center gap-2">
            <span>⚡</span> Limited Time Offers:
          </h3>
          <div className="text-3xl md:text-4xl font-mono font-black tracking-widest bg-red-600 text-white px-6 py-2 rounded-xl shadow-inner">
            {timeLeft || '24:00:00'}
          </div>
          <Link to="/shop?filter=Sale" className="ml-0 md:ml-6 bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-red-50 hover:scale-105 transition-transform shadow-xl">
            Shop Deals
          </Link>
        </div>
      </section>

      {/* ── 4. BESTSELLERS ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Top Bestsellers 🏆</h2>
            <p className="text-gray-500 font-medium">Loved by thousands of happy customers</p>
          </div>
          <Link to="/shop" className="inline-flex items-center font-bold text-red-600 hover:text-red-700 transition-colors">
            View All <ChevronRight size={20} />
          </Link>
        </div>
        <div className="flex overflow-x-auto gap-6 pb-8 snap-x hide-scrollbar w-full">
          {bestsellers.map((product) => (
            <div key={product.id} className="min-w-[260px] max-w-[260px] snap-start flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. GIFT FINDER CTA ── */}
      <section className="w-full py-20 px-4 sm:px-6 bg-white border-y border-gray-100 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-[#111111] mb-4 leading-tight">
            Not Sure <span className="text-red-600">What to Gift? 🎁</span>
          </h2>
          <p className="text-lg text-[#666666] mb-10 font-medium">
            Answer 3 questions — we'll find the perfect customised gift
          </p>
          <Link
            to="/gift-finder"
            className="inline-flex bg-red-600 text-white font-black py-4 px-12 rounded-full shadow-lg hover:bg-red-700 hover:scale-105 transition-all text-lg"
          >
            Start Gift Finder
          </Link>
        </div>
      </section>

      {/* ── 6. NEW ARRIVALS ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 rounded-full text-sm font-bold bg-red-600 text-white mb-4">JUST DROPPED</span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Fresh Arrivals 🌱</h2>
          <p className="text-gray-500 font-medium">Discover our newest additions</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/shop?filter=New" className="inline-flex border-2 border-red-600 text-red-600 font-bold py-3 px-8 rounded-full hover:bg-red-600 hover:text-white transition-colors">
            View All New Items
          </Link>
        </div>
      </section>

      {/* ── 7. TRUST BADGES ── */}
      <section className="w-full bg-[#FEF2F2] border-y border-[#FECACA] py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10 text-center text-red-600">
          {TRUST_BADGES.map((b) => (
            <div key={b.label} className="flex flex-col items-center gap-3 col-span-1 last:col-span-2 md:last:col-span-1">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white border border-red-200 shadow-sm">
                <span className="text-3xl">{b.icon}</span>
              </div>
              <span className="font-bold text-sm tracking-wide">{b.label}</span>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
