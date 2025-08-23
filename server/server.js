
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();


const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI; // e.g. mongodb+srv://user:pass@cluster/dbname
const DB_NAME = process.env.DB_NAME || 'happyhour';
const VENUES_COLLECTION = process.env.VENUES_COLLECTION || 'venues';

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


let db;
let Venues;


function toObjectIdOrNull(id) {
  try {
    return id ? new ObjectId(id) : null;
  } catch {
    return null;
  }
}

function normalizeCity(slug) {

  return (slug || '').toString().trim().toLowerCase();
}




app.get('/health', (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});


app.get('/api/venues', async (req, res, next) => {
  try {
    const slug = normalizeCity(req.query.city);
    if (!slug) {
      return res.status(400).json({ error: 'Missing required query param: city' });
    }

    
    const limitRaw = parseInt(req.query.limit, 10);
    const LIMIT_MAX = 100;
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), LIMIT_MAX) : 10;

   
    const afterId = toObjectIdOrNull(req.query.after);

 
    const query = { city: slug };
    if (afterId) {
      query._id = { $gt: afterId };
    }

    const docs = await Venues.find(query)
      .sort({ _id: 1 })
      .limit(limit + 1) // fetch one extra to know if there's a next page
      .toArray();

    const hasMore = docs.length > limit;
    const items = hasMore ? docs.slice(0, limit) : docs;
    const next = hasMore ? String(items[items.length - 1]._id) : null;

    res.json({ items, next });
  } catch (err) {
    next(err);
  }
});


app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});


async function start() {
  if (!MONGO_URI) {
    console.error('Missing MONGO_URI in environment');
    process.exit(1);
  }

  const client = new MongoClient(MONGO_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
  });

  await client.connect();
  db = client.db(DB_NAME);
  Venues = db.collection(VENUES_COLLECTION);

 
  await Venues.createIndex({ city: 1, _id: 1 });

  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

start().catch((e) => {
  console.error('Failed to start server:', e);
  process.exit(1);
});