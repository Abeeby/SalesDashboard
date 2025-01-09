import { OpenAI } from 'openai';
import { ImageAnalyzer } from './imageAnalysis.mjs';
import { BrandRecognition } from './brandRecognition.mjs';

class ContentGenerationService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.imageAnalyzer = new ImageAnalyzer();
    this.brandRecognizer = new BrandRecognition();
  }

  async generateListingContent(images, basicInfo = {}) {
    try {
      // Analyse des images
      const imageAnalysis = await Promise.all(
        images.map(img => this.imageAnalyzer.analyze(img))
      );

      // Reconnaissance de marque et authentification
      const brandInfo = await this.brandRecognizer.identify(images[0]);

      // Extraction des caractéristiques clés
      const features = {
        type: imageAnalysis[0].garmentType,
        color: imageAnalysis[0].dominantColors,
        pattern: imageAnalysis[0].pattern,
        condition: imageAnalysis[0].condition,
        materials: imageAnalysis[0].materials,
        ...basicInfo
      };

      // Génération de description avec GPT-4
      const description = await this.generateDescription(features, brandInfo);

      // Génération de tags pertinents
      const tags = await this.generateTags(features, brandInfo);

      // Suggestions de prix basées sur le marché
      const priceSuggestion = await this.suggestPrice(features, brandInfo);

      return {
        title: await this.generateTitle(features, brandInfo),
        description,
        tags,
        priceSuggestion,
        seoOptimization: await this.generateSEO(features, brandInfo),
        marketingPoints: await this.generateMarketingPoints(features)
      };
    } catch (error) {
      console.error('Erreur de génération de contenu:', error);
      throw error;
    }
  }

  async generateDescription(features, brandInfo) {
    const prompt = `Créez une description détaillée et attrayante pour un vêtement ${features.type} de la marque ${brandInfo.name}. 
    Caractéristiques principales:
    - Couleur: ${features.color}
    - Motif: ${features.pattern}
    - État: ${features.condition}
    - Matériaux: ${features.materials.join(', ')}`;

    const completion = await this.openai.createCompletion({
      model: "gpt-4",
      prompt,
      max_tokens: 250,
      temperature: 0.7
    });

    return completion.choices[0].text;
  }

  async generateMarketingPoints(features) {
    return {
      uniqueSellingPoints: await this.identifyUSPs(features),
      styleAdvice: await this.generateStylingTips(features),
      seasonalRelevance: await this.analyzeSeasonal(features),
      sustainabilityScore: await this.calculateSustainabilityScore(features)
    };
  }

  async suggestPrice(features, brandInfo) {
    const marketData = await this.getMarketPriceData(features, brandInfo);
    return {
      suggested: marketData.averagePrice,
      range: {
        min: marketData.minPrice,
        max: marketData.maxPrice
      },
      competitiveness: marketData.competitivenessScore,
      justification: await this.generatePriceJustification(marketData)
    };
  }
}

export const contentGenerator = new ContentGenerationService(); 