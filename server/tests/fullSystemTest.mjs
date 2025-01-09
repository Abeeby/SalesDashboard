import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import { deepLearningEngine } from '../../src/services/ai/deepLearning.mjs';
import { conversationalAI } from '../../src/services/ai/conversationalAI.mjs';
import { smartInventory } from '../../src/services/inventory/smartInventory.mjs';

describe('System Integration Tests', () => {
  before(async () => {
    // Setup test environment
    process.env.NODE_ENV = 'test';
    await setupTestDatabase();
    await initializeTestServices();
  });

  describe('AI Services', () => {
    it('should properly initialize all AI models', async () => {
      const models = await deepLearningEngine.initializeModels();
      expect(models.trendPredictor).to.exist;
      expect(models.priceOptimizer).to.exist;
      expect(models.customerBehavior).to.exist;
    });

    it('should generate accurate product recommendations', async () => {
      const testProduct = {
        category: 'clothing',
        brand: 'Nike',
        condition: 'new'
      };

      const recommendations = await deepLearningEngine.analyzeProduct(testProduct);
      expect(recommendations.pricingStrategy).to.exist;
      expect(recommendations.marketingStrategy).to.exist;
    });
  });

  describe('Inventory Management', () => {
    it('should optimize inventory correctly', async () => {
      const testInventory = [
        { id: 1, name: 'T-shirt', quantity: 10 },
        { id: 2, name: 'Jeans', quantity: 5 }
      ];

      const optimization = await smartInventory.optimizeInventoryFlow(testInventory);
      expect(optimization.restockSuggestions).to.be.an('array');
      expect(optimization.pricingAdjustments).to.exist;
    });
  });

  describe('Conversational AI', () => {
    it('should handle user queries appropriately', async () => {
      const testQuery = "Comment optimiser mes prix ?";
      const response = await conversationalAI.handleUserQuery(testQuery, 'test-user-id');
      
      expect(response.response).to.be.a('string');
      expect(response.suggestedActions).to.be.an('array');
    });
  });
}); 