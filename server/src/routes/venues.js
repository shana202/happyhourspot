const express = require('express');
const router = express.Router();
const { getDb } = require('../db/connect');

// GET /api/venues?city=boston&limit=20&after=Acme%20Bar
router.get('/', async (req, res) => {
  try {
    const { city, limit, all } = req.query;
    if (!city) return res.status(400).json({ error: 'city required' });

    const venues = getDb().collection('venues');

    const query = { city };
    
    let cursor = venues
    .find(query)
    .sort({ name: 1 });

    const maxLimit = 1000;
    const n = Number(limit);
    if (!all && n !== 0) {
      const effective = Math.min(isNaN(n) ? 100 : n, maxLimit);
      cursor = cursor.limit(effective);
    }


    const items = await cursor.toArray();

    res.set('Cache-Control', 'no-store');
    res.json({ items, next: null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
