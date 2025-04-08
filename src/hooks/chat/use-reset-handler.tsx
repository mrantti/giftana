
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
    // Reset through chat service - this creates a new chat with welcome messages
    const initialMessages = chatService.resetChat();
    
    // Force a full refresh of the app state
    setMessages([...initialMessages]); // Use spread to ensure a new array reference
    setShowSuggestions(false);
    setCurrentStep('welcome');
    setChatHistory({});
    setShowTextInput(false);
    setPersona('unknown');
    setMetrics({...chatService.getMetrics()}); // Use spread to ensure a new object reference
    setProducts([]);
    
    // Show toast notification
    toast({
      title: "Chat reset",
      description: "The conversation has been reset to the beginning."
    });
  };

  return { handleReset };
}
