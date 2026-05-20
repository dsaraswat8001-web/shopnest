import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../hooks/useApi';
import './Admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/orders/admin/stats'),
      api.get('/api/orders?limit=5')
    ]).then(([statsRes, ordersRes]) => {
      setStats(statsRes.data);
      setRecentOrders(ordersRes.data.orders);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" style={{ marginTop: '5rem' }} />;

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: '📦', color: 'accent' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: '💰', color: 'green' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: '⏳', color: 'yellow' },
    { label: 'Products', value: stats.totalProducts, icon: '🏷️', color: 'accent' },
  ];

  const STATUS_COLORS = { pending: 'yellow', confirmed: 'accent', shipped: 'accent', delivered: 'green', cancelled: 'red' };

  return (
    <div className="page-wrap">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-sub">Welcome back, Admin</p>
          </div>
          <div className="admin-nav-btns">
            <Link to="/admin/products" className="btn btn-outline">Manage Products</Link>
            <Link to="/admin/orders" className="btn btn-primary">Manage Orders</Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="stat-grid">
          {statCards.map(s => (
            <div key={s.label} className="stat-card card">
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div className="section-header">
            <h2 className="section-title">Recent Orders</h2>
            <Link to="/admin/orders" className="view-all">View all →</Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o._id}>
                  <td className="mono">#{o._id.slice(-8).toUpperCase()}</td>
                  <td>{o.user?.name || 'N/A'}</td>
                  <td>{o.items.length}</td>
                  <td>₹{o.totalAmount.toLocaleString()}</td>
                  <td><span className={`badge badge-${STATUS_COLORS[o.status]}`}>{o.status}</span></td>
                  <td className="text-muted">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
