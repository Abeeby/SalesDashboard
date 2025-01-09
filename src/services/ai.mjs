import { Configuration, OpenAIApi } from 'openai';
import { analyticsService } from './analytics.mjs';
import { optimizationService } from './optimization.mjs';

class AIService {
  constructor() {
    this.openai = new OpenAIApi(new Configuration({
      apiKey: process.env.OPENAI_API_KEY
    }));
    
    this.models = {
      titleOptimization: await this.loadModel('title_optimization'),
      pricePredictor: await this.loadModel('price_prediction'),
      trendAnalyzer: await this.loadModel('trend_analysis')
    };
  }

  async optimizeListingTitle(item) {
    const similarItems = await this.findSimilarItems(item);
    const marketContext = await this.analyzeMarketContext();
    
    const prompt = this.buildTitleOptimizationPrompt(item, similarItems, marketContext);
    
    const completion = await this.openai.createCompletion({
      model: "gpt-4",
      prompt,
      max_tokens: 100
    });

    return {
      optimizedTitle: completion.data.choices[0].text,
      confidence: this.calculateConfidence(completion),
      suggestions: this.extractSuggestions(completion)
    };
  }

  async predictOptimalPrice(item) {
    const marketData = await analyticsService.getMarketData(item.category);
    const seasonality = await this.analyzeSeasonality(item);
    
    return {
      predictedPrice: await this.models.pricePredictor.predict({
        item,
        marketData,
        seasonality
      }),
      confidence: this.calculatePricePredictionConfidence(),
      factors: this.explainPricingFactors()
    };
  }

  async analyzeTrends() {
    const historicalData = await analyticsService.getHistoricalData();
    const marketTrends = await this.models.trendAnalyzer.analyze(historicalData);
    
    return {
      currentTrends: marketTrends.current,
      predictions: marketTrends.future,
      recommendations: this.generateTrendBasedRecommendations(marketTrends)
    };
  }
}

export const aiService = new AIService(); 