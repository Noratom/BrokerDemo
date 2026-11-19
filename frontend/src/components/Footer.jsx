import React from 'react';
import { TrendingUp, Mail, Phone, MapPin } from 'lucide-react';

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
                <TrendingUp size={24} style={{ color: '#1a3edb', marginRight: '0.5rem' }} />
                <span className="footer-logo-text">
                  AURA<span style={{ color: '#1a3edb' }}>TRADE</span>
                </span>
              </div>
              <p className="footer-desc">
                Your gateway to global financial markets. Invest in a smarter future with our transparent, secure, and high-yield investment plans designed for every member.
              </p>
            </div>

            {/* Column 2: Company */}
            <div className="footer-column">
              <h4 className="footer-col-title">Company</h4>
              <ul className="footer-links-list">
                <li>
                  <button onClick={() => setActivePage('about')} className="footer-link-btn">About Us</button>
                </li>
                <li>
                  <button onClick={() => setActivePage('about')} className="footer-link-btn">Why AuraTrade</button>
                </li>
                <li>
                  <button onClick={() => setActivePage('home')} className="footer-link-btn">Investment Plans</button>
                </li>
                <li>
                  <button onClick={() => setActivePage('home')} className="footer-link-btn">Membership</button>
                </li>
              </ul>
            </div>

            {/* Column 3: Support */}
            <div className="footer-column">
              <h4 className="footer-col-title">Support</h4>
              <ul className="footer-links-list">
                <li>
                  <button onClick={() => setActivePage('contact')} className="footer-link-btn">Contact Us</button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActivePage('home');
                      setTimeout(() => document.getElementById('trading-desk')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }}
                    className="footer-link-btn"
                  >
                    Trading Desk
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
                  <a href="#faq" className="footer-link-btn">FAQ</a>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact US */}
            <div className="footer-column">
              <h4 className="footer-col-title">Contact US</h4>
              <ul className="footer-contact-list">
                <li className="flex items-start gap-3">
                  <MapPin size={16} style={{ color: '#1a3edb', flexShrink: 0, marginTop: '2px' }} />
                  <span>100 Pine Street, Financial District, San Francisco, CA 94111</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={16} style={{ color: '#1a3edb', flexShrink: 0 }} />
                  <span>+1 (800) 555-AURA</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={16} style={{ color: '#1a3edb', flexShrink: 0 }} />
                  <span>support@auratrade.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom flex items-center justify-between">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} AuraTrade. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#terms" className="footer-bottom-link">Terms of Service</a>
            <a href="#privacy" className="footer-bottom-link">Privacy Policy</a>
            <a href="#cookie" className="footer-bottom-link">Cookie Settings</a>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background-color: #0d1b2a;
          padding: 4rem 0 0 0;
          margin-top: auto;
        }
        .footer-top {
          padding-bottom: 3rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 3rem;
        }
        .footer-logo-text {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.4rem;
          letter-spacing: 0.05em;
          color: #ffffff;
        }
        .footer-desc {
          font-size: 0.875rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.55);
          max-width: 300px;
        }
        .footer-column {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .footer-col-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 0.08em;
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
          font-size: 0.875rem;
          color: rgba(255,255,255,0.55);
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
          gap: 0.9rem;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.55);
        }
        .footer-bottom {
          padding: 1.5rem 0;
        }
        .footer-copy {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.4);
        }
        .footer-bottom-link {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.4);
          transition: var(--transition-fast);
        }
        .footer-bottom-link:hover {
          color: rgba(255,255,255,0.8);
          text-decoration: underline;
        }
        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem 2.5rem;
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
        @media (max-width: 400px) {
          .footer-col-title {
            font-size: 0.85rem;
          }
          .footer-link-btn,
          .footer-contact-list {
            font-size: 0.82rem;
          }
        }
      `}</style>
    </footer>
  );
}
