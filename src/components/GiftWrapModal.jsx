import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const WRAP_STYLES = ['Classic Red 🎀', 'Floral Pink 🌸', 'Elegant Gold ✨'];

export default function GiftWrapModal({ open, onClose, item }) {
  const { updateGiftOptions } = useCart();
  const [giftWrap, setGiftWrap] = useState(false);
  const [wrapStyle, setWrapStyle] = useState(WRAP_STYLES[0]);
  const [giftMessage, setGiftMessage] = useState('');

  useEffect(() => {
    if (item) {
      setGiftWrap(item.giftWrap || false);
      setWrapStyle(item.selectedWrapStyle || WRAP_STYLES[0]);
      setGiftMessage(item.giftMessage || '');
    }
  }, [item]);

  if (!item) return null;

  const handleSave = () => {
    updateGiftOptions(item.product.id, {
      giftWrap,
      selectedWrapStyle: giftWrap ? wrapStyle : '',
      giftMessage: giftWrap ? giftMessage : ''
    });
    onClose();
  };

  return (
    <Transition show={open} as="div">
      <Dialog as="div" className="relative z-[150]" onClose={onClose}>
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all">
                <div className="flex items-center justify-between mb-5">
                  <Dialog.Title className="text-xl font-bold text-slate-900">
                    Edit Gift Options
                  </Dialog.Title>
                  <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="mb-6 pb-6 border-b border-slate-100 flex items-center gap-4">
                  <img src={item.product.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm line-clamp-1">{item.product.name}</h3>
                    <p className="text-slate-500 text-xs mt-1">Qty: {item.qty}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Add gift wrapping</p>
                      <p className="text-xs text-slate-500">+$3.99 per item</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setGiftWrap(!giftWrap)}
                      className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${giftWrap ? 'bg-rose-500' : 'bg-slate-200'}`}
                    >
                      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${giftWrap ? 'translate-x-6' : ''}`} />
                    </button>
                  </div>

                  {giftWrap && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div>
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-2">Wrap Style</p>
                        <div className="flex gap-2 flex-wrap">
                          {WRAP_STYLES.map(style => (
                            <button key={style} onClick={() => setWrapStyle(style)}
                              className={`text-xs px-3 py-1.5 rounded-full border-2 font-medium transition-all
                                ${wrapStyle === style
                                  ? 'border-rose-500 bg-rose-50 text-rose-700'
                                  : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                              {style}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-2">Gift Message</p>
                        <textarea
                          rows={3}
                          maxLength={150}
                          value={giftMessage}
                          onChange={e => setGiftMessage(e.target.value)}
                          placeholder="Write a personal message for the card…"
                          className="w-full border border-slate-200 rounded-lg p-3 text-sm resize-none
                            focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white placeholder:text-slate-400"
                        />
                        <p className="text-xs text-slate-400 text-right mt-1">{giftMessage.length}/150</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex gap-3">
                  <button onClick={onClose}
                    className="flex-1 bg-white border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleSave}
                    className="flex-1 bg-rose-600 text-white font-semibold py-3 rounded-xl hover:bg-rose-700 transition-colors shadow-md shadow-rose-200 active:scale-[0.98]">
                    Save Options
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
