import { OAuth2Client } from 'google-auth-library';
import { MarketplaceAuthenticator } from './marketplaceAuth.mjs';
import { DatabaseService } from '../database/index.mjs';

class AccountManager {
  constructor() {
    this.db = new DatabaseService();
    this.marketplaceAuth = new MarketplaceAuthenticator();
    this.oauth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async registerBusinessAccount(userData) {
    try {
      // Vérification des informations business
      const verifiedBusiness = await this.verifyBusinessInfo({
        siret: userData.siret,
        companyName: userData.companyName,
        vatNumber: userData.vatNumber
      });

      // Création du compte professionnel
      const account = await this.db.accounts.create({
        ...verifiedBusiness,
        type: 'business',
        createdAt: new Date(),
        status: 'active',
        subscription: 'trial'
      });

      return {
        accountId: account.id,
        apiKey: await this.generateApiKey(account.id),
        welcomePackage: await this.prepareWelcomePackage(account)
      };
    } catch (error) {
      console.error('Erreur création compte:', error);
      throw new Error('Erreur lors de la création du compte professionnel');
    }
  }

  async connectMarketplace(accountId, platform, credentials) {
    try {
      // Connexion légale via API officielle
      const connection = await this.marketplaceAuth.authenticate(platform, {
        clientId: process.env[`${platform.toUpperCase()}_CLIENT_ID`],
        clientSecret: process.env[`${platform.toUpperCase()}_CLIENT_SECRET`],
        ...credentials
      });

      // Sauvegarde sécurisée des tokens
      await this.db.connections.create({
        accountId,
        platform,
        accessToken: connection.accessToken,
        refreshToken: connection.refreshToken,
        scope: connection.scope,
        expiresAt: connection.expiresAt
      });

      return {
        status: 'connected',
        platformId: connection.platformId,
        capabilities: connection.capabilities
      };
    } catch (error) {
      console.error(`Erreur connexion ${platform}:`, error);
      throw new Error(`Impossible de connecter le compte ${platform}`);
    }
  }

  async refreshMarketplaceTokens(accountId, platform) {
    const connection = await this.db.connections.findOne({
      accountId,
      platform
    });

    if (connection.expiresAt <= new Date()) {
      const newTokens = await this.marketplaceAuth.refreshTokens(
        platform,
        connection.refreshToken
      );

      await this.db.connections.update(connection.id, {
        accessToken: newTokens.accessToken,
        expiresAt: newTokens.expiresAt
      });
    }
  }

  async getMarketplaceClient(accountId, platform) {
    await this.refreshMarketplaceTokens(accountId, platform);
    const connection = await this.db.connections.findOne({
      accountId,
      platform
    });

    return this.marketplaceAuth.createClient(platform, {
      accessToken: connection.accessToken
    });
  }
}

export const accountManager = new AccountManager(); 