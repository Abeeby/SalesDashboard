const fs = require('fs').promises;
const path = require('path');

const COOKIES_PATH = path.join(__dirname, '../../.cookies');

async function saveCookies(cookies) {
  try {
    await fs.writeFile(COOKIES_PATH, cookies);
    console.log('Cookies sauvegardés avec succès');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des cookies:', error);
  }
}

async function loadCookies() {
  try {
    const cookies = await fs.readFile(COOKIES_PATH, 'utf-8');
    return cookies;
  } catch (error) {
    console.error('Erreur lors du chargement des cookies:', error);
    return null;
  }
}

module.exports = { saveCookies, loadCookies }; 