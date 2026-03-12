import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid username or password.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-primary/5 border border-primary/10 overflow-hidden">
                <div className="p-4 pb-4 border-b border-primary/10 text-center">
                    <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-2xl">account_circle</span>
                    </div>
                    <h2 className="font-serif text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Welcome Back</h2>
                    <p className="mt-2 text-sm text-slate-500">Please sign in to your Bookstore account</p>
                </div>

                <div className="py-4 px-8">
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400 font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Username</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary px-4 py-3 text-slate-900 dark:text-slate-100 outline-none transition-all"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Enter your username"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                                <a href="#" className="text-xs font-semibold text-primary hover:text-primary-dark">Forgot password?</a>
                            </div>
                            <input
                                type="password"
                                className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary px-4 py-3 text-slate-900 dark:text-slate-100 outline-none transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>
                        <button type="submit" className="w-full py-3.5 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                            <span>Sign In</span>
                            <span className="material-symbols-outlined text-[18px]">login</span>
                        </button>
                    </form>
                </div>

                <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-primary/5 text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Don't have an account? <Link to="/register" className="font-bold text-primary hover:underline">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
