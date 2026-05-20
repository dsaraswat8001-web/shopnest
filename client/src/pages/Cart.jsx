import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = cartTotal > 500 ? 0 : 49;
  const tax = Math.round(cartTotal * 0.18 * 100) / 100;
  const total = cartTotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="page-wrap">
        <div className="container">
          <div className="empty-state">
            <div style={{ fontSize: '4rem' }}>🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add some products to get started.</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Shop Now</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <div className="container">
        <div className="cart-header">
          <h1 className="cart-title">Shopping Cart <span className="cart-count">({cart.length} items)</span></h1>
          <button className="btn btn-ghost" onClick={clearCart} style={{ fontSize: '0.82rem' }}>Clear All</button>
        </div>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.product} className="cart-item card">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <Link to={`/products/${item.product}`} className="cart-item-name">{item.name}</Link>
                  <p className="cart-item-price">₹{item.price.toLocaleString()} each</p>
                </div>
                <div className="cart-item-right">
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => updateQuantity(item.product, item.quantity - 1)}>−</button>
                    <span className="qty-val">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.product, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}>+</button>
                  </div>
                  <p className="item-subtotal">₹{(item.price * item.quantity).toLocaleString()}</p>
                  <button className="remove-btn" onClick={() => removeFromCart(item.product)}>✕</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary card">
            <h2 className="summary-title">Order Summary</h2>
            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green' : ''}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              <div className="summary-row">
                <span>GST (18%)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <hr className="summary-divider" />
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            {shipping > 0 && (
              <p className="free-ship-note">Add ₹{(500 - cartTotal).toFixed(0)} more for free shipping!</p>
            )}
            <button
              className="btn btn-primary checkout-btn"
              onClick={() => user ? navigate('/checkout') : navigate('/login')}
            >
              {user ? 'Proceed to Checkout →' : 'Login to Checkout →'}
            </button>
            <Link to="/" className="btn btn-outline continue-btn">← Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
