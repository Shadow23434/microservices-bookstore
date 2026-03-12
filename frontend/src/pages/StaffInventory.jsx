import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const StaffInventory = () => {
    const { user } = useAuth();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await api.get('books/');
                setBooks(response.data);
            } catch (error) {
                console.error("Error fetching inventory", error);
            } finally {
                setLoading(false);
            }
        };

        if (user && ['staff', 'admin'].includes(user.role)) {
            fetchInventory();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (!user || !['staff', 'admin'].includes(user.role)) {
        return <Navigate to="/" />;
    }

    if (loading) {
        return (
            <div className="flex justify-center mt-20">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-display">
            {/* Staff Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-[#2C3E50] text-[#ECF0F1] hidden md:flex flex-col border-r border-slate-700/50 shadow-2xl z-20">
                <div className="p-6 border-b border-white/10 flex items-center gap-3">
                    <span className="material-symbols-outlined text-3xl text-[#E67E22]">history_edu</span>
                    <h1 className="text-xl font-bold font-serif tracking-wide">Archive & Quill</h1>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2">
                    <a href="/staff/inventory" className="flex items-center gap-3 px-4 py-3 bg-[#E67E22]/10 text-[#E67E22] rounded-xl font-medium transition-colors border border-[#E67E22]/20">
                        <span className="material-symbols-outlined">inventory_2</span>
                        Inventory
                    </a>
                    <a href="/staff/users" className="flex items-center gap-3 px-4 py-3 text-[#BDC3C7] hover:bg-white/5 hover:text-white rounded-xl font-medium transition-colors cursor-pointer">
                        <span className="material-symbols-outlined">group</span>
                        Users
                    </a>
                    <a href="/staff/reports" className="flex items-center gap-3 px-4 py-3 text-[#BDC3C7] hover:bg-white/5 hover:text-white rounded-xl font-medium transition-colors cursor-pointer">
                        <span className="material-symbols-outlined">analytics</span>
                        Reports
                    </a>
                    <a href="/staff/orders" className="flex items-center gap-3 px-4 py-3 text-[#BDC3C7] hover:bg-white/5 hover:text-white rounded-xl font-medium transition-colors cursor-pointer">
                        <span className="material-symbols-outlined">receipt_long</span>
                        Orders
                    </a>
                </nav>

                <div className="p-6 border-t border-white/10">
                    <div className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors">
                        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#BDC3C7]">person</span>
                        </div>
                        <div>
                            <p className="font-bold text-sm text-white">{user.username}</p>
                            <p className="text-xs text-[#BDC3C7] capitalize">{user.role}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="md:ml-64 min-h-screen">
                <header className="bg-white dark:bg-[#1A252F] border-b border-slate-200 dark:border-slate-800 p-6 sticky top-0 z-10 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-[#2C3E50] dark:text-white font-serif tracking-tight">Inventory Management</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage catalog, stock levels, and pricing.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center hidden gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                                <span className="material-symbols-outlined text-[18px]">download</span>
                                Export
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-[#E67E22] hover:bg-[#D35400] text-white rounded-lg text-sm font-bold transition-colors shadow-md shadow-[#E67E22]/20 active:scale-95">
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                Add Book
                            </button>
                        </div>
                    </div>
                </header>

                <div className="p-6">
                    {/* Controls */}
                    <div className="bg-white dark:bg-[#1A252F] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-[#E67E22]/20 focus:border-[#E67E22] outline-none text-slate-900 dark:text-slate-100 transition-all font-medium"
                                placeholder="Search inventory by title, author, or ISBN..."
                                type="text"
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                            <select className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium focus:ring-[#E67E22] focus:border-[#E67E22] outline-none text-slate-700 dark:text-slate-300 cursor-pointer shadow-sm min-w-[140px]">
                                <option>All Categories</option>
                                <option>Fiction</option>
                                <option>Non-Fiction</option>
                                <option>Science</option>
                            </select>
                            <select className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium focus:ring-[#E67E22] focus:border-[#E67E22] outline-none text-slate-700 dark:text-slate-300 cursor-pointer shadow-sm min-w-[140px]">
                                <option>Sort by: Newest</option>
                                <option>Stock: Low to High</option>
                                <option>Title: A-Z</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-[#1A252F] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                        <th className="px-6 py-4 uppercase tracking-wider text-xs">Book Details</th>
                                        <th className="px-6 py-4 uppercase tracking-wider text-xs">Category</th>
                                        <th className="px-6 py-4 uppercase tracking-wider text-xs">Price</th>
                                        <th className="px-6 py-4 uppercase tracking-wider text-xs">Stock</th>
                                        <th className="px-6 py-4 uppercase tracking-wider text-xs">Status</th>
                                        <th className="px-6 py-4 uppercase tracking-wider text-xs text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                                    {books.map((book) => (
                                        <tr key={book.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4 cursor-pointer">
                                                    <div className="h-12 w-8 bg-slate-200 dark:bg-slate-700 rounded flex-shrink-0 overflow-hidden shadow-sm">
                                                        <img className="h-full w-full object-cover" src={book.image_url ? book.image_url : (book.image ? `http://127.0.0.1:8000${book.image}` : "https://via.placeholder.com/32x48")} alt="" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white group-hover:text-[#E67E22] transition-colors font-serif">{book.title}</p>
                                                        <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                                                            {book.author}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                                                    {book.category_name || `Category ${book.category}`}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                                                ${book.price}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full ${book.stock > 10 ? 'bg-green-500' : book.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, (book.stock / 50) * 100)}%` }}></div>
                                                    </div>
                                                    <span className={`font-medium ${book.stock > 10 ? 'text-slate-700 dark:text-slate-300' : book.stock > 0 ? 'text-yellow-600 dark:text-yellow-500' : 'text-red-600 dark:text-red-500'}`}>{book.stock}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${book.stock > 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${book.stock > 0 ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                                    {book.stock > 0 ? 'Active' : 'Out of Stock'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 text-slate-400 hover:text-[#2980B9] hover:bg-[#2980B9]/10 rounded-lg transition-colors" title="Edit">
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </button>
                                                    <button className="p-2 text-slate-400 hover:text-[#E74C3C] hover:bg-[#E74C3C]/10 rounded-lg transition-colors" title="Delete">
                                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {books.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                                No books found in the inventory.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination Footer */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between text-sm">
                            <span className="text-slate-500 dark:text-slate-400">Showing <span className="font-bold text-slate-700 dark:text-slate-300">1</span> to <span className="font-bold text-slate-700 dark:text-slate-300">{books.length}</span> of <span className="font-bold text-slate-700 dark:text-slate-300">{books.length}</span> results</span>
                            <div className="flex gap-1">
                                <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-[#1A252F] hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm outline-none" disabled>Prev</button>
                                <button className="px-3 py-1.5 border border-[#E67E22] bg-[#E67E22] text-white rounded font-medium shadow-sm outline-none">1</button>
                                <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-[#1A252F] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm outline-none">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StaffInventory;
