import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function importCookies() {
  console.log('🍪 Assistant d\'import de cookies Vinted\n');
  console.log('Instructions pour obtenir vos cookies:');
  console.log('1. Ouvrez Firefox et allez sur Vinted.fr');
  console.log('2. Connectez-vous à votre compte');
  console.log('3. Appuyez sur F12 pour ouvrir les outils de développement');
  console.log('4. Allez dans l\'onglet "Stockage" puis "Cookies"');
  console.log('5. Copiez les valeurs des cookies suivants:\n');

  const cookieNames = [
    '_vinted_fr_session',
    'v_uid',
    'datadome',
    'cf_clearance',
    'anon_id'
  ];

  const cookies = {};

  for (const cookieName of cookieNames) {
    console.log(`Pour le cookie "${cookieName}":`);
    cookies[cookieName] = await question('Collez la valeur: ');
  }

  const sessionInfo = {
    cookies,
    timestamp: new Date().toISOString(),
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    browser: 'firefox'
  };

  // Sauvegarder la configuration
  await fs.writeFile(
    path.join(__dirname, '..', 'session.json'),
    JSON.stringify(sessionInfo, null, 2)
  );

  console.log('\n💾 Session sauvegardée avec succès !');
  console.log('✨ Configuration terminée !');

  rl.close();
  return sessionInfo;
}

// Exécuter le script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  importCookies().catch(console.error);
}

export { importCookies }; 