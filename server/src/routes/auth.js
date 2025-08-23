const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDb } = require('../db/connect');

const COOKIE = process.env.COOKIE_NAME || 'hh_jwt';
const SECURE = (process.env.COOKIE_SECURE === 'true');

function setJwtCookie(res, payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie(COOKIE, token, {
    httpOnly: true,
    secure: SECURE,
    sameSite: 'lax',
    path: '/'
  });
}

router.post('/register', async (req,res)=>{
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email_password_required' });

  const users = getDb().collection('users');
  const exists = await users.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ error: 'email_in_use' });

  const passwordHash = await bcrypt.hash(password, 10);
  const now = new Date();
  const { insertedId } = await users.insertOne({
    email: email.toLowerCase(), passwordHash, favorites: [], createdAt: now, updatedAt: now
  });

  setJwtCookie(res, { uid: insertedId, email: email.toLowerCase() });
  res.json({ ok: true, user: { email: email.toLowerCase() } });
});

router.post('/login', async (req,res)=>{
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email_password_required' });

  const users = getDb().collection('users');
  const user = await users.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ error: 'invalid_credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'invalid_credentials' });

  setJwtCookie(res, { uid: user._id, email: user.email });
  res.json({ ok: true, user: { email: user.email } });
});

router.post('/logout', (req,res)=>{
  res.clearCookie(COOKIE, { path: '/' });
  res.json({ ok: true });
});

router.get('/me', (req,res)=>{
  // decode if present (optional)
  const token = req.cookies[COOKIE];
  if (!token) return res.json({ user: null });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: { email: payload.email } });
  } catch {
    res.json({ user: null });
  }
});

module.exports = router;
