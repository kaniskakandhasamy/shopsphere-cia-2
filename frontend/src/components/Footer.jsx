import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FiTruck className="text-2xl" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Free Fast Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Prompt delivery on orders</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FiCheckCircle className="text-2xl" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Cash on Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Pay in cash upon arrival</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FiShield className="text-2xl" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">100% Genuine</h4>
              <p className="text-xs text-slate-400 mt-0.5">Verified authentic brands</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FiRefreshCw className="text-2xl" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Hassle-Free Support</h4>
              <p className="text-xs text-slate-400 mt-0.5">Dedicated customer team</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                S
              </div>
              <span className="text-xl font-bold text-white tracking-tight">ShopSphere</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Shop Smart. Shop Simple. ShopSphere is an intermediate-level MERN e-commerce platform offering 100+ curated premium products with verified Cash on Delivery.
            </p>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
              ● COD Checkout Only • No Card Required
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">All Products</Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">My Wishlist</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">Order Tracking</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Top Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products?category=Electronics" className="hover:text-white transition-colors">Electronics</Link>
              </li>
              <li>
                <Link to="/products?category=Mobile Phones" className="hover:text-white transition-colors">Mobile Phones</Link>
              </li>
              <li>
                <Link to="/products?category=Laptops" className="hover:text-white transition-colors">Laptops</Link>
              </li>
              <li>
                <Link to="/products?category=Headphones" className="hover:text-white transition-colors">Headphones</Link>
              </li>
              <li>
                <Link to="/products?category=Cameras" className="hover:text-white transition-colors">Cameras</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Administration</h4>
            <p className="text-sm text-slate-400 mb-3">
              Management portal for catalog, orders, and registered customers.
            </p>
            <Link
              to="/admin"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold tracking-wide transition-colors"
            >
              <span>Admin Dashboard</span>
            </Link>
            <p className="text-[11px] text-slate-500 mt-3">
              Default Admin: admin@shopsphere.com
            </p>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ShopSphere. Built with React, Node.js, Express & MongoDB.</p>
          <p className="mt-2 sm:mt-0">Designed for Learning, Demonstration & Portfolio.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
