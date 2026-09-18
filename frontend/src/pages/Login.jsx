import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiArrowRight, FiUserCheck, FiShield } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in both email and password');
      return;
    }

    try {
      setSubmitting(true);
      const data = await login(email, password);
      toast.success(`Welcome back, ${data.user.name}!`);
      if (data.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  // Demo autofill helpers
  const fillCustomer = () => {
    setEmail('alex.johnson@example.com');
    setPassword('Customer@123');
  };

  const fillAdmin = () => {
    setEmail('admin@shopsphere.com');
    setPassword('Admin@123');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-indigo-600 text-white items-center justify-center text-xl font-bold shadow-md shadow-indigo-200">
            S
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign In to ShopSphere
          </h1>
          <p className="text-xs text-slate-500">
            Access your cart, wishlist, and track your COD deliveries
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-2">
          <p className="font-bold text-slate-600 text-center uppercase tracking-wider text-[10px]">
            Quick Demo Autofill
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillCustomer}
              className="py-1.5 px-2.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 font-semibold flex items-center justify-center space-x-1 shadow-sm text-xs"
            >
              <FiUserCheck className="text-indigo-600" />
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={fillAdmin}
              className="py-1.5 px-2.5 rounded-lg bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-800 font-semibold flex items-center justify-center space-x-1 shadow-sm text-xs"
            >
              <FiShield className="text-amber-600" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
              <FiMail className="absolute left-3.5 top-3 text-slate-400 text-base" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
              <FiLock className="absolute left-3.5 top-3 text-slate-400 text-base" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 flex items-center justify-center space-x-2 transition-all active:scale-98 disabled:opacity-50"
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
            <FiArrowRight />
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-500 pt-2">
          <span>Don't have an account? </span>
          <Link to="/register" className="font-bold text-indigo-600 hover:underline">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
