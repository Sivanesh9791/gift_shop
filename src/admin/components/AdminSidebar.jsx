import { NavLink } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Settings,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';

export default function AdminSidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const { logout, darkMode, toggleDarkMode } = useAdmin();

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { to: '/admin/customers', icon: Users, label: 'Customers' },
    { to: '/admin/coupons', icon: Tag, label: 'Coupons' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 h-screen flex-col bg-white shadow-lg border-r border-red-100">
        {/* Logo Section */}
        <div className="flex items-center gap-2 p-6 border-b border-red-100">
          <span className="text-2xl">🎁</span>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-black tracking-widest text-red-500 uppercase">
              TRESOR GIFTS
            </span>
            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-[#374151] hover:bg-gray-100'
                  }`
                }
              >
                <Icon size={20} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-red-100" />

        {/* Bottom Section */}
        <div className="p-4 space-y-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-[#374151] hover:bg-gray-100 transition-all"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span>Dark Mode</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 h-screen flex flex-col bg-white shadow-xl border-r border-red-100 lg:hidden z-50 transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-2 p-6 border-b border-red-100">
          <span className="text-2xl">🎁</span>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-black tracking-widest text-red-500 uppercase">
              TRESOR GIFTS
            </span>
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-[#374151] hover:bg-gray-100'
                  }`
                }
              >
                <Icon size={20} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-red-100" />

        {/* Bottom Section */}
        <div className="p-4 space-y-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-[#374151] hover:bg-gray-100 transition-all"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span>Dark Mode</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
