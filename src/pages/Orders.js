import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders/my');
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="container" style={{ padding: '2rem 0', textAlign: 'center' }}>
        <h2>No orders found</h2>
        <p>You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1>My Orders</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {orders.map(order => (
          <div key={order._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Order #{order._id.slice(-6)}</h3>
              <span className={`status ${order.orderStatus}`} style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '3px',
                fontSize: '0.8rem',
                textTransform: 'capitalize',
                background: order.orderStatus === 'delivered' ? '#d1ecf1' : '#fff3cd',
                color: order.orderStatus === 'delivered' ? '#0c5460' : '#856404'
              }}>
                {order.orderStatus}
              </span>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Total Amount:</strong> ₹{order.total}</p>
              <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
            </div>
            
            <div>
              <h4>Items:</h4>
              {order.items.map(item => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '5px' }}>
              <h4>Shipping Address:</h4>
              <p>
                {order.shippingAddress.line1}, {order.shippingAddress.line2 && `${order.shippingAddress.line2}, `}
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;