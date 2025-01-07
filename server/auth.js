const puppeteer = require('puppeteer');
const { saveCookies, loadCookies } = require('./cookies');

async function authenticateVinted() {
  try {
    // Charger les cookies existants
    const savedCookies = await loadCookies();
    if (savedCookies) {
      console.log('Cookies existants trouvés');
      return { success: true, cookies: savedCookies };
    }

    // Si pas de cookies, lancer le navigateur headless
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Configuration des headers
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept-Language': 'fr-FR,fr;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    });

    // Aller sur Vinted
    await page.goto('https://www.vinted.fr');

    // Attendre et récupérer les cookies
    await page.waitForTimeout(5000);
    const cookies = await page.cookies();
    
    // Sauvegarder les cookies
    await saveCookies(cookies);

    await browser.close();
    return { success: true, cookies };

  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { authenticateVinted }; 