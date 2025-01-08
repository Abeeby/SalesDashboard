const jwt = require('jsonwebtoken');
const { getAuth } = require('firebase-admin/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-jwt';

async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide' });
  }
}

module.exports = { authMiddleware }; 