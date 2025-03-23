
import { useState, useEffect, useCallback } from 'react';
import { 
  ChatChoice, 
  chatFlow, 
  getWelcomeMessages, 
  determinePersona, 
  getPersonaResponse,
  PersonaType 
} from '@/components/chat/chatFlowConfig';
import { Product } from '@/components/chat/ProductSuggestion';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/services/api';

export interface Message {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
  choices?: ChatChoice[];
}

interface ChatMetrics {
  responseTime: number;
  sessionDuration: number;
  messageCount: number;
}

export function useChatState() {
  const [messages, setMessages] = useState<Message[]>(getWelcomeMessages());
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentStep, setCurrentStep] = useState('welcome');
  const [chatHistory, setChatHistory] = useState<{[key: string]: string}>({});
  const [showTextInput, setShowTextInput] = useState(false);
  const [persona, setPersona] = useState<PersonaType>('unknown');
  const [metrics, setMetrics] = useState<ChatMetrics>({
    responseTime: 0,
    sessionDuration: 0,
    messageCount: 0
  });
  const { toast } = useToast();

  // Enhanced check for persona updates
  useEffect(() => {
    if (Object.keys(chatHistory).length >= 3) {
      const detectedPersona = determinePersona(chatHistory);
      if (detectedPersona !== persona) {
        setPersona(detectedPersona);
        // Simulating backend event tracking
        console.log(`[ANALYTICS] Persona detected: ${detectedPersona}`);
      }
    }
  }, [chatHistory, persona]);
  
  // Session duration tracker
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        sessionDuration: prev.sessionDuration + 1
      }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Simulate response time tracking
  const trackResponseTime = useCallback((startTime: number) => {
    const endTime = Date.now();
    const responseTime = (endTime - startTime) / 1000;
    setMetrics(prev => ({
      ...prev,
      responseTime,
      messageCount: prev.messageCount + 1
    }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const startTime = Date.now();
    
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
    
    // Process custom user input with simulated infrastructure delay
    setTimeout(() => {
      // More personalized response based on the persona
      let responseMessage = "Thanks for your additional information. I'll take that into account with my suggestions.";
      
      if (persona === 'sentimental') {
        responseMessage = "Thank you for sharing that meaningful context. I'll ensure the suggestions reflect the emotional connection you're looking to express.";
      } else if (persona === 'busy_professional') {
        responseMessage = "Got it. I'll use this information to find efficient yet thoughtful options for you.";
      } else if (persona === 'last_minute') {
        responseMessage = "Thanks - I'll find you something meaningful that can arrive quickly.";
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseMessage,
        type: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      trackResponseTime(startTime);
    }, 1500);
  };

  const handleOptionSelect = (choiceId: string, nextStep: string) => {
    const startTime = Date.now();
    
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
    const updatedHistory = {
      ...chatHistory,
      [currentStep]: choiceId
    };
    
    setChatHistory(updatedHistory);
    
    // Determine persona after each selection for more dynamic persona detection
    const detectedPersona = determinePersona(updatedHistory);
    if (detectedPersona !== persona) {
      setPersona(detectedPersona);
    }
    
    // Set typing indicator
    setIsTyping(true);
    
    // Process next step after a short delay
    setTimeout(() => {
      setIsTyping(false);
      trackResponseTime(startTime);
      
      if (nextStep === 'suggestions') {
        // When we reach suggestions, show product recommendations
        // Use persona-specific messaging if available
        const suggestionsMessage = getPersonaResponse(persona);
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: suggestionsMessage,
          type: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
        setShowSuggestions(true);
        
        // After showing suggestions, add the "anything else" message
        setTimeout(() => {
          const finalMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: chatFlow.final_question.message,
            type: 'bot',
            timestamp: new Date(),
            choices: chatFlow.final_question.choices
          };
          
          setMessages(prev => [...prev, finalMessage]);
          setCurrentStep('final_question');
        }, 1000);
      } else if (nextStep === 'custom_input') {
        setShowTextInput(true);
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

  const handleReset = () => {
    toast({
      title: "Chat reset",
      description: "The conversation has been reset to the beginning."
    });
    setMessages(getWelcomeMessages());
    setShowSuggestions(false);
    setCurrentStep('welcome');
    setChatHistory({});
    setShowTextInput(false);
    setPersona('unknown');
    setMetrics({
      responseTime: 0,
      sessionDuration: 0,
      messageCount: 0
    });
  };

  // This would connect to a real backend service in a production environment
  const getSystemHealth = useCallback(() => {
    return {
      status: 'healthy',
      latency: `${(Math.random() * 50 + 25).toFixed(0)}ms`,
      apiStatus: 'operational',
      modelLatency: `${(Math.random() * 200 + 300).toFixed(0)}ms`
    };
  }, []);

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
    systemHealth: getSystemHealth()
  };
}
