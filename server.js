const express = require('express');
const cors = require('cors');
const { getVintedData, initializeCookies } = require('./auth');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://dashboradsales.web.app'],
  credentials: true
}));

// Initialiser les cookies au démarrage
initializeCookies().catch(console.error);

app.get('/api/vinted/data', async (req, res) => {
  try {
    const data = await getVintedData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 