import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Truck, Gift, MessageSquare, RefreshCw, ShieldCheck, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products as productsData } from '../data/products';
import { categories } from '../data/categories';

const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    text: "Found the perfect personalized gift for my parents' anniversary! The gift wrapping was absolutely beautiful. Highly recommend to everyone.",
    photo: '/images/home-hero.svg'
  },
  {
    id: 2,
    name: "Michael Chen",
    text: "Super fast delivery and the quality of the engraved watch exceeded my expectations. Will definitely be ordering my Christmas gifts from here.",
    photo: '/images/home-hero.svg'
  },
  {
    id: 3,
    name: "Emma Williams",
    text: "The gift finder quiz is a lifesaver! I never know what to buy for my brother but it suggested some great items. He loved his present.",
    photo: '/images/home-hero.svg'
  }
];

export default function Home() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    document.title = "Blessy Gift Shop - Premium Gifts Online";

    const targetTime = new Date().getTime() + 24 * 60 * 60 * 1000;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft("00:00:00");
        clearInterval(interval);
      } else {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const featuredProducts = productsData.filter(p => p.featured).slice(0, 15);
  const bestsellers = productsData.filter(p => p.isBestseller).sort((a,b) => (b.rating || 0) - (a.rating || 0)).slice(0, 12);
  const newArrivals = productsData.filter(p => p.isNew).slice(0, 12);

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative w-full bg-slate-50 py-20 px-4 sm:px-6 md:py-32 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-[120px]" style={{background: '#C5E619', opacity: 0.5}}></div>
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-[120px]" style={{background: '#A8CC00', opacity: 0.3}}></div>
        </div>
        
        <div className="absolute top-10 right-10 md:right-20 bg-white shadow-sm rounded-full px-5 py-2 animate-bounce cursor-default select-none hidden sm:flex items-center gap-2 z-10 border border-slate-200">
          <span className="text-xl">⭐</span>
          <span className="font-semibold text-[#1C1C1C]">10,000+ Happy Customers</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-[#1C1C1C] mb-6 max-w-4xl leading-tight z-10 px-4">
          Welcome to <span style={{color: '#A8CC00'}}>Blessy Gift Shop</span> 🎁
        </h1>
        <p className="text-lg md:text-xl text-slate-700 mb-10 max-w-2xl z-10 font-medium">
          Premium gifts, stylish stationery, fun toys, and quality household items. Chennai's favourite online destination for every occasion.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto z-10">
          <Link to="/shop" style={{backgroundColor: '#C5E619', color: '#1C1C1C'}} className="font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-center tracking-wide">
            EXPLORE CATALOG
          </Link>

        </div>
      </section>

      {/* 2. CATEGORIES GRID */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-center mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-[#1C1C1C]">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="group flex flex-col rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all bg-white overflow-hidden border border-slate-100 h-full"
            >
              <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                <img loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/images/fallback.svg"; }} src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white font-bold text-xl drop-shadow-md">
                  {cat.name}
                </div>
              </div>
              <div className="p-5 flex flex-col items-center">
                <div className="text-3xl mb-3">{cat.icon}</div>
                <p className="text-sm text-slate-500 text-center font-medium line-clamp-2 leading-relaxed">{cat.description}</p>
              </div>
            </Link>
          ))}
          {/* View All Card */}
          <Link
            to={`/shop`}
            className="group flex flex-col rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all bg-[#1C1C1C] text-white overflow-hidden items-center justify-center p-6 border border-slate-800 min-h-[300px]"
          >
             <div className="text-5xl mb-6 transform group-hover:rotate-12 transition-transform duration-500" style={{color: '#C5E619'}}>✨</div>
             <h3 className="font-black text-2xl mb-2 tracking-wide text-center">View All Gifts</h3>
             <p className="text-sm text-gray-400 text-center font-medium">Browse our full 100+ item catalog</p>
             <div className="mt-8 px-6 py-2 rounded-full font-bold text-[#1C1C1C]" style={{backgroundColor: '#C5E619'}}>
               Shop Now →
             </div>
          </Link>
        </div>
      </section>

      {/* OCCASIONS ROW */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-100 pt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-black text-[#1C1C1C]">Find by Occasion</h2>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-6 hide-scrollbar">
          {[
            { label: '🎂 Birthday', value: 'birthday' },
            { label: '⛪ Baptism', value: 'baptism' },
            { label: '💍 Engagement', value: 'engagement' },
            { label: '💒 Marriage', value: 'marriage' },
            { label: '👶 Baby Shower', value: 'babyShower' },
            { label: '🌸 Puberty', value: 'puberty' },
            { label: '💕 Anniversary', value: 'anniversary' },
            { label: '💼 Corporate', value: 'corporate' }
          ].map((occ) => (
            <Link
              key={occ.value}
              to={`/shop?occasion=${occ.value}`}
              className="flex-shrink-0 bg-white border border-slate-200 text-slate-700 font-bold py-3 px-6 rounded-2xl hover:border-transparent transition-all shadow-sm hover:shadow-md"
              style={{ '--hover-bg': '#C5E619' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#C5E619'; e.currentTarget.style.color = '#1C1C1C'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#334155'; }}
            >
              {occ.label}
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS CAROUSEL */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-black text-[#1C1C1C] mb-2 cursor-pointer flex items-center gap-3">
              <span className="text-3xl">🌟</span> Featured Selection
            </h2>
            <p className="text-slate-500 font-medium">Handpicked premium products you'll love</p>
          </div>
          <Link to="/shop" className="inline-flex items-center font-bold transition-colors" style={{color: '#A8CC00'}}>
             View Full Catalog <ChevronRight size={20} />
          </Link>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-8 snap-x hide-scrollbar w-full">
          {featuredProducts.map((product) => (
            <div key={product.id} className="min-w-[280px] max-w-[280px] snap-start flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* FLASH SALE COUNTDOWN */}
      <section className="w-full text-[#1C1C1C] py-8 border-y-4" style={{ backgroundColor: '#C5E619', borderColor: '#1C1C1C' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
          <h3 className="text-xl md:text-3xl font-black flex items-center gap-2">
            <span>⚡</span> Limited Time Offers:
          </h3>
          <div className="text-3xl md:text-4xl font-mono font-black tracking-widest bg-[#1C1C1C] text-[#C5E619] px-6 py-2 rounded-xl shadow-inner">
            {timeLeft || "24:00:00"}
          </div>
          <Link to="/shop?filter=Sale" className="ml-0 md:ml-6 bg-[#1C1C1C] text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-xl">
            Shop Deals
          </Link>
        </div>
      </section>

      {/* BESTSELLERS CAROUSEL */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black text-[#1C1C1C] mb-2">Top Bestsellers 🏆</h2>
            <p className="text-slate-500 font-medium">Loved by thousands of happy customers</p>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-8 snap-x hide-scrollbar w-full">
          {bestsellers.map((product) => (
            <div key={product.id} className="min-w-[280px] max-w-[280px] snap-start flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* GIFT FINDER CTA */}
      <section className="w-full py-24 px-4 sm:px-6 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
           <img loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/images/fallback.svg"; }} src='/images/home-hero.svg' alt="Gifts" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="font-bold tracking-widest uppercase text-sm mb-4 block" style={{color: '#C5E619'}}>Personalised Solutions</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">Need help finding the<br/>perfect gift? 🤔</h2>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-medium">
            Take our 3-step interactive quiz. Tell us your occasion and budget, and we'll match you with the best items in our catalog.
          </p>
          <Link to="/gift-finder" className="inline-flex text-[#1C1C1C] font-black py-4 px-10 rounded-full shadow-2xl hover:scale-105 transition-all text-xl" style={{backgroundColor: '#C5E619'}}>
            Start Gift Matchmaker 🪄
          </Link>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-white rounded-t-[3rem]">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full text-sm font-bold bg-[#1C1C1C] text-white mb-4">JUST DROPPED</span>
          <h2 className="text-3xl md:text-4xl font-black text-[#1C1C1C] mb-4">Fresh Arrivals 🌱</h2>
          <p className="text-slate-500 font-medium">Discover our newest additions to the catalog</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {newArrivals.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/shop?filter=New" className="inline-flex border-2 border-[#1C1C1C] text-[#1C1C1C] font-bold py-3 px-8 rounded-full hover:bg-[#1C1C1C] hover:text-white transition-colors shadow-sm">
            View All New Items
          </Link>
        </div>
      </section>

      {/* TRUST BADGES ROW */}
      <section className="w-full bg-[#1C1C1C] py-16 px-4 sm:px-6 border-t-[8px]" style={{borderColor: '#C5E619'}}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10 text-center text-white">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center bg-white/5 border border-white/10">
               <span className="text-3xl">✨</span>
            </div>
            <span className="font-bold text-sm tracking-wide">Premium Quality</span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center bg-white/5 border border-white/10">
               <span className="text-3xl">📦</span>
            </div>
            <span className="font-bold text-sm tracking-wide">Bulk Orders Welcome</span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center bg-white/5 border border-white/10">
               <span className="text-3xl">🚚</span>
            </div>
            <span className="font-bold text-sm tracking-wide">Fast Safe Delivery</span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center bg-white/5 border border-white/10">
               <span className="text-3xl">🧾</span>
            </div>
            <span className="font-bold text-sm tracking-wide">GST Invoice Available</span>
          </div>
          <div className="flex flex-col items-center gap-4 col-span-2 md:col-span-1">
            <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center bg-white/5 border border-white/10">
               <span className="text-3xl">⭐</span>
            </div>
            <span className="font-bold text-sm tracking-wide">Thousands of Happy Customers</span>
          </div>
        </div>
      </section>

      {/* Required style to hide scrollbar but keep functionality */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}


