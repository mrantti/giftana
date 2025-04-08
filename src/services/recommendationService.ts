
import { PersonaType } from '@/components/chat/types/flow-types';
import { api } from '@/services/api';
import { Product } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';

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

  // Analyze chat history using OpenAI (new method)
  async analyzePreferences(chatHistory: {[key: string]: string}): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-preferences', {
        body: { chatHistory }
      });
      
      if (error) {
        console.error('[ERROR] Failed to analyze preferences:', error);
        throw error;
      }
      
      console.log('[INFO] Preferences analysis:', data);
      return data;
    } catch (error) {
      console.error('[ERROR] Error in analyzePreferences:', error);
      throw error;
    }
  }

  // Get gift recommendations using Edge Function (updated method)
  async getGiftRecommendations(interests: string[], budget?: string): Promise<Product[]> {
    let budgetValue: string | undefined;
    
    // Parse budget from string selection
    if (budget) {
      if (budget === 'budget_low') budgetValue = 'low';
      else if (budget === 'budget_medium') budgetValue = 'medium';
      else if (budget === 'budget_high') budgetValue = 'high';
      else if (budget === 'budget_premium') budgetValue = 'premium';
    }
    
    try {
      // Call our Edge Function for recommendations
      const { data, error } = await supabase.functions.invoke('get-recommendations', {
        body: { 
          interests, 
          priceRange: budgetValue,
          useAmazonApi: true
        }
      });
      
      if (error) {
        console.error('[ERROR] Failed to fetch gift recommendations:', error);
        throw error;
      }
      
      if (data.products && Array.isArray(data.products)) {
        return data.products;
      }
      
      // Call the external API service as fallback if our function fails
      console.log('[INFO] Using fallback recommendation API');
      return await api.getGiftSuggestions(interests, budgetValue ? parseInt(budgetValue) : undefined);
    } catch (error) {
      console.error('[ERROR] Failed to fetch gift recommendations', error);
      
      // Use mock data as final fallback
      console.log('[INFO] Using mock data as fallback');
      return [
        {
          id: 'fallback-1',
          title: 'Bestseller Books Collection',
          price: '$49.99',
          image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=500&auto=format&fit=crop',
          description: 'A collection of this year\'s most popular books.',
          link: 'https://amazon.com/product/fallback-1',
          platform: 'amazon'
        },
        {
          id: 'fallback-2',
          title: 'Premium Wireless Headphones',
          price: '$79.99',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&auto=format&fit=crop',
          description: 'High-quality wireless headphones with noise cancellation.',
          link: 'https://amazon.com/product/fallback-2',
          platform: 'amazon'
        }
      ];
    }
  }
  
  // NEW METHOD: Get recommendations based on full chat analysis
  async getSmartRecommendations(chatHistory: {[key: string]: string}): Promise<Product[]> {
    try {
      // First analyze preferences using OpenAI
      const analysis = await this.analyzePreferences(chatHistory);
      
      // Then use those preferences to get product recommendations
      const { data, error } = await supabase.functions.invoke('get-recommendations', {
        body: { 
          interests: analysis.interests || ['general'],
          priceRange: analysis.priceRange || 'medium',
          keywords: analysis.keywords || [],
          giftCategory: analysis.giftCategory || 'general',
          useAmazonApi: true
        }
      });
      
      if (error) {
        console.error('[ERROR] Failed to fetch smart recommendations:', error);
        throw error;
      }
      
      if (data.products && Array.isArray(data.products)) {
        return data.products;
      }
      
      throw new Error('No products returned from recommendation function');
    } catch (error) {
      console.error('[ERROR] Failed to get smart recommendations', error);
      
      // Fall back to basic recommendation method
      const interests = chatHistory['interests'] ? [chatHistory['interests']] : ['general'];
      return this.getGiftRecommendations(interests, chatHistory['budget']);
    }
  }
}

// Export as singleton
export const recommendationService = new RecommendationService();
