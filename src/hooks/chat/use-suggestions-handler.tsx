
import { Product } from '@/types/product';
import { Message } from '@/types/chat';
import { useToast } from '@/components/ui/use-toast';
import { chatService } from '@/services/chatService';
import { recommendationService } from '@/services/recommendationService';
import { systemService } from '@/services/systemService';
import { affiliateService } from '@/services/affiliateService';
import { PersonaType } from '@/components/chat/chatFlowConfig';
import { chatFlow } from '@/components/chat/chatFlowConfig';
import { getInterestsFromHistory } from './utils/persona-utils';

export function useSuggestionsHandler({
  setMessages,
  setIsTyping,
  setShowSuggestions,
  setProducts,
  setCurrentStep,
  persona,
  chatHistory
}: {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<string>>;
  persona: PersonaType;
  chatHistory: {[key: string]: string};
}) {
  const { toast } = useToast();

  const handleSuggestions = async () => {
    try {
      // Use persona-specific messaging
      const suggestionsMessage = recommendationService.getPersonaResponse(persona);
      
      // Process bot response for suggestions
      const botMessage = await chatService.processBotResponse(suggestionsMessage);
      setMessages(prev => [...prev, botMessage]);
      
      // Get product recommendations based on interests and budget
      const interests = getInterestsFromHistory(chatHistory);
      const budget = chatHistory['budget'];
      
      // Fetch product recommendations
      const recommendedProducts = await recommendationService.getGiftRecommendations(interests, budget);
      setProducts(recommendedProducts);
      
      // Track product impressions for analytics
      affiliateService.trackProductImpression(recommendedProducts);
      
      setShowSuggestions(true);
      setIsTyping(false);
      
      // After showing suggestions, add the "anything else" message
      setTimeout(async () => {
        const finalMessage = await chatService.processBotResponse(
          chatFlow.final_question.message,
          chatFlow.final_question.choices
        );
        
        setMessages(prev => [...prev, finalMessage]);
        setCurrentStep('final_question');
      }, 1000);
    } catch (error) {
      systemService.logError('Product Suggestions', error as Error);
      setIsTyping(false);
      toast({
        title: "Error getting product suggestions",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  return { handleSuggestions };
}
