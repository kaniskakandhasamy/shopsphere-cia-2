import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  FiPackage,
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiAlertTriangle,
  FiPlus,
  FiArrowRight,
  FiTrendingUp,
  FiLayers
} from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard');
      if (res.data && res.data.stats) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Error loading dashboard stats:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  const {
    totalProducts = 0,
    totalUsers = 0,
    totalOrders = 0,
    totalRevenue = 0,
    recentOrders = [],
    lowStockProducts = [],
    ordersByStatus = []
  } = stats || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Bar with Admin Navigation Links */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Store Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Admin Dashboard
          </h1>
        </div>

        {/* Quick Admin Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/products"
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 font-semibold text-xs shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <FiPackage className="text-indigo-600" />
            <span>Products</span>
          </Link>
          <Link
            to="/admin/add-product"
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <FiPlus />
            <span>Add Product</span>
          </Link>
          <Link
            to="/admin/categories"
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 font-semibold text-xs shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <FiLayers className="text-indigo-600" />
            <span>Categories</span>
          </Link>
          <Link
            to="/admin/orders"
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 font-semibold text-xs shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <FiShoppingBag className="text-indigo-600" />
            <span>Orders</span>
          </Link>
          <Link
            to="/admin/users"
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 font-semibold text-xs shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <FiUsers className="text-indigo-600" />
            <span>Users</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards (Section 28) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Products */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <FiPackage className="text-2xl" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Products
            </p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalProducts}</p>
          </div>
        </div>

        {/* Card 2: Total Users */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-100">
            <FiUsers className="text-2xl" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Users
            </p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalUsers}</p>
          </div>
        </div>

        {/* Card 3: Total Orders */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
            <FiShoppingBag className="text-2xl" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Orders
            </p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalOrders}</p>
          </div>
        </div>

        {/* Card 4: Total Revenue */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <FiDollarSign className="text-2xl" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Revenue
            </p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

      </div>

      {/* Two Column Layout: Low Stock Alerts & Sales Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Low Stock Products (stock < 10, Section 28 & 38) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2 text-rose-600 font-bold text-sm">
              <FiAlertTriangle />
              <span>Low Stock Alerts (stock &lt; 10)</span>
            </div>
            <span className="text-xs font-semibold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full">
              {lowStockProducts.length} items
            </span>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 italic">No low stock items. All inventory levels healthy.</p>
          ) : (
            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {lowStockProducts.map((prod) => (
                <div key={prod._id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-semibold text-slate-800 line-clamp-1 max-w-[220px]">
                        {prod.name}
                      </h4>
                      <p className="text-slate-400">{prod.brand} • {prod.category?.name || 'Item'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full font-bold text-xs bg-rose-100 text-rose-800">
                      {prod.stock} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Status Distribution Chart Preview (Section 28) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <FiTrendingUp className="text-indigo-600" />
              <span>Order Status Distribution</span>
            </div>
            <span className="text-xs text-slate-400">COD Deliveries</span>
          </div>

          <div className="space-y-3 pt-2">
            {ordersByStatus.map((item) => {
              const percentage = totalOrders > 0 ? Math.round((item.count / totalOrders) * 100) : 0;
              return (
                <div key={item._id} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{item._id}</span>
                    <span className="text-slate-500">
                      {item.count} orders ({percentage}%) • ${item.revenue.toFixed(0)}
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item._id === 'DELIVERED'
                          ? 'bg-emerald-500'
                          : item._id === 'SHIPPED'
                          ? 'bg-amber-500'
                          : item._id === 'CANCELLED'
                          ? 'bg-rose-500'
                          : 'bg-indigo-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Recent Orders Table (Section 28) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">Recent Store Orders</h3>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
          >
            <span>Manage All Orders</span>
            <FiArrowRight />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-2.5 font-bold">Order ID</th>
                <th className="py-2.5 font-bold">Customer</th>
                <th className="py-2.5 font-bold">Date</th>
                <th className="py-2.5 font-bold">Total</th>
                <th className="py-2.5 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((ord) => (
                <tr key={ord._id} className="hover:bg-slate-50/50">
                  <td className="py-3 font-mono text-slate-600">#{ord._id.slice(-6)}</td>
                  <td className="py-3 font-semibold text-slate-800">
                    {ord.user?.name || ord.shippingAddress?.name || 'Customer'}
                  </td>
                  <td className="py-3 text-slate-500">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 font-bold text-slate-900">
                    ${ord.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {ord.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
