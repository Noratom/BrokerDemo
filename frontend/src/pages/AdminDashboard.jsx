import React, { useState, useEffect } from 'react';
import { Users, BarChart3, Settings, MessageSquare, Shield, DollarSign, TrendingUp, Activity, Search, Edit3, Check, X, RefreshCw } from 'lucide-react';

export default function AdminDashboard({ currentUser, onLogout, setActivePage }) {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [allTrades, setAllTrades] = useState([]);
  const [messages, setMessages] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editBalance, setEditBalance] = useState('');
  const [overrideSymbol, setOverrideSymbol] = useState('EUR/USD');
  const [overridePrice, setOverridePrice] = useState('');
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAll = async () => {
    try {
      const [uRes, tRes, mRes, cRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/users'),
        fetch('http://localhost:5000/api/admin/trades'),
        fetch('http://localhost:5000/api/markets'),
        fetch('http://localhost:5000/api/admin/messages')
      ]);
      if (uRes.ok) { const r = await uRes.json(); setUsers(r.data); }
      if (tRes.ok) { const r = await tRes.json(); setAllTrades(r.data); }
      if (mRes.ok) { const r = await mRes.json(); setMarkets(r.data); }
      if (cRes.ok) { const r = await cRes.json(); setMessages(r.data); }
    } catch (e) {}
  };

  const showNotif = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleBalanceUpdate = async (userId) => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newBalance: Number(editBalance) })
      });
      if (response.ok) {
        showNotif('success', 'Balance updated successfully.');
        setEditingUser(null);
        fetchAll();
      }
    } catch (e) {
      showNotif('error', 'Failed to update balance.');
    }
  };

  const handlePriceOverride = async () => {
    if (!overridePrice) return;
    try {
      const response = await fetch('http://localhost:5000/api/admin/markets/override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: overrideSymbol, price: Number(overridePrice) })
      });
      if (response.ok) {
        showNotif('success', `${overrideSymbol} price overridden to $${Number(overridePrice).toLocaleString()}`);
        setOverridePrice('');
        fetchAll();
      }
    } catch (e) {
      showNotif('error', 'Failed to override price.');
    }
  };

  const sidebarItems = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'trades', label: 'Trade Ledger', icon: BarChart3 },
    { id: 'markets', label: 'Market Control', icon: TrendingUp },
    { id: 'messages', label: 'Support Inbox', icon: MessageSquare },
  ];

  const clientUsers = users.filter(u => u.role === 'client');
  const filteredUsers = clientUsers.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalVolume = allTrades.reduce((acc, t) => acc + (t.size * t.entryPrice), 0);
  const totalClientFunds = clientUsers.reduce((acc, u) => acc + u.balance, 0);

  return (
    <div className="admin-dash page-enter">
      {notification && (
        <div className={`admin-notif ${notification.type === 'success' ? 'notif-success' : 'notif-error'}`}>
          {notification.type === 'success' ? <Check size={16} /> : <X size={16} />}
          {notification.text}
        </div>
      )}

      <div className="dash-layout">
        {/* Sidebar */}
        <aside className="dash-sidebar admin-sidebar">
          <div className="dash-sidebar-profile">
            <div className="dash-avatar admin-avatar">
              <Shield size={18} />
            </div>
            <div>
              <div className="dash-user-name">Admin Panel</div>
              <div className="text-xs text-muted">System Administrator</div>
            </div>
          </div>

          <nav className="dash-nav">
            {sidebarItems.map(item => {
              const Icon = item.icon;
              return (
                <button key={item.id} className={`dash-nav-btn ${activeTab === item.id ? 'active' : ''}`} onClick={() => setActiveTab(item.id)}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {item.id === 'messages' && messages.length > 0 && (
                    <span className="nav-badge">{messages.length}</span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="dash-sidebar-actions">
            <button className="dash-nav-btn" onClick={() => setActivePage('home')}>
              <Activity size={18} /><span>Back to Site</span>
            </button>
            <button className="dash-nav-btn logout-btn" onClick={onLogout}>
              <X size={18} /><span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="dash-main">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-6" style={{ marginBottom: '2.5rem' }}>
            <div className="card card-static dash-metric">
              <div className="dash-metric-icon" style={{ background: 'var(--color-blue-soft)' }}>
                <Users size={20} style={{ color: 'var(--color-blue-royal)' }} />
              </div>
              <span className="text-xs text-muted uppercase font-label">Registered Clients</span>
              <h3 className="font-mono" style={{ fontSize: '1.4rem' }}>{clientUsers.length}</h3>
            </div>
            <div className="card card-static dash-metric">
              <div className="dash-metric-icon" style={{ background: 'var(--color-gold-light)' }}>
                <DollarSign size={20} style={{ color: 'var(--color-gold)' }} />
              </div>
              <span className="text-xs text-muted uppercase font-label">Total Client Funds</span>
              <h3 className="font-mono" style={{ fontSize: '1.4rem' }}>${totalClientFunds.toLocaleString()}</h3>
            </div>
            <div className="card card-static dash-metric">
              <div className="dash-metric-icon" style={{ background: 'var(--color-success-bg)' }}>
                <BarChart3 size={20} style={{ color: 'var(--color-success)' }} />
              </div>
              <span className="text-xs text-muted uppercase font-label">Open Trades</span>
              <h3 className="font-mono" style={{ fontSize: '1.4rem' }}>{allTrades.length}</h3>
            </div>
            <div className="card card-static dash-metric">
              <div className="dash-metric-icon" style={{ background: 'var(--color-blue-mist)' }}>
                <Activity size={20} style={{ color: 'var(--color-blue-deep)' }} />
              </div>
              <span className="text-xs text-muted uppercase font-label">Trade Volume</span>
              <h3 className="font-mono" style={{ fontSize: '1.4rem' }}>${totalVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'users' && (
            <div className="page-enter">
              <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                <h2>Client Accounts</h2>
                <div className="input-wrapper" style={{ width: '280px' }}>
                  <Search size={16} className="input-icon" />
                  <input className="form-input form-input-icon text-sm" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr><th>Name</th><th>Email</th><th>Balance</th><th>Account ID</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id}>
                        <td className="font-label">{u.name}</td>
                        <td className="text-muted">{u.email}</td>
                        <td>
                          {editingUser === u.id ? (
                            <div className="flex items-center gap-2">
                              <input type="number" className="form-input text-sm" style={{ width: '120px', padding: '0.4rem 0.6rem' }} value={editBalance} onChange={(e) => setEditBalance(e.target.value)} />
                              <button className="btn btn-sm btn-primary" onClick={() => handleBalanceUpdate(u.id)} style={{ padding: '0.4rem 0.6rem' }}><Check size={14} /></button>
                              <button className="btn btn-sm btn-secondary" onClick={() => setEditingUser(null)} style={{ padding: '0.4rem 0.6rem' }}><X size={14} /></button>
                            </div>
                          ) : (
                            <span className="font-mono" style={{ fontWeight: 600 }}>${u.balance.toLocaleString()}</span>
                          )}
                        </td>
                        <td className="font-mono text-xs text-muted">{u.id}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="btn btn-sm btn-secondary" onClick={() => { setEditingUser(u.id); setEditBalance(u.balance); }}>
                            <Edit3 size={14} /> Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'trades' && (
            <div className="page-enter">
              <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                <h2>Global Trade Ledger</h2>
                <button className="btn btn-sm btn-secondary" onClick={fetchAll}><RefreshCw size={14} /> Refresh</button>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr><th>Trade ID</th><th>User</th><th>Asset</th><th>Direction</th><th>Size</th><th>Entry Price</th><th>Time</th></tr>
                  </thead>
                  <tbody>
                    {allTrades.length > 0 ? allTrades.map(t => (
                      <tr key={t.id}>
                        <td className="font-mono text-xs text-muted">{t.id}</td>
                        <td className="font-label">{t.userId}</td>
                        <td className="font-label">{t.symbol}</td>
                        <td><span className={`type-badge ${t.type === 'BUY' ? 'badge-buy' : 'badge-sell'}`}>{t.type}</span></td>
                        <td className="font-mono">{t.size}</td>
                        <td className="font-mono">{t.entryPrice.toLocaleString()}</td>
                        <td className="text-xs text-muted">{new Date(t.timestamp).toLocaleString()}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan="7" className="text-center text-muted" style={{ padding: '3rem' }}>No active trades in the system.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'markets' && (
            <div className="page-enter">
              <h2 style={{ marginBottom: '0.5rem' }}>Market Control Panel</h2>
              <p className="text-muted text-sm" style={{ marginBottom: '2rem' }}>Override asset prices in real-time. Changes propagate immediately to all connected clients.</p>

              <div className="card card-static card-gold-accent" style={{ maxWidth: '500px', marginBottom: '2.5rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>Price Override</h4>
                <div className="form-group">
                  <label className="form-label">Select Asset</label>
                  <select className="form-input" value={overrideSymbol} onChange={(e) => setOverrideSymbol(e.target.value)}>
                    {markets.map(m => <option key={m.symbol} value={m.symbol}>{m.symbol} — {m.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">New Price ($)</label>
                  <input type="number" step="0.0001" className="form-input font-mono" placeholder="Enter price..." value={overridePrice} onChange={(e) => setOverridePrice(e.target.value)} />
                </div>
                <button className="btn btn-gold" onClick={handlePriceOverride}>Apply Override</button>
              </div>

              <h4 style={{ marginBottom: '1rem' }}>Live Market State</h4>
              <div className="grid grid-cols-3 gap-4">
                {markets.map(m => (
                  <div key={m.symbol} className="card card-static" style={{ padding: '1.25rem' }}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-label">{m.symbol}</div>
                        <div className="text-xs text-muted">{m.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono" style={{ fontWeight: 700, fontSize: '1.1rem' }}>${m.price.toLocaleString()}</div>
                        <span className={`text-xs ${m.change >= 0 ? 'text-success' : 'text-danger'}`}>
                          {m.change >= 0 ? '+' : ''}{m.change.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="page-enter">
              <h2 style={{ marginBottom: '2rem' }}>Support Inbox ({messages.length})</h2>
              {messages.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {messages.map((m, i) => (
                    <div key={i} className="card card-static" style={{ padding: '1.5rem' }}>
                      <div className="flex justify-between items-center" style={{ marginBottom: '0.75rem' }}>
                        <div>
                          <span className="font-label">{m.name}</span>
                          <span className="text-muted text-sm"> — {m.email}</span>
                        </div>
                        <span className="text-xs text-muted">{m.subject || 'No subject'}</span>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--color-text-body)' }}>{m.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No messages received yet.</p>
              )}
            </div>
          )}
        </main>
      </div>

      <style>{`
        .admin-dash { min-height: 100vh; background: var(--color-bg); }
        .admin-sidebar { background: var(--color-blue-deep) !important; border-right: none !important; }
        .admin-sidebar .dash-sidebar-profile { border-bottom-color: rgba(255,255,255,0.1); }
        .admin-sidebar .dash-user-name { color: var(--color-white); }
        .admin-sidebar .dash-sidebar-profile .text-muted { color: rgba(255,255,255,0.5) !important; }
        .admin-avatar {
          background: linear-gradient(135deg, var(--color-gold), var(--color-gold-bright)) !important;
          color: var(--color-blue-deep) !important;
        }
        .admin-sidebar .dash-nav-btn {
          color: rgba(255,255,255,0.6);
        }
        .admin-sidebar .dash-nav-btn:hover {
          background: rgba(255,255,255,0.08);
          color: var(--color-white);
        }
        .admin-sidebar .dash-nav-btn.active {
          background: rgba(255,255,255,0.12);
          color: var(--color-white);
          border-left: 3px solid var(--color-gold-bright);
        }
        .admin-sidebar .dash-sidebar-actions { border-top-color: rgba(255,255,255,0.1); }
        .admin-sidebar .logout-btn:hover { background: rgba(239,68,68,0.15) !important; color: #fca5a5 !important; }
        .nav-badge {
          margin-left: auto;
          background: var(--color-danger);
          color: white;
          font-size: 0.65rem;
          font-weight: 800;
          width: 18px; height: 18px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .admin-notif {
          position: fixed; top: 20px; right: 20px; z-index: 1001;
          padding: 0.75rem 1.25rem; border-radius: var(--radius-md);
          display: flex; align-items: center; gap: 0.5rem;
          box-shadow: var(--shadow-lg);
          animation: slideIn 0.3s ease-out;
          font-size: 0.9rem; font-weight: 500;
        }
        @keyframes slideIn { 0% { transform: translateY(-20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        .notif-success { background: var(--color-success-bg); color: var(--color-success); border-left: 4px solid var(--color-success); }
        .notif-error { background: var(--color-danger-bg); color: var(--color-danger); border-left: 4px solid var(--color-danger); }
        .dash-layout { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; }
        .dash-sidebar {
          padding: 1.5rem; display: flex; flex-direction: column;
          position: sticky; top: 0; height: 100vh; overflow-y: auto;
        }
        .dash-sidebar-profile { display: flex; align-items: center; gap: 0.75rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--color-border-light); margin-bottom: 1.5rem; }
        .dash-avatar { width: 40px; height: 40px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-weight: 800; }
        .dash-user-name { font-weight: 700; font-size: 0.95rem; }
        .dash-nav { display: flex; flex-direction: column; gap: 0.25rem; flex-grow: 1; }
        .dash-nav-btn { display: flex; align-items: center; gap: 0.75rem; background: none; border: none; cursor: pointer; padding: 0.7rem 0.75rem; border-radius: var(--radius-sm); font-size: 0.9rem; font-weight: 500; color: var(--color-text-muted); transition: var(--transition-fast); width: 100%; text-align: left; }
        .dash-sidebar-actions { border-top: 1px solid var(--color-border-light); padding-top: 1rem; display: flex; flex-direction: column; gap: 0.25rem; }
        .dash-main { padding: 2.5rem; }
        .dash-metric { display: flex; flex-direction: column; gap: 0.5rem; padding: 1.5rem; }
        .dash-metric-icon { width: 40px; height: 40px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; }
        .type-badge { font-size: 0.7rem; font-weight: 800; padding: 0.2rem 0.5rem; border-radius: var(--radius-sm); }
        .badge-buy { background: var(--color-success-bg); color: var(--color-success); }
        .badge-sell { background: var(--color-danger-bg); color: var(--color-danger); }
        .input-wrapper { position: relative; display: flex; align-items: center; }
        .input-icon { position: absolute; left: 14px; color: var(--color-text-muted); pointer-events: none; }
        .form-input-icon { padding-left: 2.5rem; width: 100%; }
        @media (max-width: 768px) {
          .dash-layout { grid-template-columns: 1fr; }
          .dash-sidebar { position: relative; height: auto; }
        }
      `}</style>
    </div>
  );
}
