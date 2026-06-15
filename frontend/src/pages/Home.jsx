import React, { useEffect } from 'react';
import { Shield, Award, Zap, ChevronRight, Check, Sparkles, Star, TrendingUp, DollarSign } from 'lucide-react';
import MarketTable from '../components/MarketTable';
import TradingSimulator from '../components/TradingSimulator';
import CompareCalculator from '../components/CompareCalculator';

export default function Home({ selectedAsset, setSelectedAsset, currentUser, onOpenAuth }) {
  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    const elements = document.querySelectorAll(
      '.animate-on-scroll, .animate-fade-in, .animate-slide-left, .animate-slide-right, .animate-scale-in'
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const accountTiers = [
    {
      name: 'Standard Account',
      minDeposit: '$100',
      spreads: 'From 1.2 pips',
      leverage: 'Up to 1:100',
      commission: 'Zero Commission',
      popular: false,
      features: ['24/7 Standard Support', 'Access to 100+ CFDs', 'Free Market Analysis', 'Negative Balance Protection']
    },
    {
      name: 'Professional Account',
      minDeposit: '$2,000',
      spreads: 'From 0.4 pips',
      leverage: 'Up to 1:100',
      commission: '$3 per lot',
      popular: true,
      features: ['Dedicated Account Manager', 'Raw ECN Spreads', 'Advanced Charting Tools', 'Priority Support Channels', 'Exclusive Webinar Invites']
    },
    {
      name: 'VIP Institutional',
      minDeposit: '$25,000',
      spreads: 'From 0.0 pips',
      leverage: 'Up to 1:200',
      commission: 'Custom rates',
      popular: false,
      features: ['1-on-1 Trading Mentorship', 'Custom API Liquidity', 'Free VPS Hosting', 'No-cost Deposits & Withdrawals', 'VIP Lounge Events']
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section — Full Background Image */}
      <header className="hero">
        <div className="container grid grid-cols-2 gap-8 items-center flex-col-mobile hero-container">
          <div className="hero-content flex flex-col gap-4 animate-slide-left visible">
            <div className="badge badge-gold flex items-center gap-2">
              <Shield size={16} className="text-gold" />
              <span className="gold-shimmer-text">Regulated STP/ECN Liquidity Broker</span>
            </div>
            <h1 className="text-white">Empower Your Financial Horizon</h1>
            <p className="hero-desc">
              Trade Forex, Cryptocurrencies, and Commodities with ultra-competitive raw spreads, lightning-fast order matching, and a state-of-the-art virtual dashboard.
            </p>
            <div className="flex gap-4 flex-col-mobile" style={{ marginTop: '1.5rem' }}>
              {currentUser ? (
                <button 
                  className="btn btn-gold btn-lg flex items-center justify-center gap-2"
                  onClick={() => {
                    document.getElementById('trading-desk')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>Go to Trading Desk</span>
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button 
                  className="btn btn-gold btn-lg flex items-center justify-center gap-2"
                  onClick={onOpenAuth}
                >
                  <span>Create Demo Profile</span>
                  <ChevronRight size={18} />
                </button>
              )}
              <button 
                className="btn btn-secondary btn-lg btn-white-border flex items-center justify-center"
                onClick={() => {
                  document.getElementById('account-tiers')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Compare Account Tiers
              </button>
            </div>
          </div>
          
          {/* Glassmorphic Stats Grid */}
          <div className="hero-stats-panel grid grid-cols-2 gap-4 animate-slide-right visible">
            <div className="glass-card stat-box">
              <div className="stat-value font-mono"><span className="gold-shimmer-text">15ms</span></div>
              <div className="stat-label">Avg Execution Speed</div>
            </div>
            <div className="glass-card stat-box">
              <div className="stat-value font-mono">$4.2B+</div>
              <div className="stat-label">Daily Volume Traded</div>
            </div>
            <div className="glass-card stat-box">
              <div className="stat-value font-mono">0.0 pips</div>
              <div className="stat-label">ECN Spreads from</div>
            </div>
            <div className="glass-card stat-box">
              <div className="stat-value font-mono">120K+</div>
              <div className="stat-label">Active Global Traders</div>
            </div>
          </div>
        </div>
      </header>

      {/* Feature Value Props */}
      <section className="features-banner section-bg-white section animate-on-scroll">
        <div className="container">
          <div className="grid grid-cols-3 gap-8">
            <div className="feature-item flex flex-col gap-2">
              <Award size={36} className="text-gold" />
              <h3>Globally Awarded Spreads</h3>
              <p className="text-sm text-muted">
                Leverage institutional relationships for raw spreads starting from 0.0 pips. Enjoy zero-markup routing.
              </p>
            </div>
            <div className="feature-item flex flex-col gap-2">
              <Zap size={36} className="text-gold" />
              <h3>High-Speed Matching</h3>
              <p className="text-sm text-muted">
                Orders are executed on our premium NY4 servers, ensuring sub-15ms processing speeds and minimal slippage.
              </p>
            </div>
            <div className="feature-item flex flex-col gap-2">
              <Shield size={36} className="text-gold" />
              <h3>Fortified Safety Policies</h3>
              <p className="text-sm text-muted">
                Fully segregated client funds with negative balance mitigation ensure risk exposure is rigidly governed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compare Calculator section */}
      <section className="section animate-on-scroll">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            <h2>Cost Efficiency Spotlight</h2>
            <p className="text-muted" style={{ marginTop: '0.5rem' }}>
              Unlike retail brokers, AuraTrade cuts margin rate markups. Adjust the slider to audit borrowing costs.
            </p>
          </div>
          <CompareCalculator />
        </div>
      </section>

      {/* Interactive Trading Simulator */}
      <section id="trading-desk" className="section section-bg-white animate-on-scroll">
        <div className="container flex flex-col gap-8">
          <div className="text-center" style={{ marginBottom: '1.5rem' }}>
            <h2>Simulated Trading Desk</h2>
            <p className="text-muted" style={{ marginTop: '0.5rem' }}>
              Practice positioning orders using virtual funds. Test live pricing spreads before going live.
            </p>
            {!currentUser && (
              <div className="login-warning-box flex items-center gap-3 justify-center" style={{ marginTop: '1rem' }}>
                <Sparkles size={16} className="text-gold" />
                <span className="text-xs">
                  Currently trading as guest. <button onClick={onOpenAuth} className="underline-btn">Sign up now</button> to persist balances and view your personal audit records.
                </span>
              </div>
            )}
          </div>
          <TradingSimulator 
            selectedAsset={selectedAsset} 
            setSelectedAsset={setSelectedAsset} 
            currentUser={currentUser}
          />
        </div>
      </section>

      {/* Market rates pricing table */}
      <section id="market-rates" className="section animate-on-scroll">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            <h2>Real-Time Market Rates</h2>
            <p className="text-muted">Select an asset from the table below to load it into the Live Trading Desk.</p>
          </div>
          <MarketTable onSelectAsset={(symbol) => {
            setSelectedAsset(symbol);
            setTimeout(() => {
              document.getElementById('trading-desk')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }} />
        </div>
      </section>

      {/* Financial Insights Feed */}
      <section className="section section-bg-white animate-on-scroll">
        <div className="container">
          <div className="flex justify-between items-center" style={{ marginBottom: '2.5rem' }}>
            <div>
              <h2>Market Insights & Analysis</h2>
              <p className="text-muted">Real-time intelligence from our global trading desk.</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => alert('Newsletter registration successful!')}>
              Subscribe to Insights
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-8">
            <div className="card card-static flex flex-col justify-between" style={{ padding: '1.5rem' }}>
              <div>
                <span className="badge badge-blue" style={{ marginBottom: '1rem' }}>Forex</span>
                <h4 style={{ marginBottom: '0.75rem' }}>Euro Inches Higher as ECB Signals Slower Rate Reductions</h4>
                <p className="text-xs text-muted" style={{ marginBottom: '1rem' }}>
                  The EUR/USD pair found fresh buyers near 1.0820 today as ECB policy makers suggested that interest rate normalization might proceed at a more measured pace than previously anticipated.
                </p>
              </div>
              <div className="flex justify-between items-center text-xs text-muted" style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '0.75rem' }}>
                <span>By Aura Analysis Desk</span>
                <span>2 hours ago</span>
              </div>
            </div>
            <div className="card card-static flex flex-col justify-between" style={{ padding: '1.5rem' }}>
              <div>
                <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>Commodities</span>
                <h4 style={{ marginBottom: '0.75rem' }}>Gold Holds Gains Above $2,300 Amid Safe-Haven Flows</h4>
                <p className="text-xs text-muted" style={{ marginBottom: '1rem' }}>
                  Spot gold prices remained resilient during mid-day European trading, finding solid technical support. Analysts point to macro headwinds and ongoing geopolitical hedges.
                </p>
              </div>
              <div className="flex justify-between items-center text-xs text-muted" style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '0.75rem' }}>
                <span>By Commodity Analysts</span>
                <span>4 hours ago</span>
              </div>
            </div>
            <div className="card card-static flex flex-col justify-between" style={{ padding: '1.5rem' }}>
              <div>
                <span className="badge badge-blue" style={{ marginBottom: '1rem' }}>Crypto</span>
                <h4 style={{ marginBottom: '0.75rem' }}>Bitcoin Consolidation Nears Breakout Zone</h4>
                <p className="text-xs text-muted" style={{ marginBottom: '1rem' }}>
                  BTC continues to consolidate between $67,500 and $69,200. On-chain volume reports indicate long-term accumulation from institutional custody accounts is accelerating.
                </p>
              </div>
              <div className="flex justify-between items-center text-xs text-muted" style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '0.75rem' }}>
                <span>By Crypto Research</span>
                <span>6 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Account Tier grids */}
      <section id="account-tiers" className="section animate-on-scroll">
        <div className="container flex flex-col gap-8">
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <h2>Tailored Trading Accounts</h2>
            <p className="text-muted" style={{ marginTop: '0.5rem' }}>
              Choose a tier that fits your trading capital and transaction volume goals.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 flex-col-mobile">
            {accountTiers.map((tier, index) => (
              <div 
                key={index} 
                className={`card account-card flex flex-col justify-between ${
                  tier.popular ? 'card-blue-accent border-highlight-gold shadow-premium' : ''
                }`}
              >
                <div>
                  {tier.popular && <span className="popular-badge">MOST POPULAR</span>}
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{tier.name}</h3>
                  <div className="tier-deposit flex items-baseline gap-2">
                    <span className="deposit-val">{tier.minDeposit}</span>
                    <span className="text-xs text-muted">min deposit</span>
                  </div>
                  
                  <div className="tier-stats-list flex flex-col" style={{ margin: '1.5rem 0' }}>
                    <div className="flex justify-between text-sm py-2">
                      <span className="text-muted">Target Spreads:</span>
                      <strong style={{ color: 'var(--color-blue-deep)' }}>{tier.spreads}</strong>
                    </div>
                    <div className="flex justify-between text-sm py-2">
                      <span className="text-muted">Leverage Options:</span>
                      <strong style={{ color: 'var(--color-blue-deep)' }}>{tier.leverage}</strong>
                    </div>
                    <div className="flex justify-between text-sm py-2">
                      <span className="text-muted">Execution Model:</span>
                      <strong style={{ color: 'var(--color-blue-deep)' }}>STP / ECN</strong>
                    </div>
                    <div className="flex justify-between text-sm py-2">
                      <span className="text-muted">Commission:</span>
                      <strong style={{ color: 'var(--color-blue-deep)' }}>{tier.commission}</strong>
                    </div>
                  </div>

                  <ul className="tier-features-list flex flex-col gap-2">
                    {tier.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-center gap-2 text-sm text-muted">
                        <Check size={14} className="text-gold" style={{ flexShrink: 0 }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  className={`btn w-full ${tier.popular ? 'btn-gold' : 'btn-secondary'}`}
                  style={{ width: '100%', marginTop: '2.5rem' }}
                  onClick={() => alert(`Redirecting to open a live ${tier.name}. Secure KYC verification required.`)}
                >
                  Create Account
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .home-page {
          width: 100%;
        }
        .hero {
          position: relative;
          background-image: linear-gradient(var(--color-bg-hero-overlay), var(--color-bg-hero-overlay)), url('/trading_hero.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          min-height: 85vh;
          display: flex;
          align-items: center;
          color: var(--color-white);
          border-bottom: 1px solid var(--color-blue-deep);
          padding: 5rem 0;
        }
        .hero-container {
          position: relative;
          z-index: 2;
        }
        .hero-desc {
          font-size: 1.15rem;
          line-height: 1.6;
          max-width: 550px;
          color: rgba(255, 255, 255, 0.85);
        }
        .gold-shimmer-text {
          background: var(--color-gold-shimmer);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
          font-weight: 800;
        }
        .btn-white-border {
          background: transparent;
          border: 2px solid rgba(255, 255, 255, 0.4);
          color: var(--color-white);
        }
        .btn-white-border:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--color-white);
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          padding: 1.75rem;
          color: var(--color-white);
          transition: var(--transition-smooth);
        }
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.09);
          transform: translateY(-5px);
          border-color: rgba(255, 255, 255, 0.25);
          box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.25), 0 8px 20px -6px rgba(201, 152, 26, 0.15);
        }
        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 0.35rem;
        }
        .stat-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.55);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 600;
        }
        .popular-badge {
          background-color: var(--color-blue-deep);
          color: var(--color-gold-bright);
          font-size: 0.7rem;
          font-weight: 800;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          letter-spacing: 0.05em;
          display: inline-block;
          margin-bottom: 0.75rem;
        }
        .border-highlight-gold {
          border-color: var(--color-gold-border) !important;
        }
        .deposit-val {
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--color-blue-deep);
        }
        .tier-features-list {
          list-style: none;
          margin-top: 1.5rem;
        }
        .py-2 {
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--color-border-light);
        }
        .login-warning-box {
          background-color: var(--color-gold-light);
          border: 1px dashed var(--color-gold-border);
          color: var(--color-gold);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          width: fit-content;
          margin-inline: auto;
        }
        .underline-btn {
          background: none;
          border: none;
          color: inherit;
          text-decoration: underline;
          cursor: pointer;
          font-weight: 700;
        }
        @media (max-width: 992px) {
          .hero {
            background-attachment: scroll;
            min-height: auto;
          }
          .hero-stats-panel {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 768px) {
          .hero-stats-panel {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
