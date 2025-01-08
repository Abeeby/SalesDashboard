import axios from 'axios';

const VINTED_API_BASE = 'https://www.vinted.fr/api/v2';

export const vintedApi = {
  async login(username, password) {
    try {
      const response = await axios.post(`${VINTED_API_BASE}/auth/login`, {
        username,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Erreur de connexion Vinted:', error);
      throw error;
    }
  },

  async getItems(token) {
    try {
      const response = await axios.get(`${VINTED_API_BASE}/items`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur de récupération des articles:', error);
      throw error;
    }
  }
}; 