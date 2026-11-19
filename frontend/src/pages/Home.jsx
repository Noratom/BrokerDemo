import React, { useEffect } from 'react';
import {
  Shield, Award, Zap, ChevronRight, Check, Sparkles,
  Lock, BarChart2, TrendingUp, Globe, CheckSquare, Phone
} from 'lucide-react';
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

  // Investment / pricing tiers (Bronze / Silver / Premium)
  const pricingTiers = [
    {
      name: 'Bronze',
      roi: '20%',
      duration: '24 Hours',
      min: '$500',
      max: '$10,000',
      features: [
        'Duration: 24 Hours',
        'Minimum: $500',
        'Maximum: $10,000',
        'Asset Protection',
        'Live Support',
      ],
    },
    {
      name: 'Silver',
      roi: '40%',
      duration: '48 Hours',
      min: '$10,000',
      max: '$50,000',
      features: [
        'Duration: 48 Hours',
        'Minimum: $10,000',
        'Maximum: $50,000',
        'Asset Protection',
        'Live Support',
      ],
    },
    {
      name: 'Premium',
      roi: '60%',
      duration: '72 Hours',
      min: '$50,000',
      max: 'Unlimited',
      features: [
        'Duration: 72 Hours',
        'Minimum: $50,000',
        'Maximum: Unlimited',
        'Asset Protection',
        'Live Support',
      ],
    },
  ];

  // Why Choose Us items
  const whyItems = [
    {
      icon: <Lock size={28} style={{ color: '#1a3edb' }} />,
      title: 'Security & Privacy',
      desc: 'Your assets and personal data are protected with enterprise-grade encryption and multi-layer security protocols.',
    },
    {
      icon: <BarChart2 size={28} style={{ color: '#1a3edb' }} />,
      title: 'Investing Tools',
      desc: 'Access powerful analytics and real-time market data to make smarter investment decisions every day.',
    },
    {
      icon: <Shield size={28} style={{ color: '#1a3edb' }} />,
      title: 'Asset Protection',
      desc: 'All client funds are fully segregated and insured, ensuring your investment is never at systemic risk.',
    },
    {
      icon: <Globe size={28} style={{ color: '#1a3edb' }} />,
      title: 'Investment Access',
      desc: 'Gain access to global markets and diversified portfolios previously available only to institutional investors.',
    },
  ];

  return (
    <div className="home-page">

      {/* ═══════════════════════════════
          1. HERO SECTION
      ═══════════════════════════════ */}
      <header className="hero">
        <div className="container hero-container">
          <div className="hero-content flex flex-col gap-4 animate-slide-left visible">
            <h1 className="hero-headline">
              Empower Your<br />Financial Horizon
            </h1>
            <p className="hero-desc">
              Join thousands of members earning consistent passive income through our transparent,
              high-yield investment plans. Start your journey today.
            </p>
            <div className="flex gap-4 flex-col-mobile hero-cta-row">
              {currentUser ? (
                <button
                  className="btn btn-gold btn-lg flex items-center justify-center gap-2"
                  onClick={() => {
                    document.getElementById('investment')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>View Investment Plans</span>
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  className="btn btn-gold btn-lg flex items-center justify-center gap-2"
                  onClick={onOpenAuth}
                >
                  <span>Become a Member</span>
                  <ChevronRight size={18} />
                </button>
              )}
              <button
                className="btn btn-outline-white btn-lg flex items-center justify-center"
                onClick={() => {
                  document.getElementById('investment')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Get Started
              </button>
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
                label: 'Membership Registration',
                desc: 'Create your free account in minutes and join our growing community of smart investors.',
              },
              {
                label: 'Choose Plan',
                desc: 'Select the investment plan that best suits your financial goals and risk appetite.',
              },
              {
                label: 'Passive Income',
                desc: 'Sit back and watch your earnings grow. Withdrawals are fast, secure, and hassle-free.',
              },
            ].map((step, i) => (
              <div key={i} className="step-item flex flex-col gap-3">
                <div className="step-icon-wrap">
                  <CheckSquare size={28} style={{ color: '#1a3edb' }} />
                </div>
                <h3 className="step-title">{step.label}</h3>
                <p className="step-desc">{step.desc}</p>
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
            <span className="section-label">OUR PURPOSE</span>
            <h2 className="purpose-heading">
              Our common Purpose is Creating opportunities to rise.
            </h2>
            <div className="purpose-underline"></div>
            <p className="purpose-body">
              At AuraTrade, we believe every individual deserves access to world-class financial
              tools and opportunities. Our mission is to democratize investing and empower our
              members to achieve financial independence through smart, transparent, and secure
              investment vehicles.
            </p>
          </div>

          {/* Right card grid */}
          <div className="purpose-cards grid grid-cols-2 gap-4 animate-slide-right">
            <div className="purpose-card">
              <div
                className="purpose-card-img"
                style={{ background: 'linear-gradient(135deg, #1a3edb 0%, #0d1b2a 100%)' }}
              ></div>
              <div className="purpose-card-body">
                <TrendingUp size={20} style={{ color: '#1a3edb' }} />
                <span>Explore With Us</span>
              </div>
            </div>
            <div className="purpose-card">
              <div
                className="purpose-card-img"
                style={{ background: 'linear-gradient(135deg, #2340e0 0%, #1a3edb 60%, #0d1b2a 100%)' }}
              ></div>
              <div className="purpose-card-body">
                <BarChart2 size={20} style={{ color: '#1a3edb' }} />
                <span>Investment Management</span>
              </div>
            </div>
            <div className="purpose-card">
              <div
                className="purpose-card-img"
                style={{ background: 'linear-gradient(135deg, #0d1b2a 0%, #1a3edb 100%)' }}
              ></div>
              <div className="purpose-card-body">
                <Shield size={20} style={{ color: '#1a3edb' }} />
                <span>Asset Protection</span>
              </div>
            </div>
            <div className="purpose-card">
              <div
                className="purpose-card-img"
                style={{ background: 'linear-gradient(135deg, #1a3edb 0%, #4f70f5 100%)' }}
              ></div>
              <div className="purpose-card-body">
                <Globe size={20} style={{ color: '#1a3edb' }} />
                <span>Global Markets</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          TRADING DESK (existing feature)
      ═══════════════════════════════ */}
      <section id="trading-desk" className="section section-bg-blue animate-on-scroll">
        <div className="container flex flex-col gap-8">
          <div className="text-center" style={{ marginBottom: '1.5rem' }}>
            <span className="section-label">LIVE TRADING</span>
            <h2>Simulated Trading Desk</h2>
            <p className="text-muted" style={{ marginTop: '0.5rem' }}>
              Practice positioning orders using virtual funds. Test live pricing spreads before going live.
            </p>
            {!currentUser && (
              <div className="login-warning-box flex items-center gap-3 justify-center" style={{ marginTop: '1rem' }}>
                <Sparkles size={16} style={{ color: '#1a3edb' }} />
                <span className="text-xs">
                  Currently trading as guest.{' '}
                  <button onClick={onOpenAuth} className="underline-btn">Sign up now</button>{' '}
                  to persist balances and view your personal audit records.
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
            <span className="section-label">MARKETS</span>
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

      {/* ═══════════════════════════════
          4. INVESTMENT PLANS BANNER
      ═══════════════════════════════ */}
      <section id="investment" className="invest-banner animate-on-scroll">
        <div className="invest-banner-overlay">
          <div className="invest-banner-box">
            <h2 className="invest-banner-title">Investment Plans</h2>
            <p className="invest-banner-sub">
              Choose the plan that matches your capital and financial goals.<br />
              All plans include asset protection and live member support.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          5. PRICING CARDS (Bronze / Silver / Premium)
      ═══════════════════════════════ */}
      <section id="account-tiers" className="section animate-on-scroll" style={{ background: '#f4f6fb' }}>
        <div className="container flex flex-col gap-8">
          <div className="text-center" style={{ marginBottom: '1rem' }}>
            <span className="section-label">INVESTMENT PLANS</span>
            <h2>Tailored Investment Accounts</h2>
            <p className="text-muted" style={{ marginTop: '0.5rem' }}>
              Select a plan that fits your investment capital and return objectives.
            </p>
          </div>

          <div className="pricing-grid">
            {pricingTiers.map((tier, index) => (
              <div key={index} className="pricing-card">
                {/* Card Header */}
                <div className="pricing-card-header">
                  <span className="pricing-card-service">Investment Service</span>
                  <h3 className="pricing-card-name">{tier.name}</h3>
                </div>

                {/* ROI Number */}
                <div className="pricing-roi">{tier.roi}</div>
                <p className="pricing-roi-label">Return on Investment</p>

                {/* Divider */}
                <div className="pricing-divider"></div>

                {/* Features */}
                <ul className="pricing-features">
                  {tier.features.map((feat, fi) => (
                    <li key={fi} className="pricing-feature-item flex items-center gap-2">
                      <Check size={15} style={{ color: '#1a3edb', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className="btn btn-gold w-full pricing-cta"
                  onClick={currentUser ? () => alert(`Opening ${tier.name} plan. Our team will contact you.`) : onOpenAuth}
                >
                  Get Started
                </button>
                <p className="pricing-note">*Contact Us for Consultations</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          6. WHY CHOOSE US
      ═══════════════════════════════ */}
      <section className="section why-section animate-on-scroll">
        <div className="container">
          <div className="text-center why-header">
            <span className="section-label">WHY CHOOSE US</span>
            <h2>Smart Investing with Smart Ideas</h2>
            <p className="text-muted" style={{ marginTop: '0.75rem', maxWidth: '560px', margin: '0.75rem auto 0' }}>
              We combine cutting-edge technology with deep market expertise to deliver
              consistent, secure returns for our members worldwide.
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
          7. START A GOOD PLAN (Overview)
      ═══════════════════════════════ */}
      <section className="section overview-section animate-on-scroll">
        <div className="container">
          <div className="overview-card">
            <span className="section-label">OVERVIEW</span>
            <h2 className="overview-heading">Start a Good Plan</h2>
            <div className="overview-body">
              <p>
                Getting started with AuraTrade is simple and transparent. Once you complete your
                membership registration and select your preferred investment plan, your funds are
                allocated to our managed portfolio — secured by our multi-layer asset protection system.
              </p>
              <p>
                Every member receives a dedicated support representative, real-time portfolio updates,
                and guaranteed returns credited directly to their account upon plan maturity. We
                believe that growing your wealth should be straightforward, secure, and stress-free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          Compare Calculator (existing)
      ═══════════════════════════════ */}
      <section className="section section-bg-blue animate-on-scroll">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            <span className="section-label">ANALYTICS</span>
            <h2>Cost Efficiency Spotlight</h2>
            <p className="text-muted" style={{ marginTop: '0.5rem' }}>
              Compare borrowing costs across plans. Adjust the slider to audit your potential returns.
            </p>
          </div>
          <CompareCalculator />
        </div>
      </section>

      {/* ═══════════════════════════════
          8. CTA STRIP — "Let Us Work For You"
      ═══════════════════════════════ */}
      <section className="cta-strip animate-on-scroll">
        <div className="container cta-strip-inner">
          <div className="cta-strip-text">
            <h2 className="cta-strip-heading">Let Us Work For You.</h2>
            <p className="cta-strip-sub">
              Join thousands of members already building wealth with AuraTrade's investment platform.
            </p>
          </div>
          <button
            className="btn btn-gold btn-lg cta-strip-btn"
            onClick={currentUser ? () => document.getElementById('investment')?.scrollIntoView({ behavior: 'smooth' }) : onOpenAuth}
          >
            Become a Member
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════
          9. NEED HELP? SPLIT SECTION
      ═══════════════════════════════ */}
      <section className="help-split animate-on-scroll">
        {/* Left half — blue bg */}
        <div className="help-left">
          <div className="help-left-inner">
            <h2 className="help-heading">Need Help?</h2>
            <p className="help-sub">Don't hesitate to contact us.</p>
            <p className="help-body">
              Our support team is available around the clock to assist you with any questions
              about your investments, account setup, or plan upgrades.
            </p>
            <button
              className="btn btn-outline-white"
              style={{ marginTop: '2rem' }}
              onClick={() => alert('Contact form coming soon. Email us at support@auratrade.com')}
            >
              <Phone size={16} />
              Contact Us
            </button>
          </div>
        </div>
        {/* Right half — gradient photo placeholder */}
        <div
          className="help-right"
          style={{ background: 'linear-gradient(135deg, #1a3edb 0%, #0d1b2a 100%)' }}
        >
          <div className="help-right-overlay">
            <Globe size={80} style={{ color: 'rgba(255,255,255,0.15)' }} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          HOME PAGE STYLES
      ═══════════════════════════════ */}
      <style>{`
        .home-page {
          width: 100%;
        }

        /* ---- Section Label ---- */
        .section-label {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #1a3edb;
          margin-bottom: 0.75rem;
        }

        /* ---- HERO ---- */
        .hero {
          position: relative;
          background-image: linear-gradient(rgba(13,27,42,0.78), rgba(13,27,42,0.78)), url('/trading_hero.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          min-height: 88vh;
          display: flex;
          align-items: center;
          color: #ffffff;
          padding: 5rem 0;
        }
        .hero-container {
          position: relative;
          z-index: 2;
        }
        .hero-content {
          max-width: 640px;
        }
        .hero-headline {
          font-size: clamp(2.4rem, 5.5vw, 3.8rem);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
          letter-spacing: -0.03em;
        }
        .hero-desc {
          font-size: 1.1rem;
          line-height: 1.65;
          color: rgba(255,255,255,0.8);
          max-width: 540px;
        }
        .hero-cta-row {
          margin-top: 1rem;
        }

        /* ---- 3-STEP STRIP ---- */
        .steps-strip {
          background: #ffffff;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
          padding: 4rem 0;
        }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 3rem;
        }
        .step-item {
          padding: 1.5rem 1rem;
        }
        .step-icon-wrap {
          width: 52px;
          height: 52px;
          border: 2px solid #1a3edb;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }
        .step-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #111827;
        }
        .step-desc {
          font-size: 0.9rem;
          color: #6b7280;
          line-height: 1.6;
        }

        /* ---- OUR PURPOSE ---- */
        .purpose-section {
          background: #ffffff;
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
          font-size: clamp(1.6rem, 2.8vw, 2.2rem);
          font-weight: 800;
          color: #111827;
          line-height: 1.25;
        }
        .purpose-underline {
          width: 56px;
          height: 4px;
          background: #1a3edb;
          border-radius: 2px;
        }
        .purpose-body {
          font-size: 0.95rem;
          color: #4b5563;
          line-height: 1.7;
        }
        .purpose-cards {
        }
        .purpose-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(13,27,42,0.06);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .purpose-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 28px rgba(26,62,219,0.12);
        }
        .purpose-card-img {
          height: 100px;
          width: 100%;
        }
        .purpose-card-body {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.9rem 1rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: #111827;
        }

        /* ---- INVESTMENT BANNER ---- */
        .invest-banner {
          position: relative;
          background-image: linear-gradient(rgba(13,27,42,0.72), rgba(13,27,42,0.72)), url('/trading_hero.png');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          min-height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .invest-banner-overlay {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 3rem 1.5rem;
        }
        .invest-banner-box {
          background: rgba(26, 62, 219, 0.82);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 18px;
          padding: 2.5rem 3.5rem;
          text-align: center;
          max-width: 580px;
        }
        .invest-banner-title {
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 0.75rem;
        }
        .invest-banner-sub {
          color: rgba(255,255,255,0.85);
          font-size: 1rem;
          line-height: 1.6;
        }

        /* ---- PRICING CARDS ---- */
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .pricing-card {
          background: #ffffff;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(13,27,42,0.08);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .pricing-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(26,62,219,0.15);
        }
        .pricing-card-header {
          background: #0d1b2a;
          padding: 1.5rem 2rem 1.25rem;
        }
        .pricing-card-service {
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.5);
          display: block;
          margin-bottom: 0.4rem;
        }
        .pricing-card-name {
          font-size: 1.5rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
        }
        .pricing-roi {
          font-size: 3.5rem;
          font-weight: 900;
          color: #1a3edb;
          text-align: center;
          padding: 1.25rem 2rem 0;
          font-family: var(--font-heading);
          line-height: 1;
        }
        .pricing-roi-label {
          text-align: center;
          font-size: 0.78rem;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 0.4rem 2rem 0;
        }
        .pricing-divider {
          height: 1px;
          background: #e5e7eb;
          margin: 1.5rem 2rem;
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
          font-size: 0.875rem;
          color: #4b5563;
        }
        .pricing-cta {
          margin: 1.75rem 2rem 0.75rem;
          border-radius: 10px;
        }
        .pricing-note {
          text-align: center;
          font-size: 0.75rem;
          color: #9ca3af;
          padding: 0 2rem 1.5rem;
        }

        /* ---- WHY CHOOSE US ---- */
        .why-section {
          background: #eef2ff;
        }
        .why-header {
          margin-bottom: 3rem;
        }
        .why-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }
        .why-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 2rem 1.5rem;
          box-shadow: 0 2px 12px rgba(13,27,42,0.06);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .why-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 28px rgba(26,62,219,0.1);
        }
        .why-icon-wrap {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: #eef2ff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .why-title {
          font-size: 1rem;
          font-weight: 700;
          color: #1a3edb;
          margin: 0;
        }
        .why-desc {
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.6;
        }

        /* ---- OVERVIEW CARD ---- */
        .overview-section {
          background: #ffffff;
        }
        .overview-card {
          background: #f4f6fb;
          border-radius: 20px;
          padding: 3rem 3.5rem;
          max-width: 820px;
          margin: 0 auto;
        }
        .overview-heading {
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 800;
          color: #111827;
          margin-bottom: 1.5rem;
        }
        .overview-body {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }
        .overview-body p {
          font-size: 0.95rem;
          color: #4b5563;
          line-height: 1.7;
        }

        /* ---- CTA STRIP ---- */
        .cta-strip {
          background: #0d1b2a;
          padding: 4rem 0;
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
          margin-bottom: 0.5rem;
        }
        .cta-strip-sub {
          font-size: 1rem;
          color: rgba(255,255,255,0.65);
        }
        .cta-strip-btn {
          flex-shrink: 0;
          padding: 1rem 2.5rem;
          font-size: 1rem;
          border-radius: 12px;
        }

        /* ---- NEED HELP? SPLIT ---- */
        .help-split {
          display: flex;
          min-height: 420px;
          width: 100%;
        }
        .help-left {
          flex: 1;
          background: #1a3edb;
          display: flex;
          align-items: center;
        }
        .help-left-inner {
          padding: 4rem 3.5rem;
          max-width: 540px;
        }
        .help-heading {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }
        .help-sub {
          font-size: 1.15rem;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
          margin-bottom: 1rem;
        }
        .help-body {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.75);
          line-height: 1.65;
        }
        .help-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .help-right-overlay {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ---- MISC utilities ---- */
        .login-warning-box {
          background-color: #eef2ff;
          border: 1px dashed #1a3edb;
          color: #1a3edb;
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

        /* ---- RESPONSIVE ---- */
        @media (max-width: 1100px) {
          .why-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 992px) {
          .hero {
            background-attachment: scroll;
            min-height: auto;
            padding: 4rem 0;
          }
          .invest-banner {
            background-attachment: scroll;
          }
          .steps-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .purpose-inner {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .pricing-grid {
            grid-template-columns: 1fr;
            max-width: 420px;
            margin: 0 auto;
          }
          .cta-strip-inner {
            flex-direction: column;
            text-align: center;
          }
          .help-split {
            flex-direction: column;
          }
          .help-right {
            min-height: 220px;
          }
        }
        @media (max-width: 768px) {
          .why-grid {
            grid-template-columns: 1fr;
          }
          .overview-card {
            padding: 2rem 1.5rem;
          }
          .hero-headline {
            font-size: 2rem;
          }
          .invest-banner-box {
            padding: 2rem 1.5rem;
          }
          .help-left-inner {
            padding: 2.5rem 1.5rem;
          }
          .purpose-cards {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 500px) {
          .pricing-grid {
            max-width: 100%;
          }
          .purpose-cards {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
