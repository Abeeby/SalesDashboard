import { describe, it } from 'mocha';
import { expect } from 'chai';
import { accountManager } from '../../services/auth/accountManager.mjs';
import { marketplaceAuth } from '../../services/auth/marketplaceAuth.mjs';

describe('Security Tests', () => {
  describe('Authentication System', () => {
    it('should securely handle user registration', async () => {
      const testUser = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
        businessName: 'Test Shop'
      };

      const result = await accountManager.registerBusinessAccount(testUser);
      expect(result.accountId).to.exist;
      expect(result.apiKey).to.exist;
    });

    it('should properly encrypt sensitive data', async () => {
      const testData = {
        platform: 'vinted',
        credentials: {
          accessToken: 'test-token',
          refreshToken: 'test-refresh'
        }
      };

      const encrypted = await marketplaceAuth.encryptCredentials(testData);
      expect(encrypted).to.not.include(testData.credentials.accessToken);
      expect(encrypted).to.not.include(testData.credentials.refreshToken);
    });
  });

  describe('API Security', () => {
    it('should validate API requests properly', async () => {
      const invalidToken = 'invalid-token';
      try {
        await marketplaceAuth.validateApiRequest(invalidToken);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Invalid token');
      }
    });
  });
}); 