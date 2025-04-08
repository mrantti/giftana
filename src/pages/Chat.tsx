
import React from 'react';
import { motion } from 'framer-motion';
import ChatInterface from '@/components/chat/ChatInterface';

const Chat = () => {
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
    </motion.div>
  );
};

export default Chat;
