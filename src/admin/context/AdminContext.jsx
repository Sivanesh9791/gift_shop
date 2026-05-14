import { createContext, useContext, useState, useEffect } from 'react';
import productsData from '../../data/products';

const AdminContext = createContext();

// Mock data functions
const generateMockOrders = () => {
  const statuses = ['pending', 'packed', 'shipped', 'delivered', 'cancelled'];
  const gifts = ['Premium Watch', 'Scented Candle Set', 'Luxury Skincare', 'Coffee Gift Box', 'Hardcover Book Bundle', 'Silk Scarf', 'Perfume Set', 'Wine Bottle', 'Chocolate Gift Box', 'Plant in Pot'];
  
  const orders = [];
  for (let i = 0; i < 10; i++) {
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
    
    const estimatedDate = new Date(createdDate);
    estimatedDate.setDate(estimatedDate.getDate() + Math.floor(Math.random() * 7) + 2);
    
    const qty = Math.floor(Math.random() * 3) + 1;
    const price = Math.floor(Math.random() * 100) + 20;
    const subtotal = qty * price;
    const giftWrapTotal = Math.random() > 0.5 ? 3.99 : 0;
    const discount = Math.floor(Math.random() * 20);
    const total = subtotal + giftWrapTotal + 4.99 - discount;
    
    orders.push({
      id: `GH-${Math.floor(Math.random() * 90000000) + 10000000}`,
      customerName: `Customer ${i + 1}`,
      customerEmail: `customer${i + 1}@example.com`,
      customerPhone: `555-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`,
      items: [{
        productName: gifts[i],
        qty,
        price,
        giftWrap: giftWrapTotal > 0,
        giftMessage: Math.random() > 0.5 ? 'Happy Day!' : null
      }],
      subtotal,
      giftWrapTotal,
      discount,
      deliveryCharge: 4.99,
      total,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      paymentMethod: 'card',
      deliveryAddress: {
        line1: `${Math.floor(Math.random() * 999) + 1} Main Street`,
        city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][i % 5],
        postcode: `${Math.floor(Math.random() * 90000) + 10000}`,
        country: 'USA'
      },
      isGift: Math.random() > 0.3,
      recipientName: Math.random() > 0.3 ? `Recipient ${i + 1}` : null,
      createdAt: createdDate.toISOString(),
      estimatedDelivery: estimatedDate.toISOString()
    });
  }
  return orders;
};

const generateMockCoupons = () => [
  {
    id: 'coupon-1',
    code: 'GIFTWRAP',
    type: 'fixed',
    value: 3.99,
    minOrder: 0,
    usageLimit: 100,
    usedCount: 34,
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true
  },
  {
    id: 'coupon-2',
    code: 'SAVE10',
    type: 'percent',
    value: 10,
    minOrder: 30,
    usageLimit: 200,
    usedCount: 87,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true
  },
  {
    id: 'coupon-3',
    code: 'WELCOME15',
    type: 'percent',
    value: 15,
    minOrder: 50,
    usageLimit: 150,
    usedCount: 45,
    expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true
  },
  {
    id: 'coupon-4',
    code: 'SUMMER20',
    type: 'percent',
    value: 20,
    minOrder: 75,
    usageLimit: 100,
    usedCount: 12,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true
  }
];

const defaultStoreSettings = {
  storeName: 'GiftHaven',
  storeEmail: 'hello@gifthaven.com',
  currency: 'USD',
  freeShippingThreshold: 40,
  standardDeliveryCharge: 4.99,
  expressDeliveryCharge: 9.99,
  sameDayCharge: 19.99,
  giftWrapCharge: 3.99,
  lowStockThreshold: 5
};

export const AdminProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPin, setAdminPin] = useState('1234');
  const [pinAttempts, setPinAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [storeSettings, setStoreSettings] = useState(defaultStoreSettings);
  const [products, setProducts] = useState([]);

  // Initialize from storage on mount
  useEffect(() => {
    // Check admin authentication
    const isAuth = sessionStorage.getItem('admin_auth') === 'true';
    setIsAdminAuthenticated(isAuth);

    // Load admin PIN
    const pin = localStorage.getItem('admin_pin') || '1234';
    setAdminPin(pin);

    // Load dark mode preference
    const isDark = localStorage.getItem('admin_dark') === 'true';
    setDarkMode(isDark);

    // Load orders
    const savedOrders = localStorage.getItem('gifthaven_orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch {
        setOrders(generateMockOrders());
      }
    } else {
      const mockOrders = generateMockOrders();
      setOrders(mockOrders);
      localStorage.setItem('gifthaven_orders', JSON.stringify(mockOrders));
    }

    // Load coupons
    const savedCoupons = localStorage.getItem('gifthaven_coupons');
    if (savedCoupons) {
      try {
        setCoupons(JSON.parse(savedCoupons));
      } catch {
        const mockCoupons = generateMockCoupons();
        setCoupons(mockCoupons);
      }
    } else {
      const mockCoupons = generateMockCoupons();
      setCoupons(mockCoupons);
      localStorage.setItem('gifthaven_coupons', JSON.stringify(mockCoupons));
    }

    // Load store settings
    const savedSettings = localStorage.getItem('gifthaven_settings');
    if (savedSettings) {
      try {
        setStoreSettings(JSON.parse(savedSettings));
      } catch {
        setStoreSettings(defaultStoreSettings);
      }
    } else {
      localStorage.setItem('gifthaven_settings', JSON.stringify(defaultStoreSettings));
    }

    // Load products
    const savedProducts = localStorage.getItem('gifthaven_products');
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        if (parsed && parsed.length > 0) {
          setProducts(parsed);
        } else {
          setProducts(productsData);
          localStorage.setItem('gifthaven_products', JSON.stringify(productsData));
        }
      } catch {
        setProducts(productsData);
        localStorage.setItem('gifthaven_products', JSON.stringify(productsData));
      }
    } else {
      setProducts(productsData);
      localStorage.setItem('gifthaven_products', JSON.stringify(productsData));
    }
  }, []);

  // PIN verification
  const verifyPin = (enteredPin) => {
    if (lockoutUntil && Date.now() < lockoutUntil) {
      return 'locked';
    }

    if (enteredPin === adminPin) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setPinAttempts(0);
      setLockoutUntil(null);
      return 'success';
    }

    const newAttempts = pinAttempts + 1;
    if (newAttempts >= 3) {
      const lockout = Date.now() + 30000; // 30 seconds
      setLockoutUntil(lockout);
      setPinAttempts(0);
      return 'locked';
    }

    setPinAttempts(newAttempts);
    return `wrong-${3 - newAttempts}`;
  };

  // Logout
  const logout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  // PIN management
  const changePin = (newPin) => {
    localStorage.setItem('admin_pin', newPin);
    setAdminPin(newPin);
  };

  // Dark mode toggle
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    localStorage.setItem('admin_dark', String(newMode));
    setDarkMode(newMode);
  };

  // Order management
  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: `GH-${Math.floor(Math.random() * 90000000) + 10000000}`
    };
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem('gifthaven_orders', JSON.stringify(updatedOrders));
    return newOrder;
  };

  const deleteOrder = (orderId) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('gifthaven_orders', JSON.stringify(updatedOrders));
  };

  const updateOrderStatus = (orderId, status) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('gifthaven_orders', JSON.stringify(updatedOrders));
  };

  // Coupon management
  const addCoupon = (coupon) => {
    const newCoupon = {
      ...coupon,
      id: `coupon-${Date.now()}`
    };
    const updatedCoupons = [...coupons, newCoupon];
    setCoupons(updatedCoupons);
    localStorage.setItem('gifthaven_coupons', JSON.stringify(updatedCoupons));
    return newCoupon;
  };

  const updateCoupon = (couponId, updates) => {
    const updatedCoupons = coupons.map(coupon =>
      coupon.id === couponId ? { ...coupon, ...updates } : coupon
    );
    setCoupons(updatedCoupons);
    localStorage.setItem('gifthaven_coupons', JSON.stringify(updatedCoupons));
  };

  const deleteCoupon = (couponId) => {
    const updatedCoupons = coupons.filter(coupon => coupon.id !== couponId);
    setCoupons(updatedCoupons);
    localStorage.setItem('gifthaven_coupons', JSON.stringify(updatedCoupons));
  };

  // Settings management
  const updateSettings = (newSettings) => {
    const updatedSettings = { ...storeSettings, ...newSettings };
    setStoreSettings(updatedSettings);
    localStorage.setItem('gifthaven_settings', JSON.stringify(updatedSettings));
  };

  // Products management
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString()
    };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem('gifthaven_products', JSON.stringify(updatedProducts));
    return newProduct;
  };

  const updateProduct = (productId, updates) => {
    const updatedProducts = products.map(product =>
      product.id === productId ? { ...product, ...updates } : product
    );
    setProducts(updatedProducts);
    localStorage.setItem('gifthaven_products', JSON.stringify(updatedProducts));
  };

  const deleteProduct = (productId) => {
    const updatedProducts = products.filter(product => product.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem('gifthaven_products', JSON.stringify(updatedProducts));
  };

  const bulkDeleteProducts = (productIds) => {
    const updatedProducts = products.filter(product => !productIds.includes(product.id));
    setProducts(updatedProducts);
    localStorage.setItem('gifthaven_products', JSON.stringify(updatedProducts));
  };

  const clearOrders = () => {
    setOrders([]);
    localStorage.setItem('gifthaven_orders', JSON.stringify([]));
  };

  const resetProducts = () => {
    setProducts(productsData);
    localStorage.setItem('gifthaven_products', JSON.stringify(productsData));
  };

  const value = {
    isAdminAuthenticated,
    adminPin,
    pinAttempts,
    lockoutUntil,
    darkMode,
    orders,
    coupons,
    storeSettings,
    products,
    verifyPin,
    logout,
    changePin,
    toggleDarkMode,
    addOrder,
    deleteOrder,
    updateOrderStatus,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    updateSettings,
    clearOrders,
    resetProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};
