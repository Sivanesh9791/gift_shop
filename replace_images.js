const fs = require('fs');

try {
  let p1 = './src/data/products.js';
  let content = fs.readFileSync(p1, 'utf8');
  content = content.replace(/image:\s*['"`]https:\/\/[^'"`]*['"`]/g, (match, offset, string) => {
      let beforeStr = string.substring(Math.max(0, offset - 500), offset);
      let nameMatch = beforeStr.match(/name:\s*['"`](.*?)['"`]/);
      let kw = nameMatch ? nameMatch[1] : 'product';
      kw = kw.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase().trim();
      return `image: '${kw}'`;
  });
  content = content.replace(/images:\s*\[\s*['"`]https:\/\/[^\]]*\]/g, (match, offset, string) => {
      let beforeStr = string.substring(Math.max(0, offset - 500), offset);
      let nameMatch = beforeStr.match(/name:\s*['"`](.*?)['"`]/);
      let kw = nameMatch ? nameMatch[1] : 'product';
      kw = kw.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase().trim();
      return `images: ['${kw}']`;
  });
  fs.writeFileSync(p1, content);
  console.log("Updated products");

  let p2 = './src/data/categories.js';
  let c2 = fs.readFileSync(p2, 'utf8');
  c2 = c2.replace(/image:\s*['"`]https:\/\/[^'"`]*['"`]/g, (match, offset, string) => {
      let beforeStr = string.substring(Math.max(0, offset - 300), offset);
      let nameMatch = beforeStr.match(/name:\s*['"`](.*?)['"`]/);
      let kw = nameMatch ? nameMatch[1] : 'category';
      kw = kw.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase().trim();
      return `image: '${kw}'`;
  });
  fs.writeFileSync(p2, c2);
  console.log("Updated categories");

  let p3 = './src/pages/Home.jsx';
  let c3 = fs.readFileSync(p3, 'utf8');
  c3 = c3.replace(/photo:\s*["']https:\/\/[^"']*["']/g, (match, offset, string) => {
      let beforeStr = string.substring(Math.max(0, offset - 300), offset);
      let nameMatch = beforeStr.match(/name:\s*['"`](.*?)['"`]/);
      let kw = nameMatch ? nameMatch[1].split(' ')[0].toLowerCase() : 'person';
      return `photo: '${kw}'`;
  });
  c3 = c3.replace(/src=["']https:\/\/images\.unsplash[^"']*["']/g, `src="gifts wrapped"`);
  fs.writeFileSync(p3, c3);
  console.log("Updated Home");

} catch(e) {
  console.error(e);
}
