const fetch = require('node-fetch');

const VINTED_BASE_URL = 'https://www.vinted.fr';
const USER_ID = '117458538';

const VINTED_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0',
  'Accept': 'application/json',
  'Accept-Language': 'fr,fr-FR;q=0.9,en-US;q=0.8,en;q=0.7',
  'Origin': 'https://www.vinted.fr',
  'Referer': 'https://www.vinted.fr/',
  'Cookie': `anon_id=435b3e2d-cc91-4b90-8282-2a74ed245632; v_udt=eTQ5V0RtbnBzWmQ4d1UrQ2RYbUkrdnI0dzJjTHRDcStnME04Y2c9PS0tTy85cFk4Q2FmVkd4WnM1Ui0tMndaaVFnL3F0Y1ZaVUVYeCs0WVkwUT09; v_sid=7b79c82c-1736266933; datadome=P__vBLBLDvj0NxLOJap~_ZsdaxUYMvn2kA2b_SOxvIhpx0nLWByu7gzfvLr~XqQI6b8VErU0ti0a02fPVBXcpjKJshceZRHRGPrn9r2Y7BO~YY4eeQj~E2EAdxgB1Ump`
};

async function getVintedData() {
  try {
    // Récupérer les informations du profil
    const profileResponse = await fetch(`${VINTED_BASE_URL}/api/v2/users/${USER_ID}`, {
      headers: VINTED_HEADERS
    });
    
    // Récupérer les articles
    const itemsResponse = await fetch(`${VINTED_BASE_URL}/api/v2/users/${USER_ID}/items?page=1&per_page=100`, {
      headers: VINTED_HEADERS
    });

    // Récupérer les favoris
    const favoritesResponse = await fetch(`${VINTED_BASE_URL}/api/v2/users/${USER_ID}/favourites`, {
      headers: VINTED_HEADERS
    });

    // Récupérer les messages
    const messagesResponse = await fetch(`${VINTED_BASE_URL}/api/v2/users/${USER_ID}/messages`, {
      headers: VINTED_HEADERS
    });

    const [profile, items, favorites, messages] = await Promise.all([
      profileResponse.json(),
      itemsResponse.json(),
      favoritesResponse.json(),
      messagesResponse.json()
    ]);

    return {
      profile: {
        username: profile.username,
        rating: profile.feedback_reputation,
        itemsCount: profile.items_count,
        followersCount: profile.followers_count,
        followingCount: profile.following_count,
        lastLoginDate: profile.last_login_date,
        memberSince: profile.created_at
      },
      items: items.items.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        status: item.status,
        createdAt: item.created_at,
        views: item.view_count,
        likes: item.favourite_count,
        url: item.url
      })),
      favorites: favorites.items,
      messages: messages.threads,
      stats: {
        totalItems: items.items.length,
        totalLikes: items.items.reduce((acc, item) => acc + item.favourite_count, 0),
        totalViews: items.items.reduce((acc, item) => acc + item.view_count, 0),
        averagePrice: items.items.reduce((acc, item) => acc + item.price, 0) / items.items.length
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données Vinted:', error);
    throw error;
  }
}

module.exports = { getVintedData }; 