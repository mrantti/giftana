
import { useEffect, useState } from 'react';
import { ChatMetrics } from '@/types/chat';
import { chatService } from '@/services/chatService';
import { chatStorageService } from '@/services/chatStorageService';
import { personaDetectionService } from '@/services/personaDetectionService';
import { PersonaType } from '@/components/chat/chatFlowConfig';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();
  const [personaNotified, setPersonaNotified] = useState<PersonaType>('unknown');
  
  // Enhanced persona detection
  useEffect(() => {
    if (Object.keys(chatHistory).length >= 3) {
      // Get detailed persona information including confidence
      const { persona: detectedPersona, confidence, traits } = 
        personaDetectionService.getPersonaWithConfidence(chatHistory);
      
      // Only update if the detected persona is different and has sufficient confidence
      if (detectedPersona !== persona && detectedPersona !== 'unknown') {
        setPersona(detectedPersona);
        chatStorageService.updateCurrentChatPersona(detectedPersona);
        
        // Only notify once per persona change
        if (personaNotified !== detectedPersona) {
          const personaNames: Record<PersonaType, string> = {
            'busy_professional': 'Busy Professional',
            'last_minute': 'Last-Minute Shopper',
            'sentimental': 'Sentimental Giver',
            'corporate': 'Corporate/Business',
            'budget_conscious': 'Budget-Conscious',
            'unknown': 'Unknown'
          };
          
          const personaTitle = personaNames[detectedPersona] || 'Unknown';
          
          // Show toast notification with detected traits
          toast({
            title: `Personalized for ${personaTitle}`,
            description: traits.length > 0 
              ? `Based on: ${traits.slice(0, 2).join(', ')}` 
              : "Tailoring recommendations for your preferences",
            duration: 5000,
          });
          
          setPersonaNotified(detectedPersona);
        }
      }
    }
  }, [chatHistory, persona, setPersona, toast, personaNotified]);
  
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
