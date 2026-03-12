import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await api.get(`books/${id}/`);
                setBook(response.data);
            } catch (error) {
                console.error("Error fetching book details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    const requireLogin = () => {
        // Lưu trang hiện tại để redirect lại sau khi đăng nhập
        navigate('/login', { state: { from: `/book/${id}` } });
    };

    const handleAddToCart = () => {
        if (!user) { requireLogin(); return; }
        // TODO: gọi API add to cart
        alert('Đã thêm vào giỏ hàng!');
    };

    const handleBuyNow = () => {
        if (!user) { requireLogin(); return; }
        // TODO: navigate to checkout
        navigate('/checkout');
    };

    if (loading) return (
        <div className="flex justify-center mt-20">
            <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
        </div>
    );

    if (!book) return <div className="text-center mt-20 font-bold text-slate-500 text-xl">Book not found</div>;

    return (
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-20 py-8">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm mb-8 text-primary/70">
                <Link to="/" className="hover:underline">Home</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="hover:underline cursor-pointer">{book.category_name || 'Category'}</span>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-slate-900 font-medium">{book.title}</span>
            </nav>

            {/* Book Main Info */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                {/* Left: Cover */}
                <div className="md:col-span-5 lg:col-span-4">
                    <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl bg-primary/5 border border-primary/10 relative">
                        {book.stock <= 5 && book.stock > 0 && <span className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full z-10 shadow-sm">Low Stock</span>}
                        {book.stock === 0 && <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-sm">Out of Stock</span>}

                        <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${book.image_url ? book.image_url : (book.image ? `http://127.0.0.1:8000${book.image}` : 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmDgtShG0n_DJ7K4a5pPQ3Libgy0zB09c7kq8bH4_Jj9dDOEo-p3PVTM0kgGpcrJ0mQ74_HcKIuAbtF5Od0O72Ngpbhwxc4dCToKTtBJmmV48pUU7KyOCU4J455JuWY7SbZu_wPhrPPAjQ6WML_WNrACKcy1dGMPrwDC5WiRvwW4ENuQJfCXUyJ9S45nw1jTu1QHVlIKPXGQ2A3uqr8Yf3wvu9KcZduBpwHCNUpDlbeyroflbY7BXjGIIQumBUTBSTPvMCzCsrsQuI')})` }}>
                        </div>
                    </div>
                </div>

                {/* Right: Details */}
                <div className="md:col-span-7 lg:col-span-8 flex flex-col pt-2">
                    <div className="mb-6">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider mb-4 inline-block">Best Seller</span>
                        <h1 className="font-serif text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-2">{book.title}</h1>
                        <p className="text-xl text-primary font-medium">by <span className="hover:underline cursor-pointer">{book.author}</span></p>
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex text-primary">
                            <span className="material-symbols-outlined !text-xl">star</span>
                            <span className="material-symbols-outlined !text-xl">star</span>
                            <span className="material-symbols-outlined !text-xl">star</span>
                            <span className="material-symbols-outlined !text-xl">star</span>
                            <span className="material-symbols-outlined !text-xl">star_half</span>
                        </div>
                        <span className="text-slate-900 font-bold">4.8</span>
                        <span className="text-primary/60 text-sm">(15,420 Reviews)</span>
                    </div>

                    <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-primary/5">
                        <p className="text-4xl font-black text-slate-900 mb-6">${book.price}</p>

                        {/* Login prompt nếu chưa đăng nhập */}
                        {!user && (
                            <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl text-sm text-slate-600">
                                <span className="material-symbols-outlined text-primary text-lg">info</span>
                                Vui lòng{' '}
                                <Link to="/login" state={{ from: `/book/${id}` }} className="text-primary font-semibold hover:underline">
                                    đăng nhập
                                </Link>
                                {' '}để thêm vào giỏ hàng hoặc mua ngay.
                            </div>
                        )}

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={book.stock === 0}
                                className="flex-1 min-w-[160px] bg-primary text-white font-bold py-4 px-8 rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 disabled:bg-slate-300 disabled:shadow-none disabled:active:scale-100"
                            >
                                <span className="material-symbols-outlined">add_shopping_cart</span>
                                {book.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={book.stock === 0}
                                className="flex-1 min-w-[160px] bg-slate-900 text-white font-bold py-4 px-8 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:bg-slate-300 disabled:active:scale-100"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-primary/10 pt-8 mb-8">
                        <h3 className="font-bold text-slate-900 text-xl mb-4">Description</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg whitespace-pre-line">
                            {book.description || `Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices...
                            
                            A dazzling novel about all the choices that go into a life well lived.`}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-primary/5 p-6 rounded-xl">
                        <div>
                            <p className="text-xs font-bold text-primary/60 uppercase mb-1">Stock Left</p>
                            <p className="text-sm font-semibold text-slate-900">{book.stock} units</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-primary/60 uppercase mb-1">Publisher</p>
                            <p className="text-sm font-semibold text-slate-900">{book.publisher || 'LazaBook Press'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-primary/60 uppercase mb-1">Added On</p>
                            <p className="text-sm font-semibold text-slate-900">{new Date(book.created_at || Date.now()).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-primary/60 uppercase mb-1">Format</p>
                            <p className="text-sm font-semibold text-slate-900">Hardcover</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section Implementation Omitted for Brevity (static) */}
        </div>
    );
};

export default BookDetail;


