import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Truck, Gift, MessageSquare, RefreshCw, ShieldCheck, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products'; // Assuming products.js exports an array by default

const occasions = [
  { label: 'Birthday', emoji: '🎂', value: 'birthday' },
  { label: 'Anniversary', emoji: '💕', value: 'anniversary' },
  { label: 'Wedding', emoji: '💍', value: 'wedding' },
  { label: 'New Baby', emoji: '👶', value: 'newborn' },
  { label: 'Housewarming', emoji: '🏠', value: 'housewarming' },
  { label: "Valentine's", emoji: '💝', value: 'valentine' },
  { label: 'Christmas', emoji: '🎄', value: 'christmas' },
  { label: 'Graduation', emoji: '🎓', value: 'graduation' },
  { label: 'Thank You', emoji: '🙏', value: 'thankyou' },
  { label: 'Corporate', emoji: '💼', value: 'corporate' },
];

const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    text: "Found the perfect personalized gift for my parents' anniversary! The gift wrapping was absolutely beautiful. Highly recommend to everyone.",
    photo: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 2,
    name: "Michael Chen",
    text: "Super fast delivery and the quality of the engraved watch exceeded my expectations. Will definitely be ordering my Christmas gifts from here.",
    photo: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    name: "Emma Williams",
    text: "The gift finder quiz is a lifesaver! I never know what to buy for my brother but it suggested some great items. He loved his present.",
    photo: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

export default function Home() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    document.title = "GiftHaven — Thoughtful Gifts for Every Occasion";
    
    // Set target time to 24 hours from now on mount
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

  const bestsellers = productsData.filter(p => p.isBestseller).slice(0, 8);
  const newArrivals = productsData.filter(p => p.isNew).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative w-full bg-gradient-to-r from-rose-100 to-amber-100 py-20 px-4 md:py-32 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute top-10 right-10 md:right-20 bg-white/80 backdrop-blur shadow-sm rounded-full px-5 py-2 animate-bounce cursor-default select-none hidden sm:flex items-center gap-2">
          <span className="text-xl">⭐</span>
          <span className="font-semibold text-slate-800">50,000+ Happy Customers</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 max-w-3xl leading-tight">
          Find the Perfect Gift for Every Occasion
        </h1>
        <p className="text-lg md:text-xl text-slate-700 mb-10 max-w-xl">
          Handpicked gifts with free wrapping & personalisation to make every moment memorable.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link to="/shop" className="bg-rose-600 text-white font-semibold py-4 px-8 rounded-full shadow-lg shadow-rose-600/30 hover:bg-rose-700 hover:scale-105 transition-all text-center">
            Shop Now
          </Link>
          <Link to="/gift-finder" className="bg-transparent border-2 border-slate-900 text-slate-900 font-semibold py-4 px-8 rounded-full hover:bg-slate-900 hover:text-white hover:scale-105 transition-all text-center">
            Take Gift Quiz
          </Link>
        </div>
      </section>

      {/* 2. OCCASIONS GRID */}
      <section className="py-16 px-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Shop by Occasion</h2>
        </div>
        <div className="flex overflow-x-auto pb-4 md:grid md:grid-cols-5 md:grid-rows-2 gap-4 snap-x hide-scrollbar">
          {occasions.map((occ) => (
            <Link 
              key={occ.value}
              to={`/shop?occasion=${occ.value}`}
              className="flex flex-col items-center p-6 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all min-w-[140px] md:min-w-0 snap-start border border-slate-100"
            >
              <span className="text-4xl mb-3">{occ.emoji}</span>
              <span className="font-medium text-slate-800 text-center">{occ.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FLASH SALE COUNTDOWN */}
      <section className="w-full bg-slate-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
          <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <span className="text-rose-500">⚡</span> Flash Sale ends in:
          </h3>
          <div className="text-3xl md:text-4xl font-mono font-bold tracking-wider text-rose-400">
            {timeLeft || "24:00:00"}
          </div>
          <Link to="/shop?sale=true" className="ml-4 bg-white text-slate-900 px-6 py-2 rounded-full font-semibold hover:bg-rose-500 hover:text-white transition-colors">
            Shop Deals
          </Link>
        </div>
      </section>

      {/* 4. BESTSELLER CAROUSEL */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Our Bestsellers</h2>
            <p className="text-slate-500">Loved by thousands of happy customers</p>
          </div>
          <Link to="/shop?bestseller=true" className="hidden md:flex items-center text-rose-600 font-semibold hover:text-rose-700 transition-colors">
            Shop Bestsellers <ChevronRight size={20} />
          </Link>
        </div>
        
        <div className="flex overflow-x-auto gap-6 pb-8 snap-x hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {bestsellers.map((product) => (
            <div key={product.id} className="min-w-[280px] max-w-[280px] snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <div className="mt-4 text-center md:hidden">
            <Link to="/shop?bestseller=true" className="inline-flex items-center text-rose-600 font-semibold hover:text-rose-700 transition-colors">
              Shop All Bestsellers <ChevronRight size={20} />
            </Link>
        </div>
      </section>

      {/* 5. GIFT FINDER CTA */}
      <section className="w-full bg-indigo-50 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm mb-4 block">Magical Assistance</span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Not sure what to get?</h2>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Answer 3 quick questions and we'll find the perfect gift tailored exactly to their personality and your budget.
          </p>
          <Link to="/gift-finder" className="inline-flex bg-indigo-600 text-white font-semibold py-4 px-10 rounded-full shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 hover:scale-105 transition-all text-xl">
            Launch Gift Finder
          </Link>
        </div>
      </section>

      {/* 6. NEW ARRIVALS */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full bg-slate-50 rounded-3xl my-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Fresh Arrivals</h2>
          <p className="text-slate-500">Discover our latest curated gifts</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="text-center mt-12">
            <Link to="/shop?new=true" className="inline-flex bg-white border border-slate-200 text-slate-800 font-medium py-3 px-8 rounded-full hover:bg-slate-50 transition-colors shadow-sm">
              View All New Items
            </Link>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((review) => (
            <div key={review.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative mt-8">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img src={review.photo} alt={review.name} className="w-full h-full object-cover" />
              </div>
              <div className="mt-8 text-center">
                <div className="flex justify-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="fill-amber-400 text-amber-400" size={18} />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 italic leading-relaxed">"{review.text}"</p>
                <h4 className="font-bold text-slate-900">{review.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. TRUST BADGES ROW */}
      <section className="w-full bg-slate-900 py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 text-center text-slate-300">
          <div className="flex flex-col items-center gap-3">
            <Truck className="text-rose-400" size={32} />
            <span className="font-medium text-sm">Free Delivery<br/>over $40</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Gift className="text-amber-400" size={32} />
            <span className="font-medium text-sm">Gift Wrapping<br/>Available</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <MessageSquare className="text-indigo-400" size={32} />
            <span className="font-medium text-sm">Personal Message<br/>Included</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="text-emerald-400" size={32} />
            <span className="font-medium text-sm">Easy 30-Day<br/>Returns</span>
          </div>
          <div className="flex flex-col items-center gap-3 col-span-2 md:col-span-1">
            <ShieldCheck className="text-cyan-400" size={32} />
            <span className="font-medium text-sm">50,000+ Verified<br/>Reviews</span>
          </div>
        </div>
      </section>
      
      {/* Required style to hide scrollbar but keep functionality */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
}
