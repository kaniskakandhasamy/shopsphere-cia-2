import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiHeart, FiTrash2, FiShoppingCart, FiArrowLeft } from 'react-icons/fi';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart } = useCart();

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
          <FiHeart className="text-4xl" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">Your Wishlist is Empty</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Save items you love by tapping the heart icon on any product card!
          </p>
        </div>
        <div>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md hover:bg-indigo-700 transition-colors"
          >
            <FiArrowLeft />
            <span>Discover Products</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Wishlist
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {wishlist.length} saved item{wishlist.length > 1 ? 's' : ''}
          </p>
        </div>
        <Link
          to="/products"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
        >
          Add More Items
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => {
          const prodId = item._id || item;
          const price = item.discountPrice > 0 ? item.discountPrice : item.price;

          return (
            <div
              key={prodId}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square bg-slate-100 overflow-hidden">
                  <Link to={`/products/${prodId}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(prodId)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-rose-600 shadow-sm hover:bg-rose-50"
                    title="Remove from Wishlist"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>

                <div className="p-4">
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                    {item.brand}
                  </span>
                  <Link to={`/products/${prodId}`} className="block hover:text-indigo-600">
                    <h3 className="text-sm font-semibold text-slate-800 truncate mt-0.5">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="mt-2 text-base font-bold text-slate-900">
                    ${price ? price.toFixed(2) : '0.00'}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => {
                    addToCart(item, 1);
                    removeFromWishlist(prodId);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-colors"
                >
                  <FiShoppingCart />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Wishlist;
