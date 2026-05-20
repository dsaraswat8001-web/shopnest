import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../hooks/useApi';
import './Checkout.css';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [address, setAddress] = useState({
    name: user?.name || '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India'
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  const shipping = cartTotal > 500 ? 0 : 49;
  const tax = Math.round(cartTotal * 0.18 * 100) / 100;
  const total = cartTotal + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const items = cart.map(i => ({ product: i.product, quantity: i.quantity }));
      const res = await api.post('/api/orders', {
        items,
        shippingAddress: address,
        paymentMethod
      });
      clearCart();
      toast('Order placed successfully! 🎉');
      navigate(`/orders/${res.data._id}`);
    } catch (err) {
      toast(err.response?.data?.message || 'Order failed. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="page-wrap">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>
        <form onSubmit={handleSubmit} className="checkout-layout">
          {/* Left */}
          <div className="checkout-left">
            {/* Shipping */}
            <div className="card checkout-section">
              <h2 className="checkout-section-title">📦 Shipping Address</h2>
              <div className="form-grid">
                <div className="form-group span-2">
                  <label className="form-label">Full Name</label>
                  <input className="input-field" required value={address.name}
                    onChange={e => setAddress({ ...address, name: e.target.value })} />
                </div>
                <div className="form-group span-2">
                  <label className="form-label">Street Address</label>
                  <input className="input-field" required placeholder="House no., Street, Area"
                    value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="input-field" required value={address.city}
                    onChange={e => setAddress({ ...address, city: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input className="input-field" required value={address.state}
                    onChange={e => setAddress({ ...address, state: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">PIN Code</label>
                  <input className="input-field" required value={address.zip}
                    onChange={e => setAddress({ ...address, zip: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input className="input-field" value={address.country}
                    onChange={e => setAddress({ ...address, country: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="card checkout-section">
              <h2 className="checkout-section-title">💳 Payment Method</h2>
              <div className="payment-options">
                {['COD', 'UPI', 'Card'].map(method => (
                  <label key={method} className={`payment-option ${paymentMethod === method ? 'payment-option-active' : ''}`}>
                    <input type="radio" name="payment" value={method} checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)} />
                    <span className="payment-icon">
                      {method === 'COD' ? '💵' : method === 'UPI' ? '📱' : '💳'}
                    </span>
                    <span>{method === 'COD' ? 'Cash on Delivery' : method === 'UPI' ? 'UPI Payment' : 'Credit/Debit Card'}</span>
                  </label>
                ))}
              </div>
              {paymentMethod !== 'COD' && (
                <p className="payment-note">🔒 Secure payment simulation — no real charges in demo mode.</p>
              )}
            </div>
          </div>

          {/* Right: summary */}
          <div className="checkout-summary card">
            <h2 className="summary-title">Order Summary</h2>
            <div className="order-items">
              {cart.map(i => (
                <div key={i.product} className="order-item">
                  <img src={i.image} alt={i.name} className="order-item-img" />
                  <div className="order-item-info">
                    <p className="order-item-name">{i.name}</p>
                    <p className="order-item-qty">Qty: {i.quantity}</p>
                  </div>
                  <span className="order-item-price">₹{(i.price * i.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <hr className="summary-divider" />
            <div className="summary-rows">
              <div className="summary-row"><span>Items</span><span>₹{cartTotal.toLocaleString()}</span></div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="summary-row"><span>GST (18%)</span><span>₹{tax}</span></div>
              <hr className="summary-divider" />
              <div className="summary-row summary-total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
            </div>
            <button type="submit" className="btn btn-primary checkout-btn" disabled={loading}>
              {loading ? 'Placing Order…' : `Place Order · ₹${total.toLocaleString()}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
