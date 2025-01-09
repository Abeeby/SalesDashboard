import { Translator } from './translation.mjs';
import { LanguageDetector } from './languageDetection.mjs';
import { SEOOptimizer } from './seoOptimization.mjs';

class MultilingualService {
  constructor() {
    this.translator = new Translator();
    this.languageDetector = new LanguageDetector();
    this.seoOptimizer = new SEOOptimizer();
    this.supportedLanguages = ['fr', 'en', 'es', 'de', 'it'];
  }

  async generateMultilingualContent(content, targetLanguages = this.supportedLanguages) {
    const translations = {};
    
    for (const lang of targetLanguages) {
      translations[lang] = {
        title: await this.translator.translate(content.title, lang),
        description: await this.translator.translate(content.description, lang),
        tags: await this.translateTags(content.tags, lang),
        seo: await this.generateLocalizedSEO(content, lang)
      };
    }

    return {
      translations,
      metadata: {
        originalLanguage: await this.languageDetector.detect(content.description),
        qualityScores: await this.assessTranslationQuality(translations)
      }
    };
  }

  async optimizeForMarket(content, market) {
    const marketPreferences = await this.getMarketPreferences(market);
    
    return {
      adaptedContent: await this.adaptContentForMarket(content, marketPreferences),
      localizedPricing: await this.localizePrice(content.price, market),
      marketSpecificTags: await this.generateMarketTags(content, market)
    };
  }

  async generateLocalizedSEO(content, language) {
    return this.seoOptimizer.optimize({
      content,
      language,
      market: await this.getMarketForLanguage(language),
      localTrends: await this.getLocalTrends(language)
    });
  }
}

export const multilingualService = new MultilingualService(); 