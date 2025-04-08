
import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Server, Activity, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatState } from '@/hooks/use-chat-state';
import MessagesList from './MessagesList';
import ProductSuggestionsList from './ProductSuggestionsList';
import ChatInput from './ChatInput';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PersonaType, getPersonaDescription } from './chatFlowConfig';

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
    persona,
    metrics,
    systemHealth
  } = useChatState();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showPersonaInfo, setShowPersonaInfo] = useState(false);
  
  // Show persona info when the persona is determined
  useEffect(() => {
    if (persona !== 'unknown') {
      setShowPersonaInfo(true);
    }
  }, [persona]);

  // Helper function to get persona display name
  const getPersonaDisplayName = (personaType: PersonaType): string => {
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

  // Get persona icon
  const getPersonaIcon = (personaType: PersonaType) => {
    switch (personaType) {
      case 'busy_professional':
        return '⏱️';
      case 'last_minute':
        return '🏃';
      case 'sentimental':
        return '❤️';
      case 'corporate':
        return '💼';
      case 'budget_conscious':
        return '💰';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-card border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">Gift Advisor</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-1 ${systemHealth.status === 'healthy' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                  <Server className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <div className="text-xs">
                  <p>System Status: {systemHealth.status}</p>
                  <p>API Latency: {systemHealth.latency}</p>
                  <p>Model Latency: {systemHealth.modelLatency}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center space-x-2">
          {persona !== 'unknown' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full flex items-center gap-1 transition-all hover:bg-muted/80 cursor-default">
                    <span>{getPersonaIcon(persona)}</span>
                    <span>{getPersonaDisplayName(persona)}</span>
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <div className="text-xs space-y-1">
                    <p className="font-medium">{getPersonaDisplayName(persona)}</p>
                    <p>{getPersonaDescription(persona)}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
          persona={persona}
          showPersonaInfo={showPersonaInfo}
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
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 mb-1.5">
              <Activity className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Response time: {metrics.responseTime.toFixed(1)}s | Messages: {metrics.messageCount}
              </span>
            </div>
            <span className="text-xs text-muted-foreground text-center max-w-md">
              As an Amazon Associate / Etsy Affiliate, we may earn from qualifying purchases.
              <a href="/privacy" className="underline underline-offset-2 ml-1 text-primary">
                Learn more
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
