import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PRODUCTS } from '../data/products';

export default function SampleRequest() {
  const location = useLocation();
  const [selectedProduct, setSelectedProduct] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    if (location.state?.product) {
      setSelectedProduct(location.state.product);
    }
  }, [location.state]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const product = e.target.product.value;
    const name = e.target.name.value;
    const email = e.target.email.value;

    if (!product || !name || !email) {
      setToastMsg('Please fill in all required fields.');
      setTimeout(() => setToastMsg(''), 3000);
      return;
    }
    setSubmitted(true);
  };

  return (
    <div id="page-sample" className="page active">
      <div className="page-inner" style={{ maxWidth: '640px' }}>
        <div className="section-heading">
          <span className="section-eyebrow">Experience Quality</span>
          <h2>Request a Sample</h2>
          <p>See and feel the quality firsthand. We'll ship physical samples directly to you.</p>
          <div className="divider"></div>
        </div>

        {!submitted ? (
          <div className="form-card">
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Product *</label>
                <select name="product" className="form-select" value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} required>
                  <option value="">Select a product...</option>
                  {PRODUCTS.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-grid">
                <div className="form-group"><label>Full Name *</label><input name="name" className="form-input" placeholder="Your Name" required /></div>
                <div className="form-group"><label>Email *</label><input name="email" className="form-input" type="email" placeholder="Your Email" required /></div>
                <div className="form-group"><label>Phone</label><input name="phone" className="form-input" placeholder="0123456789" /></div>
                <div className="form-group"><label>Company</label><input name="company" className="form-input" placeholder="Your Company" /></div>
                <div className="form-group form-full"><label>Shipping Address</label><textarea name="address" className="form-textarea" placeholder="Full delivery address"></textarea></div>
                <div className="form-group form-full"><label>Message</label><textarea name="message" className="form-textarea" placeholder="Any specific requirements or project context..."></textarea></div>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', marginTop: '0.5rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', marginRight: '6px' }}>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
                Submit Sample Request
              </button>
            </form>
          </div>
        ) : (
          <div className="success-state">
            <div className="success-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FDB813" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: '1.75rem', color: '#fff', marginBottom: '0.75rem' }}>Sample Requested!</h3>
            <p style={{ color: 'var(--steel)', marginBottom: '2rem', lineHeight: 1.7 }}>Our team will review your request and get back to you within 24 hours with shipping details.</p>
            <button className="btn-outline" onClick={() => setSubmitted(false)}>Request Another Sample</button>
          </div>
        )}
      </div>
      <div className={`toast ${toastMsg ? 'show' : ''}`}>✓ {toastMsg}</div>
    </div>
  );
}
