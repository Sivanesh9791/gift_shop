const fs = require('fs');
const path = require('path');

const base = 'c:\\Users\\Sivanesh\\OneDrive - ELCOT\\folder\\Gift_Shop\\gifthaven';

function processProducts() {
    let file = path.join(base, 'src/data/products.js');
    let lines = fs.readFileSync(file, 'utf8').split('\n');
    let currentId = 1;
    let currentCat = 'gift';
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        let idMatch = line.match(/id:\s*(\d+)/);
        if (idMatch) currentId = idMatch[1];
        
        let catMatch = line.match(/category:\s*['"]([^'"]+)['"]/);
        if (catMatch) { currentCat = catMatch[1].replace('-', ''); }
        
        let url = `https://source.unsplash.com/400x400/?${currentCat},product,${currentId}`;
        
        if (line.includes("'premium gift box'")) {
            lines[i] = line.replace(/'premium gift box'/g, `'${url}'`);
        }
    }
    fs.writeFileSync(file, lines.join('\n'));
}

function processCategories() {
    let file = path.join(base, 'src/data/categories.js');
    let lines = fs.readFileSync(file, 'utf8').split('\n');
    let currentSlug = 'gift';
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let slugMatch = line.match(/slug:\s*['"]([^'"]+)['"]/);
        if (slugMatch) currentSlug = slugMatch[1].replace('-', '');
        
        let url = `https://source.unsplash.com/600x400/?${currentSlug},aesthetic`;
        
        if (line.includes("'gift collection'")) {
            lines[i] = line.replace(/'gift collection'/g, `'${url}'`);
        }
    }
    fs.writeFileSync(file, lines.join('\n'));
}

function processHome() {
    let file = path.join(base, 'src/pages/Home.jsx');
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/"gifts wrapped"/g, '"https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1600&q=80"');
    content = content.replace(/"person smiling"/g, '"https://randomuser.me/api/portraits/women/44.jpg"');
    fs.writeFileSync(file, content);
}

try {
    processProducts();
    processCategories();
    processHome();
    console.log("SUCCESS");
} catch(e) {
    console.error(e);
}
