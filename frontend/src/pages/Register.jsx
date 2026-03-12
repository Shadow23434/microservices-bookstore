import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed. Please check your inputs.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-primary/5 border border-primary/10 overflow-hidden">
                <div className="p-4 pb-4 border-b border-primary/10 text-center">
                    <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-2xl">person_add</span>
                    </div>
                    <h2 className="font-serif text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Create Account</h2>
                    <p className="mt-2 text-sm text-slate-500">Join the WarmBooks community today</p>
                </div>

                <div className="py-4 px-8 pt-4">
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400 font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">First Name</label>
                                <input
                                    name="first_name"
                                    type="text"
                                    className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary px-4 py-2.5 text-slate-900 dark:text-slate-100 outline-none transition-all"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Last Name</label>
                                <input
                                    name="last_name"
                                    type="text"
                                    className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary px-4 py-2.5 text-slate-900 dark:text-slate-100 outline-none transition-all"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Username *</label>
                            <input
                                name="username"
                                type="text"
                                className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary px-4 py-2.5 text-slate-900 dark:text-slate-100 outline-none transition-all"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address *</label>
                            <input
                                name="email"
                                type="email"
                                className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary px-4 py-2.5 text-slate-900 dark:text-slate-100 outline-none transition-all"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-1.5 pt-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password *</label>
                            <input
                                name="password"
                                type="password"
                                className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary px-4 py-2.5 text-slate-900 dark:text-slate-100 outline-none transition-all"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="w-full mt-6 py-3.5 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                            <span>Create Account</span>
                            <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                        </button>
                    </form>
                </div>

                <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-primary/5 text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Already have an account? <Link to="/login" className="font-bold text-primary hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
