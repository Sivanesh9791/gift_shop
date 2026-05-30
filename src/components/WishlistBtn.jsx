import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

export default function WishlistBtn({ product, className = '' }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
      }}
      className={`p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md transition-all duration-200
        hover:scale-110 active:scale-95
        ${wishlisted ? 'text-red-600' : 'text-slate-400 hover:text-red-500'}
        ${className}`}
      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        size={18}
        className="transition-all duration-200"
        fill={wishlisted ? 'currentColor' : 'none'}
        strokeWidth={wishlisted ? 0 : 2}
      />
    </button>
  );
}
