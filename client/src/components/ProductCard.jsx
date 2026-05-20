import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './ProductCard.css';

function Stars({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ color: s <= Math.round(rating) ? '#f59e0b' : '#3a3a50' }}>★</span>
      ))}
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const toast = useToast();

  const handleAdd = (e) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addToCart(product, 1);
    toast(`${product.name.split(' ').slice(0,3).join(' ')} added to cart!`);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-img-wrap">
        <img src={product.image} alt={product.name} className="product-img" loading="lazy" />
        {discount > 0 && <span className="product-discount">-{discount}%</span>}
        {product.stock === 0 && <div className="out-of-stock">Out of Stock</div>}
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <Stars rating={product.rating} />
          <span className="rating-count">({product.numReviews})</span>
        </div>
        <div className="product-price-row">
          <div className="product-prices">
            <span className="product-price">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="product-original">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <button
            className={`add-btn ${product.stock === 0 ? 'add-btn-disabled' : ''}`}
            onClick={handleAdd}
            disabled={product.stock === 0}
            title="Add to cart"
          >
            +
          </button>
        </div>
      </div>
    </Link>
  );
}
