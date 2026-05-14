import { useState, useMemo } from 'react';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import {
  Plus, Tag, CheckCircle, BarChart2, XCircle,
  Copy, Pencil, Trash2, X, ToggleLeft, ToggleRight,
  AlertTriangle,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

// ─── helpers ────────────────────────────────────────────────────────────────

const today = new Date().toISOString().split('T')[0];

const fmtDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

const expiryStatus = (iso) => {
  if (!iso) return { label: '—', cls: 'text-gray-400' };
  const expiry = new Date(iso);
  const now = new Date();
  const diffDays = Math.ceil((expiry - now) / 86400000);
  if (diffDays < 0)  return { label: 'Expired',      cls: 'text-red-500 font-medium' };
  if (diffDays <= 7) return { label: 'Expires soon',  cls: 'text-amber-500 font-medium' };
  return { label: 'Valid', cls: 'text-green-500 font-medium' };
};

const EMPTY_FORM = {
  code: '',
  type: 'percent',
  value: '',
  minOrder: 0,
  usageLimit: 100,
  expiresAt: '',
  isActive: true,
};

// ─── Toggle Switch ───────────────────────────────────────────────────────────

function ToggleSwitch({ checked, onChange, size = 'md' }) {
  const track = size === 'sm' ? 'w-9 h-5' : 'w-11 h-6';
  const thumb = size === 'sm' ? 'w-4 h-4 translate-x-4' : 'w-5 h-5 translate-x-5';
  const thumbBase = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <button
      type="button"
      onClick={onChange}
      className={`${track} rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-rose-500' : 'bg-gray-200 dark:bg-gray-600'}`}
    >
      <span className={`block ${thumbBase} bg-white rounded-full shadow transform transition-transform ${checked ? thumb : 'translate-x-0.5'}`} />
    </button>
  );
}

// ─── Add/Edit Coupon Modal ───────────────────────────────────────────────────

function CouponModal({ mode, coupon, onClose, onSave }) {
  const [form, setForm] = useState(
    mode === 'edit' ? {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrder: coupon.minOrder ?? 0,
      usageLimit: coupon.usageLimit ?? 100,
      expiresAt: coupon.expiresAt ? coupon.expiresAt.split('T')[0] : '',
      isActive: coupon.isActive ?? true,
    } : { ...EMPTY_FORM }
  );
  const [errors, setErrors] = useState({});

  const set = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.code.trim()) errs.code = 'Code is required';
    else if (/\s/.test(form.code)) errs.code = 'No spaces allowed';
    if (!form.value || Number(form.value) <= 0) errs.value = 'Must be greater than 0';
    if (form.type === 'percent' && Number(form.value) > 100) errs.value = 'Max 100%';
    if (!form.expiresAt) errs.expiresAt = 'Expiry date is required';
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({
      ...form,
      code: form.code.toUpperCase().trim(),
      value: Number(form.value),
      minOrder: Number(form.minOrder),
      usageLimit: Number(form.usageLimit),
      expiresAt: new Date(form.expiresAt).toISOString(),
    });
  };

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <Dialog.Panel className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <Dialog.Title className="text-lg font-bold text-gray-900 dark:text-white">
            {mode === 'add' ? 'Create Coupon' : 'Edit Coupon'}
          </Dialog.Title>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Code */}
          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-white">Coupon Code *</label>
            <input
              type="text"
              value={form.code}
              onChange={e => set('code', e.target.value.toUpperCase().replace(/\s/g, ''))}
              placeholder="e.g. SAVE10"
              maxLength={20}
              className={`w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 ${errors.code ? 'ring-2 ring-red-400' : ''}`}
            />
            {errors.code
              ? <p className="text-xs text-red-500 mt-1">{errors.code}</p>
              : <p className="text-xs text-gray-400 mt-1">Letters and numbers only, e.g. SAVE10</p>}
          </div>

          {/* Type */}
          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-white">Discount Type</label>
            <div className="flex gap-4 mt-2">
              {[
                { val: 'percent', label: 'Percentage (%)' },
                { val: 'fixed',   label: 'Fixed Amount ($)' },
              ].map(opt => (
                <label key={opt.val} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value={opt.val}
                    checked={form.type === opt.val}
                    onChange={() => set('type', opt.val)}
                    className="accent-rose-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Value */}
          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-white">Discount Value *</label>
            <input
              type="number"
              value={form.value}
              onChange={e => set('value', e.target.value)}
              placeholder={form.type === 'percent' ? 'e.g. 10 for 10%' : 'e.g. 5 for $5'}
              min="0"
              max={form.type === 'percent' ? 100 : undefined}
              step="0.01"
              className={`w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 ${errors.value ? 'ring-2 ring-red-400' : ''}`}
            />
            {errors.value && <p className="text-xs text-red-500 mt-1">{errors.value}</p>}
          </div>

          {/* Grid: min order + usage limit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-white">Min Order ($)</label>
              <input
                type="number"
                value={form.minOrder}
                onChange={e => set('minOrder', e.target.value)}
                min="0"
                step="0.01"
                className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
              <p className="text-xs text-gray-400 mt-1">0 = no minimum</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-white">Usage Limit</label>
              <input
                type="number"
                value={form.usageLimit}
                onChange={e => set('usageLimit', e.target.value)}
                min="0"
                className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
              <p className="text-xs text-gray-400 mt-1">0 = unlimited</p>
            </div>
          </div>

          {/* Expiry date */}
          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-white">Expiry Date *</label>
            <input
              type="date"
              value={form.expiresAt}
              min={today}
              onChange={e => set('expiresAt', e.target.value)}
              className={`w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 ${errors.expiresAt ? 'ring-2 ring-red-400' : ''}`}
            />
            {errors.expiresAt && <p className="text-xs text-red-500 mt-1">{errors.expiresAt}</p>}
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between py-1">
            <span className="text-sm font-medium text-gray-900 dark:text-white">Coupon is active</span>
            <ToggleSwitch checked={form.isActive} onChange={() => set('isActive', !form.isActive)} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-lg transition-colors">
            Save Coupon
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}

// ─── Delete Confirm ──────────────────────────────────────────────────────────

function DeleteConfirmModal({ code, onConfirm, onCancel }) {
  return (
    <Dialog open={true} onClose={onCancel} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
      <Dialog.Panel className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-xl text-center">
        <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={26} className="text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Delete Coupon?</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Delete coupon <span className="font-mono font-bold text-rose-500">{code}</span>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors font-medium">
            Delete
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}

// ─── Main Coupons Page ───────────────────────────────────────────────────────

export default function Coupons() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useAdmin();

  const [modalMode, setModalMode]       = useState(null); // null | 'add' | 'edit'
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [deletingCoupon, setDeletingCoupon] = useState(null);

  // Stats
  const activeCount  = coupons.filter(c => c.isActive).length;
  const totalUses    = coupons.reduce((s, c) => s + (c.usedCount || 0), 0);
  const expiredCount = coupons.filter(c => new Date(c.expiresAt) < new Date()).length;

  const openAdd  = () => { setEditingCoupon(null); setModalMode('add'); };
  const openEdit = (c)  => { setEditingCoupon(c); setModalMode('edit'); };
  const closeModal = () => { setModalMode(null); setEditingCoupon(null); };

  const handleSave = (data) => {
    if (modalMode === 'add') {
      addCoupon({ ...data, usedCount: 0 });
    } else {
      updateCoupon(editingCoupon.id, data);
    }
    toast.success('Coupon saved! 🎟️');
    closeModal();
  };

  const handleDeleteConfirm = () => {
    deleteCoupon(deletingCoupon.id);
    toast.success('Coupon deleted');
    setDeletingCoupon(null);
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => toast.success('Code copied!'));
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Coupons</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage discount codes</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl transition-colors text-sm font-medium"
        >
          <Plus size={18} /> Create Coupon
        </button>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Coupons',  value: coupons.length, Icon: Tag,         bg: 'bg-blue-50   dark:bg-blue-900/20',   iconBg: 'bg-blue-100   dark:bg-blue-900/40',   textCls: 'text-blue-600   dark:text-blue-400'   },
          { label: 'Active',         value: activeCount,    Icon: CheckCircle,  bg: 'bg-green-50  dark:bg-green-900/20',  iconBg: 'bg-green-100  dark:bg-green-900/40',  textCls: 'text-green-600  dark:text-green-400'  },
          { label: 'Total Uses',     value: totalUses,      Icon: BarChart2,    bg: 'bg-purple-50 dark:bg-purple-900/20', iconBg: 'bg-purple-100 dark:bg-purple-900/40', textCls: 'text-purple-600 dark:text-purple-400' },
          { label: 'Expired',        value: expiredCount,   Icon: XCircle,      bg: 'bg-red-50    dark:bg-red-900/20',    iconBg: 'bg-red-100    dark:bg-red-900/40',    textCls: 'text-red-500    dark:text-red-400'    },
        ].map(({ label, value, Icon, bg, iconBg, textCls }) => (
          <div key={label} className={`${bg} rounded-2xl p-4 shadow-sm flex items-center gap-3`}>
            <div className={`${iconBg} ${textCls} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
              <Icon size={20} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${textCls}`}>{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Tag size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No coupons yet</p>
            <button onClick={openAdd} className="mt-4 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm rounded-xl font-medium transition-colors">
              Create your first coupon
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  {['Code', 'Type & Value', 'Min Order', 'Usage', 'Expires', 'Status', 'Actions'].map(col => (
                    <th key={col} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coupons.map(coupon => {
                  const usePct = coupon.usageLimit > 0 ? Math.min(100, ((coupon.usedCount || 0) / coupon.usageLimit) * 100) : 0;
                  const limitReached = coupon.usageLimit > 0 && (coupon.usedCount || 0) >= coupon.usageLimit;
                  const { label: expLabel, cls: expCls } = expiryStatus(coupon.expiresAt);

                  return (
                    <tr key={coupon.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                      {/* Code */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-gray-900 dark:text-white text-sm">{coupon.code}</span>
                          <button
                            onClick={() => copyCode(coupon.code)}
                            className="p-1 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-colors"
                            title="Copy code"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </td>

                      {/* Type + Value */}
                      <td className="px-5 py-4">
                        {coupon.type === 'percent' ? (
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-bold">
                            {coupon.value}% OFF
                          </span>
                        ) : (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full font-bold">
                            ${coupon.value} OFF
                          </span>
                        )}
                      </td>

                      {/* Min Order */}
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {(coupon.minOrder || 0) > 0 ? `$${coupon.minOrder} min` : <span className="text-gray-400">No minimum</span>}
                      </td>

                      {/* Usage */}
                      <td className="px-5 py-4 min-w-[140px]">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {coupon.usedCount || 0} / {coupon.usageLimit || '∞'} uses
                        </p>
                        {coupon.usageLimit > 0 && (
                          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${limitReached ? 'bg-red-400' : 'bg-rose-500'}`}
                              style={{ width: `${usePct}%` }}
                            />
                          </div>
                        )}
                        {limitReached && <p className="text-xs text-red-500 mt-1 font-medium">Limit reached</p>}
                      </td>

                      {/* Expires */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700 dark:text-gray-200">{fmtDate(coupon.expiresAt)}</p>
                        <p className={`text-xs ${expCls}`}>{expLabel}</p>
                      </td>

                      {/* Status toggle */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <ToggleSwitch
                            checked={coupon.isActive}
                            onChange={() => updateCoupon(coupon.id, { isActive: !coupon.isActive })}
                            size="sm"
                          />
                          <span className={`text-xs font-medium ${coupon.isActive ? 'text-green-500' : 'text-gray-400'}`}>
                            {coupon.isActive ? 'On' : 'Off'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(coupon)}
                            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-150"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeletingCoupon(coupon)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-150"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <CouponModal mode={modalMode} coupon={editingCoupon} onClose={closeModal} onSave={handleSave} />
      )}
      {deletingCoupon && (
        <DeleteConfirmModal
          code={deletingCoupon.code}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingCoupon(null)}
        />
      )}
    </div>
  );
}
