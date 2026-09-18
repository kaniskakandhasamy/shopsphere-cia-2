import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import {
  FiShoppingCart,
  FiHeart,
  FiStar,
  FiTruck,
  FiCheckCircle,
  FiShield,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiArrowLeft
} from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

const ProductDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);

  useEffect(() => {
    fetchProductDetails();
    fetchProductReviews();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      if (res.data && res.data.product) {
        setProduct(res.data.product);
      }
    } catch (err) {
      toast.error('Could not load product details');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductReviews = async () => {
    try {
      const res = await api.get(`/products/${id}/reviews`);
      if (res.data && res.data.reviews) {
        setReviews(res.data.reviews);
      }
    } catch (err) {
      console.warn('Error fetching reviews:', err.message);
    }
  };

  const inWishlist = product ? isInWishlist(product._id) : false;

  const handleWishlistToggle = () => {
    if (!product) return;
    if (inWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Please log in to submit a review');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    try {
      setSubmittingReview(true);
      if (editingReviewId) {
        // Edit existing review
        await api.put(`/reviews/${editingReviewId}`, {
          rating,
          comment: comment.trim()
        });
        toast.success('Review updated successfully!');
        setEditingReviewId(null);
      } else {
        // Create new review
        await api.post(`/products/${id}/reviews`, {
          rating,
          comment: comment.trim()
        });
        toast.success('Review added successfully!');
      }

      setComment('');
      setRating(5);
      fetchProductDetails();
      fetchProductReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleStartEditReview = (rev) => {
    setEditingReviewId(rev._id);
    setRating(rev.rating);
    setComment(rev.comment);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success('Review removed');
      fetchProductDetails();
      fetchProductReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting review');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <Link to="/products" className="inline-block mt-4 text-indigo-600 font-semibold hover:underline">
          Return to Products
        </Link>
      </div>
    );
  }

  const currentPrice =
    product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock < 10;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb navigation */}
      <nav className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-indigo-600">Products</Link>
        <span>/</span>
        <span className="text-slate-800 font-medium truncate max-w-[200px] sm:max-w-md">
          {product.name}
        </span>
      </nav>

      {/* Main Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Product Image Gallery */}
        <div className="relative bg-white rounded-3xl border border-slate-200 p-4 shadow-sm overflow-hidden group">
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          {/* Badges */}
          <div className="absolute top-8 left-8 flex flex-col gap-2">
            {hasDiscount && (
              <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow-md">
                SAVE ${(product.price - product.discountPrice).toFixed(2)}
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-md shadow-md">
                FEATURED
              </span>
            )}
          </div>
        </div>

        {/* Product Info & Purchase Controls */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
                {product.brand}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {product.category?.name || 'Catalog'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              {product.name}
            </h1>

            {/* Rating Stars & Count */}
            <div className="flex items-center space-x-2 mt-3">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`text-sm ${
                      i < Math.round(product.rating || 4)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-800">
                {product.rating ? product.rating.toFixed(1) : '4.5'}
              </span>
              <span className="text-xs text-slate-400">
                • {reviews.length} customer reviews
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-baseline space-x-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              ${currentPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-slate-400 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Cash on Delivery Eligible
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">
              Description
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Stock Status Badge */}
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500">Availability:</span>
            {isOutOfStock ? (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-700">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                Low Stock (Only {product.stock} left)
              </span>
            ) : (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                In Stock ({product.stock} available)
              </span>
            )}
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-4 pt-2">
            {!isOutOfStock && (
              <div className="flex items-center space-x-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Quantity:
                </span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2.5 text-slate-600 hover:text-indigo-600 disabled:opacity-40"
                  >
                    <FiMinus />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2.5 text-slate-600 hover:text-indigo-600 disabled:opacity-40"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg transition-all active:scale-98 ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                }`}
              >
                <FiShoppingCart className="text-xl" />
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`p-4 rounded-2xl border transition-all active:scale-95 flex items-center justify-center ${
                  inWishlist
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
                title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                {inWishlist ? <FaHeart className="text-xl text-rose-600" /> : <FiHeart className="text-xl" />}
              </button>
            </div>
          </div>

          {/* Delivery & Security Assurance */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-xs text-slate-600">
            <div className="flex items-center space-x-2">
              <FiTruck className="text-indigo-600 text-base flex-shrink-0" />
              <span>Standard delivery 2-4 business days</span>
            </div>
            <div className="flex items-center space-x-2">
              <FiCheckCircle className="text-emerald-600 text-base flex-shrink-0" />
              <span>Pay Cash upon Package Delivery</span>
            </div>
          </div>

        </div>
      </div>

      {/* Customer Reviews Section (Section 22) */}
      <div className="pt-8 border-t border-slate-200 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Customer Reviews & Ratings
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Verified feedback from buyers of this item
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-extrabold text-slate-900">
              {product.rating ? product.rating.toFixed(1) : '5.0'}
            </span>
            <span className="text-xs text-slate-400 block">out of 5 stars</span>
          </div>
        </div>

        {/* Add / Edit Review Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-4">
            {editingReviewId ? 'Edit Your Review' : 'Write a Product Review'}
          </h3>

          {isAuthenticated ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Star Rating Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Rating:
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 text-2xl focus:outline-none transition-transform hover:scale-110"
                    >
                      <FiStar
                        className={`${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {rating} of 5 stars
                  </span>
                </div>
              </div>

              {/* Review Comment Textarea */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Your Review:
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your authentic experience with this product..."
                  className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  required
                ></textarea>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-colors disabled:opacity-50"
                >
                  {submittingReview
                    ? 'Submitting...'
                    : editingReviewId
                    ? 'Save Changes'
                    : 'Submit Review'}
                </button>
                {editingReviewId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingReviewId(null);
                      setComment('');
                      setRating(5);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-sm text-slate-600">
                You must be signed in to leave a verified customer review.
              </span>
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-xs shadow-sm hover:bg-indigo-700"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No reviews yet. Be the first to share your thoughts!</p>
          ) : (
            reviews.map((rev) => {
              const isOwner = user && rev.user && (rev.user._id || rev.user) === user._id;
              const isRevAdmin = user && user.role === 'ADMIN';

              return (
                <div
                  key={rev._id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        {(rev.user?.name || 'Customer').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-800">
                          {rev.user?.name || 'Verified Customer'}
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-amber-400 text-xs">
                        {[...Array(5)].map((_, idx) => (
                          <FiStar
                            key={idx}
                            className={idx < rev.rating ? 'fill-amber-400' : 'text-slate-200'}
                          />
                        ))}
                      </div>

                      {/* Edit / Delete actions for review owner or admin */}
                      {(isOwner || isRevAdmin) && (
                        <div className="flex items-center space-x-1 pl-2 border-l border-slate-100">
                          {isOwner && (
                            <button
                              onClick={() => handleStartEditReview(rev)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 rounded"
                              title="Edit Review"
                            >
                              <FiEdit2 className="text-xs" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteReview(rev._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                            title="Delete Review"
                          >
                            <FiTrash2 className="text-xs" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed pt-1">
                    {rev.comment}
                  </p>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
