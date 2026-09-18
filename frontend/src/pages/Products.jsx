import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductList from '../components/ProductList';
import { FiFilter, FiSearch, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state from URL params
  const categoryParam = searchParams.get('category') || 'All';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const featuredParam = searchParams.get('isFeatured') || '';

  const [searchInput, setSearchInput] = useState(searchParam);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch categories once
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data && res.data.categories) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.warn('Error fetching categories:', err.message);
      }
    };
    fetchCats();
  }, []);

  // Fetch products whenever params change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const query = new URLSearchParams();
        query.set('page', pageParam.toString());
        query.set('limit', '12'); // 12 per page per Section 20

        if (categoryParam && categoryParam !== 'All') {
          query.set('category', categoryParam);
        }
        if (searchParam) {
          query.set('search', searchParam);
        }
        if (sortParam) {
          query.set('sort', sortParam);
        }
        if (featuredParam === 'true') {
          query.set('isFeatured', 'true');
        }

        const res = await api.get(`/products?${query.toString()}`);
        if (res.data && res.data.products) {
          setProducts(res.data.products);
          setTotalCount(res.data.total || 0);
          setTotalPages(res.data.totalPages || 1);
        }
      } catch (err) {
        console.error('Error fetching products:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryParam, searchParam, sortParam, pageParam, featuredParam]);

  // Handle URL Param updates
  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset to page 1 on filter/sort changes
    if (key !== 'page') {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput.trim());
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const hasActiveFilters =
    (categoryParam && categoryParam !== 'All') || searchParam || sortParam !== 'newest' || featuredParam;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header & Mobile Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore All Products
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Showing {products.length} of {totalCount} verified items
          </p>
        </div>

        {/* Sort & Search Controls */}
        <div className="flex items-center gap-3">
          {/* Search bar inside header */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search by name or brand..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
            <FiSearch className="absolute left-3 top-2.5 text-slate-400" />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  updateParam('search', '');
                }}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <FiX />
              </button>
            )}
          </form>

          {/* Sort Dropdown (Section 19: Price Low to High, Price High to Low, Newest) */}
          <select
            value={sortParam}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 shadow-sm cursor-pointer"
          >
            <option value="newest">Sort: Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-200 flex items-center justify-center"
            title="Filter Categories"
          >
            <FiFilter className="text-lg" />
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products List */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8">
        
        {/* Desktop Sidebar: Category Filter (Section 18) */}
        <aside className="hidden md:block space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <FiFilter className="text-indigo-600" />
                <span>Categories</span>
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="space-y-1">
              <button
                onClick={() => updateParam('category', 'All')}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                  categoryParam === 'All'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Categories</span>
                {categoryParam === 'All' && <span className="text-xs font-bold">✓</span>}
              </button>

              {categories.map((cat) => {
                const isSelected = categoryParam.toLowerCase() === cat.name.toLowerCase();
                return (
                  <button
                    key={cat._id}
                    onClick={() => updateParam('category', cat.name)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    {isSelected && <span className="text-xs font-bold">✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Quick Filters */}
            <div className="pt-6 mt-6 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Special Offers
              </h4>
              <button
                onClick={() => updateParam('isFeatured', featuredParam === 'true' ? '' : 'true')}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                  featuredParam === 'true'
                    ? 'bg-amber-500 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Featured Items Only</span>
                {featuredParam === 'true' && <span className="text-xs font-bold">✓</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="md:col-span-3 space-y-8">
          
          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Active filters:</span>
              {categoryParam && categoryParam !== 'All' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Category: {categoryParam}
                  <button
                    onClick={() => updateParam('category', 'All')}
                    className="ml-1.5 hover:text-indigo-900"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchParam && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Search: "{searchParam}"
                  <button
                    onClick={() => {
                      setSearchInput('');
                      updateParam('search', '');
                    }}
                    className="ml-1.5 hover:text-indigo-900"
                  >
                    ×
                  </button>
                </span>
              )}
              {featuredParam === 'true' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  Featured Deals
                  <button
                    onClick={() => updateParam('isFeatured', '')}
                    className="ml-1.5 hover:text-amber-900"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-rose-600 hover:underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Cards List */}
          <ProductList
            products={products}
            loading={loading}
            emptyMessage="No products match your criteria"
          />

          {/* Pagination Controls (Section 20: Previous, 1, 2, 3, Next) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-6">
              <button
                onClick={() => updateParam('page', (pageParam - 1).toString())}
                disabled={pageParam <= 1}
                className="inline-flex items-center space-x-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-colors"
              >
                <FiChevronLeft />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-1">
                {[...Array(totalPages)].map((_, idx) => {
                  const pageNumber = idx + 1;
                  const isCurrent = pageNumber === pageParam;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => updateParam('page', pageNumber.toString())}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-colors ${
                        isCurrent
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => updateParam('page', (pageParam + 1).toString())}
                disabled={pageParam >= totalPages}
                className="inline-flex items-center space-x-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-colors"
              >
                <span>Next</span>
                <FiChevronRight />
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Mobile Drawer Filter Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end md:hidden">
          <div className="w-80 max-w-full bg-white h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-slate-900 text-base">Filter Products</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <FiX className="text-2xl" />
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Category
                </p>
                <button
                  onClick={() => {
                    updateParam('category', 'All');
                    setMobileFiltersOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium ${
                    categoryParam === 'All' ? 'bg-indigo-600 text-white' : 'text-slate-700'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => {
                      updateParam('category', cat.name);
                      setMobileFiltersOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium ${
                      categoryParam.toLowerCase() === cat.name.toLowerCase()
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-700'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => {
                  clearFilters();
                  setMobileFiltersOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm shadow-md"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Products;
