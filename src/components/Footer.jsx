import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  const handleProductFilter = (cat) => {
    navigate('/products', { state: { category: cat } });
    window.scrollTo(0, 0);
  };

  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FDB813" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>FIREFLY</span>
          </div>
          <p>Premium electrical solutions for architects, contractors, and designers who demand excellence.</p>
        </div>
        <div className="footer-col">
          <h4>Navigate</h4>
          <Link to="/" onClick={() => window.scrollTo(0, 0)}>Home</Link>
          <Link to="/products" onClick={() => window.scrollTo(0, 0)}>Products</Link>
          <Link to="/quotation" onClick={() => window.scrollTo(0, 0)}>Quotation</Link>
          <Link to="/sample" onClick={() => window.scrollTo(0, 0)}>Request Sample</Link>
        </div>
        <div className="footer-col">
          <h4>Products</h4>
          <a href="#" onClick={(e) => { e.preventDefault(); handleProductFilter('single_switch'); }}>single switch</a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleProductFilter('dual_switch'); }}>dual switch</a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleProductFilter('multiple_switch'); }}>multiple switch</a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleProductFilter('fan_switch'); }}>fan switch</a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleProductFilter('sockets'); }}>sockets</a>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <div className="footer-contact-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            sales@firefly.com
          </div>
          <div className="footer-contact-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.71 3.49 2 2 0 0 1 3.67 1.25h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.81-.81a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16.92z" />
            </svg>
            01234356789
          </div>
          <div className="footer-contact-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Dhaka, Bangladesh
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Firefly Electric. All rights reserved.</p>
        <div className="footer-tagline">
          <span>Illuminating spaces since 2712</span>
          <div className="pulse-dot"></div>
        </div>
      </div>
    </footer>
  );
}
