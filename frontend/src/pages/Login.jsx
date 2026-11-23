import React, { useState } from 'react';
import { Lock, Mail, TrendingUp, Shield, ArrowRight, Eye, EyeOff, CheckCircle, Zap, Cpu, KeyRound } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function Login({ onAuthSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      if (response.ok) {
        onAuthSuccess(result.data);
      } else {
        setError(result.message || 'Invalid institutional credentials.');
      }
    } catch (err) {
      const norm = email.toLowerCase();
      if ((norm === 'admin@continuum-trading.com' || norm === 'admin@auratrade.com') && password === 'admin123') {
        onAuthSuccess({ id: 'user_admin', name: 'Chief Compliance Officer', email, balance: 0, role: 'admin' });
      } else if ((norm === 'client@continuum-trading.com' || norm === 'client@auratrade.com') && password === 'client123') {
        onAuthSuccess({ 
          id: 'user_1', 
          name: 'Alexander Wright', 
          email, 
          balance: 15000, 
          role: 'client',
          accountNumber: 'CT-892104-LIVE',
          accountType: 'Institutional Raw ECN',
          leverage: '1:100',
          currency: 'USD',
          server: 'CT-LD4 London',
          kycStatus: 'verified'
        });
      } else {
        setError('Invalid credentials. Use 1-Click Access below or verify your login.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillClient = () => {
    setEmail('client@continuum-trading.com');
    setPassword('client123');
    setError(null);
  };

  const fillAdmin = () => {
    setEmail('admin@continuum-trading.com');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="auth-page">
      {/* Ambient Void Glow */}
      <div className="auth-ambient-glow"></div>

      <div className="auth-shell">
        {/* Left Branding / Telemetry Desk */}
        <div className="auth-brand-pane">
          <div className="auth-brand-header">
            <div className="auth-logo flex items-center gap-2">
              <span className="continuum-dot"></span>
              <span className="auth-brand-logo-text">CONTINUUM<span className="logo-dim"> TRADING</span></span>
            </div>
            <div className="auth-system-badge font-mono">
              <span className="pulse-dot"></span>
              <span>INSTITUTIONAL ACCESS // 256-BIT SSL</span>
            </div>
          </div>

          <div className="auth-brand-body">
            <h1 className="auth-brand-headline">
              Direct Market Access.<br />
              <span className="text-amber">Zero Latency Execution.</span>
            </h1>
            <p className="auth-brand-paragraph">
              Enter your authorized credentials to manage institutional positions, monitor real-time order flow, and accrue automated cycle returns.
            </p>

            <div className="auth-security-perks">
              {[
                { title: 'LD4 Equinix Sub-Millisecond Cross-Connect', sub: 'Direct fiber matching engine in London & NY4' },
                { title: 'Tier-1 Segregated Liquidity Custody', sub: 'All client funds held under statutory trust escrow' },
                { title: 'Automated Yield Accrual Engine', sub: 'Smart contract verified 24h, 48h, and 72h cycles' },
                { title: 'Hardware-Grade 256-Bit AES Encryption', sub: 'End-to-end cryptographic execution safeguarding' },
              ].map((item, i) => (
                <div key={i} className="auth-perk-item">
                  <div className="auth-perk-icon">
                    <CheckCircle size={15} />
                  </div>
                  <div className="auth-perk-text">
                    <div className="auth-perk-title">{item.title}</div>
                    <div className="auth-perk-sub font-mono">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="auth-brand-footer font-mono">
            <div className="auth-footer-telemetry">
              <span className="telemetry-live-dot"></span>
              <span>LD4 LONDON DESK: <strong>1.4ms</strong></span>
              <span className="footer-sep">|</span>
              <span>FIX 4.4 STREAM: <strong>ACTIVE</strong></span>
            </div>
          </div>
        </div>

        {/* Right Form Desk */}
        <div className="auth-form-pane">
          <div className="auth-form-box">
            <div className="auth-form-header">
              <span className="auth-card-tag font-mono">TERMINAL SIGN IN</span>
              <h2 className="auth-form-title">Member Access</h2>
              <p className="auth-form-subtitle">Enter your registered email and credentials below.</p>
            </div>

            {/* Quick 1-Click Access for Instant Testing */}
            <div className="auth-quick-creds">
              <div className="quick-creds-label font-mono">
                <KeyRound size={12} className="text-amber" />
                <span>1-CLICK DEMO CREDENTIALS:</span>
              </div>
              <div className="quick-creds-buttons">
                <button
                  type="button"
                  className="quick-btn font-mono"
                  onClick={fillClient}
                  title="Load Alexander Wright (Live Client)"
                >
                  <span>Client (Alexander W.)</span>
                </button>
                <button
                  type="button"
                  className="quick-btn font-mono"
                  onClick={fillAdmin}
                  title="Load Chief Compliance Officer (Admin)"
                >
                  <span>Admin (Compliance Officer)</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-error-alert font-mono">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group-field">
                <label className="form-field-label font-mono">
                  <span>[ USER EMAIL ]</span>
                </label>
                <div className="input-field-wrap">
                  <Mail size={16} className="field-icon" />
                  <input
                    type="email"
                    required
                    className="auth-input font-mono"
                    placeholder="client@continuum-trading.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group-field">
                <div className="flex justify-between items-center">
                  <label className="form-field-label font-mono">
                    <span>[ PASSKEY ]</span>
                  </label>
                  <span className="field-hint font-mono">ENCRYPTED</span>
                </div>
                <div className="input-field-wrap">
                  <Lock size={16} className="field-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="auth-input font-mono"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="field-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-gold btn-lg w-full auth-submit-btn font-mono"
                disabled={loading}
              >
                {loading ? (
                  <span>AUTHENTICATING DESK...</span>
                ) : (
                  <>
                    <span>ACCESS TERMINAL</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-switcher">
              <span className="text-muted text-xs">Do not have an institutional account?</span>
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="auth-switcher-link font-mono"
              >
                OPEN OFFICIAL ACCOUNT
              </button>
            </div>

            <div className="auth-trust-strip font-mono">
              <span>EQUINIX LD4</span>
              <span className="sep">•</span>
              <span>TIER-1 SEGREGATED</span>
              <span className="sep">•</span>
              <span>256-BIT SSL</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: calc(100vh - 70px);
          background-color: #090a0f;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1.5rem;
          position: relative;
          overflow: hidden;
        }
        .auth-ambient-glow {
          position: absolute;
          width: 700px;
          height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245, 166, 35, 0.08) 0%, rgba(9, 10, 15, 0) 70%);
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
          z-index: 0;
          filter: blur(40px);
        }
        .auth-shell {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          max-width: 1080px;
          width: 100%;
          background: #0e1017;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.65);
        }

        /* Left Brand Pane */
        .auth-brand-pane {
          background: #11141e;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          padding: 3rem 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }
        .auth-brand-pane::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--color-amber), transparent);
        }
        .auth-brand-header {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .auth-brand-logo-text {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.25rem;
          letter-spacing: 0.06em;
          color: #ffffff;
        }
        .logo-dim {
          color: #64748b;
        }
        .continuum-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-amber);
          box-shadow: 0 0 10px var(--color-amber);
          display: inline-block;
        }
        .auth-system-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.65rem;
          color: #94a3b8;
          letter-spacing: 0.08em;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 0.25rem 0.6rem;
          border-radius: 9999px;
          width: fit-content;
        }
        .pulse-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
        }
        .auth-brand-body {
          margin: 2rem 0;
        }
        .auth-brand-headline {
          font-size: 2rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.2;
          letter-spacing: -0.02em;
          margin-bottom: 0.85rem;
        }
        .text-amber {
          color: var(--color-amber);
        }
        .auth-brand-paragraph {
          font-size: 0.88rem;
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        .auth-security-perks {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .auth-perk-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        .auth-perk-icon {
          color: var(--color-amber);
          margin-top: 2px;
          flex-shrink: 0;
        }
        .auth-perk-title {
          font-size: 0.82rem;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.3;
        }
        .auth-perk-sub {
          font-size: 0.7rem;
          color: #64748b;
          margin-top: 0.15rem;
        }
        .auth-brand-footer {
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 0.7rem;
          color: #64748b;
        }
        .auth-footer-telemetry {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          letter-spacing: 0.05em;
        }
        .telemetry-live-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #10b981;
        }
        .footer-sep {
          color: rgba(255, 255, 255, 0.15);
        }

        /* Right Form Pane */
        .auth-form-pane {
          background: #090a0f;
          padding: 3rem 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .auth-form-box {
          width: 100%;
          max-width: 400px;
        }
        .auth-card-tag {
          font-size: 0.65rem;
          color: var(--color-amber);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 700;
        }
        .auth-form-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #ffffff;
          margin-top: 0.25rem;
          letter-spacing: -0.01em;
        }
        .auth-form-subtitle {
          font-size: 0.82rem;
          color: #64748b;
          margin-top: 0.35rem;
          margin-bottom: 1.5rem;
        }

        /* Quick Credentials Buttons */
        .auth-quick-creds {
          background: rgba(245, 166, 35, 0.05);
          border: 1px dashed rgba(245, 166, 35, 0.25);
          border-radius: 8px;
          padding: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .quick-creds-label {
          font-size: 0.65rem;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          letter-spacing: 0.06em;
          margin-bottom: 0.45rem;
        }
        .quick-creds-buttons {
          display: flex;
          gap: 0.5rem;
        }
        .quick-btn {
          flex: 1;
          background: #12151f;
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #cbd5e1;
          font-size: 0.68rem;
          padding: 0.4rem 0.5rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }
        .quick-btn:hover {
          background: rgba(245, 166, 35, 0.15);
          border-color: var(--color-amber);
          color: #ffffff;
        }

        .auth-error-alert {
          background: rgba(244, 63, 94, 0.12);
          border: 1px solid rgba(244, 63, 94, 0.3);
          color: #f87171;
          padding: 0.65rem 0.85rem;
          border-radius: 8px;
          font-size: 0.75rem;
          margin-bottom: 1.25rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
        }
        .form-group-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .form-field-label {
          font-size: 0.68rem;
          color: #94a3b8;
          letter-spacing: 0.08em;
          font-weight: 600;
        }
        .field-hint {
          font-size: 0.62rem;
          color: #64748b;
          letter-spacing: 0.08em;
        }
        .input-field-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .field-icon {
          position: absolute;
          left: 14px;
          color: #64748b;
          pointer-events: none;
        }
        .auth-input {
          width: 100%;
          background: #131724;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 9999px;
          padding: 0.8rem 1rem 0.8rem 2.6rem;
          color: #ffffff;
          font-size: 0.85rem;
          outline: none;
          transition: all 0.2s ease;
        }
        .auth-input:focus {
          border-color: var(--color-amber);
          box-shadow: 0 0 15px rgba(245, 166, 35, 0.2);
          background: #161b2a;
        }
        .auth-input::placeholder {
          color: #475569;
        }
        .field-toggle-btn {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0;
          transition: color 0.2s ease;
        }
        .field-toggle-btn:hover {
          color: #ffffff;
        }
        .auth-submit-btn {
          margin-top: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          letter-spacing: 0.06em;
          font-weight: 800;
          padding: 0.85rem 1.5rem;
        }

        .auth-switcher {
          margin-top: 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
        .auth-switcher-link {
          background: none;
          border: none;
          color: var(--color-amber);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .auth-switcher-link:hover {
          color: #ffb800;
          text-decoration: underline;
        }

        .auth-trust-strip {
          margin-top: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.62rem;
          color: #475569;
          letter-spacing: 0.08em;
        }
        .auth-trust-strip .sep {
          color: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 860px) {
          .auth-shell {
            grid-template-columns: 1fr;
          }
          .auth-brand-pane {
            display: none;
          }
          .auth-form-pane {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
