import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { AppContext } from '../context/AppContext';

export default function SampleRequest() {
  const { theme } = useContext(AppContext);
  const location = useLocation();
  const dropdownRef = useRef(null);
  
  const [selectedProduct, setSelectedProduct] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    document.title = 'Request a Sample | Firefly';
  }, []);

  useEffect(() => {
    if (location.state?.product) {
      setSelectedProduct(location.state.product);
    }
  }, [location.state]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const product = e.target['s-product'].value;
    const name = e.target['s-name'].value;
    const email = e.target['s-email'].value;

    if (!product || !name || !email) {
      setToastMsg('Please fill in all required fields.');
      setTimeout(() => setToastMsg(''), 3000);
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
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
              <div className="form-group" style={{ marginBottom: '1rem' }} ref={dropdownRef}>
                <label>Product *</label>
                
                <div className="custom-select-container">
                  <input type="hidden" name="s-product" value={selectedProduct} required />
                  
                  <div 
                    className="form-select custom-select-trigger" 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span style={{ color: selectedProduct ? 'var(--white)' : 'rgba(161, 161, 170, 0.45)' }}>
                      {selectedProduct || "Select a product..."}
                    </span>
                    <svg className={`select-arrow ${isDropdownOpen ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                  
                  <div className={`custom-select-options ${isDropdownOpen ? 'open' : ''}`}>
                    <div 
                      className={`custom-select-option ${selectedProduct === '' ? 'selected' : ''}`}
                      onClick={() => { setSelectedProduct(''); setIsDropdownOpen(false); }}
                    >
                      Select a product...
                    </div>
                    {PRODUCTS.map(p => (
                      <div 
                        key={p.id} 
                        className={`custom-select-option ${selectedProduct === p.name ? 'selected' : ''}`}
                        onClick={() => { setSelectedProduct(p.name); setIsDropdownOpen(false); }}
                      >
                        {p.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="s-name">Full Name *</label>
                  <input id="s-name" name="s-name" className="form-input" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="s-email">Email *</label>
                  <input id="s-email" name="s-email" className="form-input" type="email" placeholder="Your Email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="s-phone">Phone</label>
                  <input id="s-phone" name="s-phone" className="form-input" placeholder="0123456789" />
                </div>
                <div className="form-group">
                  <label htmlFor="s-company">Company</label>
                  <input id="s-company" name="s-company" className="form-input" placeholder="Your Company" />
                </div>
                <div className="form-group form-full">
                  <label htmlFor="s-address">Shipping Address</label>
                  <textarea id="s-address" name="s-address" className="form-textarea" placeholder="Full delivery address"></textarea>
                </div>
                <div className="form-group form-full">
                  <label htmlFor="s-message">Message</label>
                  <textarea id="s-message" name="s-message" className="form-textarea" placeholder="Any specific requirements or project context..."></textarea>
                </div>
              </div>
              <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: '100%', justifyContent: 'center', padding: '1rem', marginTop: '0.5rem', opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                {isSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', marginRight: '6px' }}>
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                    Submit Sample Request
                  </>
                )}
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
            <h3 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: '1.75rem', marginBottom: '0.75rem' }}>Sample Requested!</h3>
            <p style={{ color: 'var(--steel)', marginBottom: '2rem', lineHeight: 1.7 }}>Our team will review your request and get back to you within 24 hours with shipping details.</p>
            <button className="btn-outline" onClick={() => setSubmitted(false)}>Request Another Sample</button>
          </div>
        )}
      </div>
      <div className={`toast ${toastMsg ? 'show' : ''}`}>✓ {toastMsg}</div>
    </div>
  );
}
