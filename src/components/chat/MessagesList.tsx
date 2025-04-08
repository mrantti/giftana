
import React, { useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ChatMessage from './ChatMessage';
import MessageChoices from './MessageChoices';
import { Message } from '@/types/chat';
import { getPersonaDescription, PersonaType } from './chatFlowConfig';

interface MessagesListProps {
  messages: Message[];
  isTyping: boolean;
  onOptionSelect: (choiceId: string, nextStep: string) => void;
  persona: PersonaType;
  showPersonaInfo: boolean;
}

const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  isTyping,
  onOptionSelect,
  persona,
  showPersonaInfo
}) => {
  // Create a ref that doesn't cause scrolling on every render
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Only scroll when a new message is added or typing status changes
  useEffect(() => {
    if (messagesEndRef.current) {
      // Use smooth scrolling with a timeout to prevent jarring movements
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          block: 'end',
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [messages.length, isTyping]);

  return (
    <div className="space-y-4">
      {/* Persona insight message - only shown for sentimental persona and when appropriate */}
      {showPersonaInfo && persona !== 'unknown' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-primary/10 p-3 rounded-lg mb-4 text-sm"
        >
          <p className="font-medium">Gift Advisor Insight:</p>
          <p>{getPersonaDescription(persona)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Our AI has adapted to your preferences
          </p>
        </motion.div>
      )}
      
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div 
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChatMessage
              content={message.content}
              type={message.type}
              timestamp={message.timestamp}
            />
            
            {/* Show choices only for the most recent bot message */}
            {message.choices && 
              message.choices.length > 0 && 
              message.type === 'bot' && 
              index === messages.length - 1 && (
                <MessageChoices 
                  choices={message.choices} 
                  onSelect={onOptionSelect} 
                />
              )}
          </motion.div>
        ))}
        
        {/* Only show typing indicator when actually typing and no new message has been added */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChatMessage
              content=""
              type="bot"
              isLoading={true}
            />
          </motion.div>
        )}
        
        <div ref={messagesEndRef} className="h-4 w-full" />
      </AnimatePresence>
    </div>
  );
};

export default MessagesList;
