import { getCookie } from '../utils/cookies';

const VINTED_API = 'https://www.vinted.fr/api/v2';
const VINTED_URL = 'https://www.vinted.fr'; // URL principale

export async function authenticateVinted() {
  try {
    // Vérifier les cookies existants
    const accessToken = getCookie('access_token_web');
    const userId = getCookie('user_id');

    if (accessToken && userId) {
      const isValid = await checkVintedAuth();
      if (isValid) {
        const userData = await fetchVintedUserData(accessToken, userId);
        return { success: true, token: accessToken, userData };
      }
    }

    // Ouvrir Vinted dans une nouvelle fenêtre
    const vintedWindow = window.open(VINTED_URL, 'VintedLogin', 
      'width=1024,height=800,menubar=no,toolbar=no,location=yes'
    );

    if (!vintedWindow) {
      throw new Error('Le blocage des popups est activé. Veuillez l\'autoriser pour vous connecter.');
    }

    return new Promise((resolve) => {
      let checkCount = 0;
      const maxChecks = 300; // 5 minutes maximum

      const checkAuth = setInterval(async () => {
        checkCount++;
        
        try {
          // Vérifier si l'utilisateur s'est connecté
          const newToken = getCookie('access_token_web');
          const newUserId = getCookie('user_id');

          if (newToken && newUserId) {
            clearInterval(checkAuth);
            vintedWindow.close();

            try {
              const userData = await fetchVintedUserData(newToken, newUserId);
              resolve({ success: true, token: newToken, userData });
            } catch (error) {
              console.error('Erreur de récupération des données:', error);
              resolve({ success: false, error: 'Erreur de récupération des données' });
            }
          }

          // Timeout après 5 minutes
          if (checkCount >= maxChecks) {
            clearInterval(checkAuth);
            vintedWindow.close();
            resolve({ success: false, error: 'Délai de connexion dépassé' });
          }
        } catch (error) {
          console.error('Erreur de vérification:', error);
        }
      }, 1000);

      // Gérer la fermeture manuelle de la fenêtre
      const handleClose = () => {
        clearInterval(checkAuth);
        resolve({ success: false, error: 'Connexion annulée' });
      };

      vintedWindow.addEventListener('beforeunload', handleClose);
    });

  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return { success: false, error: error.message };
  }
}

async function fetchVintedUserData(token, userId) {
  console.log('Récupération des données utilisateur...', { userId });
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Cookie': document.cookie
  };

  const API_URL = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3001/api/vinted'
    : 'https://dashboradsales.web.app/api/vinted';

  try {
    // Récupérer les articles en vente via le proxy
    const itemsResponse = await fetch(
      `${API_URL}/users/${userId}/items?per_page=100&order=relevance&page=1`,
      { 
        headers,
        credentials: 'include'
      }
    );
    if (!itemsResponse.ok) throw new Error('Erreur lors de la récupération des articles');
    const itemsData = await itemsResponse.json();
    console.log('Articles récupérés:', itemsData.items.length);

    // Récupérer les ventes via le proxy
    const salesResponse = await fetch(
      `${API_URL}/users/${userId}/items?per_page=100&status[]=sold`,
      { 
        headers,
        credentials: 'include'
      }
    );
    if (!salesResponse.ok) throw new Error('Erreur lors de la récupération des ventes');
    const salesData = await salesResponse.json();
    console.log('Ventes récupérées:', salesData.items.length);

    return {
      items: itemsData.items,
      stats: {
        totalItems: itemsData.pagination.total_entries,
        totalSales: salesData.pagination.total_entries,
        revenue: salesData.items.reduce((sum, item) => sum + parseFloat(item.price), 0),
        averagePrice: salesData.items.length > 0 
          ? salesData.items.reduce((sum, item) => sum + parseFloat(item.price), 0) / salesData.items.length 
          : 0
      }
    };
  } catch (error) {
    console.error('Erreur dans fetchVintedUserData:', error);
    throw error;
  }
}

// Fonction de vérification des tokens
export async function checkVintedAuth() {
  const token = getCookie('access_token_web');
  const userId = getCookie('user_id');

  if (!token || !userId) {
    console.log('Pas de tokens trouvés');
    return false;
  }

  try {
    const response = await fetch(`${VINTED_API}/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Cookie': document.cookie
      },
      credentials: 'include'
    });

    return response.ok;
  } catch (error) {
    console.error('Erreur de vérification auth:', error);
    return false;
  }
}

export async function setupRealtimeUpdates(callback) {
  console.log('Démarrage des mises à jour en temps réel');
  const token = getCookie('access_token_web');
  const userId = getCookie('user_id');

  if (token && userId) {
    try {
      const initialData = await fetchVintedUserData(token, userId);
      callback(initialData);
    } catch (error) {
      console.error('Erreur de chargement initial:', error);
    }
  }

  const intervalId = setInterval(async () => {
    const currentToken = getCookie('access_token_web');
    const currentUserId = getCookie('user_id');
    if (currentToken && currentUserId) {
      try {
        const data = await fetchVintedUserData(currentToken, currentUserId);
        callback(data);
      } catch (error) {
        console.error('Erreur de mise à jour:', error);
      }
    }
  }, 60000);

  return () => clearInterval(intervalId);
} 