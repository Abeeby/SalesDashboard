import { smartInventory } from '../inventory/smartInventory.mjs';
import { analyticsService } from '../analytics.mjs';

class BusinessIntelligenceService {
  constructor() {
    this.realTimeAnalytics = new RealTimeAnalytics();
    this.performanceTracker = new PerformanceTracker();
    this.marketAnalyzer = new MarketAnalyzer();
  }

  async generateDashboard(accountId) {
    const [
      salesMetrics,
      inventoryMetrics,
      marketMetrics,
      predictions
    ] = await Promise.all([
      this.realTimeAnalytics.getSalesMetrics(accountId),
      smartInventory.getInventoryMetrics(accountId),
      this.marketAnalyzer.getMarketMetrics(accountId),
      this.generatePredictions(accountId)
    ]);

    return {
      overview: this.generateOverview(salesMetrics, inventoryMetrics),
      performance: await this.analyzePerformance(salesMetrics),
      opportunities: await this.identifyOpportunities(marketMetrics),
      actionItems: await this.generateActionItems({
        salesMetrics,
        inventoryMetrics,
        marketMetrics,
        predictions
      })
    };
  }

  async generateActionableInsights(metrics) {
    return {
      priorityActions: this.prioritizeActions(metrics),
      quickWins: this.identifyQuickWins(metrics),
      longTermStrategy: this.developLongTermStrategy(metrics),
      riskMitigation: this.identifyRisks(metrics)
    };
  }
}

class RealTimeAnalytics {
  constructor() {
    this.setupRealTimeTracking();
  }

  async setupRealTimeTracking() {
    // Configuration du tracking en temps réel
    this.tracker = new PerformanceTracker({
      interval: 5000, // Mise à jour toutes les 5 secondes
      metrics: ['sales', 'views', 'engagement', 'profits']
    });
  }
}

export const businessIntelligence = new BusinessIntelligenceService(); 