
import React from 'react';
import { motion } from 'framer-motion';
import ChatInterface from '@/components/chat/ChatInterface';

const Chat = () => {
  return (
    <motion.div 
      className="flex flex-col flex-1 h-full max-w-4xl mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-1 h-full overflow-hidden">
        <ChatInterface />
      </div>
    </motion.div>
  );
};

export default Chat;
