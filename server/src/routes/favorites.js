const router = require('express').Router();
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');
const requireAuth = require('../middleware/requireAuth');

// Get list of favorite venue ids for current user
router.get('/', requireAuth, async (req, res) => {
  const db = getDb();
  const users = db.collection('users');
  const userId = req.user?.uid;
  if (!userId) return res.status(401).json({ error: 'unauthorized' });

  const user = await users.findOne({ _id: new ObjectId(userId) }, { projection: { favorites: 1 } });
  const favorites = (user?.favorites || []).map(v => v.toString());
  res.json({ favorites });
});

// Like a venue (add to favorites)
router.post('/:venueId', requireAuth, async (req, res) => {
  const db = getDb();
  const users = db.collection('users');
  const venues = db.collection('venues');
  const userId = req.user?.uid;
  const { venueId } = req.params;

  if (!ObjectId.isValid(venueId)) return res.status(400).json({ error: 'invalid_id' });

  // Optional: ensure venue exists
  const venue = await venues.findOne({ _id: new ObjectId(venueId) }, { projection: { _id: 1 } });
  if (!venue) return res.status(404).json({ error: 'venue_not_found' });

  await users.updateOne(
    { _id: new ObjectId(userId) },
    { $addToSet: { favorites: new ObjectId(venueId) }, $set: { updatedAt: new Date() } }
  );

  res.json({ ok: true });
});

// Unlike a venue (remove from favorites)
router.delete('/:venueId', requireAuth, async (req, res) => {
  const db = getDb();
  const users = db.collection('users');
  const userId = req.user?.uid;
  const { venueId } = req.params;

  if (!ObjectId.isValid(venueId)) return res.status(400).json({ error: 'invalid_id' });

  await users.updateOne(
    { _id: new ObjectId(userId) },
    { $pull: { favorites: new ObjectId(venueId) }, $set: { updatedAt: new Date() } }
  );

  res.json({ ok: true });
});

module.exports = router;
// Return full venue documents for user's favorites
router.get('/venues', requireAuth, async (req, res) => {
  const db = getDb();
  const users = db.collection('users');
  const venues = db.collection('venues');
  const userId = req.user?.uid;

  const user = await users.findOne({ _id: new ObjectId(userId) }, { projection: { favorites: 1 } });
  const favIds = (user?.favorites || []);
  if (!favIds.length) return res.json({ items: [] });

  const items = await venues
    .find({ _id: { $in: favIds } })
    .sort({ name: 1 })
    .toArray();

  res.json({ items });
});
