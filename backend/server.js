import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Continuum Trading Institutional Broker API Server is running!' });
});

// In-memory Mock Database
let users = [
  { 
    id: 'user_1', 
    name: 'Alexander Wright', 
    email: 'client@continuum-trading.com', 
    password: 'client123', 
    balance: 15000.00, 
    role: 'client',
    accountNumber: 'CT-892104-LIVE',
    accountType: 'Institutional Raw ECN',
    leverage: '1:100',
    currency: 'USD',
    server: 'CT-LD4 London',
    kycStatus: 'verified'
  },
  { 
    id: 'user_admin', 
    name: 'Chief Compliance Officer', 
    email: 'admin@continuum-trading.com', 
    password: 'admin123', 
    balance: 0.00, 
    role: 'admin' 
  }
];

let markets = [
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', type: 'forex', price: 1.0854, spread: 0.0001, change: 0.12 },
  { symbol: 'GBP/USD', name: 'Pound / US Dollar', type: 'forex', price: 1.2732, spread: 0.0002, change: -0.05 },
  { symbol: 'USD/JPY', name: 'US Dollar / Yen', type: 'forex', price: 157.45, spread: 0.01, change: 0.28 },
  { symbol: 'BTC/USD', name: 'Bitcoin / US Dollar', type: 'crypto', price: 68420.50, spread: 5.00, change: 2.45 },
  { symbol: 'ETH/USD', name: 'Ethereum / US Dollar', type: 'crypto', price: 3542.20, spread: 0.50, change: 1.88 },
  { symbol: 'GOLD', name: 'Gold Spot', type: 'commodity', price: 2324.80, spread: 0.25, change: -0.42 },
  { symbol: 'OIL', name: 'Crude Oil', type: 'commodity', price: 78.45, spread: 0.03, change: 0.95 }
];

let trades = [];
let contactMessages = [];
let investments = [
  {
    id: 'INV-BRZ9182',
    userId: 'user_1',
    planName: 'Bronze',
    amount: 1000,
    roiPercent: 20,
    targetReturn: 1200,
    durationHours: 24,
    startDate: new Date(Date.now() - 1000 * 3600 * 18).toISOString(),
    endDate: new Date(Date.now() + 1000 * 3600 * 6).toISOString(),
    status: 'ACTIVE'
  }
];
let kycApplications = [
  {
    id: 'KYC-APP-8821',
    userId: 'user_1',
    userName: 'Alexander Wright',
    userEmail: 'client@continuum-trading.com',
    accountNumber: 'CT-892104-LIVE',
    idType: 'Passport',
    idNumber: 'P89214772',
    idDocName: 'alexander_wright_passport.jpg',
    idDocData: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=60',
    addressType: 'Bank Statement',
    addressDocName: 'barclays_statement_nov2026.pdf',
    addressDocData: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60',
    status: 'verified',
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000).toISOString(),
    reviewedBy: 'Compliance Desk'
  }
];
let walletTransactions = [
  {
    id: 'DEP-INIT01',
    userId: 'user_1',
    type: 'DEPOSIT',
    method: 'USDT (TRC20)',
    amount: 15000,
    status: 'COMPLETED',
    timestamp: new Date().toISOString()
  }
];

// Helper to simulate live market price ticking/drift
const tickPrices = () => {
  markets = markets.map(m => {
    // Determine tick range based on asset price magnitude
    const magnitude = m.price;
    const maxChange = magnitude * 0.0005; // 0.05% max tick change
    const delta = (Math.random() - 0.5) * maxChange;
    const newPrice = Math.max(0.0001, magnitude + delta);
    
    // Smooth 24h change drift
    const changeDelta = (Math.random() - 0.5) * 0.1;
    const newChange = Number((m.change + changeDelta).toFixed(2));

    // Keep formatting clean based on price
    let decimals = 4;
    if (m.symbol.includes('JPY') || m.symbol === 'OIL' || m.symbol === 'GOLD' || m.symbol.includes('BTC') || m.symbol.includes('ETH')) decimals = 2;

    return {
      ...m,
      price: Number(newPrice.toFixed(decimals)),
      change: newChange
    };
  });
};

// Tick the market prices every 3 seconds in the background
setInterval(tickPrices, 3000);

// ==========================================
// AUTOMATED PASSIVE RETURN ACCRUAL ENGINE
// ==========================================
const processInvestmentAccruals = () => {
  const now = Date.now();
  investments.forEach(inv => {
    if (inv.status === 'ACTIVE') {
      const start = new Date(inv.startDate).getTime();
      const end = new Date(inv.endDate).getTime();
      
      // Auto-maturity check
      if (now >= end) {
        inv.status = 'COMPLETED';
        const user = users.find(u => u.id === inv.userId);
        if (user) {
          user.balance = Number((user.balance + inv.targetReturn).toFixed(2));
          walletTransactions.unshift({
            id: `PAY-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
            userId: inv.userId,
            type: 'PAYOUT',
            method: `${inv.planName} Plan Return`,
            amount: inv.targetReturn,
            status: 'COMPLETED',
            timestamp: new Date().toISOString()
          });
          console.log(`Investment ${inv.id} matured! Paid out ${inv.targetReturn} to ${user.name}`);
        }
      }
    }
  });
};
setInterval(processInvestmentAccruals, 10000);


// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, startingBalance } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ status: 'error', message: 'Missing required details.' });
  }

  const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (userExists) {
    return res.status(400).json({ status: 'error', message: 'An account with this email already exists.' });
  }

  const newUser = {
    id: `user_${Math.random().toString(36).substr(2, 9)}`,
    name,
    email,
    password, // note: plain text for mock simulation prototype
    balance: Number(startingBalance) || 10000.00,
    role: 'client'
  };

  users.push(newUser);
  res.status(201).json({ status: 'success', data: { id: newUser.id, name: newUser.name, email: newUser.email, balance: newUser.balance, role: newUser.role } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: 'error', message: 'Email and password required.' });
  }

  const normalizedEmail = email.toLowerCase().replace('@auratrade.com', '@continuum-trading.com');
  const user = users.find(u => (u.email.toLowerCase() === normalizedEmail || u.email.toLowerCase() === email.toLowerCase()) && u.password === password);
  if (!user) {
    return res.status(401).json({ status: 'error', message: 'Invalid credentials. Please try again.' });
  }

  res.json({
    status: 'success',
    data: { 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      balance: user.balance, 
      role: user.role,
      accountNumber: user.accountNumber || 'CT-892104-LIVE',
      accountType: user.accountType || 'Institutional Raw ECN',
      leverage: user.leverage || '1:100',
      currency: user.currency || 'USD',
      server: user.server || 'CT-LD4 London',
      kycStatus: user.kycStatus || 'verified'
    }
  });
});

// Fetch user status details (to sync balance)
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ status: 'error', message: 'User not found.' });
  }
  res.json({
    status: 'success',
    data: { id: user.id, name: user.name, email: user.email, balance: user.balance, role: user.role }
  });
});

// ==========================================
// MARKET RATES & HISTORICAL DATA ROUTES
// ==========================================

app.get('/api/markets', (req, res) => {
  res.json({
    status: 'success',
    data: markets,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/markets/history/:symbol', (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const market = markets.find(m => m.symbol.toUpperCase() === symbol);
  
  if (!market) {
    return res.status(404).json({ status: 'error', message: 'Asset not found' });
  }

  const points = 20;
  let currentVal = market.price;
  const history = [];
  const baseTime = Date.now() - (points * 60 * 1000);

  for (let i = 0; i < points; i++) {
    const changePercent = (Math.random() - 0.48) * 0.001; 
    currentVal = currentVal * (1 + changePercent);
    history.push({
      time: new Date(baseTime + (i * 60 * 1000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: Number(currentVal.toFixed(market.symbol.includes('JPY') || market.symbol === 'OIL' || market.symbol === 'GOLD' || market.symbol.includes('BTC') || market.symbol.includes('ETH') ? 2 : 4))
    });
  }

  res.json({
    status: 'success',
    symbol: market.symbol,
    history
  });
});

// ==========================================
// TRADING LOGIC ROUTES (USER SPECIFIC)
// ==========================================

app.post('/api/trades', (req, res) => {
  const { symbol, type, size, entryPrice, userId } = req.body;

  if (!symbol || !type || !size || !entryPrice || !userId) {
    return res.status(400).json({ status: 'error', message: 'Missing order details.' });
  }

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ status: 'error', message: 'User profile not found.' });
  }

  const market = markets.find(m => m.symbol.toUpperCase() === symbol.toUpperCase());
  if (!market) {
    return res.status(404).json({ status: 'error', message: 'Asset not found' });
  }

  const newTrade = {
    id: `trade_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    symbol: market.symbol,
    type,
    size: Number(size),
    entryPrice: Number(entryPrice),
    currentPrice: market.price,
    timestamp: new Date().toISOString(),
    status: 'OPEN'
  };

  trades.push(newTrade);
  res.status(201).json({ status: 'success', data: newTrade });
});

// Get active trades of a user
app.get('/api/trades/:userId', (req, res) => {
  const userId = req.params.userId;
  const userTrades = trades.filter(t => t.userId === userId);

  // Sync current price feeds
  const updatedTrades = userTrades.map(t => {
    const market = markets.find(m => m.symbol === t.symbol);
    if (market) {
      t.currentPrice = market.price;
    }
    return t;
  });

  res.json({ status: 'success', data: updatedTrades });
});

app.post('/api/trades/close/:id', (req, res) => {
  const tradeId = req.params.id;
  const tradeIndex = trades.findIndex(t => t.id === tradeId);

  if (tradeIndex === -1) {
    return res.status(404).json({ status: 'error', message: 'Trade not found.' });
  }

  const trade = trades[tradeIndex];
  const user = users.find(u => u.id === trade.userId);
  if (!user) {
    return res.status(404).json({ status: 'error', message: 'User not found for this position.' });
  }

  const market = markets.find(m => m.symbol === trade.symbol);
  const exitPrice = market ? market.price : trade.currentPrice;

  // Calculate profit
  let multiplier = 1;
  if (trade.symbol.includes('/') && !trade.symbol.includes('BTC') && !trade.symbol.includes('ETH')) {
    multiplier = 100000;
  }

  let profit = 0;
  if (trade.type === 'BUY') {
    profit = (exitPrice - trade.entryPrice) * trade.size * multiplier;
  } else {
    profit = (trade.entryPrice - exitPrice) * trade.size * multiplier;
  }

  if (trade.symbol.includes('JPY')) {
    profit = profit / 157.0; 
  }

  profit = Number(profit.toFixed(2));

  // Update user balance
  user.balance = Number((user.balance + profit).toFixed(2));

  // Remove trade from active list
  trades.splice(tradeIndex, 1);

  res.json({
    status: 'success',
    data: {
      ...trade,
      status: 'CLOSED',
      exitPrice,
      profit,
      newBalance: user.balance,
      closedAt: new Date().toISOString()
    }
  });
});

// ==========================================
// CONTACT / SUPPORT ROUTES
// ==========================================

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ status: 'error', message: 'Please provide name, email, and message.' });
  }

  const newMessage = {
    id: `msg_${Math.random().toString(36).substr(2, 9)}`,
    name,
    email,
    subject: subject || 'General Query',
    message,
    timestamp: new Date().toISOString()
  };

  contactMessages.push(newMessage);
  res.json({ status: 'success', message: 'Message logged. Support will contact you shortly.' });
});

// ==========================================
// WALLET / FUNDING ROUTES (DEPOSIT & WITHDRAW)
// ==========================================

// Get user transactions
app.get('/api/wallet/transactions/:userId', (req, res) => {
  const list = walletTransactions.filter(t => t.userId === req.params.userId);
  res.json({ status: 'success', data: list });
});

// Process Deposit
app.post('/api/wallet/deposit', (req, res) => {
  const { userId, amount, method, txHash } = req.body;
  const numAmount = parseFloat(amount);

  if (!numAmount || numAmount <= 0) {
    return res.status(400).json({ status: 'error', message: 'Invalid deposit amount.' });
  }

  const user = users.find(u => u.id === userId);
  if (!user && userId !== 'guest') {
    return res.status(404).json({ status: 'error', message: 'User not found.' });
  }

  const newTx = {
    id: `DEP-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    userId: userId || 'guest',
    type: 'DEPOSIT',
    method: method || 'USDT (TRC20)',
    amount: numAmount,
    txHash: txHash || `0x${Math.random().toString(16).substr(2, 24)}`,
    status: 'COMPLETED',
    timestamp: new Date().toISOString()
  };

  walletTransactions.unshift(newTx);

  if (user) {
    user.balance = Number((user.balance + numAmount).toFixed(2));
  }

  res.status(201).json({
    status: 'success',
    data: {
      transaction: newTx,
      newBalance: user ? user.balance : numAmount
    }
  });
});

// Process Withdrawal Request
app.post('/api/wallet/withdraw', (req, res) => {
  const { userId, amount, method, destination } = req.body;
  const numAmount = parseFloat(amount);

  if (!numAmount || numAmount <= 0) {
    return res.status(400).json({ status: 'error', message: 'Invalid withdrawal amount.' });
  }

  const user = users.find(u => u.id === userId);
  if (!user && userId !== 'guest') {
    return res.status(404).json({ status: 'error', message: 'User not found.' });
  }

  if (user && user.balance < numAmount) {
    return res.status(400).json({ status: 'error', message: 'Insufficient funds.' });
  }

  if (user) {
    user.balance = Number((user.balance - numAmount).toFixed(2));
  }

  const newTx = {
    id: `WTH-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    userId: userId || 'guest',
    type: 'WITHDRAWAL',
    method: method || 'USDT',
    amount: numAmount,
    destination: destination || 'Direct Transfer',
    status: 'PENDING',
    timestamp: new Date().toISOString()
  };

  walletTransactions.unshift(newTx);

  res.status(201).json({
    status: 'success',
    data: {
      transaction: newTx,
      newBalance: user ? user.balance : 0
    }
  });
});

// Admin endpoint to view all transactions
app.get('/api/admin/transactions', (req, res) => {
  const populated = walletTransactions.map(tx => {
    const user = users.find(u => u.id === tx.userId);
    return { ...tx, userEmail: user ? user.email : 'Guest / External' };
  });
  res.json({ status: 'success', data: populated });
});

// Admin endpoint to update transaction status
app.post('/api/admin/transactions/:id/status', (req, res) => {
  const { status } = req.body;
  const tx = walletTransactions.find(t => t.id === req.params.id);
  if (!tx) {
    return res.status(404).json({ status: 'error', message: 'Transaction not found.' });
  }
  tx.status = status;
  res.json({ status: 'success', data: tx });
});


// ==========================================
// INVESTMENT PLANS ACCRUAL ROUTES
// ==========================================

// Get user investments with live accrued profit calculation
app.get('/api/investments/:userId', (req, res) => {
  const { userId } = req.params;
  const now = Date.now();

  const userInvs = investments
    .filter(inv => inv.userId === userId || userId === 'all')
    .map(inv => {
      const start = new Date(inv.startDate).getTime();
      const end = new Date(inv.endDate).getTime();
      const duration = end - start || 1;
      const elapsed = Math.max(0, now - start);
      const progress = Math.min(100, Math.floor((elapsed / duration) * 100));

      const totalProfit = inv.targetReturn - inv.amount;
      const accruedProfit = inv.status === 'COMPLETED' 
        ? totalProfit 
        : Number((totalProfit * (progress / 100)).toFixed(2));

      const msRemaining = Math.max(0, end - now);
      const hoursRemaining = Math.floor(msRemaining / (1000 * 3600));
      const minsRemaining = Math.floor((msRemaining % (1000 * 3600)) / (1000 * 60));

      return {
        ...inv,
        progress,
        accruedProfit,
        totalProfit,
        timeRemainingFormatted: `${hoursRemaining}h ${minsRemaining}m`
      };
    });

  res.json({ status: 'success', data: userInvs });
});

// Create a new investment contract
app.post('/api/investments/create', (req, res) => {
  const { userId, planName, amount, roiPercent, durationHours } = req.body;
  const numAmount = parseFloat(amount);

  if (!userId || !numAmount || numAmount <= 0) {
    return res.status(400).json({ status: 'error', message: 'Valid user ID and investment amount required.' });
  }

  const user = users.find(u => u.id === userId);
  if (!user && userId !== 'guest') {
    return res.status(404).json({ status: 'error', message: 'Client profile not found.' });
  }

  if (user && user.balance < numAmount) {
    return res.status(400).json({ status: 'error', message: 'Insufficient funds. Please deposit into your wallet first.' });
  }

  // Deduct balance
  if (user) {
    user.balance = Number((user.balance - numAmount).toFixed(2));
  }

  const numHours = parseInt(durationHours) || (planName === 'Premium' ? 72 : planName === 'Silver' ? 48 : 24);
  const numRoi = parseFloat(roiPercent) || (planName === 'Premium' ? 60 : planName === 'Silver' ? 40 : 20);
  const targetReturn = Number((numAmount * (1 + numRoi / 100)).toFixed(2));

  const newInv = {
    id: `INV-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    userId: userId || 'guest',
    planName: planName || 'Bronze',
    amount: numAmount,
    roiPercent: numRoi,
    targetReturn: targetReturn,
    durationHours: numHours,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + numHours * 3600 * 1000).toISOString(),
    status: 'ACTIVE'
  };

  investments.unshift(newInv);

  // Record allocation transaction
  walletTransactions.unshift({
    id: `ALLOC-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    userId: userId || 'guest',
    type: 'INVESTMENT',
    method: `${planName} Plan Allocation`,
    amount: numAmount,
    status: 'COMPLETED',
    timestamp: new Date().toISOString()
  });

  res.status(201).json({
    status: 'success',
    data: newInv,
    newBalance: user ? user.balance : 10000
  });
});

// ==========================================
// KYC & REGULATORY COMPLIANCE ROUTES
// ==========================================

// Get user KYC status and details
app.get('/api/kyc/:userId', (req, res) => {
  const { userId } = req.params;
  const user = users.find(u => u.id === userId);
  const application = kycApplications.find(k => k.userId === userId);

  res.json({
    status: 'success',
    data: {
      kycStatus: user ? user.kycStatus : 'unverified',
      application: application || null
    }
  });
});

// Submit KYC documents
app.post('/api/kyc/submit', (req, res) => {
  const { userId, idType, idNumber, idDocName, idDocData, addressType, addressDocName, addressDocData } = req.body;

  if (!userId || !idDocName || !addressDocName) {
    return res.status(400).json({ status: 'error', message: 'Identity and residential documents required.' });
  }

  const user = users.find(u => u.id === userId);
  if (user) {
    user.kycStatus = 'pending';
  }

  const existingIdx = kycApplications.findIndex(k => k.userId === userId);
  const appData = {
    id: existingIdx !== -1 ? kycApplications[existingIdx].id : `KYC-APP-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    userId,
    userName: user ? user.name : 'Client',
    userEmail: user ? user.email : 'Unknown',
    accountNumber: user ? user.accountNumber : 'CT-LIVE',
    idType: idType || 'National ID / Passport',
    idNumber: idNumber || 'N/A',
    idDocName,
    idDocData: idDocData || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=60',
    addressType: addressType || 'Bank Statement / Utility Bill',
    addressDocName,
    addressDocData: addressDocData || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60',
    status: 'pending',
    submittedAt: new Date().toISOString()
  };

  if (existingIdx !== -1) {
    kycApplications[existingIdx] = appData;
  } else {
    kycApplications.unshift(appData);
  }

  res.status(201).json({ status: 'success', data: appData });
});

// Admin: Get all KYC applications
app.get('/api/admin/kyc', (req, res) => {
  res.json({ status: 'success', data: kycApplications });
});

// Admin: Review KYC application (approve / reject)
app.post('/api/admin/kyc/:id/review', (req, res) => {
  const { status, notes } = req.body;
  const app = kycApplications.find(k => k.id === req.params.id);

  if (!app) {
    return res.status(404).json({ status: 'error', message: 'KYC application not found.' });
  }

  app.status = status; // 'verified' | 'rejected'
  app.reviewedAt = new Date().toISOString();
  app.notes = notes || '';
  app.reviewedBy = 'Compliance Officer';

  const user = users.find(u => u.id === app.userId);
  if (user) {
    user.kycStatus = status;
  }

  res.json({ status: 'success', data: app });
});

// ==========================================
// ADMINISTRATOR API ROUTES
// ==========================================

// Get all system users
app.get('/api/admin/users', (req, res) => {
  res.json({ status: 'success', data: users });
});

// Adjust client balance
app.post('/api/admin/users/adjust-balance', (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || amount === undefined) {
    return res.status(400).json({ status: 'error', message: 'Missing userId or adjustment amount.' });
  }

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ status: 'error', message: 'Client profile not found.' });
  }

  user.balance = Number((user.balance + Number(amount)).toFixed(2));
  res.json({ status: 'success', data: user });
});

// Set client balance directly (used by Admin Control Panel)
app.post('/api/admin/balance', (req, res) => {
  const { userId, newBalance } = req.body;

  if (!userId || newBalance === undefined) {
    return res.status(400).json({ status: 'error', message: 'Missing userId or newBalance.' });
  }

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ status: 'error', message: 'Client profile not found.' });
  }

  user.balance = Number(newBalance);
  res.json({ status: 'success', data: user });
});

// Get all trades across all users
app.get('/api/admin/trades', (req, res) => {
  const updatedTrades = trades.map(t => {
    const market = markets.find(m => m.symbol === t.symbol);
    if (market) {
      t.currentPrice = market.price;
    }
    // Append client email for admin audit visibility
    const user = users.find(u => u.id === t.userId);
    t.clientEmail = user ? user.email : 'Unknown Client';
    return t;
  });
  res.json({ status: 'success', data: updatedTrades });
});

// Get support messages list
app.get('/api/admin/messages', (req, res) => {
  res.json({ status: 'success', data: contactMessages });
});

// Manually override market rates (Market Control)
app.post('/api/admin/markets/override', (req, res) => {
  const { symbol, price } = req.body;

  if (!symbol || price === undefined) {
    return res.status(400).json({ status: 'error', message: 'Symbol and target override price required.' });
  }

  const index = markets.findIndex(m => m.symbol.toUpperCase() === symbol.toUpperCase());
  if (index === -1) {
    return res.status(404).json({ status: 'error', message: 'Asset symbol not found.' });
  }

  const overrideValue = Number(price);
  markets[index].price = overrideValue;
  // Recalculate basic change
  markets[index].change = Number(((Math.random() - 0.5) * 5).toFixed(2));

  res.json({ status: 'success', message: `${symbol} overridden to $${overrideValue}`, data: markets[index] });
});

app.listen(PORT, () => {
  console.log(`Continuum Trading Institutional Broker API Server running on port ${PORT}`);
});
