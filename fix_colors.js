const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/Wishlist.jsx',
  'src/pages/TrackOrder.jsx',
  'src/pages/ProductDetail.jsx',
  'src/pages/NotFound.jsx',
  'src/pages/OrderConfirmation.jsx',
  'src/pages/GiftFinder.jsx',
  'src/pages/GiftCards.jsx',
  'src/pages/Checkout.jsx',
  'src/pages/Cart.jsx',
  'src/pages/Shop.jsx',
  'src/pages/Home.jsx',
  'src/components/Navbar.jsx',
  'src/components/Footer.jsx',
];

const replacements = [
  ['text-rose-300', 'text-red-300'],
  ['fill-rose-100', 'fill-red-100'],
  ['shadow-rose-200', 'shadow-red-200'],
  ['hover:text-rose-700', 'hover:text-red-700'],
  ['hover:text-rose-300', 'hover:text-red-300'],
  ['ring-rose-200', 'ring-red-200'],
  ['ring-rose-50', 'ring-red-50'],
  ['ring-rose-500', 'ring-red-500'],
  ['from-rose-50', 'from-red-50'],
  ['bg-rose-400', 'bg-red-400'],
  ['bg-rose-50', 'bg-red-50'],
  ['bg-rose-100', 'bg-red-100'],
  ['bg-rose-500', 'bg-red-600'],
  ['bg-rose-600', 'bg-red-700'],
  ['text-rose-500', 'text-red-600'],
  ['text-rose-600', 'text-red-700'],
  ['text-rose-700', 'text-red-700'],
  ['text-rose-800', 'text-red-800'],
  ['border-rose-100', 'border-red-100'],
  ['border-rose-200', 'border-red-200'],
  ['border-rose-300', 'border-red-300'],
  ['border-rose-500', 'border-red-600'],
  ['hover:border-rose-300', 'hover:border-red-300'],
  ['focus:ring-rose-400', 'focus:ring-red-400'],
  ['focus:ring-rose-500', 'focus:ring-red-500'],
  ['hover:bg-rose-50', 'hover:bg-red-50'],
  ['hover:bg-rose-100', 'hover:bg-red-100'],
  ['hover:bg-rose-200', 'hover:bg-red-200'],
  ['active:bg-rose-700', 'active:bg-red-700'],
  ['from-rose-500', 'from-red-600'],
  ['to-pink-600', 'to-red-800'],
  // GiftFinder gradient
  ['from-rose-50 via-amber-50 to-orange-50', 'from-black via-gray-900 to-black'],
  ['bg-gradient-to-br from-red-50 via-gray-50 to-gray-100', 'bg-black'],
];

const base = path.join(__dirname);
let total = 0;
for (const rel of files) {
  const full = path.join(base, rel.replace(/\//g, path.sep));
  if (!fs.existsSync(full)) { console.log('SKIP (not found):', rel); continue; }
  let content = fs.readFileSync(full, 'utf8');
  const orig = content;
  for (const [from, to] of replacements) {
    while (content.includes(from)) content = content.replace(from, to);
  }
  if (content !== orig) {
    fs.writeFileSync(full, content, 'utf8');
    console.log('Updated:', rel);
    total++;
  }
}
console.log(`Done. ${total} file(s) modified.`);
