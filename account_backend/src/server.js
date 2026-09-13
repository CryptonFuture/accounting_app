require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const accountsRouter = require('./routes/accounts');
const journalRouter = require('./routes/journal');
const taccountRouter = require('./routes/taccount');
const trialbalanceRouter = require('./routes/trialbalance');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/accounting';

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/accounts', accountsRouter);
app.use('/api/journal', journalRouter);
app.use('/api/taccount', taccountRouter);
app.use('/api/trial-balance', trialbalanceRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'Accounting Application API',
    version: '1.0.0',
    endpoints: {
      accounts: '/api/accounts',
      journal: '/api/journal',
      taccount: '/api/taccount/:accountId',
      trialBalance: '/api/trial-balance',
      health: '/api/health'
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// Connect to MongoDB and start server
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
