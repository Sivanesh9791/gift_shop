export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-pulse flex flex-col h-[400px]">
      
      {/* Image Skeleton */}
      <div className="w-full aspect-[4/3] bg-slate-200"></div>

      {/* Body Skeleton */}
      <div className="p-5 flex-grow flex flex-col">
        {/* Category Tag */}
        <div className="w-20 h-3 bg-slate-200 rounded mb-3"></div>
        
        {/* Title */}
        <div className="w-full h-5 bg-slate-200 rounded mb-2"></div>
        <div className="w-3/4 h-5 bg-slate-200 rounded mb-4"></div>

        {/* Rating */}
        <div className="w-32 h-4 bg-slate-200 rounded mb-4"></div>

        {/* Price */}
        <div className="w-24 h-6 bg-slate-200 rounded mb-6"></div>

        <div className="mt-auto">
          {/* Button */}
          <div className="w-full h-10 bg-slate-200 rounded-xl"></div>
        </div>
      </div>

    </div>
  );
}
