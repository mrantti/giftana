
import { PersonaType } from '@/components/chat/chatFlowConfig';
import { api } from '@/services/api';
import { Product } from '@/types/product';

// Service for handling recommendations and persona detection
class RecommendationService {
  // Determine user persona based on chat history
  determinePersona(chatHistory: {[key: string]: string}): PersonaType {
    // Default to unknown
    let persona: PersonaType = 'unknown';
    
    // Check for Sentimental Giver
    if ((chatHistory['gift_preference'] === 'sentimental' || 
         chatHistory['relationship_depth'] === 'very_close' ||
         chatHistory['milestone'] === 'significant' ||
         chatHistory['memory_based'] === 'memory_yes' ||
         chatHistory['message_inclusion'] === 'message_yes' ||
         chatHistory['emotional_impact'] === 'very_important') &&
        (chatHistory['detail_question'] === 'past_gift' || 
         chatHistory['detail_question'] === 'mentioned')) {
      persona = 'sentimental';
    }
    
    // Check for Busy Professional
    else if (chatHistory['time_urgency'] === 'soon' && 
        (chatHistory['gift_preference'] === 'practical' || chatHistory['detail_question'] === 'skip')) {
      persona = 'busy_professional';
    }
    
    // Check for Last-Minute Larry
    else if (chatHistory['time_urgency'] === 'urgent') {
      persona = 'last_minute';
    }
    
    // Check for Corporate HR
    else if (chatHistory['recipient'] === 'colleague' || 
            chatHistory['recipient'] === 'client') {
      persona = 'corporate';
    }
    
    // Check for Budget-Conscious
    else if (['budget_low', 'budget_medium'].includes(chatHistory['budget'] || '') && 
            (chatHistory['gift_preference'] === 'fun' || chatHistory['interests'] === 'art')) {
      persona = 'budget_conscious';
    }
    
    // Log persona detection for analytics
    console.log(`[ANALYTICS] Persona detected: ${persona}`);
    
    return persona;
  }

  // Get persona-specific response for recommendations
  getPersonaResponse(persona: PersonaType): string {
    switch(persona) {
      case 'busy_professional':
        return "I've selected these efficient options that make a thoughtful impression without requiring extensive shopping time.";
      case 'last_minute':
        return "Here are gifts with quick delivery options that still feel thoughtful and personal.";
      case 'sentimental':
        return "I've found these meaningful gifts that create a personal connection and show how much you care. These options are perfect for expressing deep appreciation and creating lasting memories.";
      case 'corporate':
        return "These professional options maintain the right balance between thoughtfulness and appropriate business boundaries.";
      case 'budget_conscious':
        return "These creative options offer great value while still making a meaningful impression.";
      default:
        return "Based on your choices, here are some perfect gift suggestions:";
    }
  }

  // Get persona description for UI insights
  getPersonaDescription(persona: PersonaType): string {
    switch(persona) {
      case 'sentimental':
        return "You seem to value emotional connection and meaningful gift-giving. I'll focus on gifts that create lasting memories and express deep appreciation.";
      case 'busy_professional':
        return "I notice you're looking for thoughtful yet efficient gift options. I'll focus on quality gifts that don't require extensive research.";
      case 'last_minute':
        return "I understand you need a quick solution. I'll prioritize gifts with fast delivery that still feel personal and thoughtful.";
      case 'corporate':
        return "For professional gift-giving, I'll suggest options that maintain the right balance of thoughtfulness and business appropriateness.";
      case 'budget_conscious':
        return "I'll help you find creative, meaningful gifts that make a great impression without breaking the bank.";
      default:
        return "";
    }
  }

  // Get gift recommendations based on interests and budget
  async getGiftRecommendations(interests: string[], budget?: string): Promise<Product[]> {
    let budgetValue: number | undefined;
    
    // Parse budget from string selection
    if (budget) {
      if (budget === 'budget_low') budgetValue = 25;
      else if (budget === 'budget_medium') budgetValue = 50;
      else if (budget === 'budget_high') budgetValue = 100;
      else if (budget === 'budget_premium') budgetValue = 200;
    }
    
    try {
      // Call the external API service to get product recommendations
      return await api.getGiftSuggestions(interests, budgetValue);
    } catch (error) {
      console.error('[ERROR] Failed to fetch gift recommendations', error);
      // Return empty array as fallback
      return [];
    }
  }
}

// Export as singleton
export const recommendationService = new RecommendationService();
