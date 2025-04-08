
import { Message, ChatMetrics } from '@/types/chat';
import { useToast } from '@/components/ui/use-toast';
import { chatService } from '@/services/chatService';
import { recommendationService } from '@/services/recommendationService';
import { systemService } from '@/services/systemService';
import { Product } from '@/types/product';
import { PersonaType } from '@/components/chat/chatFlowConfig';
import { chatFlow } from '@/components/chat/chatFlowConfig';

export function useOptionHandler({
  setMessages,
  setIsTyping,
  setShowTextInput,
  setChatHistory,
  setPersona,
  setMetrics,
  chatHistory,
  currentStep,
  persona,
  handleNextStep,
  handleSuggestions
}: {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setShowTextInput: React.Dispatch<React.SetStateAction<boolean>>;
  setChatHistory: React.Dispatch<React.SetStateAction<{[key: string]: string}>>;
  setPersona: React.Dispatch<React.SetStateAction<PersonaType>>;
  setMetrics: React.Dispatch<React.SetStateAction<ChatMetrics>>;
  chatHistory: {[key: string]: string};
  currentStep: string;
  persona: PersonaType;
  handleNextStep: (nextStep: string) => Promise<void>;
  handleSuggestions: () => Promise<void>;
}) {
  const { toast } = useToast();

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

  return { handleOptionSelect };
}
