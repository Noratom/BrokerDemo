import React from 'react';
import { TrendingUp, Shield, Menu, X, User, LogOut, Landmark, Settings } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, currentUser, onLogout, onOpenAuth }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'Company' },
    { id: 'contact', label: 'Service' },
    { id: '_investment', label: 'Investment', isAnchor: true, anchor: 'investment' },
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
        {/* Logo */}
        <div className="logo flex items-center" onClick={() => { setActivePage('home'); setIsOpen(false); }} style={{ cursor: 'pointer' }}>
          <div className="logo-icon-wrapper">
            <TrendingUp size={24} className="logo-icon-blue" />
            <Shield size={12} className="logo-icon-accent" />
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
                onClick={() => handleNavClick(item)}
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
                onClick={() => { setActivePage('dashboard'); setIsOpen(false); }}
                className={`nav-link admin-nav-btn flex items-center gap-1 ${activePage === 'dashboard' ? 'active' : ''}`}
              >
                <Landmark size={14} style={{ color: '#1a3edb' }} />
                Dashboard
              </button>
            </li>
          )}

          {/* Admin Panel Option */}
          {currentUser && currentUser.role === 'admin' && (
            <li className="nav-item">
              <button
                onClick={() => { setActivePage('admin'); setIsOpen(false); }}
                className={`nav-link admin-nav-btn flex items-center gap-1 ${activePage === 'admin' ? 'active' : ''}`}
              >
                <Settings size={14} style={{ color: '#1a3edb' }} />
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
                  <Landmark size={14} style={{ color: '#1a3edb' }} />
                  <span className="font-mono text-sm" style={{ fontWeight: 700 }}>
                    ${currentUser.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              
              <div 
                className="user-info flex items-center gap-2" 
                onClick={() => { setActivePage(currentUser.role === 'admin' ? 'admin' : 'dashboard'); }}
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
              Become a Member
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
                  <Landmark size={16} style={{ color: '#1a3edb' }} />
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
                  <Settings size={16} style={{ color: '#1a3edb' }} />
                  Admin Panel
                </button>
              </li>
            )}

            <li>
              {currentUser ? (
                <div className="flex flex-col gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1rem' }}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>User: {currentUser.name}</span>
                    {currentUser.role === 'client' && (
                      <span className="font-mono text-sm" style={{ fontWeight: 700, color: '#fff' }}>
                        ${currentUser.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>
                  <button className="btn btn-outline-white btn-sm w-full" onClick={() => { onLogout(); setIsOpen(false); }}>
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
                  Become a Member
                </button>
              )}
            </li>
          </ul>
        </div>
      )}

      {/* Navbar Styles */}
      <style>{`
        .navbar {
          background-color: #0d1b2a;
          border-bottom: 1px solid rgba(255,255,255,0.08);
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
          color: #1a3edb;
        }
        .logo-icon-accent {
          color: #ffffff;
          position: absolute;
          bottom: -2px;
          right: -2px;
          background: #0d1b2a;
          border-radius: 50%;
        }
        .logo-text {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.4rem;
          letter-spacing: 0.05em;
          color: #ffffff;
        }
        .logo-text-accent {
          color: #1a3edb;
        }
        .nav-menu {
          list-style: none;
          gap: 1.75rem;
        }
        .nav-link {
          background: none;
          border: none;
          color: rgba(255,255,255,0.75);
          font-weight: 500;
          cursor: pointer;
          font-size: 0.9rem;
          padding: 0.5rem 0;
          position: relative;
          transition: var(--transition-fast);
          white-space: nowrap;
        }
        .nav-link:hover {
          color: #ffffff;
        }
        .nav-link.active {
          color: #ffffff;
          font-weight: 600;
        }
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #1a3edb;
          border-radius: var(--radius-full);
        }
        .admin-nav-btn {
          color: rgba(255,255,255,0.9) !important;
        }
        .balance-badge {
          background-color: rgba(26, 62, 219, 0.2);
          border: 1px solid rgba(26, 62, 219, 0.4);
          color: #fff;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-sm);
        }
        .user-info {
          background-color: rgba(255,255,255,0.08);
          padding: 0.3rem 0.6rem;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(255,255,255,0.15);
          color: #fff;
        }
        .user-name {
          color: #fff;
        }
        .avatar {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background-color: #1a3edb;
          color: var(--color-white);
        }
        .logout-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.6);
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
            font-size: 0.82rem;
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
            top: 70px;
            left: 0;
            width: 100%;
            background-color: #0d1b2a;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding: 1.5rem;
            box-shadow: var(--shadow-lg);
            z-index: 999;
          }
          .mobile-nav-list {
            list-style: none;
            gap: 0.5rem;
          }
          .mobile-nav-link {
            background: none;
            border: none;
            text-align: left;
            width: 100%;
            font-size: 1rem;
            padding: 0.75rem 0;
            font-weight: 500;
            color: rgba(255,255,255,0.8);
            cursor: pointer;
            border-bottom: 1px solid rgba(255,255,255,0.07);
          }
          .mobile-nav-link:hover {
            color: #ffffff;
          }
          .mobile-nav-link.active {
            color: #ffffff;
            font-weight: 700;
            border-left: 3px solid #1a3edb;
            padding-left: 0.75rem;
          }
          .nav-actions {
            margin-right: 1rem;
          }
        }
      `}</style>
    </nav>
  );
}
