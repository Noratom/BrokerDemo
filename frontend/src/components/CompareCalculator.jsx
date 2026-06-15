import React, { useState } from 'react';
import { Percent, ArrowRightLeft, Sparkles, AlertCircle } from 'lucide-react';

export default function CompareCalculator() {
  const [loanAmount, setLoanAmount] = useState(50000); // initial margin loan size

  // Annual Margin Interest Rates
  const auraRate = 5.37; // AuraTrade premium low rate
  const competitorARate = 11.50; // standard markup broker rate
  const competitorBRate = 9.25;

  // Calculate monthly costs
  const calculateMonthlyCost = (amount, annualRate) => {
    return (amount * (annualRate / 100)) / 12;
  };

  const auraMonthly = calculateMonthlyCost(loanAmount, auraRate);
  const compAMonthly = calculateMonthlyCost(loanAmount, competitorARate);
  const compBMonthly = calculateMonthlyCost(loanAmount, competitorBRate);

  const auraAnnual = auraMonthly * 12;
  const compAAnnual = compAMonthly * 12;
  const annualSavings = compAAnnual - auraAnnual;

  return (
    <div className="card compare-calculator-card">
      <div className="calculator-header flex justify-between items-start flex-col-mobile" style={{ marginBottom: '1.5rem' }}>
        <div>
          <span className="badge flex items-center gap-2" style={{ backgroundColor: 'var(--color-blue-soft)', color: 'var(--color-blue-royal)', borderColor: 'rgba(30, 64, 175, 0.15)' }}>
            <Percent size={14} /> Low Cost Margin Loans
          </span>
          <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>Interactive Margin Rate Calculator</h3>
          <p className="text-muted text-xs" style={{ marginTop: '0.25rem' }}>
            Enter your desired margin debt amount to see how much interest you save annually with our raw pricing model.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 flex-col-mobile">
        {/* Sliders Control */}
        <div className="calculator-controls flex flex-col justify-center">
          <div className="form-group">
            <div className="flex justify-between items-baseline">
              <span className="form-label">Margin Loan / Borrow Size</span>
              <strong className="font-mono text-blue" style={{ fontSize: '1.35rem', color: 'var(--color-blue-royal)' }}>
                ${loanAmount.toLocaleString()}
              </strong>
            </div>
            <input
              type="range"
              min="5000"
              max="500000"
              step="5000"
              className="calc-range-slider"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
            />
            <div className="flex justify-between text-xxs text-muted" style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>
              <span>$5,000</span>
              <span>$250,000</span>
              <span>$500,000</span>
            </div>
          </div>

          <div className="savings-highlight-panel flex items-center gap-4">
            <Sparkles className="text-gold animate-bounce" size={28} />
            <div>
              <span className="text-xs text-muted block font-label uppercase">Your Annual Savings</span>
              <h4 className="savings-val text-gold">${annualSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })} / year</h4>
            </div>
          </div>
        </div>

        {/* Cost Matrix Outputs */}
        <div className="calculator-outputs flex flex-col gap-4">
          <h4 className="text-xs text-muted font-label uppercase" style={{ letterSpacing: '0.05em' }}>Margin Interest Comparison</h4>
          
          <div className="output-rows flex flex-col gap-3">
            {/* AuraTrade Row */}
            <div className="output-row aura-row flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rate-badge bg-gold">{auraRate}%</div>
                <div>
                  <strong className="text-dark block" style={{ fontSize: '0.9rem' }}>AuraTrade Raw ECN</strong>
                  <span className="text-xxs text-muted" style={{ fontSize: '0.7rem' }}>Benchmark + 1.5% markup</span>
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="monthly-cost-val block">${auraMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo</span>
                <span className="annual-cost-val text-muted text-xxs">${auraAnnual.toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr</span>
              </div>
            </div>

            {/* Competitor A Row */}
            <div className="output-row flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rate-badge bg-muted">{competitorARate}%</div>
                <div>
                  <strong className="text-dark block" style={{ fontSize: '0.9rem' }}>Competitor A (Retail Broker)</strong>
                  <span className="text-xxs text-muted" style={{ fontSize: '0.7rem' }}>Standard industry markup rate</span>
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="monthly-cost-val block">${compAMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo</span>
                <span className="annual-cost-val text-muted text-xxs">${(compAMonthly*12).toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr</span>
              </div>
            </div>

            {/* Competitor B Row */}
            <div className="output-row flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rate-badge bg-muted">{competitorBRate}%</div>
                <div>
                  <strong className="text-dark block" style={{ fontSize: '0.9rem' }}>Competitor B</strong>
                  <span className="text-xxs text-muted" style={{ fontSize: '0.7rem' }}>Premium platform markup</span>
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="monthly-cost-val block">${compBMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo</span>
                <span className="annual-cost-val text-muted text-xxs">${(compBMonthly*12).toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xxs text-muted margin-disclaimer" style={{ fontSize: '0.7rem', marginTop: '1.5rem', borderTop: '1px solid var(--color-border-light)', paddingTop: '0.75rem' }}>
        <AlertCircle size={12} className="text-muted" />
        <span>Margin rates are variable based on Fed benchmark rates. AuraTrade margin loans are only available to verified retail accounts with positive equity values.</span>
      </div>

      <style>{`
        .compare-calculator-card {
          padding: 2.25rem;
          background-color: var(--color-white);
          border: 1px solid var(--color-border-light);
        }
        .compare-calculator-card:hover {
          transform: none;
          box-shadow: var(--shadow-md);
        }
        .calc-range-slider {
          width: 100%;
          margin: 0.75rem 0 0.25rem 0;
          accent-color: var(--color-blue-royal);
          cursor: pointer;
        }
        .savings-highlight-panel {
          background-color: var(--color-gold-light);
          border: 1px solid var(--color-gold-border);
          border-radius: var(--radius-md);
          padding: 1rem;
          margin-top: 1.5rem;
        }
        .savings-val {
          font-size: 1.6rem;
          font-weight: 800;
        }
        .output-row {
          border: 1px solid var(--color-border-light);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          background-color: var(--color-bg);
        }
        .aura-row {
          background-color: var(--color-blue-soft);
          border-color: rgba(30, 64, 175, 0.15);
        }
        .rate-badge {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--color-white);
        }
        .rate-badge.bg-gold {
          background-color: var(--color-gold);
        }
        .rate-badge.bg-muted {
          background-color: var(--color-text-muted);
          opacity: 0.7;
        }
        .monthly-cost-val {
          font-weight: 700;
          color: var(--color-blue-deep);
          font-size: 0.95rem;
        }
        .animate-bounce {
          animation: bounce 1.5s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .text-blue {
          color: var(--color-blue-royal);
        }
      `}</style>
    </div>
  );
}
