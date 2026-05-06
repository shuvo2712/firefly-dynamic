import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  useEffect(() => {
    document.title = '404 — Page Not Found | Firefly';
  }, []);

  return (
    <div className="page active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{
          fontSize: '8rem',
          fontFamily: "'Archivo Black', sans-serif",
          color: 'var(--primary)',
          lineHeight: 1,
          marginBottom: '1rem',
          opacity: 0.15,
        }}>404</div>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: 'var(--white)', marginBottom: '1rem' }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--steel)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn-primary">
            Go Home
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <Link to="/products" className="btn-outline-primary">Browse Products</Link>
        </div>
      </div>
    </div>
  );
}
