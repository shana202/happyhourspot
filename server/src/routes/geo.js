const router = require('express').Router();
const { lookupCity, lookupCityByIp, mapToSlug } = require('../utils/geo');

// GET /api/geo/suggest-city -> { suggestion: 'slug' | null, geo: {...} }
router.get('/suggest-city', async (req, res) => {
  let geo = null;
  const overrideIp = typeof req.query.ip === 'string' ? req.query.ip.trim() : '';
  const debugKey = typeof req.query.key === 'string' ? req.query.key : '';
  const allowProdOverride = process.env.GEO_DEBUG_KEY && debugKey === process.env.GEO_DEBUG_KEY;
  // Allow IP override in dev, or in prod only with a correct debug key
  if (overrideIp) {
    geo = lookupCityByIp(overrideIp) || null;
  } else {
    geo = lookupCity(req);
  }
  const suggestion = mapToSlug(geo);
  res.set('Cache-Control', 'no-store');
  res.json({ suggestion, geo });
});

module.exports = router;
