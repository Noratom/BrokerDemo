import React, { useState } from 'react';
import { Lock, Mail, TrendingUp, Shield, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react';

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
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      if (response.ok) {
        onAuthSuccess(result.data);
      } else {
        setError(result.message || 'Invalid credentials.');
      }
    } catch (err) {
      if (email === 'admin@auratrade.com' && password === 'admin123') {
        onAuthSuccess({ id: 'user_admin', name: 'System Admin', email, balance: 0, role: 'admin' });
      } else if (email === 'client@auratrade.com' && password === 'client123') {
        onAuthSuccess({ id: 'user_1', name: 'Demo Client', email, balance: 15000, role: 'client' });
      } else {
        setError('Server offline. Try admin@auratrade.com / admin123');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-split">
        {/* Left Branding Panel */}
        <div className="auth-brand-panel">
          <div className="auth-brand-content">
            <div className="flex items-center gap-3" style={{ marginBottom: '2.5rem' }}>
              <TrendingUp size={32} />
              <span className="auth-logo-text">AURA<span className="gold-shimmer">TRADE</span></span>
            </div>
            <h1 className="auth-brand-title">Welcome Back</h1>
            <p className="auth-brand-desc">
              Access your portfolio, manage open positions, and monitor live market feeds from your personalized dashboard.
            </p>
            <div className="auth-features-list">
              {['Real-time market data', 'Instant order execution', 'Portfolio analytics', 'Secure SSL encryption'].map((f, i) => (
                <div key={i} className="auth-feature-item">
                  <CheckCircle size={16} />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="auth-brand-footer">
            <Shield size={14} />
            <span>Protected by 256-bit SSL encryption</span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-form-panel">
          <div className="auth-form-container">
            <h2 className="auth-form-title">Sign In</h2>
            <p className="text-muted text-sm" style={{ marginBottom: '2rem' }}>Enter your credentials to access the trading platform.</p>

            {error && (
              <div className="auth-error">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    required
                    className="form-input form-input-icon"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label flex justify-between">
                  <span>Password</span>
                  <button type="button" className="forgot-link">Forgot password?</button>
                </label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="form-input form-input-icon"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="auth-switch">
              <span className="text-muted text-sm">Don't have an account?</span>
              <button onClick={onSwitchToRegister} className="auth-switch-btn">
                Create a free account
              </button>
            </div>

            <div className="auth-demo-hint">
              <p className="text-xs text-muted">Demo credentials:</p>
              <code className="text-xs">admin@auratrade.com / admin123</code>
              <code className="text-xs">client@auratrade.com / client123</code>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          background-color: var(--color-bg);
        }
        .auth-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
        }
        .auth-brand-panel {
          background: linear-gradient(135deg, var(--color-blue-deep) 0%, var(--color-blue-dark) 50%, #0d2b6b 100%);
          color: var(--color-white);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem;
          position: relative;
          overflow: hidden;
        }
        .auth-brand-panel::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -30%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(201,152,26,0.12) 0%, transparent 70%);
          border-radius: 50%;
        }
        .auth-brand-panel::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -20%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%);
          border-radius: 50%;
        }
        .auth-brand-content {
          position: relative;
          z-index: 1;
          margin-top: 2rem;
        }
        .auth-logo-text {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.8rem;
          letter-spacing: 0.04em;
        }
        .auth-brand-title {
          color: var(--color-white);
          font-size: 2.8rem;
          margin-bottom: 1rem;
        }
        .auth-brand-desc {
          color: rgba(255,255,255,0.7);
          font-size: 1.05rem;
          line-height: 1.6;
          max-width: 400px;
        }
        .auth-features-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 2.5rem;
        }
        .auth-feature-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.85);
        }
        .auth-feature-item svg {
          color: var(--color-gold-bright);
          flex-shrink: 0;
        }
        .auth-brand-footer {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.4);
          position: relative;
          z-index: 1;
        }
        .auth-form-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          background-color: var(--color-white);
        }
        .auth-form-container {
          width: 100%;
          max-width: 420px;
        }
        .auth-form-title {
          font-size: 1.8rem;
          margin-bottom: 0.25rem;
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--color-text-muted);
          pointer-events: none;
        }
        .form-input-icon {
          padding-left: 2.75rem;
          width: 100%;
        }
        .password-toggle {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-text-muted);
          transition: var(--transition-fast);
        }
        .password-toggle:hover { color: var(--color-blue-primary); }
        .forgot-link {
          background: none;
          border: none;
          font-size: 0.8rem;
          color: var(--color-blue-primary);
          cursor: pointer;
          font-weight: 500;
        }
        .forgot-link:hover { text-decoration: underline; }
        .auth-error {
          background-color: var(--color-danger-bg);
          color: var(--color-danger);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          border-left: 4px solid var(--color-danger);
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
        }
        .auth-switch {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--color-border-light);
        }
        .auth-switch-btn {
          background: none;
          border: none;
          font-weight: 700;
          color: var(--color-blue-primary);
          cursor: pointer;
          font-size: 0.9rem;
        }
        .auth-switch-btn:hover { text-decoration: underline; }
        .auth-demo-hint {
          margin-top: 1.5rem;
          padding: 0.75rem;
          background-color: var(--color-blue-mist);
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .auth-demo-hint code {
          font-family: monospace;
          color: var(--color-blue-royal);
        }
        @media (max-width: 768px) {
          .auth-split { grid-template-columns: 1fr; }
          .auth-brand-panel { display: none; }
        }
      `}</style>
    </div>
  );
}
