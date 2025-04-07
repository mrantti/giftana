import { useState, useEffect, useCallback } from 'react';
import { 
  ChatChoice, 
  chatFlow,
  PersonaType 
} from '@/components/chat/chatFlowConfig';
import { Product } from '@/types/product';
import { Message, ChatMetrics } from '@/types/chat';
import { useToast } from '@/components/ui/use-toast';
import { chatService } from '@/services/chatService';
import { recommendationService } from '@/services/recommendationService';
import { systemService } from '@/services/systemService';
import { affiliateService } from '@/services/affiliateService';

export function useChatState() {
  const [messages, setMessages] = useState<Message[]>(chatService.getInitialMessages());
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentStep, setCurrentStep] = useState('welcome');
  const [chatHistory, setChatHistory] = useState<{[key: string]: string}>({});
  const [showTextInput, setShowTextInput] = useState(false);
  const [persona, setPersona] = useState<PersonaType>('unknown');
  const [metrics, setMetrics] = useState<ChatMetrics>(chatService.getMetrics());
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);

  // Enhanced check for persona updates
  useEffect(() => {
    if (Object.keys(chatHistory).length >= 3) {
      const detectedPersona = recommendationService.determinePersona(chatHistory);
      if (detectedPersona !== persona) {
        setPersona(detectedPersona);
      }
    }
  }, [chatHistory, persona]);
  
  // Session duration tracker
  useEffect(() => {
    const interval = setInterval(() => {
      chatService.updateSessionDuration();
      setMetrics(chatService.getMetrics());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    setIsTyping(true);
    
    try {
      // Process user message through chat service
      const userMessage = await chatService.processUserInput(inputValue);
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      
      // More personalized response based on the persona
      let responseMessage = "Thanks for your additional information. I'll take that into account with my suggestions.";
      
      if (persona !== 'unknown') {
        responseMessage = getPersonalizedResponse(persona);
      }
      
      // Process bot response
      setTimeout(async () => {
        const botMessage = await chatService.processBotResponse(responseMessage);
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        setMetrics(chatService.getMetrics());
      }, 1500);
    } catch (error) {
      systemService.logError('Chat Input Processing', error as Error);
      setIsTyping(false);
      toast({
        title: "Error processing your message",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleOptionSelect = async (choiceId: string, nextStep: string) => {
    setIsTyping(true);
    
    try {
      // Find the choice text for the selected option
      const choiceText = chatFlow[currentStep as keyof typeof chatFlow]?.choices.find(
        choice => choice.id === choiceId
      )?.text || choiceId;

      // Process user's choice through chat service
      const userMessage = await chatService.processUserChoice(choiceText);
      setMessages(prev => [...prev, userMessage]);
      
      // Store the choice in chat history
      const updatedHistory = {
        ...chatHistory,
        [currentStep]: choiceId
      };
      
      setChatHistory(updatedHistory);
      
      // Determine persona after each selection for more dynamic persona detection
      const detectedPersona = recommendationService.determinePersona(updatedHistory);
      if (detectedPersona !== persona) {
        setPersona(detectedPersona);
      }
      
      // Process next step after a short delay
      setTimeout(async () => {
        if (nextStep === 'suggestions') {
          // When we reach suggestions, show product recommendations
          await handleSuggestions();
        } else if (nextStep === 'custom_input') {
          setShowTextInput(true);
          setIsTyping(false);
        } else {
          // Otherwise, continue with the guided flow
          await handleNextStep(nextStep);
        }
        
        setMetrics(chatService.getMetrics());
      }, 1000);
    } catch (error) {
      systemService.logError('Option Selection', error as Error);
      setIsTyping(false);
      toast({
        title: "Error processing your selection",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle product suggestions step
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

  // Handle next step in the guided flow
  const handleNextStep = async (nextStep: string) => {
    try {
      const nextStepData = chatFlow[nextStep as keyof typeof chatFlow];
      
      if (nextStepData) {
        const botMessage = await chatService.processBotResponse(
          nextStepData.message,
          nextStepData.choices
        );
        
        setMessages(prev => [...prev, botMessage]);
        setCurrentStep(nextStep);
      }
      
      setIsTyping(false);
    } catch (error) {
      systemService.logError('Next Step Processing', error as Error);
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    toast({
      title: "Chat reset",
      description: "The conversation has been reset to the beginning."
    });
    
    // Reset through chat service
    const initialMessages = chatService.resetChat();
    
    setMessages(initialMessages);
    setShowSuggestions(false);
    setCurrentStep('welcome');
    setChatHistory({});
    setShowTextInput(false);
    setPersona('unknown');
    setMetrics(chatService.getMetrics());
    setProducts([]);
  };

  const trackProductClick = useCallback((product: Product) => {
    affiliateService.trackProductClick(product);
  }, []);

  // Helper function to extract interests from chat history
  const getInterestsFromHistory = (history: {[key: string]: string}): string[] => {
    const interestKey = 'interests';
    if (history[interestKey]) {
      return [history[interestKey]];
    }
    return ['tech', 'gardening']; // Default interests as fallback
  };

  // Helper function for personalized responses
  const getPersonalizedResponse = (personaType: PersonaType): string => {
    switch(personaType) {
      case 'sentimental':
        return "Thank you for sharing that meaningful context. I'll ensure the suggestions reflect the emotional connection you're looking to express.";
      case 'busy_professional':
        return "Got it. I'll use this information to find efficient yet thoughtful options for you.";
      case 'last_minute':
        return "Thanks - I'll find you something meaningful that can arrive quickly.";
      case 'corporate':
        return "I understand the professional context. I'll suggest appropriate options for your business relationship.";
      case 'budget_conscious':
        return "Thanks for the details. I'll find options that offer great value while still being meaningful.";
      default:
        return "Thanks for your additional information. I'll take that into account with my suggestions.";
    }
  };

  return {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    showSuggestions,
    handleSubmit,
    handleOptionSelect,
    handleReset,
    showTextInput,
    persona,
    metrics,
    systemHealth: systemService.getSystemHealth(),
    products,
    trackProductClick
  };
}
