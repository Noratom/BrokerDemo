import React from 'react';
import { Shield, TrendingUp, Menu, X, User, LogOut, Landmark, Settings } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, currentUser, onLogout, onOpenAuth }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home & Trading' },
    { id: 'about', label: 'Why AuraTrade' },
    { id: 'contact', label: 'Support & Contact' }
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container flex items-center justify-between navbar-container">
        {/* Logo */}
        <div className="logo flex items-center" onClick={() => handleNavClick('home')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon-wrapper">
            <TrendingUp size={24} className="logo-icon-blue" />
            <Shield size={12} className="logo-icon-gold" />
          </div>
          <span className="logo-text">
            AURA<span className="logo-text-accent">TRADE</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <ul className="nav-menu flex">
          {navItems.map(item => (
            <li key={item.id} className="nav-item">
              <button
                onClick={() => handleNavClick(item.id)}
                className={`nav-link ${activePage === item.id ? 'active' : ''}`}
              >
                {item.label}
              </button>
            </li>
          ))}

          {/* Dashboard Option for Client */}
          {currentUser && currentUser.role === 'client' && (
            <li className="nav-item">
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`nav-link admin-nav-btn flex items-center gap-1 ${activePage === 'dashboard' ? 'active' : ''}`}
              >
                <Landmark size={14} className="text-gold" />
                Dashboard
              </button>
            </li>
          )}

          {/* Admin Panel Option */}
          {currentUser && currentUser.role === 'admin' && (
            <li className="nav-item">
              <button
                onClick={() => handleNavClick('admin')}
                className={`nav-link admin-nav-btn flex items-center gap-1 ${activePage === 'admin' ? 'active' : ''}`}
              >
                <Settings size={14} className="text-gold" />
                Admin Panel
              </button>
            </li>
          )}
        </ul>

        {/* Client Sessions Status / CTA Buttons */}
        <div className="nav-actions flex items-center gap-4">
          {currentUser ? (
            <div className="user-profile-badge flex items-center gap-4">
              {currentUser.role === 'client' && (
                <div className="balance-badge flex items-center gap-2">
                  <Landmark size={14} className="text-gold" />
                  <span className="font-mono text-sm" style={{ fontWeight: 700 }}>
                    ${currentUser.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              
              <div 
                className="user-info flex items-center gap-2" 
                onClick={() => handleNavClick(currentUser.role === 'admin' ? 'admin' : 'dashboard')}
                style={{ cursor: 'pointer' }}
                title="Go to Dashboard"
              >
                <div className="avatar flex items-center justify-center">
                  <User size={14} />
                </div>
                <span className="user-name text-xs" style={{ fontWeight: 600 }}>{currentUser.name}</span>
              </div>

              <button className="logout-btn" onClick={onLogout} title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              className="btn btn-gold btn-sm"
              onClick={onOpenAuth}
            >
              Sign In / Open Account
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="mobile-drawer">
          <ul className="mobile-nav-list flex flex-col">
            {navItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`mobile-nav-link ${activePage === item.id ? 'active' : ''}`}
                >
                  {item.label}
                </button>
              </li>
            ))}
            
            {currentUser && currentUser.role === 'client' && (
              <li>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className={`mobile-nav-link flex items-center gap-2 ${activePage === 'dashboard' ? 'active' : ''}`}
                >
                  <Landmark size={16} className="text-gold" />
                  Dashboard
                </button>
              </li>
            )}

            {currentUser && currentUser.role === 'admin' && (
              <li>
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`mobile-nav-link flex items-center gap-2 ${activePage === 'admin' ? 'active' : ''}`}
                >
                  <Settings size={16} className="text-gold" />
                  Admin Panel
                </button>
              </li>
            )}

            <li>
              {currentUser ? (
                <div className="flex flex-col gap-3" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted">User: {currentUser.name}</span>
                    {currentUser.role === 'client' && (
                      <span className="font-mono text-sm" style={{ fontWeight: 700 }}>
                        ${currentUser.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>
                  <button className="btn btn-secondary btn-sm w-full" onClick={() => { onLogout(); setIsOpen(false); }}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-gold btn-sm w-full"
                  style={{ width: '100%', marginTop: '1rem' }}
                  onClick={() => {
                    setIsOpen(false);
                    onOpenAuth();
                  }}
                >
                  Sign In / Register
                </button>
              )}
            </li>
          </ul>
        </div>
      )}

      {/* Styled inline elements specific to Navbar */}
      <style>{`
        .navbar {
          background-color: var(--color-white);
          border-bottom: 1px solid var(--color-border-light);
          position: sticky;
          top: 0;
          z-index: 1000;
          height: 70px;
          display: flex;
          align-items: center;
        }
        .navbar-container {
          width: 100%;
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
        .nav-menu {
          list-style: none;
          gap: 2rem;
        }
        .nav-link {
          background: none;
          border: none;
          color: var(--color-text-muted);
          font-weight: 500;
          cursor: pointer;
          font-size: 0.95rem;
          padding: 0.5rem 0;
          position: relative;
          transition: var(--transition-fast);
        }
        .nav-link:hover {
          color: var(--color-blue-royal);
        }
        .nav-link.active {
          color: var(--color-blue-deep);
          font-weight: 600;
        }
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--color-gold);
          border-radius: var(--radius-full);
        }
        .admin-nav-btn {
          color: var(--color-gold) !important;
        }
        .admin-nav-btn.active::after {
          background-color: var(--color-blue-royal) !important;
        }
        .balance-badge {
          background-color: var(--color-gold-light);
          border: 1px solid var(--color-gold-border);
          color: var(--color-gold);
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
        }
        .user-info {
          background-color: var(--color-bg);
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border-light);
        }
        .avatar {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: var(--color-blue-royal);
          color: var(--color-white);
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
          color: var(--color-blue-deep);
        }
        .mobile-drawer {
          display: none;
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
            top: 70px;
            left: 0;
            width: 100%;
            background-color: var(--color-white);
            border-bottom: 1px solid var(--color-border);
            padding: 1.5rem;
            box-shadow: var(--shadow-lg);
          }
          .mobile-nav-list {
            list-style: none;
            gap: 1rem;
          }
          .mobile-nav-link {
            background: none;
            border: none;
            text-align: left;
            width: 100%;
            font-size: 1.1rem;
            padding: 0.75rem 0;
            font-weight: 500;
            color: var(--color-text-dark);
            cursor: pointer;
          }
          .mobile-nav-link.active {
            color: var(--color-blue-royal);
            font-weight: 700;
            border-left: 3px solid var(--color-gold);
            padding-left: 0.5rem;
          }
          .nav-actions {
            margin-right: 1rem;
          }
        }
      `}</style>
    </nav>
  );
}
