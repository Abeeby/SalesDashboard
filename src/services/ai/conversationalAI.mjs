import { OpenAI } from 'openai';
import { deepLearningEngine } from './deepLearning.mjs';
import { analyticsService } from '../analytics.mjs';

class ConversationalAIAssistant {
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.context = new ConversationContextManager();
    this.learning = deepLearningEngine;
    
    this.capabilities = {
      inventoryAssistant: true,
      salesAdvisor: true,
      marketingHelper: true,
      technicalSupport: true,
      pricingConsultant: true
    };
  }

  async handleUserQuery(query, userId, context) {
    const userContext = await this.context.getUserContext(userId);
    const businessContext = await this.getBusinessContext(userId);

    const response = await this.openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: this.generateSystemPrompt(userContext) },
        ...this.context.getRecentConversation(userId),
        { role: "user", content: query }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    // Analyse et exécution des actions suggérées
    const actions = await this.analyzeAndExecuteActions(
      response.choices[0].text,
      businessContext
    );

    return {
      response: response.choices[0].text,
      suggestedActions: actions,
      relatedInsights: await this.generateRelatedInsights(query, businessContext),
      nextSteps: await this.suggestNextSteps(actions, businessContext)
    };
  }

  async generateRelatedInsights(query, context) {
    // Génération d'insights pertinents basés sur la requête
    return {
      marketTrends: await this.learning.analyzeTrends(context.category),
      recommendations: await this.generateRecommendations(context),
      opportunities: await this.identifyOpportunities(context)
    };
  }
}

export const conversationalAI = new ConversationalAIAssistant(); 