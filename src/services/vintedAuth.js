import { getCookie, setCookie } from '../utils/cookies';

const VINTED_API = 'https://www.vinted.fr/api/v2';

export async function authenticateVinted() {
  try {
    // Vérifier si nous avons déjà des cookies valides
    const accessToken = getCookie('access_token_web');
    if (accessToken) {
      return { success: true, token: accessToken };
    }

    // Si non, faire une nouvelle authentification
    const response = await fetch(`${VINTED_API}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: JSON.stringify({
        grant_type: 'password',
        client_id: 'web',
        username: process.env.REACT_APP_VINTED_EMAIL,
        password: process.env.REACT_APP_VINTED_PASSWORD
      })
    });

    if (!response.ok) {
      throw new Error('Échec de l\'authentification Vinted');
    }

    const data = await response.json();
    
    // Sauvegarder les cookies
    setCookie('access_token_web', data.access_token);
    setCookie('user_id', data.user.id);

    return { success: true, token: data.access_token };

  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return { success: false, error: error.message };
  }
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