const fs = require('fs');
const files = [
  'src/admin/pages/Dashboard.jsx',
  'src/admin/pages/Orders.jsx',
  'src/admin/pages/Products.jsx',
  'src/admin/pages/Customers.jsx',
  'src/admin/pages/Coupons.jsx',
  'src/admin/pages/Settings.jsx',
  'src/admin/components/AdminNavbar.jsx',
  'src/admin/components/AdminLayout.jsx'
];
files.forEach(f => {
  let p = 'C:/Users/Sivanesh/OneDrive - ELCOT/folder/Gift_Shop/gifthaven/' + f;
  try {
    if (fs.existsSync(p)) {
      let c = fs.readFileSync(p, 'utf8');
      c = c.replace(/dark:[a-zA-Z0-9\-\/:]+/g, '');
      // fix double spaces
      c = c.replace(/  class/g, ' class');
      c = c.replace(/ \s+"/g, ' "');
      c = c.replace(/bg-white rounded-2xl/g, 'bg-white border border-[#E4E4E7] rounded-2xl');
      fs.writeFileSync(p, c);
    }
  } catch (e) {
    fs.writeFileSync('error_log.txt', e.toString());
  }
});
fs.writeFileSync('success.txt', 'Done');
