
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
  setProducts
}: {
  setMessages: React.Dispatch<React.SetStateAction<any>>;
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<string>>;
  setChatHistory: React.Dispatch<React.SetStateAction<{[key: string]: string}>>;
  setShowTextInput: React.Dispatch<React.SetStateAction<boolean>>;
  setPersona: React.Dispatch<React.SetStateAction<PersonaType>>;
  setMetrics: React.Dispatch<React.SetStateAction<ChatMetrics>>;
  setProducts: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const { toast } = useToast();

  const handleReset = () => {
    const initialMessages = chatService.resetChat();
    
    // Clear all state
    setChatHistory({});
    setShowSuggestions(false);
    setCurrentStep('welcome');
    setShowTextInput(false);
    setPersona('unknown');
    setProducts([]);
    
    // Update with fresh data with minimal delay
    setTimeout(() => {
      setMessages([...initialMessages]);
      setMetrics({...chatService.getMetrics()});
      
      toast({
        title: "Chat reset",
        description: "The conversation has been reset to the beginning."
      });
    }, 0);
  };

  return { handleReset };
}
