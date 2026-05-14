import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { Menu, Search, Bell, Sun, Moon, ExternalLink } from 'lucide-react';

export default function AdminNavbar({ onMenuClick }) {
  const { darkMode, toggleDarkMode, orders } = useAdmin();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Determine current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/') return 'Dashboard';
    if (path.includes('products')) return 'Products';
    if (path.includes('orders')) return 'Orders';
    if (path.includes('customers')) return 'Customers';
    if (path.includes('coupons')) return 'Coupons';
    if (path.includes('settings')) return 'Settings';
    return 'Admin';
  };

  // Count pending orders
  const pendingCount = orders.filter((order) => order.status === 'pending').length;

  return (
    <nav className="h-16 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-6">
        {/* Hamburger Menu */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} className="text-gray-700 dark:text-gray-300" />
        </button>

        {/* Page Title */}
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          {getPageTitle()}
        </h1>
      </div>

      {/* Center Section - Search */}
      <div className="hidden md:flex flex-1 max-w-xs mx-6">
        <div className="relative w-full">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search products, orders, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-xl px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-gray-700 dark:text-gray-300" />
            {pendingCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {pendingCount > 9 ? '9+' : pendingCount}
              </span>
            )}
          </button>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun size={20} className="text-gray-700 dark:text-gray-300" />
          ) : (
            <Moon size={20} className="text-gray-700 dark:text-gray-300" />
          )}
        </button>

        {/* Admin Avatar */}
        <div
          className="w-9 h-9 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-rose-600 transition-colors"
          title="Admin"
        >
          A
        </div>

        {/* View Store Button */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-500 border border-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
        >
          <ExternalLink size={16} />
          <span className="hidden sm:inline">View Store</span>
        </a>
      </div>
    </nav>
  );
}
