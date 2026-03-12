import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Checkout = () => {
    const navigate = useNavigate();
    // Static state to match the HTML prototype
    const [cartItems] = useState([
        {
            id: 1,
            title: "The Great Gatsby",
            format: "Hardcover Edition",
            price: 18.99,
            quantity: 1,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnlqeMEyTGfiLfO5L_0VsLMSNVCPndOFTBli0q0PPHIS2yJpc1k425i9YUod1EXP5s2AOZu9EgAXlnnSJKDJTad2MmDz7fB0Dpqvyxgdh0co7nZa8UGEDLXIW_O340CtnlCzqWh1kdAXGUC3vYAdQ8SoAs8o6YafSeCd_8uwordg1YEe8_Ayev-ULm5s9YfwaQ1mogyEDQhatoDO0Webv9qIX8TIx1tGq4fTV_qp-CMYAMNxzbqO7kOByErgJWRo1hWRgfTv4_WV5x"
        },
        {
            id: 2,
            title: "Deep Ocean Stories",
            format: "Paperback",
            price: 32.00,
            quantity: 2,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnw1qwuGP7xBxm-TZf58IrpcNElw67Z1gnumxMT_NEDI-kGZs-kDFIKAWhfI1evngMuftownM8NAYMMaXTFpJC_kShm1z6K2FQ9vUzTrDhxZ--2kxq3miAlwYozr_BL9ZMSwjzXAd_rjXyK7YlN94nSlOVxlWz8T0HNucsafcRBmHaf6fUI9N3lcLIG80nwecl0QCb9OkyNDlTMGzMExaG18d4y09RkGvY_W12vzx4JY29NKeKVxdnsJD119ATAmHUgk2Q3wnxBFX9"
        }
    ]);

    const [paymentMethod, setPaymentMethod] = useState('credit_card');

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = 0; // FREE
    const taxes = subtotal * 0.08; // ~8% estimated tax
    const total = subtotal + shipping + taxes;

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        alert('Order placed successfully! Redirecting...');
        navigate('/orders');
    };

    return (
        <div className="px-6 md:px-20 py-8 max-w-7xl mx-auto w-full">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-6">
                <Link to="/" className="text-primary text-sm font-medium hover:underline">Home</Link>
                <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
                <Link to="/cart" className="text-primary text-sm font-medium hover:underline">Cart</Link>
                <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
                <span className="text-slate-500 text-sm font-medium">Checkout</span>
            </div>

            <div className="mb-8">
                <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-extrabold tracking-tight font-serif">Checkout</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Almost there! Review your items and complete your purchase.</p>
            </div>

            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Forms */}
                <div className="lg:col-span-7 space-y-10">

                    {/* Shipping Section */}
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-symbols-outlined text-primary">local_shipping</span>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-serif">Shipping Address</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                                <input required className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary focus:border-primary px-4 py-3 outline-none" placeholder="John Doe" type="text" />
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Street Address</label>
                                <input required className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary focus:border-primary px-4 py-3 outline-none" placeholder="123 Cozy Lane" type="text" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">City</label>
                                <input required className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary focus:border-primary px-4 py-3 outline-none" placeholder="New York" type="text" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">ZIP Code</label>
                                <input required className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary focus:border-primary px-4 py-3 outline-none" placeholder="10001" type="text" />
                            </div>
                        </div>
                    </section>

                    <hr className="border-primary/10" />

                    {/* Payment Section */}
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-symbols-outlined text-primary">payments</span>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-serif">Payment Method</h2>
                        </div>
                        <div className="space-y-4">
                            {/* Option 1: Credit Card */}
                            <label className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === 'credit_card' ? 'border-primary bg-primary/5' : 'border-transparent bg-white dark:bg-slate-900/50 hover:bg-slate-50'}`}>
                                <input
                                    className="text-primary focus:ring-primary h-4 w-4"
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === 'credit_card'}
                                    onChange={() => setPaymentMethod('credit_card')}
                                />
                                <div className="ml-4 flex items-center justify-between w-full">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900 dark:text-slate-100">Credit Card</span>
                                        <span className="text-xs text-slate-500">Pay securely with your Visa, Mastercard or Amex</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="material-symbols-outlined text-slate-400">credit_card</span>
                                    </div>
                                </div>
                            </label>

                            {/* Credit Card Form (Visible when selected) */}
                            {paymentMethod === 'credit_card' && (
                                <div className="grid grid-cols-2 gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/50">
                                    <div className="flex flex-col gap-2 col-span-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Card Number</label>
                                        <input required className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary focus:border-primary px-4 py-3 outline-none" placeholder="0000 0000 0000 0000" type="text" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Expiry Date</label>
                                        <input required className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary focus:border-primary px-4 py-3 outline-none" placeholder="MM/YY" type="text" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">CVV</label>
                                        <input required className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary focus:border-primary px-4 py-3 outline-none" placeholder="***" type="password" />
                                    </div>
                                </div>
                            )}

                            {/* Option 2: PayPal */}
                            <label className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'paypal' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                                <input
                                    className="text-primary focus:ring-primary h-4 w-4"
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === 'paypal'}
                                    onChange={() => setPaymentMethod('paypal')}
                                />
                                <div className="ml-4 flex items-center justify-between w-full">
                                    <span className="font-bold text-slate-900 dark:text-slate-100">PayPal</span>
                                    <span className="material-symbols-outlined text-slate-400">account_balance_wallet</span>
                                </div>
                            </label>

                            {/* Option 3: COD */}
                            <label className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                                <input
                                    className="text-primary focus:ring-primary h-4 w-4"
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === 'cod'}
                                    onChange={() => setPaymentMethod('cod')}
                                />
                                <div className="ml-4 flex items-center justify-between w-full">
                                    <span className="font-bold text-slate-900 dark:text-slate-100">Cash on Delivery</span>
                                    <span className="material-symbols-outlined text-slate-400">handshake</span>
                                </div>
                            </label>
                        </div>
                    </section>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-5">
                    <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-primary/10 shadow-xl shadow-primary/5">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 font-serif">Order Summary</h2>

                        {/* Book Items */}
                        <div className="space-y-4 mb-8">
                            {cartItems.map((item, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="h-20 w-16 bg-primary/10 rounded overflow-hidden flex-shrink-0">
                                        <img className="h-full w-full object-cover" src={item.image} alt={item.title} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm font-serif">{item.title}</h4>
                                        <p className="text-xs text-slate-500">{item.format}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-xs font-semibold">Qty: {item.quantity}</span>
                                            <span className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                <span>Shipping</span>
                                <span className="text-green-600 font-medium">FREE</span>
                            </div>
                            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                <span>Taxes</span>
                                <span>${taxes.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">Total</span>
                                <span className="text-3xl font-black text-primary">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button type="submit" className="w-full mt-8 bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group active:scale-95 disabled:bg-slate-300">
                            <span>Place Order</span>
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                        <p className="text-[10px] text-center text-slate-400 mt-4 px-4 uppercase tracking-widest font-semibold">
                            Secure checkout powered by WarmBooks Pay
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Checkout;
