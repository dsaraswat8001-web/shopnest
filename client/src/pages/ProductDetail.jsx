import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../hooks/useApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './ProductDetail.css';

function Stars({ rating, interactive, onRate }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="stars-row">
      {[1,2,3,4,5].map(s => (
        <span
          key={s}
          className={`star ${interactive ? 'star-interactive' : ''}`}
          style={{ color: s <= (hover || rating) ? '#f59e0b' : '#3a3a50' }}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate && onRate(s)}
        >★</span>
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast(`${qty}× ${product.name.split(' ').slice(0,3).join(' ')} added to cart!`);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast('Login to leave a review', 'error'); return; }
    setSubmitting(true);
    try {
      await api.post(`/api/products/${id}/reviews`, review);
      toast('Review submitted!');
      const res = await api.get(`/api/products/${id}`);
      setProduct(res.data);
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="spinner" style={{ marginTop: '5rem' }} />;
  if (!product) return null;

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="page-wrap">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

        <div className="detail-grid">
          {/* Image */}
          <div className="detail-img-wrap">
            <img src={product.image} alt={product.name} className="detail-img" />
            {discount > 0 && <span className="product-discount">-{discount}%</span>}
          </div>

          {/* Info */}
          <div className="detail-info">
            <span className="product-category">{product.category}</span>
            <h1 className="detail-name">{product.name}</h1>
            <div className="detail-rating-row">
              <Stars rating={product.rating} />
              <span className="rating-count">{product.rating.toFixed(1)} ({product.numReviews} reviews)</span>
            </div>
            <div className="detail-price-row">
              <span className="detail-price">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="detail-original">₹{product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            <p className="detail-desc">{product.description}</p>
            <div className="detail-stock">
              {product.stock > 0
                ? <span className="badge badge-green">✓ In Stock ({product.stock})</span>
                : <span className="badge badge-red">✗ Out of Stock</span>}
            </div>
            {product.tags?.length > 0 && (
              <div className="detail-tags">
                {product.tags.map(t => <span key={t} className="badge badge-accent">{t}</span>)}
              </div>
            )}

            {product.stock > 0 && (
              <div className="add-to-cart-row">
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="qty-val">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
                </div>
                <button className="btn btn-primary add-cart-btn" onClick={handleAddToCart}>
                  🛒 Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="reviews-section">
          <h2 className="section-title">Customer Reviews</h2>
          {product.reviews.length === 0
            ? <p style={{ color: 'var(--text2)' }}>No reviews yet. Be the first!</p>
            : product.reviews.map(r => (
              <div key={r._id} className="review-card card">
                <div className="review-header">
                  <div className="reviewer-avatar">{r.name[0]}</div>
                  <div>
                    <div className="reviewer-name">{r.name}</div>
                    <Stars rating={r.rating} />
                  </div>
                  <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="review-comment">{r.comment}</p>
              </div>
            ))
          }

          {/* Write review */}
          {user && (
            <div className="write-review card">
              <h3 className="section-title" style={{ fontSize: '1rem' }}>Write a Review</h3>
              <form onSubmit={handleReview} className="review-form">
                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <Stars rating={review.rating} interactive onRate={r => setReview(v => ({ ...v, rating: r }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Comment</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="Share your experience..."
                    value={review.comment}
                    onChange={e => setReview(v => ({ ...v, comment: e.target.value }))}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
