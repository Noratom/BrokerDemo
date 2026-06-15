import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Briefcase, Clock, Star, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Activity, LogOut, Settings } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function UserDashboard({ currentUser, onLogout, setActivePage }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [positions, setPositions] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('aura_watchlist');
    return saved ? JSON.parse(saved) : ['EUR/USD', 'BTC/USD', 'GOLD'];
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [posRes, mkRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/trades/${currentUser.id}`),
          fetch(`${API_BASE_URL}/api/markets`)
        ]);
        if (posRes.ok) { const r = await posRes.json(); setPositions(r.data); }
        if (mkRes.ok) { const r = await mkRes.json(); setMarkets(r.data); }
      } catch (e) {}
    };
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, [currentUser.id]);

  useEffect(() => {
    localStorage.setItem('aura_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (symbol) => {
    setWatchlist(prev => prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]);
  };

  const totalPL = positions.reduce((acc, p) => {
    const market = markets.find(m => m.symbol === p.symbol);
    if (!market) return acc;
    let multiplier = p.symbol.includes('/') && !p.symbol.includes('BTC') && !p.symbol.includes('ETH') ? 100000 : 1;
    let profit = p.type === 'BUY' ? (market.price - p.entryPrice) * p.size * multiplier : (p.entryPrice - market.price) * p.size * multiplier;
    if (p.symbol.includes('JPY')) profit /= 157;
    return acc + profit;
  }, 0);

  const equity = currentUser.balance + totalPL;

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'positions', label: 'Open Positions', icon: Briefcase },
    { id: 'watchlist', label: 'Watchlist', icon: Star },
    { id: 'history', label: 'Trade History', icon: Clock },
  ];

  // SVG donut chart
  const positionsByAsset = {};
  positions.forEach(p => {
    const market = markets.find(m => m.symbol === p.symbol);
    const val = market ? p.size * market.price : p.size * p.entryPrice;
    positionsByAsset[p.symbol] = (positionsByAsset[p.symbol] || 0) + val;
  });
  const totalExposure = Object.values(positionsByAsset).reduce((a, b) => a + b, 0) || 1;
  const colors = ['#1e40af', '#c9981a', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#f97316'];

  let cumulativePercent = 0;
  const slices = Object.entries(positionsByAsset).map(([symbol, val], i) => {
    const percent = val / totalExposure;
    const startAngle = cumulativePercent * 360;
    const endAngle = (cumulativePercent + percent) * 360;
    cumulativePercent += percent;

    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    const largeArc = percent > 0.5 ? 1 : 0;
    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);

    return { symbol, percent, color: colors[i % colors.length], d: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z` };
  });

  return (
    <div className="user-dash page-enter">
      <div className="dash-layout">
        {/* Sidebar */}
        <aside className="dash-sidebar">
          <div className="dash-sidebar-profile">
            <div className="dash-avatar">{currentUser.name.charAt(0)}</div>
            <div>
              <div className="dash-user-name">{currentUser.name}</div>
              <div className="text-xs text-muted">{currentUser.email}</div>
            </div>
          </div>

          <nav className="dash-nav">
            {sidebarItems.map(item => {
              const Icon = item.icon;
              return (
                <button key={item.id} className={`dash-nav-btn ${activeTab === item.id ? 'active' : ''}`} onClick={() => setActiveTab(item.id)}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="dash-sidebar-actions">
            <button className="dash-nav-btn" onClick={() => setActivePage('home')}>
              <Activity size={18} />
              <span>Trading Desk</span>
            </button>
            <button className="dash-nav-btn logout-btn" onClick={onLogout}>
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dash-main">
          {activeTab === 'overview' && (
            <div className="page-enter">
              <h2 style={{ marginBottom: '0.25rem' }}>Portfolio Overview</h2>
              <p className="text-muted text-sm" style={{ marginBottom: '2rem' }}>Welcome back, {currentUser.name.split(' ')[0]}.</p>

              <div className="grid grid-cols-4 gap-6" style={{ marginBottom: '2.5rem' }}>
                <div className="card card-static dash-metric">
                  <div className="dash-metric-icon" style={{ background: 'var(--color-blue-soft)' }}><DollarSign size={20} style={{ color: 'var(--color-blue-royal)' }} /></div>
                  <span className="text-xs text-muted uppercase font-label">Balance</span>
                  <h3 className="font-mono" style={{ fontSize: '1.4rem' }}>${currentUser.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                </div>
                <div className="card card-static dash-metric">
                  <div className="dash-metric-icon" style={{ background: 'var(--color-gold-light)' }}><TrendingUp size={20} style={{ color: 'var(--color-gold)' }} /></div>
                  <span className="text-xs text-muted uppercase font-label">Equity</span>
                  <h3 className="font-mono" style={{ fontSize: '1.4rem' }}>${equity.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                </div>
                <div className="card card-static dash-metric">
                  <div className="dash-metric-icon" style={{ background: totalPL >= 0 ? 'var(--color-success-bg)' : 'var(--color-danger-bg)' }}>
                    {totalPL >= 0 ? <ArrowUpRight size={20} style={{ color: 'var(--color-success)' }} /> : <ArrowDownRight size={20} style={{ color: 'var(--color-danger)' }} />}
                  </div>
                  <span className="text-xs text-muted uppercase font-label">Floating P/L</span>
                  <h3 className={`font-mono ${totalPL >= 0 ? 'text-success' : 'text-danger'}`} style={{ fontSize: '1.4rem' }}>
                    {totalPL >= 0 ? '+' : ''}${totalPL.toFixed(2)}
                  </h3>
                </div>
                <div className="card card-static dash-metric">
                  <div className="dash-metric-icon" style={{ background: 'var(--color-blue-mist)' }}><Briefcase size={20} style={{ color: 'var(--color-blue-deep)' }} /></div>
                  <span className="text-xs text-muted uppercase font-label">Open Trades</span>
                  <h3 className="font-mono" style={{ fontSize: '1.4rem' }}>{positions.length}</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {/* Donut Chart */}
                <div className="card card-static">
                  <h4 style={{ marginBottom: '1.25rem' }}>Exposure Breakdown</h4>
                  {slices.length > 0 ? (
                    <div className="flex items-center gap-8">
                      <svg viewBox="0 0 100 100" style={{ width: '140px', height: '140px' }}>
                        {slices.map((s, i) => <path key={i} d={s.d} fill={s.color} stroke="white" strokeWidth="1" />)}
                        <circle cx="50" cy="50" r="22" fill="white" />
                      </svg>
                      <div className="flex flex-col gap-2">
                        {slices.map((s, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                            <span className="font-label">{s.symbol}</span>
                            <span className="text-muted">{(s.percent * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted text-sm">No open positions to chart.</p>
                  )}
                </div>

                {/* Quick Watchlist */}
                <div className="card card-static">
                  <h4 style={{ marginBottom: '1.25rem' }}>Watchlist</h4>
                  <div className="flex flex-col gap-3">
                    {markets.filter(m => watchlist.includes(m.symbol)).map(m => (
                      <div key={m.symbol} className="flex justify-between items-center watchlist-row">
                        <div className="flex items-center gap-3">
                          <button className="star-btn active" onClick={() => toggleWatchlist(m.symbol)}>
                            <Star size={14} fill="var(--color-gold)" />
                          </button>
                          <div>
                            <div className="font-label text-sm">{m.symbol}</div>
                            <div className="text-xs text-muted">{m.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-sm" style={{ fontWeight: 600 }}>{m.price.toLocaleString()}</div>
                          <span className={`text-xs ${m.change >= 0 ? 'text-success' : 'text-danger'}`}>
                            {m.change >= 0 ? '+' : ''}{m.change.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    ))}
                    {watchlist.length === 0 && <p className="text-muted text-sm">Star assets from the market table to add them here.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'positions' && (
            <div className="page-enter">
              <h2 style={{ marginBottom: '2rem' }}>Open Positions ({positions.length})</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr><th>Asset</th><th>Direction</th><th>Size</th><th>Entry</th><th>Current</th><th>P/L</th></tr>
                  </thead>
                  <tbody>
                    {positions.length > 0 ? positions.map(p => {
                      const market = markets.find(m => m.symbol === p.symbol);
                      const curPrice = market ? market.price : p.entryPrice;
                      let multiplier = p.symbol.includes('/') && !p.symbol.includes('BTC') && !p.symbol.includes('ETH') ? 100000 : 1;
                      let profit = p.type === 'BUY' ? (curPrice - p.entryPrice) * p.size * multiplier : (p.entryPrice - curPrice) * p.size * multiplier;
                      if (p.symbol.includes('JPY')) profit /= 157;
                      return (
                        <tr key={p.id}>
                          <td className="font-label">{p.symbol}</td>
                          <td><span className={`type-badge ${p.type === 'BUY' ? 'badge-buy' : 'badge-sell'}`}>{p.type}</span></td>
                          <td className="font-mono">{p.size}</td>
                          <td className="font-mono">{p.entryPrice}</td>
                          <td className="font-mono">{curPrice.toLocaleString()}</td>
                          <td className={`font-mono ${profit >= 0 ? 'text-success' : 'text-danger'}`} style={{ fontWeight: 600 }}>
                            ${profit.toFixed(2)}
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr><td colSpan="6" className="text-center text-muted" style={{ padding: '3rem' }}>No open positions.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'watchlist' && (
            <div className="page-enter">
              <h2 style={{ marginBottom: '0.5rem' }}>Market Watchlist</h2>
              <p className="text-muted text-sm" style={{ marginBottom: '2rem' }}>Click the star to add or remove assets.</p>
              <div className="grid grid-cols-3 gap-6">
                {markets.map(m => {
                  const isWatched = watchlist.includes(m.symbol);
                  return (
                    <div key={m.symbol} className="card card-static flex justify-between items-center" style={{ padding: '1.25rem' }}>
                      <div className="flex items-center gap-3">
                        <button className={`star-btn ${isWatched ? 'active' : ''}`} onClick={() => toggleWatchlist(m.symbol)}>
                          <Star size={18} fill={isWatched ? 'var(--color-gold)' : 'none'} />
                        </button>
                        <div>
                          <div className="font-label">{m.symbol}</div>
                          <div className="text-xs text-muted">{m.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono" style={{ fontWeight: 700 }}>{m.price.toLocaleString()}</div>
                        <span className={`text-xs ${m.change >= 0 ? 'text-success' : 'text-danger'}`}>
                          {m.change >= 0 ? '+' : ''}{m.change.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="page-enter">
              <h2 style={{ marginBottom: '2rem' }}>Trade History</h2>
              <p className="text-muted">Closed trade records will appear here after you close active positions from the Trading Desk.</p>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .user-dash { min-height: 100vh; background: var(--color-bg); }
        .dash-layout { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; }
        .dash-sidebar {
          background: var(--color-white);
          border-right: 1px solid var(--color-border-light);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }
        .dash-sidebar-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--color-border-light);
          margin-bottom: 1.5rem;
        }
        .dash-avatar {
          width: 40px; height: 40px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, var(--color-blue-royal), var(--color-blue-primary));
          color: white;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 1.1rem;
        }
        .dash-user-name { font-weight: 700; font-size: 0.95rem; color: var(--color-blue-deep); }
        .dash-nav { display: flex; flex-direction: column; gap: 0.25rem; flex-grow: 1; }
        .dash-nav-btn {
          display: flex; align-items: center; gap: 0.75rem;
          background: none; border: none; cursor: pointer;
          padding: 0.7rem 0.75rem; border-radius: var(--radius-sm);
          font-size: 0.9rem; font-weight: 500;
          color: var(--color-text-muted);
          transition: var(--transition-fast);
          width: 100%; text-align: left;
        }
        .dash-nav-btn:hover { background: var(--color-blue-mist); color: var(--color-blue-deep); }
        .dash-nav-btn.active {
          background: var(--color-blue-soft);
          color: var(--color-blue-royal);
          font-weight: 700;
        }
        .dash-nav-btn.logout-btn:hover { background: var(--color-danger-bg); color: var(--color-danger); }
        .dash-sidebar-actions {
          border-top: 1px solid var(--color-border-light);
          padding-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .dash-main { padding: 2.5rem; }
        .dash-metric {
          display: flex; flex-direction: column; gap: 0.5rem; padding: 1.5rem;
        }
        .dash-metric-icon {
          width: 40px; height: 40px; border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
        }
        .watchlist-row {
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--color-border-light);
        }
        .watchlist-row:last-child { border-bottom: none; }
        .star-btn {
          background: none; border: none; cursor: pointer;
          color: var(--color-border); transition: var(--transition-fast);
        }
        .star-btn.active { color: var(--color-gold); }
        .star-btn:hover { color: var(--color-gold); transform: scale(1.2); }
        .type-badge {
          font-size: 0.7rem; font-weight: 800; padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm); letter-spacing: 0.03em;
        }
        .badge-buy { background: var(--color-success-bg); color: var(--color-success); }
        .badge-sell { background: var(--color-danger-bg); color: var(--color-danger); }
        @media (max-width: 768px) {
          .dash-layout { grid-template-columns: 1fr; }
          .dash-sidebar {
            position: sticky;
            top: 70px;
            height: auto;
            width: 100%;
            border-right: none;
            border-bottom: 1px solid var(--color-border-light);
            z-index: 10;
            padding: 0.75rem 1rem;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 0.75rem;
          }
          .dash-sidebar-profile {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
            gap: 0.5rem;
          }
          .dash-avatar {
            width: 30px;
            height: 30px;
            font-size: 0.9rem;
          }
          .dash-user-name {
            font-size: 0.85rem;
          }
          .dash-nav {
            flex-direction: row;
            width: 100%;
            overflow-x: auto;
            gap: 0.25rem;
            order: 3;
            padding-top: 0.5rem;
            border-top: 1px solid var(--color-border-light);
            margin-top: 0.25rem;
          }
          .dash-nav-btn {
            padding: 0.5rem 0.75rem;
            font-size: 0.8rem;
            width: auto;
            white-space: nowrap;
          }
          .dash-sidebar-actions {
            flex-direction: row;
            border-top: none;
            padding-top: 0;
            gap: 0.5rem;
            order: 2;
          }
          .dash-main {
            padding: 1.25rem;
          }
          .grid-cols-4 {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
        }
        @media (max-width: 480px) {
          .grid-cols-4 {
            grid-template-columns: 1fr;
          }
          .dash-sidebar {
            flex-direction: column;
            align-items: flex-start;
          }
          .dash-sidebar-actions {
            width: 100%;
            justify-content: space-between;
            order: 2;
            padding-top: 0.5rem;
            border-top: 1px dashed var(--color-border-light);
          }
          .dash-nav {
            order: 3;
          }
        }
      `}</style>
    </div>
  );
}
