const express = require('express');
const cors = require('cors');
const { authenticateVinted, VINTED_HEADERS } = require('./auth');
const { loadCookies } = require('./cookies');
const fetch = require('node-fetch');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://dashboradsales.web.app'],
  credentials: true
}));

app.use(express.json());

// Middleware pour attacher les cookies Vinted
app.use(async (req, res, next) => {
  const cookies = await loadCookies();
  if (cookies) {
    req.vintedCookies = cookies;
  }
  next();
});

// Route pour l'authentification
app.post('/api/auth/vinted', async (req, res) => {
  try {
    const authResult = await authenticateVinted();
    if (authResult.success) {
      // Attacher les cookies à la réponse
      authResult.cookies.forEach(cookie => {
        res.cookie(cookie.name, cookie.value, {
          domain: '.web.app',
          path: '/',
          secure: true,
          sameSite: 'none'
        });
      });
      res.json({ success: true });
    } else {
      res.status(401).json({ error: 'Échec de l\'authentification' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Proxy pour les requêtes Vinted
app.use('/api/vinted', async (req, res) => {
  try {
    const cookies = req.vintedCookies;
    if (!cookies) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const response = await fetch(`https://www.vinted.fr${req.path}`, {
      method: req.method,
      headers: {
        ...VINTED_HEADERS,
        'Cookie': cookies.map(c => `${c.name}=${c.value}`).join('; '),
        'Origin': 'https://www.vinted.fr',
        'Referer': 'https://www.vinted.fr/'
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 