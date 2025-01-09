import { exec } from 'child_process';
import { promisify } from 'util';
import { platform } from 'os';

const execAsync = promisify(exec);
const isWindows = platform() === 'win32';

async function killProcesses() {
  console.log('🧹 Nettoyage des processus...');

  try {
    // Commandes adaptées selon le système d'exploitation
    const killCommands = isWindows ? [
      'taskkill /F /IM node.exe',
      'netstat -ano | findstr :3000',
      'netstat -ano | findstr :3001'
    ] : [
      'pkill -f node',
      'lsof -ti:3000 | xargs kill -9',
      'lsof -ti:3001 | xargs kill -9'
    ];

    for (const cmd of killCommands) {
      try {
        await execAsync(cmd);
        console.log(`✅ Exécution réussie: ${cmd}`);
      } catch (error) {
        // Ignorer les erreurs si les processus n'existent pas
        console.log(`ℹ️ Commande ignorée: ${cmd}`);
      }
    }

    console.log('🎉 Nettoyage terminé !');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    return false;
  }
}

async function startServices() {
  console.log('🚀 Démarrage des services...');

  try {
    // Vérifier si les ports sont disponibles
    await killProcesses();

    // Démarrer le serveur avec cross-env
    const serverCmd = isWindows 
      ? 'cross-env PORT=3001 node server.js'
      : 'PORT=3001 node server.js';
    
    const server = exec(serverCmd);

    server.stdout.on('data', (data) => {
      console.log(`📡 Serveur: ${data.trim()}`);
    });

    server.stderr.on('data', (data) => {
      console.error(`❌ Erreur Serveur: ${data.trim()}`);
    });

    // Attendre que le serveur soit prêt
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Démarrer le frontend avec cross-env
    const frontendCmd = isWindows
      ? 'cross-env PORT=3000 react-scripts start'
      : 'PORT=3000 react-scripts start';
    
    const frontend = exec(frontendCmd);

    frontend.stdout.on('data', (data) => {
      console.log(`🌐 Frontend: ${data.trim()}`);
    });

    frontend.stderr.on('data', (data) => {
      console.error(`❌ Erreur Frontend: ${data.trim()}`);
    });

    // Gérer les erreurs de processus
    process.on('SIGINT', async () => {
      console.log('\n👋 Arrêt des services...');
      await killProcesses();
      process.exit(0);
    });

    console.log('✨ Services démarrés avec succès !');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du démarrage des services:', error);
    return false;
  }
}

// Fonction utilitaire pour vérifier si un port est disponible
async function checkPort(port) {
  try {
    const cmd = isWindows
      ? `netstat -ano | findstr :${port}`
      : `lsof -i :${port}`;
    
    await execAsync(cmd);
    return false; // Port est utilisé
  } catch {
    return true; // Port est libre
  }
}

export { killProcesses, startServices, checkPort }; 