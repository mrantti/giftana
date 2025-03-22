import { useState } from 'react';
import { ChatChoice, chatFlow, getWelcomeMessages } from '@/components/chat/chatFlowConfig';
import { Product } from '@/components/chat/ProductSuggestion';
import { useToast } from '@/components/ui/use-toast';

export interface Message {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
  choices?: ChatChoice[];
}

export function useChatState() {
  const [messages, setMessages] = useState<Message[]>(getWelcomeMessages());
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentStep, setCurrentStep] = useState('welcome');
  const [chatHistory, setChatHistory] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      type: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setShowSuggestions(false);
    
    // Process custom user input
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I see you're looking for something specific. Let me help you find the perfect gift!",
        type: 'bot',
        timestamp: new Date(),
        choices: [
          { id: 'restart', text: "Restart guided flow", nextStep: 'recipient' },
          { id: 'continue', text: "Continue with my request", nextStep: 'suggestions' }
        ]
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleOptionSelect = (choiceId: string, nextStep: string) => {
    // Find the choice text for the selected option
    const choiceText = chatFlow[currentStep as keyof typeof chatFlow]?.choices.find(
      choice => choice.id === choiceId
    )?.text || choiceId;

    // Add user's choice as a message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: choiceText,
      type: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Store the choice in chat history
    setChatHistory(prev => ({
      ...prev,
      [currentStep]: choiceId
    }));
    
    // Set typing indicator
    setIsTyping(true);
    
    // Process next step after a short delay
    setTimeout(() => {
      setIsTyping(false);
      
      if (nextStep === 'suggestions') {
        // When we reach suggestions, show product recommendations
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Based on your preferences, here are some perfect gift suggestions:",
          type: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
        setShowSuggestions(true);
      } else {
        // Otherwise, continue with the guided flow
        const nextStepData = chatFlow[nextStep as keyof typeof chatFlow];
        
        if (nextStepData) {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: nextStepData.message,
            type: 'bot',
            timestamp: new Date(),
            choices: nextStepData.choices
          };
          
          setMessages(prev => [...prev, botMessage]);
          setCurrentStep(nextStep);
        }
      }
    }, 1000);
  };

  const getResponseForQuery = (query: string): string => {
    // Very basic response logic for the MVP
    if (query.toLowerCase().includes('gardening')) {
      return "Based on your request, here are some perfect gardening gifts I found:";
    } else if (query.toLowerCase().includes('tech') || query.toLowerCase().includes('dad')) {
      return "I found these tech gadgets that would make great gifts:";
    } else {
      return "Here are some gift suggestions that might work well:";
    }
  };

  const handleReset = () => {
    toast({
      title: "Chat reset",
      description: "The conversation has been reset to the beginning."
    });
    setMessages(getWelcomeMessages());
    setShowSuggestions(false);
    setCurrentStep('welcome');
    setChatHistory({});
  };

  return {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    showSuggestions,
    handleSubmit,
    handleOptionSelect,
    handleReset
  };
}
