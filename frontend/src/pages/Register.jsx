import React, { useState } from 'react';
import { User, Mail, Lock, TrendingUp, Shield, ArrowRight, Landmark, CheckCircle, Sparkles, DollarSign, Award, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function Register({ onAuthSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    startingBalance: 10000
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Passkey must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (response.ok) {
        onAuthSuccess(result.data);
      } else {
        setError(result.message || 'Registration failed.');
      }
    } catch (err) {
      // Local fallback simulation with live institutional structure
      const mockUser = {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name,
        email: formData.email,
        balance: Number(formData.startingBalance),
        role: 'client',
        accountNumber: `CT-${Math.floor(100000 + Math.random() * 900000)}-LIVE`,
        accountType: formData.startingBalance >= 50000 ? 'VIP Institutional Raw ECN' : 'Institutional Standard',
        leverage: formData.startingBalance >= 50000 ? '1:200' : '1:100',
        currency: 'USD',
        server: 'CT-LD4 London',
        kycStatus: 'pending'
      };
      onAuthSuccess(mockUser);
    } finally {
      setLoading(false);
    }
  };

  const balanceTier = Number(formData.startingBalance) >= 50000 
    ? 'VIP Institutional' 
    : Number(formData.startingBalance) >= 10000 
      ? 'Professional Edge' 
      : 'Standard Access';

  return (
    <div className="auth-page">
      {/* Ambient Void Glow */}
      <div className="auth-ambient-glow"></div>

      <div className="auth-shell">
        {/* Left Branding / Allocation Preview Pane */}
        <div className="auth-brand-pane">
          <div className="auth-brand-header">
            <div className="auth-logo flex items-center gap-2">
              <span className="continuum-dot"></span>
              <span className="auth-brand-logo-text">CONTINUUM<span className="logo-dim"> TRADING</span></span>
            </div>
            <div className="auth-system-badge font-mono">
              <span className="pulse-dot"></span>
              <span>MEMBERSHIP REGISTRATION // VER 2.0</span>
            </div>
          </div>

          <div className="auth-brand-body">
            <h1 className="auth-brand-headline">
              Begin Your Institutional<br />
              <span className="text-amber">Trading Journey.</span>
            </h1>
            <p className="auth-brand-paragraph">
              Open your segregated multi-asset account in under two minutes with instant compliance routing and direct ECN bridge execution.
            </p>

            {/* Live Account Tier Preview Card */}
            <div className="register-preview-card">
              <div className="preview-top-row">
                <span className="preview-label font-mono">INITIAL ALLOCATION CONFIGURATION</span>
                <span className="tier-badge font-mono">{balanceTier}</span>
              </div>

              <div className="preview-balance-display">
                <span className="text-amber font-mono text-2xl font-bold">$</span>
                <span className="font-mono preview-amount">
                  {Number(formData.startingBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className="currency-pill font-mono">USD</span>
              </div>

              <div className="preview-perks-list">
                {balanceTier === 'VIP Institutional' && (
                  <>
                    <div className="perk-row font-mono">✦ Raw Spreads from 0.0 pips · Zero Markups</div>
                    <div className="perk-row font-mono">✦ Direct London LD4 Dedicated Fix Gateway</div>
                    <div className="perk-row font-mono">✦ 1:200 Institutional Leverage + Desk Mentorship</div>
                  </>
                )}
                {balanceTier === 'Professional Edge' && (
                  <>
                    <div className="perk-row font-mono">✦ Institutional ECN Spreads from 0.4 pips</div>
                    <div className="perk-row font-mono">✦ Daily Institutional Order Flow Briefings</div>
                    <div className="perk-row font-mono">✦ 1:100 Leverage + Priority Execution Routing</div>
                  </>
                )}
                {balanceTier === 'Standard Access' && (
                  <>
                    <div className="perk-row font-mono">✦ Standard STP Spreads from 1.0 pips</div>
                    <div className="perk-row font-mono">✦ Direct Market Access + 24/7 Desk Support</div>
                    <div className="perk-row font-mono">✦ Automated Yield Accrual Eligibility</div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="auth-brand-footer font-mono">
            <div className="auth-footer-telemetry">
              <Shield size={13} className="text-amber" />
              <span>FUNDS SEGREGATED IN TIER-1 BANKING TRUSTS</span>
            </div>
          </div>
        </div>

        {/* Right Form Pane */}
        <div className="auth-form-pane">
          <div className="auth-form-box">
            <div className="auth-form-header">
              <span className="auth-card-tag font-mono">CLIENT ONBOARDING</span>
              <h2 className="auth-form-title">Open Account</h2>
              <p className="auth-form-subtitle">Complete your profile to establish your brokerage account.</p>
            </div>

            {error && (
              <div className="auth-error-alert font-mono">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group-field">
                <label className="form-field-label font-mono">
                  <span>[ FULL NAME ]</span>
                </label>
                <div className="input-field-wrap">
                  <User size={16} className="field-icon" />
                  <input
                    type="text"
                    name="name"
                    required
                    className="auth-input font-mono"
                    placeholder="Alexander Wright"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group-field">
                <label className="form-field-label font-mono">
                  <span>[ CORPORATE / PERSONAL EMAIL ]</span>
                </label>
                <div className="input-field-wrap">
                  <Mail size={16} className="field-icon" />
                  <input
                    type="email"
                    name="email"
                    required
                    className="auth-input font-mono"
                    placeholder="alexander@domain.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="form-group-field">
                  <label className="form-field-label font-mono">
                    <span>[ PASSKEY ]</span>
                  </label>
                  <div className="input-field-wrap">
                    <Lock size={16} className="field-icon" />
                    <input
                      type="password"
                      name="password"
                      required
                      className="auth-input font-mono"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group-field">
                  <label className="form-field-label font-mono">
                    <span>[ CONFIRM ]</span>
                  </label>
                  <div className="input-field-wrap">
                    <Lock size={16} className="field-icon" />
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      className="auth-input font-mono"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Initial Capital Slider */}
              <div className="form-group-field">
                <div className="flex justify-between items-center">
                  <label className="form-field-label font-mono">
                    <span>[ INITIAL CAPITAL ALLOCATION ]</span>
                  </label>
                  <span className="text-amber font-mono text-xs font-bold">
                    ${Number(formData.startingBalance).toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  name="startingBalance"
                  min="500"
                  max="100000"
                  step="500"
                  className="deposit-slider"
                  value={formData.startingBalance}
                  onChange={handleChange}
                />
                <div className="flex justify-between text-xs text-muted font-mono" style={{ fontSize: '0.65rem' }}>
                  <span>$500 (Bronze)</span>
                  <span>$10,000 (Silver)</span>
                  <span>$50,000+ (VIP)</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-gold btn-lg w-full auth-submit-btn font-mono"
                disabled={loading}
              >
                {loading ? (
                  <span>ESTABLISHING ACCOUNT...</span>
                ) : (
                  <>
                    <span>ESTABLISH BROKERAGE ACCOUNT</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-switcher">
              <span className="text-muted text-xs">Already an established member?</span>
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="auth-switcher-link font-mono"
              >
                SIGN IN TO TERMINAL
              </button>
            </div>

            <div className="auth-trust-strip font-mono">
              <span>EQUINIX LD4</span>
              <span className="sep">•</span>
              <span>TIER-1 TRUST CUSTODY</span>
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
          margin: 1.75rem 0;
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
          margin-bottom: 1.5rem;
        }

        /* Allocation Preview Card */
        .register-preview-card {
          background: #090a0f;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 1.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }
        .preview-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .preview-label {
          font-size: 0.65rem;
          color: #64748b;
          letter-spacing: 0.08em;
        }
        .tier-badge {
          background: rgba(245, 166, 35, 0.15);
          color: var(--color-amber);
          border: 1px solid rgba(245, 166, 35, 0.3);
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
          letter-spacing: 0.06em;
        }
        .preview-balance-display {
          display: flex;
          align-items: baseline;
          gap: 0.35rem;
          margin-bottom: 1rem;
        }
        .preview-amount {
          font-size: 2.2rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .currency-pill {
          font-size: 0.72rem;
          color: #64748b;
          margin-left: 0.25rem;
        }
        .preview-perks-list {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
        .perk-row {
          font-size: 0.72rem;
          color: #94a3b8;
          line-height: 1.4;
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

        .deposit-slider {
          width: 100%;
          height: 6px;
          background: #131724;
          border-radius: 3px;
          accent-color: var(--color-amber);
          cursor: pointer;
          margin-top: 0.35rem;
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
