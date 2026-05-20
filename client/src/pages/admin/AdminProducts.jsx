import { useState, useEffect } from 'react';
import api from '../../hooks/useApi';
import { useToast } from '../../context/ToastContext';
import './Admin.css';

const EMPTY = {
  name: '', description: '', price: '', originalPrice: '', category: 'Electronics',
  image: '', stock: '', featured: false, tags: ''
};
const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Other'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const toast = useToast();

  const load = () => {
    api.get('/api/products?limit=100').then(res => {
      setProducts(res.data.products);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ ...p, originalPrice: p.originalPrice || '', tags: (p.tags || []).join(', '), price: p.price, stock: p.stock });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      };
      if (editing) {
        await api.put(`/api/products/${editing}`, payload);
        toast('Product updated!');
      } else {
        await api.post('/api/products', payload);
        toast('Product created!');
      }
      setShowModal(false);
      load();
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/api/products/${id}`);
      toast('Product deleted');
      load();
    } catch { toast('Delete failed', 'error'); }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrap">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Products</h1>
            <p className="admin-sub">{products.length} total products</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>+ Add Product</button>
        </div>

        <div className="card">
          <input className="input-field" placeholder="Search products…" value={search}
            onChange={e => setSearch(e.target.value)} style={{ maxWidth: '320px', marginBottom: '1rem' }} />

          {loading ? <div className="spinner" /> : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p._id}>
                    <td><img src={p.image} alt={p.name} className="table-img" /></td>
                    <td className="product-name-cell">{p.name}</td>
                    <td><span className="badge badge-accent">{p.category}</span></td>
                    <td>₹{p.price.toLocaleString()}</td>
                    <td className={p.stock === 0 ? 'text-red' : ''}>{p.stock}</td>
                    <td>{p.featured ? '⭐' : '—'}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-ghost action-btn" onClick={() => openEdit(p)}>✏️</button>
                        <button className="btn btn-ghost action-btn text-red" onClick={() => handleDelete(p._id, p.name)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editing ? 'Edit Product' : 'Add Product'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSave} className="modal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Name *</label>
                    <input className="input-field" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea className="input-field" rows={3} required value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price (₹) *</label>
                    <input type="number" className="input-field" required min="0" value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Original Price (₹)</label>
                    <input type="number" className="input-field" min="0" value={form.originalPrice}
                      onChange={e => setForm({ ...form, originalPrice: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock *</label>
                    <input type="number" className="input-field" required min="0" value={form.stock}
                      onChange={e => setForm({ ...form, stock: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input className="input-field" placeholder="https://..." value={form.image}
                    onChange={e => setForm({ ...form, image: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tags (comma-separated)</label>
                  <input className="input-field" placeholder="tag1, tag2" value={form.tags}
                    onChange={e => setForm({ ...form, tags: e.target.value })} />
                </div>
                <label className="checkbox-label">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                  Featured product
                </label>
                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving…' : editing ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
