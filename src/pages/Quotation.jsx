import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function Quotation() {
  const { quotation, changeQty, removeItem, clearQuote } = useContext(AppContext);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    document.title = 'Quotation Builder | Firefly';
  }, []);

  const totalItems = quotation.reduce((s, i) => s + i.qty, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = {
      customer_name: e.target['q-name'].value,
      customer_email: e.target['q-email'].value,
      customer_phone: e.target['q-phone'].value,
      customer_company: e.target['q-company'].value,
      customer_address: e.target['q-address'].value,
      customer_notes: e.target['q-notes'].value,
      items: quotation // This is the array of cart items from context
    };

    if (!formData.customer_name || !formData.customer_email || !formData.customer_phone) {
      setToastMsg('Please fill in name, email, and phone.');
      setTimeout(() => setToastMsg(''), 3000);
      return;
    }

    if (quotation.length === 0) {
      setToastMsg('Your quotation is empty.');
      setTimeout(() => setToastMsg(''), 3000);
      return;
    }

    setIsSubmitting(true);

    // --- LIVE POST TO PHP ---
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost/firefly-api';
    fetch(`${apiBase}/submit_quotation.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
      setIsSubmitting(false);
      if (data.status === 'success') {
        clearQuote(); // Clear cart after successful save
        setSubmitted(true);
      } else {
        setToastMsg('Error: ' + data.message);
      }
    })
    .catch(err => {
      console.error(err);
      setIsSubmitting(false);
      setToastMsg('Server connection failed.');
    });
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
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <p>Your quotation is empty.</p>
            <button className="btn-primary" onClick={() => navigate('/products')}>
              Browse Products
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline', marginLeft: '6px' }}>
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
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
                    <button className="qty-btn" onClick={() => changeQty(item.id, -1)} aria-label="Decrease quantity">−</button>
                    <span className="qty-val">{item.qty}</span>
                    <button className="qty-btn" onClick={() => changeQty(item.id, 1)} aria-label="Increase quantity">+</button>
                  </div>
                  <button className="del-btn" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}>
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
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
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
                <div className="form-group">
                  <label htmlFor="q-name">Name *</label>
                  <input id="q-name" name="q-name" className="form-input" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="q-email">Email *</label>
                  <input id="q-email" name="q-email" className="form-input" type="email" placeholder="Your Email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="q-phone">Phone *</label>
                  <input id="q-phone" name="q-phone" className="form-input" placeholder="0123456789" required />
                </div>
                <div className="form-group">
                  <label htmlFor="q-company">Company</label>
                  <input id="q-company" name="q-company" className="form-input" placeholder="Your Company Name" />
                </div>
                <div className="form-group form-full">
                  <label htmlFor="q-address">Shipping Address</label>
                  <textarea id="q-address" name="q-address" className="form-textarea" placeholder="Full delivery address for freight calculation"></textarea>
                </div>
                <div className="form-group form-full">
                  <label htmlFor="q-notes">Notes</label>
                  <textarea id="q-notes" name="q-notes" className="form-textarea" placeholder="Special requirements or project details..."></textarea>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                  {isSubmitting ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Processing...
                    </span>
                  ) : 'Submit Quotation'}
                </button>
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
            <h3 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: '1.75rem', marginBottom: '0.75rem' }}>Quotation Submitted!</h3>
            <p style={{ color: 'var(--steel)', marginBottom: '2rem' }}>Our team will review your request and get back to you shortly with pricing.</p>
            <button className="btn-outline" onClick={() => { setSubmitted(false); navigate('/products'); }}>Continue Browsing</button>
          </div>
        )}
      </div>
      <div className={`toast ${toastMsg ? 'show' : ''}`}>✓ {toastMsg}</div>
    </div>
  );
}
