import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiTruck, FiLock, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';

const Checkout = () => {
  const { cart, cartSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address?.addressLine || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!cart.items || cart.items.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    const { name, phone, address, city, state, pincode } = shippingAddress;
    if (!name || !phone || !address || !city || !state || !pincode) {
      toast.error('Please complete all shipping address fields');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/orders', {
        shippingAddress: {
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim()
        }
      });

      if (res.data && res.data.order) {
        clearCart();
        setOrderSuccess(res.data.order);
        toast.success('Order placed successfully with Cash on Delivery!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error placing order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Order Confirmation Success View
  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <FiCheckCircle className="text-4xl" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Order Confirmed
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Thank You For Your Order!
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Your Cash on Delivery order has been registered and is being prepared for shipment.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-left space-y-3 shadow-sm text-sm">
          <div className="flex justify-between pb-3 border-b border-slate-100">
            <span className="text-slate-500">Order ID:</span>
            <span className="font-mono font-bold text-slate-800">{orderSuccess._id}</span>
          </div>
          <div className="flex justify-between pb-3 border-b border-slate-100">
            <span className="text-slate-500">Total Payable:</span>
            <span className="font-bold text-indigo-600">${orderSuccess.totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pb-3 border-b border-slate-100">
            <span className="text-slate-500">Payment Method:</span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Cash on Delivery (COD)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Deliver To:</span>
            <span className="text-right text-slate-700">
              {orderSuccess.shippingAddress.name}<br />
              {orderSuccess.shippingAddress.address}, {orderSuccess.shippingAddress.city}<br />
              {orderSuccess.shippingAddress.state} - {orderSuccess.shippingAddress.pincode}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('/orders')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-colors"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate('/products')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-sm transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500">Add products to your cart before proceeding to checkout.</p>
        <Link
          to="/products"
          className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm shadow-sm"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="pb-4 border-b border-slate-200">
        <Link to="/cart" className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 mb-2">
          <FiArrowLeft />
          <span>Back to Cart</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Checkout & Shipping
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Enter delivery details below. You will pay in cash upon receiving your items.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Shipping Details Form (Section 16) */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <FiTruck className="text-indigo-600" />
              <span>Delivery Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={shippingAddress.name}
                  onChange={handleInputChange}
                  placeholder="e.g. John Smith"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. +1 555-0199"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Street Address / House / Flat *
              </label>
              <input
                type="text"
                name="address"
                required
                value={shippingAddress.address}
                onChange={handleInputChange}
                placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  placeholder="e.g. Springfield"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                  placeholder="e.g. Oregon"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Pincode / ZIP *
                </label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={shippingAddress.pincode}
                  onChange={handleInputChange}
                  placeholder="e.g. 97477"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Payment Method - Fixed to COD (Section 14 & 16) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <FiCheckCircle className="text-emerald-600" />
              <span>Payment Option</span>
            </h2>

            <div className="p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="cod"
                  name="payment"
                  checked
                  readOnly
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <label htmlFor="cod" className="font-bold text-slate-900 text-sm cursor-pointer block">
                    Cash on Delivery (COD)
                  </label>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Pay with exact cash directly to the courier agent when your package is handed over.
                  </p>
                </div>
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                100% COD
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-xl shadow-indigo-200 flex items-center justify-center space-x-2 transition-all active:scale-98 disabled:opacity-50"
          >
            <span>{submitting ? 'Creating Order...' : 'Place Cash on Delivery Order'}</span>
          </button>
        </form>

        {/* Right Side: Order Summary & Review */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Order Review ({cart.items.length} items)
          </h3>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1 space-y-3">
            {cart.items.map((item) => {
              const prod = item.product;
              if (!prod) return null;
              const price = prod.discountPrice > 0 ? prod.discountPrice : prod.price;
              return (
                <div key={prod._id || prod} className="pt-3 first:pt-0 flex items-center gap-3">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-slate-800 truncate">{prod.name}</h4>
                    <p className="text-[11px] text-slate-500">
                      Qty: {item.quantity} × ${price.toFixed(2)}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    ${(price * item.quantity).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800">${cartSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee</span>
              <span className="font-semibold text-emerald-600">FREE</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline text-base font-extrabold text-slate-900">
              <span>Total Due on Delivery</span>
              <span className="text-2xl text-indigo-600">${cartSubtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
