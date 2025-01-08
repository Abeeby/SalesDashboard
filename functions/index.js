const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const { getVintedData } = require('./auth');

const app = express();

// Configuration CORS plus précise
app.use(cors({
  origin: [
    'https://dashboradsales.web.app',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

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

exports.api = functions.https.onRequest(app); 