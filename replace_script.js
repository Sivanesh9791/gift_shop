const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        processDir(fullPath);
      }
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css') || fullPath.endsWith('.html')) {
       let content = fs.readFileSync(fullPath, 'utf8');
       let newContent = content;

       newContent = newContent.replace(/TRESOR GIFTS/g, 'TRESOR GIFTS');
       newContent = newContent.replace(/TRESOR GIFTS/g, 'TRESOR GIFTS');
       newContent = newContent.replace(/TRESOR GIFTS/g, 'TRESOR GIFTS');
       newContent = newContent.replace(/TRESOR GIFTS/g, 'TRESOR GIFTS');
       newContent = newContent.replace(/tresorgifts/g, 'tresorgifts');
       newContent = newContent.replace(/TRESOR GIFTSgiftshop/gi, 'tresorgifts'); // Catch-all for emails/links

       newContent = newContent.replace(/bg-red-600/g, 'bg-red-600');
       newContent = newContent.replace(/bg-red-700/g, 'bg-red-700');
       newContent = newContent.replace(/text-red-600/g, 'text-red-600');
       newContent = newContent.replace(/text-red-700/g, 'text-red-700');
       newContent = newContent.replace(/border-red-600/g, 'border-red-600');
       newContent = newContent.replace(/bg-red-50/g, 'bg-red-50');
       newContent = newContent.replace(/bg-red-100/g, 'bg-red-100');
       newContent = newContent.replace(/text-red-500/g, 'text-red-500');
       newContent = newContent.replace(/from-red-600/g, 'from-red-600');
       newContent = newContent.replace(/to-red-800/g, 'to-red-800');
       newContent = newContent.replace(/hover:text-red-500/g, 'hover:text-red-500');

       if (content !== newContent) {
          fs.writeFileSync(fullPath, newContent, 'utf8');
          console.log('Updated:', fullPath);
       }
    }
  }
}

try {
  processDir(rootDir);
  console.log('Done!');
} catch (e) {
  console.error(e);
}
