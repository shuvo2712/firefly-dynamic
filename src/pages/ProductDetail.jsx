import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { PRODUCTS, CAT_LABELS } from '../data/products';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToQuote } = useContext(AppContext);
  const [qty, setQty] = useState(1);
  const [toastMsg, setToastMsg] = useState('');

  const product = PRODUCTS.find(p => p.id === parseInt(id));

  if (!product) {
    return <div className="page active"><div className="page-inner">Product not found.</div></div>;
  }

  const specs = [
    { icon: '⚡', label: 'Wattage', value: product.wattage },
    { icon: '◈', label: 'Material', value: product.material },
  ].filter(s => s.value && s.value !== 'N/A');

  const handleAddQuote = () => {
    addToQuote(product, qty);
    setToastMsg(`${product.name} added to quotation`);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSample = () => {
    navigate('/sample', { state: { product: product.name } });
  };

  return (
    <div id="page-detail" className="page active">
      <div className="page-inner">
        <div className="back-link" onClick={() => navigate(-1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </div>
        <div className="detail-grid">
          <div className="detail-img">
            <img src={product.image_url} alt={product.name} />
          </div>
          <div>
            <div className="detail-cat">{CAT_LABELS[product.category] || product.category}</div>
            <h2 className="detail-name">{product.name}</h2>
            <div className="detail-price">{product.price_range}</div>
            <p className="detail-desc">{product.description}</p>

            <div className="specs-box" style={{ display: specs.length ? 'block' : 'none' }}>
              <div className="specs-title">Specifications</div>
              <div className="specs-grid">
                {specs.map((s, i) => (
                  <div className="spec-item" key={i}>
                    <div className="spec-icon">{s.icon}</div>
                    <div>
                      <div className="spec-label">{s.label}</div>
                      <div className="spec-value">{s.value}</div>
                    </div>
                  </div>
                ))}
                {/* Always show raw specifications if they exist */}
                {product.specifications && (
                  <div className="spec-item" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                    <div className="spec-icon">📄</div>
                    <div>
                      <div className="spec-label">Details</div>
                      <div className="spec-value" style={{ whiteSpace: 'pre-line' }}>{product.specifications}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="qty-row">
              <label>Qty:</label>
              <input 
                className="form-input qty-input" 
                type="number" 
                min="1" 
                value={qty} 
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))} 
              />
            </div>
            <div className="detail-btns">
              <button className="btn-primary" onClick={handleAddQuote}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Add to Quotation
              </button>
              <button className="btn-outline-primary" onClick={handleSample}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Request Sample
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`toast ${toastMsg ? 'show' : ''}`}>✓ {toastMsg}</div>
    </div>
  );
}
