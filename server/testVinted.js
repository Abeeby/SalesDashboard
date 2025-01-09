const { getVintedData } = require('./vintedApi');
const fetch = require('node-fetch');

async function runTests() {
  console.log('🚀 Démarrage des tests Vinted...\n');
  const errors = [];
  const successes = [];

  // Test 1: Connexion de base
  try {
    console.log('Test 1: Connexion à Vinted...');
    const response = await fetch('https://www.vinted.fr');
    if (response.ok) {
      successes.push('✅ Connexion de base à Vinted réussie');
    } else {
      errors.push(`❌ Échec de connexion à Vinted: ${response.status}`);
    }
  } catch (error) {
    errors.push(`❌ Erreur de connexion: ${error.message}`);
  }

  // Test 2: Récupération du profil
  try {
    console.log('Test 2: Récupération du profil...');
    const data = await getVintedData();
    if (data.profile) {
      successes.push('✅ Récupération du profil réussie');
    }
  } catch (error) {
    errors.push(`❌ Erreur profil: ${error.message}`);
  }

  // Test 3: Récupération des articles
  try {
    console.log('Test 3: Récupération des articles...');
    const data = await getVintedData();
    if (data.items && data.items.length > 0) {
      successes.push(`✅ Récupération des articles réussie (${data.items.length} articles)`);
    } else {
      errors.push('❌ Aucun article trouvé');
    }
  } catch (error) {
    errors.push(`❌ Erreur articles: ${error.message}`);
  }

  // Test 4: Test des cookies
  try {
    console.log('Test 4: Validation des cookies...');
    const response = await fetch('https://www.vinted.fr/api/v2/oauth/token', {
      headers: {
        'Cookie': require('./vintedApi').VINTED_HEADERS.Cookie
      }
    });
    if (response.ok) {
      successes.push('✅ Cookies valides');
    } else {
      errors.push(`❌ Cookies invalides: ${response.status}`);
    }
  } catch (error) {
    errors.push(`❌ Erreur cookies: ${error.message}`);
  }

  return { errors, successes };
}

// Exécuter les tests et mettre à jour BUGS.md
runTests().then(({ errors, successes }) => {
  const fs = require('fs');
  const path = require('path');

  const bugsContent = `# Suivi des Bugs et Problèmes
Dernière mise à jour: ${new Date().toLocaleString()}

## Résultats des Tests

### Succès ✅
${successes.join('\n')}

### Erreurs ❌
${errors.join('\n')}

## Problèmes Identifiés

### Authentification Vinted
${errors.length > 0 ? '- [ ] Problèmes d\'authentification détectés' : '- [x] Authentification OK'}
${errors.some(e => e.includes('cookie')) ? '- [ ] Problème de cookies' : '- [x] Cookies OK'}
${errors.some(e => e.includes('CORS')) ? '- [ ] Erreurs CORS' : '- [x] CORS OK'}

### API Vinted
- [ ] GET /api/v2/users/{id}
- [ ] GET /api/v2/users/{id}/items
- [ ] GET /api/v2/users/{id}/favourites
- [ ] GET /api/v2/users/{id}/messages

### Dashboard
- [ ] Affichage des données
- [ ] Mise à jour en temps réel
- [ ] Graphiques

## Logs Détaillés
\`\`\`
${errors.join('\n')}
\`\`\`

## Solutions Proposées
1. Rafraîchissement automatique des cookies
2. Mise en place d'un proxy pour éviter les erreurs CORS
3. Implémentation d'un système de retry
4. Mise en cache des données

## À Faire
- [ ] Implémenter la gestion des erreurs
- [ ] Ajouter des timeouts
- [ ] Mettre en place des tests automatisés
- [ ] Améliorer la documentation
`;

  fs.writeFileSync(path.join(__dirname, '..', 'BUGS.md'), bugsContent);
  console.log('\n📝 BUGS.md mis à jour avec les résultats des tests');
}); 