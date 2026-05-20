import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../hooks/useApi';
import './Orders.css';

const STATUS_COLORS = {
  pending: 'yellow',
  confirmed: 'accent',
  shipped: 'accent',
  delivered: 'green',
  cancelled: 'red'
};

export function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/orders/${id}`)
      .then(res => setOrder(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner" style={{ marginTop: '5rem' }} />;
  if (!order) return null;

  return (
    <div className="page-wrap">
      <div className="container" style={{ maxWidth: '680px' }}>
        <div className="confirmation-hero">
          <div className="confirm-icon">✅</div>
          <h1 className="confirm-title">Order Placed!</h1>
          <p className="confirm-sub">Thank you for your purchase. Your order has been received.</p>
          <p className="order-id-text">Order ID: <span className="order-id-val">{order._id}</span></p>
        </div>

        <div className="card">
          <div className="order-meta">
            <div className="meta-item"><span className="meta-label">Status</span>
              <span className={`badge badge-${STATUS_COLORS[order.status]}`}>{order.status}</span></div>
            <div className="meta-item"><span className="meta-label">Payment</span>
              <span className="meta-val">{order.paymentMethod}</span></div>
            <div className="meta-item"><span className="meta-label">Date</span>
              <span className="meta-val">{new Date(order.createdAt).toLocaleDateString()}</span></div>
          </div>

          <h3 className="section-title" style={{ marginTop: '1.25rem', fontSize: '0.95rem' }}>Items</h3>
          {order.items.map((item, i) => (
            <div key={i} className="order-item-row">
              <img src={item.image} alt={item.name} className="order-item-img" />
              <span className="order-item-name">{item.name}</span>
              <span className="order-item-qty">×{item.quantity}</span>
              <span className="order-item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}

          <div className="order-totals">
            <div className="total-row"><span>Items</span><span>₹{order.itemsTotal.toLocaleString()}</span></div>
            <div className="total-row"><span>Shipping</span><span>{order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}</span></div>
            <div className="total-row"><span>GST</span><span>₹{order.tax}</span></div>
            <div className="total-row total-final"><span>Total</span><span>₹{order.totalAmount.toLocaleString()}</span></div>
          </div>
        </div>

        <div className="confirm-actions">
          <Link to="/orders" className="btn btn-outline">View All Orders</Link>
          <Link to="/" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/orders/my')
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" style={{ marginTop: '5rem' }} />;

  return (
    <div className="page-wrap">
      <div className="container">
        <h1 className="page-title">My Orders</h1>
        {orders.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem' }}>📦</div>
            <h3>No orders yet</h3>
            <p>Your orders will appear here once you shop.</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Shop Now</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card card" onClick={() => navigate(`/orders/${order._id}`)}>
                <div className="order-card-header">
                  <div>
                    <p className="order-card-id">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="order-card-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                  </div>
                  <span className={`badge badge-${STATUS_COLORS[order.status]}`}>{order.status}</span>
                </div>
                <div className="order-card-items">
                  {order.items.map((item, i) => (
                    <img key={i} src={item.image} alt={item.name} className="order-thumb" title={item.name} />
                  ))}
                  {order.items.length > 4 && <span className="more-items">+{order.items.length - 4}</span>}
                </div>
                <div className="order-card-footer">
                  <span className="order-card-count">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                  <span className="order-card-total">₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderConfirmation;
