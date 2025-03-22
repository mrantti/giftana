
import React, { useRef } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatState } from '@/hooks/use-chat-state';
import MessagesList from './MessagesList';
import ProductSuggestionsList from './ProductSuggestionsList';
import ChatInput from './ChatInput';

const ChatInterface: React.FC = () => {
  const { 
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
  } = useChatState();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Helper function to get persona display name
  const getPersonaDisplayName = (personaType: string): string => {
    const personaNames: {[key: string]: string} = {
      'busy_professional': 'Busy Professional',
      'last_minute': 'Last-Minute Shopper',
      'sentimental': 'Sentimental Giver',
      'corporate': 'Corporate/Business',
      'budget_conscious': 'Budget-Conscious',
      'unknown': ''
    };
    
    return personaNames[personaType] || '';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-card border-b px-4 py-3 flex items-center justify-between">
        <h2 className="font-semibold">Gift Advisor</h2>
        <div className="flex items-center space-x-2">
          {persona !== 'unknown' && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              {getPersonaDisplayName(persona)}
            </span>
          )}
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
        <MessagesList 
          messages={messages}
          isTyping={isTyping}
          onOptionSelect={handleOptionSelect}
        />
        
        {showSuggestions && <ProductSuggestionsList />}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t bg-card">
        {showTextInput && (
          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            isTyping={isTyping}
            handleSubmit={handleSubmit}
          />
        )}
        
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
