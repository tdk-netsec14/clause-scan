import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Scale,
  LayoutDashboard,
  FileText,
  Plus,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const linkClass = (active = false) => (
    `flex items-center gap-3 rounded-md px-4 py-3 text-[15px] font-medium transition-all duration-200 ${
      active
        ? 'bg-[#fed977] text-[#6b5400] shadow-sm'
        : 'text-white/55 hover:bg-white/[0.06] hover:text-white'
    }`
  );

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[212px] flex-col bg-[#0f1b3c] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] lg:flex">
      {/* Brand */}
      <div className="px-4 pt-5 pb-6">
        <Link to="/dashboard" className="flex items-start gap-3 px-1 py-1">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#fed977] text-[#0f1b3c]">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <div className="font-serif text-[22px] font-bold leading-none tracking-tight">ClauseScan</div>
            <div className="mt-1 text-[11px] tracking-[0.18em] text-white/65">Enterprise Suite</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-2 space-y-1">
        <Link to="/" className={linkClass(false)}>
          <LayoutDashboard className="h-4 w-4" />
          <span>Home</span>
        </Link>
        <Link to="/dashboard" className={linkClass(isActive('/dashboard') || isActive('/analysis'))}>
          <FileText className="h-4 w-4" />
          <span>Documents</span>
        </Link>
      </div>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-3">
        <Link
          to="/upload"
          className="flex items-center justify-center gap-2 rounded-md bg-[#4F46E5] px-4 py-3 text-[14px] font-medium text-white shadow-[0_8px_18px_rgba(79,70,229,0.28)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="h-4 w-4" />
          New Analysis
        </Link>

        {/* User */}
        <div className="border-t border-white/10 pt-3">
          <div className="px-3">
            <p className="truncate text-sm font-medium text-white">{user?.name}</p>
            <p className="truncate text-xs text-white/45">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="mt-3 flex items-center gap-2 px-3 text-sm text-white/55 transition-colors hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
