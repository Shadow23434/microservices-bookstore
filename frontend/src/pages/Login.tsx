import { Link, useNavigate, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && user.email === email) {
      login(user);
    } else {
      login({
        firstName: email.split('@')[0] || 'User',
        lastName: '',
        email,
        phone: ''
      });
    }
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
  };

  return (
    <div className="bg-[#fdfaf7] dark:bg-[#1a120b] font-sans text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header/Logo Area */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#d36d24]/10 px-6 py-4 md:px-20 lg:px-40 bg-white/50 dark:bg-[#1a120b]/50 backdrop-blur-md sticky top-0 z-50">
          <Link to="/" className="flex items-center gap-2 text-[#d36d24]">
            <Logo className="w-8 h-8 text-[#d36d24] fill-current" />
            <span className="font-bold text-xl text-gray-900 dark:text-slate-100">BookStore</span>
          </Link>
        </header>

        {/* Main Content Area */}
        <main className="flex flex-1 items-center justify-center p-4">
          <div className="w-full max-w-[480px] space-y-8 bg-white dark:bg-slate-900 p-8 rounded-xl shadow-xl shadow-[#d36d24]/5 border border-[#d36d24]/10">
            {/* Welcome Section */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">Welcome Back</h1>
              <p className="text-slate-500 dark:text-slate-400">Discover your next favorite story</p>
            </div>

            {/* Login Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email or Username</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email or username"
                  required
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-[#d36d24] focus:ring-2 focus:ring-[#d36d24]/20 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                  <a href="#" className="text-xs font-bold text-[#d36d24] hover:underline">Forgot password?</a>
                </div>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-[#d36d24] focus:ring-2 focus:ring-[#d36d24]/20 outline-none transition-all placeholder:text-slate-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-[#d36d24]"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="size-4 rounded border-slate-300 text-[#d36d24] focus:ring-[#d36d24]/50 accent-[#d36d24] cursor-pointer"
                />
                <label htmlFor="remember" className="text-sm text-slate-600 dark:text-slate-400 select-none cursor-pointer">
                  Remember me for 30 days
                </label>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-[#d36d24] py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-[#d36d24]/30 hover:bg-[#d36d24]/90 transition-all active:scale-[0.98]"
              >
                Sign In
              </button>
            </form>

            <div className="relative flex items-center justify-center py-2">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-slate-500">
                Don't have an account?{' '}
                <Link to="/signup" className="font-bold text-[#d36d24] hover:underline">
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </main>

        <footer className="mt-auto px-6 py-8 text-center border-t border-[#d36d24]/5">
          <p className="text-xs text-slate-400"> 2026 BookStore. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
