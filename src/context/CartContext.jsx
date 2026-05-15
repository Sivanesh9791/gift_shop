import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'giftiny_cart';

const initialState = {
  items: [],
  coupon: null,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        (item) =>
          item.product.id === action.payload.product.id &&
          item.selectedWrapStyle === action.payload.selectedWrapStyle &&
          item.personalisationText === action.payload.personalisationText
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product.id === action.payload.product.id &&
            item.selectedWrapStyle === action.payload.selectedWrapStyle &&
            item.personalisationText === action.payload.personalisationText
              ? { ...item, qty: item.qty + (action.payload.qty || 1) }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            product: action.payload.product,
            qty: action.payload.qty || 1,
            giftWrap: action.payload.giftWrap || false,
            giftMessage: action.payload.giftMessage || '',
            personalisationText: action.payload.personalisationText || '',
            selectedWrapStyle: action.payload.selectedWrapStyle || '',
          },
        ],
      };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.payload),
      };
    }

    case 'UPDATE_QTY': {
      if (action.payload.qty <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.product.id !== action.payload.productId
          ),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.payload.productId
            ? { ...item, qty: action.payload.qty }
            : item
        ),
      };
    }

    case 'UPDATE_GIFT_OPTIONS': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.payload.productId
            ? {
                ...item,
                giftWrap: action.payload.giftWrap !== undefined ? action.payload.giftWrap : item.giftWrap,
                giftMessage: action.payload.giftMessage !== undefined ? action.payload.giftMessage : item.giftMessage,
                personalisationText: action.payload.personalisationText !== undefined ? action.payload.personalisationText : item.personalisationText,
                selectedWrapStyle: action.payload.selectedWrapStyle !== undefined ? action.payload.selectedWrapStyle : item.selectedWrapStyle,
              }
            : item
        ),
      };
    }

    case 'CLEAR_CART': {
      return {
        ...state,
        items: [],
        coupon: null,
      };
    }

    case 'APPLY_COUPON': {
      return {
        ...state,
        coupon: action.payload,
      };
    }

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Restore cart items
        parsedCart.items.forEach((item) => {
          dispatch({
            type: 'ADD_ITEM',
            payload: item,
          });
        });
        if (parsedCart.coupon) {
          dispatch({
            type: 'APPLY_COUPON',
            payload: parsedCart.coupon,
          });
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state]);

  // Computed values
  const cartTotal = state.items.reduce(
    (total, item) => total + item.product.price * item.qty,
    0
  );

  const cartCount = state.items.reduce((count, item) => count + item.qty, 0);

  const giftWrapTotal = state.items.filter((item) => item.giftWrap).length * 3.99;

  const savings = state.items.reduce((total, item) => {
    const itemSavings = (item.product.compareAtPrice - item.product.price) * item.qty;
    return total + itemSavings;
  }, 0);

  const estimatedDelivery =
    state.items.length > 0
      ? Math.max(...state.items.map((item) => item.product.deliveryDays))
      : 0;

  // Action creators
  const addItem = useCallback(
    (product, qty = 1, giftOptions = {}) => {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          product,
          qty,
          giftWrap: giftOptions.giftWrap || false,
          giftMessage: giftOptions.giftMessage || '',
          personalisationText: giftOptions.personalisationText || '',
          selectedWrapStyle: giftOptions.selectedWrapStyle || '',
        },
      });
    },
    []
  );

  const removeItem = useCallback((productId) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: productId,
    });
  }, []);

  const updateQty = useCallback((productId, qty) => {
    dispatch({
      type: 'UPDATE_QTY',
      payload: { productId, qty },
    });
  }, []);

  const updateGiftOptions = useCallback((productId, options) => {
    dispatch({
      type: 'UPDATE_GIFT_OPTIONS',
      payload: { productId, ...options },
    });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({
      type: 'CLEAR_CART',
    });
  }, []);

  const applyCoupon = useCallback((coupon) => {
    dispatch({
      type: 'APPLY_COUPON',
      payload: coupon,
    });
  }, []);

  const value = {
    // State
    items: state.items,
    coupon: state.coupon,

    // Computed values
    cartTotal,
    cartCount,
    giftWrapTotal,
    savings,
    estimatedDelivery,

    // Actions
    addItem,
    removeItem,
    updateQty,
    updateGiftOptions,
    clearCart,
    applyCoupon,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

export default CartContext;
