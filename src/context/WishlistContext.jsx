import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WishlistContext = createContext();

const WISHLIST_STORAGE_KEY = 'giftiny_wishlist';

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [wishlistItems]);

  // Check if product is in wishlist
  const isInWishlist = useCallback(
    (productId) => {
      return wishlistItems.some((item) => item.id === productId);
    },
    [wishlistItems]
  );

  // Toggle wishlist item
  const toggleWishlist = useCallback((product) => {
    setWishlistItems((prevItems) => {
      if (prevItems.some((item) => item.id === product.id)) {
        // Remove if exists
        return prevItems.filter((item) => item.id !== product.id);
      } else {
        // Add if doesn't exist
        return [...prevItems, product];
      }
    });
  }, []);

  // Clear entire wishlist
  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  // Wishlist count
  const wishlistCount = wishlistItems.length;

  const value = {
    // State
    wishlistItems,

    // Computed values
    wishlistCount,

    // Actions
    toggleWishlist,
    isInWishlist,
    clearWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}

export default WishlistContext;
