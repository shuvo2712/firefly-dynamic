import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { PRODUCTS, CAT_LABELS } from '../data/products';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToQuote } = useContext(AppContext);
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    setIsLoading(true);
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost/firefly-api';
    fetch(`${apiBase}/get_product_by_id.php?id=${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        // Parse specs if it comes as a JSON string from some PHP versions
        if (typeof data.specs === 'string') {
          try { data.specs = JSON.parse(data.specs); } catch(e) {}
        }
        setProduct(data);
        document.title = `${data.name} | Firefly`;
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        document.title = 'Product Not Found | Firefly';
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="page active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" style={{ animation: 'spin 1s linear infinite' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page active">
        <div className="page-inner" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <p style={{ color: 'var(--steel)', marginBottom: '1.5rem' }}>Product not found.</p>
          <button className="btn-outline" onClick={() => navigate('/products')}>Back to Products</button>
        </div>
      </div>
    );
  }

  const specs = [
    { icon: '⚡', label: 'Wattage', value: product.wattage },
    { icon: '◈', label: 'Material', value: product.material },
    { icon: '💰', label: 'Price Range', value: product.price_range },
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
 
            <div className="specs-box" style={{ display: (specs.length || product.specifications) ? 'block' : 'none' }}>
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
                {product.specifications && (
                  <div className="spec-item" style={{ gridColumn: '1 / -1', marginTop: specs.length ? '1rem' : 0 }}>
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
              <label htmlFor="detail-qty">Qty:</label>
              <input
                id="detail-qty"
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
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
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
