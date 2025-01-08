const fs = require('fs');
const path = require('path');

function extractCookiesFromHar(harPath) {
  const harData = JSON.parse(fs.readFileSync(harPath, 'utf8'));
  const vintedRequests = harData.log.entries.filter(entry => 
    entry.request.url.includes('vinted.fr')
  );

  const cookies = new Set();
  
  vintedRequests.forEach(entry => {
    // Extraire les cookies des requêtes
    entry.request.headers
      .filter(h => h.name.toLowerCase() === 'cookie')
      .forEach(h => h.value.split(';').forEach(c => cookies.add(c.trim())));

    // Extraire les cookies des réponses
    entry.response.headers
      .filter(h => h.name.toLowerCase() === 'set-cookie')
      .forEach(h => {
        const cookie = h.value.split(';')[0];
        cookies.add(cookie);
      });
  });

  return Array.from(cookies).join('; ');
}

// Usage
const harPath = process.argv[2];
if (!harPath) {
  console.error('Veuillez spécifier le chemin du fichier HAR');
  process.exit(1);
}

const cookies = extractCookiesFromHar(harPath);
fs.writeFileSync('.cookies', cookies);
console.log('Cookies extraits et sauvegardés dans .cookies'); 