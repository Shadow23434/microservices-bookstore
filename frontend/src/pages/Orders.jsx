import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Orders = () => {
    const { user } = useAuth();

    // Static state to match the prototype look
    const [orders] = useState([
        {
            id: 'ORD-2023-8942',
            date: 'Oct 24, 2023',
            status: 'Delivered',
            total: 42.50,
            items: [
                { title: 'The Midnight Library', qty: 1, image: 'https://lh3.googleusercontent.com/aida-public/AHeAcaCpxO3pYv0P2vUaA64QfX0GZQ2U8bW_I0rM-hA4p2S6yVd2n9Z_M5q6E6j5O7l7o8Hw1-hB7y7K2H8G9Z9I-C2C', author: 'Matt Haig' }
            ]
        },
        {
            id: 'ORD-2023-7711',
            date: 'Sep 12, 2023',
            status: 'Processing',
            total: 105.00,
            items: [
                { title: 'Dune', qty: 1, image: 'https://lh3.googleusercontent.com/aida-public/AHeAcaD5_O_Z_M6J7L8R-tZ2C-rK8V8X9N_J-nB8A8Z2O9B5C9Z-oO-kK8Z_X6J9L8O5', author: 'Frank Herbert' },
                { title: 'Foundation', qty: 2, image: 'https://lh3.googleusercontent.com/aida-public/AHeAcaB_O_Z-C2L_K8R9X0N9VZ-kK8H_J-nA8B5J2Z2N-oO_K6J_N8A5K2', author: 'Isaac Asimov' }
            ]
        }
    ]);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">lock</span>
                <h2 className="text-2xl font-bold mb-4 font-serif">Please log in to view orders</h2>
                <Link to="/login" className="px-6 py-2 bg-primary text-white font-bold rounded-lg">Login</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-primary/10 text-center sticky top-24">
                        <div className="h-20 w-20 bg-primary/20 text-primary mx-auto rounded-full flex items-center justify-center font-bold text-3xl mb-4 shadow-inner">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">{user.full_name || user.username}</h2>
                        <p className="text-sm text-slate-500 mb-6">{user.email}</p>

                        <div className="flex flex-col gap-2">
                            <Link to="/profile" className="px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors text-left flex items-center gap-3">
                                <span className="material-symbols-outlined text-[20px]">person</span>
                                Profile Info
                            </Link>
                            <Link to="/orders" className="px-4 py-3 rounded-xl text-sm font-semibold bg-primary/10 text-primary transition-colors text-left flex items-center gap-3">
                                <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                                My Orders
                            </Link>
                            <Link to="/wishlist" className="px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors text-left flex items-center gap-3">
                                <span className="material-symbols-outlined text-[20px]">favorite</span>
                                Wishlist
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-8 font-serif">Order History</h1>

                    {orders.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-primary/10 shadow-sm">
                            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">receipt_long</span>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No orders found</h3>
                            <p className="text-slate-500 mb-6">You haven't placed any orders yet.</p>
                            <Link to="/" className="inline-block px-6 py-2 bg-primary text-white font-bold rounded-lg">Start Shopping</Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-primary/5 flex flex-wrap justify-between items-center gap-4">
                                        <div className="flex gap-8">
                                            <div>
                                                <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Order Placed</p>
                                                <p className="text-sm font-semibold text-slate-900">{order.date}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Total</p>
                                                <p className="text-sm font-semibold text-slate-900">${order.total.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Order #</p>
                                                <p className="text-sm font-semibold text-primary">{order.id}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="flex gap-4 mb-4 last:mb-0">
                                                <div className="w-16 h-24 bg-slate-200 rounded overflow-hidden flex-shrink-0">
                                                    {/* In a real app we'd map the correct image. This uses the prototype static */}
                                                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDpT06my-7aGTEEy4jzkIVihEmTYctimHwYzqKz729y4md0AI0EErETRFcopJE-eeIY84uceVf5MQzkqT3f3biCeupvUOM2iDQH_VZ1j9DQT-bRLfgIYYYU1a-qiMrQdoQZGpwzzqd-sPUCgHuUkpjQB2rJOQMbKvCSAkJgIkcVV7JV9lfvhNzKfLjfeR7AUUMf5QC5PLdqR2ZWLq_F10R7fChQUowh8m8__lekuyvciy199xrOoTRtTDBbORmTfJmqCC3t4o6rgFC8')" }}></div>
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <h4 className="font-bold text-slate-900 font-serif text-lg">{item.title}</h4>
                                                    <p className="text-sm text-slate-500">{item.author}</p>
                                                    <p className="text-sm text-slate-500 mt-1">Qty: {item.qty}</p>
                                                </div>
                                                <div className="flex flex-col justify-center gap-2">
                                                    <button className="text-sm font-semibold text-primary hover:underline bg-primary/5 px-4 py-2 rounded-lg">Buy it again</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Orders;
