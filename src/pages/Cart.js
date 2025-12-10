import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
    toast.success('Item removed from cart');
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };



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
                    src={item.image || '/placeholder.jpg'} 
                    alt={item.title}
                    onError={(e) => {
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                </div>
                
                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p className="item-price">
                    ${item.price}
                  </p>
                </div>
                
                <div className="quantity-controls">
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <FaMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    <FaPlus />
                  </button>
                </div>
                
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                
                <button 
                  className="remove-btn"
                  onClick={() => handleRemoveItem(item.id)}
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