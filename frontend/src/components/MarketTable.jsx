import React, { useState, useEffect } from 'react';
import { Search, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function MarketTable({ onSelectAsset }) {
  const [markets, setMarkets] = useState([
    { symbol: 'EUR/USD', name: 'Euro / US Dollar', type: 'forex', price: 1.0854, spread: 0.0001, change: 0.12 },
    { symbol: 'GBP/USD', name: 'Pound / US Dollar', type: 'forex', price: 1.2732, spread: 0.0002, change: -0.05 },
    { symbol: 'USD/JPY', name: 'US Dollar / Yen', type: 'forex', price: 157.45, spread: 0.01, change: 0.28 },
    { symbol: 'BTC/USD', name: 'Bitcoin / US Dollar', type: 'crypto', price: 68420.50, spread: 5.00, change: 2.45 },
    { symbol: 'ETH/USD', name: 'Ethereum / US Dollar', type: 'crypto', price: 3542.20, spread: 0.50, change: 1.88 },
    { symbol: 'GOLD', name: 'Gold Spot', type: 'commodity', price: 2324.80, spread: 0.25, change: -0.42 },
    { symbol: 'OIL', name: 'Crude Oil', type: 'commodity', price: 78.45, spread: 0.03, change: 0.95 }
  ]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/markets`);
        if (response.ok) {
          const result = await response.json();
          if (result.data) {
            setMarkets(result.data);
          }
        }
      } catch (error) {
        // Run local simulated ticking if API is down
        setMarkets(prev => prev.map(m => {
          const delta = (Math.random() - 0.5) * m.price * 0.0004;
          const decimals = m.symbol.includes('JPY') || m.symbol === 'OIL' || m.symbol === 'GOLD' || m.symbol.includes('BTC') || m.symbol.includes('ETH') ? 2 : 4;
          return {
            ...m,
            price: Number((m.price + delta).toFixed(decimals)),
            change: Number((m.change + (Math.random() - 0.5) * 0.04).toFixed(2))
          };
        }));
      }
    };

    fetchMarkets();
    const interval = setInterval(fetchMarkets, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredMarkets = markets.filter(m => {
    const matchesTab = activeTab === 'all' || m.type === activeTab;
    const matchesSearch = m.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div id="market-rates" className="market-table-section">
      <div className="flex items-center justify-between flex-col-mobile markets-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h2 className="markets-title">Competitive Live Spreads</h2>
          <p className="text-muted" style={{ marginTop: '0.25rem' }}>
            Trade global markets with institutional liquidity and ultra-low latency executions.
          </p>
        </div>
        
        {/* Search */}
        <div className="search-container flex items-center">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search symbol or name..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container flex">
        {[
          { id: 'all', label: 'All Assets' },
          { id: 'forex', label: 'Forex Pairs' },
          { id: 'crypto', label: 'Cryptocurrencies' },
          { id: 'commodity', label: 'Commodities' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table grid */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Live Price</th>
              <th>24h Change</th>
              <th>Spread</th>
              <th>Bid</th>
              <th>Ask</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMarkets.length > 0 ? (
              filteredMarkets.map(item => {
                const isUp = item.change >= 0;
                // Calculate simulated bid and ask from live price and spread
                const bidPrice = item.price - (item.spread / 2);
                const askPrice = item.price + (item.spread / 2);
                const decimals = item.symbol.includes('JPY') || item.symbol === 'OIL' || item.symbol === 'GOLD' || item.symbol.includes('BTC') || item.symbol.includes('ETH') ? 2 : 4;
                
                return (
                  <tr key={item.symbol}>
                    <td>
                      <div className="flex flex-col">
                        <span className="asset-symbol">{item.symbol}</span>
                        <span className="asset-name">{item.name}</span>
                      </div>
                    </td>
                    <td className="font-mono" style={{ fontWeight: '600' }}>
                      {item.symbol === 'GOLD' || item.symbol === 'OIL' ? '$' : ''}
                      {item.price.toLocaleString(undefined, { minimumFractionDigits: decimals })}
                    </td>
                    <td>
                      <span className={`change-badge flex items-center ${isUp ? 'bg-success' : 'bg-danger'}`}>
                        {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {isUp ? '+' : ''}{item.change.toFixed(2)}%
                      </span>
                    </td>
                    <td className="font-mono text-muted">
                      {item.spread.toLocaleString(undefined, { minimumFractionDigits: decimals })}
                    </td>
                    <td className="font-mono">
                      {bidPrice.toLocaleString(undefined, { minimumFractionDigits: decimals })}
                    </td>
                    <td className="font-mono">
                      {askPrice.toLocaleString(undefined, { minimumFractionDigits: decimals })}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn btn-primary btn-sm btn-trade-action"
                        onClick={() => onSelectAsset(item.symbol)}
                      >
                        <Activity size={14} />
                        Trade
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted" style={{ padding: '3rem' }}>
                  No matching assets found. Try searching for "BTC", "USD", or "Gold".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .market-table-section {
          width: 100%;
        }
        .markets-header {
          gap: 1.5rem;
        }
        .markets-title {
          font-size: 1.8rem;
          font-weight: 700;
        }
        .search-container {
          background-color: var(--color-white);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 0.5rem 1rem;
          width: 300px;
          max-width: 100%;
          box-shadow: var(--shadow-sm);
        }
        .search-icon {
          color: var(--color-text-muted);
          margin-right: 0.5rem;
        }
        .search-input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 0.9rem;
          color: var(--color-text-dark);
          background: transparent;
        }
        .tabs-container {
          gap: 0.5rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid var(--color-border-light);
          padding-bottom: 1px;
          overflow-x: auto;
        }
        .tab-btn {
          background: none;
          border: none;
          padding: 0.75rem 1.5rem;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--color-text-muted);
          border-bottom: 2px solid transparent;
          white-space: nowrap;
          transition: var(--transition-fast);
        }
        .tab-btn:hover {
          color: var(--color-blue-royal);
        }
        .tab-btn.active {
          color: var(--color-blue-royal);
          border-bottom-color: var(--color-gold);
        }
        .asset-symbol {
          font-weight: 700;
          color: var(--color-blue-deep);
        }
        .asset-name {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }
        .change-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 600;
          width: fit-content;
          gap: 0.15rem;
        }
        .bg-success {
          background-color: var(--color-success-bg);
          color: var(--color-success);
        }
        .bg-danger {
          background-color: var(--color-danger-bg);
          color: var(--color-danger);
        }
        .btn-trade-action {
          border-radius: var(--radius-sm);
        }
        .btn-trade-action:hover {
          background-color: var(--color-gold);
          color: var(--color-white);
        }
        .font-mono {
          font-family: monospace;
          font-size: 0.9rem;
        }
        @media (max-width: 768px) {
          .search-container {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
