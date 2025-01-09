import { spawn } from 'child_process';
import { resolve } from 'path';

async function runTests() {
  console.log('🧪 Démarrage des tests...');

  try {
    // Tests unitaires
    await runTestSuite('unit');
    
    // Tests d'intégration
    await runTestSuite('integration');
    
    // Tests système
    await runTestSuite('system');
    
    // Tests de performance
    await runPerformanceTests();
    
    console.log('✅ Tous les tests sont passés !');
  } catch (error) {
    console.error('❌ Erreur dans les tests:', error);
    process.exit(1);
  }
}

async function runTestSuite(type) {
  return new Promise((resolve, reject) => {
    const test = spawn('mocha', [
      `--require=@babel/register`,
      `--require=./test/setup.js`,
      `test/${type}/**/*.test.js`
    ]);

    test.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    test.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    test.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Test suite ${type} failed`));
      }
    });
  });
}

runTests().catch(console.error); 