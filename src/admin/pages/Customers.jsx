import { useState, useMemo } from 'react';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import {
  Download,
  Search,
  Users,
  DollarSign,
  Star,
  Eye,
  Mail,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAdmin } from '../context/AdminContext';

// ─── helpers ────────────────────────────────────────────────────────────────

const STATUS_BADGE = {
  pending:   'bg-yellow-100 text-yellow-700',
  packed:    'bg-blue-100   text-blue-700',
  shipped:   'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100  text-green-700',
  cancelled: 'bg-red-100    text-red-700',
};

const STATUS_LABEL = {
  pending:   '⏳ Pending',
  packed:    '📦 Packed',
  shipped:   '🚚 Shipped',
  delivered: '✅ Delivered',
  cancelled: '❌ Cancelled',
};

const fmtDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

const daysAgo = (iso) => {
  if (!iso) return '';
  const diff = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return '1 day ago';
  return `${diff} days ago`;
};

const initials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase();

const TIER_STYLES = {
  New:     'bg-gray-100  dark:bg-gray-700  text-gray-600  dark:text-gray-300',
  Regular: 'bg-blue-100  dark:bg-blue-900/30  text-blue-600  dark:text-blue-400',
  VIP:     'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
};

// Last-6-months spending chart data for a single customer
const buildChartData = (orders) => {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleString('default', { month: 'short' }),
      year: d.getFullYear(),
      month: d.getMonth(),
      total: 0,
    });
  }
  orders.forEach(o => {
    const d = new Date(o.createdAt);
    const bucket = months.find(m => m.year === d.getFullYear() && m.month === d.getMonth());
    if (bucket) bucket.total += o.total || 0;
  });
  return months.map(m => ({ name: m.label, spent: parseFloat(m.total.toFixed(2)) }));
};

// ─── Customer Detail Modal ───────────────────────────────────────────────────

function CustomerDetailModal({ customer, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const chartData = useMemo(() => buildChartData(customer.orders), [customer.orders]);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'orders',   label: `Orders (${customer.orderCount})` },
    { id: 'address',  label: 'Address' },
  ];

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <Dialog.Panel className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">

        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-5 z-10">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={22} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-rose-500 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
              {initials(customer.name)}
            </div>
            <div>
              <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {customer.name}
              </Dialog.Title>
              <p className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</p>
              {customer.phone && (
                <p className="text-xs text-gray-400 dark:text-gray-500">{customer.phone}</p>
              )}
              <div className="mt-1.5 flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TIER_STYLES[customer.tier]}`}>
                  {customer.tier === 'VIP' && '⭐ '}{customer.tier}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-5">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-rose-500 text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* ── TAB 1: Overview ── */}
          {activeTab === 'overview' && (
            <>
              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total Orders',    value: customer.orderCount },
                  { label: 'Total Spent',     value: `$${customer.totalSpent.toFixed(2)}` },
                  { label: 'Avg Order Value', value: `$${customer.avgOrderValue.toFixed(2)}` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Customer Since</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{fmtDate(customer.firstOrderDate)}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Last Purchase</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{fmtDate(customer.lastOrderDate)}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{daysAgo(customer.lastOrderDate)}</p>
                </div>
              </div>

              {/* Spending chart */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Spending — Last 6 Months
                </p>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }}
                        formatter={(v) => [`$${v}`, 'Spent']}
                        cursor={{ fill: 'rgba(244,63,94,0.08)' }}
                      />
                      <Bar dataKey="spent" fill="#fb7185" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {/* ── TAB 2: Orders ── */}
          {activeTab === 'orders' && (
            <div>
              {customer.orders.length === 0 ? (
                <div className="text-center py-10 text-gray-400 dark:text-gray-500">No orders yet</div>
              ) : (
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        {['Order ID', 'Items', 'Total', 'Status', 'Date'].map(col => (
                          <th key={col} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-300">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {customer.orders.map(order => (
                        <tr key={order.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                          <td className="px-4 py-3 font-mono text-xs text-rose-500 font-medium">{order.id}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{(order.items || []).length} items</td>
                          <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">${(order.total || 0).toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[order.status] || ''}`}>
                              {STATUS_LABEL[order.status] || order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{fmtDate(order.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 3: Address ── */}
          {activeTab === 'address' && (
            <div className="space-y-4">
              {customer.address ? (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-rose-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{customer.address.line1}</p>
                      {customer.address.line2 && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">{customer.address.line2}</p>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {customer.address.city}, {customer.address.postcode}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{customer.address.country}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 pl-7">
                    Used in {customer.orderCount} order{customer.orderCount !== 1 ? 's' : ''}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500">No address on file</p>
              )}

              {/* Map placeholder */}
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl h-32 flex flex-col items-center justify-center gap-2">
                <MapPin size={24} className="text-gray-400 dark:text-gray-500" />
                <p className="text-sm text-gray-400 dark:text-gray-500">Map view coming soon</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex gap-3">
          <a
            href={`mailto:${customer.email}`}
            className="flex-1 text-center px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            ✉️ Email Customer
          </a>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-800 dark:bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 dark:hover:bg-gray-500 transition-colors"
          >
            Close
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}

// ─── Main Customers Page ─────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;
const TIER_TABS = ['All', 'New', 'Regular', 'VIP'];

export default function Customers() {
  const { orders } = useAdmin();

  // Derived customer data
  const customers = useMemo(() => {
    const customerMap = {};

    orders.forEach(order => {
      const email = order.customerEmail;
      if (!email) return;
      if (!customerMap[email]) {
        customerMap[email] = {
          id: email,
          name: order.customerName,
          email: order.customerEmail,
          phone: order.customerPhone,
          orders: [],
          totalSpent: 0,
          firstOrderDate: order.createdAt,
          lastOrderDate: order.createdAt,
          address: order.deliveryAddress,
        };
      }
      customerMap[email].orders.push(order);
      customerMap[email].totalSpent += order.total || 0;
      if (new Date(order.createdAt) < new Date(customerMap[email].firstOrderDate)) {
        customerMap[email].firstOrderDate = order.createdAt;
      }
      if (new Date(order.createdAt) > new Date(customerMap[email].lastOrderDate)) {
        customerMap[email].lastOrderDate = order.createdAt;
        customerMap[email].address = order.deliveryAddress;
      }
    });

    return Object.values(customerMap).map(c => ({
      ...c,
      orderCount: c.orders.length,
      avgOrderValue: c.totalSpent / c.orders.length,
      status: c.orders.some(o => o.status === 'delivered') ? 'active' : 'pending',
      tier: c.totalSpent >= 200 ? 'VIP' : c.totalSpent >= 100 ? 'Regular' : 'New',
      isGiftBuyer: c.orders.some(o => o.isGift),
    }));
  }, [orders]);

  // Local state
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Stats
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const avgPerCustomer = customers.length ? totalRevenue / customers.length : 0;
  const vipCount = customers.filter(c => c.tier === 'VIP').length;

  // New this month
  const now = new Date();
  const newThisMonth = customers.filter(c => {
    const d = new Date(c.firstOrderDate);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  // Filtered + sorted
  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q)
      );
    }

    if (tierFilter !== 'All') {
      result = result.filter(c => c.tier === tierFilter);
    }

    if (sortBy === 'recent') result.sort((a, b) => new Date(b.lastOrderDate) - new Date(a.lastOrderDate));
    else if (sortBy === 'spend') result.sort((a, b) => b.totalSpent - a.totalSpent);
    else if (sortBy === 'orders') result.sort((a, b) => b.orderCount - a.orderCount);
    else if (sortBy === 'name') result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    return result;
  }, [customers, search, tierFilter, sortBy]);

  // Pagination
  const pageCount = Math.max(1, Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, pageCount);
  const pagedCustomers = filteredCustomers.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const clearSearch = () => {
    setSearch('');
    setTierFilter('All');
    setSortBy('recent');
    setCurrentPage(1);
  };

  // CSV export
  const exportCustomersCSV = () => {
    const headers = [
      'Name', 'Email', 'Phone', 'Total Orders',
      'Total Spent', 'Avg Order Value', 'Tier',
      'First Order', 'Last Order', 'City', 'Country',
    ];

    const rows = filteredCustomers.map(c => [
      c.name,
      c.email,
      c.phone || '',
      c.orderCount,
      c.totalSpent.toFixed(2),
      c.avgOrderValue.toFixed(2),
      c.tier,
      new Date(c.firstOrderDate).toLocaleDateString(),
      new Date(c.lastOrderDate).toLocaleDateString(),
      c.address?.city || '',
      c.address?.country || '',
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gifthaven-customers-' + new Date().toISOString().split('T')[0] + '.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported!');
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{customers.length} total customers</p>
        </div>
        <button
          onClick={exportCustomersCSV}
          className="flex items-center gap-2 bg-gray-800 dark:bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
        >
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Card 1 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
            <Users size={22} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{customers.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Customers</p>
            <p className="text-xs text-blue-500 font-medium mt-0.5">+{newThisMonth} new this month</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
            <DollarSign size={22} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalRevenue.toFixed(2)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Revenue</p>
            <p className="text-xs text-green-500 font-medium mt-0.5">Avg ${avgPerCustomer.toFixed(2)} per customer</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
            <Star size={22} className="text-amber-500 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{vipCount}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">VIP Customers</p>
            <p className="text-xs text-amber-500 font-medium mt-0.5">Spent $200+</p>
          </div>
        </div>
      </div>

      {/* FILTERS TOOLBAR */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
            className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
          >
            <option value="recent">Most Recent</option>
            <option value="spend">Highest Spend</option>
            <option value="orders">Most Orders</option>
            <option value="name">Name A-Z</option>
          </select>

          <span className="text-sm text-gray-400 dark:text-gray-500 ml-auto">
            Showing {filteredCustomers.length} of {customers.length} customers
          </span>
        </div>

        {/* Tier tabs */}
        <div className="flex gap-2 flex-wrap">
          {TIER_TABS.map(tier => {
            const cnt = tier === 'All' ? customers.length : customers.filter(c => c.tier === tier).length;
            const active = tierFilter === tier;
            return (
              <button
                key={tier}
                onClick={() => { setTierFilter(tier); setCurrentPage(1); }}
                className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
                  active
                    ? 'bg-rose-500 text-white border-rose-500'
                    : tier === 'VIP'
                      ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 text-amber-600 dark:text-amber-400 hover:border-amber-400'
                      : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-rose-300'
                }`}
              >
                {tier === 'VIP' && !active && '⭐ '}{tier} ({cnt})
              </button>
            );
          })}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {pagedCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Users size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">No customers found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">Try adjusting your search</p>
            <button
              onClick={clearSearch}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm rounded-xl font-medium transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    {['Customer', 'Contact', 'Orders', 'Total Spent', 'Avg Order', 'Tier', 'Last Order', 'Actions'].map(col => (
                      <th key={col} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pagedCustomers.map(customer => (
                    <tr
                      key={customer.id}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                    >
                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {initials(customer.name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{customer.name}</p>
                            {customer.isGiftBuyer && (
                              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded font-medium">
                                🎁 Gift buyer
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700 dark:text-gray-200">{customer.email}</p>
                        {customer.phone && (
                          <p className="text-xs text-gray-400 dark:text-gray-500">{customer.phone}</p>
                        )}
                      </td>

                      {/* Orders count */}
                      <td className="px-5 py-4">
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full px-2 py-0.5 font-medium">
                          {customer.orderCount} order{customer.orderCount !== 1 ? 's' : ''}
                        </span>
                      </td>

                      {/* Total spent */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">${customer.totalSpent.toFixed(2)}</p>
                      </td>

                      {/* Avg order */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300">${customer.avgOrderValue.toFixed(2)}</p>
                      </td>

                      {/* Tier */}
                      <td className="px-5 py-4">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${TIER_STYLES[customer.tier]}`}>
                          {customer.tier === 'VIP' && '⭐ '}{customer.tier}
                        </span>
                      </td>

                      {/* Last Order */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700 dark:text-gray-200">{fmtDate(customer.lastOrderDate)}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{daysAgo(customer.lastOrderDate)}</p>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedCustomer(customer)}
                            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-150"
                            title="View customer"
                          >
                            <Eye size={16} />
                          </button>
                          <a
                            href={`mailto:${customer.email}`}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
                            title="Send email"
                          >
                            <Mail size={16} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pageCount > 1 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {(safePage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safePage * ITEMS_PER_PAGE, filteredCustomers.length)} of {filteredCustomers.length} customers
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>
                  {Array.from({ length: pageCount }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === pageCount || Math.abs(p - safePage) <= 1)
                    .reduce((acc, p, i, arr) => {
                      if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === '...' ? (
                        <span key={`ellipsis-${i}`} className="px-2 text-gray-400">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          className={`w-8 h-8 text-sm rounded-lg font-medium transition-colors ${
                            safePage === p
                              ? 'bg-rose-500 text-white'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
                    disabled={safePage === pageCount}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
            {pageCount <= 1 && filteredCustomers.length > 0 && (
              <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Showing all {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}
