import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import {
  Shield, Eye, EyeOff, Store, Truck,
  Palette, AlertTriangle, LogOut, RotateCcw, Trash2,
  Moon,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

// ─── Reusable helpers ────────────────────────────────────────────────────────

function SectionCard({ icon: Icon, iconCls = 'text-rose-500', title, subtitle, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6">
      <div className="flex items-center gap-3 mb-1">
        {Icon && <Icon size={20} className={iconCls} />}
        <h2 className="text-base font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">{subtitle}</p>}
      {children}
    </div>
  );
}

function Field({ label, helper, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</label>
      <div className="mt-1">{children}</div>
      {helper && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{helper}</p>}
    </div>
  );
}

const inputCls = 'w-full px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400';

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-rose-500' : 'bg-gray-200 dark:bg-gray-600'}`}
    >
      <span className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

function SaveButton({ onClick, label = 'Save Changes' }) {
  return (
    <button
      onClick={onClick}
      className="mt-4 px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-xl transition-colors"
    >
      {label}
    </button>
  );
}

// ─── Danger Confirm Dialog ───────────────────────────────────────────────────

function DangerDialog({ open, title, description, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  return (
    <Dialog open={open} onClose={onCancel} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
      <Dialog.Panel className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-xl text-center">
        <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={26} className="text-red-500" />
        </div>
        <Dialog.Title className="text-lg font-bold text-gray-900 dark:text-white mb-1">{title}</Dialog.Title>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{description}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg font-medium transition-colors">
            {confirmLabel}
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}

// ─── PIN Input ───────────────────────────────────────────────────────────────

function PinInput({ label, value, onChange, show, onToggle, error }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</label>
      <div className="relative mt-1">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          maxLength={4}
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="••••"
          className={`${inputCls} pr-10 font-mono tracking-widest ${error ? 'ring-2 ring-red-400' : ''}`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// ─── Main Settings Page ──────────────────────────────────────────────────────

export default function Settings() {
  const navigate = useNavigate();
  const {
    storeSettings, updateSettings,
    adminPin, changePin,
    toggleDarkMode, darkMode,
    clearOrders, resetProducts,
    logout,
  } = useAdmin();

  // ── PIN state ──
  const [currentPin, setCurrentPin]       = useState('');
  const [newPin, setNewPin]               = useState('');
  const [confirmPin, setConfirmPin]       = useState('');
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin]       = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [pinErrors, setPinErrors]         = useState({});

  // ── Store form ──
  const [storeForm, setStoreForm] = useState({
    storeName:    storeSettings.storeName    || '',
    storeEmail:   storeSettings.storeEmail   || '',
    storePhone:   storeSettings.storePhone   || '',
    currency:     storeSettings.currency     || 'USD',
    storeAddress: storeSettings.storeAddress || '',
    storeDesc:    storeSettings.storeDesc    || '',
  });

  // ── Delivery form ──
  const [deliveryForm, setDeliveryForm] = useState({
    freeShippingThreshold:  storeSettings.freeShippingThreshold  ?? 40,
    standardDeliveryCharge: storeSettings.standardDeliveryCharge ?? 4.99,
    expressDeliveryCharge:  storeSettings.expressDeliveryCharge  ?? 9.99,
    sameDayCharge:          storeSettings.sameDayCharge          ?? 19.99,
    giftWrapCharge:         storeSettings.giftWrapCharge         ?? 3.99,
    lowStockThreshold:      storeSettings.lowStockThreshold      ?? 5,
  });

  // ── Danger dialogs ──
  const [dangerDialog, setDangerDialog] = useState(null); // null | 'orders' | 'products'

  // ── PIN handlers ──
  const handlePinUpdate = () => {
    const errs = {};
    if (currentPin !== adminPin) errs.current = 'Incorrect current PIN';
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) errs.new = 'PIN must be exactly 4 digits';
    if (newPin === currentPin) errs.new = 'New PIN must be different from current PIN';
    if (confirmPin !== newPin) errs.confirm = 'PINs do not match';
    if (Object.keys(errs).length) { setPinErrors(errs); return; }
    changePin(newPin);
    toast.success('PIN updated successfully! 🔐');
    setCurrentPin(''); setNewPin(''); setConfirmPin('');
    setPinErrors({});
  };

  // ── Store save ──
  const handleStoreSave = () => {
    updateSettings(storeForm);
    toast.success('Store info saved!');
  };

  // ── Delivery save ──
  const handleDeliverySave = () => {
    const nums = {};
    Object.entries(deliveryForm).forEach(([k, v]) => { nums[k] = parseFloat(v) || 0; });
    updateSettings(nums);
    toast.success('Delivery settings saved!');
  };

  // ── Danger zone ──
  const handleDangerConfirm = () => {
    if (dangerDialog === 'orders') {
      clearOrders();
      toast.success('All orders cleared');
    } else if (dangerDialog === 'products') {
      resetProducts();
      toast.success('Products reset to default!');
    }
    setDangerDialog(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="max-w-3xl mx-auto">

      {/* ── CARD 1: Security ── */}
      <SectionCard icon={Shield} title="Security" subtitle="Change your admin PIN">
        <div className="mb-4 flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Current PIN:</p>
          <span className="font-mono text-gray-900 dark:text-white text-base tracking-widest">● ● ● ●</span>
        </div>

        <div className="space-y-4">
          <PinInput
            label="Current PIN"
            value={currentPin}
            onChange={e => { setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setPinErrors(prev => ({ ...prev, current: '' })); }}
            show={showCurrentPin}
            onToggle={() => setShowCurrentPin(v => !v)}
            error={pinErrors.current}
          />
          <PinInput
            label="New PIN"
            value={newPin}
            onChange={e => { setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setPinErrors(prev => ({ ...prev, new: '' })); }}
            show={showNewPin}
            onToggle={() => setShowNewPin(v => !v)}
            error={pinErrors.new}
          />
          <PinInput
            label="Confirm New PIN"
            value={confirmPin}
            onChange={e => { setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setPinErrors(prev => ({ ...prev, confirm: '' })); }}
            show={showConfirmPin}
            onToggle={() => setShowConfirmPin(v => !v)}
            error={pinErrors.confirm}
          />
          <button
            onClick={handlePinUpdate}
            className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-xl transition-colors"
          >
            Update PIN
          </button>
        </div>

        {/* PIN tips */}
        <div className="mt-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">💡 Tips for a secure PIN:</p>
          <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1 list-disc list-inside">
            <li>Avoid obvious sequences like 1234 or 0000</li>
            <li>Don't use your birth year</li>
            <li>Change your PIN regularly</li>
          </ul>
        </div>
      </SectionCard>

      {/* ── CARD 2: Store Information ── */}
      <SectionCard icon={Store} title="Store Information" subtitle="Your shop's public details">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Store Name">
            <input type="text" value={storeForm.storeName} onChange={e => setStoreForm(p => ({ ...p, storeName: e.target.value }))} className={inputCls} />
          </Field>
          <Field label="Store Email">
            <input type="email" value={storeForm.storeEmail} onChange={e => setStoreForm(p => ({ ...p, storeEmail: e.target.value }))} className={inputCls} />
          </Field>
          <Field label="Store Phone">
            <input type="text" value={storeForm.storePhone} onChange={e => setStoreForm(p => ({ ...p, storePhone: e.target.value }))} className={inputCls} />
          </Field>
          <Field label="Currency">
            <select value={storeForm.currency} onChange={e => setStoreForm(p => ({ ...p, currency: e.target.value }))} className={inputCls}>
              {['USD', 'GBP', 'EUR', 'INR', 'AUD'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <div className="col-span-2">
            <Field label="Store Address">
              <input type="text" value={storeForm.storeAddress} onChange={e => setStoreForm(p => ({ ...p, storeAddress: e.target.value }))} className={inputCls} />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Store Description">
              <textarea rows={3} value={storeForm.storeDesc} onChange={e => setStoreForm(p => ({ ...p, storeDesc: e.target.value }))} className={`${inputCls} resize-none`} />
            </Field>
          </div>
        </div>
        <SaveButton onClick={handleStoreSave} label="Save Store Info" />
      </SectionCard>

      {/* ── CARD 3: Delivery Settings ── */}
      <SectionCard icon={Truck} title="Delivery Settings" subtitle="Shipping charges and thresholds">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Free Shipping Threshold ($)" helper="Orders above this amount get free shipping">
            <input type="number" min="0" step="0.01" value={deliveryForm.freeShippingThreshold} onChange={e => setDeliveryForm(p => ({ ...p, freeShippingThreshold: e.target.value }))} className={inputCls} />
          </Field>
          <Field label="Standard Delivery Charge ($)">
            <input type="number" min="0" step="0.01" value={deliveryForm.standardDeliveryCharge} onChange={e => setDeliveryForm(p => ({ ...p, standardDeliveryCharge: e.target.value }))} className={inputCls} />
          </Field>
          <Field label="Express Delivery Charge ($)">
            <input type="number" min="0" step="0.01" value={deliveryForm.expressDeliveryCharge} onChange={e => setDeliveryForm(p => ({ ...p, expressDeliveryCharge: e.target.value }))} className={inputCls} />
          </Field>
          <Field label="Same Day Delivery Charge ($)">
            <input type="number" min="0" step="0.01" value={deliveryForm.sameDayCharge} onChange={e => setDeliveryForm(p => ({ ...p, sameDayCharge: e.target.value }))} className={inputCls} />
          </Field>
          <Field label="Gift Wrap Charge ($)">
            <input type="number" min="0" step="0.01" value={deliveryForm.giftWrapCharge} onChange={e => setDeliveryForm(p => ({ ...p, giftWrapCharge: e.target.value }))} className={inputCls} />
          </Field>
          <Field label="Low Stock Alert Threshold" helper="Alert when stock falls below this number">
            <input type="number" min="1" value={deliveryForm.lowStockThreshold} onChange={e => setDeliveryForm(p => ({ ...p, lowStockThreshold: e.target.value }))} className={inputCls} />
          </Field>
        </div>
        <SaveButton onClick={handleDeliverySave} label="Save Delivery Settings" />
      </SectionCard>

      {/* ── CARD 4: Appearance ── */}
      <SectionCard icon={Palette} title="Appearance" subtitle="Customise the admin interface">
        <div className="space-y-4">
          {/* Dark mode toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="flex items-center gap-3">
              <Moon size={18} className="text-gray-500 dark:text-gray-300" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Admin Dark Mode</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{darkMode ? 'Dark mode is on' : 'Light mode is active'}</p>
              </div>
            </div>
            <ToggleSwitch checked={darkMode} onChange={toggleDarkMode} />
          </div>

          {/* Brand color (informational) */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-rose-500 flex-shrink-0 ring-2 ring-rose-200 dark:ring-rose-800" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">GiftHaven Rose</p>
              <p className="text-xs font-mono text-gray-500 dark:text-gray-400">#f43f5e</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Contact developer to change brand colors</p>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── CARD 5: Danger Zone ── */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <AlertTriangle size={20} className="text-red-500" />
          <h2 className="text-base font-bold text-red-600 dark:text-red-400">Danger Zone</h2>
        </div>

        <div className="space-y-4">
          {/* Clear orders */}
          <div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-red-100 dark:border-red-900">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Clear All Orders</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Permanently delete all order history</p>
            </div>
            <button
              onClick={() => setDangerDialog('orders')}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 size={15} /> Clear Orders
            </button>
          </div>

          {/* Reset products */}
          <div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-red-100 dark:border-red-900">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Reset Products to Default</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Reset product catalog to original data</p>
            </div>
            <button
              onClick={() => setDangerDialog('products')}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <RotateCcw size={15} /> Reset Products
            </button>
          </div>

          {/* Logout */}
          <div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-red-100 dark:border-red-900">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Admin Logout</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">End your current admin session</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Danger confirmation dialogs */}
      <DangerDialog
        open={dangerDialog === 'orders'}
        title="Clear All Orders?"
        description="This will permanently delete all order history. This action cannot be undone."
        confirmLabel="Clear Orders"
        onConfirm={handleDangerConfirm}
        onCancel={() => setDangerDialog(null)}
      />
      <DangerDialog
        open={dangerDialog === 'products'}
        title="Reset Products?"
        description="This will replace your current product catalog with the original default data. Any added or edited products will be lost."
        confirmLabel="Reset Products"
        onConfirm={handleDangerConfirm}
        onCancel={() => setDangerDialog(null)}
      />
    </div>
  );
}
