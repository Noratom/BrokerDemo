import React from 'react';
import { ShieldCheck, Award, Users, Check, Globe, HelpCircle } from 'lucide-react';

export default function About() {
  const points = [
    {
      title: 'Segregated Client Funds',
      desc: 'All user money is separated from our company balance sheet and stored securely in Tier-1 banking institutes like Barclays and JP Morgan.'
    },
    {
      title: 'Zero Conflict Execution',
      desc: 'We operate a pure STP/ECN model. We never take the opposite side of client orders; our profit model is purely based on spreads and commissions.'
    },
    {
      title: 'Negative Balance Coverage',
      desc: 'Under rapid market volatility spikes, our auto-stop risk mechanics trigger to safeguard account equity from slipping below zero.'
    },
    {
      title: 'Global Regulatory Licenses',
      desc: 'AuraTrade is fully authorized and audited regularly by top national licensing departments to ensure strict financial reporting.'
    }
  ];

  return (
    <div className="about-page">
      {/* Intro Header */}
      <section className="section about-header text-center">
        <div className="container">
          <div className="badge flex items-center gap-2" style={{ marginInline: 'auto' }}>
            <Award size={16} />
            <span>Built by Traders, for Traders</span>
          </div>
          <h1 style={{ marginTop: '1rem' }}>The AuraTrade Standard</h1>
          <p className="text-muted" style={{ maxWidth: '650px', marginInline: 'auto', marginTop: '0.75rem', fontSize: '1.1rem' }}>
            Founded in 2018, AuraTrade is a global brokerage company established to deliver institutional liquidity conditions to retail traders worldwide.
          </p>
        </div>
      </section>

      {/* Grid: Core Values */}
      <section className="section section-bg-white">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 items-center flex-col-mobile">
            <div>
              <h2>Safe. Transparent. Regulated.</h2>
              <p className="text-muted" style={{ marginTop: '1rem', lineHeight: '1.6' }}>
                We believe that the baseline of any successful trading career is a secure environment. AuraTrade provides the security framework of an institutional clearing house combined with the accessibility of a retail trading client portal.
              </p>
              
              <div className="flex flex-col gap-4" style={{ marginTop: '2rem' }}>
                <div className="flex items-start gap-4">
                  <div className="icon-wrapper">
                    <ShieldCheck size={20} className="text-gold" />
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--color-blue-deep)' }}>Segregated Banking</strong>
                    <span className="text-xs text-muted">All funds are stored under independent trustee custody.</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="icon-wrapper">
                    <Globe size={20} className="text-gold" />
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--color-blue-deep)' }}>Multi-Asset Coverage</strong>
                    <span className="text-xs text-muted">Trade dozens of major CFDs on Forex, Crypto, and Spot Commodities.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="card card-about">
                <h3>1.2B+</h3>
                <span className="text-xs text-muted uppercase font-label">Trades Executed</span>
              </div>
              <div className="card card-about">
                <h3>&lt; 15ms</h3>
                <span className="text-xs text-muted uppercase font-label">Execution Speed</span>
              </div>
              <div className="card card-about">
                <h3>12+</h3>
                <span className="text-xs text-muted uppercase font-label">Liquidity Feeds</span>
              </div>
              <div className="card card-about">
                <h3>99.9%</h3>
                <span className="text-xs text-muted uppercase font-label">System Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Policies Details */}
      <section className="section">
        <div className="container flex flex-col gap-8">
          <div className="text-center">
            <h2>Our Client Safety Framework</h2>
            <p className="text-muted" style={{ marginTop: '0.25rem' }}>How we secure and protect your digital trading deposits.</p>
          </div>

          <div className="grid grid-cols-2 gap-8 flex-col-mobile">
            {points.map((p, idx) => (
              <div key={idx} className="card security-card flex items-start gap-4">
                <Check size={20} className="check-icon" style={{ marginTop: '0.25rem' }} />
                <div>
                  <h4 style={{ fontSize: '1.1rem' }}>{p.title}</h4>
                  <p className="text-sm text-muted" style={{ marginTop: '0.5rem', lineHeight: '1.5' }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .about-page {
          width: 100%;
        }
        .about-header {
          background: linear-gradient(180deg, var(--color-white) 0%, rgba(239, 246, 255, 0.4) 100%);
          border-bottom: 1px solid var(--color-border-light);
        }
        .icon-wrapper {
          background-color: var(--color-gold-light);
          padding: 0.5rem;
          border-radius: var(--radius-sm);
        }
        .card-about {
          padding: 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
        }
        .card-about h3 {
          font-size: 2rem;
          color: var(--color-blue-royal);
        }
        .security-card {
          padding: 1.5rem;
          background-color: var(--color-white);
        }
        .security-card:hover {
          transform: none;
          box-shadow: var(--shadow-md);
        }
        .check-icon {
          color: var(--color-gold);
          background-color: var(--color-gold-light);
          padding: 0.15rem;
          border-radius: 50%;
        }
        .badge {
          background-color: var(--color-gold-light);
          color: var(--color-gold);
          border: 1px solid var(--color-gold-border);
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          width: fit-content;
        }
      `}</style>
    </div>
  );
}
