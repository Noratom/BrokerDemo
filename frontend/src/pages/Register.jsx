import React, { useState } from 'react';
import { User, Mail, Lock, TrendingUp, Shield, ArrowRight, Landmark, CheckCircle, Sparkles } from 'lucide-react';

export default function Register({ onAuthSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', startingBalance: 10000
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
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
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
      const mockUser = {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name,
        email: formData.email,
        balance: Number(formData.startingBalance),
        role: 'client'
      };
      onAuthSuccess(mockUser);
    } finally {
      setLoading(false);
    }
  };

  const balanceTier = formData.startingBalance >= 50000 ? 'VIP' : formData.startingBalance >= 10000 ? 'Professional' : 'Standard';

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
            <h1 className="auth-brand-title">Start Your Trading Journey</h1>
            <p className="auth-brand-desc">
              Join thousands of traders worldwide. Set up your virtual portfolio in under 60 seconds with no commitments.
            </p>

            {/* Live deposit preview */}
            <div className="register-preview-card">
              <div className="preview-label">Your Account Preview</div>
              <div className="preview-balance">
                <Sparkles size={20} className="text-gold" />
                <span className="font-mono" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                  ${Number(formData.startingBalance).toLocaleString()}
                </span>
              </div>
              <div className="preview-tier">
                <span>Account Tier:</span>
                <span className={`tier-badge ${balanceTier === 'VIP' ? 'tier-vip' : balanceTier === 'Professional' ? 'tier-pro' : 'tier-std'}`}>
                  {balanceTier}
                </span>
              </div>
              <div className="preview-perks">
                {balanceTier === 'VIP' && <span>✦ 0.0 pip spreads · 1:200 leverage · VPS hosting</span>}
                {balanceTier === 'Professional' && <span>✦ 0.4 pip spreads · 1:100 leverage · Priority support</span>}
                {balanceTier === 'Standard' && <span>✦ 1.2 pip spreads · 1:100 leverage · Free analysis</span>}
              </div>
            </div>
          </div>
          <div className="auth-brand-footer">
            <Shield size={14} />
            <span>Funds segregated in Tier-1 banking institutions</span>
          </div>
        </div>

        {/* Right Form */}
        <div className="auth-form-panel">
          <div className="auth-form-container">
            <h2 className="auth-form-title">Create Account</h2>
            <p className="text-muted text-sm" style={{ marginBottom: '2rem' }}>
              Fill in your details to start trading with virtual funds.
            </p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input type="text" name="name" required className="form-input form-input-icon" placeholder="Jane Doe" value={formData.name} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input type="email" name="email" required className="form-input form-input-icon" placeholder="jane@example.com" value={formData.email} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input type="password" name="password" required className="form-input form-input-icon" placeholder="••••••" value={formData.password} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm</label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input type="password" name="confirmPassword" required className="form-input form-input-icon" placeholder="••••••" value={formData.confirmPassword} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label flex justify-between">
                  <span>Virtual Starting Deposit</span>
                  <span className="gold-shimmer" style={{ fontWeight: 800, fontSize: '1rem' }}>
                    ${Number(formData.startingBalance).toLocaleString()}
                  </span>
                </label>
                <input
                  type="range"
                  name="startingBalance"
                  min="500" max="100000" step="500"
                  className="deposit-slider"
                  value={formData.startingBalance}
                  onChange={handleChange}
                />
                <div className="flex justify-between text-xs text-muted" style={{ marginTop: '0.25rem' }}>
                  <span>$500</span>
                  <span>$50,000</span>
                  <span>$100,000</span>
                </div>
              </div>

              <button type="submit" className="btn btn-gold btn-lg w-full" disabled={loading}>
                {loading ? 'Creating...' : 'Open Demo Account'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="auth-switch">
              <span className="text-muted text-sm">Already have an account?</span>
              <button onClick={onSwitchToLogin} className="auth-switch-btn">Sign in here</button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .register-preview-card {
          margin-top: 2.5rem;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
        }
        .preview-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.5);
          margin-bottom: 0.75rem;
        }
        .preview-balance {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .text-gold { color: var(--color-gold-bright); }
        .preview-tier {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.7);
          margin-bottom: 0.5rem;
        }
        .tier-badge {
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .tier-std { background: rgba(255,255,255,0.15); color: #fff; }
        .tier-pro { background: rgba(37,99,235,0.3); color: #93c5fd; }
        .tier-vip { background: rgba(201,152,26,0.3); color: var(--color-gold-bright); }
        .preview-perks {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.5);
        }
        .deposit-slider {
          width: 100%;
          margin: 0.5rem 0;
          accent-color: var(--color-gold);
          cursor: pointer;
          height: 6px;
        }
        .auth-page { min-height: 100vh; background-color: var(--color-bg); }
        .auth-split { display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh; }
        .auth-brand-panel {
          background: linear-gradient(135deg, var(--color-blue-deep) 0%, var(--color-blue-dark) 50%, #0d2b6b 100%);
          color: var(--color-white); display: flex; flex-direction: column; justify-content: space-between;
          padding: 3rem; position: relative; overflow: hidden;
        }
        .auth-brand-panel::before {
          content: ''; position: absolute; top: -50%; right: -30%; width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(201,152,26,0.12) 0%, transparent 70%); border-radius: 50%;
        }
        .auth-brand-content { position: relative; z-index: 1; margin-top: 2rem; }
        .auth-logo-text { font-family: var(--font-heading); font-weight: 800; font-size: 1.8rem; letter-spacing: 0.04em; }
        .auth-brand-title { color: var(--color-white); font-size: 2.8rem; margin-bottom: 1rem; }
        .auth-brand-desc { color: rgba(255,255,255,0.7); font-size: 1.05rem; line-height: 1.6; max-width: 400px; }
        .auth-brand-footer { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: rgba(255,255,255,0.4); position: relative; z-index: 1; }
        .auth-form-panel { display: flex; align-items: center; justify-content: center; padding: 3rem; background-color: var(--color-white); }
        .auth-form-container { width: 100%; max-width: 440px; }
        .auth-form-title { font-size: 1.8rem; margin-bottom: 0.25rem; }
        .input-wrapper { position: relative; display: flex; align-items: center; }
        .input-icon { position: absolute; left: 14px; color: var(--color-text-muted); pointer-events: none; }
        .form-input-icon { padding-left: 2.75rem; width: 100%; }
        .auth-error { background-color: var(--color-danger-bg); color: var(--color-danger); padding: 0.75rem; border-radius: var(--radius-sm); border-left: 4px solid var(--color-danger); font-size: 0.85rem; margin-bottom: 1.5rem; }
        .auth-switch { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--color-border-light); }
        .auth-switch-btn { background: none; border: none; font-weight: 700; color: var(--color-blue-primary); cursor: pointer; font-size: 0.9rem; }
        .auth-switch-btn:hover { text-decoration: underline; }
        @media (max-width: 768px) {
          .auth-split { grid-template-columns: 1fr; }
          .auth-brand-panel { display: none; }
        }
      `}</style>
    </div>
  );
}
