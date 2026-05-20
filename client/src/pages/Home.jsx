import { useState, useEffect, useCallback } from 'react';
import api from '../hooks/useApi';
import ProductCard from '../components/ProductCard';
import './Home.css';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Other'];
const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
];

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const debouncedSearch = useDebounce(search, 400);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort, category };
      if (debouncedSearch) params.search = debouncedSearch;
      const res = await api.get('/api/products', { params });
      setProducts(res.data.products);
      setTotalPages(res.data.pages);
      setTotal(res.data.total);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, sort, page]);

  useEffect(() => { setPage(1); }, [debouncedSearch, category, sort]);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <div className="page-wrap">
      <div className="container">
        {/* Hero */}
        <div className="hero">
          <h1 className="hero-title">Find What You <span className="hero-accent">Love</span></h1>
          <p className="hero-sub">Curated products, unbeatable prices, fast delivery.</p>
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              className="input-field search-input"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="filters-row">
          <div className="cat-chips">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-chip ${category === cat ? 'cat-chip-active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <select className="input-field sort-select" value={sort} onChange={e => setSort(e.target.value)}>
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="results-count">
            {total > 0 ? `${total} product${total !== 1 ? 's' : ''} found` : 'No products found'}
            {debouncedSearch && ` for "${debouncedSearch}"`}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="product-grid skeleton-grid">
            {Array(12).fill(0).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-img" />
                <div className="skeleton-body">
                  <div className="skeleton-line" style={{ width: '40%' }} />
                  <div className="skeleton-line" />
                  <div className="skeleton-line" style={{ width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3>No products found</h3>
            <p>Try different search terms or browse all categories.</p>
            <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={() => { setSearch(''); setCategory('All'); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button className="btn btn-outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <span className="page-info">Page {page} of {totalPages}</span>
            <button className="btn btn-outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
