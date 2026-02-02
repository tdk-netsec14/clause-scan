import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Scale, CheckCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { isAuthenticated, login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const e = {};
    if (!formData.email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Invalid email';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 6) e.password = 'Minimum 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate(); setErrors(v); setServerError('');
    if (Object.keys(v).length > 0) return;
    setIsLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', formData);
      login(data.token, data.user);
      toast.success('Welcome back!');
    } catch (err) { setServerError(err.error || 'Login failed'); }
    finally { setIsLoading(false); }
  };

  const handleChange = (f, v) => {
    setFormData({ ...formData, [f]: v });
    if (errors[f]) setErrors({ ...errors, [f]: '' });
    if (serverError) setServerError('');
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-[45%] bg-navy-900 items-center justify-center p-12 relative overflow-hidden">
        {/* Abstract SVGs */}
        <svg viewBox="0 0 400 400" className="absolute top-0 right-0 w-96 h-96 text-gold-500 fill-current opacity-10">
          <path d="M400,200 C400,89.543 310.457,0 200,0 L200,40 C288.366,40 360,111.634 360,200 L400,200 Z" />
        </svg>
        <div className="absolute bottom-10 left-10 w-48 h-48 border border-gold-500 rounded-full opacity-10"></div>
        <div className="absolute top-1/3 left-10 w-2 h-2 bg-gold-500 rounded-full opacity-20"></div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
          <Scale className="w-16 h-16 text-gold-500 mb-6" />
          <h1 className="font-serif text-[36px] font-bold text-white mb-4">ClauseScan</h1>
          <p className="text-gray-300 text-base mb-12">Contract clarity for every business</p>

          <div className="space-y-4 w-full text-left">
            {[
              'AI-powered clause analysis',
              'Plain English + Hindi summaries',
              'Free — no credit card required'
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-gold-500 shrink-0" />
                <span className="text-gray-300 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col justify-center p-6 lg:p-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-[28px] font-bold text-navy-950 mb-2">Welcome back</h2>
            <p className="text-gray-500 text-sm">Please enter your details to sign in.</p>
          </div>

          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 font-medium text-center">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
              <input 
                id="login-email" 
                type="email" 
                value={formData.email} 
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-4 py-3.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow ${errors.email ? 'border-red-300' : 'border-gray-200'}`}
                placeholder="you@company.com" 
              />
              {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input 
                  id="login-password" 
                  type={showPassword ? 'text' : 'password'} 
                  value={formData.password} 
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={`w-full px-4 py-3.5 pr-12 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow ${errors.password ? 'border-red-300' : 'border-gray-200'}`}
                  placeholder="••••••••" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl flex justify-center items-center gap-2 transition-colors mt-2">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-400">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <button 
            type="button" 
            title="Coming soon"
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3.5 rounded-xl transition-colors cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-600 mt-10">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-700">Create account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
