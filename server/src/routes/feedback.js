const router = require('express').Router();
const { getDb } = require('../db/connect');

function sanitizeString(v, max = 1000) {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max);
}

// POST /api/feedback  { email, venue, message }
router.post('/', async (req, res) => {
  const email = sanitizeString(req.body?.email, 320);
  const venue = sanitizeString(req.body?.venue, 300);
  const message = sanitizeString(req.body?.message, 5000);

  if (!email || !venue || !message) {
    return res.status(400).json({ error: 'missing_fields', required: ['email', 'venue', 'message'] });
  }

  try {
    const db = getDb();
    const feedback = db.collection('feedback');
    const now = new Date();
    await feedback.insertOne({ email, venue, message, createdAt: now, updatedAt: now });
    return res.json({ ok: true });
  } catch (e) {
    console.error('feedback_insert_error', e);
    return res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;

