import fetch from 'node-fetch';
import { loadSession } from './session.mjs';

async function getVintedData() {
  try {
    const session = await loadSession();
    console.log('Initialisation de la session...');

    const headers = {
      'User-Agent': session.userAgent,
      'Accept': 'application/json',
      'Accept-Language': 'fr,fr-FR;q=0.9,en-US;q=0.8,en;q=0.7',
      'Origin': 'https://www.vinted.fr',
      'Referer': 'https://www.vinted.fr/',
      'Connection': 'keep-alive',
      'Cookie': Object.entries(session.cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')
    };

    // Test de connexion initial
    console.log('Test de connexion...');
    const testResponse = await fetch('https://www.vinted.fr/', { headers });
    if (!testResponse.ok) {
      throw new Error('Erreur de connexion à Vinted');
    }

    // Récupération du profil
    console.log('Récupération du profil...');
    const profileResponse = await fetch(
      'https://www.vinted.fr/api/v2/users/117458538',
      { headers }
    );

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      console.error('Réponse API:', errorText);
      throw new Error('Session expirée ou invalide - Veuillez vous reconnecter');
    }

    const profile = await profileResponse.json();
    console.log('Profil récupéré avec succès !');

    return {
      profile: profile.user,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Erreur détaillée:', error);
    throw error;
  }
}

export { getVintedData }; 