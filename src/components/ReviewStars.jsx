export default function ReviewStars({ rating = 0, count, size = 14, className = '' }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const filled = rating >= i;
    const half = !filled && rating >= i - 0.5;
    stars.push(
      <span key={i} className="relative inline-block" style={{ fontSize: size }}>
        {/* Empty star */}
        <span className="text-slate-200">★</span>
        {/* Filled overlay */}
        {(filled || half) && (
          <span
            className="absolute inset-0 overflow-hidden text-amber-400"
            style={{ width: filled ? '100%' : '50%' }}
          >
            ★
          </span>
        )}
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="flex leading-none">{stars}</span>
      <span className="text-slate-700 font-medium" style={{ fontSize: size }}>
        {rating.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className="text-slate-400" style={{ fontSize: size - 1 }}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}
