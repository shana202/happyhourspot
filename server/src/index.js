require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { connect } = require('./db/connect');
const authRoute = require('./routes/auth');
const favoritesRoute = require('./routes/favorites');
const venuesRoute = require('./routes/venues');

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  }));

app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoute);
app.use('/api/favorites', favoritesRoute);
app.use('/api/venues', venuesRoute);

const port = process.env.PORT || 5002;

(async () => {
    await connect(process.env.MONGODB_URI, process.env.DB_NAME);
    app.listen(port, () => console.log(`API on http://localhost:${port}`));
  })();
