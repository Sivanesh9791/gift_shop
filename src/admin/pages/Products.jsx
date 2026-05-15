import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Star,
  AlertTriangle,
} from 'lucide-react';

const CATEGORIES = ['flowers', 'chocolates', 'candles', 'jewellery', 'hampers', 'toys', 'stationery', 'homeDecor', 'personalised', 'experiences'];
const OCCASIONS = ['birthday', 'anniversary', 'wedding', 'newborn', 'housewarming', 'valentines', 'christmas', 'thankyou', 'graduation', 'corporate'];
const RECIPIENTS = ['her', 'him', 'kids', 'couple', 'baby', 'colleague', 'parent'];

export default function Products() {
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct, bulkDeleteProducts, storeSettings } = useAdmin();

  // Local state
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'flowers',
    subCategory: '',
    price: 0,
    compareAtPrice: 0,
    shortDescription: '',
    description: '',
    deliveryDays: 3,
    weight: '',
    images: ['', '', '', ''],
    recipient: 'her',
    rating: 4.5,
    reviewCount: 0,
    stockCount: 10,
    occasions: [],
    tags: '',
    isPersonalisable: false,
    inStock: true,
    isBestseller: false,
    isNew: false,
    isSale: false,
    freeDelivery: false,
    giftWrappingAvailable: true,
    personalisationNote: '',
  });

  // Filter and sort
  const filteredProducts = useMemo(() => {
    let result = products;

    // Search
    if (search) {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }

    // Category
    if (categoryFilter !== 'all') {
      result = result.filter(p => p.category === categoryFilter);
    }

    // Status
    if (statusFilter !== 'all') {
      if (statusFilter === 'inStock') {
        result = result.filter(p => p.stockCount > 0);
      } else if (statusFilter === 'outOfStock') {
        result = result.filter(p => p.stockCount === 0);
      } else if (statusFilter === 'lowStock') {
        result = result.filter(p => p.stockCount > 0 && p.stockCount <= storeSettings.lowStockThreshold);
      } else if (statusFilter === 'onSale') {
        result = result.filter(p => p.isSale);
      } else if (statusFilter === 'new') {
        result = result.filter(p => p.isNew);
      }
    }

    // Sort
    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'stock-low') {
      result.sort((a, b) => a.stockCount - b.stockCount);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, search, categoryFilter, statusFilter, sortBy, storeSettings.lowStockThreshold]);

  // Pagination
  const itemsPerPage = 10;
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Modal handlers
  const openModal = (mode, product = null) => {
    setModalMode(mode);
    if (mode === 'edit' && product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        slug: '',
        category: 'flowers',
        subCategory: '',
        price: 0,
        compareAtPrice: 0,
        shortDescription: '',
        description: '',
        deliveryDays: 3,
        weight: '',
        images: ['', '', '', ''],
        recipient: 'her',
        rating: 4.5,
        reviewCount: 0,
        stockCount: 10,
        occasions: [],
        tags: '',
        isPersonalisable: false,
        inStock: true,
        isBestseller: false,
        isNew: false,
        isSale: false,
        freeDelivery: false,
        giftWrappingAvailable: true,
        personalisationNote: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
    }));

    // Auto-generate slug from name
    if (name === 'name') {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }
  };

  const handleOccasionToggle = (occasion) => {
    setFormData(prev => ({
      ...prev,
      occasions: prev.occasions.includes(occasion)
        ? prev.occasions.filter(o => o !== occasion)
        : [...prev.occasions, occasion]
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleToggleField = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const saveProduct = () => {
    // Validation
    if (!formData.name || !formData.category || formData.price === 0 || !formData.images[0]) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (modalMode === 'edit') {
      updateProduct(editingProduct.id, formData);
      toast.success('Product updated! ✅');
    } else {
      addProduct(formData);
      toast.success('Product added! ✅');
    }

    closeModal();
  };

  const openDeleteConfirm = (product) => {
    setDeletingProduct(product);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deletingProduct) {
      deleteProduct(deletingProduct.id);
      toast.success('Product deleted');
      setIsDeleteConfirmOpen(false);
    }
  };

  const toggleSelectProduct = (productId) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(productId)) {
      newSelectedIds.delete(productId);
    } else {
      newSelectedIds.add(productId);
    }
    setSelectedIds(newSelectedIds);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedProducts.map(p => p.id)));
    }
  };

  const deleteSelected = () => {
    bulkDeleteProducts(Array.from(selectedIds));
    setSelectedIds(new Set());
    toast.success(`${selectedIds.size} products deleted`);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-600' };
    if (stock <= storeSettings.lowStockThreshold) return { label: `Low: ${stock}`, color: 'bg-amber-100 text-amber-600' };
    return { label: `In Stock: ${stock}`, color: 'bg-green-100 text-green-600' };
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-sm text-gray-500">Manage your gift shop products</p>
        </div>
        <button
          onClick={() => openModal('add')}
          className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-xl hover:bg-rose-600 transition-colors"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl">
        <div className="relative flex-1 min-w-64">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <option value="all">All Status</option>
          <option value="inStock">In Stock</option>
          <option value="outOfStock">Out of Stock</option>
          <option value="lowStock">Low Stock</option>
          <option value="onSale">On Sale</option>
          <option value="new">New</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <option value="name">Name A-Z</option>
          <option value="price-low">Price Low-High</option>
          <option value="price-high">Price High-Low</option>
          <option value="stock-low">Stock Low-High</option>
          <option value="rating">Rating High-Low</option>
        </select>

        <div className="text-sm text-gray-500 dark:text-gray-400 px-2 py-2">
          Showing {paginatedProducts.length} of {filteredProducts.length} products
        </div>
      </div>

      {/* BULK ACTIONS BAR */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {selectedIds.size} products selected
          </span>
          <button
            onClick={deleteSelected}
            className="text-sm font-medium text-red-600 hover:text-red-700 px-3 py-1 bg-red-50 dark:bg-red-900/20 rounded-lg"
          >
            Delete Selected
          </button>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === paginatedProducts.length && paginatedProducts.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Image</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Name & Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product, idx) => {
                const stockStatus = getStockStatus(product.stockCount);
                return (
                  <tr key={product.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(product.id)}
                        onChange={() => toggleSelectProduct(product.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                        {product.name}
                      </div>
                      <span className="text-xs px-2 py-1 bg-rose-100 text-rose-600 rounded inline-block mt-1">
                        {product.category}
                      </span>
                      {product.isPersonalisable && (
                        <span className="text-xs ml-2">✏️ Personalisable</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 dark:text-white text-sm">
                        ₹{product.price.toFixed(2)}
                      </div>
                      {product.compareAtPrice > 0 && (
                        <div className="text-xs text-gray-500 line-through">
                          ${product.compareAtPrice.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-500" fill="currentColor" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{product.rating}</span>
                        <span className="text-xs text-gray-500">({product.reviewCount})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal('edit', product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-150"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(product)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-150"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`/product/${product.slug}`)}
                          className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {pageCount > 1 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Page {currentPage} of {pageCount}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(pageCount, prev + 1))}
              disabled={currentPage === pageCount}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* ADD/EDIT MODAL */}
      <Dialog open={isModalOpen} onClose={closeModal} className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={closeModal} />
        <Dialog.Panel className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-6 border-b border-gray-200 dark:border-gray-700">
            <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
              {modalMode === 'add' ? 'Add New Product' : 'Edit Product'}
            </Dialog.Title>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* COLUMN 1 */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="e.g. Premium Rose Bouquet"
                    className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleFormChange}
                    className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Sub Category</label>
                  <input
                    type="text"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleFormChange}
                    className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    step="0.01"
                    className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Compare At Price</label>
                  <input
                    type="number"
                    name="compareAtPrice"
                    value={formData.compareAtPrice}
                    onChange={handleFormChange}
                    step="0.01"
                    className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Short Description</label>
                  <input
                    type="text"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleFormChange}
                    maxLength="100"
                    placeholder="Max 100 characters"
                    className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows="3"
                    className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Delivery Days</label>
                  <input
                    type="number"
                    name="deliveryDays"
                    value={formData.deliveryDays}
                    onChange={handleFormChange}
                    min="1"
                    max="14"
                    className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Weight</label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleFormChange}
                    placeholder="e.g. 500g"
                    className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* COLUMN 2 */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Image 1 *</label>
                  <input
                    type="text"
                    value={formData.images[0]}
                    onChange={(e) => handleImageChange(0, e.target.value)}
                    placeholder="Image URL"
                    className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  {formData.images[0] && (
                    <img src={formData.images[0]} alt="Preview" className="w-16 h-16 rounded-lg object-cover mt-2" />
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Image 2</label>
                  <input
                    type="text"
                    value={formData.images[1]}
                    onChange={(e) => handleImageChange(1, e.target.value)}
                    placeholder="Image URL"
                    className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Image 3</label>
                  <input
                    type="text"
                    value={formData.images[2]}
                    onChange={(e) => handleImageChange(2, e.target.value)}
                    placeholder="Image URL"
                    className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Image 4</label>
                  <input
                    type="text"
                    value={formData.images[3]}
                    onChange={(e) => handleImageChange(3, e.target.value)}
                    placeholder="Image URL"
                    className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Recipient</label>
                  <select
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleFormChange}
                    className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {RECIPIENTS.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Rating</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleFormChange}
                    step="0.1"
                    min="0"
                    max="5"
                    className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Review Count</label>
                  <input
                    type="number"
                    name="reviewCount"
                    value={formData.reviewCount}
                    onChange={handleFormChange}
                    className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Stock Count</label>
                  <input
                    type="number"
                    name="stockCount"
                    value={formData.stockCount}
                    onChange={handleFormChange}
                    className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">Occasions</label>
                  <div className="max-h-32 overflow-y-auto bg-gray-100 dark:bg-gray-700 rounded-lg p-2 space-y-2">
                    {OCCASIONS.map(occasion => (
                      <label key={occasion} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.occasions.includes(occasion)}
                          onChange={() => handleOccasionToggle(occasion)}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-900 dark:text-white">{occasion}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleFormChange}
                    placeholder="e.g. luxury, elegant, romantic"
                    className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* TOGGLES */}
            <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Personalisable', field: 'isPersonalisable' },
                  { label: 'In Stock', field: 'inStock' },
                  { label: 'Bestseller', field: 'isBestseller' },
                  { label: 'New', field: 'isNew' },
                  { label: 'Sale', field: 'isSale' },
                  { label: 'Free Delivery', field: 'freeDelivery' },
                  { label: 'Gift Wrap Available', field: 'giftWrappingAvailable' },
                ].map(toggle => (
                  <div key={toggle.field} className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleField(toggle.field)}
                      className={`w-11 h-6 rounded-full transition-colors ${
                        formData[toggle.field] ? 'bg-rose-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          formData[toggle.field] ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{toggle.label}</span>
                  </div>
                ))}
              </div>

              {formData.isPersonalisable && (
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Personalisation Note</label>
                  <input
                    type="text"
                    name="personalisationNote"
                    value={formData.personalisationNote}
                    onChange={handleFormChange}
                    placeholder="e.g. Add a name or message"
                    className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 flex gap-3 bg-gray-50 dark:bg-gray-700 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={closeModal}
              className="flex-1 px-4 py-2 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={saveProduct}
              className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium"
            >
              Save Product
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={() => setIsDeleteConfirmOpen(false)} />
        <Dialog.Panel className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-xl">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-bold text-gray-900 dark:text-white">Delete Product?</Dialog.Title>
                {deletingProduct && (
                  <p className="text-sm text-gray-500">{deletingProduct.name}</p>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="flex-1 px-4 py-2 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}
