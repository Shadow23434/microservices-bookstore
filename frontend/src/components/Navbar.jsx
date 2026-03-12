import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="p-2 bg-primary rounded-lg text-white">
                                <span className="material-symbols-outlined block">menu_book</span>
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-primary">Bookstore</h1>
                        </Link>
                        <nav className="hidden md:flex items-center gap-6">
                            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Books</Link>
                            <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">Genres</span>
                            <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">Deals</span>
                        </nav>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:block relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/60">search</span>
                            <input
                                className="pl-10 pr-4 py-2 bg-primary/5 border-none rounded-lg focus:ring-2 outline-none focus:ring-primary w-64 text-sm"
                                placeholder="Find your next read..."
                                type="text"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <Link to="/cart" className="relative p-2 text-primary hover:bg-primary/10 rounded-full transition-colors">
                                <span className="material-symbols-outlined">shopping_cart</span>
                                {/* Badge count could be dynamic based on CartContext later */}
                                <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-background-light">0</span>
                            </Link>

                            {user ? (
                                <div className="relative group cursor-pointer h-12 w-10 z-50">
                                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/20">
                                        <span className="material-symbols-outlined text-primary">person</span>
                                    </div>
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible transform origin-top-right">
                                        <div className="p-2 border-b border-primary/5">
                                            <p className="text-sm font-bold text-slate-800 truncate px-2">{user.full_name || user.username}</p>
                                        </div>
                                        <div className="py-1">
                                            <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-primary/10 hover:text-primary">My Profile</Link>
                                            <Link to="/orders" className="block px-4 py-2 text-sm text-slate-700 hover:bg-primary/10 hover:text-primary">Order History</Link>

                                            {['staff', 'admin'].includes(user.role) && (
                                                <a href="http://localhost:8000/admin/" target="_blank" rel="noreferrer" className="block px-4 py-2 text-sm text-slate-700 hover:bg-primary/10 hover:text-primary">Django Admin</a>
                                            )}
                                        </div>
                                        <div className="border-t border-primary/5 py-1">
                                            <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-primary transition-colors">Login</Link>
                                    <Link to="/register" className="btn-primary px-4 py-2 text-sm">Sign Up</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
