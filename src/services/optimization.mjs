import { analyticsService } from './analytics.mjs';

class OptimizationService {
  constructor() {
    this.priceRanges = this.calculatePriceRanges();
    this.popularTimes = new Map();
  }

  async optimizePrice(item) {
    const metrics = await analyticsService.getPerformanceMetrics(item.id);
    const similarItems = await this.findSimilarItems(item);
    
    return {
      suggestedPrice: this.calculateOptimalPrice(item, similarItems, metrics),
      priceRange: this.getPriceRange(item, similarItems),
      confidence: this.calculateConfidence(similarItems.length)
    };
  }

  async optimizeTitle(item) {
    const keywords = await this.analyzeSuccessfulTitles();
    return {
      suggestedTitle: this.generateOptimizedTitle(item, keywords),
      keywords: this.extractRelevantKeywords(item),
      score: this.calculateTitleScore(item.title)
    };
  }

  async suggestListingTime(item) {
    const bestTimes = await this.analyzeBestListingTimes();
    return {
      suggestedTime: this.findOptimalTime(bestTimes),
      peakHours: this.getPeakHours(),
      expectedViews: this.predictViews(item, bestTimes)
    };
  }

  async generateInsights(item) {
    const [priceInsights, titleInsights, timingInsights] = await Promise.all([
      this.optimizePrice(item),
      this.optimizeTitle(item),
      this.suggestListingTime(item)
    ]);

    return {
      price: priceInsights,
      title: titleInsights,
      timing: timingInsights,
      overallScore: this.calculateOverallScore({
        priceInsights,
        titleInsights,
        timingInsights
      })
    };
  }
}

export const optimizationService = new OptimizationService(); 