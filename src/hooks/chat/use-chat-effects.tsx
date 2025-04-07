
import { useEffect } from 'react';
import { ChatMetrics } from '@/types/chat';
import { chatService } from '@/services/chatService';
import { recommendationService } from '@/services/recommendationService';
import { PersonaType } from '@/components/chat/chatFlowConfig';

export function useChatEffects({
  chatHistory,
  persona,
  setPersona,
  setMetrics
}: {
  chatHistory: {[key: string]: string};
  persona: PersonaType;
  setPersona: React.Dispatch<React.SetStateAction<PersonaType>>;
  setMetrics: React.Dispatch<React.SetStateAction<ChatMetrics>>;
}) {
  // Enhanced check for persona updates
  useEffect(() => {
    if (Object.keys(chatHistory).length >= 3) {
      const detectedPersona = recommendationService.determinePersona(chatHistory);
      if (detectedPersona !== persona) {
        setPersona(detectedPersona);
      }
    }
  }, [chatHistory, persona, setPersona]);
  
  // Session duration tracker
  useEffect(() => {
    const interval = setInterval(() => {
      chatService.updateSessionDuration();
      setMetrics(chatService.getMetrics());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [setMetrics]);

  return;
}
