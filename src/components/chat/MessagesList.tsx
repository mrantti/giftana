
import React, { useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import MessageChoices from './MessageChoices';
import { Message } from '@/hooks/use-chat-state';

interface MessagesListProps {
  messages: Message[];
  isTyping: boolean;
  onOptionSelect: (choiceId: string, nextStep: string) => void;
}

const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  isTyping,
  onOptionSelect
}) => {
  // Create a ref that doesn't cause scrolling on every render
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Only scroll when a new message is added or typing status changes
  useEffect(() => {
    if (messagesEndRef.current) {
      // Use scrollIntoView with behavior: 'auto' to prevent jumpy scrolling
      messagesEndRef.current.scrollIntoView({ block: 'nearest', behavior: 'auto' });
    }
  }, [messages.length, isTyping]);

  return (
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
      
      <div ref={messagesEndRef} className="h-0" />
    </AnimatePresence>
  );
};

export default MessagesList;
