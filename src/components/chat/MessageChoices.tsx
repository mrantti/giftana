
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChatChoice } from './chatFlowConfig';

interface MessageChoicesProps {
  choices: ChatChoice[];
  onSelect: (choiceId: string, nextStep: string) => void;
}

const MessageChoices: React.FC<MessageChoicesProps> = ({ choices, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="flex flex-wrap gap-2 mb-4 ml-10"
    >
      {choices.map((choice) => (
        <Button
          key={choice.id}
          variant="secondary"
          className="shadow-sm"
          onClick={() => onSelect(choice.id, choice.nextStep)}
        >
          {choice.text}
        </Button>
      ))}
    </motion.div>
  );
};

export default MessageChoices;
