
import { useState } from 'react';
import { Message, ChatMetrics } from '@/types/chat';
import { Product } from '@/types/product';
import { PersonaType } from '@/components/chat/chatFlowConfig';
import { useSubmitHandler } from './use-submit-handler';
import { useOptionHandler } from './use-option-handler';
import { useResetHandler } from './use-reset-handler';
import { useSuggestionsHandler } from './use-suggestions-handler';
import { useNextStepHandler } from './use-next-step-handler';

export function useMessageHandlers({
  setMessages,
  setInputValue,
  setIsTyping,
  setShowSuggestions,
  setCurrentStep,
  setChatHistory,
  setShowTextInput,
  setPersona,
  setMetrics,
  setProducts,
  chatHistory,
  currentStep,
  persona,
}: {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<string>>;
  setChatHistory: React.Dispatch<React.SetStateAction<{[key: string]: string}>>;
  setShowTextInput: React.Dispatch<React.SetStateAction<boolean>>;
  setPersona: React.Dispatch<React.SetStateAction<PersonaType>>;
  setMetrics: React.Dispatch<React.SetStateAction<ChatMetrics>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  chatHistory: {[key: string]: string};
  currentStep: string;
  persona: PersonaType;
}) {
  // Use the next step handler
  const { handleNextStep } = useNextStepHandler({ 
    setMessages, 
    setCurrentStep, 
    setIsTyping 
  });

  // Use the suggestions handler
  const { handleSuggestions } = useSuggestionsHandler({
    setMessages,
    setIsTyping,
    setShowSuggestions,
    setProducts,
    setCurrentStep,
    persona,
    chatHistory
  });

  // Use the option handler
  const { handleOptionSelect } = useOptionHandler({
    setMessages,
    setIsTyping,
    setShowTextInput,
    setChatHistory,
    setPersona,
    setMetrics,
    chatHistory,
    persona,
    handleNextStep,
    handleSuggestions
  });

  // Use the submit handler
  const { handleSubmit: baseHandleSubmit } = useSubmitHandler({
    setMessages,
    setIsTyping,
    setShowTextInput,
    setMetrics,
    currentStep,
    persona,
    handleNextStep
  });

  // Use the reset handler
  const { handleReset } = useResetHandler({
    setMessages,
    setShowSuggestions,
    setCurrentStep,
    setChatHistory,
    setShowTextInput,
    setPersona,
    setMetrics,
    setProducts
  });

  // Wrapper function to provide the current inputValue
  const handleSubmit = (e: React.FormEvent) => {
    return baseHandleSubmit(e, inputValue);
  };

  return {
    handleSubmit,
    handleOptionSelect,
    handleReset,
    handleSuggestions,
    handleNextStep
  };
}
