const fs = require('fs');
const path = require('path');

// Vérifier l'environnement
const isProd = process.env.NODE_ENV === 'production';

// Charger le bon fichier .env
require('dotenv').config({
  path: path.resolve(__dirname, '..', isProd ? '.env.production' : '.env')
});

// Vérifier les variables requises
const requiredVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_DOMAIN',
  'REACT_APP_GOOGLE_ANALYTICS_ID'
];

const missingVars = requiredVars.filter(
  varName => !process.env[varName]
);

if (missingVars.length > 0) {
  console.error('Variables d\'environnement manquantes:', missingVars);
  process.exit(1);
}

// Continuer avec le build
process.env.CI = 'false';
require('react-scripts/scripts/build'); 