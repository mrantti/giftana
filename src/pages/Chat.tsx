
import React from 'react';
import { motion } from 'framer-motion';
import ChatInterface from '@/components/chat/ChatInterface';
import { useAuth } from '@/context/AuthContext';

const Chat = () => {
  const { user } = useAuth();
  
  return (
    <motion.div 
      className="flex flex-col flex-1 h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-1 h-full">
        <ChatInterface />
      </div>
      
      {!user && (
        <div className="bg-primary/5 p-4 text-center border-t">
          <p className="text-sm text-muted-foreground">
            <a href="/login" className="text-primary hover:underline">Sign in</a> to save your conversations and get personalized recommendations.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Chat;
