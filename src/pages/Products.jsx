import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { PRODUCTS, CAT_LABELS } from '../data/products';

export default function Products() {
  const location = useLocation();
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'Products | Firefly';
  }, []);

  useEffect(() => {
    if (location.state?.category) {
      setCurrentFilter(location.state.category);
    } else {
      setCurrentFilter('all');
    }
    setSearchQuery('');
  }, [location.state]);

  const filteredProducts = PRODUCTS.filter(p => {
    const catMatch = currentFilter === 'all' || p.category === currentFilter;
    const searchMatch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && searchMatch;
  });

  return (
    <div id="page-products" className="page active">
      <div className="page-inner">
        <div className="section-heading" style={{ textAlign: 'left', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
          <span className="section-eyebrow" style={{ textAlign: 'left' }}>The Collection</span>
          <h2>Our Products</h2>
          <div className="divider" style={{ margin: '0.75rem 0 0' }}></div>
        </div>

        {/* Search */}
        <div className="search-bar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="product-search"
            className="search-input"
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            aria-label="Search products"
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <button className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`} onClick={() => setCurrentFilter('all')}>All Products</button>
          {Object.entries(CAT_LABELS).map(([key, label]) => (
            <button key={key} className={`filter-btn ${currentFilter === key ? 'active' : ''}`} onClick={() => setCurrentFilter(key)}>
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="prod-grid">
          {filteredProducts.length ? (
            filteredProducts.map(p => <ProductCard key={p.id} product={p} />)
          ) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--steel)' }}>
              {searchQuery ? `No products matching "${searchQuery}".` : 'No products found.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
