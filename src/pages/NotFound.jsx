import { Link } from 'react-router-dom';
import { Home, PackageSearch } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center py-20 px-4">
      <div className="text-center max-w-2xl mx-auto">
        
        {/* Interactive CSS Illustration */}
        <div className="relative w-64 h-64 mx-auto mb-8 pointer-events-none">
          <div className="absolute inset-0 bg-rose-500 rounded-full opacity-10 animate-ping"></div>
          <div className="absolute inset-4 bg-rose-400 rounded-full opacity-20"></div>
          <div className="absolute inset-0 flex items-center justify-center text-[100px] hover:rotate-12 transition-transform duration-500 pointer-events-auto cursor-pointer drop-shadow-xl">
            🤷‍♂️🎁
          </div>
          {/* Confetti pieces */}
          <div className="absolute top-4 left-10 w-3 h-8 rounded-full bg-blue-400 rotate-45"></div>
          <div className="absolute top-1/2 right-4 w-4 h-4 rounded bg-amber-400 -rotate-12"></div>
          <div className="absolute bottom-10 left-12 w-6 h-6 rounded-full bg-emerald-400 outline outline-4 outline-offset-2 outline-slate-50"></div>
          <div className="absolute -bottom-4 right-20 text-4xl">🕵️‍♀️</div>
        </div>

        <h1 className="text-5xl md:text-7xl font-serif font-black text-slate-900 mb-6 drop-shadow-sm">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 tracking-tight">Lost in the gift shop!</h2>
        
        <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          It seems the perfect gift you were looking for is hiding. Don't worry, we have thousands of other amazing presents waiting to be discovered.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/" 
            className="w-full sm:w-auto bg-slate-900 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg active:scale-95"
          >
            <Home size={18} /> Back to Home
          </Link>
          <Link 
            to="/shop" 
            className="w-full sm:w-auto bg-rose-50 text-rose-600 font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 hover:bg-rose-100 hover:text-rose-700 transition-colors mb:my-0 active:scale-95 border border-rose-100"
          >
            <PackageSearch size={18} /> Browse Gifts
          </Link>
        </div>

      </div>
    </div>
  );
}
