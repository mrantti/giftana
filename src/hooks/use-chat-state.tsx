
import { useState } from 'react';
import { Message, ChatMetrics } from '@/types/chat';
import { Product } from '@/types/product';
import { PersonaType } from '@/components/chat/chatFlowConfig';
import { chatService } from '@/services/chatService';
import { systemService } from '@/services/systemService';
import { useChatEffects } from './chat/use-chat-effects';
import { useMessageHandlers } from './chat/use-message-handlers';
import { useProductTracking } from './chat/use-product-tracking';

export function useChatState() {
  // State management
  const [messages, setMessages] = useState<Message[]>(chatService.getInitialMessages());
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentStep, setCurrentStep] = useState('welcome');
  const [chatHistory, setChatHistory] = useState<{[key: string]: string}>({});
  const [showTextInput, setShowTextInput] = useState(false);
  const [persona, setPersona] = useState<PersonaType>('unknown');
  const [metrics, setMetrics] = useState<ChatMetrics>(chatService.getMetrics());
  const [products, setProducts] = useState<Product[]>([]);

  // Custom hooks for different parts of functionality
  useChatEffects({
    chatHistory,
    persona,
    setPersona,
    setMetrics
  });

  const { trackProductClick } = useProductTracking();

  const {
    handleSubmit,
    handleOptionSelect,
    handleReset,
    handleSuggestions,
    handleNextStep
  } = useMessageHandlers({
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
    persona
  });

  return {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    showSuggestions,
    handleSubmit,
    handleOptionSelect,
    handleReset,
    showTextInput,
    persona,
    metrics,
    systemHealth: systemService.getSystemHealth(),
    products,
    trackProductClick
  };
}
