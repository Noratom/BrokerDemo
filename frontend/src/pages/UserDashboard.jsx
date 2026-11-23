import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Briefcase, Clock, Star, TrendingUp, DollarSign,
  ArrowUpRight, ArrowDownRight, Activity, LogOut, Wallet,
  ArrowDownCircle, ArrowUpCircle, ShieldCheck, CheckCircle2, AlertCircle, Plus
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import DepositWithdrawModal from '../components/DepositWithdrawModal';

export default function UserDashboard({ currentUser, onLogout, setActivePage }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [positions, setPositions] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('aura_watchlist');
    return saved ? JSON.parse(saved) : ['EUR/USD', 'BTC/USD', 'GOLD'];
  });
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('aura_transactions');
    return saved ? JSON.parse(saved) : [
      {
        id: 'DEP-8921B',
        type: 'DEPOSIT',
        method: 'USDT (TRC20)',
        amount: 10000,
        status: 'COMPLETED',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString()
      }
    ];
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('deposit');
  const [modalAmount, setModalAmount] = useState('');

  // Fetch live market data and positions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [posRes, mkRes, txRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/trades/${currentUser.id}`),
          fetch(`${API_BASE_URL}/api/markets`),
          fetch(`${API_BASE_URL}/api/wallet/transactions/${currentUser.id}`)
        ]);
        if (posRes.ok) { const r = await posRes.json(); setPositions(r.data); }
        if (mkRes.ok) { const r = await mkRes.json(); setMarkets(r.data); }
        if (txRes.ok) {
          const r = await txRes.json();
          if (r.data && r.data.length > 0) {
            setTransactions(r.data);
            localStorage.setItem('aura_transactions', JSON.stringify(r.data));
          }
        }
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

  const handleOpenFunding = (tab, amount = '') => {
    setModalTab(tab);
    setModalAmount(amount);
    setModalOpen(true);
  };

  const handleBalanceUpdate = (newBalance) => {
    currentUser.balance = newBalance;
    localStorage.setItem('aura_current_user', JSON.stringify(currentUser));
    const saved = localStorage.getItem('aura_transactions');
    if (saved) setTransactions(JSON.parse(saved));
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
    { id: 'wallet', label: 'Deposit & Withdraw', icon: Wallet },
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
  const colors = ['#1a3edb', '#2340e0', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#f97316'];

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
                <button
                  key={item.id}
                  className={`dash-nav-btn ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
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
          {/* ══════════ TAB: OVERVIEW ══════════ */}
          {activeTab === 'overview' && (
            <div className="page-enter">
              <div className="flex justify-between items-center flex-wrap gap-4" style={{ marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ marginBottom: '0.25rem' }}>Portfolio Overview</h2>
                  <p className="text-muted text-sm">Welcome back, {currentUser.name.split(' ')[0]}. Here is your current financial summary.</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-primary btn-sm flex items-center gap-2" onClick={() => handleOpenFunding('deposit')}>
                    <ArrowDownCircle size={16} />
                    <span>Deposit</span>
                  </button>
                  <button className="btn btn-secondary btn-sm flex items-center gap-2" onClick={() => handleOpenFunding('withdraw')}>
                    <ArrowUpCircle size={16} />
                    <span>Withdraw</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-6" style={{ marginBottom: '2.5rem' }}>
                <div className="card card-static dash-metric">
                  <div className="dash-metric-icon" style={{ background: '#eef2ff' }}>
                    <DollarSign size={20} style={{ color: '#1a3edb' }} />
                  </div>
                  <span className="text-xs text-muted uppercase font-label">Account Balance</span>
                  <h3 className="font-mono" style={{ fontSize: '1.4rem', color: '#111827' }}>
                    ${currentUser.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h3>
                </div>

                <div className="card card-static dash-metric">
                  <div className="dash-metric-icon" style={{ background: '#f0f4ff' }}>
                    <TrendingUp size={20} style={{ color: '#1a3edb' }} />
                  </div>
                  <span className="text-xs text-muted uppercase font-label">Net Equity</span>
                  <h3 className="font-mono" style={{ fontSize: '1.4rem', color: '#111827' }}>
                    ${equity.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h3>
                </div>

                <div className="card card-static dash-metric">
                  <div className="dash-metric-icon" style={{ background: totalPL >= 0 ? '#ecfdf5' : '#fef2f2' }}>
                    {totalPL >= 0 ? <ArrowUpRight size={20} style={{ color: '#10b981' }} /> : <ArrowDownRight size={20} style={{ color: '#ef4444' }} />}
                  </div>
                  <span className="text-xs text-muted uppercase font-label">Floating P/L</span>
                  <h3 className={`font-mono ${totalPL >= 0 ? 'text-success' : 'text-danger'}`} style={{ fontSize: '1.4rem' }}>
                    {totalPL >= 0 ? '+' : ''}${totalPL.toFixed(2)}
                  </h3>
                </div>

                <div className="card card-static dash-metric">
                  <div className="dash-metric-icon" style={{ background: '#f8fafc' }}>
                    <Briefcase size={20} style={{ color: '#0d1b2a' }} />
                  </div>
                  <span className="text-xs text-muted uppercase font-label">Open Trades</span>
                  <h3 className="font-mono" style={{ fontSize: '1.4rem' }}>{positions.length}</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {/* Exposure Breakdown */}
                <div className="card card-static">
                  <h4 style={{ marginBottom: '1.25rem' }}>Exposure Breakdown</h4>
                  {slices.length > 0 ? (
                    <div className="flex items-center gap-8 flex-wrap">
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
                            <Star size={14} fill="#1a3edb" />
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

          {/* ══════════ TAB: DEPOSIT & WITHDRAW ══════════ */}
          {activeTab === 'wallet' && (
            <div className="page-enter">
              <div className="flex justify-between items-center flex-wrap gap-4" style={{ marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ marginBottom: '0.25rem' }}>Deposit & Withdrawal Center</h2>
                  <p className="text-muted text-sm">Manage your funds, initiate deposits, and request fast withdrawals.</p>
                </div>
                <div className="flex gap-3">
                  <button className="btn btn-primary flex items-center gap-2" onClick={() => handleOpenFunding('deposit')}>
                    <ArrowDownCircle size={18} />
                    <span>Make a Deposit</span>
                  </button>
                  <button className="btn btn-secondary flex items-center gap-2" onClick={() => handleOpenFunding('withdraw')}>
                    <ArrowUpCircle size={18} />
                    <span>Withdraw Funds</span>
                  </button>
                </div>
              </div>

              {/* Wallet Cards */}
              <div className="grid grid-cols-3 gap-6" style={{ marginBottom: '2rem' }}>
                <div className="card card-static">
                  <span className="text-xs text-muted font-label uppercase">Total Balance</span>
                  <h3 className="font-mono" style={{ fontSize: '1.6rem', color: '#1a3edb', marginTop: '0.35rem' }}>
                    ${currentUser.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h3>
                  <p className="text-xs text-muted" style={{ marginTop: '0.35rem' }}>Available for trading or immediate withdrawal</p>
                </div>

                <div className="card card-static">
                  <span className="text-xs text-muted font-label uppercase">Deposit Methods</span>
                  <div className="flex items-center gap-2" style={{ marginTop: '0.5rem' }}>
                    <span className="badge badge-blue text-xs">USDT</span>
                    <span className="badge badge-blue text-xs">BTC</span>
                    <span className="badge badge-blue text-xs">ETH</span>
                    <span className="badge badge-blue text-xs">Bank Wire</span>
                  </div>
                  <p className="text-xs text-muted" style={{ marginTop: '0.5rem' }}>0% deposit fee on all crypto & wire channels</p>
                </div>

                <div className="card card-static">
                  <span className="text-xs text-muted font-label uppercase">Security Status</span>
                  <div className="flex items-center gap-2 text-success" style={{ marginTop: '0.5rem', fontWeight: 700 }}>
                    <ShieldCheck size={18} />
                    <span>Funds Segregated & Insured</span>
                  </div>
                  <p className="text-xs text-muted" style={{ marginTop: '0.35rem' }}>256-bit bank grade encryption</p>
                </div>
              </div>

              {/* Transaction History Ledger */}
              <div className="card card-static">
                <div className="flex justify-between items-center" style={{ marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Funding Transactions</h3>
                  <span className="text-xs text-muted">{transactions.length} record(s)</span>
                </div>

                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Reference ID</th>
                        <th>Type</th>
                        <th>Method</th>
                        <th>Amount</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length > 0 ? (
                        transactions.map((tx) => (
                          <tr key={tx.id}>
                            <td className="font-mono text-xs">{tx.id}</td>
                            <td>
                              <span className={`type-badge ${tx.type === 'DEPOSIT' ? 'badge-buy' : 'badge-sell'}`}>
                                {tx.type}
                              </span>
                            </td>
                            <td className="font-label text-sm">{tx.method}</td>
                            <td className="font-mono" style={{ fontWeight: 700 }}>
                              {tx.type === 'DEPOSIT' ? '+' : '-'}${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                            <td className="text-xs text-muted">
                              {new Date(tx.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                            </td>
                            <td>
                              <span className={`badge ${tx.status === 'COMPLETED' ? 'badge-blue' : 'badge-gold'}`} style={{ fontSize: '0.72rem' }}>
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center text-muted" style={{ padding: '2.5rem' }}>
                            No funding records yet. Click "Make a Deposit" above to fund your account.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB: OPEN POSITIONS ══════════ */}
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

          {/* ══════════ TAB: WATCHLIST ══════════ */}
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
                          <Star size={18} fill={isWatched ? '#1a3edb' : 'none'} />
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

          {/* ══════════ TAB: TRADE HISTORY ══════════ */}
          {activeTab === 'history' && (
            <div className="page-enter">
              <h2 style={{ marginBottom: '2rem' }}>Trade History</h2>
              <p className="text-muted">Closed trade records will appear here after you close active positions from the Trading Desk.</p>
            </div>
          )}
        </main>
      </div>

      {/* Global Deposit/Withdraw Modal */}
      <DepositWithdrawModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialTab={modalTab}
        initialAmount={modalAmount}
        currentUser={currentUser}
        onBalanceUpdate={handleBalanceUpdate}
      />

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
          background: #1a3edb;
          color: #ffffff;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 1.1rem;
        }
        .dash-user-name { font-weight: 700; color: #111827; }
        .dash-nav { display: flex; flex-direction: column; gap: 0.4rem; flex: 1; }
        .dash-nav-btn {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.8rem 1rem; border-radius: var(--radius-md);
          border: none; background: none; color: var(--color-text-muted);
          font-weight: 600; font-size: 0.9rem; cursor: pointer;
          transition: var(--transition-fast); text-align: left; width: 100%;
        }
        .dash-nav-btn:hover { background: #f0f4ff; color: #1a3edb; }
        .dash-nav-btn.active {
          background: #1a3edb;
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(26, 62, 219, 0.25);
        }
        .dash-sidebar-actions {
          border-top: 1px solid var(--color-border-light);
          padding-top: 1rem; display: flex; flex-direction: column; gap: 0.4rem;
        }
        .logout-btn:hover { color: var(--color-danger); background: var(--color-danger-bg); }
        .dash-main { padding: 2.5rem; max-width: 1200px; width: 100%; }
        .dash-metric { padding: 1.5rem; }
        .dash-metric-icon {
          width: 42px; height: 42px; border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 0.75rem;
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
        .star-btn.active { color: #1a3edb; }
        .star-btn:hover { color: #1a3edb; transform: scale(1.2); }
        .type-badge {
          font-size: 0.7rem; font-weight: 800; padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm); letter-spacing: 0.03em;
        }
        .badge-buy { background: var(--color-success-bg); color: var(--color-success); }
        .badge-sell { background: var(--color-danger-bg); color: var(--color-danger); }
        @media (max-width: 992px) {
          .grid-cols-4 { grid-template-columns: repeat(2, 1fr); }
          .grid-cols-3 { grid-template-columns: 1fr; }
        }
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
