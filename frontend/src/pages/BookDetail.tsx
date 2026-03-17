import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Heart, Share2, ShoppingCart, Truck, ShieldCheck, BookOpen, Clock } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useReviews } from '../contexts/ReviewContext';
import { BOOKS } from '../data/books';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { reviews, addReview, getReviewsByBookId } = useReviews();

  const bookId = Number(id) || 1;
  const book = BOOKS.find(b => b.id === bookId) || BOOKS[0];

  const bookReviews = getReviewsByBookId(book.id);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewContent.trim()) return;
    
    addReview({
      id: `rev-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      bookImage: book.image,
      userId: 'user-1', // Mock user
      userName: 'Jane Doe',
      rating: reviewRating,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      content: reviewContent
    });
    
    setReviewContent('');
    setReviewRating(5);
  };

  return (
    <div className="bg-white dark:bg-gray-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/catalog" className="hover:text-indigo-600 dark:hover:text-indigo-400">Catalog</Link>
          <span className="mx-2">/</span>
          <Link to={`/catalog?category=${book.category}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">{book.category}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white font-medium truncate">{book.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Image */}
          <div className="w-full lg:w-1/3 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8 flex items-center justify-center transition-colors duration-200">
                <img 
                  src={book.image} 
                  alt={book.title} 
                  className="w-full max-w-sm rounded-lg shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-6 flex justify-center gap-4">
                <button 
                  onClick={() => {
                    // @ts-ignore
                    if (isInWishlist(book.id)) {
                      // @ts-ignore
                      removeFromWishlist(book.id);
                    } else {
                      // @ts-ignore
                      addToWishlist(book);
                    }
                  }}
                  className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg font-medium w-full transition-colors ${
                    // @ts-ignore
                    isInWishlist(book.id) 
                      ? 'border-red-200 bg-red-50 text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40' 
                      : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {/* @ts-ignore */}
                  <Heart className={`h-5 w-5 ${isInWishlist(book.id) ? 'fill-current' : ''}`} /> 
                  {/* @ts-ignore */}
                  {isInWishlist(book.id) ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium w-full transition-colors">
                  <Share2 className="h-5 w-5" /> Share
                </button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-2/3">
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{book.title}</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">by <Link to="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">{book.author}</Link></p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.floor(Number(book.rating)) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">{book.rating}</span>
                </div>
                <span className="text-gray-300 dark:text-gray-700">|</span>
                <Link to="#reviews" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">{book.reviews} Reviews</Link>
                <span className="text-gray-300 dark:text-gray-700">|</span>
                <span className="text-sm text-green-600 font-medium">In Stock ({book.stock} available)</span>
              </div>

              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-8">${book.price}</div>
            </div>

            {/* Formats */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Format</h3>
              <div className="flex flex-wrap gap-3">
                <button className="px-5 py-3 border-2 border-indigo-600 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium flex flex-col items-start transition-colors">
                  <span>Hardcover</span>
                  <span className="text-sm font-normal">${book.price}</span>
                </button>
                <button className="px-5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 font-medium flex flex-col items-start transition-colors">
                  <span>Paperback</span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">$16.99</span>
                </button>
                <button className="px-5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 font-medium flex flex-col items-start transition-colors">
                  <span>E-Book</span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">$12.99</span>
                </button>
                <button className="px-5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 font-medium flex flex-col items-start transition-colors">
                  <span>Audiobook</span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">$14.99</span>
                </button>
              </div>
            </div>

            {/* Add to Cart Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 pb-10 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg h-14">
                <button 
                  className="px-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white h-full flex items-center justify-center transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >-</button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center font-medium text-gray-900 dark:text-white bg-transparent border-x border-gray-300 dark:border-gray-700 h-full focus:outline-none"
                />
                <button 
                  className="px-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white h-full flex items-center justify-center transition-colors"
                  onClick={() => setQuantity(Math.min(book.stock || 15, quantity + 1))}
                >+</button>
              </div>
              <button 
                onClick={() => {
                  // @ts-ignore
                  addToCart(book, quantity);
                }}
                className="flex-1 bg-indigo-600 text-white h-14 rounded-lg font-bold text-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingCart className="h-5 w-5" /> Add to Cart
              </button>
              <button 
                onClick={() => {
                  // @ts-ignore
                  addToCart(book, quantity);
                  navigate('/cart');
                }}
                className="flex-1 bg-gray-900 dark:bg-gray-800 text-white h-14 rounded-lg font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors flex items-center justify-center shadow-sm"
              >
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div className="flex items-start gap-3">
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Free Shipping</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">On orders over $35</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Secure Payment</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">100% secure checkout</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Easy Returns</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">30 days return policy</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div>
              <div className="border-b border-gray-200 dark:border-gray-800">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`${activeTab === 'description' ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`${activeTab === 'details' ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors`}
                  >
                    Product Details
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`${activeTab === 'reviews' ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors`}
                  >
                    Reviews ({bookReviews.length})
                  </button>
                </nav>
              </div>
              <div className="py-6">
                {activeTab === 'description' && (
                  <div className="prose prose-indigo dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
                    <p>{book.description}</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                  </div>
                )}
                {activeTab === 'details' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400">Publisher</span>
                      <span className="font-medium text-gray-900 dark:text-white">{book.publisher}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400">Publication Date</span>
                      <span className="font-medium text-gray-900 dark:text-white">{book.publicationDate}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400">Language</span>
                      <span className="font-medium text-gray-900 dark:text-white">{book.language}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400">Pages</span>
                      <span className="font-medium text-gray-900 dark:text-white">{book.pages}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400">ISBN</span>
                      <span className="font-medium text-gray-900 dark:text-white">{book.isbn}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400">Dimensions</span>
                      <span className="font-medium text-gray-900 dark:text-white">6.1 x 1.1 x 9.2 inches</span>
                    </div>
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="text-5xl font-bold text-gray-900 dark:text-white">
                        {bookReviews.length > 0 
                          ? (bookReviews.reduce((acc, r) => acc + r.rating, 0) / bookReviews.length).toFixed(1) 
                          : '0.0'}
                      </div>
                      <div>
                        <div className="flex text-yellow-400 mb-1">
                          {[...Array(5)].map((_, i) => {
                            const avgRating = bookReviews.length > 0 
                              ? bookReviews.reduce((acc, r) => acc + r.rating, 0) / bookReviews.length 
                              : 0;
                            return (
                              <Star key={i} className={`h-5 w-5 ${i < Math.round(avgRating) ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                            );
                          })}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Based on {bookReviews.length} reviews</p>
                      </div>
                    </div>

                    {/* Write a Review Form */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 mb-8 border border-gray-100 dark:border-gray-700">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Write a Review</h3>
                      <form onSubmit={handleAddReview}>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className={`p-1 transition-colors ${reviewRating >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                              >
                                <Star className="h-8 w-8 fill-current" />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Review</label>
                          <textarea
                            rows={4}
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                            placeholder="What did you think about this book?"
                            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            required
                          ></textarea>
                        </div>
                        <button
                          type="submit"
                          className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                        >
                          Submit Review
                        </button>
                      </form>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-6">
                      {bookReviews.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review this book!</p>
                      ) : (
                        bookReviews.map((review) => (
                          <div key={review.id} className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold">
                                  {review.userName.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-900 dark:text-white">{review.userName}</h5>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{review.date}</p>
                                </div>
                              </div>
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-3">{review.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
