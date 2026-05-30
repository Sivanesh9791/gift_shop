const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/Sivanesh/OneDrive - ELCOT/folder/Gift_Shop/gifthaven/src/admin/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(f => {
  const file = path.join(dir, f);
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/bg-white dark:bg-gray-800/g, 'bg-white border border-[#E4E4E7]');
  
  content = content.replace(/text-gray-900 dark:text-white/g, 'text-[#111111]');
  content = content.replace(/text-gray-800 dark:text-gray-200/g, 'text-[#111111]');
  content = content.replace(/text-gray-500 dark:text-gray-400/g, 'text-[#6B7280]');
  content = content.replace(/text-gray-600 dark:text-gray-300/g, 'text-[#6B7280]');
  content = content.replace(/text-gray-400 dark:text-gray-500/g, 'text-[#6B7280]');
  content = content.replace(/text-gray-400 hover:text-gray-600 dark:hover:text-gray-200/g, 'text-[#A1A1AA] hover:text-[#111111]');
  
  content = content.replace(/border-gray-200 dark:border-gray-700/g, 'border-[#E4E4E7]');
  content = content.replace(/border-gray-100 dark:border-gray-700/g, 'border-[#E4E4E7]');
  
  content = content.replace(/bg-gray-50 dark:bg-gray-700\/50/g, 'bg-[#F4F4F5]');
  content = content.replace(/bg-gray-50 dark:bg-gray-700/g, 'bg-[#F4F4F5]');
  content = content.replace(/bg-gray-100 dark:bg-gray-700/g, 'bg-[#F4F4F5]');
  
  content = content.replace(/hover:bg-gray-50 dark:hover:bg-gray-700\/50/g, 'hover:bg-gray-50');
  content = content.replace(/hover:bg-gray-100 dark:hover:bg-gray-700/g, 'hover:bg-gray-100');
  content = content.replace(/hover:bg-gray-50 dark:hover:bg-gray-700/g, 'hover:bg-gray-50');
  
  content = content.replace(/dark:bg-[a-zA-Z0-9.\/-]+/g, '');
  content = content.replace(/dark:text-[a-zA-Z0-9.\/-]+/g, '');
  content = content.replace(/dark:border-[a-zA-Z0-9.\/-]+/g, '');
  content = content.replace(/dark:hover:[a-zA-Z0-9.\/-]+/g, '');
  content = content.replace(/dark:ring-[a-zA-Z0-9.\/-]+/g, '');
  
  // Clean up double spaces caused by deletion of classes
  content = content.replace(/  +/g, ' ');
  
  fs.writeFileSync(file, content);
});
console.log('Fixed all admin pages completely');
