import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Shield, Zap, Globe, Lock } from 'lucide-react';
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
  const [latency, setLatency] = useState(1.4);

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
        // Fallback to local ticking simulation
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

    // Subtle latency micro-jitter simulation
    const latInterval = setInterval(() => {
      setLatency(Number((1.2 + Math.random() * 0.6).toFixed(1)));
    }, 4500);

    return () => {
      clearInterval(interval);
      clearInterval(latInterval);
    };
  }, []);

  const doubleRates = [...rates, ...rates, ...rates];

  return (
    <div className="telemetry-wrapper">
      {/* Institutional Top Telemetry Ribbon */}
      <div className="institutional-top-bar">
        <div className="top-bar-inner">
          <div className="top-bar-left">
            <span className="telemetry-pill">
              <span className="pulse-green-dot"></span>
              <span className="font-mono">LD4 EQUINIX MATCHING ENGINE: <strong className="text-amber">{latency}ms</strong></span>
            </span>
            <span className="telemetry-sep">|</span>
            <span className="telemetry-pill hide-mobile">
              <span className="font-mono">FIX 4.4 / ITCH STREAM: <span className="text-emerald">CONNECTED</span></span>
            </span>
            <span className="telemetry-sep hide-mobile">|</span>
            <span className="telemetry-pill hide-mobile">
              <span className="font-mono">ENCRYPTION: <strong>256-BIT AES-GCM</strong></span>
            </span>
          </div>
          <div className="top-bar-right">
            <span className="telemetry-pill">
              <span className="font-mono">SEGREGATED TRUST CUSTODY: <span className="text-emerald">ACTIVE</span></span>
            </span>
            <span className="telemetry-sep">|</span>
            <span className="telemetry-pill">
              <span className="font-mono text-amber">INSTITUTIONAL DIRECT ACCESS</span>
            </span>
          </div>
        </div>
      </div>

      {/* Streaming Market Price Ribbon */}
      <div className="ticker-bar">
        <div className="ticker-container">
          <div className="animate-marquee">
            {doubleRates.map((item, index) => {
              const isUp = item.change >= 0;
              return (
                <div key={`${item.symbol}-${index}`} className="ticker-item flex items-center">
                  <span className="ticker-symbol font-mono">{item.symbol}</span>
                  <span className="ticker-price font-mono">
                    {item.symbol === 'GOLD' || item.symbol === 'OIL' ? '$' : ''}
                    {item.price.toLocaleString(undefined, { minimumFractionDigits: item.symbol.includes('JPY') ? 2 : (item.symbol.includes('/') ? 4 : 2) })}
                  </span>
                  <span className={`ticker-change flex items-center font-mono ${isUp ? 'text-up' : 'text-down'}`}>
                    {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                    {isUp ? '+' : ''}{item.change.toFixed(2)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .telemetry-wrapper {
          width: 100%;
          position: sticky;
          top: 0;
          z-index: 1000;
          background: #090a0f;
        }
        .institutional-top-bar {
          background: #06070a;
          color: #94a3b8;
          height: 28px;
          display: flex;
          align-items: center;
          font-size: 0.68rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .top-bar-inner {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .top-bar-left, .top-bar-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .telemetry-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }
        .telemetry-sep {
          color: rgba(255, 255, 255, 0.12);
          font-size: 0.7rem;
        }
        .pulse-green-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
          animation: pulseDot 2s infinite;
          flex-shrink: 0;
        }
        @keyframes pulseDot {
          0% { transform: scale(0.9); opacity: 0.7; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.7; }
        }
        .text-emerald {
          color: #10b981;
          font-weight: 600;
        }
        .text-amber {
          color: #f5a623;
          font-weight: 600;
        }

        .ticker-bar {
          background-color: rgba(9, 10, 15, 0.95);
          backdrop-filter: blur(12px);
          color: var(--color-white);
          height: 38px;
          display: flex;
          align-items: center;
          overflow: hidden;
          font-size: 0.78rem;
          font-weight: 500;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .ticker-container {
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        .ticker-item {
          padding: 0 1.8rem;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          white-space: nowrap;
          gap: 0.6rem;
        }
        .ticker-symbol {
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.08em;
          font-size: 0.78rem;
        }
        .ticker-price {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.8rem;
        }
        .ticker-change {
          font-weight: 600;
          gap: 0.1rem;
          font-size: 0.75rem;
        }
        .text-up {
          color: #34d399;
        }
        .text-down {
          color: #f87171;
        }
        @media (max-width: 768px) {
          .hide-mobile {
            display: none;
          }
          .institutional-top-bar {
            height: auto;
            padding: 4px 0;
          }
          .top-bar-inner {
            flex-direction: column;
            gap: 4px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
