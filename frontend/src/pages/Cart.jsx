import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
    // Static state to match the user's HTML prototype
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            title: "The Alchemist",
            author: "Paulo Coelho",
            price: 15.00,
            quantity: 1,
            format: "Hardcover",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ3UzDb9R31ZQf_N2nui6K5fk7WBDw9DATut1s4Il40D-BjCFrKaVyFgMF1JJA4PtAAXFbz0LorrM3JszMFBJhX7LPzbhkIoXOgCjQjbCjeEU9FEkMxFKQ8ULa74kxBHVOktAlZTjaj9jRSNroiPRjC_NwG2iolVTu0GfY-g4MROYv2qQzuMJ1Se0x09f4TG0D9YVhNY7bT9YaAnF3ICet4LfQkcCo__QCOr-bSPsQ9R4aKkTGKBc3VhvFdDwfYICG0APg5Y1S1C95"
        },
        {
            id: 2,
            title: "Atomic Habits",
            author: "James Clear",
            price: 20.00,
            quantity: 1,
            format: "Paperback",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAT2rpmuUttie9o4tK9oQ0OpJPRzBozVwyj8u4b4TPHvfJvi0WlSEMnixQectzzDSciZAop4QC-SA7xi3JdpH6AO8JvlN3RUIdrujwKTI0PdK6Y35COADDdfusczFo5Sz_FuDCEM6zD_sewQENDDn7JvMielDEstethl35OKeQMvH3Ve-v3bPM8xui6IoMyAzQIyUeuPDMu8F8FOVtFPweZrKVzERuL2fwyO-4vtOVOPzPKI8OSCJcpnipZ8uXYwHzTXDJN8F8nk_tZ"
        },
        {
            id: 3,
            title: "Where the Crawdads Sing",
            author: "Delia Owens",
            price: 18.50,
            quantity: 1,
            format: "Hardcover",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcfpKCumRybKPWrlVtBDnbwSBvlLa2M-kqF1ixGm8KOwRtrIU6cJoNoH9CC_QyMKNYedENpekjZv1V_M0M8YlSSJbcrcGyunXXrE6JL8-FfJ3qTawcKy24KAbYfQEA3_o-I3S4a-ocOQKUMMF-Y_fZy9IJ3z8DJ_LefySU6ohxOJ5X01XwHTMa7OlSrhr2G9qcc-q9yN0_oZt5h8QEmcXG8d2JSPQ5hNdX1G2IHCUkWqIOjHkp-z5xn3yfnpFMdJBGREUE9Qw1VXb-"
        }
    ]);

    const updateQuantity = (id, change) => {
        setCartItems(cartItems.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(1, item.quantity + change);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = cartItems.length > 0 ? 4.99 : 0;
    const taxes = subtotal * 0.05; // ~5% estimated tax
    const total = subtotal + shipping + taxes;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-10">
                <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100 font-serif">Shopping Cart</h2>
                <p className="text-primary/70 font-medium mt-2">{cartItems.length} carefully selected stories await you</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Items List */}
                <div className="flex-grow space-y-6">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-primary/5">
                            <div className="w-24 h-36 flex-shrink-0 overflow-hidden rounded-lg shadow-md border border-primary/10">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-grow">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-serif">{item.title}</h3>
                                <p className="text-primary/80 text-sm italic mb-4">{item.author}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded">{item.format}</span>
                                    <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded">In Stock</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                <div className="flex items-center gap-3 bg-primary/5 rounded-lg p-1 border border-primary/10">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-primary/10 rounded transition-colors text-primary outline-none">
                                        <span className="material-symbols-outlined text-sm">remove</span>
                                    </button>
                                    <span className="w-6 text-center font-bold text-slate-700 dark:text-slate-300">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-primary/10 rounded transition-colors text-primary outline-none">
                                        <span className="material-symbols-outlined text-sm">add</span>
                                    </button>
                                </div>

                                <div className="text-right">
                                    <p className="text-xl font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                                    <button onClick={() => removeItem(item.id)} className="text-xs text-red-500 hover:text-red-600 font-medium underline underline-offset-4 mt-1">Remove</button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {cartItems.length === 0 && (
                        <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-primary/5">
                            <span className="material-symbols-outlined text-6xl text-primary/30 mb-4 block">shopping_cart_off</span>
                            <h3 className="text-xl font-bold text-slate-700 mb-2">Your cart is empty</h3>
                            <p className="text-slate-500 mb-6">Looks like you haven't made your choice yet.</p>
                            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-sm hover:bg-primary-dark">
                                Start Shopping
                            </Link>
                        </div>
                    )}

                    {cartItems.length > 0 && (
                        <Link to="/" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all mt-4">
                            <span className="material-symbols-outlined">arrow_back</span>
                            Continue Browsing
                        </Link>
                    )}
                </div>

                {/* Summary Sidebar */}
                <div className="lg:w-96 flex-shrink-0">
                    <div className="sticky top-28 p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-primary/10">
                        <h3 className="text-2xl font-bold mb-8 pb-4 border-b border-primary/10 font-serif">Order Summary</h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                <span>Subtotal ({cartItems.reduce((a, b) => a + b.quantity, 0)} items)</span>
                                <span className="font-semibold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                <span>Standard Shipping</span>
                                <span className="font-semibold text-slate-900 dark:text-white">${shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                <span>Tax Estimate</span>
                                <span className="font-semibold text-slate-900 dark:text-white">${taxes.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mb-8 pt-6 border-t border-primary/20">
                            <div className="flex justify-between items-baseline mb-2">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-3xl font-black text-primary">${total.toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-slate-500">Shipping costs calculated at checkout</p>
                        </div>

                        <div className="space-y-4">
                            <button className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-2 active:scale-95 disabled:bg-slate-300 disabled:active:scale-100" disabled={cartItems.length === 0}>
                                <span className="material-symbols-outlined text-[20px]">lock</span>
                                Proceed to Checkout
                            </button>

                            <div className="relative py-2 mt-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-primary/10"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white dark:bg-slate-900 px-2 text-slate-400 font-bold">Accepted Cards</span>
                                </div>
                            </div>

                            <div className="flex justify-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all mt-4">
                                <span className="material-symbols-outlined text-3xl">credit_card</span>
                                <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
                                <span className="material-symbols-outlined text-3xl">payments</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
