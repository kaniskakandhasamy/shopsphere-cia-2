import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductList from '../components/ProductList';
import {
  FiArrowRight,
  FiShoppingBag,
  FiTruck,
  FiCheckCircle,
  FiShield,
  FiTrendingUp
} from 'react-icons/fi';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [catRes, featRes, latestRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?isFeatured=true&limit=8'),
          api.get('/products?sort=newest&limit=8')
        ]);

        if (catRes.data && catRes.data.categories) {
          setCategories(catRes.data.categories);
        }
        if (featRes.data && featRes.data.products) {
          setFeaturedProducts(featRes.data.products);
        }
        if (latestRes.data && latestRes.data.products) {
          setLatestProducts(latestRes.data.products);
        }
      } catch (err) {
        console.warn('Error fetching homepage data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        {/* Glow ambient background elements */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold tracking-wide text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Exclusive Cash on Delivery Across All Orders</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Shop Smart. <br />
              Shop Simple. <br />
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-white bg-clip-text text-transparent">
                ShopSphere.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Explore 100+ premium tech devices, high-fidelity audio, fashion staples, and lifestyle essentials with effortless Cash on Delivery checkout.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 active:scale-95 transition-all duration-200"
              >
                <span>Shop Now</span>
                <FiArrowRight className="text-lg" />
              </Link>
              <Link
                to="/products?isFeatured=true"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-md border border-white/20 transition-all duration-200"
              >
                <FiTrendingUp />
                <span>Featured Deals</span>
              </Link>
            </div>

            {/* Micro proof badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 text-center lg:text-left">
              <div>
                <p className="text-2xl font-bold text-white">100+</p>
                <p className="text-xs text-slate-400">Curated Products</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">10</p>
                <p className="text-xs text-slate-400">Popular Categories</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-400">100%</p>
                <p className="text-xs text-slate-400">COD Guarantee</p>
              </div>
            </div>
          </div>

          {/* Hero Banner Visual Showcase */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                alt="ShopSphere Hero Product"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Trending Now
                </span>
                <h3 className="text-xl font-bold text-white">Sony WH-1000XM5</h3>
                <p className="text-sm text-slate-300">Active Noise Cancelling Premium Headset</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xl font-extrabold text-white">$349.00</span>
                  <Link
                    to="/products"
                    className="px-4 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-colors"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-sm text-slate-500 mt-1">Browse our top 10 verified merchandise departments</p>
          </div>
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center space-x-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span>View All</span>
            <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300 flex flex-col"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80';
                  }}
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
              <FiTrendingUp />
              <span>Handpicked For You</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Products
            </h2>
          </div>
          <Link
            to="/products?isFeatured=true"
            className="inline-flex items-center space-x-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span>Explore All</span>
            <FiArrowRight />
          </Link>
        </div>

        <ProductList products={featuredProducts} loading={loading} />
      </section>

      {/* Trust & COD Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500 text-slate-950">
              Risk-Free Shopping
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Order Online. Pay with Cash on Delivery.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              No credit card, no debit card, and no digital wallet required. Place your order with ease, inspect your package at your doorstep, and pay in cash.
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 shadow-md transition-colors"
              >
                <FiShoppingBag />
                <span>Start Shopping Now</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Latest Arrivals
            </h2>
            <p className="text-sm text-slate-500 mt-1">Recently added brand-name tech, accessories, and wear</p>
          </div>
          <Link
            to="/products?sort=newest"
            className="inline-flex items-center space-x-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span>See More</span>
            <FiArrowRight />
          </Link>
        </div>

        <ProductList products={latestProducts} loading={loading} />
      </section>

    </div>
  );
};

export default Home;
