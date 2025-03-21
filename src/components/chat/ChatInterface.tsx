
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendHorizontal, RotateCcw, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ChatMessage, { MessageType } from './ChatMessage';
import ProductSuggestion, { Product } from './ProductSuggestion';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
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

// Welcome messages
const welcomeMessages = [
  {
    id: 'welcome-1',
    content: "Hi there! I'm your gift-finding assistant. I can help you find the perfect gift for any occasion.",
    type: 'bot' as MessageType,
    timestamp: new Date()
  },
  {
    id: 'welcome-2',
    content: "Try asking me something like: \"I need a gift for my sister who loves gardening\" or \"Help me find a birthday gift for my tech-savvy dad under $50.\"",
    type: 'bot' as MessageType,
    timestamp: new Date()
  }
];

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(welcomeMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
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
    
    // Simulate bot response after a delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getResponseForQuery(inputValue),
        type: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      setShowSuggestions(true);
    }, 1500);
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
            <ChatMessage
              key={message.id}
              content={message.content}
              type={message.type}
              timestamp={message.timestamp}
            />
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
              placeholder="Ask for gift suggestions..."
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
