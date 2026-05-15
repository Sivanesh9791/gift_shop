import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import products from '../../data/products';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Gift,
  AlertTriangle,
  Trophy,
  Plus,
  Eye,
  Tag,
  Settings,
  ChevronRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const { orders, storeSettings } = useAdmin();

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const lowStockCount = products.filter(
    (p) => p.stockCount <= storeSettings.lowStockThreshold
  ).length;

  // Get unique customers
  const uniqueCustomers = new Set(orders.map((o) => o.customerEmail)).size;
  const newCustomersThisWeek = orders.filter((o) => {
    const createdDate = new Date(o.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return createdDate > weekAgo;
  }).length / 3; // Rough estimate

  // Revenue chart data (last 7 days)
  const generateRevenueData = () => {
    const data = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayIndex = date.getDay();

      const dayRevenue = orders
        .filter((o) => {
          const orderDate = new Date(o.createdAt);
          return orderDate.toDateString() === date.toDateString();
        })
        .reduce((sum, o) => sum + o.total, 0);

      data.push({
        day: dayNames[dayIndex],
        revenue: Math.round(dayRevenue * 100) / 100,
      });
    }
    return data;
  };

  const revenueData = generateRevenueData();

  // Order status breakdown
  const statusCounts = {
    pending: orders.filter((o) => o.status === 'pending').length,
    packed: orders.filter((o) => o.status === 'packed').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  const pieData = [
    { name: 'Pending', value: statusCounts.pending, color: '#fbbf24' },
    { name: 'Packed', value: statusCounts.packed, color: '#3b82f6' },
    { name: 'Shipped', value: statusCounts.shipped, color: '#8b5cf6' },
    { name: 'Delivered', value: statusCounts.delivered, color: '#10b981' },
    { name: 'Cancelled', value: statusCounts.cancelled, color: '#ef4444' },
  ];

  // Recent orders (last 5)
  const recentOrders = [...orders].reverse().slice(0, 5);

  // Low stock products
  const lowStockProducts = products.filter(
    (p) => p.stockCount <= storeSettings.lowStockThreshold
  );

  // Top selling products
  const topProducts = products.filter((p) => p.isBestseller).slice(0, 5);

  const formatPrice = (price) => `₹${price.toFixed(2)}`;
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      packed: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-8">
      {/* SECTION 1: STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Total Revenue
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {formatPrice(totalRevenue)}
              </p>
              <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                <TrendingUp size={16} />
                <span>+12.5% from last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Total Orders
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {totalOrders}
              </p>
              <p className="text-blue-600 text-sm mt-2">+8 new this week</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ShoppingCart size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Total Products
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {totalProducts}
              </p>
              {lowStockCount > 0 ? (
                <p className="text-red-600 text-sm mt-2">
                  {lowStockCount} low stock
                </p>
              ) : (
                <p className="text-green-600 text-sm mt-2">All stocked well</p>
              )}
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Package size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Total Customers
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {uniqueCustomers}
              </p>
              <p className="text-rose-600 text-sm mt-2">
                +{Math.ceil(newCustomersThisWeek)} new this week
              </p>
            </div>
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
              <Users size={24} className="text-rose-600" />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Revenue Overview
            </h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-medium bg-rose-500 text-white rounded-lg">
                Week
              </button>
              <button className="px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                Month
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                dark={{ stroke: '#374151' }}
              />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="revenue" fill="#f43f5e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            Order Status
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry) => {
                  const data = entry.payload;
                  return `${data.name} (${data.value})`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECTION 3: RECENT ORDERS TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Recent Orders
          </h3>
          <button
            onClick={() => navigate('/admin/orders')}
            className="text-rose-500 hover:text-rose-600 text-sm font-medium flex items-center gap-1"
          >
            View All <ChevronRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-sm font-mono text-rose-500">
                    {order.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {order.customerName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {order.customerEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      {order.items.some((i) => i.giftWrap) && (
                        <Gift size={16} className="text-rose-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => navigate('/admin/orders')}
                      className="text-rose-500 hover:text-rose-600 font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4: LOW STOCK & TOP PRODUCTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-amber-600 mb-6 flex items-center gap-2">
            <AlertTriangle size={20} />
            Low Stock Alerts
          </h3>

          {lowStockProducts.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-green-600">
              ✅ All products well stocked!
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded ${
                        product.stockCount === 0
                          ? 'bg-red-100 text-red-600'
                          : product.stockCount <= 3
                          ? 'bg-red-100 text-red-600'
                          : 'bg-amber-100 text-amber-600'
                      }`}
                    >
                      {product.stockCount === 0
                        ? 'Out of Stock'
                        : product.stockCount <= 3
                        ? 'Critical'
                        : 'Low'}
                    </span>
                    <button className="text-xs text-rose-500 hover:text-rose-600 font-medium">
                      Restock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Selling Products */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Trophy size={20} className="text-amber-500" />
            Top Products
          </h3>

          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {product.name}
                    </p>
                    <div className="text-xs text-yellow-500">★★★★★</div>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatPrice(product.price)}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/admin/products')}
            className="mt-4 w-full text-center text-rose-500 hover:text-rose-600 text-sm font-medium"
          >
            View All Products → {' '}
          </button>
        </div>
      </div>

      {/* SECTION 5: QUICK ACTIONS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="bg-rose-500 hover:opacity-90 text-white rounded-xl p-4 text-center transition-opacity"
        >
          <Plus size={32} className="mx-auto mb-2" />
          <span className="text-sm font-medium">Add Product</span>
        </button>

        <button
          onClick={() => navigate('/admin/orders')}
          className="bg-blue-500 hover:opacity-90 text-white rounded-xl p-4 text-center transition-opacity"
        >
          <Eye size={32} className="mx-auto mb-2" />
          <span className="text-sm font-medium">View Orders</span>
        </button>

        <button
          onClick={() => navigate('/admin/coupons')}
          className="bg-purple-500 hover:opacity-90 text-white rounded-xl p-4 text-center transition-opacity"
        >
          <Tag size={32} className="mx-auto mb-2" />
          <span className="text-sm font-medium">Manage Coupons</span>
        </button>

        <button
          onClick={() => navigate('/admin/settings')}
          className="bg-gray-600 hover:opacity-90 text-white rounded-xl p-4 text-center transition-opacity"
        >
          <Settings size={32} className="mx-auto mb-2" />
          <span className="text-sm font-medium">Store Settings</span>
        </button>
      </div>
    </div>
  );
}
