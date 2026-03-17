import React, { useState, useEffect } from 'react';
import { User, Package, Clock, Star, Settings, LogOut, Edit2, Sun, Moon, Monitor, CheckCircle2 } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import { useReviews } from '../contexts/ReviewContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Account() {
  const [activeTab, setActiveTab] = useState('profile');
  const { orders } = useOrders();
  const { getUserReviews } = useReviews();
  const { theme, setTheme } = useTheme();
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  
  // Profile State
  const [profile, setProfile] = useState({
    firstName: user?.firstName || 'User',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  
  // Sync if context updates
  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || ''
      });
    }
  }, [user]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    
    // Simulate API call
    setTimeout(() => {
      updateUser(profile);
      setIsSaving(false);
      setSaveMessage('Profile updated successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    }, 800);
  };
  
  const activeShipments = orders.filter(o => o.status !== 'Delivered');
  const userReviews = getUserReviews('user-1'); // Mock user ID

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden sticky top-24 transition-colors">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 text-center">
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                  <span className="text-indigo-700 dark:text-indigo-400 font-bold text-2xl">
                    {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                  </span>
                  <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-1 rounded-full shadow border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="font-bold text-gray-900 dark:text-white text-lg">{profile.firstName} {profile.lastName}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
              </div>
              <nav className="p-4 space-y-1">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  <User className="h-5 w-5" /> My Profile
                </button>
                <button 
                  onClick={() => setActiveTab('shipments')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'shipments' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  <Package className="h-5 w-5" /> Active Shipments
                  {activeShipments.length > 0 && (
                    <span className="ml-auto bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 py-0.5 px-2 rounded-full text-xs">{activeShipments.length}</span>
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  <Clock className="h-5 w-5" /> Order History
                </button>
                <button 
                  onClick={() => setActiveTab('reviews')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'reviews' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  <Star className="h-5 w-5" /> My Reviews
                  {userReviews.length > 0 && (
                    <span className="ml-auto bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 py-0.5 px-2 rounded-full text-xs">{userReviews.length}</span>
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  <Settings className="h-5 w-5" /> Settings
                </button>
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
                  <button 
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="h-5 w-5" /> Sign Out
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 transition-colors">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Personal Information</h2>
                
                {saveMessage && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3 text-green-700 dark:text-green-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <p className="font-medium">{saveMessage}</p>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                      <input 
                        type="text" 
                        name="firstName"
                        value={profile.firstName} 
                        onChange={handleProfileChange}
                        required
                        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                      <input 
                        type="text" 
                        name="lastName"
                        value={profile.lastName} 
                        onChange={handleProfileChange}
                        required
                        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        value={profile.email} 
                        onChange={handleProfileChange}
                        required
                        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={profile.phone} 
                        onChange={handleProfileChange}
                        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'shipments' && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 transition-colors">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Active Shipments</h2>
                {activeShipments.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">You have no active shipments.</p>
                ) : (
                  <div className="space-y-6">
                    {activeShipments.map(order => (
                      <div key={order.id} className="border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Order #{order.id}</p>
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Arriving Soon</h3>
                          </div>
                          <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">{order.status}</span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="relative pt-4 mb-8">
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
                            <div style={{ width: order.status === 'Processing' ? '25%' : order.status === 'Shipped' ? '50%' : '100%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-500"></div>
                          </div>
                          <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                            <span className={order.status === 'Processing' ? "text-indigo-600 dark:text-indigo-400" : ""}>Ordered</span>
                            <span className={order.status === 'Shipped' ? "text-indigo-600 dark:text-indigo-400" : ""}>Shipped</span>
                            <span>Out for Delivery</span>
                            <span>Delivered</span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {order.items.map(item => (
                            <div key={item.id} className="flex gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                              <img src={item.image} alt={item.title} className="w-12 h-16 object-cover rounded shadow-sm" referrerPolicy="no-referrer" />
                              <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">{item.title}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 transition-colors">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Order History</h2>
                {orders.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">You have no order history.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
                          <th className="pb-3 font-medium">Order ID</th>
                          <th className="pb-3 font-medium">Date</th>
                          <th className="pb-3 font-medium">Items</th>
                          <th className="pb-3 font-medium">Total</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {orders.map(order => (
                          <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-4 font-medium text-gray-900 dark:text-white">#{order.id}</td>
                            <td className="py-4 text-gray-600 dark:text-gray-400">{order.date}</td>
                            <td className="py-4 text-gray-600 dark:text-gray-400">{order.items.reduce((acc, item) => acc + item.quantity, 0)} items</td>
                            <td className="py-4 font-medium text-gray-900 dark:text-white">${order.total.toFixed(2)}</td>
                            <td className="py-4">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                order.status === 'Delivered' 
                                  ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-400' 
                                  : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-400'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
            {/* Other tabs can be implemented similarly */}
            {activeTab === 'reviews' && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 transition-colors">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Reviews</h2>
                {userReviews.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't written any reviews yet.</p>
                    <Link to="/catalog" className="text-indigo-600 hover:text-indigo-500 font-medium">Browse Books to Review</Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userReviews.map(review => (
                      <div key={review.id} className="border border-gray-100 dark:border-gray-800 rounded-xl p-6">
                        <div className="flex gap-4">
                          <img src={review.bookImage} alt={review.bookTitle} className="w-16 h-24 object-cover rounded shadow-sm" referrerPolicy="no-referrer" />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <Link to={`/book/${review.bookId}`} className="font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 text-lg">{review.bookTitle}</Link>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{review.date}</p>
                              </div>
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">{review.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 transition-colors">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h2>
                
                <div className="space-y-8">
                  {/* Theme Settings */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Appearance</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button
                        onClick={() => setTheme('light')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-colors ${
                          theme === 'light' 
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                          <Sun className="h-6 w-6 text-amber-500" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">Light</span>
                      </button>
                      
                      <button
                        onClick={() => setTheme('dark')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-colors ${
                          theme === 'dark' 
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3">
                          <Moon className="h-6 w-6 text-indigo-400" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">Dark</span>
                      </button>
                      
                      <button
                        onClick={() => setTheme('system')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-colors ${
                          theme === 'system' 
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-800 flex items-center justify-center mb-3">
                          <Monitor className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">System</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
