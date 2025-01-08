import fetch from 'node-fetch';
import { loadSession } from '../session.mjs';
import { getVintedCookies } from '../auth/getCookies.mjs';

async function testVintedConnection() {
  try {
    // Essayer de charger la session existante
    let session = await loadSession();
    
    // Si le test échoue avec les cookies existants, en obtenir de nouveaux
    if (!await testWithSession(session)) {
      console.log('Cookies invalides, obtention de nouveaux cookies...');
      session = await getVintedCookies();
      console.log('Test avec les nouveaux cookies...');
      return await testWithSession(session);
    }
    
    return true;
  } catch (error) {
    console.error('Erreur:', error);
    return false;
  }
}

async function testWithSession(session) {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0',
    'Accept': 'application/json',
    'Accept-Language': 'fr,fr-FR;q=0.9,en-US;q=0.8,en;q=0.7',
    'Origin': 'https://www.vinted.fr',
    'Referer': 'https://www.vinted.fr/',
    'Cookie': Object.entries(session)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ')
  };

  const response = await fetch('https://www.vinted.fr/api/v2/users/117458538', {
    headers
  });

  console.log('Status:', response.status);
  const data = await response.text();
  console.log('Réponse:', data.substring(0, 200));

  return response.ok;
}

// Exécuter le test
console.log('🚀 Démarrage du test de connexion...');
testVintedConnection().then(success => {
  console.log('Test terminé:', success ? '✅' : '❌');
  process.exit(success ? 0 : 1);
}); 