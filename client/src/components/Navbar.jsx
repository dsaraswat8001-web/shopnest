import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🛍️</span>
          ShopNest
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Shop</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="nav-link nav-link-admin">Admin</Link>
          )}
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-btn">
            <span className="cart-icon">🛒</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <button className="user-btn" onClick={() => setMenuOpen(!menuOpen)}>
                <span className="user-avatar">{user.name[0].toUpperCase()}</span>
                <span className="user-name">{user.name.split(' ')[0]}</span>
                <span style={{ color: 'var(--text2)' }}>▾</span>
              </button>
              {menuOpen && (
                <div className="dropdown">
                  <Link to="/orders" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                    📦 My Orders
                  </Link>
                  {user.role === 'admin' && (
                    <>
                      <Link to="/admin" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                        ⚙️ Dashboard
                      </Link>
                      <Link to="/admin/products" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                        📋 Products
                      </Link>
                      <Link to="/admin/orders" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                        🗂️ All Orders
                      </Link>
                    </>
                  )}
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn btn-ghost" style={{ padding: '0.5rem 1rem' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
