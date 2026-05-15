import { Link } from 'react-router-dom';
import { Heart, Globe, Star, Music, HelpCircle, Package, RefreshCw, Send, Gift, MessageCircle, MapPin, Search } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* ROW 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6 border-b border-gray-800 pb-16">
          
          {/* Col 1: Logo */}
          <div className="lg:col-span-3 space-y-6">
              <span className="text-2xl font-black tracking-widest text-rose-400 uppercase">
                GIFTINY
              </span>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Curating thoughtful, personalized gifts that create unforgettable moments for the special people in your life.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all text-gray-400"><Heart size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all text-gray-400"><Globe size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all text-gray-400"><Star size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all text-gray-400"><Music size={18} /></a>
            </div>
          </div>

          {/* Col 2: SHOP */}
          <div className="lg:col-span-2">
            <h4 className="font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2"><Package size={16} className="text-rose-500"/> Shop</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/shop" className="hover:text-rose-400 transition-colors">All Gifts</Link></li>
              <li><Link to="/shop?sort=recommended" className="hover:text-rose-400 transition-colors">By Occasion</Link></li>
              <li><Link to="/shop?sort=bestseller" className="hover:text-rose-400 transition-colors">By Recipient</Link></li>
              <li><Link to="/gift-finder" className="hover:text-rose-400 transition-colors hover:underline">Gift Finder</Link></li>
              <li><Link to="/gift-cards" className="hover:text-rose-400 transition-colors">Gift Cards</Link></li>
              <li><Link to="/shop?filter=sale" className="text-rose-400 font-semibold hover:text-rose-300 transition-colors">Sale</Link></li>
            </ul>
          </div>

          {/* Col 3: OCCASIONS */}
          <div className="lg:col-span-2">
            <h4 className="font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2"><MapPin size={16} className="text-rose-500"/> Occasions</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/shop?occasion=birthday" className="hover:text-rose-400 transition-colors">Birthday</Link></li>
              <li><Link to="/shop?occasion=anniversary" className="hover:text-rose-400 transition-colors">Anniversary</Link></li>
              <li><Link to="/shop?occasion=wedding" className="hover:text-rose-400 transition-colors">Wedding</Link></li>
              <li><Link to="/shop?occasion=baby" className="hover:text-rose-400 transition-colors">Baby Shower</Link></li>
              <li><Link to="/shop?occasion=christmas" className="hover:text-rose-400 transition-colors">Christmas</Link></li>
              <li><Link to="/shop?occasion=valentines" className="hover:text-rose-400 transition-colors">Valentine's</Link></li>
              <li><Link to="/shop?occasion=graduation" className="hover:text-rose-400 transition-colors">Graduation</Link></li>
            </ul>
          </div>

          {/* Col 4: HELP */}
          <div className="lg:col-span-2">
            <h4 className="font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2"><HelpCircle size={16} className="text-rose-500"/> Help</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-rose-400 transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-rose-400 transition-colors flex items-center gap-1">Delivery Info <TruckIcon /></a></li>
              <li><a href="#" className="hover:text-rose-400 transition-colors flex items-center gap-1">Returns <RefreshCw size={12}/></a></li>
              <li><Link to="/track-order" className="hover:text-rose-400 transition-colors">Track Order</Link></li>
              <li><a href="#" className="hover:text-rose-400 transition-colors">Gift Wrapping</a></li>
              <li><a href="#" className="hover:text-rose-400 transition-colors flex items-center gap-1">Contact Us <MessageCircle size={12}/></a></li>
            </ul>
          </div>

          {/* Col 5: CONTACT + NEWSLETTER */}
          <div className="lg:col-span-3 space-y-8">

            {/* Contact Info */}
            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2"><MapPin size={16} className="text-rose-500"/> Contact Us</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-start gap-2">
                  <MapPin size={14} className="text-rose-400 mt-0.5 flex-shrink-0" />
                  <span>Shop 5, 137, 2nd Floor, Grand Mall<br />Velachery, Chennai, Tamil Nadu<br />India</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-400 flex-shrink-0">📞</span>
                  <a href="tel:+917904952709" className="hover:text-rose-400 transition-colors">+91 7904952709</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-400 flex-shrink-0">✉️</span>
                  <a href="mailto:hello@giftiny.com" className="hover:text-rose-400 transition-colors">hello@giftiny.com</a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2"><Send size={16} className="text-rose-500"/> Newsletter</h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Get gift ideas &amp; 15% off your first order.
              </p>
              <form className="flex flex-col gap-3" onSubmit={e => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-white/5 border border-gray-700 text-white placeholder-gray-500 px-4 py-3 rounded-lg w-full focus:outline-none focus:border-rose-500 transition-colors text-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm"
                >
                  Subscribe
                </button>
              </form>
            </div>

          </div>

        </div>

        {/* ROW 2 */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 text-gray-500 text-xs">
          <div className="flex items-center gap-2 opacity-50">
            <div className="px-3 py-1 bg-white text-black rounded font-bold font-mono tracking-tighter">VISA</div>
            <div className="px-3 py-1 bg-[#EB001B] text-white rounded font-bold">MC</div>
            <div className="px-3 py-1 bg-[#003087] text-white rounded font-bold italic">PayPal</div>
            <div className="px-3 py-1 bg-black text-white rounded font-bold">Pay</div>
          </div>
          
          <p>© {new Date().getFullYear()} GIFTINY. All rights reserved.</p>
          
          <div className="flex gap-6 font-semibold">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>

        {/* Admin Link */}
        <div className="mt-6 text-center border-t border-gray-800 pt-4">
          <Link to="/admin" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
            Admin
          </Link>
        </div>

      </div>
    </footer>
  );
}

const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
