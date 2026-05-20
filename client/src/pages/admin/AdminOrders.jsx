import { useState, useEffect } from 'react';
import api from '../../hooks/useApi';
import { useToast } from '../../context/ToastContext';
import './Admin.css';

const STATUS_COLORS = { pending: 'yellow', confirmed: 'accent', shipped: 'accent', delivered: 'green', cancelled: 'red' };
const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const toast = useToast();

  const load = () => {
    const params = filter ? { status: filter } : {};
    api.get('/api/orders', { params }).then(res => {
      setOrders(res.data.orders);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const handleStatus = async (orderId, status) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status });
      toast(`Order marked as ${status}`);
      load();
      if (selected?._id === orderId) setSelected({ ...selected, status });
    } catch { toast('Failed to update status', 'error'); }
  };

  return (
    <div className="page-wrap">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">All Orders</h1>
            <p className="admin-sub">{orders.length} orders</p>
          </div>
        </div>

        {/* Status filter chips */}
        <div className="status-filters">
          <button className={`cat-chip ${filter === '' ? 'cat-chip-active' : ''}`} onClick={() => setFilter('')}>All</button>
          {STATUSES.map(s => (
            <button key={s} className={`cat-chip ${filter === s ? 'cat-chip-active' : ''}`} onClick={() => setFilter(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {loading ? <div className="spinner" /> : (
          <div className="card">
            <table className="admin-table">
              <thead>
                <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Method</th><th>Status</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id}>
                    <td className="mono">#{o._id.slice(-8).toUpperCase()}</td>
                    <td>
                      <div>{o.user?.name}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{o.user?.email}</div>
                    </td>
                    <td>{o.items.length}</td>
                    <td>₹{o.totalAmount.toLocaleString()}</td>
                    <td>{o.paymentMethod}</td>
                    <td><span className={`badge badge-${STATUS_COLORS[o.status]}`}>{o.status}</span></td>
                    <td className="text-muted">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-ghost action-btn" onClick={() => setSelected(o)} title="View">👁</button>
                        <select
                          className="status-select"
                          value={o.status}
                          onChange={e => handleStatus(o._id, e.target.value)}
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Order detail modal */}
        {selected && (
          <div className="modal-overlay" onClick={() => setSelected(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Order #{selected._id.slice(-8).toUpperCase()}</h2>
                <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
              </div>
              <div className="order-detail-modal">
                <div className="order-meta">
                  <div className="meta-item"><span className="meta-label">Customer</span><span>{selected.user?.name}</span></div>
                  <div className="meta-item"><span className="meta-label">Status</span>
                    <span className={`badge badge-${STATUS_COLORS[selected.status]}`}>{selected.status}</span>
                  </div>
                  <div className="meta-item"><span className="meta-label">Payment</span><span>{selected.paymentMethod}</span></div>
                </div>
                <h3 className="form-label" style={{ margin: '1rem 0 0.5rem' }}>Shipping To</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text2)', lineHeight: 1.6 }}>
                  {selected.shippingAddress.name}<br />
                  {selected.shippingAddress.street}, {selected.shippingAddress.city}<br />
                  {selected.shippingAddress.state} - {selected.shippingAddress.zip}
                </p>
                <h3 className="form-label" style={{ margin: '1rem 0 0.5rem' }}>Items</h3>
                {selected.items.map((item, i) => (
                  <div key={i} className="order-item-row" style={{ padding: '0.4rem 0' }}>
                    <img src={item.image} alt={item.name} className="order-item-img" />
                    <span style={{ flex: 1, fontSize: '0.88rem' }}>{item.name}</span>
                    <span style={{ color: 'var(--text2)', fontSize: '0.82rem' }}>×{item.quantity}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="total-final" style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                  <span>Total: ₹{selected.totalAmount.toLocaleString()}</span>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <label className="form-label">Update Status</label>
                  <div className="modal-actions" style={{ marginTop: '0.5rem' }}>
                    {STATUSES.map(s => (
                      <button key={s}
                        className={`btn ${selected.status === s ? 'btn-primary' : 'btn-outline'}`}
                        style={{ fontSize: '0.78rem', padding: '0.4rem 0.7rem' }}
                        onClick={() => { handleStatus(selected._id, s); setSelected({ ...selected, status: s }); }}
                      >{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
