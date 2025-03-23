
import React, { useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ChatMessage from './ChatMessage';
import MessageChoices from './MessageChoices';
import { Message } from '@/hooks/use-chat-state';
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
        </motion.div>
      )}
      
      <AnimatePresence>
        {messages.map((message) => (
          <div key={message.id}>
            <ChatMessage
              content={message.content}
              type={message.type}
              timestamp={message.timestamp}
            />
            
            {message.choices && message.choices.length > 0 && message.type === 'bot' && (
              <MessageChoices 
                choices={message.choices} 
                onSelect={onOptionSelect} 
              />
            )}
          </div>
        ))}
        
        {isTyping && (
          <ChatMessage
            content=""
            type="bot"
            isLoading={true}
          />
        )}
        
        <div ref={messagesEndRef} className="h-4 w-full" />
      </AnimatePresence>
    </div>
  );
};

export default MessagesList;
