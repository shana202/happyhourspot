const express = require('express');
const router = express.Router();
const { getDb } = require('../db/connect');

// GET /api/venues?city=boston&limit=20&after=Acme%20Bar
router.get('/', async (req, res) => {
  try {
    const { city, limit = 20, after } = req.query;
    if (!city) return res.status(400).json({ error: 'city required' });

    const venues = getDb().collection('venues');

    const query = { city };
    const filter = after ? { ...query, name: { $gt: after } } : query;

    const items = await venues
      .find(filter, { projection: { /* leave all fields */ } })
      .sort({ name: 1 })              // alphabetical
      .limit(Number(limit))
      .toArray();

    const next = items.length ? items[items.length - 1].name : null;

    res.json({ items, next });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
