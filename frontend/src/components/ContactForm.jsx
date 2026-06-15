import React, { useState } from 'react';
import { Mail, MessageSquare, Shield, HelpCircle, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Query',
    message: ''
  });
  const [status, setStatus] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'How does the AuraTrade demo simulator work?',
      a: 'The simulator mimics real market prices with virtual cash, giving you a sandbox to practice trading. It features realistic contract size specifications, real-time bid/ask spreads, and floating margin calculation for risk assessment.'
    },
    {
      q: 'Are client funds safe with AuraTrade?',
      a: 'Yes, in our live production services, all client assets are segregated in independent tier-1 bank custody accounts separate from the broker\'s balance sheet, and covered by negative balance protection policies.'
    },
    {
      q: 'What leverage options do you support?',
      a: 'We support leverage ratios ranging from 1:10 on cryptocurrencies, up to 1:100 on major forex currency pairs, ensuring flexible capital configuration for professional portfolios.'
    },
    {
      q: 'How can I transition to a live account?',
      a: 'To apply for live trading, submit your verification files (Proof of ID and Address) through the client portal. Our compliance desk usually reviews applications within 2 hours.'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Sending message...' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        setStatus({ type: 'success', message: result.message });
        setFormData({ name: '', email: '', subject: 'General Query', message: '' });
      } else {
        setStatus({ type: 'error', message: 'Something went wrong. Please check inputs.' });
      }
    } catch (error) {
      // Local fallback
      setStatus({ 
        type: 'success', 
        message: 'Message registered offline. (Express backend server not running, showing local fallback demo)' 
      });
      setFormData({ name: '', email: '', subject: 'General Query', message: '' });
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div id="contact-support" className="contact-support-container">
      <div className="section-header text-center" style={{ marginBottom: '3.5rem' }}>
        <h2>Customer Support & FAQ</h2>
        <p className="text-muted" style={{ marginTop: '0.5rem', maxWidth: '600px', marginInline: 'auto' }}>
          Have inquiries about trading conditions, account tiers, or regulations? Get in touch with our support desk available 24/7.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8 flex-col-mobile">
        {/* Support Request Form */}
        <div className="card card-blue-accent contact-card">
          <h3 className="contact-title flex items-center gap-4">
            <MessageSquare className="color-blue" />
            Send Us a Message
          </h3>
          
          <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                required
                className="form-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                required
                className="form-input"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Inquiry Subject</label>
              <select
                name="subject"
                className="form-input"
                value={formData.subject}
                onChange={handleInputChange}
              >
                <option value="General Query">General Query</option>
                <option value="Trading Platform">Trading Simulator / Platform issue</option>
                <option value="Compliance">Compliance & Verifications</option>
                <option value="Partnership">Institutional Partnership</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Message</label>
              <textarea
                name="message"
                required
                rows="4"
                className="form-input"
                placeholder="How can we assist you with trading today?"
                value={formData.message}
                onChange={handleInputChange}
                style={{ resize: 'vertical' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={status?.type === 'loading'}
            >
              {status?.type === 'loading' ? 'Sending...' : 'Submit Inquiry'}
            </button>

            {status && (
              <div className={`status-alert flex items-center gap-4 ${
                status.type === 'success' ? 'alert-success' : 
                status.type === 'error' ? 'alert-error' : 'alert-info'
              }`} style={{ marginTop: '1rem' }}>
                {status.type === 'success' && <Check size={16} />}
                <span>{status.message}</span>
              </div>
            )}
          </form>
        </div>

        {/* FAQs */}
        <div className="faq-panel">
          <h3 className="contact-title flex items-center gap-4" style={{ marginBottom: '1.5rem' }}>
            <HelpCircle className="color-gold" />
            Frequently Asked Questions
          </h3>

          <div className="faq-list flex flex-col gap-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="faq-item card">
                  <button 
                    className="faq-question-btn flex items-center justify-between"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} className="text-gold" /> : <ChevronDown size={18} className="text-muted" />}
                  </button>
                  {isOpen && (
                    <div className="faq-answer-content">
                      <p className="text-sm text-muted">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Support Badge */}
          <div className="support-badge-card flex items-center gap-4">
            <Shield className="text-gold" size={32} />
            <div>
              <h5 style={{ fontSize: '0.95rem', fontWeight: 700 }}>24/7 Fast Help Desk</h5>
              <p className="text-xs text-muted" style={{ marginTop: '0.15rem' }}>
                Average response time is less than 15 minutes. Support is available in English, Spanish, German, and Japanese.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .contact-support-container {
          width: 100%;
        }
        .contact-title {
          font-size: 1.4rem;
        }
        .contact-card {
          padding: 2rem;
        }
        .faq-item {
          padding: 1.25rem;
          box-shadow: var(--shadow-sm);
        }
        .faq-item:hover {
          transform: none;
          box-shadow: var(--shadow-sm);
        }
        .faq-question-btn {
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--color-blue-deep);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .faq-answer-content {
          margin-top: 0.75rem;
          border-top: 1px solid var(--color-border-light);
          padding-top: 0.75rem;
        }
        .support-badge-card {
          background-color: var(--color-white);
          border: 1px solid var(--color-gold-border);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          margin-top: 1.5rem;
          background-image: linear-gradient(to right, var(--color-white), var(--color-gold-light));
        }
        .status-alert {
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
        }
        .alert-success {
          background-color: var(--color-success-bg);
          color: var(--color-success);
          border: 1px solid var(--color-success);
        }
        .alert-error {
          background-color: var(--color-danger-bg);
          color: var(--color-danger);
          border: 1px solid var(--color-danger);
        }
        .alert-info {
          background-color: var(--color-blue-soft);
          color: var(--color-blue-primary);
          border: 1px solid var(--color-blue-primary);
        }
        .text-gold {
          color: var(--color-gold);
        }
      `}</style>
    </div>
  );
}
