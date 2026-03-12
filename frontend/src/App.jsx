import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookDetail from './pages/BookDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import StaffInventory from './pages/StaffInventory';
import Catalog from './pages/Catalog';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
          {/* Navbar is outside main Routes block to show everywhere except where explicitly nullified */}
          <Routes>
            <Route path="/staff/*" element={null} />
            <Route path="*" element={<Navbar />} />
          </Routes>

          <main className="flex-grow flex flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/book/:id" element={<BookDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Orders />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/staff/inventory" element={<StaffInventory />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
