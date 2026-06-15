import React from 'react';
import { TrendingUp, Shield, Mail, Phone, MapPin, Globe } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top grid grid-cols-3 gap-8">
          {/* Company Brief */}
          <div className="footer-brand flex flex-col gap-4">
            <div className="logo flex items-center" onClick={() => setActivePage('home')} style={{ cursor: 'pointer' }}>
              <div className="logo-icon-wrapper">
                <TrendingUp size={24} className="logo-icon-blue" />
                <Shield size={12} className="logo-icon-gold" />
              </div>
              <span className="logo-text">
                AURA<span className="logo-text-accent">TRADE</span>
              </span>
            </div>
            <p className="text-muted footer-desc">
              Your gateway to global financial markets. Access CFD trading on Forex, Cryptocurrencies, and Commodities with tight spreads, ultra-fast execution, and advanced chart diagnostics.
            </p>
            <div className="footer-contact-info flex flex-col gap-4" style={{ marginTop: '0.5rem' }}>
              <div className="flex items-center gap-4">
                <MapPin size={16} className="text-gold" />
                <span className="text-sm text-muted">100 Pine Street, Financial District, San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone size={16} className="text-gold" />
                <span className="text-sm text-muted">+1 (800) 555-AURA</span>
              </div>
              <div className="flex items-center gap-4">
                <Mail size={16} className="text-gold" />
                <span className="text-sm text-muted">support@auratrade.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-group flex justify-between gap-8">
            <div className="footer-column">
              <h4 className="footer-title">Trading</h4>
              <ul className="footer-links-list">
                <li><button onClick={() => { setActivePage('home'); setTimeout(() => document.getElementById('trading-desk')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="footer-link-btn">Demo Trading</button></li>
                <li><button onClick={() => { setActivePage('home'); setTimeout(() => document.getElementById('market-rates')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="footer-link-btn">Market Spreads</button></li>
                <li><a href="#accounts" className="footer-link-btn">Account Types</a></li>
                <li><a href="#fees" className="footer-link-btn">Trading Fees</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-title">Company</h4>
              <ul className="footer-links-list">
                <li><button onClick={() => setActivePage('about')} className="footer-link-btn">Why Us</button></li>
                <li><button onClick={() => setActivePage('about')} className="footer-link-btn">Client Protection</button></li>
                <li><button onClick={() => setActivePage('contact')} className="footer-link-btn">Contact Us</button></li>
                <li><a href="#news" className="footer-link-btn">Market Insights</a></li>
              </ul>
            </div>
          </div>

          {/* Regulatory & Security badge */}
          <div className="footer-regulatory card card-gold-accent flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Shield size={28} className="text-gold" />
              <div>
                <h4 className="footer-title" style={{ margin: 0 }}>Regulated Broker</h4>
                <p className="text-xs text-muted">AuraTrade Corp.</p>
              </div>
            </div>
            <p className="text-xs text-muted" style={{ lineHeight: '1.4' }}>
              Authorized and regulated by top-tier financial authorities. Client funds are fully segregated in tier-1 banking institutions and protected by negative balance insurance.
            </p>
            <div className="flex items-center gap-4" style={{ marginTop: '0.5rem', borderTop: '1px solid var(--color-border-light)', paddingTop: '0.75rem' }}>
              <Globe size={16} className="text-muted" />
              <span className="text-xs text-muted">English (US) | Global Trading</span>
            </div>
          </div>
        </div>

        {/* Risk Warning Disclaimer */}
        <div className="footer-warning">
          <p>
            <strong>Risk Warning:</strong> Trading Contracts for Difference (CFDs) on margin carries a high level of risk and may not be suitable for all investors. Before deciding to trade CFDs, you should carefully consider your trading objectives, level of experience, and risk appetite. It is possible to lose more than your initial investment, therefore you should not deposit money that you cannot afford to lose. Please ensure you fully understand the risks involved and take appropriate care to manage your exposure.
          </p>
        </div>

        {/* Footer Bottom copyright */}
        <div className="footer-bottom flex items-center justify-between">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} AuraTrade. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#terms" className="text-xs text-muted hover-underline">Terms of Service</a>
            <a href="#privacy" className="text-xs text-muted hover-underline">Privacy Policy</a>
            <a href="#cookie" className="text-xs text-muted hover-underline">Cookie Settings</a>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background-color: var(--color-white);
          border-top: 1px solid var(--color-border);
          padding: 4rem 0 2rem 0;
          margin-top: auto;
        }
        .footer-top {
          padding-bottom: 3rem;
          border-bottom: 1px solid var(--color-border-light);
        }
        .footer-desc {
          font-size: 0.875rem;
          line-height: 1.6;
        }
        .text-gold {
          color: var(--color-gold);
        }
        .footer-links-group {
          grid-column: span 1;
        }
        .footer-column {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .footer-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-blue-deep);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .footer-links-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .footer-link-btn {
          background: none;
          border: none;
          padding: 0;
          font-size: 0.875rem;
          color: var(--color-text-muted);
          cursor: pointer;
          text-align: left;
          transition: var(--transition-fast);
        }
        .footer-link-btn:hover {
          color: var(--color-blue-primary);
        }
        .footer-regulatory {
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }
        .footer-warning {
          padding: 1.5rem 0;
          border-bottom: 1px solid var(--color-border-light);
          margin-bottom: 1.5rem;
        }
        .footer-warning p {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          line-height: 1.6;
          text-align: justify;
        }
        .footer-bottom {
          font-size: 0.8rem;
        }
        .hover-underline:hover {
          text-decoration: underline;
        }
        .logo-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          margin-right: 0.5rem;
        }
        .logo-icon-blue {
          color: var(--color-blue-royal);
        }
        .logo-icon-gold {
          color: var(--color-gold);
          position: absolute;
          bottom: -2px;
          right: -2px;
          background: var(--color-white);
          border-radius: 50%;
        }
        .logo-text {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.4rem;
          letter-spacing: 0.05em;
          color: var(--color-blue-deep);
        }
        .logo-text-accent {
          color: var(--color-gold);
        }
        @media (max-width: 768px) {
          .footer-top {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .footer-links-group {
            flex-direction: row;
            justify-content: space-between;
          }
        }
      `}</style>
    </footer>
  );
}
