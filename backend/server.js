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

// In-memory Mock Database
let users = [
  { id: 'user_1', name: 'Demo Client', email: 'client@auratrade.com', password: 'client123', balance: 15000.00, role: 'client' },
  { id: 'user_admin', name: 'System Admin', email: 'admin@auratrade.com', password: 'admin123', balance: 0.00, role: 'admin' }
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

  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) {
    return res.status(401).json({ status: 'error', message: 'Invalid credentials. Please try again.' });
  }

  res.json({
    status: 'success',
    data: { id: user.id, name: user.name, email: user.email, balance: user.balance, role: user.role }
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
  console.log(`AuraTrade Mock Broker API Server running on port ${PORT}`);
});
