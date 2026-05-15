import { useState, useMemo } from 'react';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import {
  Download,
  Search,
  Clock,
  Package,
  Truck,
  CheckCircle,
  Eye,
  Trash2,
  X,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

// ─── helpers ────────────────────────────────────────────────────────────────

const STATUS_META = {
  pending:   { label: '⏳ Pending',   cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  packed:    { label: '📦 Packed',    cls: 'bg-blue-100   text-blue-700   border-blue-200'   },
  shipped:   { label: '🚚 Shipped',   cls: 'bg-purple-100 text-purple-700 border-purple-200' },
  delivered: { label: '✅ Delivered', cls: 'bg-green-100  text-green-700  border-green-200'  },
  cancelled: { label: '❌ Cancelled', cls: 'bg-red-100    text-red-700    border-red-200'    },
};

const BADGE_CLS = {
  pending:   'bg-yellow-100 text-yellow-700',
  packed:    'bg-blue-100   text-blue-700',
  shipped:   'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100  text-green-700',
  cancelled: 'bg-red-100    text-red-700',
};

const fmt = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
  };
};

const TIMELINE_STEPS = ['pending', 'packed', 'shipped', 'delivered'];

// ─── Order Detail Modal ──────────────────────────────────────────────────────

function OrderDetailModal({ order, onClose, updateOrderStatus }) {
  const [localStatus, setLocalStatus] = useState(order.status);

  const handleStatusUpdate = () => {
    updateOrderStatus(order.id, localStatus);
    toast.success('Order status updated!');
  };

  const stepIndex = TIMELINE_STEPS.indexOf(order.status);

  const handlePrint = () => window.print();

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <Dialog.Panel className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <Dialog.Title className="text-lg font-bold text-gray-900 dark:text-white font-mono">
              {order.id}
            </Dialog.Title>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${BADGE_CLS[order.status] || ''}`}>
              {STATUS_META[order.status]?.label || order.status}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={22} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Timeline */}
          {order.status !== 'cancelled' && (
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-4 tracking-wider">Order Timeline</p>
              <div className="flex items-center">
                {TIMELINE_STEPS.map((step, i) => {
                  const done = i < stepIndex || (i === stepIndex && order.status !== 'cancelled');
                  const current = i === stepIndex && order.status !== 'cancelled';
                  return (
                    <div key={step} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                          ${done ? 'bg-rose-500 border-rose-500' : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'}
                          ${current ? 'ring-4 ring-rose-200 dark:ring-rose-900 animate-pulse' : ''}`}>
                          {done ? <Check size={14} className="text-white" /> : (
                            <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500" />
                          )}
                        </div>
                        <span className={`text-xs mt-1 capitalize ${done ? 'text-rose-500 font-medium' : 'text-gray-400'}`}>
                          {step}
                        </span>
                      </div>
                      {i < TIMELINE_STEPS.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-1 ${i < stepIndex ? 'bg-rose-400' : 'bg-gray-200 dark:bg-gray-600'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customer + Address */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wider">👤 Customer</p>
              <p className="font-medium text-gray-900 dark:text-white text-sm">{order.customerName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{order.customerEmail}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{order.customerPhone}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wider">📍 Delivery Address</p>
              {order.deliveryAddress ? (
                <>
                  <p className="text-sm text-gray-900 dark:text-white">{order.deliveryAddress.line1}</p>
                  <p className="text-sm text-gray-900 dark:text-white">{order.deliveryAddress.city}, {order.deliveryAddress.postcode}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{order.deliveryAddress.country}</p>
                </>
              ) : <p className="text-sm text-gray-400">—</p>}
              {order.isGift && order.recipientName && (
                <p className="text-xs text-rose-500 mt-2 font-medium">🎁 Gift to: {order.recipientName}</p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3 tracking-wider">Order Items</p>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-300">Product</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-300">Qty</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-300">Price</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-300">Gift Wrap</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-300">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.items || []).map((item, idx) => (
                    <tr key={idx} className="border-t border-gray-100 dark:border-gray-700">
                      <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{item.productName}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{item.qty}</td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">₹{(item.price * item.qty).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        {item.giftWrap ? <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">🎁 Yes</span> : <span className="text-gray-400 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        {item.giftMessage ? (
                          <span className="text-xs text-gray-500 dark:text-gray-400 italic">"{item.giftMessage}"</span>
                        ) : <span className="text-gray-400 text-xs">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3 tracking-wider">Order Summary</p>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>Subtotal</span><span>₹{(order.subtotal || 0).toFixed(2)}</span>
            </div>
            {(order.giftWrapTotal || 0) > 0 && (
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Gift Wrapping</span><span>₹{order.giftWrapTotal.toFixed(2)}</span>
              </div>
            )}
            {(order.discount || 0) > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span><span>-₹{order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>Delivery</span>
              <span>{(order.deliveryCharge || 0) === 0 ? <span className="text-green-600">Free</span> : `₹${order.deliveryCharge.toFixed(2)}`}</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-600 pt-2 flex justify-between font-bold text-gray-900 dark:text-white text-base">
              <span>Total</span><span>₹{(order.total || 0).toFixed(2)}</span>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wider">💳 Payment</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300 capitalize">{order.paymentMethod || 'Card'}</span>
              <span className="text-green-600 font-medium">Paid ✅</span>
            </div>
          </div>

          {/* Change Status */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3 tracking-wider">Update Status</p>
            <div className="flex items-center gap-3">
              <select
                value={localStatus}
                onChange={(e) => setLocalStatus(e.target.value)}
                className={`flex-1 text-sm rounded-lg px-3 py-2 border font-medium focus:outline-none focus:ring-2 focus:ring-rose-400 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${STATUS_META[localStatus]?.cls || ''}`}
              >
                {Object.entries(STATUS_META).map(([val, meta]) => (
                  <option key={val} value={val}>{meta.label}</option>
                ))}
              </select>
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            🖨️ Print Invoice
          </button>
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

// ─── Delete Confirm Modal ────────────────────────────────────────────────────

function DeleteConfirmModal({ orderId, onConfirm, onCancel }) {
  return (
    <Dialog open={true} onClose={onCancel} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
      <Dialog.Panel className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-xl">
        <div className="text-center">
          <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={26} className="text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Delete Order?</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Are you sure you want to delete order <span className="font-mono font-medium text-rose-500">{orderId}</span>? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
              Cancel
            </button>
            <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors font-medium">
              Delete
            </button>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}

// ─── Main Orders Page ────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;
const STATUS_TABS = ['all', 'pending', 'packed', 'shipped', 'delivered', 'cancelled'];

export default function Orders() {
  const { orders, updateOrderStatus, deleteOrder } = useAdmin();

  // filters
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // modals
  const [detailOrder, setDetailOrder] = useState(null);
  const [deleteOrderId, setDeleteOrderId] = useState(null);

  // filtered + sorted orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(o =>
        o.id?.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.customerEmail?.toLowerCase().includes(q)
      );
    }

    if (statusTab !== 'all') {
      result = result.filter(o => o.status === statusTab);
    }

    if (dateFrom) {
      const from = new Date(dateFrom);
      result = result.filter(o => new Date(o.createdAt) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter(o => new Date(o.createdAt) <= to);
    }

    if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === 'oldest') result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortBy === 'total-high') result.sort((a, b) => b.total - a.total);
    else if (sortBy === 'total-low') result.sort((a, b) => a.total - b.total);

    return result;
  }, [orders, search, statusTab, dateFrom, dateTo, sortBy]);

  // pagination
  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, pageCount);
  const pagedOrders = filteredOrders.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const countFor = (s) => orders.filter(o => o.status === s).length;

  // handle delete
  const handleDeleteConfirm = () => {
    if (typeof deleteOrder === 'function') {
      deleteOrder(deleteOrderId);
      toast.success('Order deleted');
    } else {
      // fallback: update status to cancelled if deleteOrder not implemented
      updateOrderStatus(deleteOrderId, 'cancelled');
      toast.success('Order cancelled');
    }
    setDeleteOrderId(null);
  };

  // CSV export
  const exportCSV = () => {
    const headers = [
      'Order ID', 'Customer Name', 'Customer Email',
      'Items', 'Subtotal', 'Gift Wrap', 'Discount',
      'Delivery', 'Total', 'Status', 'Date', 'Is Gift',
      'Recipient', 'Address'
    ];

    const rows = filteredOrders.map(order => [
      order.id,
      order.customerName,
      order.customerEmail,
      (order.items || []).map(i => i.productName + ' x' + i.qty).join('; '),
      order.subtotal,
      order.giftWrapTotal,
      order.discount || 0,
      order.deliveryCharge,
      order.total,
      order.status,
      new Date(order.createdAt).toLocaleDateString(),
      order.isGift ? 'Yes' : 'No',
      order.recipientName || '',
      order.deliveryAddress
        ? order.deliveryAddress.line1 + ', ' + order.deliveryAddress.city
        : ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'giftiny-orders-' + new Date().toISOString().split('T')[0] + '.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported!');
  };

  const clearFilters = () => {
    setSearch('');
    setStatusTab('all');
    setDateFrom('');
    setDateTo('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage and track all customer orders</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-gray-800 dark:bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
        >
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Pending Orders',  status: 'pending',   Icon: Clock,        bg: 'bg-yellow-50 dark:bg-yellow-900/20', iconBg: 'bg-yellow-100 dark:bg-yellow-900/40', textCls: 'text-yellow-600 dark:text-yellow-400' },
          { label: 'Processing',      status: 'packed',    Icon: Package,      bg: 'bg-blue-50   dark:bg-blue-900/20',   iconBg: 'bg-blue-100   dark:bg-blue-900/40',   textCls: 'text-blue-600   dark:text-blue-400'   },
          { label: 'Shipped',         status: 'shipped',   Icon: Truck,        bg: 'bg-purple-50 dark:bg-purple-900/20', iconBg: 'bg-purple-100 dark:bg-purple-900/40', textCls: 'text-purple-600 dark:text-purple-400' },
          { label: 'Delivered',       status: 'delivered', Icon: CheckCircle,  bg: 'bg-green-50  dark:bg-green-900/20',  iconBg: 'bg-green-100  dark:bg-green-900/40',  textCls: 'text-green-600  dark:text-green-400'  },
        ].map(({ label, status, Icon, bg, iconBg, textCls }) => (
          <div key={status} className={`${bg} rounded-xl p-4 flex items-center gap-3`}>
            <div className={`${iconBg} ${textCls} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
              <Icon size={20} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${textCls}`}>{countFor(status)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FILTERS TOOLBAR */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 space-y-3 shadow-sm">
        {/* Row 1: search + sort */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search by order ID, customer name or email..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Date range */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 mb-1">From</label>
              <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
                className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 mb-1">To</label>
              <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
                className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
          </div>

          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
            className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="total-high">Total High-Low</option>
            <option value="total-low">Total Low-High</option>
          </select>
        </div>

        {/* Row 2: status tabs */}
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((s) => {
            const cnt = s === 'all' ? orders.length : countFor(s);
            const active = statusTab === s;
            return (
              <button
                key={s}
                onClick={() => { setStatusTab(s); setCurrentPage(1); }}
                className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
                  active
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-rose-300'
                }`}
              >
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)} ({cnt})
              </button>
            );
          })}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {pagedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <ShoppingCart size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">No orders found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">Try adjusting your filters</p>
            <button onClick={clearFilters} className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm rounded-xl font-medium transition-colors">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    {['Order ID', 'Customer', 'Items', 'Gift', 'Total', 'Status', 'Date', 'Actions'].map((col) => (
                      <th key={col} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pagedOrders.map((order) => {
                    const { date, time } = fmt(order.createdAt);
                    const items = order.items || [];
                    return (
                      <tr key={order.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                        {/* Order ID */}
                        <td className="px-5 py-4">
                          <span className="font-mono text-sm text-rose-500 font-medium">{order.id}</span>
                        </td>

                        {/* Customer */}
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{order.customerName}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{order.customerEmail}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{order.customerPhone}</p>
                        </td>

                        {/* Items */}
                        <td className="px-5 py-4 max-w-[160px]">
                          <p className="text-sm text-gray-700 dark:text-gray-200">{items.length} item{items.length !== 1 ? 's' : ''}</p>
                          {items.slice(0, 2).map((item, i) => (
                            <p key={i} className="text-xs text-gray-400 dark:text-gray-500 truncate">{item.productName}</p>
                          ))}
                          {items.length > 2 && (
                            <p className="text-xs text-gray-400 dark:text-gray-500">+{items.length - 2} more</p>
                          )}
                        </td>

                        {/* Gift */}
                        <td className="px-5 py-4">
                          {order.isGift ? (
                            <div>
                              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">🎁 Gift</span>
                              {order.recipientName && (
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{order.recipientName}</p>
                              )}
                            </div>
                          ) : <span className="text-gray-300 dark:text-gray-600">—</span>}
                        </td>

                        {/* Total */}
                        <td className="px-5 py-4">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">₹{(order.total || 0).toFixed(2)}</p>
                          {(order.giftWrapTotal || 0) > 0 && (
                            <p className="text-xs text-gray-400 dark:text-gray-500">Incl. gift wrap</p>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`text-xs rounded-lg px-2 py-1.5 border font-medium focus:outline-none cursor-pointer dark:bg-gray-700 dark:text-white dark:border-gray-600 ${STATUS_META[order.status]?.cls || ''}`}
                          >
                            {Object.entries(STATUS_META).map(([val, meta]) => (
                              <option key={val} value={val}>{meta.label}</option>
                            ))}
                          </select>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4">
                          <p className="text-sm text-gray-700 dark:text-gray-200">{date}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{time}</p>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setDetailOrder(order)}
                              className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-150"
                              title="View details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteOrderId(order.id)}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-150"
                              title="Delete order"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pageCount > 1 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {(safePage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safePage * ITEMS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} orders
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
            {pageCount <= 1 && filteredOrders.length > 0 && (
              <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Showing all {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {detailOrder && (
        <OrderDetailModal
          order={detailOrder}
          onClose={() => setDetailOrder(null)}
          updateOrderStatus={(id, status) => {
            updateOrderStatus(id, status);
            setDetailOrder(prev => prev ? { ...prev, status } : null);
          }}
        />
      )}
      {deleteOrderId && (
        <DeleteConfirmModal
          orderId={deleteOrderId}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteOrderId(null)}
        />
      )}
    </div>
  );
}
