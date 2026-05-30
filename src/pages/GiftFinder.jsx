import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, RotateCcw, Share2, Check, Gift } from 'lucide-react';
import { products as productsData } from '../data/products';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

/* ──────────────────────────────────────────────────────────
   QUIZ CONFIG
────────────────────────────────────────────────────────── */
const OCCASIONS = [
  { value: 'birthday',    emoji: '🎂', label: 'Birthday' },
  { value: 'anniversary', emoji: '💕', label: 'Anniversary' },
  { value: 'valentine',   emoji: '💝', label: "Valentine's Day" },
  { value: 'wedding',     emoji: '💍', label: 'Wedding' },
  { value: 'graduation',  emoji: '🎓', label: 'Graduation' },
  { value: 'housewarming',emoji: '🏠', label: 'Housewarming' },
  { value: 'babyShower',  emoji: '👶', label: 'New Born / Baby Shower' },
  { value: 'corporate',   emoji: '💼', label: 'Corporate Event' },
  { value: 'return',      emoji: '🙏', label: 'Thank You' },
  { value: '',            emoji: '🌟', label: 'Just Because' },
];

const GUESTS = [
  { value: 'her',       emoji: '👩', label: 'For Her' },
  { value: 'him',       emoji: '👨', label: 'For Him' },
  { value: 'couple',    emoji: '👫', label: 'For a Couple' },
  { value: 'baby',      emoji: '👶', label: 'For Baby' },
  { value: 'colleague', emoji: '💼', label: 'For a Colleague' },
  { value: 'family',    emoji: '👨‍👩‍👧', label: 'For the Family' },
];

const BUDGETS = [
  { value: 'under-500', emoji: '🪙', label: 'Under ₹500',       min: 0,    max: 499 },
  { value: '500-1000',  emoji: '💵', label: '₹500 – ₹1000',   min: 500,  max: 1000 },
  { value: '1000-2000', emoji: '💳', label: '₹1000 – ₹2000', min: 1000, max: 2000 },
  { value: '2000-3000', emoji: '💰', label: '₹2000 – ₹3000', min: 2000, max: 3000 },
  { value: '3000+',     emoji: '💎', label: '₹3000+',           min: 3000, max: 99999 },
];

const TOTAL_STEPS = 3;

/* ──────────────────────────────────────────────────────────
   SMALL COMPONENTS
────────────────────────────────────────────────────────── */

/* Animated progress bar */
function ProgressBar({ step }) {
  const pct = ((step) / TOTAL_STEPS) * 100;
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex justify-between text-xs text-white/70 mb-2 font-medium">
        <span>Step {step} of {TOTAL_STEPS}</span>
        <span>{Math.round(pct)}% complete</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-red-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {/* Step dots */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div key={i}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
              ${i + 1 < step ? 'bg-red-600 text-white scale-100'
                : i + 1 === step ? 'bg-red-600 text-white ring-4 ring-red-600/30 scale-110 shadow-xl'
                : 'bg-gray-200 text-gray-400'}`}>
            {i + 1 < step ? <Check size={12} /> : i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

/* Selectable card */
function QuizCard({ emoji, label, selected, onClick, multi }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2
        transition-all duration-200 cursor-pointer select-none group
        ${selected
          ? 'border-red-600 bg-red-50 text-red-700 shadow-[0_0_20px_rgba(220,38,38,0.2)] scale-105'
          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:scale-102'
        }`}
    >
      {selected && multi && (
        <span className="absolute top-2 right-2 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg border border-red-200">
          <Check size={11} strokeWidth={3} />
        </span>
      )}
      <span className="text-3xl leading-none">{emoji}</span>
      <span className="text-sm font-semibold text-center leading-tight">{label}</span>
    </button>
  );
}

/* ──────────────────────────────────────────────────────────
   RESULTS
────────────────────────────────────────────────────────── */
function Results({ occasion, guests, budget, onRetake }) {
  const budgetObj = BUDGETS.find(b => b.value === budget) || BUDGETS[3];
  const occasionLabel = OCCASIONS.find(o => o.value === occasion)?.label || 'Your Event';
  const occasionEmoji = OCCASIONS.find(o => o.value === occasion)?.emoji || '🎁';

  /* Filter products */
  let matched = productsData.filter(p => {
    const priceOk = p.price >= budgetObj.min && p.price <= budgetObj.max;
    const occasionOk = !occasion || p.occasions?.includes(occasion) || p.tags?.includes(occasion);
    return priceOk && occasionOk;
  });

  /* Pad to 6 if needed */
  if (matched.length < 6) {
    const extras = productsData
      .filter(p => p.price >= budgetObj.min && p.price <= budgetObj.max && !matched.includes(p))
      .slice(0, 6 - matched.length);
    matched = [...matched, ...extras];
  }

  const guests_label = guests.length > 0
    ? guests.map(g => GUESTS.find(x => x.value === g)?.label).filter(Boolean).join(', ')
    : 'any number of guests';

  function handleShare() {
    const params = new URLSearchParams();
    if (occasion) params.set('occasion', occasion);
    if (guests.length) params.set('guests', guests.join(','));
    if (budget) params.set('budget', budget);
    const url = `${window.location.origin}/gift-finder?${params}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard! 🔗');
    }).catch(() => {
      toast.error('Could not copy link');
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">{occasionEmoji}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            We found <span className="text-red-700">{matched.length} perfect gifts</span> for {occasionLabel.replace('For ', '')} 🎁
          </h1>
          <p className="text-slate-500 text-lg">
            Great for: <span className="font-medium text-slate-700">{guests_label}</span>
            {' · '}
            <span className="font-medium text-slate-700">{budgetObj.label}</span>
          </p>

          {/* Actions */}
          <div className="flex justify-center gap-3 mt-6 flex-wrap">
            <button onClick={onRetake}
              className="flex items-center gap-2 border-2 border-slate-300 text-slate-700 px-5 py-2.5 rounded-full font-semibold hover:bg-white transition-all hover:shadow-md">
              <RotateCcw size={15} /> Refine Results
            </button>
            <button onClick={handleShare}
              className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-full font-bold transition-all hover:bg-red-700 hover:shadow-lg">
              <Share2 size={15} /> Share These Results
            </button>
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {matched.map(p => (
            <ProductCard key={p.id} product={p} viewMode="grid" />
          ))}
        </div>

        {/* Browse all */}
        <div className="text-center mt-12">
          <p className="text-slate-500 mb-4">Not finding quite the right gift?</p>
          <Link to="/shop"
            className="inline-flex items-center gap-2 border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-full font-semibold hover:bg-white hover:shadow-md transition-all">
            Browse All Gifts
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   STEP VIEWS
────────────────────────────────────────────────────────── */
function StepCard({ children, entering }) {
  return (
    <div className={`transition-all duration-300 ${entering ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   MAIN PAGE
────────────────────────────────────────────────────────── */
export default function GiftFinder() {
  const [searchParams] = useSearchParams();

  /* Read URL params if shared link */
  const [step, setStep]           = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [entering, setEntering]   = useState(true);

  const [occasion, setOccasion] = useState(searchParams.get('occasion') || '');
  const [guests, setGuests] = useState(
    searchParams.get('guests') ? searchParams.get('guests').split(',') : []
  );
  const [budget, setBudget]       = useState(searchParams.get('budget') || '');

  /* If URL has all params, show results directly */
  useEffect(() => {
    document.title = "Gift Finder | TRESOR GIFTS";
    if (searchParams.get('occasion') && searchParams.get('budget')) {
      setShowResults(true);
    }
  }, []);

  /* Transition helper */
  function transition(fn) {
    setEntering(false);
    setTimeout(() => { fn(); setEntering(true); }, 250);
  }

  function handleOccasionSelect(val) {
    setOccasion(val);
    transition(() => setStep(2));
  }

  function toggleGuest(val) {
    setGuests(prev =>
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    );
  }

  function handleBudgetSelect(val) {
    setBudget(val);
  }

  function handleNext() {
    if (step === 2) { transition(() => setStep(3)); return; }
    if (step === 3 && budget) { transition(() => setShowResults(true)); return; }
  }

  function handleBack() {
    transition(() => {
      if (step === 1) return;
      setStep(s => s - 1);
    });
  }

  function handleRetake() {
    setShowResults(false);
    setStep(1);
    setOccasion('');
    setGuests([]);
    setBudget('');
  }

  /* ── Show results ── */
  if (showResults) {
    return <Results occasion={occasion} guests={guests} budget={budget} onRetake={handleRetake} />;
  }

  /* ── Quiz header labels ── */
  const stepMeta = [
    { question: "What's the occasion?",      sub: 'Tell us the event you are gifting for.' },
    { question: 'Who are you gifting?',       sub: 'Select the recipient to get personalised recommendations.' },
    { question: "What's your budget?",        sub: "We'll find the best gifts in your price range." },
  ];

  const currentMeta = stepMeta[step - 1];

  /* ──────────────────────────────────────────────────────
     RENDER QUIZ SHELL
  ────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50 selection:bg-red-200 selection:text-red-900">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Logo / back to home */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> Home
          </Link>
          <div className="flex items-center gap-2 text-gray-900 font-bold">
            <Gift size={18} className="text-red-600" /> Gift Finder Quiz
          </div>
          <div className="w-16" />{/* spacer */}
        </div>

        {/* Progress */}
        <ProgressBar step={step} />

        {/* Question card */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100">
          {/* Question heading */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-1">
            {currentMeta.question}
          </h2>
          <p className="text-gray-500 text-center text-sm mb-8">{currentMeta.sub}</p>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <StepCard entering={entering}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {OCCASIONS.map(o => (
                  <QuizCard
                    key={o.value}
                    emoji={o.emoji}
                    label={o.label}
                    selected={occasion === o.value}
                    onClick={() => handleOccasionSelect(o.value)}
                  />
                ))}
              </div>
            </StepCard>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <StepCard entering={entering}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {GUESTS.map(g => (
                  <QuizCard
                    key={g.value}
                    emoji={g.emoji}
                    label={g.label}
                    selected={guests.includes(g.value)}
                    onClick={() => toggleGuest(g.value)}
                    multi
                  />
                ))}
              </div>
              {/* Next */}
              <div className="flex justify-between mt-8 gap-3">
                <button onClick={handleBack}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-semibold">
                  <ArrowLeft size={16} /> Back
                </button>
                <button onClick={handleNext}
                  className="flex items-center gap-2 text-white bg-red-600 hover:bg-red-700 px-8 py-3 rounded-full font-bold transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95">
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </StepCard>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <StepCard entering={entering}>
              <div className="grid grid-cols-2 gap-4">
                {BUDGETS.map(b => (
                  <QuizCard
                    key={b.value}
                    emoji={b.emoji}
                    label={b.label}
                    selected={budget === b.value}
                    onClick={() => handleBudgetSelect(b.value)}
                  />
                ))}
              </div>
              {/* Find */}
              <div className="flex justify-between mt-8 gap-3">
                <button onClick={handleBack}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-semibold">
                  <ArrowLeft size={16} /> Back
                </button>
                <button onClick={handleNext} disabled={!budget}
                  className="flex items-center gap-2 text-white bg-red-600 hover:bg-red-700 px-8 py-3 rounded-full font-black tracking-wide
                    transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95
                    disabled:opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none">
                  Find My Gifts <ArrowRight size={16} />
                </button>
              </div>
            </StepCard>
          )}
        </div>

        {/* Fun footer */}
        <p className="text-center text-gray-400 text-xs mt-6">
          🎁 Trusted by thousands of happy customers
        </p>
      </div>
    </div>
  );
}
