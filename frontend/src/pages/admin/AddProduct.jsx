import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiSave, FiPackage, FiImage } from 'react-icons/fi';

const AddProduct = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('editId');
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    category: '',
    price: '',
    discountPrice: '',
    image: '',
    stock: '',
    isFeatured: false
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (editId) {
      fetchProductDetails(editId);
    }
  }, [editId]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data && res.data.categories) {
        setCategories(res.data.categories);
        if (!editId && res.data.categories.length > 0) {
          setFormData((prev) => ({ ...prev, category: res.data.categories[0]._id }));
        }
      }
    } catch (err) {
      console.warn('Error fetching categories:', err.message);
    }
  };

  const fetchProductDetails = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      if (res.data && res.data.product) {
        const p = res.data.product;
        setFormData({
          name: p.name,
          description: p.description,
          brand: p.brand,
          category: p.category?._id || p.category,
          price: p.price,
          discountPrice: p.discountPrice || '',
          image: p.image,
          stock: p.stock,
          isFeatured: Boolean(p.isFeatured)
        });
      }
    } catch (err) {
      toast.error('Error fetching product for editing');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.brand || !formData.category || !formData.price || !formData.image) {
      toast.error('Please complete all required product fields');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        brand: formData.brand.trim(),
        category: formData.category,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : 0,
        image: formData.image.trim(),
        stock: Number(formData.stock) || 0,
        isFeatured: formData.isFeatured
      };

      if (editId) {
        await api.put(`/products/${editId}`, payload);
        toast.success('Product updated successfully!');
      } else {
        await api.post('/products', payload);
        toast.success('Product created successfully!');
      }

      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
        <Link to="/admin/products" className="p-2 rounded-xl hover:bg-slate-100 text-slate-500">
          <FiArrowLeft className="text-xl" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {editId ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-xs text-slate-500">
            {editId ? 'Update product specifications and inventory' : 'Create a new catalog item for ShopSphere'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Name & Brand */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Product Title *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Brand *
            </label>
            <input
              type="text"
              name="brand"
              required
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g. Sony, Apple, Nike"
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Category & Featured */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Category *
            </label>
            <select
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center sm:pt-6">
            <label className="relative flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-semibold text-slate-700">
                Mark as Featured Product (Highlights on Homepage)
              </span>
            </label>
          </div>
        </div>

        {/* Price, Discount Price & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Regular Price ($) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="price"
              required
              value={formData.price}
              onChange={handleChange}
              placeholder="399.00"
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Discount Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="discountPrice"
              value={formData.discountPrice}
              onChange={handleChange}
              placeholder="Leave empty or enter sale price"
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Stock Quantity *
            </label>
            <input
              type="number"
              min="0"
              name="stock"
              required
              value={formData.stock}
              onChange={handleChange}
              placeholder="15"
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Image URL *
          </label>
          <div className="relative">
            <input
              type="url"
              name="image"
              required
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
            <FiImage className="absolute left-3.5 top-3 text-slate-400" />
          </div>
          {formData.image && (
            <div className="mt-3 flex items-center space-x-3">
              <img
                src={formData.image}
                alt="Preview"
                className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80';
                }}
              />
              <span className="text-xs text-slate-400">Live image preview</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Product Description *
          </label>
          <textarea
            name="description"
            rows={4}
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide detailed product specifications, highlights, features..."
            className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          ></textarea>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 flex items-center space-x-2 transition-all active:scale-98 disabled:opacity-50"
          >
            <FiSave />
            <span>{loading ? 'Saving...' : editId ? 'Update Product' : 'Create Product'}</span>
          </button>
          <Link
            to="/admin/products"
            className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50"
          >
            Cancel
          </Link>
        </div>

      </form>

    </div>
  );
};

export default AddProduct;
