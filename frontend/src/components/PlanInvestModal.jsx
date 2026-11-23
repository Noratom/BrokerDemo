import React, { useState } from 'react';
import { X, TrendingUp, DollarSign, Clock, ShieldCheck, ArrowRight, AlertCircle, Plus, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function PlanInvestModal({ isOpen, onClose, selectedPlan, currentUser, onInvestSuccess, onOpenFunding, onOpenAuth }) {
  if (!isOpen || !selectedPlan) return null;

  const minRaw = parseFloat(selectedPlan.minRaw || '500');
  const [amount, setAmount] = useState(String(minRaw));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const numAmount = parseFloat(amount) || 0;
  const roiNum = parseFloat(selectedPlan.roi) || (selectedPlan.name === 'Premium' ? 60 : selectedPlan.name === 'Silver' ? 40 : 20);
  const projectedProfit = (numAmount * (roiNum / 100));
  const targetReturn = numAmount + projectedProfit;

  const currentBalance = currentUser ? currentUser.balance : 0;
  const hasSufficientBalance = currentUser && currentBalance >= numAmount;

  const handleQuickAmount = (val) => {
    setAmount(String(val));
    setErrorMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      onClose();
      onOpenAuth();
      return;
    }

    if (numAmount < minRaw) {
      setErrorMsg(`Minimum allocation for ${selectedPlan.name} is $${minRaw.toLocaleString()}.`);
      return;
    }

    if (!hasSufficientBalance) {
      setErrorMsg('Insufficient balance. Please deposit funds into your wallet first.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const durationHours = selectedPlan.name === 'Premium' ? 72 : selectedPlan.name === 'Silver' ? 48 : 24;

    try {
      const response = await fetch(`${API_BASE_URL}/api/investments/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          planName: selectedPlan.name,
          amount: numAmount,
          roiPercent: roiNum,
          durationHours
        })
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessMsg(`Successfully allocated $${numAmount.toLocaleString()} to ${selectedPlan.name} Plan!`);
        if (onInvestSuccess) {
          onInvestSuccess(result.data, result.newBalance);
        }
        setTimeout(() => {
          onClose();
          setSuccessMsg(null);
        }, 1800);
      } else {
        const err = await response.json();
        // Fallback local persistence if offline
        fallbackLocalInvestment(numAmount, roiNum, durationHours);
      }
    } catch (e) {
      fallbackLocalInvestment(numAmount, roiNum, durationHours);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fallbackLocalInvestment = (amt, roi, hours) => {
    const newInv = {
      id: `INV-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      userId: currentUser?.id || 'guest',
      planName: selectedPlan.name,
      amount: amt,
      roiPercent: roi,
      targetReturn: Number((amt * (1 + roi / 100)).toFixed(2)),
      durationHours: hours,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + hours * 3600 * 1000).toISOString(),
      status: 'ACTIVE'
    };

    const savedInvs = JSON.parse(localStorage.getItem('ct_investments') || '[]');
    savedInvs.unshift(newInv);
    localStorage.setItem('ct_investments', JSON.stringify(savedInvs));

    if (currentUser) {
      const newBal = Number((currentUser.balance - amt).toFixed(2));
      currentUser.balance = newBal;
      localStorage.setItem('ct_current_user', JSON.stringify(currentUser));
      if (onInvestSuccess) onInvestSuccess(newInv, newBal);
    }

    setSuccessMsg(`Allocated $${amt.toLocaleString()} to ${selectedPlan.name} Plan!`);
    setTimeout(() => {
      onClose();
      setSuccessMsg(null);
    }, 1800);
  };

  return (
    <div className="modal-overlay flex items-center justify-center">
      <div className="plan-invest-modal card">
        {/* Header */}
        <div className="modal-top flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="plan-icon-chip">
              <TrendingUp size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="modal-title font-mono">{selectedPlan.name} Plan</h3>
                <span className="type-tag tag-buy" style={{ fontSize: '0.7rem' }}>
                  +{selectedPlan.roi} TARGET
                </span>
              </div>
              <span className="text-xs text-muted">Cycle Duration: {selectedPlan.duration}</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Success or Error alert */}
        {successMsg && (
          <div className="notif-box notif-success flex items-center gap-2 text-xs" style={{ margin: '1rem 0' }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="notif-box notif-error flex items-center gap-2 text-xs" style={{ margin: '1rem 0' }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: '1.25rem' }}>
          {/* Amount input */}
          <div className="form-group">
            <div className="flex justify-between items-center" style={{ marginBottom: '0.4rem' }}>
              <label className="form-label font-mono text-xs">ALLOCATION CAPITAL (USD)</label>
              {currentUser && (
                <span className="text-xs font-mono" style={{ color: hasSufficientBalance ? '#94a3b8' : '#ef4444' }}>
                  Wallet: ${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              )}
            </div>

            <div className="input-wrapper">
              <DollarSign size={18} className="input-icon" />
              <input
                type="number"
                min={minRaw}
                step="100"
                required
                className="form-input form-input-icon font-mono text-lg"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrorMsg(null);
                }}
              />
            </div>

            {/* Quick presets */}
            <div className="flex gap-2 flex-wrap" style={{ marginTop: '0.65rem' }}>
              {[minRaw, minRaw * 2, minRaw * 5, minRaw * 10].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`btn-quick-preset font-mono ${numAmount === preset ? 'active' : ''}`}
                  onClick={() => handleQuickAmount(preset)}
                >
                  ${preset.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Projected Yield Breakdown Card */}
          <div className="yield-summary-card font-mono text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-muted">Principal Deposit:</span>
              <strong className="text-white">${numAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-muted">Target Return ({selectedPlan.roi}):</span>
              <strong style={{ color: 'var(--color-amber)' }}>+${projectedProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-white/5" style={{ marginTop: '0.4rem', paddingTop: '0.5rem' }}>
              <span style={{ color: '#ffffff', fontWeight: 600 }}>Total Maturity Payout:</span>
              <strong style={{ color: '#10b981', fontSize: '1rem' }}>
                ${targetReturn.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </strong>
            </div>
          </div>

          {/* Insufficient balance top-up prompt */}
          {currentUser && !hasSufficientBalance && (
            <div className="balance-warning-box flex items-center justify-between" style={{ margin: '1rem 0' }}>
              <div className="flex items-center gap-2 text-xs" style={{ color: '#fca5a5' }}>
                <AlertCircle size={15} />
                <span>You need ${Math.max(0, numAmount - currentBalance).toLocaleString()} more to invest.</span>
              </div>
              <button
                type="button"
                className="btn btn-gold btn-sm flex items-center gap-1 font-mono"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                onClick={() => {
                  onClose();
                  onOpenFunding('deposit', String(Math.max(0, numAmount - currentBalance)));
                }}
              >
                <Plus size={12} /> Deposit
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3" style={{ marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary w-full" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            {currentUser ? (
              <button
                type="submit"
                className="btn btn-gold w-full flex items-center justify-center gap-2"
                disabled={isSubmitting || !hasSufficientBalance}
              >
                {isSubmitting ? (
                  <span>Allocating...</span>
                ) : (
                  <>
                    <span>Confirm Allocation</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary w-full flex items-center justify-center gap-2"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
              >
                <span>Sign In to Invest</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(4, 5, 8, 0.82);
          backdrop-filter: blur(8px);
          z-index: 2100;
          padding: 1.5rem;
        }
        .plan-invest-modal {
          background: #0e111a;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          width: 100%;
          max-width: 460px;
          padding: 2rem;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.65);
          animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .plan-icon-chip {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(245, 166, 35, 0.15);
          color: var(--color-amber);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-close-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 0.35rem;
          border-radius: 6px;
        }
        .modal-close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }
        .btn-quick-preset {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--color-border);
          color: #94a3b8;
          padding: 0.35rem 0.65rem;
          border-radius: 6px;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-quick-preset:hover,
        .btn-quick-preset.active {
          border-color: var(--color-amber);
          color: #ffffff;
          background: rgba(245, 166, 35, 0.12);
        }
        .yield-summary-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 1rem 1.25rem;
          margin-top: 1.25rem;
        }
        .balance-warning-box {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 8px;
          padding: 0.65rem 0.85rem;
        }
      `}</style>
    </div>
  );
}
