
import React from 'react';
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
    </AnimatePresence>
  );
};

export default MessagesList;
