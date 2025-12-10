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
      const res = await fetch(`https://fakestoreapi.com/products/${id}`);
      const product = await res.json();
      setProduct(product);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const result = await addToCart(product);
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
            src={product.image || '/placeholder.jpg'} 
            alt={product.title}
            style={{ width: '100%', borderRadius: '8px' }}
            onError={(e) => {
              e.target.src = '/placeholder.jpg';
            }}
          />
        </div>
        
        <div>
          <h1>{product.title}</h1>
          <p style={{ color: '#666', marginBottom: '1rem' }}>{product.category}</p>
          
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
              ${product.price}
            </span>
          </div>
          
          <p style={{ marginBottom: '1rem' }}>⭐ {product.rating?.rate || 0} ({product.rating?.count || 0} reviews)</p>
          
          <p style={{ marginBottom: '2rem' }}>{product.description}</p>
          
          <button 
            className="btn btn-primary"
            onClick={handleAddToCart}
            style={{ marginRight: '1rem' }}
          >
            Add to Cart
          </button>
          
          <p style={{ marginTop: '1rem', color: '#28a745' }}>
            In stock
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;