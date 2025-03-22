import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendHorizontal, RotateCcw, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import ChatMessage, { MessageType } from './ChatMessage';
import ProductSuggestion, { Product } from './ProductSuggestion';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
  choices?: ChatChoice[];
}

interface ChatChoice {
  id: string;
  text: string;
  nextStep: string;
}

// Mock product data
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Premium Gardening Tool Set',
    price: '$42.99',
    image: 'https://images.unsplash.com/photo-1591902916941-fb53ebe3d578?q=80&w=500&auto=format&fit=crop',
    description: 'This ergonomic garden tool set includes pruners, trowel, rake, and cultivator - perfect for the gardening enthusiast!',
    link: 'https://amazon.com',
    platform: 'amazon'
  },
  {
    id: '2',
    title: 'Personalized Plant Journal',
    price: '$24.50',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=500&auto=format&fit=crop',
    description: 'A beautiful handcrafted journal to track garden growth, plant care, and seasonal changes.',
    link: 'https://etsy.com',
    platform: 'etsy'
  },
  {
    id: '3',
    title: 'Indoor Herb Garden Kit',
    price: '$38.95',
    image: 'https://images.unsplash.com/photo-1522448746354-da4936934201?q=80&w=500&auto=format&fit=crop',
    description: 'Self-watering indoor garden kit with basil, mint, and cilantro seeds. Includes LED grow lights.',
    link: 'https://amazon.com',
    platform: 'amazon'
  }
];

// Chat flow configuration
const chatFlow = {
  welcome: {
    message: "Hi there! I'm your gift-finding assistant. Let's find the perfect gift together!",
    choices: [
      { id: 'start', text: "Let's get started", nextStep: 'recipient' }
    ]
  },
  recipient: {
    message: "Great! Who are you buying this gift for?",
    choices: [
      { id: 'family', text: "Family member", nextStep: 'family_member' },
      { id: 'friend', text: "Friend", nextStep: 'occasion' },
      { id: 'colleague', text: "Colleague/Co-worker", nextStep: 'occasion' },
      { id: 'partner', text: "Partner/Significant other", nextStep: 'occasion' },
      { id: 'other', text: "Someone else", nextStep: 'occasion' }
    ]
  },
  family_member: {
    message: "Which family member?",
    choices: [
      { id: 'parent', text: "Parent", nextStep: 'occasion' },
      { id: 'sibling', text: "Sibling", nextStep: 'occasion' },
      { id: 'child', text: "Child", nextStep: 'occasion' },
      { id: 'grandparent', text: "Grandparent", nextStep: 'occasion' },
      { id: 'other_family', text: "Other family member", nextStep: 'occasion' }
    ]
  },
  occasion: {
    message: "What's the occasion?",
    choices: [
      { id: 'birthday', text: "Birthday", nextStep: 'interests' },
      { id: 'holiday', text: "Holiday", nextStep: 'interests' },
      { id: 'anniversary', text: "Anniversary", nextStep: 'interests' },
      { id: 'graduation', text: "Graduation", nextStep: 'interests' },
      { id: 'other_occasion', text: "Other occasion", nextStep: 'interests' }
    ]
  },
  interests: {
    message: "What are their interests or hobbies?",
    choices: [
      { id: 'tech', text: "Technology/Gadgets", nextStep: 'budget' },
      { id: 'outdoor', text: "Outdoors/Nature", nextStep: 'budget' },
      { id: 'cooking', text: "Cooking/Food", nextStep: 'budget' },
      { id: 'reading', text: "Books/Reading", nextStep: 'budget' },
      { id: 'art', text: "Art/Creativity", nextStep: 'budget' },
      { id: 'fitness', text: "Fitness/Sports", nextStep: 'budget' },
      { id: 'music', text: "Music", nextStep: 'budget' },
      { id: 'gardening', text: "Gardening", nextStep: 'budget' },
      { id: 'not_sure', text: "I'm not sure", nextStep: 'budget' }
    ]
  },
  budget: {
    message: "What's your budget range?",
    choices: [
      { id: 'budget_low', text: "Under $25", nextStep: 'suggestions' },
      { id: 'budget_medium', text: "Between $25-$50", nextStep: 'suggestions' },
      { id: 'budget_high', text: "Between $50-$100", nextStep: 'suggestions' },
      { id: 'budget_premium', text: "Over $100", nextStep: 'suggestions' }
    ]
  },
  suggestions: {
    message: "Based on your choices, here are some perfect gift suggestions:",
    choices: []
  }
};

// Welcome messages
const welcomeMessages = [
  {
    id: 'welcome-1',
    content: chatFlow.welcome.message,
    type: 'bot' as MessageType,
    timestamp: new Date(),
    choices: chatFlow.welcome.choices
  }
];

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(welcomeMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentStep, setCurrentStep] = useState('welcome');
  const [chatHistory, setChatHistory] = useState<{[key: string]: string}>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

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
    setMessages(welcomeMessages);
    setShowSuggestions(false);
    setCurrentStep('welcome');
    setChatHistory({});
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-card border-b px-4 py-3 flex items-center justify-between">
        <h2 className="font-semibold">Gift Advisor</h2>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleReset}
            title="Reset conversation"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-4 chat-container">
        <AnimatePresence>
          {messages.map((message) => (
            <div key={message.id}>
              <ChatMessage
                content={message.content}
                type={message.type}
                timestamp={message.timestamp}
              />
              
              {message.choices && message.choices.length > 0 && message.type === 'bot' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex flex-wrap gap-2 mb-4 ml-10"
                >
                  {message.choices.map((choice) => (
                    <Button
                      key={choice.id}
                      variant="secondary"
                      className="shadow-sm"
                      onClick={() => handleOptionSelect(choice.id, choice.nextStep)}
                    >
                      {choice.text}
                    </Button>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <ChatMessage
            content=""
            type="bot"
            isLoading={true}
          />
        )}
        
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {mockProducts.map((product, index) => (
                <ProductSuggestion 
                  key={product.id} 
                  product={product} 
                  index={index}
                />
              ))}
            </div>
            
            <div className="flex justify-center mt-4">
              <Button variant="secondary" className="shadow-sm">
                Show More Ideas
              </Button>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t bg-card">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="relative flex-1">
            <Input
              placeholder="Or type a custom request..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pr-10"
            />
            {inputValue && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setInputValue('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button type="submit" disabled={!inputValue.trim() || isTyping}>
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </form>
        
        <div className="flex justify-center mt-4">
          <span className="text-xs text-muted-foreground text-center max-w-md">
            As an Amazon Associate / Etsy Affiliate, we may earn from qualifying purchases.
            <a href="/privacy" className="underline underline-offset-2 ml-1 text-primary">
              Learn more
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
