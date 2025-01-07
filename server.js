const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

// Configuration CORS
app.use(cors({
  origin: 'https://dashboradsales.web.app',
  credentials: true
}));

app.use(express.json());

// Proxy pour les requêtes Vinted
app.use('/api/vinted', async (req, res) => {
  try {
    const vintedUrl = `https://www.vinted.fr/api/v2${req.path}`;
    const response = await fetch(vintedUrl, {
      method: req.method,
      headers: {
        'Authorization': req.headers.authorization,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Cookie': req.headers.cookie
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Erreur proxy:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur proxy démarré sur le port ${PORT}`);
}); 