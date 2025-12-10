import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest'
  });
  
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Get filters from URL params
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    setFilters(prev => ({
      ...prev,
      category: category || '',
      search: search || ''
    }));
    
    fetchProducts();
    fetchCategories();
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = 'https://fakestoreapi.com/products';
      
      if (filters.category) {
        url = `https://fakestoreapi.com/products/category/${filters.category}`;
      }
      
      const res = await fetch(url);
      let products = await res.json();
      
      // Apply filters
      if (filters.search) {
        products = products.filter(p => 
          p.title.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      if (filters.minPrice) {
        products = products.filter(p => p.price >= Number(filters.minPrice));
      }
      
      if (filters.maxPrice) {
        products = products.filter(p => p.price <= Number(filters.maxPrice));
      }
      
      // Apply sorting
      if (filters.sort === 'price_low') {
        products.sort((a, b) => a.price - b.price);
      } else if (filters.sort === 'price_high') {
        products.sort((a, b) => b.price - a.price);
      }
      
      setProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('https://fakestoreapi.com/products/categories');
      const cats = await res.json();
      setCategories(cats);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product);
    if (result.success) {
      toast.success('Product added to cart!');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-header">
          <h1>Products</h1>
          
          <div className="filters">
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
            
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
            
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <div className="products-grid">
            {products.length === 0 ? (
              <div className="no-products">
                <p>No products found matching your criteria.</p>
              </div>
            ) : (
              products.map(product => (
                <div key={product.id} className="product-card">
                  <Link to={`/products/${product.id}`} className="product-link">
                    <div className="product-image">
                      <img 
                        src={product.image || '/placeholder.jpg'} 
                        alt={product.title}
                        onError={(e) => {
                          e.target.src = '/placeholder.jpg';
                        }}
                      />
                    </div>
                    
                    <div className="product-info">
                      <h3>{product.title}</h3>
                      <p className="product-brand">{product.category}</p>
                      
                      <div className="product-price">
                        <span className="price">${product.price}</span>
                      </div>
                      
                      <div className="product-rating">
                        ⭐ {product.rating?.rate || 0} ({product.rating?.count || 0})
                      </div>
                    </div>
                  </Link>
                  
                  <button 
                    className="btn btn-primary add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;