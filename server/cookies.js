const fs = require('fs').promises;
const path = require('path');

const COOKIES_FILE = path.join(__dirname, '../.cookies.json');

async function saveCookies(cookies) {
  try {
    await fs.writeFile(COOKIES_FILE, JSON.stringify(cookies, null, 2));
    console.log('Cookies sauvegardés');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des cookies:', error);
    throw error;
  }
}

async function loadCookies() {
  try {
    const data = await fs.readFile(COOKIES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('Pas de cookies sauvegardés');
    return null;
  }
}

module.exports = { saveCookies, loadCookies }; 