// Express server entry point — connects MongoDB with resilience, mounts routes, starts listening
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const analysisRoutes = require('./routes/analysis');
const queryRoutes = require('./routes/query');

const app = express();
const PORT = process.env.PORT || 5000;
const isDatabaseReady = () => mongoose.connection.readyState === 1;
const FALLBACK_MONGODB_URI = 'mongodb://127.0.0.1:27017/legal-copilot';

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isDatabaseReady() ? 'connected' : 'not_connected',
    timestamp: new Date().toISOString()
  });
});

// Surface database connectivity problems as API responses instead of browser network failures.
app.use('/api', (req, res, next) => {
  if (req.path === '/health') {
    return next();
  }

  if (!isDatabaseReady()) {
    return res.status(503).json({ error: 'Database connection not ready. Please try again shortly.' });
  }

  return next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/query', queryRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

// Start server immediately so the API stays reachable even if MongoDB is unavailable.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ── MongoDB connection with retry logic and event listeners ──
const MONGO_OPTIONS = {
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
};

const connectToMongo = async (retryCount = 0) => {
  const MAX_RETRIES = 3;
  const primaryUri = process.env.MONGODB_URI;

  try {
    if (!primaryUri) {
      throw new Error('MONGODB_URI is not set');
    }

    await mongoose.connect(primaryUri, MONGO_OPTIONS);
    console.log('Connected to MongoDB');
    return;
  } catch (primaryError) {
    console.error('MongoDB connection error:', primaryError.message);

    if (primaryUri === FALLBACK_MONGODB_URI) {
      if (retryCount < MAX_RETRIES) {
        const waitMs = Math.min(2000 * Math.pow(2, retryCount), 10000);
        console.log(`Retrying MongoDB connection in ${waitMs / 1000}s (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, waitMs));
        return connectToMongo(retryCount + 1);
      }
      return;
    }

    try {
      await mongoose.connect(FALLBACK_MONGODB_URI, MONGO_OPTIONS);
      console.log('Connected to local MongoDB fallback');
    } catch (fallbackError) {
      console.error('Local MongoDB fallback failed:', fallbackError.message);

      if (retryCount < MAX_RETRIES) {
        const waitMs = Math.min(2000 * Math.pow(2, retryCount), 10000);
        console.log(`Retrying in ${waitMs / 1000}s (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, waitMs));
        return connectToMongo(retryCount + 1);
      }
    }
  }
};

// Mongoose connection event listeners for reconnection awareness
mongoose.connection.on('connected', () => {
  console.log('Mongoose: connection established');
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose: connection lost — will attempt automatic reconnect');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err.message);
});

connectToMongo();
