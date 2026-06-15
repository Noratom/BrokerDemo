import React, { useState } from 'react';
import { X, Lock, Mail, User, Landmark, ShieldCheck } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    startingBalance: 10000
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const url = isRegister 
      ? 'http://localhost:5000/api/auth/register' 
      : 'http://localhost:5000/api/auth/login';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (response.ok) {
        onAuthSuccess(result.data);
        onClose();
        // Reset form
        setFormData({ name: '', email: '', password: '', startingBalance: 10000 });
      } else {
        setError(result.message || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      // Local fallback simulation if server is offline
      if (isRegister) {
        const mockUser = {
          id: `user_${Math.random().toString(36).substr(2, 9)}`,
          name: formData.name || 'Jane Doe',
          email: formData.email,
          balance: Number(formData.startingBalance) || 10000.00,
          role: 'client'
        };
        onAuthSuccess(mockUser);
      } else {
        // Mock admin check
        if (formData.email === 'admin@auratrade.com' && formData.password === 'admin123') {
          onAuthSuccess({ id: 'user_admin', name: 'System Admin', email: formData.email, balance: 0.0, role: 'admin' });
        } else if (formData.email === 'client@auratrade.com' && formData.password === 'client123') {
          onAuthSuccess({ id: 'user_1', name: 'Demo Client', email: formData.email, balance: 15000.00, role: 'client' });
        } else {
          setError('Invalid login details. Try admin@auratrade.com (admin123) or client@auratrade.com (client123)');
          setLoading(false);
          return;
        }
      }
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay flex items-center justify-center">
      <div className="auth-modal card card-blue-accent">
        {/* Header */}
        <div className="auth-header flex justify-between items-center">
          <h3 className="auth-title">{isRegister ? 'Register Trading Profile' : 'Log In Client Portal'}</h3>
          <button className="auth-close" onClick={onClose}><X size={20} /></button>
        </div>

        {error && (
          <div className="auth-error-banner text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ marginTop: '1.25rem' }}>
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-icon-wrapper flex items-center">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Jane Doe"
                  className="form-input with-icon"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-icon-wrapper flex items-center">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                name="email"
                required
                placeholder="client@auratrade.com"
                className="form-input with-icon"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrapper flex items-center">
              <Lock size={16} className="input-icon" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="form-input with-icon"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {isRegister && (
            <div className="form-group">
              <label className="form-label flex justify-between">
                <span>Initial Virtual Deposit</span>
                <span className="font-mono text-gold" style={{ fontWeight: 700 }}>
                  ${Number(formData.startingBalance).toLocaleString()}
                </span>
              </label>
              <div className="input-icon-wrapper flex items-center">
                <Landmark size={16} className="input-icon" />
                <input
                  type="range"
                  name="startingBalance"
                  min="500"
                  max="100000"
                  step="500"
                  className="balance-slider"
                  value={formData.startingBalance}
                  onChange={handleInputChange}
                />
              </div>
              <span className="text-xxs text-muted" style={{ fontSize: '0.7rem' }}>
                Select virtual capital from $500 to $100,000 for training.
              </span>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary w-full"
            style={{ width: '100%', marginTop: '1.25rem' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Secure Login')}
          </button>
        </form>

        {/* Toggle link */}
        <div className="auth-footer text-center" style={{ marginTop: '1.5rem' }}>
          <button 
            className="toggle-auth-btn text-xs text-muted"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
          >
            {isRegister 
              ? 'Already registered? Click here to sign in' 
              : "New to AuraTrade? Click here to register a demo profile"}
          </button>
          
          <div className="flex items-center justify-center gap-2 text-xxs text-muted" style={{ marginTop: '1rem', fontSize: '0.7rem', opacity: 0.8 }}>
            <ShieldCheck size={12} className="text-gold" />
            <span>Encrypted SSL Client Protection Protocol</span>
          </div>
        </div>
      </div>

      <style>{`
        .auth-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(10, 25, 47, 0.65);
          backdrop-filter: blur(4px);
          z-index: 2000;
        }
        .auth-modal {
          width: 420px;
          max-width: 90%;
          padding: 2rem;
          box-shadow: var(--shadow-premium);
          border-top: 4px solid var(--color-blue-royal);
          animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes scaleUp {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .auth-close {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-text-muted);
          transition: var(--transition-fast);
        }
        .auth-close:hover {
          color: var(--color-danger);
        }
        .auth-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-blue-deep);
        }
        .input-icon-wrapper {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 12px;
          color: var(--color-text-muted);
        }
        .form-input.with-icon {
          padding-left: 2.5rem;
          width: 100%;
        }
        .balance-slider {
          width: 100%;
          margin: 0.5rem 0;
          accent-color: var(--color-blue-royal);
          cursor: pointer;
        }
        .toggle-auth-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
        }
        .toggle-auth-btn:hover {
          color: var(--color-blue-royal);
          text-decoration: underline;
        }
        .auth-error-banner {
          background-color: var(--color-danger-bg);
          color: var(--color-danger);
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-danger);
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
}
