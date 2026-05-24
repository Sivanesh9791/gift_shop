import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  SlidersHorizontal, X, ChevronDown, ChevronUp,
  LayoutGrid, LayoutList
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { products as productsData } from '../data/products';

/* ──────────────────────────────────────────────────────────
   STATIC CONFIG
────────────────────────────────────────────────────────── */
const OCCASIONS = [
  { value: 'birthday',     label: 'Birthday' },
  { value: 'anniversary',  label: 'Anniversary' },
  { value: 'valentine',    label: 'Valentine' },
  { value: 'wedding',      label: 'Wedding' },
  { value: 'corporate',    label: 'Corporate' },
  { value: 'return',       label: 'Return' },
  { value: 'graduation',   label: 'Graduation' },
  { value: 'housewarming', label: 'Housewarming' },
  { value: 'diwali',       label: 'Diwali' },
  { value: 'newborn',      label: 'Newborn' },
];

const CATEGORIES = [
  { value: 'ceramicMugs', label: '🖨️ Ceramic Mugs' },
  { value: 'umbrellas', label: '☂️ Umbrellas' },
  { value: 'laserEngraved', label: '🪵 Laser Engraved Items' },
  { value: 'photoFrames', label: '🖼️ Photo Frames & Plaques' },
  { value: 'returnGifts', label: '🎁 Return Gifts' },
  { value: 'birthdayGifts', label: '🎂 Birthday Gifts' },
  { value: 'corporateGifts', label: '💼 Corporate Gifts' },
  { value: 'customMerchandise', label: '🪄 Custom Merchandise' },
];

const RECIPIENTS = [
  { value: '',          label: 'Anyone' },
  { value: 'her',       label: 'For Her' },
  { value: 'him',       label: 'For Him' },
  { value: 'kids',      label: 'For Kids' },
  { value: 'couple',    label: 'For Couples' },
  { value: 'newborn',   label: 'For Baby' },
  { value: 'colleague', label: 'For Colleague' },
];

const RATING_OPTIONS = [
  { value: '4', label: '4★ & above' },
  { value: '3', label: '3★ & above' },
];

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-asc',   label: 'Price: Low – High' },
  { value: 'price-desc',  label: 'Price: High – Low' },
  { value: 'newest',      label: 'Newest First' },
  { value: 'rating',      label: 'Best Rated' },
];

const PAGE_SIZE = 12;
const MAX_PRICE = 5000;

/* ──────────────────────────────────────────────────────────
   DUAL RANGE SLIDER
────────────────────────────────────────────────────────── */
function DualRangeSlider({ min, max, value, onChange }) {
  const [lo, hi] = value;
  const trackRef = useRef(null);

  const pct = (v) => ((v - min) / (max - min)) * 100;

  function clamp(v) { return Math.min(max, Math.max(min, v)); }

  function handleLo(e) {
    const next = clamp(Number(e.target.value));
    if (next < hi) onChange([next, hi]);
  }
  function handleHi(e) {
    const next = clamp(Number(e.target.value));
    if (next > lo) onChange([lo, next]);
  }

  return (
    <div className="px-1">
      <div className="relative h-5 flex items-center" ref={trackRef}>
        <div className="absolute w-full h-1.5 bg-slate-200 rounded-full" />
        <div
          className="absolute h-1.5 bg-rose-500 rounded-full"
          style={{ left: `${pct(lo)}%`, width: `${pct(hi) - pct(lo)}%` }}
        />
        <input type="range" min={min} max={max} step={5} value={lo} onChange={handleLo}
          className="absolute w-full appearance-none bg-transparent pointer-events-none
            [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-rose-500
            [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-rose-500 [&::-moz-range-thumb]:cursor-pointer"
        />
        <input type="range" min={min} max={max} step={5} value={hi} onChange={handleHi}
          className="absolute w-full appearance-none bg-transparent pointer-events-none
            [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-rose-500
            [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-rose-500 [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>
      <div className="flex justify-between mt-2 text-sm font-medium text-slate-600">
        <span>₹{lo}</span>
        <span>₹{hi === MAX_PRICE ? `${hi}+` : hi}</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   COLLAPSIBLE SIDEBAR SECTION
────────────────────────────────────────────────────────── */
function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 py-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between font-semibold text-slate-800 mb-1 hover:text-rose-600 transition-colors"
      >
        <span>{title}</span>
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group select-none">
      <input type="checkbox" checked={checked} onChange={onChange}
        className="w-4 h-4 rounded accent-rose-500 cursor-pointer" />
      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
    </label>
  );
}

function RadioItem({ label, value, current, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group select-none">
      <input type="radio" name="recipient" value={value} checked={current === value} onChange={() => onChange(value)}
        className="w-4 h-4 accent-rose-500 cursor-pointer" />
      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
    </label>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200
      text-xs font-medium px-3 py-1.5 rounded-full hover:bg-rose-100 transition-colors">
      {label}
      <button onClick={onRemove} className="hover:text-rose-900 ml-0.5"><X size={11} /></button>
    </span>
  );
}

/* ──────────────────────────────────────────────────────────
   MAIN SHOP PAGE
────────────────────────────────────────────────────────── */
export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  // STEP 1 — Read ALL URL params correctly:
  const urlCategory = searchParams.get('category') || '';
  const urlFilter = searchParams.get('filter') || '';
  const urlSearch = searchParams.get('search') || '';
  const urlOccasion = searchParams.get('occasion') || '';

  const [search,             setSearch]             = useState(urlSearch);
  const [selectedOccasions,  setSelectedOccasions]  = useState(urlOccasion ? [urlOccasion] : []);
  const [categoryFilter,     setCategoryFilter]     = useState(urlCategory || 'all');
  const [recipient,          setRecipient]          = useState('');
  const [priceRange,         setPriceRange]         = useState([0, MAX_PRICE]);
  const [showSaleOnly,       setShowSaleOnly]       = useState(false);
  const [showFreeDelivery,   setShowFreeDelivery]   = useState(false);
  const [showPersonalised,   setShowPersonalised]   = useState(false);
  const [showInStockOnly,    setShowInStockOnly]    = useState(false);
  const [showNewOnly,        setShowNewOnly]        = useState(false);
  const [showBestseller,     setShowBestseller]     = useState(false);
  const [minRating,          setMinRating]          = useState('');
  const [sort,               setSort]               = useState('recommended');
  const [viewMode,           setViewMode]           = useState('grid');
  const [visibleCount,       setVisibleCount]       = useState(PAGE_SIZE);
  const [sidebarOpen,        setSidebarOpen]        = useState(false);
  const [isLoading,          setIsLoading]          = useState(true);

  useEffect(() => {
    document.title = "Shop Personalised Gifts | ClassyPik Gifts";
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // STEP 2 — Sync URL params to local state on change:
  useEffect(() => {
    if (urlCategory) setCategoryFilter(urlCategory);
    if (urlSearch) setSearch(urlSearch);
  }, [urlCategory, urlSearch]);

  // STEP 6 — Reset sidebar filters when navbar category changes:
  useEffect(() => {
    setShowSaleOnly(false);
    setShowNewOnly(false);
    setShowBestseller(false);
    setPriceRange([0, MAX_PRICE]);
  }, [urlCategory]);

  const toggleArr = (setter, val) =>
    setter(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  // STEP 3 — Fix the filtering logic:
  const filtered = useMemo(() => {
    let list = [...productsData];

    // Apply URL category FIRST (highest priority):
    if (urlCategory) {
      list = list.filter(p => p.category === urlCategory);
    }

    // Apply URL filter (sale, new, bestseller):
    if (urlFilter === 'Sale') {
      list = list.filter(p => p.isSale === true);
    } else if (urlFilter === 'New') {
      list = list.filter(p => p.isNew === true);
    }

    // Apply search:
    if (urlSearch) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(urlSearch.toLowerCase()) ||
        p.description?.toLowerCase().includes(urlSearch.toLowerCase()) ||
        p.shortDesc?.toLowerCase().includes(urlSearch.toLowerCase()) ||
        p.category?.toLowerCase().includes(urlSearch.toLowerCase()) ||
        p.tags?.some(t => t.toLowerCase().includes(urlSearch.toLowerCase()))
      );
    }

    // Apply sidebar category filter ONLY if no URL category:
    if (!urlCategory && categoryFilter && categoryFilter !== 'all') {
      list = list.filter(p => p.category === categoryFilter);
    }

    // Occasions (urlOccasion + selectedOccasions)
    if (selectedOccasions.length > 0) {
      list = list.filter(p =>
        p.occasions?.some(o => selectedOccasions.includes(o)) ||
        p.tags?.some(t => selectedOccasions.includes(t))
      );
    }

    // Recipient
    if (recipient && recipient !== 'anyone') {
      list = list.filter(p => p.recipient === recipient);
    }

    // Apply price range:
    list = list.filter(p =>
      p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Apply special toggles:
    if (showSaleOnly) list = list.filter(p => p.isSale);
    if (showNewOnly) list = list.filter(p => p.isNew);
    if (showBestseller) list = list.filter(p => p.isBestseller);
    if (showFreeDelivery) list = list.filter(p => p.freeDelivery);
    if (showPersonalised) list = list.filter(p => p.isPersonalisable);
    if (showInStockOnly) list = list.filter(p => p.inStock);
    if (minRating) list = list.filter(p => p.rating >= Number(minRating));

    // Sort order
    switch (sort) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
      case 'newest':     list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      default:           list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }
    
    return list;
  }, [urlCategory, urlFilter, urlSearch, categoryFilter, selectedOccasions, recipient, priceRange,
      showSaleOnly, showNewOnly, showBestseller, showFreeDelivery, showPersonalised, showInStockOnly, minRating, sort]);

  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [filtered]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const setUrlParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val);
    else p.delete(key);
    setSearchParams(p);
  };

  const clearAll = useCallback(() => {
    setSearchParams(new URLSearchParams());
    setCategoryFilter('all');
    setSearch('');
    setSelectedOccasions([]);
    setRecipient('');
    setPriceRange([0, MAX_PRICE]);
    setShowSaleOnly(false);
    setShowFreeDelivery(false);
    setShowPersonalised(false);
    setShowInStockOnly(false);
    setShowNewOnly(false);
    setShowBestseller(false);
    setMinRating('');
    setSort('recommended');
  }, [setSearchParams]);

  // STEP 4 — Fix active filter chips
  const chips = [
    ...(urlCategory ? [{ key: 'url-cat', label: CATEGORIES.find(c => c.value === urlCategory)?.label || urlCategory, rm: () => setUrlParam('category', null) }] : []),
    ...(urlFilter ? [{ key: 'url-filter', label: urlFilter, rm: () => setUrlParam('filter', null) }] : []),
    ...(urlSearch ? [{ key: 'url-search', label: `"${urlSearch}"`, rm: () => setUrlParam('search', null) }] : []),
    ...(!urlCategory && categoryFilter !== 'all' ? [{ key: `cat-${categoryFilter}`, label: CATEGORIES.find(c => c.value === categoryFilter)?.label || categoryFilter, rm: () => setCategoryFilter('all') }] : []),
    ...selectedOccasions.map(v => ({ key: `occ-${v}`, label: OCCASIONS.find(o => o.value === v)?.label?.replace(/\s\S+$/, '') || v, rm: () => { toggleArr(setSelectedOccasions, v); if (v === urlOccasion) setUrlParam('occasion', null); } })),
    ...(recipient ? [{ key:'rec', label: RECIPIENTS.find(r => r.value === recipient)?.label || recipient, rm: () => setRecipient('') }] : []),
    ...(priceRange[0] > 0 || priceRange[1] < MAX_PRICE ? [{ key:'price', label:`₹${priceRange[0]}–₹${priceRange[1]}`, rm: () => setPriceRange([0, MAX_PRICE]) }] : []),
    ...(showSaleOnly ? [{ key:'sale', label:'On Sale', rm: () => setShowSaleOnly(false) }] : []),
    ...(showFreeDelivery ? [{ key:'free', label:'Free Delivery', rm: () => setShowFreeDelivery(false) }] : []),
    ...(showPersonalised ? [{ key:'pers', label:'Personalised', rm: () => setShowPersonalised(false) }] : []),
    ...(showInStockOnly ? [{ key:'stock', label:'In Stock', rm: () => setShowInStockOnly(false) }] : []),
    ...(showNewOnly ? [{ key:'new', label:'New Arrivals', rm: () => setShowNewOnly(false) }] : []),
    ...(showBestseller ? [{ key:'best', label:'Bestsellers', rm: () => setShowBestseller(false) }] : []),
    ...(minRating ? [{ key:'rating', label:`${minRating}★ & above`, rm: () => setMinRating('') }] : []),
  ];

  /* ── Sidebar content (shared: desktop + mobile drawer) ── */
  const SidebarContent = (
    <div className="flex flex-col">
      <Section title="Category" defaultOpen={!urlCategory}>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map(c => (
            <RadioItem 
              key={c.value} 
              label={c.label} 
              value={c.value}
              current={urlCategory || categoryFilter}
              onChange={(val) => {
                setCategoryFilter(val);
                setUrlParam('category', val);
              }}
            />
          ))}
          {!urlCategory && categoryFilter !== 'all' && (
             <button 
                onClick={() => setCategoryFilter('all')}
                className="text-left text-sm text-rose-500 font-medium hover:text-rose-700 mt-1"
             >
               Clear Category
             </button>
          )}
        </div>
      </Section>

      <Section title="Occasion">
        {OCCASIONS.map(o => (
          <Checkbox key={o.value} label={o.label}
            checked={selectedOccasions.includes(o.value) || urlOccasion === o.value}
            onChange={() => {
              if (urlOccasion === o.value) setUrlParam('occasion', null);
              toggleArr(setSelectedOccasions, o.value);
            }} />
        ))}
      </Section>

      <Section title="Recipient">
        {RECIPIENTS.map(r => (
          <RadioItem key={r.value} label={r.label} value={r.value}
            current={recipient} onChange={setRecipient} />
        ))}
      </Section>

      <Section title="Price Range">
        <DualRangeSlider min={0} max={MAX_PRICE} value={priceRange} onChange={setPriceRange} />
      </Section>

      <Section title="Special">
        <Checkbox label="On Sale"        checked={showSaleOnly}         onChange={()=>setShowSaleOnly(v=>!v)} />
        <Checkbox label="Free Delivery"  checked={showFreeDelivery} onChange={()=>setShowFreeDelivery(v=>!v)} />
        <Checkbox label="Personalised"   checked={showPersonalised} onChange={()=>setShowPersonalised(v=>!v)} />
        <Checkbox label="In Stock Only"  checked={showInStockOnly}      onChange={()=>setShowInStockOnly(v=>!v)} />
        <Checkbox label="New Arrivals"   checked={showNewOnly}          onChange={()=>setShowNewOnly(v=>!v)} />
        <Checkbox label="Bestsellers"    checked={showBestseller}   onChange={()=>setShowBestseller(v=>!v)} />
      </Section>

      <Section title="Minimum Rating" defaultOpen={false}>
        <RadioItem label="Any rating" value="" current={minRating} onChange={setMinRating} />
        {RATING_OPTIONS.map(r => (
          <RadioItem key={r.value} label={r.label} value={r.value} current={minRating} onChange={setMinRating} />
        ))}
      </Section>

      {chips.length > 0 && (
        <button onClick={clearAll}
          className="mt-4 w-full py-2.5 text-sm text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-50 transition-colors font-semibold">
          Clear All Filters
        </button>
      )}
    </div>
  );

  /* ──────────────────────────────────────────────────────
     RENDER
  ────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-slate-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Toolbar: results count LEFT | sort + view toggle RIGHT ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-500">
              Showing{' '}
              <span className="font-semibold text-slate-800">{Math.min(visibleCount, filtered.length)}</span>
              {' '}of{' '}
              <span className="font-semibold text-slate-800">{filtered.length}</span>
              {' '}gifts
              {chips.length > 0 && (
                <button onClick={clearAll} className="ml-2 text-rose-500 hover:underline text-xs">
                  (clear filters)
                </button>
              )}
            </p>
            {/* Mobile filter button — hidden on desktop */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 font-medium text-sm hover:bg-slate-50"
            >
              <SlidersHorizontal size={15} />
              Filters
              {chips.length > 0 && (
                <span className="bg-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {chips.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={urlCategory || categoryFilter}
                onChange={e => {
                  setCategoryFilter(e.target.value);
                  setUrlParam('category', e.target.value === 'all' ? null : e.target.value);
                }}
                className="appearance-none pl-4 pr-9 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium text-sm min-w-[175px] cursor-pointer"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium text-sm min-w-[175px] cursor-pointer"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <div className="hidden sm:flex border border-slate-200 rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                title="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                title="List view"
              >
                <LayoutList size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Active filter chips (full width) ── */}
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {chips.map(c => <FilterChip key={c.key} label={c.label} onRemove={c.rm} />)}
          </div>
        )}

        {/* ── Main content: sidebar LEFT + product grid RIGHT ── */}
        <div className="flex gap-8 items-start">

          {/* Desktop sidebar — sticky, hidden on mobile */}
          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 self-start">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1 pb-3 border-b border-slate-100">
                <SlidersHorizontal size={16} className="text-rose-500" />
                Filters
              </div>
              {SidebarContent}
            </div>
          </aside>

          {/* Mobile sidebar drawer */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
              <div className="absolute left-0 top-0 h-full w-80 bg-white overflow-y-auto shadow-2xl flex flex-col">
                <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
                  <span className="font-bold text-slate-900 text-lg">Filters</span>
                  <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <div className="flex-grow overflow-y-auto px-5 pb-6">{SidebarContent}</div>
                <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-rose-600 transition-colors"
                  >
                    Show {filtered.length} {filtered.length === 1 ? 'gift' : 'gifts'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product area — flex-1 fills all remaining space */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-6xl mb-4">😢</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No gifts found</h3>
                <p className="text-slate-500 mb-6 max-w-sm">
                  We couldn't find any gifts matching your filters. Try broadening your search or clearing some filters.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button onClick={clearAll} className="bg-rose-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-rose-700 transition-colors">
                    Clear All Filters
                  </button>
                  <Link to="/gift-finder" className="border border-slate-200 text-slate-700 px-6 py-2.5 rounded-full font-semibold hover:bg-slate-50 transition-colors">
                    Take Gift Quiz
                  </Link>
                </div>
                <div className="mt-10">
                  <p className="text-sm text-slate-400 mb-3 font-medium">Popular occasions:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {OCCASIONS.slice(0, 5).map(o => (
                      <button key={o.value} onClick={() => { clearAll(); setSelectedOccasions([o.value]); }}
                        className="text-sm bg-slate-100 text-slate-700 px-4 py-1.5 rounded-full hover:bg-rose-100 hover:text-rose-700 transition-colors">
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <div key={`skeleton-${i}`} className="w-full"><SkeletonCard /></div>
                      ))
                    : visible.map(product => (
                        <ProductCard key={product.id} product={product} viewMode="grid" />
                      ))
                  }
                </div>
                {hasMore && !isLoading && (
                  <div className="text-center mt-10">
                    <button
                      onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                      className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-800 font-semibold px-8 py-3 rounded-full shadow-sm hover:shadow-md hover:border-slate-300 transition-all active:scale-95"
                    >
                      Load More Gifts
                      <span className="text-slate-400 text-sm font-normal">({filtered.length - visibleCount} remaining)</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex flex-col gap-4">
                  {visible.map(product => (
                    <ProductCard key={product.id} product={product} viewMode="list" />
                  ))}
                </div>
                {hasMore && (
                  <div className="text-center mt-10">
                    <button
                      onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                      className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-800 font-semibold px-8 py-3 rounded-full shadow-sm hover:shadow-md hover:border-slate-300 transition-all active:scale-95"
                    >
                      Load More Gifts
                      <span className="text-slate-400 text-sm font-normal">({filtered.length - visibleCount} remaining)</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
