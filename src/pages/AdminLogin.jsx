import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Admin Login | Firefly';
    if (localStorage.getItem('firefly_admin_token')) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost/firefly-api';
    try {
      const res = await fetch(`${apiBase}/admin_login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('firefly_admin_token', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Incorrect password.');
      }
    } catch {
      setError('Could not connect to server. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aL-root">
      {/* Left decorative panel */}
      <div className="aL-left">
        <div className="aL-left-content">
          <div className="aL-brand">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FDB813" strokeWidth="1.8">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span>Firefly</span>
          </div>
          <h1 className="aL-headline">Manage your store with confidence.</h1>
          <p className="aL-tagline">Products · Quotations · Sample Requests — all in one place.</p>
          <div className="aL-features">
            {['Full product management','Real-time order tracking','Status workflow control'].map((f, i) => (
              <div className="aL-feature" key={i}>
                <span className="aL-feature-dot" />
                {f}
              </div>
            ))}
          </div>
        </div>
        <div className="aL-glow" />
      </div>

      {/* Right login panel */}
      <div className="aL-right">
        <div className="aL-card">
          <div className="aL-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="aL-title">Admin Access</h2>
          <p className="aL-sub">Enter your credentials to continue.</p>

          <form onSubmit={handleSubmit} className="aL-form">
            <div className="aL-field">
              <label htmlFor="admin-password">Password</label>
              <div className="aL-input-wrap">
                <svg className="aL-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="admin-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  autoFocus
                />
                <button type="button" className="aL-show-pass" onClick={() => setShowPass(v => !v)} tabIndex={-1}>
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="aL-error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <button type="submit" className="aL-btn" disabled={loading}>
              {loading ? (
                <><span className="aL-spinner" /> Verifying…</>
              ) : (
                <>Login to Dashboard <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
