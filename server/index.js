const express = require('express');
const cors = require('cors');
const { scrapeZandishop } = require('./scraper');

const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'https://dashboradsales.web.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Route principale pour récupérer les données
app.get('/api/zandishop', async (req, res) => {
  try {
    const data = await scrapeZandishop();
    res.json(data);
  } catch (error) {
    console.error('Erreur API:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route pour rafraîchir manuellement les données
app.post('/api/zandishop/refresh', async (req, res) => {
  try {
    const data = await scrapeZandishop();
    res.json(data);
  } catch (error) {
    console.error('Erreur refresh:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`API disponible sur http://localhost:${PORT}/api/zandishop`);
}); 