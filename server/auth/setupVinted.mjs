import { firefox } from 'playwright';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Créer une interface pour lire les entrées utilisateur
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupVintedSession() {
  console.log('🚀 Démarrage de la configuration Vinted avec Firefox...');
  
  const browser = await firefox.launch({
    headless: false,
    args: ['--start-maximized']
  });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    console.log('🌐 Accès à Vinted...');
    await page.goto('https://www.vinted.fr/');
    
    // Attendre et cliquer sur le bouton de connexion
    await page.waitForSelector('button:has-text("Se connecter")');
    await page.click('button:has-text("Se connecter")');
    
    // Attendre le formulaire de connexion
    await page.waitForSelector('input[type="email"]');
    
    // Demander les identifiants
    const email = await question('\nEntrez votre email Vinted: ');
    const password = await question('Entrez votre mot de passe Vinted: ');
    
    // Remplir le formulaire
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    
    // Cliquer sur le bouton de connexion
    await page.click('button[type="submit"]');
    
    // Attendre que la connexion soit établie
    console.log('\n🔄 Connexion en cours...');
    
    // Attendre la redirection ou un élément qui indique qu'on est connecté
    await page.waitForNavigation({ timeout: 60000 });
    
    // Aller sur le profil
    console.log('🔄 Navigation vers le profil...');
    await page.goto('https://www.vinted.fr/member/117458538/items');
    
    // Attendre que la page charge
    await page.waitForLoadState('networkidle');
    
    // Récupérer les cookies
    const cookies = await context.cookies();
    const sessionInfo = {
      cookies: cookies.reduce((acc, cookie) => {
        acc[cookie.name] = cookie.value;
        return acc;
      }, {}),
      timestamp: new Date().toISOString(),
      userAgent: await page.evaluate(() => navigator.userAgent),
      browser: 'firefox'
    };

    // Sauvegarder la configuration
    await fs.writeFile(
      path.join(__dirname, '..', 'session.json'),
      JSON.stringify(sessionInfo, null, 2)
    );

    console.log('💾 Session sauvegardée avec succès !');
    console.log('\n✨ Configuration terminée !');
    
    return sessionInfo;

  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    rl.close();
    await browser.close();
  }
}

// Exécuter le script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  setupVintedSession().catch(console.error);
}

export { setupVintedSession }; 