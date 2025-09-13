const router = require('express').Router();
const { lookupCity, lookupCityByIp, mapToSlug } = require('../utils/geo');

// GET /api/geo/suggest-city -> { suggestion: 'slug' | null, geo: {...} }
router.get('/suggest-city', async (req, res) => {
  let geo = null;
  const overrideIp = typeof req.query.ip === 'string' ? req.query.ip.trim() : '';
  // Allow IP override only outside production to help local testing
  if (overrideIp && process.env.NODE_ENV !== 'production') {
    geo = lookupCityByIp(overrideIp) || null;
  } else {
    geo = lookupCity(req);
  }
  const suggestion = mapToSlug(geo);
  res.set('Cache-Control', 'no-store');
  res.json({ suggestion, geo });
});

module.exports = router;
