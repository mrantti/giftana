
import React from 'react';
import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MessageType = 'user' | 'bot';

interface ChatMessageProps {
  content: string;
  type: MessageType;
  isLoading?: boolean;
  timestamp?: Date | string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  type,
  isLoading = false,
  timestamp = new Date(),
}) => {
  const isUser = type === 'user';
  
  // Ensure timestamp is a Date object
  const messageTime = timestamp instanceof Date ? timestamp : new Date(timestamp);
  
  // Format the time using a safe approach with error handling
  const formattedTime = (() => {
    try {
      return messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return ''; // Fallback to empty string if formatting fails
    }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "flex items-start max-w-[80%] md:max-w-[70%]",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <div className={cn(
          "flex items-center justify-center rounded-full h-8 w-8 mt-1",
          isUser ? "bg-primary text-white ml-2" : "bg-secondary text-primary mr-2"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>
        
        <div className={cn(
          "rounded-2xl px-4 py-3",
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : "bg-secondary text-secondary-foreground rounded-tl-none"
        )}>
          {isLoading ? (
            <div className="flex space-x-1 justify-center items-center py-2 px-4">
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
          ) : (
            <div className="whitespace-pre-line">{content}</div>
          )}
          
          {/* Only show timestamp for non-loading messages */}
          {!isLoading && (
            <div className={cn(
              "text-xs mt-1 opacity-70",
              isUser ? "text-right" : "text-left"
            )}>
              {formattedTime}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
