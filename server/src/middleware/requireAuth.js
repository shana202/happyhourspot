const jwt = require('jsonwebtoken');


module.exports = function requireAuth(req, res, next) {
  const token = req.cookies[process.env.COOKIE_NAME || 'hh_jwt'];
  if (!token) return res.status(401).json({ error: 'unauthorized' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'unauthorized' });
  }
};
