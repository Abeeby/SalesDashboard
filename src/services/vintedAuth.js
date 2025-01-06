import { getCookie } from '../utils/cookies';

const VINTED_API = 'https://www.vinted.fr/api/v2';

export async function authenticateVinted() {
  try {
    // Vérifier si nous avons déjà des cookies valides
    const accessToken = getCookie('access_token_web');
    if (accessToken) {
      const isValid = await checkVintedAuth();
      if (isValid) {
        return { success: true, token: accessToken };
      }
    }

    // Ouvrir Vinted dans une nouvelle fenêtre
    const vintedWindow = window.open('https://www.vinted.fr', '_blank');
    
    // Attendre que l'utilisateur se connecte
    return new Promise((resolve) => {
      const checkInterval = setInterval(async () => {
        try {
          const newToken = getCookie('access_token_web');
          if (newToken) {
            clearInterval(checkInterval);
            vintedWindow?.close();
            
            // Récupérer les données de l'utilisateur
            const userData = await fetchVintedUserData(newToken);
            resolve({ success: true, token: newToken, userData });
          }
        } catch (error) {
          console.error('Erreur de vérification:', error);
        }
      }, 1000);

      // Timeout après 5 minutes
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve({ success: false, error: 'Timeout de connexion' });
      }, 300000);
    });

  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return { success: false, error: error.message };
  }
}

async function fetchVintedUserData(token) {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  };

  // Récupérer les informations de l'utilisateur
  const userResponse = await fetch(`${VINTED_API}/users/current`, { headers });
  const userData = await userResponse.json();

  // Récupérer les articles en vente
  const itemsResponse = await fetch(
    `${VINTED_API}/users/${userData.id}/items?page=1&per_page=100&order=relevance`,
    { headers }
  );
  const itemsData = await itemsResponse.json();

  // Récupérer les statistiques de vente
  const statsResponse = await fetch(
    `${VINTED_API}/users/${userData.id}/items?status[]=sold&per_page=100`,
    { headers }
  );
  const statsData = await statsResponse.json();

  return {
    user: userData,
    items: itemsData.items,
    stats: {
      totalItems: itemsData.pagination.total_entries,
      totalSales: statsData.pagination.total_entries,
      revenue: statsData.items.reduce((sum, item) => sum + item.price, 0),
      averagePrice: statsData.items.length > 0 
        ? statsData.items.reduce((sum, item) => sum + item.price, 0) / statsData.items.length 
        : 0
    }
  };
}

export async function checkVintedAuth() {
  try {
    const token = getCookie('access_token_web');
    if (!token) return false;

    const response = await fetch(`${VINTED_API}/users/current`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.ok;
  } catch {
    return false;
  }
}

// Fonction pour mettre à jour les données en temps réel
export async function setupRealtimeUpdates(callback) {
  setInterval(async () => {
    const token = getCookie('access_token_web');
    if (token) {
      try {
        const data = await fetchVintedUserData(token);
        callback(data);
      } catch (error) {
        console.error('Erreur de mise à jour:', error);
      }
    }
  }, 60000); // Mise à jour toutes les minutes
} 