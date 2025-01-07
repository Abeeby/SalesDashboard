const express = require('express');
const cors = require('cors');
const { getVintedData, refreshVintedAuth } = require('./auth');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://dashboradsales.web.app'],
  credentials: true
}));

// Route pour obtenir les données Vinted
app.get('/api/vinted/data', async (req, res) => {
  try {
    const data = await getVintedData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rafraîchir les tokens périodiquement (toutes les 30 minutes)
setInterval(async () => {
  try {
    await refreshVintedAuth();
    console.log('Tokens rafraîchis avec succès');
  } catch (error) {
    console.error('Erreur de rafraîchissement périodique:', error);
  }
}, 30 * 60 * 1000);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 