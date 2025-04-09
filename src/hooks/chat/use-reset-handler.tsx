
import { ChatMetrics } from '@/types/chat';
import { useToast } from '@/components/ui/use-toast';
import { chatService } from '@/services/chatService';
import { PersonaType } from '@/components/chat/chatFlowConfig';

export function useResetHandler({
  setMessages,
  setShowSuggestions,
  setCurrentStep,
  setChatHistory,
  setShowTextInput,
  setPersona,
  setMetrics,
  setProducts,
  setIsTyping
}: {
  setMessages: React.Dispatch<React.SetStateAction<any>>;
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<string>>;
  setChatHistory: React.Dispatch<React.SetStateAction<{[key: string]: string}>>;
  setShowTextInput: React.Dispatch<React.SetStateAction<boolean>>;
  setPersona: React.Dispatch<React.SetStateAction<PersonaType>>;
  setMetrics: React.Dispatch<React.SetStateAction<ChatMetrics>>;
  setProducts: React.Dispatch<React.SetStateAction<any[]>>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { toast } = useToast();

  const handleReset = () => {
    // First show loading state
    setIsTyping(true);
    
    // Clear all state variables immediately
    setChatHistory({});
    setShowSuggestions(false);
    setCurrentStep('welcome');
    setShowTextInput(false);
    setPersona('unknown');
    setProducts([]);
    
    // Clear messages immediately to give instant feedback
    setMessages([]);
    
    // Then get fresh welcome messages from service
    setTimeout(() => {
      const initialMessages = chatService.resetChat();
      
      // Stop loading state
      setIsTyping(false);
      
      // Force a re-render with the new messages
      setMessages([...initialMessages]);
      setMetrics({...chatService.getMetrics()});
      
      toast({
        title: "Chat reset",
        description: "The conversation has been reset. Ask me about gift ideas!",
        variant: "default",
      });
    }, 300);
  };

  return { handleReset };
}
