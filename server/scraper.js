const fetch = require('node-fetch');
const { loadCookies } = require('./utils/cookieManager');

async function scrapeZandishop() {
  // Headers exacts extraits du HAR
  const headers = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'accept-language': 'en-US,en;q=0.5',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'cookie': `anon_id=435b3e2d-cc91-4b90-8282-2a74ed245632; 
               _dd_s=rum=2&id=75b4d682-514d-43ae-8012-22912ff84ec9; 
               access_token_web=${process.env.VINTED_ACCESS_TOKEN};
               cf_clearance=${process.env.CF_CLEARANCE};
               datadome=${process.env.DATADOME_COOKIE}`
  };

  // Les endpoints API exacts
  const API_ENDPOINTS = {
    userProfile: 'https://www.vinted.fr/api/v2/users/117458538',
    userItems: 'https://www.vinted.fr/api/v2/users/117458538/items',
    itemDetails: 'https://www.vinted.fr/api/v2/items'
  };

  try {
    // Récupérer le profil utilisateur
    const userResponse = await fetch(API_ENDPOINTS.userProfile, {
      headers,
      credentials: 'include'
    });

    if (!userResponse.ok) {
      throw new Error(`Erreur API profil: ${userResponse.status}`);
    }

    const userData = await userResponse.json();

    // Récupérer les articles en vente
    const itemsResponse = await fetch(`${API_ENDPOINTS.userItems}?page=1&per_page=96&order=relevance&currency=EUR`, {
      headers,
      credentials: 'include'
    });

    if (!itemsResponse.ok) {
      throw new Error(`Erreur API articles: ${itemsResponse.status}`);
    }

    const itemsData = await itemsResponse.json();

    // Récupérer les ventes
    const salesResponse = await fetch(`${API_ENDPOINTS.userItems}?page=1&per_page=20&order=relevance&status[]=sold`, {
      headers,
      credentials: 'include'
    });

    return {
      items: itemsData.items.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        imageUrl: item.photos[0]?.url,
        status: item.status,
        url: `https://www.vinted.fr/items/${item.id}`,
        views: item.view_count,
        likes: item.favourite_count
      })),
      stats: {
        totalItems: userData.items_count,
        followers: userData.followers_count,
        rating: userData.feedback_reputation,
        // ... autres stats
      }
    };

  } catch (error) {
    console.error('Erreur détaillée:', {
      message: error.message,
      status: error.status,
      headers: error.headers
    });
    throw error;
  }
}

module.exports = { scrapeZandishop }; 