
import { Message } from '@/types/chat';
import { chatService } from '@/services/chatService';
import { systemService } from '@/services/systemService';
import { chatFlow } from '@/components/chat/chatFlowConfig';

export function useNextStepHandler({
  setMessages,
  setCurrentStep,
  setIsTyping
}: {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<string>>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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

  return { handleNextStep };
}
