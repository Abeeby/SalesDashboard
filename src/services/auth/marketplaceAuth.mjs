import { VintedAPI } from '../api/vinted.mjs';
import { VestiaireAPI } from '../api/vestiaire.mjs';
import { DepopAPI } from '../api/depop.mjs';

class MarketplaceAuthenticator {
  constructor() {
    this.apis = {
      vinted: new VintedAPI(),
      vestiaire: new VestiaireAPI(),
      depop: new DepopAPI()
    };
  }

  async authenticate(platform, credentials) {
    if (!this.apis[platform]) {
      throw new Error(`Plateforme ${platform} non supportée`);
    }

    // Utilisation des API officielles pour l'authentification
    return this.apis[platform].authenticate(credentials);
  }

  async refreshTokens(platform, refreshToken) {
    return this.apis[platform].refreshTokens(refreshToken);
  }

  createClient(platform, config) {
    return this.apis[platform].createClient(config);
  }
}

export const marketplaceAuthenticator = new MarketplaceAuthenticator(); 