require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { connect } = require('./db/connect');
const authRoute = require('./routes/auth');
const favoritesRouter = require('./routes/favorites');
const feedbackRouter = require('./routes/feedback');
const venuesRoute = require('./routes/venues');
const geoRoute = require('./routes/geo');
const { initMaxMind } = require('./utils/geo');

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
  }));

app.get('/health', (req, res) => res.json({ ok: true }));
app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoute);

app.use('/api/venues', venuesRoute);
app.use('/api/favorites', favoritesRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/geo', geoRoute);

const port = process.env.PORT || 5002;
const host = process.env.HOST || '0.0.0.0';

// Start the HTTP server immediately so container healthchecks pass
app.listen(port, host, () => console.log(`API on http://${host}:${port}`));

// Connect to Mongo in the background; routes that use DB will throw until ready
// Initialize optional MaxMind DB
initMaxMind(process.env.MAXMIND_DB).then((ok) => {
  if (ok) console.log('MaxMind City DB loaded');
});

connect(process.env.MONGODB_URI, process.env.DB_NAME)
  .then(() => console.log('MongoDB connected'))
  .catch((e) => {
    console.error('MongoDB connection failed:', e);
  });
