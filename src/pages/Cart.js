import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getCartTotal, loading } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const result = await updateQuantity(itemId, newQuantity);
    if (!result.success) {
      toast.error(result.message);
    }
  };

  const handleRemoveItem = async (itemId) => {
    const result = await removeFromCart(itemId);
    if (result.success) {
      toast.success('Item removed from cart');
    } else {
      toast.error(result.message);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="container">
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some products to get started</p>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>
        
        <div className="cart-content">
          <div className="cart-items">
            {items.map(item => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.product.images[0] || '/placeholder.jpg'} 
                    alt={item.product.name}
                    onError={(e) => {
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                </div>
                
                <div className="item-details">
                  <h3>{item.product.name}</h3>
                  <p className="item-price">
                    ₹{item.product.discountPrice || item.product.price}
                  </p>
                </div>
                
                <div className="quantity-controls">
                  <button 
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <FaMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                  >
                    <FaPlus />
                  </button>
                </div>
                
                <div className="item-total">
                  ₹{(item.product.discountPrice || item.product.price) * item.quantity}
                </div>
                
                <button 
                  className="remove-btn"
                  onClick={() => handleRemoveItem(item._id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{getCartTotal()}</span>
              </div>
              
              <div className="summary-row">
                <span>Delivery:</span>
                <span>{getCartTotal() > 500 ? 'Free' : '₹50'}</span>
              </div>
              
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{getCartTotal() + (getCartTotal() > 500 ? 0 : 50)}</span>
              </div>
              
              <button 
                className="btn btn-primary checkout-btn"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
              
              <Link to="/products" className="continue-shopping">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;