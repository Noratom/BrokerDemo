import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowDownRight, Briefcase, TrendingUp, DollarSign, X, ShieldAlert, CheckCircle, UserPlus } from 'lucide-react';

export default function TradingSimulator({ selectedAsset, setSelectedAsset, currentUser }) {
  // Demo states (local state syncs with server if logged in, otherwise localstorage)
  const [balance, setBalance] = useState(10000.00);
  const [positions, setPositions] = useState([]);
  const [tradeSize, setTradeSize] = useState(0.1);
  
  // Chart states
  const [chartData, setChartData] = useState([]);
  const [currentMarketPrice, setCurrentMarketPrice] = useState(1.0854);
  const [spread, setSpread] = useState(0.0001);
  const [notification, setNotification] = useState(null);
  const chartContainerRef = useRef(null);

  // Sync balance from currentUser if logged in
  useEffect(() => {
    if (currentUser) {
      setBalance(currentUser.balance);
    } else {
      const saved = localStorage.getItem('aura_demo_balance');
      setBalance(saved ? Number(saved) : 10000.00);
    }
  }, [currentUser]);

  // Load selected asset properties or fetch from API
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/markets/history/${selectedAsset}`);
        if (response.ok) {
          const result = await response.json();
          setChartData(result.history);
          if (result.history.length > 0) {
            setCurrentMarketPrice(result.history[result.history.length - 1].price);
          }
        }
      } catch (error) {
        // Build mock history offline
        const mockBase = selectedAsset === 'BTC/USD' ? 68400 : 
                         selectedAsset === 'ETH/USD' ? 3540 : 
                         selectedAsset === 'USD/JPY' ? 157.4 :
                         selectedAsset === 'GOLD' ? 2320 :
                         selectedAsset === 'OIL' ? 78.4 : 1.08;
        const decimals = selectedAsset.includes('JPY') || selectedAsset === 'GOLD' || selectedAsset === 'OIL' || selectedAsset.includes('BTC') || selectedAsset.includes('ETH') ? 2 : 4;
        
        let tempVal = mockBase;
        const points = [];
        const baseTime = Date.now() - (20 * 60 * 1000);
        for (let i = 0; i < 20; i++) {
          tempVal = tempVal * (1 + (Math.random() - 0.49) * 0.001);
          points.push({
            time: new Date(baseTime + (i * 60 * 1000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            price: Number(tempVal.toFixed(decimals))
          });
        }
        setChartData(points);
        setCurrentMarketPrice(points[points.length - 1].price);
      }
    };

    fetchHistory();
  }, [selectedAsset]);

  // Handle ticking data
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:5000/api/markets');
        if (response.ok) {
          const result = await response.json();
          const target = result.data.find(m => m.symbol === selectedAsset);
          if (target) {
            setCurrentMarketPrice(target.price);
            setSpread(target.spread);
            
            // Append to chart history
            setChartData(prev => {
              const newPoint = {
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                price: target.price
              };
              const updated = [...prev.slice(1), newPoint];
              return updated;
            });
          }
        }
      } catch (e) {
        // Local simulation ticking
        const magnitude = currentMarketPrice;
        const delta = (Math.random() - 0.5) * magnitude * 0.0006;
        const decimals = selectedAsset.includes('JPY') || selectedAsset === 'GOLD' || selectedAsset === 'OIL' || selectedAsset.includes('BTC') || selectedAsset.includes('ETH') ? 2 : 4;
        const newPrice = Number((magnitude + delta).toFixed(decimals));
        setCurrentMarketPrice(newPrice);
        setChartData(prev => {
          const newPoint = {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            price: newPrice
          };
          return [...prev.slice(1), newPoint];
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedAsset, currentMarketPrice]);

  // Sync positions from backend if logged in
  const refreshPositions = async () => {
    if (!currentUser) {
      setPositions([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/trades/${currentUser.id}`);
      if (response.ok) {
        const result = await response.json();
        setPositions(result.data);
      }
    } catch (e) {
      // Offline fallback
    }
  };

  useEffect(() => {
    refreshPositions();
  }, [selectedAsset, currentUser]);

  // Auto-save local balance to localstorage only if guest
  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem('aura_demo_balance', balance.toFixed(2));
    }
  }, [balance, currentUser]);

  // Trade actions
  const handlePlaceOrder = async (type) => {
    const requiredMargin = calculateRequiredMargin(selectedAsset, tradeSize, currentMarketPrice);
    if (requiredMargin > balance) {
      triggerNotification('error', `Insufficient virtual funds! Margin required: $${requiredMargin.toFixed(2)}`);
      return;
    }

    const userId = currentUser ? currentUser.id : 'guest';

    try {
      const response = await fetch('http://localhost:5000/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: selectedAsset,
          type,
          size: tradeSize,
          entryPrice: currentMarketPrice,
          userId
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (currentUser) {
          // If logged in, reload positions from server
          refreshPositions();
        } else {
          setPositions(prev => [...prev, result.data]);
        }
        triggerNotification('success', `${type} order executed successfully!`);
      } else {
        const err = await response.json();
        triggerNotification('error', err.message || 'Execution error');
      }
    } catch (error) {
      // Local execution fallback if API server is not running
      const newPos = {
        id: `trade_${Math.random().toString(36).substr(2, 9)}`,
        symbol: selectedAsset,
        type,
        size: Number(tradeSize),
        entryPrice: currentMarketPrice,
        currentPrice: currentMarketPrice,
        timestamp: new Date().toISOString()
      };
      setPositions(prev => [...prev, newPos]);
      triggerNotification('success', `${type} order executed offline successfully!`);
    }
  };

  const handleClosePosition = async (id) => {
    const targetPos = positions.find(p => p.id === id);
    // Guest positions check
    const isGuest = !currentUser || targetPos?.userId === 'guest' || !targetPos?.userId;

    try {
      const response = await fetch(`http://localhost:5000/api/trades/close/${id}`, {
        method: 'POST'
      });

      if (response.ok) {
        const result = await response.json();
        if (currentUser) {
          // Sync new balance and positions list
          setBalance(result.data.newBalance);
          // Directly update parent model state if available
          currentUser.balance = result.data.newBalance;
          setPositions(prev => prev.filter(p => p.id !== id));
        } else {
          setBalance(prev => prev + result.data.profit);
          setPositions(prev => prev.filter(p => p.id !== id));
        }
        triggerNotification('success', `Closed position. Realized P/L: $${result.data.profit >= 0 ? '+' : ''}${result.data.profit.toFixed(2)}`);
      } else {
        triggerNotification('error', 'Failed to close position on server');
      }
    } catch (error) {
      // Local execution fallback
      const fallbackPos = targetPos || positions.find(p => p.id === id);
      if (!fallbackPos) return;

      const finalProfit = getPositionProfit(fallbackPos, currentMarketPrice);
      setBalance(prev => prev + finalProfit);
      if (currentUser) {
        currentUser.balance = Number((currentUser.balance + finalProfit).toFixed(2));
      }
      setPositions(prev => prev.filter(p => p.id !== id));
      triggerNotification('success', `Closed position offline. Realized P/L: $${finalProfit >= 0 ? '+' : ''}${finalProfit.toFixed(2)}`);
    }
  };

  const triggerNotification = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  // Profit/Loss calculation formula
  const getPositionProfit = (pos, livePrice) => {
    let multiplier = 1;
    if (pos.symbol.includes('/') && !pos.symbol.includes('BTC') && !pos.symbol.includes('ETH')) {
      multiplier = 100000;
    }
    
    let profit = 0;
    if (pos.type === 'BUY') {
      profit = (livePrice - pos.entryPrice) * pos.size * multiplier;
    } else {
      profit = (pos.entryPrice - livePrice) * pos.size * multiplier;
    }

    if (pos.symbol.includes('JPY')) {
      profit = profit / 157.0; 
    }

    return Number(profit.toFixed(2));
  };

  // Dynamic Margin Requirement Calculator
  const calculateRequiredMargin = (symbol, size, price) => {
    let leverage = 100;
    let baseValue = size;

    if (symbol.includes('BTC') || symbol.includes('ETH')) {
      leverage = 10;
      baseValue = size * price;
    } else if (symbol === 'GOLD' || symbol === 'OIL') {
      leverage = 50;
      baseValue = size * price;
    } else {
      baseValue = size * 100000;
    }

    return baseValue / leverage;
  };

  // Sum total floating profit loss
  const totalFloatingPL = positions.reduce((acc, pos) => {
    const profit = getPositionProfit(pos, pos.symbol === selectedAsset ? currentMarketPrice : pos.entryPrice);
    return acc + profit;
  }, 0);

  const equity = balance + totalFloatingPL;

  // Chart Rendering calculations
  const prices = chartData.map(d => d.price);
  const minPrice = Math.min(...prices) * 0.9998;
  const maxPrice = Math.max(...prices) * 1.0002;
  const priceRange = maxPrice - minPrice || 1;

  const width = 600;
  const height = 300;
  const padding = 40;

  const chartLen = chartData.length > 1 ? chartData.length - 1 : 1;
  const points = chartData.map((d, index) => {
    const x = padding + (index / chartLen) * (width - 2 * padding);
    const y = height - padding - ((d.price - minPrice) / priceRange) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = chartData.length > 0 ? `${padding},${height - padding} ${points} ${width - padding},${height - padding}` : '';

  return (
    <div id="trading-desk" className="trading-simulator-container">
      {/* Notifications banner */}
      {notification && (
        <div className={`notification flex items-center gap-4 ${notification.type === 'success' ? 'notif-success' : 'notif-error'}`}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <ShieldAlert size={20} />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Overview stats */}
      <div className="simulator-stats-grid grid grid-cols-3 gap-8">
        <div className="card flex items-center gap-4 stat-card card-blue-accent">
          <div className="stat-icon-wrapper bg-blue">
            <DollarSign size={24} className="color-blue" />
          </div>
          <div>
            <span className="text-xs text-muted font-label uppercase">Virtual Balance</span>
            <h3 className="stat-val font-mono">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-4 stat-card">
          <div className="stat-icon-wrapper bg-gold">
            <TrendingUp size={24} className="color-gold" />
          </div>
          <div>
            <span className="text-xs text-muted font-label uppercase">Net Equity</span>
            <h3 className="stat-val font-mono">${equity.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-4 stat-card card-gold-accent">
          <div className="stat-icon-wrapper bg-light">
            <Briefcase size={24} className={totalFloatingPL >= 0 ? 'text-success' : 'text-danger'} />
          </div>
          <div>
            <span className="text-xs text-muted font-label uppercase">Active P/L</span>
            <h3 className={`stat-val font-mono ${totalFloatingPL >= 0 ? 'text-success' : 'text-danger'}`}>
              {totalFloatingPL >= 0 ? '+' : ''}${totalFloatingPL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>
      </div>

      {/* Main trading environment */}
      <div className="simulator-body grid grid-cols-3 gap-8" style={{ marginTop: '2rem' }}>
        {/* Chart View */}
        <div className="card chart-card grid-column-span-2">
          <div className="flex items-center justify-between chart-header">
            <div>
              <span className="chart-asset-label uppercase font-label">Simulating Live Chart</span>
              <h3 className="chart-asset-title flex items-center gap-4">
                {selectedAsset}
                <span className="live-badge flex items-center">
                  <span className="live-dot"></span>LIVE
                </span>
              </h3>
            </div>
            <div className="chart-price-display font-mono">
              {currentMarketPrice.toLocaleString(undefined, { minimumFractionDigits: selectedAsset.includes('JPY') ? 2 : (selectedAsset.includes('/') ? 4 : 2) })}
            </div>
          </div>

          <div className="svg-chart-container" ref={chartContainerRef}>
            {chartData.length > 0 ? (
              <svg viewBox={`0 0 ${width} ${height}`} className="svg-chart">
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--color-border-light)" strokeWidth={1} />
                <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="var(--color-border-light)" strokeWidth={1} />
                <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="var(--color-border-light)" strokeDasharray="5,5" strokeWidth={1} />
                <line x1={width / 2} y1={padding} x2={width / 2} y2={height - padding} stroke="var(--color-border-light)" strokeDasharray="5,5" strokeWidth={1} />

                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-blue-royal)" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="var(--color-blue-royal)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <polygon points={areaPoints} fill="url(#chartGradient)" />
                <polyline fill="none" stroke="var(--color-blue-royal)" strokeWidth={2.5} points={points} />

                {chartData.length > 0 && (() => {
                  const lastIdx = chartData.length - 1;
                  const cxVal = padding + (lastIdx / chartLen) * (width - 2 * padding);
                  const cyVal = height - padding - ((chartData[lastIdx].price - minPrice) / priceRange) * (height - 2 * padding);
                  if (isNaN(cxVal) || isNaN(cyVal)) return null;
                  return (
                    <circle
                      cx={cxVal}
                      cy={cyVal}
                      r={5}
                      fill="var(--color-gold-bright)"
                      className="live-pulse-circle"
                    />
                  );
                })()}
              </svg>
            ) : (
              <div className="flex items-center justify-center h-full text-muted">
                Connecting to live feeds...
              </div>
            )}
          </div>
        </div>

        {/* Action Panel */}
        <div className="card control-card card-gold-accent flex flex-col justify-between">
          <div>
            <h3 className="control-title">Deal Ticket</h3>
            <p className="text-xs text-muted" style={{ margin: '0.25rem 0 1.5rem 0' }}>Configure and execute instant orders below.</p>
            
            <div className="form-group">
              <label className="form-label">Select Symbol</label>
              <select 
                className="form-input" 
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
              >
                <option value="EUR/USD">EUR/USD (Euro / Dollar)</option>
                <option value="GBP/USD">GBP/USD (Pound / Dollar)</option>
                <option value="USD/JPY">USD/JPY (Dollar / Yen)</option>
                <option value="BTC/USD">BTC/USD (Bitcoin)</option>
                <option value="ETH/USD">ETH/USD (Ethereum)</option>
                <option value="GOLD">GOLD (Spot Gold)</option>
                <option value="OIL">OIL (Crude Oil)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label flex justify-between">
                <span>Volume Size</span>
                <span className="text-xs text-muted">
                  {selectedAsset.includes('/') && !selectedAsset.includes('BTC') && !selectedAsset.includes('ETH') ? 'Lots (100k units)' : 'Contracts'}
                </span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="10.0"
                className="form-input font-mono"
                value={tradeSize}
                onChange={(e) => setTradeSize(Math.max(0.01, Number(e.target.value)))}
              />
            </div>

            <div className="margin-summary-card">
              <div className="flex justify-between text-xs">
                <span className="text-muted">Estimated Margin:</span>
                <span className="font-mono text-dark" style={{ fontWeight: 600 }}>
                  ${calculateRequiredMargin(selectedAsset, tradeSize, currentMarketPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-xs" style={{ marginTop: '0.25rem' }}>
                <span className="text-muted">Available Virtual Cash:</span>
                <span className="font-mono text-dark" style={{ fontWeight: 600 }}>
                  ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <div className="execution-buttons-wrapper flex gap-4">
            <button 
              className="btn btn-sell flex-col w-full"
              onClick={() => handlePlaceOrder('SELL')}
              style={{ width: '50%' }}
            >
              <span className="btn-label-action">SELL (SHORT)</span>
              <span className="btn-price-val font-mono">
                {(currentMarketPrice - (spread / 2)).toLocaleString(undefined, { minimumFractionDigits: selectedAsset.includes('JPY') ? 2 : (selectedAsset.includes('/') ? 4 : 2) })}
              </span>
            </button>
            
            <button 
              className="btn btn-buy flex-col w-full"
              onClick={() => handlePlaceOrder('BUY')}
              style={{ width: '50%' }}
            >
              <span className="btn-label-action">BUY (LONG)</span>
              <span className="btn-price-val font-mono">
                {(currentMarketPrice + (spread / 2)).toLocaleString(undefined, { minimumFractionDigits: selectedAsset.includes('JPY') ? 2 : (selectedAsset.includes('/') ? 4 : 2) })}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Open positions ledger */}
      <div className="card positions-card" style={{ marginTop: '2rem' }}>
        <h4 className="flex items-center gap-4" style={{ marginBottom: '1.25rem' }}>
          <Briefcase size={20} className="color-blue" />
          Active Working Positions ({positions.length})
        </h4>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Instrument</th>
                <th>Order Type</th>
                <th>Volume Size</th>
                <th>Entry price</th>
                <th>Current price</th>
                <th>Profit / Loss</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {positions.length > 0 ? (
                positions.map(pos => {
                  const livePrice = pos.symbol === selectedAsset ? currentMarketPrice : pos.entryPrice; 
                  const profit = getPositionProfit(pos, livePrice);
                  const isProfit = profit >= 0;
                  const decimals = pos.symbol.includes('JPY') || pos.symbol === 'GOLD' || pos.symbol === 'OIL' || pos.symbol.includes('BTC') || pos.symbol.includes('ETH') ? 2 : 4;

                  return (
                    <tr key={pos.id}>
                      <td className="font-mono text-muted text-xs">{pos.id}</td>
                      <td>
                        <span className="font-label" style={{ fontWeight: 600 }}>{pos.symbol}</span>
                      </td>
                      <td>
                        <span className={`type-tag ${pos.type === 'BUY' ? 'tag-buy' : 'tag-sell'}`}>
                          {pos.type}
                        </span>
                      </td>
                      <td className="font-mono">{pos.size}</td>
                      <td className="font-mono">{pos.entryPrice.toLocaleString(undefined, { minimumFractionDigits: decimals })}</td>
                      <td className="font-mono">{livePrice.toLocaleString(undefined, { minimumFractionDigits: decimals })}</td>
                      <td className={`font-mono ${isProfit ? 'text-success' : 'text-danger'}`} style={{ fontWeight: 600 }}>
                        ${isProfit ? '+' : ''}{profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          className="btn btn-secondary btn-sm flex items-center gap-2 btn-close-pos"
                          onClick={() => handleClosePosition(pos.id)}
                        >
                          <X size={12} />
                          Close Deal
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-muted" style={{ padding: '2.5rem' }}>
                    No active positions. Execute a BUY or SELL order to test real-time pricing and margin calculation.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!currentUser && (
        <button
          className="btn btn-secondary btn-sm text-center"
          style={{ margin: '1.5rem auto 0 auto', display: 'block' }}
          onClick={() => {
            if (window.confirm('Reset virtual cash balance to $10,000.00? This clears open positions.')) {
              setBalance(10000.00);
              setPositions([]);
              localStorage.setItem('aura_demo_balance', '10000.00');
            }
          }}
        >
          Reset Simulation Balance
        </button>
      )}

      <style>{`
        .trading-simulator-container {
          width: 100%;
        }
        .chart-card {
          grid-column: span 2;
          padding: 1.5rem;
          min-height: 400px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .chart-header {
          border-bottom: 1px solid var(--color-border-light);
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }
        .chart-asset-label {
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          color: var(--color-text-muted);
        }
        .chart-asset-title {
          font-size: 1.6rem;
          margin-top: 0.25rem;
        }
        .live-badge {
          font-size: 0.75rem;
          background-color: var(--color-gold-light);
          color: var(--color-gold);
          border: 1px solid var(--color-gold-border);
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          font-weight: 700;
          letter-spacing: 0.05em;
          gap: 0.25rem;
        }
        .live-dot {
          width: 6px;
          height: 6px;
          background-color: var(--color-gold);
          border-radius: 50%;
          display: inline-block;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.6; }
        }
        .chart-price-display {
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--color-blue-deep);
        }
        .svg-chart-container {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 250px;
        }
        .svg-chart {
          width: 100%;
          height: 100%;
        }
        .live-pulse-circle {
          animation: corePulse 1s infinite alternate;
        }
        @keyframes corePulse {
          0% { r: 5; }
          100% { r: 7.5; }
        }
        .stat-card {
          padding: 1.25rem;
          box-shadow: var(--shadow-sm);
        }
        .stat-icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-icon-wrapper.bg-blue {
          background-color: var(--color-blue-soft);
        }
        .stat-icon-wrapper.bg-gold {
          background-color: var(--color-gold-light);
        }
        .stat-icon-wrapper.bg-light {
          background-color: var(--color-bg-alt);
        }
        .color-blue {
          color: var(--color-blue-primary);
        }
        .color-gold {
          color: var(--color-gold);
        }
        .stat-val {
          font-size: 1.35rem;
          font-weight: 700;
        }
        .font-label {
          font-weight: 600;
        }
        .control-card {
          padding: 1.75rem;
          box-shadow: var(--shadow-md);
        }
        .control-title {
          font-size: 1.25rem;
          font-weight: 700;
        }
        .margin-summary-card {
          background-color: var(--color-bg);
          border: 1px solid var(--color-border-light);
          padding: 0.75rem;
          border-radius: var(--radius-md);
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .btn-sell {
          background-color: #ef4444;
          color: var(--color-white);
          border: none;
        }
        .btn-sell:hover {
          background-color: #dc2626;
          transform: translateY(-2px);
        }
        .btn-buy {
          background-color: #10b981;
          color: var(--color-white);
          border: none;
        }
        .btn-buy:hover {
          background-color: #059669;
          transform: translateY(-2px);
        }
        .btn-label-action {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          opacity: 0.9;
        }
        .btn-price-val {
          font-size: 0.95rem;
          font-weight: 700;
        }
        .notification {
          position: fixed;
          top: 85px;
          right: 20px;
          padding: 1rem 1.5rem;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          z-index: 1001;
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          0% { transform: translateY(-20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .notif-success {
          background-color: var(--color-success-bg);
          color: var(--color-success);
          border-left: 5px solid var(--color-success);
        }
        .notif-error {
          background-color: var(--color-danger-bg);
          color: var(--color-danger);
          border-left: 5px solid var(--color-danger);
        }
        .type-tag {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.15rem 0.4rem;
          border-radius: var(--radius-sm);
        }
        .tag-buy {
          background-color: var(--color-success-bg);
          color: var(--color-success);
        }
        .tag-sell {
          background-color: var(--color-danger-bg);
          color: var(--color-danger);
        }
        .btn-close-pos {
          padding: 0.4rem 0.8rem;
          font-size: 0.75rem;
          border-radius: var(--radius-sm);
        }
        .btn-close-pos:hover {
          background-color: var(--color-danger);
          color: var(--color-white);
          border-color: var(--color-danger);
        }
        @media (max-width: 992px) {
          .simulator-body {
            grid-template-columns: 1fr;
          }
          .chart-card {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
}
