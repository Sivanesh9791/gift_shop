import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import Orders from '../pages/Orders';
import Customers from '../pages/Customers';
import Coupons from '../pages/Coupons';
import Settings from '../pages/Settings';

export default function AdminLayout() {
  const { darkMode } = useAdmin();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminNavbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
