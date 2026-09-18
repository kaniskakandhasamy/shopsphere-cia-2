import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiShoppingBag, FiTruck, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';

const statusOptions = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchAdminOrders();
  }, []);

  const fetchAdminOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/orders');
      if (res.data && res.data.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      toast.error('Error fetching admin orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await api.put(`/admin/orders/${orderId}`, { status: newStatus });
      toast.success(res.data?.message || 'Order status updated');
      // Update locally
      setOrders((prev) =>
        prev.map((ord) =>
          ord._id === orderId ? { ...ord, orderStatus: newStatus } : ord
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating order status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900">Order Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Process, track and update customer Cash on Delivery fulfillment ({orders.length} orders)
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">Order ID</th>
                <th className="py-3 px-4 font-bold">Customer</th>
                <th className="py-3 px-4 font-bold">Order Date</th>
                <th className="py-3 px-4 font-bold">Items Ordered</th>
                <th className="py-3 px-4 font-bold">Total (COD)</th>
                <th className="py-3 px-4 font-bold">Delivery Destination</th>
                <th className="py-3 px-4 font-bold">Order Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">No orders found.</td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      #{ord._id.slice(-8)}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">
                        {ord.user?.name || ord.shippingAddress.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {ord.user?.email || ord.shippingAddress.phone}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="font-semibold">{ord.products.length} item(s)</span>
                      <p className="text-[11px] text-slate-400 truncate max-w-[160px]">
                        {ord.products.map((p) => p.name).join(', ')}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      ${ord.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-[180px] truncate">
                      {ord.shippingAddress.city}, {ord.shippingAddress.state} ({ord.shippingAddress.pincode})
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={ord.orderStatus}
                        disabled={updatingId === ord._id}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          ord.orderStatus === 'DELIVERED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : ord.orderStatus === 'SHIPPED'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : ord.orderStatus === 'CONFIRMED'
                            ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                            : ord.orderStatus === 'CANCELLED'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : 'bg-blue-50 text-blue-800 border-blue-300'
                        }`}
                      >
                        {statusOptions.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminOrders;
