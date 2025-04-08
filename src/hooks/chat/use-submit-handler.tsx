
import { useState } from 'react';
import { Message } from '@/types/chat';
import { useToast } from '@/components/ui/use-toast';
import { chatService } from '@/services/chatService';
import { systemService } from '@/services/systemService';
import { getPersonalizedResponse } from './utils/persona-utils';
import { PersonaType } from '@/components/chat/chatFlowConfig';

export function useSubmitHandler({
  setMessages,
  setIsTyping,
  setShowTextInput,
  setMetrics,
  currentStep,
  persona,
  handleNextStep
}: {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setShowTextInput: React.Dispatch<React.SetStateAction<boolean>>;
  setMetrics: React.Dispatch<React.SetStateAction<any>>;
  currentStep: string;
  persona: PersonaType;
  handleNextStep: (nextStep: string) => Promise<void>;
}) {
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent, inputVal: string) => {
    e.preventDefault();
    
    if (!inputVal.trim()) return;
    
    setIsTyping(true);
    
    try {
      // Process user message through chat service
      const userMessage = await chatService.processUserInput(inputVal);
      setMessages(prev => [...prev, userMessage]);
      
      // For memory description, move to gift preference after user submits
      let nextStep = currentStep === 'describe_memory' ? 'gift_preference' : currentStep;
      let responseMessage = "Thanks for your additional information. I'll take that into account with my suggestions.";
      
      // More personalized response based on the persona
      if (persona !== 'unknown') {
        responseMessage = getPersonalizedResponse(persona);
      }
      
      // Process bot response
      setTimeout(async () => {
        // If we're on the memory description step, show a specific acknowledgment
        if (currentStep === 'describe_memory' || currentStep === 'custom_input') {
          const botMessage = await chatService.processBotResponse(responseMessage);
          setMessages(prev => [...prev, botMessage]);
          
          // Move to the next step after acknowledging the input
          if (currentStep === 'describe_memory') {
            setTimeout(async () => {
              await handleNextStep('gift_preference');
            }, 1000);
          }
        } else {
          const botMessage = await chatService.processBotResponse(responseMessage);
          setMessages(prev => [...prev, botMessage]);
        }
        
        setIsTyping(false);
        setShowTextInput(false);
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

  return { handleSubmit };
}
