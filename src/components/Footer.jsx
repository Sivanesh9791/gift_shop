import { Link } from 'react-router-dom';
import { Heart, Globe, Star, Music, HelpCircle, Package, RefreshCw, Send, Gift, MessageCircle, MapPin, Search } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t-4 border-red-600 text-gray-700 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* ROW 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6 border-b border-red-100 pb-16">
          
          {/* Col 1: Logo */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl">🎁</span>
              <div className="flex flex-col leading-none">
                <span style={{fontFamily: 'Playfair Display, serif'}}
                  className="text-2xl font-black tracking-widest text-red-600 uppercase">
                  TRESOR GIFTS
                </span>
                <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                  ✦ The Customized Gift Store
                </span>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mt-2">
              Chennai's best customized gift store. Photo gifts, personalised items, caricatures, wooden crafts and corporate gifts. We make every gift unique.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all text-red-400"><Heart size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all text-red-400"><Globe size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all text-red-400"><Star size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all text-red-400"><Music size={18} /></a>
            </div>
          </div>

          {/* Col 2: SHOP */}
          <div className="lg:col-span-2">
            <h4 className="font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2 text-gray-900"><Package size={16} className="text-red-600"/> Shop</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><Link to="/shop" className="hover:text-red-600 transition-colors">All Gifts</Link></li>
              <li><Link to="/shop?sort=recommended" className="hover:text-red-600 transition-colors">By Occasion</Link></li>
              <li><Link to="/shop?sort=bestseller" className="hover:text-red-600 transition-colors">By Recipient</Link></li>
              <li><Link to="/gift-finder" className="hover:text-red-600 transition-colors hover:underline">Gift Finder</Link></li>
              <li><Link to="/gift-cards" className="hover:text-red-600 transition-colors">Gift Cards</Link></li>
              <li><Link to="/shop?filter=Sale" className="text-red-600 font-semibold hover:text-red-700 transition-colors">Sale</Link></li>
            </ul>
          </div>

          {/* Col 3: CATEGORIES */}
          <div className="lg:col-span-2">
            <h4 className="font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2 text-gray-900"><Package size={16} className="text-red-600"/> Categories</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><Link to="/shop?category=photoGifts" className="hover:text-red-600 transition-colors">Photo Gifts</Link></li>
              <li><Link to="/shop?category=personalisedItems" className="hover:text-red-600 transition-colors">Personalised Items</Link></li>
              <li><Link to="/shop?category=caricatureArt" className="hover:text-red-600 transition-colors">Caricatures & Art</Link></li>
              <li><Link to="/shop?category=woodenCrafts" className="hover:text-red-600 transition-colors">Wooden Crafts</Link></li>
              <li><Link to="/shop?category=corporateGifts" className="hover:text-red-600 transition-colors">Corporate Gifts</Link></li>
              <li><Link to="/shop?filter=Sale" className="hover:text-red-600 transition-colors text-red-500 font-semibold">Sale</Link></li>
            </ul>
          </div>

          {/* Col 4: HELP */}
          <div className="lg:col-span-2">
            <h4 className="font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2 text-gray-900"><HelpCircle size={16} className="text-red-600"/> Help</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-red-600 transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors flex items-center gap-1">Delivery Info <TruckIcon /></a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors flex items-center gap-1">Returns <RefreshCw size={12}/></a></li>
              <li><Link to="/track-order" className="hover:text-red-600 transition-colors">Track Order</Link></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">Gift Wrapping</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors flex items-center gap-1">Contact Us <MessageCircle size={12}/></a></li>
            </ul>
          </div>

          {/* Col 5: CONTACT + NEWSLETTER */}
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2 text-gray-900"><MapPin size={16} className="text-red-600"/> Contact Us</h4>
              <ul className="space-y-3 text-gray-500 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-red-600 flex-shrink-0">📞</span>
                  <a href="tel:+919003074000" className="hover:text-red-600 transition-colors">+91 90030 74000</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-600 flex-shrink-0">✉️</span>
                  <a href="mailto:info@tresorgifts.in" className="hover:text-red-600 transition-colors">info@tresorgifts.in</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-600 flex-shrink-0">🌐</span>
                  <a href="#" className="hover:text-red-600 transition-colors">tresorgifts.in</a>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 flex-shrink-0">📍</span>
                  <span>Navalur, Chennai</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2 text-gray-900"><Send size={16} className="text-red-600"/> Newsletter</h4>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Get gift ideas &amp; 15% off your first order.
              </p>
              <form className="flex flex-col gap-3" onSubmit={e => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-gray-50 border border-red-200 text-gray-900 placeholder-gray-400 px-4 py-3 rounded-lg w-full focus:outline-none focus:border-red-600 transition-colors text-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* ROW 2 */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 text-gray-400 text-xs">
          <div className="flex items-center gap-2 opacity-60">
            <div className="px-3 py-1 bg-gray-100 text-gray-800 rounded font-bold font-mono tracking-tighter">VISA</div>
            <div className="px-3 py-1 bg-[#EB001B] text-white rounded font-bold">MC</div>
            <div className="px-3 py-1 bg-[#003087] text-white rounded font-bold italic">PayPal</div>
            <div className="px-3 py-1 bg-gray-900 text-white rounded font-bold">Pay</div>
          </div>
          
          <p>© {new Date().getFullYear()} TRESOR GIFTS. All rights reserved.</p>
          
          <div className="flex gap-6 font-semibold">
            <a href="#" className="hover:text-red-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-red-600 transition-colors">Terms of Service</a>
          </div>
        </div>

        {/* Admin Link */}
        <div className="mt-6 text-center border-t border-red-100 pt-4">
          <Link to="/admin" className="text-xs text-gray-400 hover:text-red-600 transition-colors">
            Admin
          </Link>
        </div>

      </div>
    </footer>
  );
}

const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
