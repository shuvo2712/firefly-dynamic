import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const API = () => import.meta.env.VITE_API_BASE_URL || 'http://localhost/firefly-api';

const CAT_LABELS = {
  single_switch: 'Single Switch',
  dual_switch: 'Dual Switch',
  multiple_switch: 'Multiple Switch',
  fan_switch: 'Fan Switch',
  sockets: 'Sockets',
};
const CATEGORIES = Object.keys(CAT_LABELS);

const STATUS_STYLE = {
  Pending:   { background: 'rgba(251,191,36,0.12)', color: '#fbbf24' },
  Completed: { background: 'rgba(34,197,94,0.12)',  color: '#22c55e' },
  Rejected:  { background: 'rgba(239,68,68,0.12)',  color: '#ef4444' },
};

const EMPTY = { name:'', category:'single_switch', description:'', specifications:'', wattage:'N/A', material:'Tempered Glass', price_range:'', featured:0, image_url:'' };

function authHeaders() {
  return { 'Content-Type': 'application/json', 'X-Admin-Token': localStorage.getItem('firefly_admin_token') || '' };
}

/* ── Icons ── */
const Icon = {
  dashboard: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  products:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  quotation: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  samples:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><polyline points="16 3 12 7 8 3"/></svg>,
  logout:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  plus:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  close:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
};

const TABS = [
  { key: 'dashboard', label: 'Dashboard', icon: Icon.dashboard },
  { key: 'products',  label: 'Products',  icon: Icon.products },
  { key: 'quotations',label: 'Quotations',icon: Icon.quotation },
  { key: 'samples',   label: 'Samples',   icon: Icon.samples },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab]           = useState('dashboard');
  const [data, setData]         = useState({ quotations:[], samples:[], products:[] });
  const [loading, setLoading]   = useState(true);
  const [toast, setToast]       = useState(null);
  const [productModal, setProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm]       = useState(EMPTY);
  const [saving, setSaving]     = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API()}/get_admin_data.php`, { headers: authHeaders() });
      if (res.status === 401) {
        localStorage.removeItem('firefly_admin_token');
        window.location.href = '/admin';
        return;
      }
      const text = await res.text();
      if (!text) throw new Error('Empty response from server.');
      const json = JSON.parse(text);
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (e) {
      showToast('Failed to load data: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    document.title = 'Admin Dashboard | Firefly';
    if (!localStorage.getItem('firefly_admin_token')) { navigate('/admin'); return; }
    fetchData();
  }, [fetchData, navigate]);

  const handleLogout = () => { localStorage.removeItem('firefly_admin_token'); navigate('/admin'); };

  const handleStatus = async (table, id, status) => {
    try {
      const res = await fetch(`${API()}/update_status.php`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ table, id, status }),
      });
      const json = await res.json();
      if (json.success) { showToast('Status updated to ' + status); fetchData(); }
      else showToast('Error: ' + (json.error || 'Unknown'), 'error');
    } catch { showToast('Network error', 'error'); }
  };

  const openAdd = () => { setEditingProduct(null); setProductForm(EMPTY); setProductModal(true); };
  const openEdit = (p) => {
    setEditingProduct(p);
    setProductForm({ name:p.name||'', category:p.category||'single_switch', description:p.description||'', specifications:p.specifications||'', wattage:p.wattage||'N/A', material:p.material||'Tempered Glass', price_range:p.price_range||'', featured:p.featured?1:0, image_url:p.image_url||'' });
    setProductModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm(f => ({ ...f, [name]: type === 'checkbox' ? (checked ? 1 : 0) : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { action: editingProduct ? 'edit' : 'add', ...productForm };
    if (editingProduct) payload.id = editingProduct.id;
    try {
      const res = await fetch(`${API()}/manage_product.php`, {
        method: 'POST', headers: authHeaders(), body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        showToast(editingProduct ? 'Product updated!' : 'Product added!');
        setProductModal(false);
        fetchData();
      } else {
        showToast('Error: ' + (json.error || 'Unknown'), 'error');
      }
    } catch { showToast('Network error', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API()}/manage_product.php`, {
        method: 'POST', headers: authHeaders(), body: JSON.stringify({ action:'delete', id }),
      });
      const json = await res.json();
      if (json.success) { showToast('Product deleted.'); setDeleteId(null); fetchData(); }
      else showToast('Error: ' + (json.error || 'Unknown'), 'error');
    } catch { showToast('Network error', 'error'); }
  };

  const pendingQ = data.quotations.filter(q => q.status === 'Pending').length;
  const pendingS = data.samples.filter(s => s.status === 'Pending').length;

  return (
    <div className="ad-root">
      {/* Sidebar */}
      <aside className="ad-sidebar">
        <div className="ad-brand">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
          <div>
            <div className="ad-brand-name">Firefly</div>
            <div className="ad-brand-role">Admin Panel</div>
          </div>
        </div>

        <div className="ad-nav-section">
          <div className="ad-nav-label">NAVIGATION</div>
          {TABS.map(t => (
            <button key={t.key} className={`ad-nav-btn ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
              <span className="ad-nav-icon">{t.icon}</span>
              <span>{t.label}</span>
              {t.key === 'quotations' && pendingQ > 0 && <span className="ad-badge">{pendingQ}</span>}
              {t.key === 'samples' && pendingS > 0 && <span className="ad-badge">{pendingS}</span>}
            </button>
          ))}
        </div>

        <div className="ad-sidebar-footer">
          <div className="ad-sidebar-user">
            <div className="ad-avatar">A</div>
            <div>
              <div className="ad-user-name">Administrator</div>
              <div className="ad-user-role">Full Access</div>
            </div>
          </div>
          <button className="ad-logout" onClick={handleLogout} title="Logout">{Icon.logout}</button>
        </div>
      </aside>

      {/* Main */}
      <div className="ad-main">
        {/* Top bar */}
        <header className="ad-topbar">
          <div className="ad-topbar-title">
            {TABS.find(t => t.key === tab)?.icon}
            <span>{TABS.find(t => t.key === tab)?.label}</span>
          </div>
          {tab === 'products' && (
            <button className="ad-btn-primary" onClick={openAdd}>
              {Icon.plus} Add Product
            </button>
          )}
        </header>

        {/* Content */}
        <div className="ad-content">
          {loading ? (
            <div className="ad-loading">
              <div className="ad-spin" />
              <span>Loading data…</span>
            </div>
          ) : (
            <>
              {/* ── Dashboard ── */}
              {tab === 'dashboard' && (
                <div className="ad-section">
                  <div className="ad-stat-grid">
                    <div className="ad-stat" onClick={() => setTab('products')} style={{cursor:'pointer'}}>
                      <div className="ad-stat-head"><span className="ad-stat-icon-wrap" style={{background:'rgba(99,102,241,0.12)',color:'#818cf8'}}>{Icon.products}</span></div>
                      <div className="ad-stat-num">{data.products.length}</div>
                      <div className="ad-stat-lbl">Total Products</div>
                    </div>
                    <div className="ad-stat" onClick={() => setTab('quotations')} style={{cursor:'pointer'}}>
                      <div className="ad-stat-head"><span className="ad-stat-icon-wrap" style={{background:'rgba(253,184,19,0.12)',color:'var(--primary)'}}>{Icon.quotation}</span></div>
                      <div className="ad-stat-num">{data.quotations.length}</div>
                      <div className="ad-stat-lbl">Total Quotations</div>
                      {pendingQ > 0 && <div className="ad-stat-alert">{pendingQ} pending</div>}
                    </div>
                    <div className="ad-stat" onClick={() => setTab('samples')} style={{cursor:'pointer'}}>
                      <div className="ad-stat-head"><span className="ad-stat-icon-wrap" style={{background:'rgba(34,197,94,0.12)',color:'#22c55e'}}>{Icon.samples}</span></div>
                      <div className="ad-stat-num">{data.samples.length}</div>
                      <div className="ad-stat-lbl">Sample Requests</div>
                      {pendingS > 0 && <div className="ad-stat-alert">{pendingS} pending</div>}
                    </div>
                  </div>

                  {/* Quick summary */}
                  {(pendingQ > 0 || pendingS > 0) && (
                    <div className="ad-alert-banner">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      You have {pendingQ + pendingS} pending request{(pendingQ+pendingS)>1?'s':''} that need attention.
                    </div>
                  )}
                </div>
              )}

              {/* ── Products ── */}
              {tab === 'products' && (
                <div className="ad-section">
                  {data.products.length === 0 ? (
                    <div className="ad-empty">
                      {Icon.products}
                      <p>No products yet.</p>
                      <button className="ad-btn-primary" onClick={openAdd}>{Icon.plus} Add your first product</button>
                    </div>
                  ) : (
                    <div className="ad-table-card">
                      <table className="ad-table">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Featured</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.products.map(p => (
                            <tr key={p.id}>
                              <td>
                                <div className="ad-prod-cell">
                                  <img src={p.image_url} alt={p.name} className="ad-thumb"
                                    onError={e => { e.target.style.background='var(--muted)'; e.target.style.objectFit='none'; }} />
                                  <span className="ad-prod-name">{p.name}</span>
                                </div>
                              </td>
                              <td><span className="ad-tag">{CAT_LABELS[p.category] || p.category}</span></td>
                              <td className="ad-price">{p.price_range || '—'}</td>
                              <td>
                                {p.featured == 1
                                  ? <span className="ad-featured-yes">{Icon.check} Featured</span>
                                  : <span className="ad-featured-no">—</span>}
                              </td>
                              <td>
                                <div className="ad-row-actions">
                                  <button className="ad-row-btn ad-row-edit" onClick={() => openEdit(p)}>{Icon.edit} Edit</button>
                                  <button className="ad-row-btn ad-row-del" onClick={() => setDeleteId(p.id)}>{Icon.trash}</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ── Quotations ── */}
              {tab === 'quotations' && (
                <div className="ad-section">
                  {data.quotations.length === 0 ? (
                    <div className="ad-empty">{Icon.quotation}<p>No quotation requests yet.</p></div>
                  ) : data.quotations.map(q => (
                    <div key={q.id} className="ad-card">
                      <div className="ad-card-top">
                        <div className="ad-card-avatar">{(q.customer_name||'?')[0].toUpperCase()}</div>
                        <div className="ad-card-info">
                          <div className="ad-card-name">{q.customer_name}</div>
                          <div className="ad-card-meta">{q.customer_email} · {new Date(q.created_at).toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric'})}</div>
                        </div>
                        <span className="ad-status-chip" style={STATUS_STYLE[q.status] || {}}>{q.status}</span>
                      </div>

                      {Array.isArray(q.items) && q.items.length > 0 && (
                        <div className="ad-items">
                          <div className="ad-items-head">Cart Items</div>
                          {q.items.map((item, i) => (
                            <div key={i} className="ad-item-row">
                              <span>{item.name || item.product_name || 'Item'}</span>
                              <span className="ad-item-qty">× {item.qty || item.quantity || 1}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="ad-status-row">
                        <span className="ad-status-label">Update Status</span>
                        <div className="ad-status-btns">
                          {['Pending','Completed','Rejected'].map(s => (
                            <button key={s}
                              className={`ad-status-btn ${q.status === s ? 'sel' : ''}`}
                              style={q.status === s ? STATUS_STYLE[s] : {}}
                              onClick={() => handleStatus('quotations', q.id, s)}>
                              {q.status === s && Icon.check}{s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Samples ── */}
              {tab === 'samples' && (
                <div className="ad-section">
                  {data.samples.length === 0 ? (
                    <div className="ad-empty">{Icon.samples}<p>No sample requests yet.</p></div>
                  ) : data.samples.map(s => (
                    <div key={s.id} className="ad-card">
                      <div className="ad-card-top">
                        <div className="ad-card-avatar">{(s.name||'?')[0].toUpperCase()}</div>
                        <div className="ad-card-info">
                          <div className="ad-card-name">{s.name}</div>
                          <div className="ad-card-meta">{s.email} · {new Date(s.created_at).toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric'})}</div>
                        </div>
                        <span className="ad-status-chip" style={STATUS_STYLE[s.status] || {}}>{s.status}</span>
                      </div>

                      <div className="ad-items">
                        <div className="ad-items-head">Request Details</div>
                        <div className="ad-item-row"><span>Product</span><span>{s.product_name}</span></div>
                        {s.address && <div className="ad-item-row"><span>Address</span><span>{s.address}</span></div>}
                        {s.message && <div className="ad-item-row"><span>Message</span><span>{s.message}</span></div>}
                      </div>

                      <div className="ad-status-row">
                        <span className="ad-status-label">Update Status</span>
                        <div className="ad-status-btns">
                          {['Pending','Completed','Rejected'].map(st => (
                            <button key={st}
                              className={`ad-status-btn ${s.status === st ? 'sel' : ''}`}
                              style={s.status === st ? STATUS_STYLE[st] : {}}
                              onClick={() => handleStatus('sample_requests', s.id, st)}>
                              {s.status === st && Icon.check}{st}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {productModal && (
        <div className="ad-overlay" onClick={() => setProductModal(false)}>
          <div className="ad-modal" onClick={e => e.stopPropagation()}>
            <div className="ad-modal-hd">
              <h3>{editingProduct ? 'Edit Product' : 'New Product'}</h3>
              <button className="ad-modal-x" onClick={() => setProductModal(false)}>{Icon.close}</button>
            </div>
            <form onSubmit={handleSave} className="ad-modal-body">
              <div className="ad-grid2">
                <div className="ad-mfield ad-full">
                  <label>Product Name *</label>
                  <input name="name" value={productForm.name} onChange={handleFormChange} required placeholder="e.g. Obsidian Single Switch" />
                </div>
                <div className="ad-mfield">
                  <label>Category *</label>
                  <select name="category" value={productForm.category} onChange={handleFormChange} required>
                    {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
                  </select>
                </div>
                <div className="ad-mfield">
                  <label>Price Range</label>
                  <input name="price_range" value={productForm.price_range} onChange={handleFormChange} placeholder="e.g. $150" />
                </div>
                <div className="ad-mfield ad-full">
                  <label>Description</label>
                  <textarea name="description" value={productForm.description} onChange={handleFormChange} rows={3} placeholder="Short product description…" />
                </div>
                <div className="ad-mfield ad-full">
                  <label>Specifications</label>
                  <textarea name="specifications" value={productForm.specifications} onChange={handleFormChange} rows={3} placeholder={'e.g. Modules: 1\nPanel: Tempered Glass\nColor: Black'} />
                </div>
                <div className="ad-mfield">
                  <label>Wattage</label>
                  <input name="wattage" value={productForm.wattage} onChange={handleFormChange} placeholder="e.g. N/A" />
                </div>
                <div className="ad-mfield">
                  <label>Material</label>
                  <input name="material" value={productForm.material} onChange={handleFormChange} placeholder="e.g. Tempered Glass" />
                </div>
                <div className="ad-mfield ad-full">
                  <label>Image URL</label>
                  <input name="image_url" value={productForm.image_url} onChange={handleFormChange} placeholder="e.g. /images/products/firefly 1b.jpeg" />
                  {productForm.image_url && (
                    <img src={productForm.image_url} alt="preview" className="ad-preview-img"
                      onError={e => e.target.style.display='none'} />
                  )}
                </div>
                <div className="ad-mfield">
                  <label className="ad-check-label">
                    <input type="checkbox" name="featured" checked={productForm.featured==1} onChange={handleFormChange} />
                    <span>Show on Homepage as Featured</span>
                  </label>
                </div>
              </div>
              <div className="ad-modal-ft">
                <button type="button" className="ad-btn-ghost" onClick={() => setProductModal(false)}>Cancel</button>
                <button type="submit" className="ad-btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : (editingProduct ? 'Save Changes' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="ad-overlay" onClick={() => setDeleteId(null)}>
          <div className="ad-modal ad-modal-sm" onClick={e => e.stopPropagation()}>
            <div className="ad-del-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </div>
            <h3 className="ad-del-title">Delete Product?</h3>
            <p className="ad-del-sub">This action is permanent and cannot be undone.</p>
            <div className="ad-del-actions">
              <button className="ad-btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="ad-btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`ad-toast ${toast.type === 'error' ? 'ad-toast-err' : ''}`}>
          {toast.type === 'error'
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
