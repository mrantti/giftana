
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
    // Reset through chat service
    const initialMessages = chatService.resetChat();
    
    // Update all state to initial values
    setMessages(initialMessages);
    setShowSuggestions(false);
    setCurrentStep('welcome');
    setChatHistory({});
    setShowTextInput(false);
    setPersona('unknown');
    setMetrics(chatService.getMetrics());
    setProducts([]);
    
    // Show toast notification
    toast({
      title: "Chat reset",
      description: "The conversation has been reset to the beginning."
    });
  };

  return { handleReset };
}
