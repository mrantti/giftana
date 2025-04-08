
import { Message } from '@/types/chat';
import { chatFlow } from '../config/chat-flow-config';

// Welcome messages based on the chat flow
export const getWelcomeMessages = (): Message[] => [
  {
    id: 'welcome-1',
    content: chatFlow.welcome.message,
    type: 'bot' as const,
    timestamp: new Date(),
    choices: chatFlow.welcome.choices
  }
];
