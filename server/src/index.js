require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connect } = require('./db/connect');
const venuesRoute = require('./routes/venues');

const app = express();

// Security & logging
app.use(helmet());
app.use(morgan('tiny'));

// CORS (lock to your client)
const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: allowedOrigin }));

// Healthcheck
app.get('/health', (req, res) => res.json({ ok: true }));

// API routes
app.use('/api/venues', venuesRoute);

// Start
const port = process.env.PORT || 5002;

(async () => {
  try {
    await connect(process.env.MONGODB_URI, process.env.DB_NAME);
    app.listen(port, () => {
      console.log(`API listening on http://localhost:${port}`);
    });
  } catch (e) {
    console.error('Failed to start server:', e);
    process.exit(1);
  }
})();
