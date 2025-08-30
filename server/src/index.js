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
app.use('/api/auth', authRoute);

app.use('/api/venues', venuesRoute);
app.use('/api/favorites', favoritesRouter);
app.use('/api/feedback', feedbackRouter);

const port = process.env.PORT || 5002;

// Start the HTTP server immediately so container healthchecks pass
app.listen(port, () => console.log(`API on http://localhost:${port}`));

// Connect to Mongo in the background; routes that use DB will throw until ready
connect(process.env.MONGODB_URI, process.env.DB_NAME)
  .then(() => console.log('MongoDB connected'))
  .catch((e) => {
    console.error('MongoDB connection failed:', e);
  });
