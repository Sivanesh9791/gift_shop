import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, RotateCcw, Share2, Check, Gift } from 'lucide-react';
import productsData from '../data/products';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

/* ──────────────────────────────────────────────────────────
   QUIZ CONFIG
────────────────────────────────────────────────────────── */
const RECIPIENTS = [
  { value: 'her',       emoji: '👩', label: 'For Her' },
  { value: 'him',       emoji: '👨', label: 'For Him' },
  { value: 'newborn',   emoji: '👶', label: 'For Baby' },
  { value: 'couple',    emoji: '👫', label: 'For a Couple' },
  { value: 'friend',    emoji: '🧑‍🤝‍🧑', label: 'For a Friend' },
  { value: 'colleague', emoji: '💼', label: 'For a Colleague' },
];

const OCCASIONS = [
  { value: 'birthday',     emoji: '🎂', label: 'Birthday' },
  { value: 'anniversary',  emoji: '💕', label: 'Anniversary' },
  { value: 'wedding',      emoji: '💍', label: 'Wedding' },
  { value: 'housewarming', emoji: '🏠', label: 'Housewarming' },
  { value: 'christmas',    emoji: '🎄', label: 'Christmas' },
  { value: 'graduation',   emoji: '🎓', label: 'Graduation' },
  { value: 'valentine',    emoji: '💝', label: "Valentine's" },
  { value: 'thankyou',     emoji: '🙏', label: 'Thank You' },
  { value: 'justbecause',  emoji: '🌟', label: 'Just Because' },
];

const BUDGETS = [
  { value: '0-25',   emoji: '💚', label: 'Under $25',  min: 0,   max: 25  },
  { value: '25-50',  emoji: '💛', label: '$25 – $50',  min: 25,  max: 50  },
  { value: '50-100', emoji: '🧡', label: '$50 – $100', min: 50,  max: 100 },
  { value: '100+',   emoji: '❤️', label: '$100+',      min: 100, max: 99999 },
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
      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {/* Step dots */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div key={i}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
              ${i + 1 < step ? 'bg-white text-rose-500 scale-100'
                : i + 1 === step ? 'bg-white/90 text-rose-500 ring-2 ring-white/50 scale-110'
                : 'bg-white/20 text-white/50'}`}>
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
          ? 'border-white bg-white text-rose-600 shadow-lg scale-105'
          : 'border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/60 hover:scale-102'
        }`}
    >
      {selected && multi && (
        <span className="absolute top-2 right-2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center">
          <Check size={11} />
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
function Results({ recipient, occasions, budget, onRetake }) {
  const budgetObj = BUDGETS.find(b => b.value === budget) || BUDGETS[3];
  const recipientLabel = RECIPIENTS.find(r => r.value === recipient)?.label || 'Someone Special';
  const recipientEmoji = RECIPIENTS.find(r => r.value === recipient)?.emoji || '🎁';

  /* Filter products */
  let matched = productsData.filter(p => {
    const priceOk = p.price >= budgetObj.min && p.price <= budgetObj.max;
    const recipientOk = !recipient || p.recipient === recipient;
    const occasionOk = occasions.length === 0 || occasions.some(o =>
      p.occasions?.includes(o) || p.tags?.includes(o)
    );
    return priceOk && (recipientOk || occasionOk);
  });

  /* Pad to 6 if needed */
  if (matched.length < 6) {
    const extras = productsData
      .filter(p => p.price >= budgetObj.min && p.price <= budgetObj.max && !matched.includes(p))
      .slice(0, 6 - matched.length);
    matched = [...matched, ...extras];
  }

  const occasions_label = occasions.length > 0
    ? occasions.map(o => OCCASIONS.find(x => x.value === o)?.label).filter(Boolean).join(', ')
    : 'any occasion';

  function handleShare() {
    const params = new URLSearchParams();
    if (recipient) params.set('recipient', recipient);
    if (occasions.length) params.set('occasions', occasions.join(','));
    if (budget) params.set('budget', budget);
    const url = `${window.location.origin}/gift-finder?${params}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard! 🔗');
    }).catch(() => {
      toast.error('Could not copy link');
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">{recipientEmoji}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            We found <span className="text-rose-600">{matched.length} perfect gifts</span> for {recipientLabel.replace('For ', '')} 🎁
          </h1>
          <p className="text-slate-500 text-lg">
            Great for: <span className="font-medium text-slate-700">{occasions_label}</span>
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
              className="flex items-center gap-2 bg-rose-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-rose-700 transition-all hover:shadow-md">
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

  const [recipient, setRecipient] = useState(searchParams.get('recipient') || '');
  const [occasions, setOccasions] = useState(
    searchParams.get('occasions') ? searchParams.get('occasions').split(',') : []
  );
  const [budget, setBudget]       = useState(searchParams.get('budget') || '');

  /* If URL has all params, show results directly */
  useEffect(() => {
    if (searchParams.get('recipient') && searchParams.get('budget')) {
      setShowResults(true);
    }
  }, []);

  /* Transition helper */
  function transition(fn) {
    setEntering(false);
    setTimeout(() => { fn(); setEntering(true); }, 250);
  }

  function handleRecipientSelect(val) {
    setRecipient(val);
    transition(() => setStep(2));
  }

  function toggleOccasion(val) {
    setOccasions(prev =>
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
    setRecipient('');
    setOccasions([]);
    setBudget('');
  }

  /* ── Show results ── */
  if (showResults) {
    return <Results recipient={recipient} occasions={occasions} budget={budget} onRetake={handleRetake} />;
  }

  /* ── Quiz header labels ── */
  const stepMeta = [
    { question: 'Who are you shopping for?',   sub: 'Pick one — we\'ll tailor the results just for them.' },
    { question: 'What\'s the occasion?',        sub: 'Choose as many as you like!' },
    { question: 'What\'s your budget?',         sub: 'We\'ll find the best gifts in your price range.' },
  ];

  const currentMeta = stepMeta[step - 1];

  /* ──────────────────────────────────────────────────────
     RENDER QUIZ SHELL
  ────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Logo / back to home */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> Home
          </Link>
          <div className="flex items-center gap-2 text-white font-bold">
            <Gift size={18} /> Gift Finder Quiz
          </div>
          <div className="w-16" />{/* spacer */}
        </div>

        {/* Progress */}
        <ProgressBar step={step} />

        {/* Question card */}
        <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-6 md:p-10 shadow-2xl">
          {/* Question heading */}
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-1">
            {currentMeta.question}
          </h2>
          <p className="text-white/70 text-center text-sm mb-8">{currentMeta.sub}</p>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <StepCard entering={entering}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {RECIPIENTS.map(r => (
                  <QuizCard
                    key={r.value}
                    emoji={r.emoji}
                    label={r.label}
                    selected={recipient === r.value}
                    onClick={() => handleRecipientSelect(r.value)}
                  />
                ))}
              </div>
            </StepCard>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <StepCard entering={entering}>
              <div className="grid grid-cols-3 gap-3">
                {OCCASIONS.map(o => (
                  <QuizCard
                    key={o.value}
                    emoji={o.emoji}
                    label={o.label}
                    selected={occasions.includes(o.value)}
                    onClick={() => toggleOccasion(o.value)}
                    multi
                  />
                ))}
              </div>
              {/* Next */}
              <div className="flex justify-between mt-8 gap-3">
                <button onClick={handleBack}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors font-semibold">
                  <ArrowLeft size={16} /> Back
                </button>
                <button onClick={handleNext}
                  className="flex items-center gap-2 bg-white text-rose-600 px-6 py-3 rounded-full font-bold hover:bg-rose-50 transition-all shadow-lg hover:shadow-xl active:scale-95">
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
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors font-semibold">
                  <ArrowLeft size={16} /> Back
                </button>
                <button onClick={handleNext} disabled={!budget}
                  className="flex items-center gap-2 bg-white text-rose-600 px-7 py-3 rounded-full font-bold
                    hover:bg-rose-50 transition-all shadow-lg hover:shadow-xl active:scale-95
                    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:active:scale-100">
                  Find My Gifts <ArrowRight size={16} />
                </button>
              </div>
            </StepCard>
          )}
        </div>

        {/* Fun footer */}
        <p className="text-center text-white/50 text-xs mt-6">
          🎁 Trusted by 50,000+ gift givers worldwide
        </p>
      </div>
    </div>
  );
}
