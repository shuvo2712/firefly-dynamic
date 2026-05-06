import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { PRODUCTS, CAT_LABELS } from '../data/products';

export default function Products() {
  const location = useLocation();
  const [currentFilter, setCurrentFilter] = useState('all');

  useEffect(() => {
    if (location.state?.category) {
      setCurrentFilter(location.state.category);
    }
  }, [location.state]);

  const filteredProducts = PRODUCTS.filter(p => {
    return currentFilter === 'all' || p.category === currentFilter;
  });

  return (
    <div id="page-products" className="page active">
      <div className="page-inner">
        <div className="section-heading" style={{ textAlign: 'left', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
          <span className="section-eyebrow" style={{ textAlign: 'left' }}>The Collection</span>
          <h2>Our Products</h2>
          <div className="divider" style={{ margin: '0.75rem 0 0' }}></div>
        </div>
        <div className="filter-bar">
          <button className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`} onClick={() => setCurrentFilter('all')}>All Products</button>
          {Object.entries(CAT_LABELS).map(([key, label]) => (
            <button key={key} className={`filter-btn ${currentFilter === key ? 'active' : ''}`} onClick={() => setCurrentFilter(key)}>
              {label}
            </button>
          ))}
        </div>
        <div className="prod-grid">
          {filteredProducts.length ? (
            filteredProducts.map(p => <ProductCard key={p.id} product={p} />)
          ) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--steel)' }}>No products found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
