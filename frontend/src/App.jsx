import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LiveTicker from './components/LiveTicker';
import Home from './pages/Home';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import { API_BASE_URL } from './config';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedAsset, setSelectedAsset] = useState('EUR/USD');
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('aura_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Keep client profile/balance in sync with backend server in real-time
  useEffect(() => {
    if (!currentUser) return;

    const syncUserBalance = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${currentUser.id}`);
        if (response.ok) {
          const result = await response.json();
          setCurrentUser(prev => {
            const updated = { ...prev, balance: result.data.balance };
            localStorage.setItem('aura_current_user', JSON.stringify(updated));
            return updated;
          });
        }
      } catch (e) {
        // Offline
      }
    };

    syncUserBalance();
    const interval = setInterval(syncUserBalance, 4000);
    return () => clearInterval(interval);
  }, [currentUser?.id]);

  // Guards
  useEffect(() => {
    if (currentUser) {
      if (activePage === 'login' || activePage === 'register') {
        setActivePage(currentUser.role === 'admin' ? 'admin' : 'dashboard');
      }
    } else {
      if (activePage === 'dashboard' || activePage === 'admin') {
        setActivePage('login');
      }
    }
  }, [currentUser, activePage]);

  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('aura_current_user', JSON.stringify(userData));
    if (userData.role === 'admin') {
      setActivePage('admin');
    } else {
      setActivePage('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('aura_current_user');
    setActivePage('home');
  };

  // Page switcher routing
  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return (
          <Home 
            selectedAsset={selectedAsset} 
            setSelectedAsset={setSelectedAsset} 
            currentUser={currentUser}
            onOpenAuth={() => setActivePage('login')}
          />
        );
      case 'about':
        return <About />;
      case 'contact':
        return (
          <section className="section page-enter">
            <div className="container">
              {/* Form is mounted directly on contact page */}
              <div style={{ maxWidth: '900px', marginInline: 'auto' }}>
                <iframe 
                  name="dummyframe" 
                  id="dummyframe" 
                  style={{ display: 'none' }}
                ></iframe>
                {/* Embed form inside page */}
                <div className="card card-blue-accent animate-scale-in visible" style={{ padding: '2.5rem' }}>
                  <h2 style={{ marginBottom: '1.5rem' }}>Contact Our Support Desk</h2>
                  <p className="text-muted" style={{ marginBottom: '2.5rem' }}>
                    Have custom inquiries? Fill out the query card below. Administrators review inbox tickets from the central control panel.
                  </p>
                  
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const name = e.target.name.value;
                    const email = e.target.email.value;
                    const message = e.target.message.value;
                    const subject = e.target.subject.value;
                    
                    try {
                      await fetch(`${API_BASE_URL}/api/contact`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, email, subject, message })
                      });
                      alert('Message sent successfully!');
                      e.target.reset();
                    } catch (err) {
                      alert('Registered inquiry offline. (Backend offline)');
                      e.target.reset();
                    }
                  }}>
                    <div className="grid grid-cols-2 gap-4 flex-col-mobile">
                      <div className="form-group">
                        <label className="form-label">Name</label>
                        <input type="text" name="name" required className="form-input" placeholder="Your Name" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input type="email" name="email" required className="form-input" placeholder="client@example.com" />
                      </div>
                    </div>
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                      <label className="form-label">Subject</label>
                      <input type="text" name="subject" required className="form-input" placeholder="Platform issue, deposits, etc." />
                    </div>
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                      <label className="form-label">Message</label>
                      <textarea name="message" required rows="5" className="form-input" placeholder="Enter message text..."></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary w-full" style={{ width: '100%', marginTop: '1.5rem' }}>
                      Submit Inquiry Ticket
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        );
      case 'login':
        return (
          <Login 
            onAuthSuccess={handleAuthSuccess} 
            onSwitchToRegister={() => setActivePage('register')} 
          />
        );
      case 'register':
        return (
          <Register 
            onAuthSuccess={handleAuthSuccess} 
            onSwitchToLogin={() => setActivePage('login')} 
          />
        );
      case 'dashboard':
        return currentUser && currentUser.role === 'client' ? (
          <UserDashboard 
            currentUser={currentUser} 
            onLogout={handleLogout} 
            setActivePage={setActivePage} 
          />
        ) : null;
      case 'admin':
        return currentUser && currentUser.role === 'admin' ? (
          <AdminDashboard 
            currentUser={currentUser} 
            onLogout={handleLogout} 
            setActivePage={setActivePage} 
          />
        ) : null;
      default:
        return (
          <Home 
            selectedAsset={selectedAsset} 
            setSelectedAsset={setSelectedAsset} 
            currentUser={currentUser}
            onOpenAuth={() => setActivePage('login')}
          />
        );
    }
  };

  return (
    <>
      {/* Live Market Price Ticker */}
      <LiveTicker />

      {/* Main Responsive Header */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={() => setActivePage('login')}
      />

      {/* Content Injection */}
      <main style={{ flexGrow: 1 }}>
        {renderContent()}
      </main>

      {/* Footer Disclaimer & Links */}
      <Footer setActivePage={setActivePage} />
    </>
  );
}

export default App;
