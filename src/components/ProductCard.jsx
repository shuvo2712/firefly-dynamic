import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CAT_LABELS } from '../data/products';

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="prod-card" onClick={handleClick}>
      <div className="prod-img">
        <img src={product.image_url} alt={product.name} loading="lazy" onError={(e) => e.target.style.opacity = 0} />
        <div className="prod-img-overlay"></div>
      </div>
      <div className="prod-info">
        <div className="prod-cat">{CAT_LABELS[product.category] || product.category}</div>
        <div className="prod-name">{product.name}</div>
        {product.wattage && <div className="prod-watt">{product.wattage}</div>}
        <div className="prod-cta">
          View Details
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </div>
    </div>
  );
}
