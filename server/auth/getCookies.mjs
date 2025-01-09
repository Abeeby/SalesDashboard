import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function getVintedCookies() {
  console.log('🔄 Lancement du navigateur pour récupérer les cookies Vinted...');
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  try {
    const page = await browser.newPage();
    
    // Activer les logs de navigation
    page.on('console', msg => console.log('Page log:', msg.text()));
    
    console.log('📱 Accès à la page Vinted...');
    await page.goto('https://www.vinted.fr/');
    
    // Attendre que l'utilisateur se connecte manuellement
    console.log('⚠️ Veuillez vous connecter manuellement à votre compte Vinted...');
    console.log('Une fois connecté, le programme continuera automatiquement...');
    
    // Attendre la connexion (détection du cookie de session)
    await page.waitForFunction(() => {
      return document.cookie.includes('_vinted_fr_session');
    }, { timeout: 60000 }); // 1 minute pour se connecter

    console.log('✅ Connexion détectée !');
    
    // Récupérer tous les cookies
    const cookies = await page.cookies();
    
    const cookiesFormatted = cookies.reduce((acc, cookie) => {
      acc[cookie.name] = cookie.value;
      return acc;
    }, {});

    // Sauvegarder les cookies
    await fs.writeFile(
      path.join(__dirname, '..', 'session.json'),
      JSON.stringify(cookiesFormatted, null, 2)
    );

    console.log('💾 Cookies sauvegardés avec succès !');
    return cookiesFormatted;

  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Exécuter si appelé directement
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  getVintedCookies().catch(console.error);
}

export { getVintedCookies }; 