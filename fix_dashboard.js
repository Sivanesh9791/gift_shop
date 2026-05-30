const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/admin/pages/Dashboard.jsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm/g, 'bg-white border border-[#E4E4E7] rounded-2xl p-6 shadow-sm');
content = content.replace(/bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden/g, 'bg-white border border-[#E4E4E7] rounded-2xl shadow-sm overflow-hidden');

// General text and border replacements
content = content.replace(/text-gray-900 dark:text-white/g, 'text-[#111111]');
content = content.replace(/text-gray-500 dark:text-gray-400/g, 'text-[#6B7280]');
content = content.replace(/text-gray-600 dark:text-gray-300/g, 'text-[#6B7280]');
// Sometimes `text-gray-500` is standalone
content = content.replace(/text-gray-500/g, 'text-[#6B7280]');
content = content.replace(/border-gray-200 dark:border-gray-700/g, 'border-[#E4E4E7]');
content = content.replace(/border-gray-100 dark:border-gray-700/g, 'border-[#E4E4E7]');
content = content.replace(/bg-gray-50 dark:bg-gray-700/g, 'bg-[#F4F4F5]');
content = content.replace(/hover:bg-gray-50 dark:hover:bg-gray-700\/50/g, 'hover:bg-gray-50');

// Buttons
content = content.replace(/className="px-3 py-1 text-xs font-medium bg-red-600 text-white rounded-lg"/g, 'className="px-3 py-1 text-xs font-medium bg-[#DC2626] text-white rounded-lg"');
content = content.replace(/className="px-3 py-1 text-xs font-medium text-\[#6B7280\] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"/g, 'className="px-3 py-1 text-xs font-medium bg-[#F4F4F5] text-[#6B7280] hover:bg-gray-200 rounded-lg"');

content = content.replace(/bg-red-600/g, 'bg-[#DC2626]');
content = content.replace(/text-red-600/g, 'text-[#DC2626]');
content = content.replace(/text-red-700/g, 'text-[#DC2626]');

// Chart styles
content = content.replace(/stroke="#e5e7eb"/g, 'stroke="#E4E4E7"');
content = content.replace(/dark=\{\{ stroke: '#374151' \}\}/g, '');
content = content.replace(/stroke="#9ca3af"/g, 'stroke="#6B7280"');
content = content.replace(/backgroundColor: '#1f2937'/g, "backgroundColor: '#ffffff'");
content = content.replace(/color: '#fff'/g, "color: '#111111'");
content = content.replace(/border: 'none'/g, "border: '1px solid #E4E4E7'");
content = content.replace(/fill="#f43f5e"/g, 'fill="#DC2626"');

content = content.replace(/<Legend\s+verticalAlign="bottom"/, '<Legend\n                verticalAlign="bottom"\n                wrapperStyle={{ color: "#374151" }}');

fs.writeFileSync(file, content);
console.log('Fixed dashboard');
