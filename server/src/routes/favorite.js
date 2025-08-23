const router = require('express').Router();
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');
const requireAuth = require('../middleware/requireAuth');

// List current user's favorites (returns venue docs)
router.get('/', requireAuth, async (req,res)=>{
  const db = getDb();
  const users = db.collection('users');
  const venues = db.collection('venues');
  const me = await users.findOne({ _id: new ObjectId(req.user.uid) }, { projection: { favorites: 1 } });
  const favIds = me?.favorites || [];
  const items = favIds.length ? await venues.find({ _id: { $in: favIds } }).toArray() : [];
  res.json({ items });
});

// Add favorite
router.post('/:venueId', requireAuth, async (req,res)=>{
  const { venueId } = req.params;
  const db = getDb();
  const users = db.collection('users');
  await users.updateOne(
    { _id: new ObjectId(req.user.uid) },
    { $addToSet: { favorites: new ObjectId(venueId) }, $set: { updatedAt: new Date() } }
  );
  res.json({ ok: true });
});

// Remove favorite
router.delete('/:venueId', requireAuth, async (req,res)=>{
  const { venueId } = req.params;
  const db = getDb();
  const users = db.collection('users');
  await users.updateOne(
    { _id: new ObjectId(req.user.uid) },
    { $pull: { favorites: new ObjectId(venueId) }, $set: { updatedAt: new Date() } }
  );
  res.json({ ok: true });
});

module.exports = router;
