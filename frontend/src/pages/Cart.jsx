import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiShoppingBag, FiCheckCircle } from 'react-icons/fi';

const Cart = () => {
  const { cart, cartSubtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
          <FiShoppingBag className="text-4xl" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">Your Shopping Cart is Empty</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Looks like you haven't added any items to your cart yet. Explore our catalog of 100+ items!
          </p>
        </div>
        <div>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md hover:bg-indigo-700 transition-colors"
          >
            <FiArrowLeft />
            <span>Start Shopping</span>
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
            Shopping Cart
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {cart.items.length} unique item{cart.items.length > 1 ? 's' : ''} ready for Cash on Delivery checkout
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:underline"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Items Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
            {cart.items.map((item) => {
              const prod = item.product;
              if (!prod) return null;
              const prodId = prod._id || prod;
              const price = prod.discountPrice > 0 ? prod.discountPrice : prod.price;
              const lineTotal = price * item.quantity;

              return (
                <div key={prodId} className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
                  
                  {/* Thumbnail */}
                  <Link to={`/products/${prodId}`} className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                  </Link>

                  {/* Title & Brand */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                      {prod.brand}
                    </span>
                    <Link to={`/products/${prodId}`} className="block hover:text-indigo-600 transition-colors">
                      <h3 className="text-sm font-semibold text-slate-800 truncate">
                        {prod.name}
                      </h3>
                    </Link>
                    <div className="text-xs text-slate-500 mt-1">
                      Unit Price: ${price.toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                      <button
                        onClick={() => updateQuantity(prodId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1.5 text-slate-600 hover:text-indigo-600 disabled:opacity-30"
                      >
                        <FiMinus className="text-xs" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(prodId, item.quantity + 1)}
                        disabled={item.quantity >= prod.stock}
                        className="p-1.5 text-slate-600 hover:text-indigo-600 disabled:opacity-30"
                      >
                        <FiPlus className="text-xs" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[80px]">
                    <span className="text-sm font-bold text-slate-900">
                      ${lineTotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(prodId)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Remove Item"
                  >
                    <FiTrash2 />
                  </button>

                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              <FiArrowLeft />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Card (Section 26) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6 h-fit">
          <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800">${cartSubtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Standard Shipping</span>
              <span className="font-semibold text-emerald-600">FREE</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Payment Mode</span>
              <span className="font-semibold text-slate-800">Cash on Delivery (COD)</span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline text-base font-extrabold text-slate-900">
              <span>Total Payable</span>
              <span className="text-2xl text-indigo-600">${cartSubtotal.toFixed(2)}</span>
            </div>
          </div>

          {/* COD Notice */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start space-x-2.5">
            <FiCheckCircle className="text-emerald-600 text-base flex-shrink-0 mt-0.5" />
            <span>
              <strong>Zero prepayment required.</strong> Pay exact cash amount to courier on package arrival.
            </span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all active:scale-98"
          >
            Proceed to Checkout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Cart;
