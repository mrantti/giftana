
import React from 'react';
import { SendHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  isTyping: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  setInputValue,
  isTyping,
  handleSubmit
}) => {
  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <div className="relative flex-1">
        <Input
          placeholder="Or type a custom request..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="pr-10"
          name="chatInput"
        />
        {inputValue && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => setInputValue('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button type="submit" disabled={!inputValue.trim() || isTyping}>
        <SendHorizontal className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default ChatInput;
