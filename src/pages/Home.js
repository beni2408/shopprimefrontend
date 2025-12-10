import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../utils/api';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products?limit=8`);
      setFeaturedProducts(res.data.products.filter(p => p.isFeatured));
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products/categories/all`);
      setCategories(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to ShopPrime</h1>
            <p>Discover amazing products at unbeatable prices</p>
            <Link to="/products" className="btn btn-primary">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="grid grid-4">
            {categories.map((category, index) => (
              <Link 
                key={index} 
                to={`/products?category=${category}`}
                className="category-card"
              >
                <h3>{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="grid grid-4">
            {featuredProducts.map(product => (
              <div key={product._id} className="product-card">
                <Link to={`/products/${product._id}`}>
                  <div className="product-image">
                    <img 
                      src={product.images[0] || '/placeholder.jpg'} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <div className="product-price">
                      {product.discountPrice ? (
                        <>
                          <span className="discount-price">₹{product.discountPrice}</span>
                          <span className="original-price">₹{product.price}</span>
                        </>
                      ) : (
                        <span className="price">₹{product.price}</span>
                      )}
                    </div>
                    <div className="product-rating">
                      ⭐ {product.averageRating.toFixed(1)} ({product.reviews.length})
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;