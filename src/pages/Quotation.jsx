import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function Quotation() {
  const { quotation, changeQty, removeItem, clearQuote } = useContext(AppContext);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const totalItems = quotation.reduce((s, i) => s + i.qty, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    
    if (!name || !email) {
      setToastMsg('Please fill in name and email.');
      setTimeout(() => setToastMsg(''), 3000);
      return;
    }
    
    clearQuote();
    setSubmitted(true);
  };

  return (
    <div id="page-quotation" className="page active">
      <div className="page-inner" style={{ maxWidth: '800px' }}>
        <div className="section-heading">
          <span className="section-eyebrow">Your Selection</span>
          <h2>Quotation Builder</h2>
          <p>Review your selected products and submit for a custom wholesale quote.</p>
          <div className="divider"></div>
        </div>

        {!submitted && quotation.length === 0 && (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(161,161,170,0.3)" strokeWidth="1.5" style={{ margin: '0 auto 1rem', display: 'block' }}>
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <p>Your quotation is empty.</p>
            <button className="btn-primary" onClick={() => navigate('/products')}>
              Browse Products
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline', marginLeft: '6px' }}>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        )}

        {!submitted && quotation.length > 0 && !showForm && (
          <>
            <div className="quote-table">
              <div className="quote-header">
                <span>Product</span><span style={{ textAlign: 'center' }}>Quantity</span><span></span>
              </div>
              {quotation.map((item) => (
                <div className="quote-row" key={item.id}>
                  <div className="prod-name-q">{item.name}</div>
                  <div className="qty-ctrl">
                    <button className="qty-btn" onClick={() => changeQty(item.id, -1)}>−</button>
                    <span className="qty-val">{item.qty}</span>
                    <button className="qty-btn" onClick={() => changeQty(item.id, 1)}>+</button>
                  </div>
                  <button className="del-btn" onClick={() => removeItem(item.id)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                </div>
              ))}
              <div style={{ padding: '0.875rem 1.5rem', background: 'rgba(42,42,50,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--steel)', fontSize: '0.85rem' }}>Total Items</span>
                <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 500 }}>{totalItems} units across {quotation.length} products</span>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button className="btn-primary" style={{ padding: '1rem 2.5rem' }} onClick={() => setShowForm(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', marginRight: '8px' }}>
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Submit for Quotation
              </button>
            </div>
          </>
        )}

        {!submitted && quotation.length > 0 && showForm && (
          <div className="form-card">
            <div style={{ color: '#fff', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Your Details</div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group"><label>Name *</label><input name="name" className="form-input" placeholder="Your full name" required /></div>
                <div className="form-group"><label>Email *</label><input name="email" className="form-input" type="email" placeholder="Your email" required /></div>
                <div className="form-group"><label>Phone</label><input name="phone" className="form-input" placeholder="0123456789" /></div>
                <div className="form-group"><label>Company</label><input name="company" className="form-input" placeholder="Your company name" /></div>
                <div className="form-group form-full"><label>Notes</label><textarea name="notes" className="form-textarea" placeholder="Special requirements or project details..."></textarea></div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Submit Quotation</button>
              </div>
            </form>
          </div>
        )}

        {submitted && (
          <div className="success-state">
            <div className="success-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FDB813" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: '1.75rem', color: '#fff', marginBottom: '0.75rem' }}>Quotation Submitted!</h3>
            <p style={{ color: 'var(--steel)', marginBottom: '2rem' }}>Our team will review your request and get back to you shortly with pricing.</p>
            <button className="btn-outline" onClick={() => { setSubmitted(false); navigate('/products'); }}>Continue Browsing</button>
          </div>
        )}
      </div>
      <div className={`toast ${toastMsg ? 'show' : ''}`}>✓ {toastMsg}</div>
    </div>
  );
}
