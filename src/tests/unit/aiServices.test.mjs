import { describe, it } from 'mocha';
import { expect } from 'chai';
import { predictiveEngine } from '../../services/ai/predictiveEngine.mjs';
import { recommendationEngine } from '../../services/ai/recommendationEngine.mjs';

describe('AI Services Unit Tests', () => {
  describe('Predictive Engine', () => {
    it('should predict sales performance accurately', async () => {
      const testItem = {
        category: 'clothing',
        price: 29.99,
        brand: 'Zara'
      };

      const prediction = await predictiveEngine.predictSalePerformance(testItem);
      expect(prediction.predictedSales).to.exist;
      expect(prediction.predictedSales.probability).to.be.within(0, 1);
    });
  });

  describe('Recommendation Engine', () => {
    it('should generate comprehensive strategies', async () => {
      const testInventory = [
        { id: 1, name: 'Dress', price: 39.99 },
        { id: 2, name: 'Jacket', price: 89.99 }
      ];

      const strategy = await recommendationEngine.generateComprehensiveStrategy(
        'test-account',
        testInventory
      );

      expect(strategy.inventoryStrategy).to.exist;
      expect(strategy.pricingStrategy).to.exist;
      expect(strategy.marketingStrategy).to.exist;
    });
  });
}); 