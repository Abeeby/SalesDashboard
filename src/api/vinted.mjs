import axios from 'axios';

class VintedAPI {
  constructor() {
    this.baseURL = 'https://api.vinted.com/v2';
    this.clientId = process.env.VINTED_CLIENT_ID;
    this.clientSecret = process.env.VINTED_CLIENT_SECRET;
  }

  async authenticate(credentials) {
    const response = await axios.post(`${this.baseURL}/oauth/token`, {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'authorization_code',
      code: credentials.code,
      redirect_uri: credentials.redirectUri
    });

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresAt: new Date(Date.now() + response.data.expires_in * 1000),
      scope: response.data.scope
    };
  }

  createClient(config) {
    return axios.create({
      baseURL: this.baseURL,
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  }
}

export const vintedAPI = new VintedAPI(); 