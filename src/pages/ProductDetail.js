import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    const result = await addToCart(product._id);
    if (result.success) {
      toast.success('Product added to cart!');
    } else {
      toast.error(result.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (!product) {
    return <div className="container"><p>Product not found</p></div>;
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <img 
            src={product.images[0] || '/placeholder.jpg'} 
            alt={product.name}
            style={{ width: '100%', borderRadius: '8px' }}
            onError={(e) => {
              e.target.src = '/placeholder.jpg';
            }}
          />
        </div>
        
        <div>
          <h1>{product.name}</h1>
          <p style={{ color: '#666', marginBottom: '1rem' }}>{product.brand}</p>
          
          <div style={{ marginBottom: '1rem' }}>
            {product.discountPrice ? (
              <>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
                  ₹{product.discountPrice}
                </span>
                <span style={{ textDecoration: 'line-through', color: '#666', marginLeft: '1rem' }}>
                  ₹{product.price}
                </span>
              </>
            ) : (
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
                ₹{product.price}
              </span>
            )}
          </div>
          
          <p style={{ marginBottom: '1rem' }}>⭐ {product.averageRating.toFixed(1)} ({product.reviews.length} reviews)</p>
          
          <p style={{ marginBottom: '2rem' }}>{product.description}</p>
          
          <button 
            className="btn btn-primary"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{ marginRight: '1rem' }}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          
          <p style={{ marginTop: '1rem', color: product.stock > 0 ? '#28a745' : '#dc3545' }}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;