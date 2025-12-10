import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="nav-logo">
            ShopPrime
          </Link>

          <form className="nav-search" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit"><FaSearch /></button>
          </form>

          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/products" onClick={() => setIsMenuOpen(false)}>
              Products
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="cart-link" onClick={() => setIsMenuOpen(false)}>
                  <FaShoppingCart />
                  <span className="cart-count">{getCartCount()}</span>
                </Link>
                
                <div className="user-menu">
                  <FaUser />
                  <span>{user?.name}</span>
                  <div className="dropdown">
                    <Link to="/profile">Profile</Link>
                    <Link to="/orders">Orders</Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin/dashboard">Admin</Link>
                    )}
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>

          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;