const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/rose-/g, 'red-');
  content = content.replace(/pink-500/g, 'red-800');
  content = content.replace(/hover:bg-red-700/g, 'hover:bg-red-800'); // fixes hover states on red buttons
  fs.writeFileSync(file, content);
  console.log(`Fixed ${file}`);
}

['src/pages/Checkout.jsx', 'src/pages/GiftFinder.jsx', 'src/pages/NotFound.jsx'].forEach(fixFile);
