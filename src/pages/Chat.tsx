
import React from 'react';
import { motion } from 'framer-motion';
import ChatInterface from '@/components/chat/ChatInterface';
import { useAuth } from '@/context/AuthContext';
import { Shield, Server } from 'lucide-react';

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
          <div className="flex justify-center items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-primary" />
            <p className="text-sm text-muted-foreground">
              <a href="/login" className="text-primary hover:underline">Sign in</a> to save your conversations and get personalized recommendations.
            </p>
          </div>
          <div className="flex justify-center items-center gap-2">
            <Server className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Powered by advanced AI infrastructure with 99.9% uptime
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Chat;
