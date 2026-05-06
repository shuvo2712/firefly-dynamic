import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/products';

export default function Home() {
  const navigate = useNavigate();
  const featured = PRODUCTS.filter(p => p.featured);

  const handleCategoryClick = (cat) => {
    navigate('/products', { state: { category: cat } });
    window.scrollTo(0, 0);
  };

  return (
    <div id="page-home" className="page active">
      {/* Hero */}
      <div className="hero">
        <div className="hero-bg">
          <img src="/assests/hero-bg.png" alt="Premium Switchboard" />
          <div></div>
        </div>
        <div className="hero-grid-lines">
          <div className="hero-grid-line"></div>
          <div className="hero-grid-line"></div>
        </div>
        <div className="hero-content">
          <div className="hero-eyebrow">
            <div className="line"></div>
            <span>Premium Electrical Wholesale</span>
          </div>
          <h1>Switches<br /><span className="accent">Engineered</span><br />to Perfection</h1>
          <p className="hero-desc">Curating premium, precision-engineered switchboards for architects and contractors who refuse to compromise.</p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => navigate('/products')}>
              Explore Collection
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button className="btn-outline-primary" onClick={() => navigate('/quotation')}>Request Quotation</button>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-line"></div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats">
        <div className="stats-inner">
          <div className="stat"><span className="stat-value">500+</span><span className="stat-label">Products</span></div>
          <div className="stat"><span className="stat-value">2000+</span><span className="stat-label">Projects Served</span></div>
          <div className="stat"><span className="stat-value">15+</span><span className="stat-label">Years Experience</span></div>
          <div className="stat"><span className="stat-value">98%</span><span className="stat-label">Client Satisfaction</span></div>
        </div>
      </div>

      {/* Categories */}
      <section className="categories">
        <div className="categories-inner">
          <div className="section-heading">
            <span className="section-eyebrow">Our Expertise</span>
            <h2>Curated Categories</h2>
            <p>Three pillars of electrical excellence, each defined by uncompromising quality and precision design.</p>
            <div className="divider"></div>
          </div>
          <div className="cat-grid">
            <div className="prod-card" onClick={() => handleCategoryClick('dual_switch')}>
              <div className="prod-img">
                <img src="/assests/products/firefly 2b.jpeg" alt="dual switch" />
                <div className="prod-img-overlay"></div>
                <div className="prod-info">
                  <span className="prod-cat">Category 01</span>
                  <h3 className="prod-name">Dual Switch</h3>
                  <p className="prod-watt" style={{ marginTop: '0.5rem' }}>Elegant two-gang controls for versatility and style.</p>
                  <div className="prod-cta">View Collection <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></div>
                </div>
              </div>
            </div>
            <div className="prod-card" onClick={() => handleCategoryClick('fan_switch')}>
              <div className="prod-img">
                <img src="/assests/products/firefly fb.jpeg" alt="fan switch" />
                <div className="prod-img-overlay"></div>
                <div className="prod-info">
                  <span className="prod-cat">Category 02</span>
                  <h3 className="prod-name">Fan Switch</h3>
                  <p className="prod-watt" style={{ marginTop: '0.5rem' }}>Smooth speed control and durability.</p>
                  <div className="prod-cta">View Collection <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></div>
                </div>
              </div>
            </div>
            <div className="prod-card" onClick={() => handleCategoryClick('sockets')}>
              <div className="prod-img">
                <img src="/assests/products/firefly sb.jpeg" alt="sockets" />
                <div className="prod-img-overlay"></div>
                <div className="prod-info">
                  <span className="prod-cat">Category 03</span>
                  <h3 className="prod-name">Sockets</h3>
                  <p className="prod-watt" style={{ marginTop: '0.5rem' }}>Universal multi-sockets, premium finish.</p>
                  <div className="prod-cta">View Collection <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured">
        <div className="featured-inner">
          <div className="section-heading">
            <span className="section-eyebrow">Handpicked</span>
            <h2>Featured Products</h2>
            <p>Our most sought-after pieces, chosen for exceptional quality and design.</p>
            <div className="divider"></div>
          </div>
          <div className="prod-grid">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-glow"></div>
        <span className="section-eyebrow">Ready to Transform Your Project?</span>
        <h2>Let's Build<br />Something Brilliant</h2>
        <p>Request a custom quotation or get physical samples delivered to your site. We make wholesale effortless.</p>
        <div className="cta-btns">
          <button className="btn-primary" style={{ padding: '1rem 2.5rem' }} onClick={() => navigate('/quotation')}>
            Build Quotation
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
          <button className="btn-outline-primary" onClick={() => navigate('/sample')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Request Samples
          </button>
        </div>
      </section>
    </div>
  );
}
