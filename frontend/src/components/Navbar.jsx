import React from 'react';
import { Menu, X, User, LogOut, Landmark, Settings, Plus, Shield } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, currentUser, onLogout, onOpenAuth, onOpenFunding }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'Company' },
    { id: 'contact', label: 'Service' },
    { id: '_investment', label: 'Investment', isAnchor: true, anchor: 'investment' },
    { id: '_funding', label: 'Deposit & Withdraw', isAnchor: true, anchor: 'funding' },
    { id: '_membership', label: 'Membership Portal', isAnchor: true, anchor: 'membership' },
  ];

  const handleNavClick = (item) => {
    if (item.isAnchor) {
      setActivePage('home');
      setIsOpen(false);
      setTimeout(() => {
        document.getElementById(item.anchor)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      setActivePage(item.id);
      setIsOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="container flex items-center justify-between navbar-container">
        {/* Logo matching Continuum style */}
        <div className="logo flex items-center" onClick={() => { setActivePage('home'); setIsOpen(false); }} style={{ cursor: 'pointer' }}>
          <div className="logo-badge flex items-center gap-2">
            <span className="continuum-dot"></span>
            <span className="logo-text">CONTINUUM<span className="logo-text-dim"> TRADING</span></span>
          </div>
        </div>

        {/* Desktop Menu */}
        <ul className="nav-menu flex">
          {navItems.map(item => (
            <li key={item.id} className="nav-item">
              <button
                onClick={() => handleNavClick(item)}
                className={`nav-link ${activePage === item.id ? 'active' : ''}`}
              >
                {activePage === item.id && <span className="nav-active-dot"></span>}
                {item.label}
              </button>
            </li>
          ))}

          {/* Client Dashboard */}
          {currentUser && currentUser.role === 'client' && (
            <li className="nav-item">
              <button
                onClick={() => { setActivePage('dashboard'); setIsOpen(false); }}
                className={`nav-link admin-nav-btn flex items-center gap-1 ${activePage === 'dashboard' ? 'active' : ''}`}
              >
                <Landmark size={13} style={{ color: 'var(--color-amber)' }} />
                Dashboard
              </button>
            </li>
          )}

          {/* Admin Panel */}
          {currentUser && currentUser.role === 'admin' && (
            <li className="nav-item">
              <button
                onClick={() => { setActivePage('admin'); setIsOpen(false); }}
                className={`nav-link admin-nav-btn flex items-center gap-1 ${activePage === 'admin' ? 'active' : ''}`}
              >
                <Settings size={13} style={{ color: 'var(--color-amber)' }} />
                Admin Panel
              </button>
            </li>
          )}
        </ul>

        {/* Actions / CTA Buttons */}
        <div className="nav-actions flex items-center gap-3">
          {currentUser ? (
            <div className="user-profile-badge flex items-center gap-3">
              {currentUser.role === 'client' && (
                <>
                  <button
                    className="btn btn-gold btn-sm flex items-center gap-1 nav-deposit-pill"
                    onClick={() => onOpenFunding ? onOpenFunding('deposit') : setActivePage('dashboard')}
                  >
                    <Plus size={13} />
                    <span>DEPOSIT</span>
                  </button>
                  <div className="balance-badge flex items-center gap-2">
                    <span className="balance-label">WALLET</span>
                    <span className="font-mono text-sm balance-amount">
                      ${currentUser.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </>
              )}

              <div
                className="user-info flex items-center gap-2"
                onClick={() => { setActivePage(currentUser.role === 'admin' ? 'admin' : 'dashboard'); }}
                title="Go to Dashboard"
              >
                <div className="avatar flex items-center justify-center">
                  <User size={13} />
                </div>
                <span className="user-name text-xs">{currentUser.name}</span>
              </div>

              <button className="logout-btn" onClick={onLogout} title="Sign Out">
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                className="nav-member-access font-mono"
                onClick={onOpenAuth}
              >
                MEMBER ACCESS
              </button>
              <button
                className="btn btn-secondary btn-sm nav-cta-pill flex items-center gap-2"
                onClick={() => {
                  const el = document.getElementById('account-tiers') || document.getElementById('investment');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else onOpenAuth();
                }}
              >
                <span className="continuum-dot"></span>
                <span className="font-mono">VIEW PLANS</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="mobile-drawer animate-fade-in">
          <ul className="mobile-nav-list flex flex-col">
            {navItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item)}
                  className={`mobile-nav-link ${activePage === item.id ? 'active' : ''}`}
                >
                  {item.label}
                </button>
              </li>
            ))}

            {currentUser && currentUser.role === 'client' && (
              <li>
                <button
                  onClick={() => { setActivePage('dashboard'); setIsOpen(false); }}
                  className={`mobile-nav-link flex items-center gap-2 ${activePage === 'dashboard' ? 'active' : ''}`}
                >
                  <Landmark size={15} style={{ color: 'var(--color-amber)' }} />
                  Dashboard
                </button>
              </li>
            )}

            {currentUser && currentUser.role === 'admin' && (
              <li>
                <button
                  onClick={() => { setActivePage('admin'); setIsOpen(false); }}
                  className={`mobile-nav-link flex items-center gap-2 ${activePage === 'admin' ? 'active' : ''}`}
                >
                  <Settings size={15} style={{ color: 'var(--color-amber)' }} />
                  Admin Panel
                </button>
              </li>
            )}

            <li>
              {currentUser ? (
                <div className="flex flex-col gap-3 mobile-auth-box">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted">User: {currentUser.name}</span>
                    {currentUser.role === 'client' && (
                      <span className="font-mono text-sm" style={{ fontWeight: 700, color: '#fff' }}>
                        ${currentUser.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>
                  {currentUser.role === 'client' && (
                    <div className="flex gap-2">
                      <button
                        className="btn btn-gold btn-sm w-full flex items-center justify-center gap-1"
                        onClick={() => { setIsOpen(false); if (onOpenFunding) onOpenFunding('deposit'); }}
                      >
                        <Plus size={14} /> Deposit
                      </button>
                      <button
                        className="btn btn-secondary btn-sm w-full flex items-center justify-center gap-1"
                        onClick={() => { setIsOpen(false); if (onOpenFunding) onOpenFunding('withdraw'); }}
                      >
                        Withdraw
                      </button>
                    </div>
                  )}
                  <button className="btn btn-secondary btn-sm w-full" onClick={() => { onLogout(); setIsOpen(false); }}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-primary btn-sm w-full"
                  style={{ marginTop: '0.75rem' }}
                  onClick={() => {
                    setIsOpen(false);
                    onOpenAuth();
                  }}
                >
                  Member Access / View Plans
                </button>
              )}
            </li>
          </ul>
        </div>
      )}

      {/* Continuum Navbar Styles */}
      <style>{`
        .navbar {
          background-color: var(--color-bg);
          border-bottom: 1px solid var(--color-border);
          position: sticky;
          top: 0;
          z-index: 1000;
          height: 68px;
          display: flex;
          align-items: center;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .navbar-container {
          width: 100%;
        }
        .continuum-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-amber);
          box-shadow: 0 0 8px rgba(245, 166, 35, 0.8);
        }
        .nav-active-dot {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--color-amber);
          margin-right: 6px;
        }
        .logo-badge {
          display: flex;
          align-items: center;
        }
        .logo-text {
          font-family: var(--font-mono);
          font-weight: 800;
          font-size: 0.95rem;
          letter-spacing: 0.14em;
          color: #ffffff;
        }
        .logo-text-dim {
          color: var(--color-text-muted);
          font-weight: 500;
        }
        .nav-menu {
          list-style: none;
          gap: 1.75rem;
        }
        .nav-link {
          background: none;
          border: none;
          color: #94a3b8;
          font-family: var(--font-mono);
          font-weight: 500;
          cursor: pointer;
          font-size: 0.76rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.4rem 0;
          position: relative;
          transition: var(--transition-fast);
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
        }
        .nav-link:hover {
          color: #ffffff;
        }
        .nav-link.active {
          color: #ffffff;
          font-weight: 600;
        }
        .admin-nav-btn {
          color: var(--color-amber) !important;
        }
        .nav-member-access {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          padding: 0.4rem 0.6rem;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .nav-member-access:hover {
          color: #ffffff;
        }
        .nav-cta-pill {
          font-family: var(--font-mono);
          letter-spacing: 0.1em;
          font-size: 0.75rem;
          padding: 0.45rem 1.15rem;
          border-color: rgba(255, 255, 255, 0.2);
        }
        .nav-deposit-pill {
          font-family: var(--font-mono);
          letter-spacing: 0.08em;
          font-size: 0.75rem;
          padding: 0.4rem 0.9rem;
        }
        .balance-badge {
          background-color: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--color-border);
          color: #fff;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          gap: 0.4rem;
        }
        .balance-label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          color: var(--color-text-muted);
        }
        .balance-amount {
          font-weight: 700;
          color: #ffffff;
        }
        .user-info {
          background-color: rgba(255, 255, 255, 0.04);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
          color: #fff;
          cursor: pointer;
        }
        .user-name {
          color: var(--color-text-body);
        }
        .avatar {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: var(--color-amber);
          color: #090a0f;
          font-weight: 800;
        }
        .logout-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-text-muted);
          transition: var(--transition-fast);
        }
        .logout-btn:hover {
          color: var(--color-danger);
        }
        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #ffffff;
        }
        .mobile-drawer {
          display: none;
        }
        @media (max-width: 1100px) {
          .nav-menu {
            gap: 1.1rem;
          }
          .nav-link {
            font-size: 0.72rem;
          }
        }
        @media (max-width: 992px) {
          .nav-menu {
            display: none;
          }
          .mobile-toggle {
            display: block;
          }
          .mobile-drawer {
            display: block;
            position: absolute;
            top: 68px;
            left: 0;
            width: 100%;
            background-color: #090a0f;
            border-bottom: 1px solid var(--color-border);
            padding: 1rem 1.25rem 1.5rem;
            box-shadow: var(--shadow-lg);
            z-index: 999;
            max-height: calc(100vh - 68px);
            overflow-y: auto;
          }
          .mobile-nav-list {
            list-style: none;
            gap: 0;
          }
          .mobile-nav-link {
            background: none;
            border: none;
            text-align: left;
            width: 100%;
            font-family: var(--font-mono);
            font-size: 0.85rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            padding: 0.85rem 0;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.75);
            cursor: pointer;
            border-bottom: 1px solid var(--color-border-light);
            display: block;
          }
          .mobile-nav-link:hover {
            color: #ffffff;
          }
          .mobile-nav-link.active {
            color: var(--color-amber);
            font-weight: 700;
            border-left: 3px solid var(--color-amber);
            padding-left: 0.75rem;
          }
          .mobile-auth-box {
            border-top: 1px solid var(--color-border);
            padding-top: 1rem;
            margin-top: 0.5rem;
          }
          .balance-badge {
            display: none;
          }
        }
        @media (max-width: 480px) {
          .navbar {
            height: 60px;
          }
          .mobile-drawer {
            top: 60px;
          }
          .logo-text {
            font-size: 0.85rem;
          }
          .nav-actions .btn {
            font-size: 0.75rem;
            padding: 0.4rem 0.8rem;
          }
        }
      `}</style>
    </nav>
  );
}
