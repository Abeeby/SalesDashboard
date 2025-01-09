import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testSystem() {
  const testResults = {
    timestamp: new Date().toISOString(),
    tests: [],
    errors: [],
    warnings: []
  };

  console.log('🚀 Démarrage des tests système complets...\n');

  // 1. Tests de connexion
  console.log('📡 Test de connexion...');
  await testConnection(testResults);

  // 2. Tests d'authentification
  console.log('\n🔐 Test d'authentification...');
  await testAuthentication(testResults);

  // 3. Tests API
  console.log('\n🔄 Test des endpoints API...');
  await testAPI(testResults);

  // 4. Tests Dashboard
  console.log('\n📊 Test du Dashboard...');
  await testDashboard(testResults);

  // 5. Tests Performance
  console.log('\n⚡ Test de performance...');
  await testPerformance(testResults);

  // Générer le rapport
  await generateReport(testResults);
}

async function testConnection(results) {
  try {
    const response = await fetch('https://www.vinted.fr');
    results.tests.push({
      name: 'Connexion Vinted',
      status: response.ok ? 'success' : 'failed',
      statusCode: response.status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    results.errors.push({
      component: 'Connection',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

async function testAuthentication(results) {
  const endpoints = [
    '/api/v2/oauth/token',
    '/api/v2/users/current',
    '/api/v2/auth/validate'
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`https://www.vinted.fr${endpoint}`, {
        headers: {
          'Cookie': 'your_cookie_here',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      results.tests.push({
        name: `Auth - ${endpoint}`,
        status: response.ok ? 'success' : 'failed',
        statusCode: response.status,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      results.errors.push({
        component: 'Authentication',
        endpoint,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
}

async function testAPI(results) {
  const endpoints = [
    '/items',
    '/favourites',
    '/messages',
    '/stats'
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:3001/api/vinted${endpoint}`);
      results.tests.push({
        name: `API - ${endpoint}`,
        status: response.ok ? 'success' : 'failed',
        statusCode: response.status,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      results.errors.push({
        component: 'API',
        endpoint,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
}

async function testDashboard(results) {
  const components = [
    'StatsDisplay',
    'GraphsDisplay',
    'ItemsList',
    'MessagesDisplay'
  ];

  // Simuler des tests de composants
  for (const component of components) {
    try {
      // Ici nous pourrions ajouter des tests réels de composants React
      results.tests.push({
        name: `Dashboard - ${component}`,
        status: 'pending',
        message: 'Test manuel requis',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      results.errors.push({
        component: 'Dashboard',
        componentName: component,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
}

async function testPerformance(results) {
  const startTime = process.hrtime();

  try {
    const response = await fetch('http://localhost:3001/api/vinted/data');
    const endTime = process.hrtime(startTime);
    const duration = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(2);

    results.tests.push({
      name: 'Performance - API Response Time',
      status: duration < 1000 ? 'success' : 'warning',
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    results.errors.push({
      component: 'Performance',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

async function generateReport(results) {
  const report = `# Rapport de Tests Système
Date: ${new Date().toLocaleString()}

## Résumé
- Total Tests: ${results.tests.length}
- Succès: ${results.tests.filter(t => t.status === 'success').length}
- Échecs: ${results.errors.length}
- Avertissements: ${results.warnings.length}

## Tests Détaillés
${results.tests.map(test => `
### ${test.name}
- Status: ${test.status}
- Code: ${test.statusCode || 'N/A'}
- Durée: ${test.duration || 'N/A'}
- Timestamp: ${test.timestamp}
`).join('\n')}

## Erreurs
${results.errors.map(error => `
- Component: ${error.component}
- Message: ${error.error}
- Timestamp: ${error.timestamp}
`).join('\n')}

## Avertissements
${results.warnings.map(warning => `
- Message: ${warning.message}
- Timestamp: ${warning.timestamp}
`).join('\n')}

## Recommandations
1. ${results.errors.length > 0 ? 'Corriger les erreurs d\'authentification' : 'Système d\'authentification stable'}
2. ${results.tests.some(t => t.duration > 1000) ? 'Optimiser les temps de réponse API' : 'Performance acceptable'}
3. ${results.warnings.length > 0 ? 'Examiner les avertissements' : 'Pas d\'avertissements majeurs'}

## Prochaines Étapes
- [ ] Corriger les erreurs identifiées
- [ ] Optimiser les performances si nécessaire
- [ ] Mettre à jour la documentation
- [ ] Planifier les améliorations futures
`;

  await fs.writeFile(path.join(__dirname, '..', '..', 'TEST_REPORT.md'), report);
  console.log('\n📝 Rapport de test généré dans TEST_REPORT.md');
}

// Exécuter les tests
testSystem().catch(console.error); 