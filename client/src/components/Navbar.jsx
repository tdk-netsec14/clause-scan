import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, Scale, ChevronDown, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isPublicDocumentPage = location.pathname.startsWith('/upload') || location.pathname.startsWith('/analysis/');

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (isDashboard || location.pathname.startsWith('/analysis/') || location.pathname.startsWith('/upload')) {
    return null;
  }

  if (isPublicDocumentPage) {
    const items = location.pathname.startsWith('/analysis/')
      ? ['Solutions', 'Pricing', 'Documents', 'FAQ']
      : ['Solutions', 'Pricing', 'Resources', 'FAQ'];

    return (
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-11 items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2 text-black">
              <Scale className="h-6 w-6 text-black" />
              <span className="font-serif text-2xl font-bold tracking-tight">ClauseScan</span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-[13px] text-black/80">
              {items.map((item) => (
                <Link
                  key={item}
                  to={item === 'Documents' ? '/dashboard' : '/'}
                  className={`transition-colors ${item === 'Documents' && location.pathname.startsWith('/analysis/') ? 'border-b border-black pb-1 text-black' : 'hover:text-black'}`}
                >
                  {item}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button className="hidden h-8 w-8 items-center justify-center rounded-full border border-[#d1d5db] text-black sm:inline-flex">
                <Globe className="h-4 w-4" />
              </button>
              <Link to="/login" className="hidden h-8 items-center justify-center rounded-sm border border-black px-4 text-[13px] font-medium text-black sm:inline-flex">
                Login
              </Link>
              <Link to="/register" className="inline-flex h-8 items-center justify-center rounded-sm bg-black px-4 text-[13px] font-semibold text-white">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-navy-900/95 shadow-sm backdrop-blur-md' : 'bg-navy-900'}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <Scale className="w-8 h-8 text-gold-500" />
            <span className="font-serif text-2xl font-bold tracking-tight text-white">ClauseScan</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={`text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-white' : 'text-gray-300 hover:text-white'}`}>Dashboard</Link>
                <Link to="/upload" className={`text-sm font-medium transition-colors ${isActive('/upload') ? 'text-white' : 'text-gray-300 hover:text-white'}`}>Upload</Link>

                <div className="relative ml-4">
                  <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-3 focus:outline-none">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-medium text-white shadow-sm">
                      {getInitials(user?.name)}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-300 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-100 bg-white py-1 shadow-lg"
                      >
                        <div className="border-b border-gray-100 px-4 py-2">
                          <p className="truncate text-sm font-medium text-gray-900">{user?.name}</p>
                          <p className="truncate text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <button onClick={() => { logout(); setDropdownOpen(false); }} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50">
                          <LogOut className="h-4 w-4" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-white transition-colors hover:text-gray-200">Login</Link>
                <Link to="/register" className="rounded-lg bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400">Get Started</Link>
              </>
            )}
          </div>

          <button className="p-2 text-gray-300 hover:text-white md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-navy-700 bg-navy-800 md:hidden">
            <div className="space-y-2 px-6 py-4">
              {isAuthenticated ? (
                <>
                  <div className="mb-4 flex items-center gap-3 rounded-xl bg-navy-900 px-4 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-medium text-white">{getInitials(user?.name)}</div>
                    <div>
                      <p className="text-sm font-medium text-white">{user?.name}</p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                  </div>
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-white hover:bg-navy-700">Dashboard</Link>
                  <Link to="/upload" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-white hover:bg-navy-700">Upload Contract</Link>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-400 hover:bg-navy-700">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-xl bg-navy-700 px-4 py-3 text-center text-sm font-medium text-white">Login</Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-xl bg-gold-500 px-4 py-3 text-center text-sm font-medium text-navy-950">Get Started</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
