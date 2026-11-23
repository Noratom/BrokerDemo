import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          {/* 4-column grid */}
          <div className="footer-grid">
            {/* Column 1: Brand */}
            <div className="footer-brand flex flex-col gap-4">
              <div
                className="logo flex items-center"
                onClick={() => setActivePage('home')}
                style={{ cursor: 'pointer' }}
              >
                <div className="flex items-center gap-2">
                  <span className="continuum-dot"></span>
                  <span className="footer-logo-text">
                    CONTINUUM<span className="footer-logo-dim"> TRADING</span>
                  </span>
                </div>
              </div>
              <p className="footer-desc">
                Know the market. Know yourself. Trade the plan. A complete institutional trading infrastructure and high-yield liquidity ecosystem.
              </p>
              <div className="flex items-center gap-3 footer-micro-tag">
                <span className="tech-badge">3 SERIES</span>
                <span className="tech-badge">NO SIGNALS</span>
                <span className="tech-badge">PRO DESK</span>
              </div>
            </div>

            {/* Column 2: Platform */}
            <div className="footer-column">
              <h4 className="footer-col-title">Platform</h4>
              <ul className="footer-links-list">
                <li>
                  <button onClick={() => setActivePage('about')} className="footer-link-btn">About & Team</button>
                </li>
                <li>
                  <button onClick={() => setActivePage('about')} className="footer-link-btn">Institutional Edge</button>
                </li>
                <li>
                  <button onClick={() => { setActivePage('home'); setTimeout(() => document.getElementById('account-tiers')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="footer-link-btn">Investment Plans</button>
                </li>
                <li>
                  <button onClick={() => { setActivePage('home'); setTimeout(() => document.getElementById('funding')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="footer-link-btn">Deposit & Withdraw</button>
                </li>
              </ul>
            </div>

            {/* Column 3: Desk & Tools */}
            <div className="footer-column">
              <h4 className="footer-col-title">Trading Tools</h4>
              <ul className="footer-links-list">
                <li>
                  <button
                    onClick={() => {
                      setActivePage('home');
                      setTimeout(() => document.getElementById('trading-desk')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }}
                    className="footer-link-btn"
                  >
                    Simulated Desk
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActivePage('home');
                      setTimeout(() => document.getElementById('market-rates')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }}
                    className="footer-link-btn"
                  >
                    Market Rates
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePage('contact')} className="footer-link-btn">Support Desk</button>
                </li>
                <li>
                  <a href="#faq" className="footer-link-btn">Knowledge Base</a>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Liquidity */}
            <div className="footer-column">
              <h4 className="footer-col-title">Contact & Desk</h4>
              <ul className="footer-contact-list">
                <li className="flex items-start gap-3">
                  <MapPin size={15} style={{ color: 'var(--color-amber)', flexShrink: 0, marginTop: '3px' }} />
                  <span>3 Oswin Road, Institutional Financial Center, London & SF</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={15} style={{ color: 'var(--color-amber)', flexShrink: 0 }} />
                  <span className="font-mono">+1 (800) 555-CTRAD</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={15} style={{ color: 'var(--color-amber)', flexShrink: 0 }} />
                  <span className="font-mono">desk@continuum-trading.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom flex items-center justify-between">
          <p className="footer-copy font-mono">
            &copy; {new Date().getFullYear()} Continuum Trading. All rights reserved.
          </p>
          <div className="flex gap-4 font-mono">
            <a href="#terms" className="footer-bottom-link">TERMS</a>
            <a href="#privacy" className="footer-bottom-link">PRIVACY</a>
            <a href="#risk" className="footer-bottom-link">RISK DISCLOSURE</a>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background-color: #06070a;
          border-top: 1px solid var(--color-border);
          padding: 4.5rem 0 0 0;
          margin-top: auto;
        }
        .footer-top {
          padding-bottom: 3.5rem;
          border-bottom: 1px solid var(--color-border);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1.2fr 1.2fr 1.6fr;
          gap: 3rem;
        }
        .continuum-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-amber);
          box-shadow: 0 0 8px rgba(245, 166, 35, 0.8);
        }
        .footer-logo-text {
          font-family: var(--font-mono);
          font-weight: 800;
          font-size: 1.05rem;
          letter-spacing: 0.12em;
          color: #ffffff;
        }
        .footer-logo-dim {
          color: var(--color-text-muted);
          font-weight: 500;
        }
        .footer-desc {
          font-size: 0.85rem;
          line-height: 1.65;
          color: var(--color-text-muted);
          max-width: 320px;
        }
        .footer-micro-tag {
          margin-top: 0.5rem;
        }
        .tech-badge {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          color: #94a3b8;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--color-border);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }
        .footer-column {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .footer-col-title {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: 700;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin: 0;
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
          font-size: 0.85rem;
          color: var(--color-text-body);
          cursor: pointer;
          text-align: left;
          transition: var(--transition-fast);
        }
        .footer-link-btn:hover {
          color: #ffffff;
        }
        .footer-contact-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          font-size: 0.82rem;
          color: var(--color-text-body);
        }
        .footer-bottom {
          padding: 1.5rem 0;
        }
        .footer-copy {
          font-size: 0.75rem;
          color: var(--color-text-dim);
          letter-spacing: 0.05em;
        }
        .footer-bottom-link {
          font-size: 0.72rem;
          color: var(--color-text-dim);
          letter-spacing: 0.08em;
          transition: var(--transition-fast);
        }
        .footer-bottom-link:hover {
          color: var(--color-amber);
        }
        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem;
          }
          .footer-brand {
            grid-column: span 2;
          }
          .footer-desc {
            max-width: 100%;
          }
        }
        @media (max-width: 600px) {
          .footer {
            padding: 3rem 0 0;
          }
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .footer-brand {
            grid-column: span 1;
          }
          .footer-top {
            padding-bottom: 2rem;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 0.75rem;
            text-align: center;
            padding: 1.25rem 0;
          }
          .footer-bottom div {
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.75rem;
          }
        }
      `}</style>
    </footer>
  );
}
