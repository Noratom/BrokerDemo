import React, { useEffect } from 'react';
import {
  Shield, Award, Zap, ChevronRight, Check, Sparkles,
  Lock, BarChart2, TrendingUp, Globe, CheckSquare, Phone,
  ArrowDownCircle, ArrowUpCircle, Landmark, Wallet, Plus, Activity
} from 'lucide-react';
import MarketTable from '../components/MarketTable';
import TradingSimulator from '../components/TradingSimulator';
import CompareCalculator from '../components/CompareCalculator';

export default function Home({ selectedAsset, setSelectedAsset, currentUser, onOpenAuth, onOpenFunding }) {
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

  // Investment / pricing tiers (Bronze / Silver / Premium)
  const pricingTiers = [
    {
      name: 'Bronze Series',
      roi: '20%',
      duration: '24 Hours',
      min: '$500',
      minRaw: '500',
      max: '$10,000',
      tag: 'FOUNDATION',
      features: [
        'Duration: 24 Hours Cycle',
        'Minimum Deposit: $500',
        'Maximum Deposit: $10,000',
        'Automated Risk Guard',
        '24/7 Member Desk Support',
      ],
    },
    {
      name: 'Silver Series',
      roi: '40%',
      duration: '48 Hours',
      min: '$10,000',
      minRaw: '10000',
      max: '$50,000',
      popular: true,
      tag: 'ADVANCED EDGE',
      features: [
        'Duration: 48 Hours Cycle',
        'Minimum Deposit: $10,000',
        'Maximum Deposit: $50,000',
        'Priority Liquidity Routing',
        'Dedicated Execution Manager',
        'Daily Market Briefings',
      ],
    },
    {
      name: 'Premium Institutional',
      roi: '60%',
      duration: '72 Hours',
      min: '$50,000',
      minRaw: '50000',
      max: 'Unlimited',
      tag: 'MENTAL EDGE / VIP',
      features: [
        'Duration: 72 Hours Cycle',
        'Minimum Deposit: $50,000',
        'Maximum Deposit: Unlimited',
        'Raw Institutional Liquidity',
        'Direct Desk Mentorship',
        'Priority Blockchain Withdrawals',
      ],
    },
  ];

  // Why Choose Us items
  const whyItems = [
    {
      icon: <Lock size={24} style={{ color: 'var(--color-amber)' }} />,
      title: 'Security & Privacy',
      desc: 'All assets and client credentials are protected with 256-bit institutional encryption and multi-layer biometric vaults.',
    },
    {
      icon: <BarChart2 size={24} style={{ color: 'var(--color-amber)' }} />,
      title: 'Technical Edge',
      desc: 'Institutional analytics, radar market telemetry, and order flow diagnosis to trade with unwavering consistency.',
    },
    {
      icon: <Shield size={24} style={{ color: 'var(--color-amber)' }} />,
      title: 'Asset Protection',
      desc: 'Client capital is held in segregated Tier-1 banking trusts and protected by negative balance insurance covenants.',
    },
    {
      icon: <Globe size={24} style={{ color: 'var(--color-amber)' }} />,
      title: 'Direct Market Access',
      desc: 'Direct STP/ECN liquidity pipelines previously reserved exclusively for top-tier prop institutions and hedge desks.',
    },
  ];

  const handlePlanClick = (tier) => {
    if (onOpenFunding) {
      onOpenFunding('deposit', tier.minRaw);
    } else if (currentUser) {
      document.getElementById('funding')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      onOpenAuth();
    }
  };

  return (
    <div className="home-page">

      {/* ═══════════════════════════════
          1. HERO SECTION (Continuum Trading Visual Style)
      ═══════════════════════════════ */}
      <header className="hero">
        <div className="container hero-container grid grid-cols-2 gap-8 items-center flex-col-mobile">
          {/* Left Text */}
          <div className="hero-content flex flex-col gap-4 animate-slide-left visible">
            <div className="tech-tag">
              <span className="tech-dot"></span>
              <span>CONTINUUM TRADING</span>
            </div>
            
            <h1 className="hero-headline">
              <span className="headline-dim">Know the market.</span><br />
              <span className="headline-dim">Know yourself.</span><br />
              <span className="headline-bright">Trade the plan.</span>
            </h1>

            <p className="hero-desc">
              A complete institutional trading platform and high-yield liquidity ecosystem for traders who are done restarting. Technicals, execution, and guaranteed capital protection.
            </p>

            <div className="flex gap-4 flex-wrap hero-cta-row">
              {currentUser ? (
                <button
                  className="btn btn-primary btn-lg flex items-center justify-center gap-2"
                  onClick={() => {
                    document.getElementById('investment')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>View Investment Plans</span>
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-lg flex items-center justify-center gap-2"
                  onClick={onOpenAuth}
                >
                  <span>Start with Access</span>
                  <ChevronRight size={18} />
                </button>
              )}

              <button
                className="btn btn-secondary btn-lg flex items-center justify-center gap-2"
                onClick={() => {
                  if (onOpenFunding) onOpenFunding('deposit', '500');
                  else document.getElementById('funding')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <ArrowDownCircle size={17} style={{ color: 'var(--color-amber)' }} />
                <span>Deposit / Fund</span>
              </button>
            </div>

            {/* Micro series stats */}
            <div className="hero-micro-bar flex items-center gap-6">
              <div className="hero-micro-item">
                <span className="micro-label">SERIES ACCESS</span>
                <span className="micro-value font-mono">1,497 ONCE</span>
              </div>
              <div className="hero-micro-item">
                <span className="micro-label">WITHDRAWAL SPEED</span>
                <span className="micro-value font-mono text-amber">INSTANT / 24H</span>
              </div>
              <div className="hero-micro-item hide-mobile">
                <span className="micro-label">COMMUNITY</span>
                <span className="micro-value font-mono">PRIVATE DESK</span>
              </div>
            </div>

            <div className="hero-version-pill flex items-center gap-3">
              <span className="badge badge-gold">NEW IN 2.0</span>
              <span className="font-mono text-xs text-muted uppercase">ATLAS, INSTRUMENTS, LEDGER, FUNDING PORTAL</span>
            </div>
          </div>

          {/* Right Continuum Radar Graphic */}
          <div className="hero-radar-wrapper flex items-center justify-center animate-slide-right visible">
            <div className="continuum-radar-box">
              <svg viewBox="0 0 380 380" className="radar-svg">
                <defs>
                  <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(245, 166, 35, 0.15)" />
                    <stop offset="60%" stopColor="rgba(245, 166, 35, 0.03)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>

                {/* Concentric rings */}
                <circle cx="190" cy="190" r="160" fill="url(#radarGlow)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                <circle cx="190" cy="190" r="120" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="190" cy="190" r="80" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                <circle cx="190" cy="190" r="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

                {/* Crosshairs */}
                <line x1="190" y1="20" x2="190" y2="360" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="20" y1="190" x2="360" y2="190" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                {/* Radar nodes */}
                <circle cx="190" cy="190" r="4" fill="#ffffff" />
                <circle cx="140" cy="130" r="3" fill="#94a3b8" />
                <circle cx="250" cy="110" r="3" fill="#94a3b8" />
                <circle cx="270" cy="220" r="3" fill="#94a3b8" />
                <circle cx="110" cy="240" r="3" fill="#94a3b8" />
                <circle cx="210" cy="270" r="3" fill="#94a3b8" />
                <circle cx="85" cy="170" r="2.5" fill="#64748b" />
                <circle cx="310" cy="180" r="2.5" fill="#f43f5e" />

                {/* Active Continuum Glowing Amber Node */}
                <circle cx="295" cy="100" r="6" fill="#f5a623" className="radar-pulse-node" />
                <circle cx="295" cy="100" r="12" fill="none" stroke="#f5a623" strokeWidth="1" opacity="0.6" />
              </svg>

              <div className="radar-tag-pill font-mono">
                <span className="tech-dot"></span>
                <span>MENTAL EDGE - SERIES 3</span>
              </div>
              <p className="radar-subtext">
                Identity, execution and emotional regulation with live risk telemetry.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════
          2. 3-STEP STRIP
      ═══════════════════════════════ */}
      <section className="steps-strip animate-on-scroll">
        <div className="container">
          <div className="steps-grid">
            {[
              {
                step: '01',
                label: 'Membership Registration',
                desc: 'Create your private member profile in under two minutes with instant identity verification.',
              },
              {
                step: '02',
                label: 'Choose & Fund Plan',
                desc: 'Select a customized series plan and deposit via USDT, Bitcoin, Ethereum, or direct Wire Transfer.',
              },
              {
                step: '03',
                label: 'Harvest Passive Income',
                desc: 'Monitor automated returns in real-time. Request frictionless withdrawals 24/7 with zero transfer fees.',
              },
            ].map((s, i) => (
              <div key={i} className="step-card flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="step-num font-mono">{s.step}</span>
                  <CheckSquare size={20} style={{ color: 'var(--color-amber)' }} />
                </div>
                <h3 className="step-title">{s.label}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          3. OUR PURPOSE SECTION
      ═══════════════════════════════ */}
      <section className="purpose-section section animate-on-scroll">
        <div className="container purpose-inner">
          {/* Left text */}
          <div className="purpose-text animate-slide-left">
            <span className="section-label">THE CONTINUUM MANDATE</span>
            <h2 className="purpose-heading">
              Our common purpose is creating opportunities to rise.
            </h2>
            <div className="purpose-underline"></div>
            <p className="purpose-body">
              We operate under a simple law: eliminate retail friction, provide direct institutional-grade execution, and protect client equity with unwavering discipline.
            </p>
            <div className="flex gap-4" style={{ marginTop: '0.5rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  document.getElementById('investment')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore All Series
              </button>
            </div>
          </div>

          {/* Right card grid */}
          <div className="purpose-cards grid grid-cols-2 gap-4 animate-slide-right">
            <div className="purpose-card">
              <div className="purpose-card-tag font-mono">01 / TRADING</div>
              <div className="purpose-card-body">
                <TrendingUp size={22} style={{ color: 'var(--color-amber)' }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>Explore With Us</h4>
                  <p className="text-xs text-muted" style={{ margin: '0.25rem 0 0' }}>Institutional liquidity feeds</p>
                </div>
              </div>
            </div>

            <div className="purpose-card">
              <div className="purpose-card-tag font-mono">02 / PORTFOLIO</div>
              <div className="purpose-card-body">
                <BarChart2 size={22} style={{ color: 'var(--color-amber)' }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>Capital Management</h4>
                  <p className="text-xs text-muted" style={{ margin: '0.25rem 0 0' }}>Multi-asset yield allocation</p>
                </div>
              </div>
            </div>

            <div className="purpose-card">
              <div className="purpose-card-tag font-mono">03 / COLD VAULT</div>
              <div className="purpose-card-body">
                <Shield size={22} style={{ color: 'var(--color-amber)' }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>Asset Protection</h4>
                  <p className="text-xs text-muted" style={{ margin: '0.25rem 0 0' }}>Fully segregated custody</p>
                </div>
              </div>
            </div>

            <div className="purpose-card">
              <div className="purpose-card-tag font-mono">04 / GLOBAL</div>
              <div className="purpose-card-body">
                <Globe size={22} style={{ color: 'var(--color-amber)' }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>Global Markets</h4>
                  <p className="text-xs text-muted" style={{ margin: '0.25rem 0 0' }}>Forex, Crypto & Commodities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          TRADING DESK (Interactive feature)
      ═══════════════════════════════ */}
      <section id="trading-desk" className="section section-bg-blue animate-on-scroll">
        <div className="container flex flex-col gap-8">
          <div className="text-center">
            <span className="section-label">INSTITUTIONAL EXECUTION</span>
            <h2>Continuum WebTrader & Market Execution</h2>
            <p className="text-muted" style={{ marginTop: '0.5rem', maxWidth: '600px', margin: '0.5rem auto 0' }}>
              Direct market access terminal routing orders through Tier-1 interbank liquidity providers. Zero dealing desk intervention with ultra-low latency execution.
            </p>
            {!currentUser && (
              <div className="login-warning-box flex items-center gap-3 justify-center" style={{ marginTop: '1rem' }}>
                <Sparkles size={15} style={{ color: 'var(--color-amber)' }} />
                <span className="text-xs">
                  Direct Market Terminal Preview. <button onClick={onOpenAuth} className="underline-btn">Sign in to Live Account</button> to manage authorized equity and execute institutional orders.
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

      {/* ═══════════════════════════════
          MARKET RATES SECTION
      ═══════════════════════════════ */}
      <section id="market-rates" className="section animate-on-scroll">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            <span className="section-label">REAL-TIME FEEDS</span>
            <h2>Global Institutional Spreads</h2>
            <p className="text-muted">Select an asset from the table below to load its live tick telemetry into the Trading Desk.</p>
          </div>
          <MarketTable onSelectAsset={(symbol) => {
            setSelectedAsset(symbol);
            setTimeout(() => {
              document.getElementById('trading-desk')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }} />
        </div>
      </section>

      {/* ═══════════════════════════════
          4. INVESTMENT PLANS BANNER
      ═══════════════════════════════ */}
      <section id="investment" className="invest-banner animate-on-scroll">
        <div className="invest-banner-overlay">
          <div className="invest-banner-box">
            <span className="tech-tag" style={{ marginBottom: '0.5rem' }}>
              <span className="tech-dot"></span>
              PORTFOLIO SERIES
            </span>
            <h2 className="invest-banner-title">Investment Plans</h2>
            <p className="invest-banner-sub">
              Select the plan that matches your capital goals. All series benefit from automated stop-loss covenants and segregated tier-1 custody.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          5. PRICING CARDS (Bronze / Silver / Premium)
      ═══════════════════════════════ */}
      <section id="account-tiers" className="section animate-on-scroll">
        <div className="container flex flex-col gap-8">
          <div className="text-center" style={{ marginBottom: '1rem' }}>
            <span className="section-label">SELECT YOUR ALLOCATION</span>
            <h2>Institutional Series Plans</h2>
            <p className="text-muted" style={{ marginTop: '0.5rem' }}>
              Transparent returns with zero management or hidden carry fees.
            </p>
          </div>

          <div className="pricing-grid">
            {pricingTiers.map((tier, index) => (
              <div key={index} className={`pricing-card ${tier.popular ? 'pricing-card-popular' : ''}`}>
                {/* Header */}
                <div className="pricing-card-header">
                  <div className="flex justify-between items-center" style={{ marginBottom: '0.4rem' }}>
                    <span className="pricing-card-service font-mono">{tier.tag}</span>
                    {tier.popular && <span className="popular-badge font-mono">MOST POPULAR</span>}
                  </div>
                  <h3 className="pricing-card-name">{tier.name}</h3>
                </div>

                {/* ROI Number */}
                <div className="pricing-roi font-mono">{tier.roi}</div>
                <p className="pricing-roi-label font-mono">Target Return / {tier.duration}</p>

                {/* Divider */}
                <div className="pricing-divider"></div>

                {/* Features */}
                <ul className="pricing-features">
                  {tier.features.map((feat, fi) => (
                    <li key={fi} className="pricing-feature-item flex items-center gap-2">
                      <Check size={14} style={{ color: 'var(--color-amber)', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA opens Deposit with prefilled plan min */}
                <button
                  className={`btn w-full pricing-cta ${tier.popular ? 'btn-gold' : 'btn-primary'}`}
                  onClick={() => handlePlanClick(tier)}
                >
                  <Plus size={16} />
                  <span>Get Started ({tier.min})</span>
                </button>
                <p className="pricing-note font-mono">*Consultation & Risk Guidance Included</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          6. FAST & SECURE FUNDING (Deposit & Withdrawal Section)
      ═══════════════════════════════ */}
      <section id="funding" className="section funding-section animate-on-scroll">
        <div className="container">
          <div className="funding-banner-card">
            <div className="funding-banner-content">
              <div className="tech-tag" style={{ marginBottom: '0.75rem' }}>
                <span className="tech-dot"></span>
                <span>INSTANT LIQUIDITY & FUNDING</span>
              </div>
              <h2 className="funding-banner-heading">
                Instant Deposits.<br />Guaranteed Rapid Withdrawals.
              </h2>
              <p className="funding-banner-desc">
                Fund your trading portfolio in seconds via USDT (TRC-20), Bitcoin, Ethereum, or direct Wire Transfer with 0% deposit fees. Request capital withdrawals 24/7 with rapid on-chain dispatch and priority banking clearance.
              </p>

              <div className="flex gap-4 flex-wrap" style={{ marginTop: '1.75rem' }}>
                <button
                  className="btn btn-gold btn-lg flex items-center gap-2"
                  onClick={() => {
                    if (onOpenFunding) onOpenFunding('deposit', '500');
                    else onOpenAuth();
                  }}
                >
                  <ArrowDownCircle size={18} />
                  <span>Make a Deposit</span>
                </button>

                <button
                  className="btn btn-secondary btn-lg flex items-center gap-2"
                  onClick={() => {
                    if (onOpenFunding) onOpenFunding('withdraw');
                    else onOpenAuth();
                  }}
                >
                  <ArrowUpCircle size={18} />
                  <span>Request Withdrawal</span>
                </button>
              </div>
            </div>

            {/* Funding Perks Matrix */}
            <div className="funding-perks-grid">
              <div className="funding-perk-card">
                <div className="perk-icon-wrap"><Zap size={22} style={{ color: 'var(--color-amber)' }} /></div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Instant Execution</h4>
                  <p className="text-xs text-muted" style={{ margin: '0.2rem 0 0' }}>Automated blockchain confirmation pipeline</p>
                </div>
              </div>

              <div className="funding-perk-card">
                <div className="perk-icon-wrap"><Shield size={22} style={{ color: 'var(--color-amber)' }} /></div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem' }}>0% Deposit Fee</h4>
                  <p className="text-xs text-muted" style={{ margin: '0.2rem 0 0' }}>Zero deposit markups on all crypto and wire transfers</p>
                </div>
              </div>

              <div className="funding-perk-card">
                <div className="perk-icon-wrap"><Landmark size={22} style={{ color: 'var(--color-amber)' }} /></div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Segregated Custody</h4>
                  <p className="text-xs text-muted" style={{ margin: '0.2rem 0 0' }}>Client assets protected in Tier-1 independent trusts</p>
                </div>
              </div>

              <div className="funding-perk-card">
                <div className="perk-icon-wrap"><Lock size={22} style={{ color: 'var(--color-amber)' }} /></div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Same-Day Payouts</h4>
                  <p className="text-xs text-muted" style={{ margin: '0.2rem 0 0' }}>Automated withdrawal verification within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          7. WHY CHOOSE US
      ═══════════════════════════════ */}
      <section className="section why-section animate-on-scroll">
        <div className="container">
          <div className="text-center why-header">
            <span className="section-label">CONTINUUM ADVANTAGE</span>
            <h2>Smart Investing with Smart Ideas</h2>
            <p className="text-muted" style={{ marginTop: '0.75rem', maxWidth: '560px', margin: '0.75rem auto 0' }}>
              We combine cutting-edge execution technology with strict risk governance to protect and grow our members' wealth globally.
            </p>
          </div>
          <div className="why-grid">
            {whyItems.map((item, i) => (
              <div key={i} className="why-card flex flex-col gap-3">
                <div className="why-icon-wrap">
                  {item.icon}
                </div>
                <h4 className="why-title">{item.title}</h4>
                <p className="why-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          8. START A GOOD PLAN (Overview)
      ═══════════════════════════════ */}
      <section className="section overview-section animate-on-scroll">
        <div className="container">
          <div className="overview-card">
            <span className="section-label">SYSTEM OVERVIEW</span>
            <h2 className="overview-heading">Start a Good Plan</h2>
            <div className="overview-body">
              <p>
                Getting started with Continuum Trading is straightforward and transparent. Once you complete your membership registration and select your preferred series, your capital is deployed directly to managed institutional liquidity channels.
              </p>
              <p>
                Every member receives dedicated execution desk support, real-time portfolio telemetry, and guaranteed yields credited directly upon plan maturity. We believe that building enduring wealth requires clarity, discipline, and uncompromising risk management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          9. COST CALCULATOR (existing)
      ═══════════════════════════════ */}
      <section className="section section-bg-blue animate-on-scroll">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            <span className="section-label">COST TELEMETRY</span>
            <h2>Cost Efficiency Spotlight</h2>
            <p className="text-muted" style={{ marginTop: '0.5rem' }}>
              Compare borrowing costs across plans. Adjust the slider to audit potential yields.
            </p>
          </div>
          <CompareCalculator />
        </div>
      </section>

      {/* ═══════════════════════════════
          10. CTA STRIP — "Let Us Work For You"
      ═══════════════════════════════ */}
      <section className="cta-strip animate-on-scroll">
        <div className="container cta-strip-inner">
          <div className="cta-strip-text">
            <div className="tech-tag" style={{ marginBottom: '0.5rem' }}>
              <span className="tech-dot"></span>
              <span>GET STARTED TODAY</span>
            </div>
            <h2 className="cta-strip-heading">Let Us Work For You.</h2>
            <p className="cta-strip-sub">
              Join thousands of members already compounding capital with our high-yield trading ecosystem.
            </p>
          </div>
          <button
            className="btn btn-primary btn-lg cta-strip-btn"
            onClick={currentUser ? () => document.getElementById('investment')?.scrollIntoView({ behavior: 'smooth' }) : onOpenAuth}
          >
            Become a Member
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════
          11. NEED HELP? SPLIT SECTION
      ═══════════════════════════════ */}
      <section className="help-split animate-on-scroll">
        <div className="help-left">
          <div className="help-left-inner">
            <span className="section-label" style={{ color: 'var(--color-amber)' }}>DIRECT DESK</span>
            <h2 className="help-heading">Need Help?</h2>
            <p className="help-sub">Don't hesitate to contact our institutional desk.</p>
            <p className="help-body">
              Our support engineers and portfolio managers are available around the clock to assist you with any questions regarding deposits, withdrawals, or series upgrades.
            </p>
            <button
              className="btn btn-secondary"
              style={{ marginTop: '2rem' }}
              onClick={() => alert('Support desk ticket created. An engineer will contact you shortly.')}
            >
              <Phone size={15} style={{ color: 'var(--color-amber)' }} />
              <span>Contact Us</span>
            </button>
          </div>
        </div>

        <div className="help-right">
          <div className="help-right-overlay">
            <Globe size={90} style={{ color: 'rgba(255,255,255,0.08)' }} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          CONTINUUM HOME PAGE STYLES
      ═══════════════════════════════ */}
      <style>{`
        .home-page {
          width: 100%;
          background-color: var(--color-bg);
          color: var(--color-text-body);
        }

        /* ---- Section Label ---- */
        .section-label {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-amber);
          margin-bottom: 0.75rem;
        }

        /* ---- HERO ---- */
        .hero {
          position: relative;
          background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(245, 166, 35, 0.08), transparent 70%), #090a0f;
          min-height: 86vh;
          display: flex;
          align-items: center;
          padding: 6rem 0 5rem;
          border-bottom: 1px solid var(--color-border);
        }
        .hero-container {
          position: relative;
          z-index: 2;
        }
        .hero-headline {
          font-size: clamp(2.6rem, 5.5vw, 4rem);
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -0.03em;
        }
        .headline-dim {
          color: #94a3b8;
          font-weight: 600;
        }
        .headline-bright {
          color: #ffffff;
          font-weight: 800;
        }
        .hero-desc {
          font-size: 1.05rem;
          line-height: 1.65;
          color: var(--color-text-body);
          max-width: 540px;
        }
        .hero-cta-row {
          margin-top: 1rem;
        }
        .hero-micro-bar {
          margin-top: 1.25rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--color-border);
        }
        .hero-micro-item {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .micro-label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          color: var(--color-text-muted);
        }
        .micro-value {
          font-size: 0.85rem;
          font-weight: 700;
          color: #ffffff;
        }
        .hero-version-pill {
          margin-top: 1rem;
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--color-border);
          width: fit-content;
        }

        /* Continuum Radar Visual */
        .hero-radar-wrapper {
          position: relative;
        }
        .continuum-radar-box {
          position: relative;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
        }
        .radar-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .radar-pulse-node {
          animation: pulseNode 2s infinite alternate;
        }
        @keyframes pulseNode {
          0% { transform: scale(0.9); opacity: 0.8; }
          100% { transform: scale(1.3); opacity: 1; }
        }
        .radar-tag-pill {
          position: relative;
          z-index: 2;
          background: rgba(9, 10, 15, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid var(--color-border-highlight);
          padding: 0.4rem 0.9rem;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          color: var(--color-amber);
          display: inline-flex;
          align-items: center;
          margin-top: 160px;
        }
        .radar-subtext {
          position: relative;
          z-index: 2;
          font-size: 0.75rem;
          color: var(--color-text-muted);
          max-width: 220px;
          margin-top: 0.4rem;
        }

        /* ---- 3-STEP STRIP ---- */
        .steps-strip {
          background: var(--color-bg-alt);
          border-bottom: 1px solid var(--color-border);
          padding: 4rem 0;
        }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .step-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 1.75rem;
          transition: var(--transition-smooth);
        }
        .step-card:hover {
          border-color: var(--color-border-highlight);
          transform: translateY(-3px);
        }
        .step-num {
          font-size: 0.8rem;
          color: var(--color-amber);
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .step-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #ffffff;
        }
        .step-desc {
          font-size: 0.88rem;
          color: var(--color-text-muted);
          line-height: 1.6;
        }

        /* ---- PURPOSE SECTION ---- */
        .purpose-section {
          background: var(--color-bg);
        }
        .purpose-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        .purpose-text {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .purpose-heading {
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.25;
        }
        .purpose-underline {
          width: 48px;
          height: 3px;
          background: var(--color-amber);
          border-radius: 2px;
        }
        .purpose-body {
          font-size: 0.95rem;
          color: var(--color-text-body);
          line-height: 1.7;
        }
        .purpose-cards {
          display: grid;
        }
        .purpose-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          transition: var(--transition-smooth);
        }
        .purpose-card:hover {
          border-color: var(--color-amber);
          transform: translateY(-3px);
        }
        .purpose-card-tag {
          font-size: 0.68rem;
          color: var(--color-text-muted);
          letter-spacing: 0.1em;
          margin-bottom: 0.75rem;
        }
        .purpose-card-body {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        /* ---- INVESTMENT BANNER ---- */
        .invest-banner {
          background: radial-gradient(ellipse 60% 40% at 50% 50%, rgba(245, 166, 35, 0.08), transparent 70%), #0c0e16;
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
          padding: 4rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .invest-banner-box {
          max-width: 600px;
        }
        .invest-banner-title {
          font-size: clamp(2rem, 4vw, 2.8rem);
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }
        .invest-banner-sub {
          font-size: 0.95rem;
          color: var(--color-text-muted);
          line-height: 1.6;
        }

        /* ---- PRICING CARDS ---- */
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .pricing-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: var(--transition-smooth);
        }
        .pricing-card:hover {
          border-color: var(--color-border-highlight);
          transform: translateY(-4px);
        }
        .pricing-card-popular {
          border-color: var(--color-amber);
          box-shadow: 0 0 30px rgba(245, 166, 35, 0.15);
        }
        .pricing-card-header {
          padding: 1.75rem 2rem 1rem;
          border-bottom: 1px solid var(--color-border-light);
        }
        .pricing-card-service {
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          color: var(--color-amber);
          text-transform: uppercase;
        }
        .popular-badge {
          background: var(--color-amber);
          color: #090a0f;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          letter-spacing: 0.05em;
        }
        .pricing-card-name {
          font-size: 1.4rem;
          font-weight: 800;
          color: #ffffff;
          margin-top: 0.25rem;
        }
        .pricing-roi {
          font-size: 3.2rem;
          font-weight: 800;
          color: var(--color-amber);
          text-align: center;
          padding: 1.25rem 2rem 0;
          line-height: 1;
        }
        .pricing-roi-label {
          text-align: center;
          font-size: 0.72rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 0.4rem 2rem 0;
        }
        .pricing-divider {
          height: 1px;
          background: var(--color-border);
          margin: 1.25rem 2rem;
        }
        .pricing-features {
          list-style: none;
          padding: 0 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex: 1;
        }
        .pricing-feature-item {
          font-size: 0.85rem;
          color: var(--color-text-body);
        }
        .pricing-cta {
          margin: 1.75rem 2rem 0.5rem;
        }
        .pricing-note {
          text-align: center;
          font-size: 0.7rem;
          color: var(--color-text-dim);
          padding: 0 2rem 1.5rem;
        }

        /* ---- FUNDING (Deposit & Withdrawal) SECTION ---- */
        .funding-section {
          background: var(--color-bg);
          padding: 4.5rem 0;
        }
        .funding-banner-card {
          background: radial-gradient(ellipse 70% 50% at 0% 0%, rgba(245, 166, 35, 0.1), transparent 70%), #11141e;
          border: 1px solid var(--color-border-highlight);
          border-radius: var(--radius-xl);
          padding: 3.5rem;
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 3.5rem;
          align-items: center;
        }
        .funding-banner-heading {
          font-size: clamp(2rem, 3.5vw, 2.6rem);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 1rem;
        }
        .funding-banner-desc {
          color: var(--color-text-body);
          font-size: 0.95rem;
          line-height: 1.65;
        }
        .funding-perks-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        .funding-perk-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: var(--transition-fast);
        }
        .funding-perk-card:hover {
          border-color: var(--color-border-highlight);
          background: rgba(255, 255, 255, 0.04);
        }
        .perk-icon-wrap {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(245, 166, 35, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* ---- WHY CHOOSE US ---- */
        .why-section {
          background: var(--color-bg-alt);
        }
        .why-header {
          margin-bottom: 3rem;
        }
        .why-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.75rem;
        }
        .why-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 2rem 1.5rem;
          transition: var(--transition-smooth);
        }
        .why-card:hover {
          border-color: var(--color-border-highlight);
          transform: translateY(-3px);
        }
        .why-icon-wrap {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(245, 166, 35, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .why-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #ffffff;
        }
        .why-desc {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          line-height: 1.6;
        }

        /* ---- OVERVIEW CARD ---- */
        .overview-section {
          background: var(--color-bg);
        }
        .overview-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          padding: 3rem 3.5rem;
          max-width: 820px;
          margin: 0 auto;
        }
        .overview-heading {
          font-size: clamp(1.8rem, 3vw, 2.2rem);
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 1.25rem;
        }
        .overview-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .overview-body p {
          font-size: 0.95rem;
          color: var(--color-text-body);
          line-height: 1.7;
        }

        /* ---- CTA STRIP ---- */
        .cta-strip {
          background: #08090d;
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
          padding: 4.5rem 0;
        }
        .cta-strip-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }
        .cta-strip-heading {
          font-size: clamp(1.8rem, 3.5vw, 2.5rem);
          font-weight: 800;
          color: #ffffff;
        }
        .cta-strip-sub {
          font-size: 0.95rem;
          color: var(--color-text-muted);
        }

        /* ---- NEED HELP? SPLIT ---- */
        .help-split {
          display: flex;
          min-height: 400px;
          width: 100%;
          border-top: 1px solid var(--color-border);
        }
        .help-left {
          flex: 1;
          background: #0d0f17;
          display: flex;
          align-items: center;
        }
        .help-left-inner {
          padding: 4rem 3.5rem;
          max-width: 540px;
        }
        .help-heading {
          font-size: clamp(2rem, 4vw, 2.8rem);
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }
        .help-sub {
          font-size: 1.1rem;
          font-weight: 600;
          color: #cbd5e1;
          margin-bottom: 1rem;
        }
        .help-body {
          font-size: 0.92rem;
          color: var(--color-text-muted);
          line-height: 1.65;
        }
        .help-right {
          flex: 1;
          background: radial-gradient(circle at center, rgba(245, 166, 35, 0.05), transparent 70%), #090a0f;
          display: flex;
          align-items: center;
          justify-content: center;
          border-left: 1px solid var(--color-border);
        }

        /* ---- UTILITIES ---- */
        .login-warning-box {
          background-color: rgba(245, 166, 35, 0.08);
          border: 1px dashed rgba(245, 166, 35, 0.3);
          color: var(--color-amber);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          width: fit-content;
          margin-inline: auto;
        }
        .underline-btn {
          background: none;
          border: none;
          color: #ffffff;
          text-decoration: underline;
          cursor: pointer;
          font-weight: 700;
        }

        /* ---- RESPONSIVE ---- */
        @media (max-width: 992px) {
          .funding-banner-card {
            grid-template-columns: 1fr;
            padding: 2.5rem 2rem;
            gap: 2rem;
          }
          .purpose-inner {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .pricing-grid {
            grid-template-columns: 1fr;
            max-width: 480px;
            margin: 0 auto;
          }
          .why-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .hero-radar-wrapper {
            display: none;
          }
          .help-split {
            flex-direction: column;
          }
        }
        @media (max-width: 768px) {
          .steps-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .why-grid {
            grid-template-columns: 1fr;
          }
          .funding-banner-card {
            padding: 2rem 1.25rem;
          }
          .overview-card {
            padding: 2rem 1.5rem;
          }
          .help-left-inner {
            padding: 2.5rem 1.5rem;
          }
          .cta-strip-inner {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
