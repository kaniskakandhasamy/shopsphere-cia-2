import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiPackage, FiCalendar, FiClock, FiXCircle, FiCheck, FiTruck, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const statusBadges = {
  PLACED: 'bg-blue-50 text-blue-700 border-blue-200',
  CONFIRMED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  SHIPPED: 'bg-amber-50 text-amber-700 border-amber-200',
  DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200'
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      if (res.data && res.data.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      toast.error('Could not load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await api.put(`/orders/${orderId}/cancel`);
      toast.success(res.data?.message || 'Order cancelled successfully');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error cancelling order');
    }
  };

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Orders
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Track delivery status and view order history for your account
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <FiPackage className="text-3xl" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Orders Found</h3>
          <p className="text-sm text-slate-500">You have not placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order._id;
            const canCancel = order.orderStatus === 'PLACED';

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-slate-300 transition-all"
              >
                {/* Order Summary Row */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-sm text-slate-800">
                        #{order._id}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          statusBadges[order.orderStatus] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-slate-500 pt-0.5">
                      <span className="flex items-center space-x-1">
                        <FiCalendar />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </span>
                      <span>•</span>
                      <span>Payment: {order.paymentMethod}</span>
                      <span>•</span>
                      <span>{order.products.length} item(s)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end space-x-4">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Total Due (COD)</span>
                      <span className="text-lg font-bold text-slate-900">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {canCancel && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-colors"
                        >
                          Cancel Order
                        </button>
                      )}

                      <button
                        onClick={() => toggleExpand(order._id)}
                        className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                        title="View Details"
                      >
                        {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                    </div>
                  </div>

                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="bg-slate-50/70 p-5 border-t border-slate-100 space-y-4">
                    
                    {/* Shipping Address */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
                      <span className="font-bold text-slate-800 text-xs block mb-1">
                        Delivery Destination:
                      </span>
                      <p className="font-medium text-slate-700">{order.shippingAddress.name} ({order.shippingAddress.phone})</p>
                      <p>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                    </div>

                    {/* Items List */}
                    <div className="divide-y divide-slate-200">
                      {order.products.map((item, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-200"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80';
                              }}
                            />
                            <div>
                              <p className="font-semibold text-slate-800">{item.name}</p>
                              <p className="text-slate-400">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                          <span className="font-bold text-slate-800">
                            ${(item.quantity * item.price).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default Orders;
