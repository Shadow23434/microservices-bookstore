import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BOOKS_PER_PAGE = 18;

const Catalog = () => {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [sortBy, setSortBy] = useState('default');
    const [currentPage, setCurrentPage] = useState(1);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAddToCart = (book) => {
        if (!user) {
            navigate('/login', { state: { from: `/book/${book.id}` } });
            return;
        }
        alert(`Đã thêm "${book.title}" vào giỏ hàng!`);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookRes, catRes] = await Promise.all([
                    api.get('books/'),
                    api.get('categories/'),
                ]);
                setBooks(bookRes.data);
                setCategories(catRes.data);

                // Nếu URL có ?category=id thì pre-select category
                const catParam = searchParams.get('category');
                if (catParam) {
                    const found = catRes.data.find(c => String(c.id) === catParam);
                    if (found) setSelectedCategory(found);
                }
            } catch (err) {
                console.error('Error fetching catalog data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Reset về trang 1 khi filter/search thay đổi
    useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedCategory, sortBy]);

    const filteredBooks = useMemo(() => {
        let result = [...books];

        // Lọc theo category
        if (selectedCategory) {
            result = result.filter(b =>
                b.categories && b.categories.some(c => c.id === selectedCategory.id)
            );
        }

        // Tìm kiếm theo tên + tác giả
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(b =>
                b.title.toLowerCase().includes(q) ||
                b.author.toLowerCase().includes(q)
            );
        }

        // Sắp xếp
        if (sortBy === 'price_asc') result.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price_desc') result.sort((a, b) => b.price - a.price);
        else if (sortBy === 'title_asc') result.sort((a, b) => a.title.localeCompare(b.title));

        return result;
    }, [books, selectedCategory, searchQuery, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);
    const paginatedBooks = filteredBooks.slice(
        (currentPage - 1) * BOOKS_PER_PAGE,
        currentPage * BOOKS_PER_PAGE
    );

    const handleCategoryClick = (cat) => {
        setSelectedCategory(prev => prev?.id === cat.id ? null : cat);
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <span className="material-symbols-outlined animate-spin text-primary text-5xl">sync</span>
        </div>
    );

    return (
        <div className="w-full min-h-screen">
            {/* Page Header */}
            <div className="bg-primary/5 border-b border-primary/10 py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="text-sm text-primary font-semibold uppercase tracking-wider mb-1">Bookstore</p>
                            <h1 className="font-serif text-4xl font-black">Full Catalog</h1>
                            <p className="mt-2 text-slate-500">
                                {filteredBooks.length} sách{selectedCategory ? ` trong "${selectedCategory.type}"` : ''}
                                {searchQuery ? ` · kết quả cho "${searchQuery}"` : ''}
                            </p>
                        </div>

                        {/* Search bar */}
                        <div className="relative w-full sm:w-80">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">search</span>
                            <input
                                type="text"
                                placeholder="Tìm theo tên sách, tác giả..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm shadow-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <span className="material-symbols-outlined text-xl">close</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                {/* Filter Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                    {/* Category Pills */}
                    <div className="flex flex-wrap gap-2 flex-1">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200
                                ${!selectedCategory
                                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 scale-105'
                                    : 'bg-white border-primary/10 text-slate-600 hover:border-primary hover:text-primary'
                                }`}
                        >
                            Tất cả
                        </button>
                        {categories.map(c => (
                            <button
                                key={c.id}
                                onClick={() => handleCategoryClick(c)}
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200
                                    ${selectedCategory?.id === c.id
                                        ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 scale-105'
                                        : 'bg-white border-primary/10 text-slate-600 hover:border-primary hover:text-primary'
                                    }`}
                            >
                                {c.type}
                            </button>
                        ))}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="material-symbols-outlined text-slate-400 text-xl">sort</span>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="border border-primary/20 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-700 cursor-pointer"
                        >
                            <option value="default">Mặc định</option>
                            <option value="price_asc">Giá: Thấp → Cao</option>
                            <option value="price_desc">Giá: Cao → Thấp</option>
                            <option value="title_asc">Tên A → Z</option>
                        </select>
                    </div>
                </div>

                {/* Active Filters */}
                {(selectedCategory || searchQuery) && (
                    <div className="flex items-center gap-2 mb-6 flex-wrap">
                        <span className="text-sm text-slate-500">Đang lọc:</span>
                        {selectedCategory && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                                {selectedCategory.type}
                                <button onClick={() => setSelectedCategory(null)}>
                                    <span className="material-symbols-outlined text-sm leading-none">close</span>
                                </button>
                            </span>
                        )}
                        {searchQuery && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                                "{searchQuery}"
                                <button onClick={() => setSearchQuery('')}>
                                    <span className="material-symbols-outlined text-sm leading-none">close</span>
                                </button>
                            </span>
                        )}
                        <button
                            onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
                            className="text-xs text-slate-400 hover:text-primary transition-colors underline"
                        >
                            Xóa tất cả
                        </button>
                    </div>
                )}

                {/* Books Grid */}
                {paginatedBooks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                        <span className="material-symbols-outlined text-7xl mb-4">menu_book</span>
                        <p className="text-xl font-semibold">Không tìm thấy sách nào</p>
                        <p className="mt-2 text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                        <button
                            onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
                            className="mt-6 px-6 py-2 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
                        >
                            Xem tất cả sách
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                        {paginatedBooks.map(book => (
                            <div key={book.id} className="group flex flex-col gap-2">
                                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-slate-100 shadow-sm transition-all group-hover:-translate-y-1 group-hover:shadow-lg">
                                    {book.stock <= 5 && book.stock > 0 && (
                                        <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full z-10">Low Stock</span>
                                    )}
                                    {book.stock === 0 && (
                                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">Out of Stock</span>
                                    )}
                                    <div
                                        className="h-full w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                                        style={{
                                            backgroundImage: `url(${book.image_url
                                                ? book.image_url
                                                : book.image
                                                    ? `http://127.0.0.1:8000${book.image}`
                                                    : 'https://lh3.googleusercontent.com/aida-public/AB6AXuD67upij3uN-PlGOXtPFYQEXt4dF30PGStipdb8npUpbzV8lXwb1feJ7JXnPhnw3zHnk2PlNGH07NvaNnofzbR1f5SZoWQ74FTKeIkpIZABDXOkU2GVBEGJ8ASoGiKIGHGSPZN-GSDt7Spxxf4ihtIoVfMml6d-oQKd3w7Uhi0LCCRnchZNJvQbEWQ1CksgvytH12nWIjOX_L4IaM-F6cJxFCn-Knh7VJOVdyqI6JtRxEpyRExOI4oGSi5zG2rRh-j1k3XBCY7QhSVr'
                                                })`
                                        }}
                                    />
                                    <Link to={`/book/${book.id}`} className="absolute inset-0 z-0" />
                                    <button onClick={() => handleAddToCart(book)} className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-white/90 text-primary shadow-lg opacity-0 transition-all group-hover:opacity-100 flex items-center justify-center z-10 hover:bg-primary hover:text-white hover:scale-110">
                                        <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                                    </button>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors truncate">
                                        <Link to={`/book/${book.id}`}>{book.title}</Link>
                                    </h4>
                                    <p className="text-xs text-slate-500 truncate mt-0.5">{book.author}</p>
                                    {book.categories && book.categories.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {book.categories.slice(0, 1).map(cat => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => setSelectedCategory(cat)}
                                                    className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-full font-medium hover:bg-primary/20 transition-colors"
                                                >
                                                    {cat.type}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <div className="mt-1">
                                        <span className="font-bold text-primary text-sm">${book.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-14">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="h-9 w-9 rounded-full border border-primary/20 flex items-center justify-center hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <span className="material-symbols-outlined text-xl">chevron_left</span>
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`h-9 w-9 rounded-full text-sm font-semibold transition-all
                                    ${currentPage === page
                                        ? 'bg-primary text-white shadow-md shadow-primary/30'
                                        : 'border border-primary/20 hover:bg-primary/10 text-slate-600'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="h-9 w-9 rounded-full border border-primary/20 flex items-center justify-center hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <span className="material-symbols-outlined text-xl">chevron_right</span>
                        </button>
                    </div>
                )}

                {/* Back to Home */}
                <div className="text-center mt-8">
                    <Link to="/" className="text-sm text-slate-400 hover:text-primary transition-colors flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-base">arrow_back</span>
                        Quay lại trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Catalog;
