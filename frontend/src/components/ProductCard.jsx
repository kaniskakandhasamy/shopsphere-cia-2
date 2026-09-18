import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const inWishlist = isInWishlist(product._id);

  const discountPercentage =
    product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : null;

  const currentPrice =
    product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;

  const isLowStock = product.stock > 0 && product.stock < 10;
  const isOutOfStock = product.stock <= 0;

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden">
      
      {/* Badges & Wishlist Button */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        <Link to={`/products/${product._id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80';
            }}
          />
        </Link>

        {/* Discount Badge */}
        {discountPercentage && (
          <span className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
            {discountPercentage}% OFF
          </span>
        )}

        {/* Featured Badge */}
        {product.isFeatured && !discountPercentage && (
          <span className="absolute top-3 left-3 bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
            FEATURED
          </span>
        )}

        {/* Wishlist Toggle Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-slate-600 hover:text-rose-500 shadow-sm transition-transform active:scale-90"
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          {inWishlist ? (
            <FaHeart className="text-rose-500 text-base" />
          ) : (
            <FiHeart className="text-base" />
          )}
        </button>

        {/* Stock Alert Overlay */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-[2px]">
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-md">
              Out of Stock
            </span>
          </div>
        ) : isLowStock ? (
          <span className="absolute bottom-2 left-2 bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            Only {product.stock} left!
          </span>
        ) : null}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span className="uppercase tracking-wider font-semibold text-indigo-600">
              {product.brand}
            </span>
            {product.category && (
              <span className="truncate max-w-[120px]">
                {product.category.name || product.category}
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link to={`/products/${product._id}`} className="block group-hover:text-indigo-600 transition-colors">
            <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center space-x-1.5 mt-2">
            <div className="flex items-center text-amber-400 text-xs">
              <FiStar className="fill-amber-400 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-700">
              {product.rating ? product.rating.toFixed(1) : '4.5'}
            </span>
            <span className="text-[11px] text-slate-400">
              ({product.numReviews || Math.floor((product.rating || 4) * 8)})
            </span>
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-bold text-slate-900">
                ${currentPrice.toFixed(2)}
              </span>
              {product.discountPrice > 0 && product.discountPrice < product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium block">
              COD Available
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all duration-200 ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 active:scale-95'
            }`}
            title="Add to Cart"
          >
            <FiShoppingCart className="text-base" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
