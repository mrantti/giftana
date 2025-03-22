
import { useState } from 'react';
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
  const [showTextInput, setShowTextInput] = useState(false);
  const [persona, setPersona] = useState<PersonaType>('unknown');
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
    
    // Process custom user input
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thanks for your additional information. I'll take that into account with my suggestions.",
        type: 'bot',
        timestamp: new Date(),
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
    const updatedHistory = {
      ...chatHistory,
      [currentStep]: choiceId
    };
    
    setChatHistory(updatedHistory);
    
    // Determine persona after collecting enough data
    if (['budget', 'detail_question'].includes(currentStep)) {
      const detectedPersona = determinePersona(updatedHistory);
      setPersona(detectedPersona);
    }
    
    // Set typing indicator
    setIsTyping(true);
    
    // Process next step after a short delay
    setTimeout(() => {
      setIsTyping(false);
      
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
  };

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
    persona
  };
}
