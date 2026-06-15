import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function LiveTicker() {
  const [rates, setRates] = useState([
    { symbol: 'EUR/USD', price: 1.0854, change: 0.12 },
    { symbol: 'GBP/USD', price: 1.2732, change: -0.05 },
    { symbol: 'USD/JPY', price: 157.45, change: 0.28 },
    { symbol: 'BTC/USD', price: 68420.50, change: 2.45 },
    { symbol: 'ETH/USD', price: 3542.20, change: 1.88 },
    { symbol: 'GOLD', price: 2324.80, change: -0.42 },
    { symbol: 'OIL', price: 78.45, change: 0.95 }
  ]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/markets`);
        if (response.ok) {
          const result = await response.json();
          if (result.data) {
            setRates(result.data);
          }
        }
      } catch (error) {
        // Fallback to local ticking simulation if server isn't running yet
        setRates(prev => prev.map(item => {
          const delta = (Math.random() - 0.5) * item.price * 0.0005;
          const newPrice = Math.max(0.0001, item.price + delta);
          const decimals = item.symbol.includes('JPY') || item.symbol === 'OIL' || item.symbol === 'GOLD' || item.symbol.includes('BTC') || item.symbol.includes('ETH') ? 2 : 4;
          return {
            ...item,
            price: Number(newPrice.toFixed(decimals)),
            change: Number((item.change + (Math.random() - 0.5) * 0.05).toFixed(2))
          };
        }));
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 3000);
    return () => clearInterval(interval);
  }, []);

  // Duplicate items to ensure continuous infinite scrolling effect in CSS marquee
  const doubleRates = [...rates, ...rates, ...rates];

  return (
    <div className="ticker-bar">
      <div className="ticker-container">
        <div className="animate-marquee">
          {doubleRates.map((item, index) => {
            const isUp = item.change >= 0;
            return (
              <div key={`${item.symbol}-${index}`} className="ticker-item flex items-center">
                <span className="ticker-symbol">{item.symbol}</span>
                <span className="ticker-price">
                  {item.symbol === 'GOLD' || item.symbol === 'OIL' ? '$' : ''}
                  {item.price.toLocaleString(undefined, { minimumFractionDigits: item.symbol.includes('JPY') ? 2 : (item.symbol.includes('/') ? 4 : 2) })}
                </span>
                <span className={`ticker-change flex items-center ${isUp ? 'text-up' : 'text-down'}`}>
                  {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {isUp ? '+' : ''}{item.change.toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .ticker-bar {
          background-color: var(--color-blue-deep);
          color: var(--color-white);
          height: 40px;
          display: flex;
          align-items: center;
          overflow: hidden;
          font-size: 0.8rem;
          font-weight: 500;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .ticker-container {
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        .ticker-item {
          padding: 0 2rem;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          white-space: nowrap;
          gap: 0.5rem;
        }
        .ticker-symbol {
          font-weight: 700;
          color: var(--color-white);
          letter-spacing: 0.05em;
        }
        .ticker-price {
          color: rgba(255, 255, 255, 0.85);
          font-family: monospace;
          font-size: 0.85rem;
        }
        .ticker-change {
          font-weight: 600;
          gap: 0.1rem;
        }
        .text-up {
          color: #34d399; /* emerald-400 */
        }
        .text-down {
          color: #f87171; /* red-400 */
        }
      `}</style>
    </div>
  );
}
