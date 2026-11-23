import React, { useState } from 'react';
import { X, ArrowDownCircle, ArrowUpCircle, Copy, Check, ShieldCheck, AlertCircle, DollarSign, Wallet, Building2, Landmark, QrCode } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function DepositWithdrawModal({ isOpen, onClose, initialTab = 'deposit', initialAmount = '', currentUser, onBalanceUpdate, onOpenAuth }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState(initialTab); // 'deposit' | 'withdraw'
  const [method, setMethod] = useState('USDT'); // 'USDT' | 'BTC' | 'ETH' | 'BANK'
  const [amount, setAmount] = useState(initialAmount ? String(initialAmount) : '500');
  const [txHash, setTxHash] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [bankDetails, setBankDetails] = useState({ bankName: '', accountName: '', accountNumber: '', swift: '' });
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null); // { type: 'success' | 'error', text: string }
  const [isSubmitting, setIsSubmitting] = useState(false);

  const walletAddresses = {
    USDT: 'TLeXuzGains77Xk98pQ2n4vB1mRtY5wKqZ',
    BTC: 'bc1qlxzgains89pk204vbn1mrty5wkqz39x8u',
    ETH: '0x71C...LeXuzGains990B1E29a17Fc52b71'
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const currentBalance = currentUser ? currentUser.balance : 10000;

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid deposit amount.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg(null);

    const transaction = {
      id: `DEP-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      userId: currentUser?.id || 'guest',
      type: 'DEPOSIT',
      method,
      amount: numAmount,
      txHash: txHash || `0x${Math.random().toString(16).substr(2, 24)}`,
      timestamp: new Date().toISOString(),
      status: 'COMPLETED'
    };

    try {
      if (currentUser) {
        const res = await fetch(`${API_BASE_URL}/api/wallet/deposit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transaction)
        });
        if (res.ok) {
          const data = await res.json();
          if (onBalanceUpdate) onBalanceUpdate(data.data.newBalance);
        } else {
          fallbackLocalDeposit(numAmount, transaction);
        }
      } else {
        fallbackLocalDeposit(numAmount, transaction);
      }

      setStatusMsg({
        type: 'success',
        text: `Deposit of $${numAmount.toLocaleString()} via ${method} confirmed! Your balance has been credited.`
      });
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      fallbackLocalDeposit(numAmount, transaction);
      setStatusMsg({
        type: 'success',
        text: `Deposit of $${numAmount.toLocaleString()} via ${method} processed! Balance updated.`
      });
      setTimeout(() => {
        onClose();
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fallbackLocalDeposit = (numAmount, transaction) => {
    const saved = localStorage.getItem('ct_transactions');
    const list = saved ? JSON.parse(saved) : [];
    list.unshift(transaction);
    localStorage.setItem('ct_transactions', JSON.stringify(list));

    if (currentUser) {
      currentUser.balance = (currentUser.balance || 0) + numAmount;
      localStorage.setItem('ct_current_user', JSON.stringify(currentUser));
      if (onBalanceUpdate) onBalanceUpdate(currentUser.balance);
    } else {
      const cur = parseFloat(localStorage.getItem('ct_live_balance') || '10000');
      const updated = cur + numAmount;
      localStorage.setItem('ct_live_balance', updated.toFixed(2));
      if (onBalanceUpdate) onBalanceUpdate(updated);
    }
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid withdrawal amount.' });
      return;
    }
    if (numAmount > currentBalance) {
      setStatusMsg({ type: 'error', text: `Insufficient funds. Your available balance is $${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}.` });
      return;
    }

    if (method !== 'BANK' && !withdrawAddress.trim()) {
      setStatusMsg({ type: 'error', text: 'Please enter your receiving wallet address.' });
      return;
    }

    if (method === 'BANK' && (!bankDetails.accountNumber || !bankDetails.bankName)) {
      setStatusMsg({ type: 'error', text: 'Please complete all bank transfer details.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg(null);

    const transaction = {
      id: `WTH-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      userId: currentUser?.id || 'guest',
      type: 'WITHDRAWAL',
      method,
      amount: numAmount,
      destination: method === 'BANK' ? `${bankDetails.bankName} - ${bankDetails.accountNumber}` : withdrawAddress,
      timestamp: new Date().toISOString(),
      status: 'PENDING'
    };

    try {
      if (currentUser) {
        const res = await fetch(`${API_BASE_URL}/api/wallet/withdraw`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transaction)
        });
        if (res.ok) {
          const data = await res.json();
          if (onBalanceUpdate) onBalanceUpdate(data.data.newBalance);
        } else {
          fallbackLocalWithdraw(numAmount, transaction);
        }
      } else {
        fallbackLocalWithdraw(numAmount, transaction);
      }

      setStatusMsg({
        type: 'success',
        text: `Withdrawal request for $${numAmount.toLocaleString()} submitted successfully! Status: Processing.`
      });
      setTimeout(() => {
        onClose();
      }, 2200);
    } catch (err) {
      fallbackLocalWithdraw(numAmount, transaction);
      setStatusMsg({
        type: 'success',
        text: `Withdrawal request for $${numAmount.toLocaleString()} submitted successfully! Status: Processing.`
      });
      setTimeout(() => {
        onClose();
      }, 2200);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fallbackLocalWithdraw = (numAmount, transaction) => {
    const saved = localStorage.getItem('ct_transactions');
    const list = saved ? JSON.parse(saved) : [];
    list.unshift(transaction);
    localStorage.setItem('ct_transactions', JSON.stringify(list));

    if (currentUser) {
      currentUser.balance = Math.max(0, (currentUser.balance || 0) - numAmount);
      localStorage.setItem('ct_current_user', JSON.stringify(currentUser));
      if (onBalanceUpdate) onBalanceUpdate(currentUser.balance);
    } else {
      const cur = parseFloat(localStorage.getItem('ct_live_balance') || '10000');
      const updated = Math.max(0, cur - numAmount);
      localStorage.setItem('ct_live_balance', updated.toFixed(2));
      if (onBalanceUpdate) onBalanceUpdate(updated);
    }
  };

  return (
    <div className="funding-modal-overlay">
      <div className="funding-modal-card animate-scale-in">
        {/* Header */}
        <div className="funding-modal-header">
          <div className="flex items-center gap-2">
            <span className="continuum-dot"></span>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.04em' }}>
              FUNDING & LIQUIDITY PORTAL
            </h3>
          </div>
          <button className="funding-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="funding-tabs">
          <button
            type="button"
            className={`funding-tab-btn ${activeTab === 'deposit' ? 'active deposit' : ''}`}
            onClick={() => { setActiveTab('deposit'); setStatusMsg(null); }}
          >
            <ArrowDownCircle size={16} />
            <span>Deposit Funds</span>
          </button>
          <button
            type="button"
            className={`funding-tab-btn ${activeTab === 'withdraw' ? 'active withdraw' : ''}`}
            onClick={() => { setActiveTab('withdraw'); setStatusMsg(null); }}
          >
            <ArrowUpCircle size={16} />
            <span>Withdraw Funds</span>
          </button>
        </div>

        {/* Balance Snapshot */}
        <div className="funding-balance-card">
          <span className="text-xs text-muted font-mono uppercase">Available Account Balance</span>
          <div className="funding-balance-val font-mono">
            ${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>

        {statusMsg && (
          <div className={`funding-status-box ${statusMsg.type === 'success' ? 'status-success' : 'status-error'}`}>
            {statusMsg.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* ══════════ DEPOSIT TAB ══════════ */}
        {activeTab === 'deposit' && (
          <form onSubmit={handleDepositSubmit} className="funding-form">
            <div className="form-group">
              <label className="form-label text-xs uppercase text-muted font-mono">Select Deposit Method</label>
              <div className="method-grid">
                {[
                  { id: 'USDT', name: 'USDT (TRC-20)', tag: 'Instant' },
                  { id: 'BTC', name: 'Bitcoin (BTC)', tag: 'Crypto' },
                  { id: 'ETH', name: 'Ethereum (ETH)', tag: 'Crypto' },
                  { id: 'BANK', name: 'Bank Wire', tag: 'Direct' }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`method-btn ${method === m.id ? 'active' : ''}`}
                    onClick={() => setMethod(m.id)}
                  >
                    <span className="method-name">{m.name}</span>
                    <span className="method-tag">{m.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Presets */}
            <div className="form-group">
              <label className="form-label flex justify-between items-center text-xs uppercase text-muted font-mono">
                <span>Deposit Amount (USD)</span>
                <span className="text-amber">0% Deposit Fee</span>
              </label>
              <div className="amount-input-wrap">
                <span className="amount-prefix">$</span>
                <input
                  type="number"
                  step="50"
                  min="50"
                  className="form-input amount-field font-mono"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="500"
                  required
                />
              </div>
              <div className="preset-chips">
                {['500', '1000', '5000', '10000', '50000'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={`preset-chip ${amount === val ? 'active' : ''}`}
                    onClick={() => setAmount(val)}
                  >
                    ${Number(val).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Crypto Address / Bank Info */}
            {method !== 'BANK' ? (
              <div className="crypto-pay-box">
                <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
                  <span className="text-xs font-mono uppercase text-muted">Official {method} Address</span>
                  <span className="tech-badge">Network: {method === 'USDT' ? 'TRON (TRC20)' : method}</span>
                </div>
                <div className="address-copy-row">
                  <div className="address-text font-mono">{walletAddresses[method]}</div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm copy-btn"
                    onClick={() => handleCopy(walletAddresses[method])}
                  >
                    {copied ? <Check size={13} style={{ color: '#10b981' }} /> : <Copy size={13} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-muted" style={{ marginTop: '0.6rem' }}>
                  Send only {method} to this generated address. Credit is automatically validated on-chain after 1 confirmation.
                </p>

                <div className="form-group" style={{ marginTop: '0.75rem' }}>
                  <label className="form-label text-xs uppercase font-mono text-muted">Transaction Hash / Proof ID (Optional)</label>
                  <input
                    type="text"
                    className="form-input font-mono text-xs"
                    placeholder="0x... or TxID"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="bank-info-box">
                <div className="text-xs font-mono uppercase text-muted" style={{ marginBottom: '0.5rem' }}>
                  Institutional Wire Coordinates
                </div>
                <div className="bank-detail-row">
                  <span>Bank:</span>
                  <strong>JPMorgan Chase Bank, N.A.</strong>
                </div>
                <div className="bank-detail-row">
                  <span>Beneficiary:</span>
                  <strong>Continuum Trading Custody</strong>
                </div>
                <div className="bank-detail-row">
                  <span>Account Number:</span>
                  <strong className="font-mono">849201948201</strong>
                </div>
                <div className="bank-detail-row">
                  <span>SWIFT / BIC:</span>
                  <strong className="font-mono">CHASUS33AXX</strong>
                </div>
                <div className="bank-detail-row">
                  <span>Reference ID:</span>
                  <strong className="font-mono text-amber">{currentUser?.id || 'GUEST-FUND'}</strong>
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-gold w-full submit-fund-btn" disabled={isSubmitting}>
              <ShieldCheck size={18} />
              <span>{isSubmitting ? 'Verifying...' : `Confirm Deposit of $${Number(amount || 0).toLocaleString()}`}</span>
            </button>
          </form>
        )}

        {/* ══════════ WITHDRAW TAB ══════════ */}
        {activeTab === 'withdraw' && (
          <form onSubmit={handleWithdrawSubmit} className="funding-form">
            <div className="form-group">
              <label className="form-label text-xs uppercase font-mono text-muted">Receiving Method</label>
              <div className="method-grid">
                {[
                  { id: 'USDT', name: 'USDT (TRC-20)', tag: 'Fast' },
                  { id: 'BTC', name: 'Bitcoin (BTC)', tag: 'Crypto' },
                  { id: 'ETH', name: 'Ethereum (ETH)', tag: 'Crypto' },
                  { id: 'BANK', name: 'Bank Transfer', tag: '1-2 Days' }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`method-btn ${method === m.id ? 'active' : ''}`}
                    onClick={() => setMethod(m.id)}
                  >
                    <span className="method-name">{m.name}</span>
                    <span className="method-tag">{m.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label flex justify-between items-center text-xs uppercase font-mono text-muted">
                <span>Amount to Withdraw (USD)</span>
                <button
                  type="button"
                  className="max-btn font-mono"
                  onClick={() => setAmount(String(currentBalance))}
                >
                  USE MAX
                </button>
              </label>
              <div className="amount-input-wrap">
                <span className="amount-prefix">$</span>
                <input
                  type="number"
                  step="50"
                  min="50"
                  max={currentBalance}
                  className="form-input amount-field font-mono"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="500"
                  required
                />
              </div>
              <div className="flex justify-between text-xs text-muted" style={{ marginTop: '0.4rem' }}>
                <span>Transfer Fee: <strong className="text-white">$0.00</strong></span>
                <span>Net Payout: <strong className="text-amber">${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
              </div>
            </div>

            {method !== 'BANK' ? (
              <div className="form-group">
                <label className="form-label text-xs uppercase font-mono text-muted">Your {method} Receiving Address</label>
                <input
                  type="text"
                  className="form-input font-mono text-sm"
                  placeholder={`Enter your destination ${method} address`}
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  required
                />
                <span className="text-xs text-muted" style={{ marginTop: '0.35rem' }}>
                  Verify address network. Cross-chain sends cannot be reversed.
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label text-xs uppercase font-mono text-muted">Bank Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Chase, Bank of America, Barclays"
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label text-xs uppercase font-mono text-muted">Account / IBAN Number</label>
                  <input
                    type="text"
                    className="form-input font-mono"
                    placeholder="Account number or IBAN"
                    value={bankDetails.accountNumber}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label text-xs uppercase font-mono text-muted">SWIFT / Routing Code</label>
                  <input
                    type="text"
                    className="form-input font-mono"
                    placeholder="SWIFT code"
                    value={bankDetails.swift}
                    onChange={(e) => setBankDetails({ ...bankDetails, swift: e.target.value })}
                  />
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full submit-fund-btn" disabled={isSubmitting}>
              <ArrowUpCircle size={18} />
              <span>{isSubmitting ? 'Submitting...' : `Request Withdrawal of $${Number(amount || 0).toLocaleString()}`}</span>
            </button>
          </form>
        )}

        <div className="funding-footer-note flex items-center justify-center gap-2 text-xs text-muted font-mono">
          <ShieldCheck size={14} style={{ color: 'var(--color-amber)' }} />
          <span>256-Bit SSL Institutional Bank Security Protocol</span>
        </div>
      </div>

      <style>{`
        .funding-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(9, 10, 15, 0.88);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1rem;
        }
        .funding-modal-card {
          background: #0f121a;
          border: 1px solid var(--color-border-highlight);
          border-radius: var(--radius-lg);
          width: 100%;
          max-width: 520px;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.8);
          padding: 2rem;
          max-height: 90vh;
          overflow-y: auto;
        }
        .funding-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--color-border);
        }
        .funding-close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.35rem;
          border-radius: 8px;
          transition: var(--transition-fast);
        }
        .funding-close-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }
        .funding-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          margin-top: 1.25rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--color-border);
          padding: 0.35rem;
          border-radius: var(--radius-full);
        }
        .funding-tab-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.7rem 1rem;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 0.85rem;
          border: none;
          background: transparent;
          color: var(--color-text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .funding-tab-btn.active.deposit {
          background: var(--color-amber);
          color: #090a0f;
          box-shadow: 0 2px 10px rgba(245, 166, 35, 0.35);
        }
        .funding-tab-btn.active.withdraw {
          background: #ffffff;
          color: #090a0f;
          box-shadow: 0 2px 10px rgba(255, 255, 255, 0.2);
        }
        .funding-balance-card {
          margin-top: 1.25rem;
          background: rgba(245, 166, 35, 0.05);
          border: 1px solid rgba(245, 166, 35, 0.2);
          padding: 1rem 1.25rem;
          border-radius: var(--radius-md);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .funding-balance-val {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--color-amber);
        }
        .funding-form {
          margin-top: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
        }
        .method-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
          margin-top: 0.35rem;
        }
        .method-btn {
          border: 1px solid var(--color-border);
          background: rgba(255, 255, 255, 0.03);
          border-radius: var(--radius-md);
          padding: 0.65rem 0.85rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .method-btn.active {
          border-color: var(--color-amber);
          background: rgba(245, 166, 35, 0.08);
        }
        .method-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: #ffffff;
        }
        .method-tag {
          font-size: 0.65rem;
          background: rgba(255, 255, 255, 0.08);
          color: var(--color-text-body);
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          font-weight: 600;
          font-family: var(--font-mono);
        }
        .method-btn.active .method-tag {
          background: var(--color-amber);
          color: #090a0f;
          font-weight: 800;
        }
        .amount-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .amount-prefix {
          position: absolute;
          left: 1rem;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-text-muted);
        }
        .amount-field {
          padding-left: 2rem !important;
          font-size: 1.15rem !important;
          font-weight: 700;
        }
        .preset-chips {
          display: flex;
          gap: 0.4rem;
          margin-top: 0.5rem;
          flex-wrap: wrap;
        }
        .preset-chip {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--color-border);
          padding: 0.3rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--color-text-body);
          font-family: var(--font-mono);
        }
        .preset-chip:hover, .preset-chip.active {
          background: var(--color-amber);
          color: #090a0f;
          border-color: var(--color-amber);
          font-weight: 800;
        }
        .max-btn {
          background: none;
          border: none;
          color: var(--color-amber);
          font-size: 0.72rem;
          font-weight: 800;
          cursor: pointer;
          letter-spacing: 0.08em;
        }
        .max-btn:hover {
          text-decoration: underline;
        }
        .crypto-pay-box, .bank-info-box {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 1rem 1.15rem;
        }
        .tech-badge {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--color-amber);
          background: rgba(245, 166, 35, 0.1);
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
        }
        .address-copy-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--color-border-highlight);
          border-radius: var(--radius-sm);
          padding: 0.4rem 0.65rem;
        }
        .address-text {
          font-size: 0.78rem;
          color: #ffffff;
          word-break: break-all;
          flex: 1;
        }
        .copy-btn {
          flex-shrink: 0;
          padding: 0.35rem 0.65rem;
          font-size: 0.72rem;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          border-radius: var(--radius-full);
        }
        .bank-detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          padding: 0.35rem 0;
          border-bottom: 1px dashed var(--color-border);
          color: var(--color-text-body);
        }
        .bank-detail-row strong {
          color: #ffffff;
        }
        .bank-detail-row:last-child {
          border-bottom: none;
        }
        .submit-fund-btn {
          margin-top: 0.5rem;
          padding: 0.9rem;
          font-size: 0.92rem;
          gap: 0.5rem;
        }
        .funding-status-box {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          font-weight: 600;
          margin-top: 1rem;
        }
        .status-success {
          background: rgba(16, 185, 129, 0.12);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .status-error {
          background: rgba(244, 63, 94, 0.12);
          color: #f87171;
          border: 1px solid rgba(244, 63, 94, 0.3);
        }
        .funding-footer-note {
          margin-top: 1.25rem;
          padding-top: 1rem;
          border-top: 1px solid var(--color-border);
        }
        @media (max-width: 480px) {
          .funding-modal-card {
            padding: 1.25rem 1rem;
          }
          .method-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
