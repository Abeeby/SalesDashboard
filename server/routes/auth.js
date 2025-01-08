const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { login } = require('../auth');
const { validateEmail } = require('../utils/validation');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Email invalide' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Mot de passe invalide' });
    }

    // Tentative de connexion
    const loginResult = await login(email, password);
    if (loginResult.success) {
      // Créer un token JWT
      const token = jwt.sign(
        { email, userId: loginResult.userId },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        token,
        user: loginResult.userData
      });
    } else {
      res.status(401).json({ error: 'Identifiants invalides' });
    }
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Email invalide' });
    }

    // Envoyer un email de réinitialisation
    await sendPasswordResetEmail(email);

    res.json({ success: true, message: 'Email de réinitialisation envoyé' });
  } catch (error) {
    console.error('Erreur reset password:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router; 