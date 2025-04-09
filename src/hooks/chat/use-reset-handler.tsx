
import { ChatMetrics } from '@/types/chat';
import { useToast } from '@/components/ui/use-toast';
import { chatService } from '@/services/chatService';
import { PersonaType } from '@/components/chat/chatFlowConfig';
import { chatStorageService } from '@/services/chatStorageService';

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
    // Get fresh welcome messages via the service - this updates storage
    const initialMessages = chatService.resetChat();
    
    // First clear all state
    setChatHistory({});
    setShowSuggestions(false);
    setCurrentStep('welcome');
    setShowTextInput(false);
    setPersona('unknown');
    setProducts([]);
    
    // Force update messages state with the fresh welcome messages
    // This is crucial - we need a new array reference to trigger re-render
    setTimeout(() => {
      setMessages([...initialMessages]);
      setMetrics({...chatService.getMetrics()});
      
      // Show toast notification
      toast({
        title: "Chat reset",
        description: "The conversation has been reset to the beginning."
      });
    }, 0);
  };

  return { handleReset };
}
