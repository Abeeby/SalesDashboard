const express = require('express');
const cors = require('cors');
const { getVintedData, initializeCookies } = require('./auth');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://dashboradsales.web.app'],
  credentials: true
}));

// Initialiser les cookies au démarrage
initializeCookies().catch(error => {
  console.error('Erreur d\'initialisation des cookies:', error);
});

app.get('/api/vinted/data', async (req, res) => {
  try {
    console.log('Requête reçue pour les données Vinted');
    const data = await getVintedData();
    res.json(data);
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 