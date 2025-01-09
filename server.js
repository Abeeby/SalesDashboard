import express from 'express';
import cors from 'cors';
import { getVintedData } from './server/vintedApi.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configuration CORS
app.use(cors({
  origin: ['http://localhost:3000', 'https://dashboradsales.web.app'],
  credentials: true
}));

// Servir les fichiers statiques du build React
app.use(express.static(path.join(__dirname, 'build')));

// Routes API
app.get('/api/vinted/data', async (req, res) => {
  try {
    console.log('📡 Requête reçue pour les données Vinted');
    const data = await getVintedData();
    res.json(data);
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route pour le frontend React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📊 Dashboard disponible sur http://localhost:${PORT}`);
}); 