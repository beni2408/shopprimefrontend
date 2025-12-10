import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const [shippingAddress, setShippingAddress] = useState({
    label: 'Home',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const { items, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const deliveryCharge = subtotal > 500 ? 0 : 50;
  const total = subtotal - discount + deliveryCharge;

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const applyCoupon = async () => {
    if (!couponCode) return;
    
    try {
      const res = await axios.post('/api/coupons/apply', {
        code: couponCode,
        orderAmount: subtotal
      });
      
      if (res.data.valid) {
        setDiscount(res.data.discount);
        toast.success('Coupon applied successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate order placement
      setTimeout(() => {
        clearCart();
        toast.success('Order placed successfully!');
        navigate('/');
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to place order');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '2rem 0', textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
        <p>Add some products to checkout</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1>Checkout</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          <form onSubmit={handlePlaceOrder}>
            <div className="card">
              <h3>Shipping Address</h3>
              
              <div className="form-group">
                <label>Address Label</label>
                <input
                  type="text"
                  name="label"
                  value={shippingAddress.label}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Address Line 1</label>
                <input
                  type="text"
                  name="line1"
                  value={shippingAddress.line1}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Address Line 2</label>
                <input
                  type="text"
                  name="line2"
                  value={shippingAddress.line2}
                  onChange={handleAddressChange}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={shippingAddress.pincode}
                  onChange={handleAddressChange}
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
        
        <div>
          <div className="card">
            <h3>Order Summary</h3>
            
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>{item.title} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            
            <hr />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#28a745' }}>
                <span>Discount:</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Delivery:</span>
              <span>{deliveryCharge === 0 ? 'Free' : `$${deliveryCharge}`}</span>
            </div>
            
            <hr />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={applyCoupon}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;