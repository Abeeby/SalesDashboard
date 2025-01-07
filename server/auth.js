const fetch = require('node-fetch');
const { saveCookies, loadCookies } = require('./cookies');

// Configuration de base
const VINTED_API = 'https://www.vinted.fr/api/v2';
const USER_ID = process.env.VINTED_USER_ID || '117458538';

// Ajout des headers essentiels de l'API Vinted
const VINTED_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0',
  'Accept': 'application/json',
  'Accept-Language': 'fr,fr-FR;q=0.9,en-US;q=0.8,en;q=0.7',
  'Content-Type': 'application/json',
  'X-App-Version': '2024.2.0',
  'Origin': 'https://www.vinted.fr',
  'Referer': 'https://www.vinted.fr/',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  // Ajout des headers de sécurité
  'X-Requested-With': 'XMLHttpRequest',
  'DNT': '1',
  'Connection': 'keep-alive'
};

let authRetryCount = 0;
const MAX_RETRIES = 3;

async function refreshVintedAuth() {
  try {
    // Réinitialiser le compteur de tentatives
    authRetryCount = 0;

    const response = await fetch(`${VINTED_API}/users/${USER_ID}`, {
      headers: {
        ...VINTED_HEADERS,
        // Ajouter les cookies existants s'il y en a
        ...(await getExistingCookieHeader())
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Erreur de rafraîchissement: ${response.status}`);
    }

    const cookies = response.headers.raw()['set-cookie'];
    if (!cookies || cookies.length === 0) {
      throw new Error('Pas de cookies reçus');
    }

    const parsedCookies = cookies.map(cookie => {
      const [nameValue, ...parts] = cookie.split(';');
      const [name, value] = nameValue.split('=');
      return { 
        name, 
        value, 
        domain: '.vinted.fr',
        path: '/',
        secure: true,
        sameSite: 'none'
      };
    });

    await saveCookies(parsedCookies);
    console.log('Nouveaux cookies sauvegardés avec succès');
    return parsedCookies;

  } catch (error) {
    console.error('Erreur de rafraîchissement:', error);
    return null;
  }
}

async function getExistingCookieHeader() {
  const cookies = await loadCookies();
  return cookies ? {
    'Cookie': cookies.map(c => `${c.name}=${c.value}`).join('; ')
  } : {};
}

async function getVintedData() {
  try {
    const cookies = await loadCookies();
    if (!cookies && authRetryCount < MAX_RETRIES) {
      authRetryCount++;
      console.log(`Tentative de rafraîchissement ${authRetryCount}/${MAX_RETRIES}`);
      await refreshVintedAuth();
      return getVintedData();
    }

    const response = await fetch(`${VINTED_API}/users/${USER_ID}/items?per_page=100&page=1&order=newest_first`, {
      headers: {
        ...VINTED_HEADERS,
        ...(await getExistingCookieHeader())
      }
    });

    if (!response.ok) {
      if (response.status === 401 && authRetryCount < MAX_RETRIES) {
        authRetryCount++;
        console.log(`Tentative de rafraîchissement après 401: ${authRetryCount}/${MAX_RETRIES}`);
        await refreshVintedAuth();
        return getVintedData();
      }
      throw new Error(`Erreur API: ${response.status}`);
    }

    // Réinitialiser le compteur en cas de succès
    authRetryCount = 0;
    return await response.json();

  } catch (error) {
    console.error('Erreur de récupération des données:', error);
    throw error;
  }
}

module.exports = { getVintedData, refreshVintedAuth }; 