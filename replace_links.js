const fs = require('fs');
const path = require('path');
const base = 'c:\\Users\\Sivanesh\\OneDrive - ELCOT\\folder\\Gift_Shop\\gifthaven';

function replaceImages(fileName) {
   let p = path.join(base, fileName);
   let content = fs.readFileSync(p, 'utf8');
   content = content.replace(/['"]https:\/\/[^'"]+(?:unsplash|randomuser)[^'"]*['"]/g, (match, offset, str) => {
       if(match.includes('randomuser')) return "'person portrait'";
       let before = str.substring(Math.max(0, offset - 400), offset);
       let nm = before.match(/name:\s*['"]([^'"]+)['"]/);
       let kw = nm ? nm[1].replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase().trim() : 'beautiful gift set';
       return `'${kw}'`;
   });
   fs.writeFileSync(p, content);
   console.log("Updated " + fileName);
}

try {
   replaceImages('src/data/products.js');
   replaceImages('src/data/categories.js');
   replaceImages('src/pages/Home.jsx');
   console.log("SUCCESS");
} catch(e) {
   console.error(e);
}
