import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAddToCart = (book) => {
        if (!user) {
            navigate('/login', { state: { from: `/book/${book.id}` } });
            return;
        }
        // TODO: gọi API add to cart
        alert(`Đã thêm "${book.title}" vào giỏ hàng!`);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bookRes = await api.get('books/');
                setBooks(bookRes.data);
                const catRes = await api.get('categories/');
                setCategories(catRes.data);
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Lọc sách theo category đang chọn
    const filteredBooks = selectedCategory
        ? books.filter(book =>
            book.categories && book.categories.some(c => c.id === selectedCategory.id)
        )
        : books;

    const handleCategoryClick = (cat) => {
        // Click lại category đang chọn => bỏ lọc
        setSelectedCategory(prev => prev?.id === cat.id ? null : cat);
    };

    if (loading) return (
        <div className="flex justify-center mt-20">
            <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
        </div>
    );

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                        <div className="flex flex-col gap-8 order-2 lg:order-1">
                            <div>
                                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                                    Book of the Month
                                </span>
                                <h1 className="mt-4 text-5xl font-black leading-tight tracking-tight lg:text-7xl font-serif">
                                    The Midnight <span className="text-primary tracking-normal">Library</span>
                                </h1>
                                <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
                                    Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <button className="rounded-xl bg-primary px-8 py-4 text-lg font-bold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-1 hover:shadow-xl active:scale-95">
                                    Shop Now
                                </button>
                                <button className="rounded-xl border border-primary/20 bg-white dark:bg-slate-900 px-8 py-4 text-lg font-bold text-primary transition-colors hover:bg-primary/5">
                                    Learn More
                                </button>
                            </div>
                            <div className="flex items-center gap-4 pt-4">
                                <div className="flex -space-x-2">
                                    <div className="h-10 w-10 rounded-full border-2 border-white bg-slate-200 bg-cover" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAbzsTyDN_q0UdpHG2W5c5vNQFxqBAPVDLFAMezehly-xOKU9B2-5lMrCZctu-rh0pfu3oGhyrNCmqoQRvIRqya1ISGXQ57KGw8YM-4v9doxbYisXXHov3qZjkbTIucJcFOgqMI9hUUZ28MUJiKmZ6BxLUgygIAAGBZBqCozXOsgN28NSOMeXoR_RWq-_S6TCqIpo_xlj12BGgU6Ji_GByWIvJDes0-Gpw8RbdWeyh7LjLEziJ5p9zm4I_d4GSNtQLqZEcjAT0dAdKG')" }}></div>
                                    <div className="h-10 w-10 rounded-full border-2 border-white bg-slate-200 bg-cover" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC_4Vt0fP0cnu-7NUvEEOetG3BxETtyp3rgdtHqpKUluqsBWestxWNf3-D2FAHtL-rj277v-aIFgWFUamCggnHLtnX-ZVBs3I6RM9xfpSAbilHHKEN6ws8FF7E5Wz8yqv0ZAk2ypoDUwxaz2zkHF7zM5V6e0lVynXB_GzripPJvQnxkCKxMhqDmTqguuIKCfrR1LEJUz5L_EPOCsqjfr_qvbDHT0LHAQcfZuW8bu4rh9KrVD5GrlcDjv3H49ry0KykIzJtIGEpL7qJ9')" }}></div>
                                    <div className="h-10 w-10 rounded-full border-2 border-white bg-slate-200 bg-cover" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBfKB5j_wuzqg3ZdzilssDp7uqNh52F1XLLd9a_U3dgApbWARpjhvC5PteH0CoJs2JyqZfYFhVTpa2tsDlMSFKiTTH0ryyFa_xdl0CelxadO2l7ks1_D1KPPfSOjhpkHnnfMZUf0APdqo2QdhGrZ1d1b9IvnvpX0meGl1vDhQk4yKNVZNFPgyKwy-MBI7OVBk38VsG492llhD79lfCENlW8rTNChktuj-8e9SPR7mKbBAD7_G420Mv5H8UolUZ2lMvoXIL1hFA27mLd')" }}></div>
                                </div>
                                <p className="text-sm font-medium text-slate-500">Joined by 12,000+ readers this month</p>
                            </div>
                        </div>
                        <div className="relative order-1 lg:order-2 flex justify-center">
                            <div className="aspect-[3/4] w-full max-w-[400px] overflow-hidden rounded-2xl shadow-2xl rotate-3 transition-transform hover:rotate-0">
                                <div className="h-full w-full bg-primary/20 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDpT06my-7aGTEEy4jzkIVihEmTYctimHwYzqKz729y4md0AI0EErETRFcopJE-eeIY84uceVf5MQzkqT3f3biCeupvUOM2iDQH_VZ1j9DQT-bRLfgIYYYU1a-qiMrQdoQZGpwzzqd-sPUCgHuUkpjQB2rJOQMbKvCSAkJgIkcVV7JV9lfvhNzKfLjfeR7AUUMf5QC5PLdqR2ZWLq_F10R7fChQUowh8m8__lekuyvciy199xrOoTRtTDBbORmTfJmqCC3t4o6rgFC8')" }}></div>
                            </div>
                            <div className="absolute -bottom-6 -left-2 h-32 w-32 rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-xl hidden sm:block -rotate-6">
                                <p className="text-xs font-bold text-primary">FEATURED AUTHOR</p>
                                <p className="text-sm font-black mt-1">Matt Haig</p>
                                <div className="mt-2 flex text-yellow-400">
                                    <span className="material-symbols-outlined text-sm fill-current">star</span>
                                    <span className="material-symbols-outlined text-sm fill-current">star</span>
                                    <span className="material-symbols-outlined text-sm fill-current">star</span>
                                    <span className="material-symbols-outlined text-sm fill-current">star</span>
                                    <span className="material-symbols-outlined text-sm fill-current">star</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Tags Section */}
            <section className="py-8 border-t border-primary/5">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2 text-slate-700">
                        <span className="material-symbols-outlined text-primary text-xl">category</span>
                        Browse By Category
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {/* Nút "Tất cả" */}
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 shadow-sm
                                ${selectedCategory === null
                                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/30 scale-105'
                                    : 'bg-white dark:bg-slate-900 border-primary/10 text-slate-700 hover:border-primary hover:text-primary'
                                }`}
                        >
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-base leading-none">apps</span>
                                Tất cả
                            </span>
                        </button>

                        {categories.map(c => (
                            <button
                                key={c.id}
                                onClick={() => handleCategoryClick(c)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 shadow-sm
                                    ${selectedCategory?.id === c.id
                                        ? 'bg-primary text-white border-primary shadow-md shadow-primary/30 scale-105'
                                        : 'bg-white dark:bg-slate-900 border-primary/10 text-slate-700 hover:border-primary hover:text-primary'
                                    }`}
                            >
                                {c.type}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* All Books Grid - có filter theo category */}
            <section className="py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="font-serif text-3xl font-bold">Explore Our Catalog</h2>
                            {selectedCategory && (
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="text-sm text-slate-500">Đang lọc theo:</span>
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                                        {selectedCategory.type}
                                        <button
                                            onClick={() => setSelectedCategory(null)}
                                            className="ml-1 hover:text-primary/60 transition-colors"
                                            title="Bỏ lọc"
                                        >
                                            <span className="material-symbols-outlined text-base leading-none">close</span>
                                        </button>
                                    </span>
                                    <span className="text-sm text-slate-400">({filteredBooks.length} sách)</span>
                                </div>
                            )}
                        </div>
                        {selectedCategory ? (
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="text-sm text-slate-500 hover:text-primary transition-colors flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-base">filter_alt_off</span>
                                Xem tất cả
                            </button>
                        ) : (
                            <Link
                                to="/catalog"
                                className="text-primary font-semibold hover:underline flex items-center gap-1 text-sm"
                            >
                                View All
                                <span className="material-symbols-outlined text-base">arrow_forward</span>
                            </Link>
                        )}
                    </div>

                    {filteredBooks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <span className="material-symbols-outlined text-6xl mb-4">menu_book</span>
                            <p className="text-lg font-semibold">Không có sách nào trong thể loại này</p>
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="mt-4 px-6 py-2 rounded-full bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
                            >
                                Xem tất cả sách
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {filteredBooks.map(book => (
                                <div key={book.id} className="group flex flex-col gap-2">
                                    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-slate-100 shadow-sm transition-all group-hover:-translate-y-1 group-hover:shadow-md">
                                        {book.stock <= 5 && book.stock > 0 && <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full z-10">Low Stock</span>}
                                        {book.stock === 0 && <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">Out of Stock</span>}

                                        <div
                                            className="h-full w-full bg-cover bg-center"
                                            style={{ backgroundImage: `url(${book.image_url ? book.image_url : (book.image ? `http://127.0.0.1:8000${book.image}` : 'https://lh3.googleusercontent.com/aida-public/AB6AXuD67upij3uN-PlGOXtPFYQEXt4dF30PGStipdb8npUpbzV8lXwb1feJ7JXnPhnw3zHnk2PlNGH07NvaNnofzbR1f5SZoWQ74FTKeIkpIZABDXOkU2GVBEGJ8ASoGiKIGHGSPZN-GSDt7Spxxf4ihtIoVfMml6d-oQKd3w7Uhi0LCCRnchZNJvQbEWQ1CksgvytH12nWIjOX_L4IaM-F6cJxFCn-Knh7VJOVdyqI6JtRxEpyRExOI4oGSi5zG2rRh-j1k3XBCY7QhSVr')})` }}>
                                        </div>
                                        <Link to={`/book/${book.id}`} className="absolute inset-0 z-0"></Link>
                                        <button onClick={() => handleAddToCart(book)} className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-white/90 text-primary shadow-lg opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center z-10 hover:bg-primary hover:text-white">
                                            <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                                        </button>
                                    </div>
                                    <div className="mt-2">
                                        <h4 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors truncate">
                                            <Link to={`/book/${book.id}`}>{book.title}</Link>
                                        </h4>
                                        <p className="text-xs text-slate-500 truncate mt-0.5">{book.author}</p>
                                        {/* Hiển thị category tags nhỏ */}
                                        {book.categories && book.categories.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {book.categories.slice(0, 1).map(cat => (
                                                    <span key={cat.id} className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                                                        {cat.type}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <div className="mt-1 flex items-center justify-between">
                                            <span className="font-bold text-primary text-sm">${book.price}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Recommended Section (Integration from DB Books) */}
            <section className="bg-primary/5 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h2 className="font-serif text-3xl font-bold tracking-tight">Recommended for You</h2>
                            <p className="mt-2 text-slate-600 dark:text-slate-400">Based on your recent reads and similar readers' interests.</p>
                        </div>
                        <a href="#" className="text-primary font-semibold hover:underline flex items-center gap-1">
                            View All <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </a>
                    </div>

                    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
                        {books.length > 0 ? books.slice(0, 5).map(book => (
                            <div key={book.id} className="group flex flex-col gap-3">
                                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-slate-200 shadow-sm transition-all group-hover:-translate-y-1 group-hover:shadow-md">
                                    <div
                                        className="h-full w-full bg-cover bg-center"
                                        style={{ backgroundImage: `url(${book.image_url ? book.image_url : (book.image ? `http://127.0.0.1:8000${book.image}` : 'https://lh3.googleusercontent.com/aida-public/AB6AXuBROKQNhRJTXKAywRTPANpvKqnLbjXwTfjkZ6hu0e7H5GMOaAOEsismH52NcQ75p2KnvJ09Nn45mdmRVPwsHg7TF_ZRcB7QFQpLZC0DhBvC5YWCJDyTg7_NkrJz1M_M-Qf7MJSyzYYTdpoN05YyWjBRPdJflI0IREhQ183XdpNOaaRvjtNydmTa3Qr55r9H61mfisg0I0r275-TLQ5Zowsvm8NeW7TNQ90m85VbcEWuQa9vHT8ck-B0nXoF6F5PkQVyNON2K_Cx30FJ')})` }}>
                                    </div>
                                    <Link to={`/book/${book.id}`} className="absolute inset-0 z-0"></Link>
                                    <button onClick={() => handleAddToCart(book)} className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-white text-primary shadow-lg opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center z-10 hover:bg-primary hover:text-white">
                                        <span className="material-symbols-outlined">add_shopping_cart</span>
                                    </button>
                                </div>
                                <div>
                                    <h3 className="font-bold leading-tight group-hover:text-primary transition-colors truncate">
                                        <Link to={`/book/${book.id}`}>{book.title}</Link>
                                    </h3>
                                    <p className="text-sm text-slate-500 truncate">{book.author}</p>
                                    <div className="mt-1 flex items-center gap-2 text-md font-bold text-primary">
                                        <span>${book.price}</span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="col-span-full text-slate-500">No books available at the moment.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl rounded-3xl bg-primary px-8 py-12 text-center text-white lg:py-20 overflow-hidden relative shadow-2xl">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                    <h2 className="font-serif text-3xl font-black md:text-5xl lg:mx-auto lg:max-w-2xl relative z-10">
                        Join our Book Club and get 20% off your first order
                    </h2>
                    <p className="mx-auto mt-6 max-w-lg text-white/80 relative z-10">
                        Stay updated with our weekly newsletters featuring new arrivals, exclusive discounts, and hand-picked recommendations.
                    </p>
                    <div className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row relative z-10">
                        <input className="w-full rounded-xl border-0 px-4 py-3 text-slate-900 focus:ring-2 focus:ring-white outline-none shadow-inner" placeholder="Enter your email" type="email" />
                        <button className="rounded-xl bg-white px-8 py-3 font-bold text-primary transition-colors hover:bg-white/90 shadow-lg active:scale-95">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
